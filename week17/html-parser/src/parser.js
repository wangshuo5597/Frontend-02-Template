const css = require("css");

const EOF = Symbol("EOF");

import { layout } from "./layout.js";
let stack;
let currentToken;
let currentAttribute;
let currentTextNode;
let rules;
function addCSSRules(text) {
  var ast = css.parse(text);
  rules.push(...ast.stylesheet.rules);
}
function match(element, selector) {
  //这里只考虑简单选择器，复杂选择器可以采用正则匹配selector
  if (!selector || !element.attributes) return false;
  if (selector.charAt(0) == "#") {
    var attr = element.attributes.find((attr) => attr.name === "id");
    if (attr && attr.value === selector.replace("#", "")) return true;
  } else if (selector.charAt(0) == ".") {
    var attr = element.attributes.find((attr) => attr.name === "class");
    if (attr && attr.value === selector.replace(".", "")) return true;
  } else {
    if (element.tagName === selector) {
      return true;
    }
  }
  return false;
}
function parseSeletor(selector) {
  var selectorParts = [];
  var rawSelectors = selector.split(" ");
  for (let i = 0; i < rawSelectors.length; i++) {
    let selectorPart = rawSelectors[i];
    let tail = null;
    if (selectorParts.length > 0) {
      tail = selectorParts[selectorParts.length - 1];
    }
    if (tail === null) {
      selectorParts.push(selectorPart);
    } else {
      if (selectorPart.match(/^[+~>:]$|^(\|\|)$/)) {
        tail += " " + selectorPart;
        selectorParts[selectorParts.length - 1] = tail;
      } else if (tail.match(/[+~>:]$|(\|\|)$/)) {
        tail += " " + selectorPart;
        selectorParts[selectorParts.length - 1] = tail;
      } else {
        selectorParts.push(selectorPart);
      }
    }
  }
  return selectorParts;
}
function specificity(selector) {
  var p = [0, 0, 0, 0];
  var selectorParts = parseSeletor(selector);

  for (var part of selectorParts) {
    if (part.charAt(0) == "#") {
      p[1] += 1;
    } else if (part.charAt(0) == ".") {
      p[2] += 1;
    } else {
      p[3] += 1;
    }
    return p;
  }
}
function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) return sp1[0] - sp2[0];
  if (sp1[1] - sp2[1]) return sp1[1] - sp2[1];
  if (sp1[2] - sp2[2]) return sp1[2] - sp2[2];
  return sp1[3] - sp2[3];
}
function computeCSS(element) {
  // 这里用slice是一个复制数组的技巧，reverse是因为从当前元素逐级匹配的
  var elements = stack.slice().reverse();
  elements.push();
  if (!element.computeStyle) element.computedStyle = {};

  for (let rule of rules) {
    var selectorParts = parseSeletor(rule.selectors[0]);
    selectorParts = selectorParts.reverse();
    if (!match(element, selectorParts[0])) continue;
    let matched = false;

    var j = 1;
    for (var i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }
    if (j >= selectorParts.length) matched = true;
    if (matched) {
      var sp = specificity(rule.selectors[0]);
      var computedStyle = element.computedStyle;
      for (var declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {};
        }
        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        } else if (
          compare(computedStyle[declaration.property].specificity, sp) < 0
        ) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        }
      }
      console.log(element.computedStyle);
    }
  }
}

function emit(token) {
  let top = stack[stack.length - 1];
  if (token.type == "startTag") {
    let element = {
      type: "element",
      children: [],
      attributes: [],
    };

    element.tagName = token.tagName;

    for (let p in token) {
      if (p != "type" && p != "tagName") {
        element.attributes.push({
          name: p,
          value: token[p],
        });
      }
    }
    computeCSS(element);
    top.children.push(element);
    element.parent = top;

    if (!token.isSelfClosing) stack.push(element);

    currentTextNode = null;
  } else if (token.type == "endTag") {
    if (top.tagName != token.tagName) {
      throw new Error("Tag start end doesn't match!");
    } else {
      //+++++++++++++遇到style标签是，执行添加CSS规则的操作++++++++++//
      if (top.tagName === "style") {
        addCSSRules(top.children[0].content);
      }
      layout(top);
      stack.pop();
    }
    currentTextNode = null;
  } else if (token.type == "text") {
    if (currentTextNode == null) {
      currentTextNode = {
        type: "text",
        content: "",
      };
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}

function data(c) {
  if (c == "<") {
    return tagOpen;
  } else if (c == EOF) {
    emit({
      type: "EOF",
    });
    return;
  } else {
    emit({
      type: "text",
      content: c,
    });
    return data;
  }
}

function tagOpen(c) {
  if (c == "/") {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "startTag",
      tagName: "",
    };
    return tagName(c);
  } else {
    emit({
      type: "text",
      content: c,
    });
    return data;
  }
}
function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: "",
    };
    return tagName(c);
  } else if (c == ">") {
  } else if (c == EOF) {
  } else {
  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c == "/") {
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c;
    return tagName;
  } else if (c == ">") {
    emit(currentToken);
    return data;
  } else {
    return tagName;
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f]$/)) {
    return beforeAttributeName;
  } else if (c == ">" || c == ">" || c == EOF) {
    return afterAttributeName(c);
  } else if (c == "=") {
  } else {
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}
function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
    return afterAttributeName(c);
  } else if (c == "=") {
    return beforeAttributeValue;
  } else if (c == "\u0000") {
  } else if (c == '"' || c == "'" || c == "<") {
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}
function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
    return beforeAttributeValue;
  } else if (c == '"') {
    return doubleQuotedAttributeValue;
  } else if (c == "'") {
    return singleQuotedAttributeValue;
  } else if (c == ">") {
    return data;
  } else {
    return UnquotedAttributeValue(c);
  }
}
function doubleQuotedAttributeValue(c) {
  if (c == '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c == "\u0000") {
  } else if (c == EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}
function singleQuotedAttributeValue(c) {
  if (c === "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === "\u0000") {
  } else if (c == EOF) {
  } else {
    currentAttribute.value += c;
    return singleQuotedAttributeValue;
  }
}
function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c == "/") {
    return selfClosingStartTag;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == EOF) {
  } else {
    throw new Error('unexpected character "' + c + '"');
  }
}

function UnquotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c == "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == "\u0000") {
  } else if (c == '"' || c == "'" || c == "<" || c == "=" || c == "`") {
  } else if (c == EOF) {
  } else {
    currentAttribute.value += c;
    return UnquotedAttributeValue;
  }
}

function selfClosingStartTag(c) {
  if (c == ">") {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (c == EOF) {
    return;
  } else {
  }
}
function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c == "/") {
    return selfClosingStartTag;
  } else if (c == "=") {
    return beforeAttributeName;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == EOF) {
  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}
export const parseHTML = function (html) {
  stack = [{ type: "document", children: [] }];
  currentToken = null;
  currentAttribute = null;
  currentTextNode = null;
  rules = [];
  let state = data;
  for (let i = 0; i < html.length; i++) {
    let c = html.charAt(i);
    state = state(c);
  }
  state = state(EOF);

  return stack[0];
};
