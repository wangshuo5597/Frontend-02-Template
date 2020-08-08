### first-letter 与 first-line 对布局属性支持的差异

#### 同为文本选择相关的伪类,first-letter 支持布局相关属性，而 first-line 不支持，为什么 css 标准要这样设计？

#### 先看看标准里对两个伪类的说明，参考 https://drafts.csswg.org/selectors-3/#first-line (first-letter 在同一页就不贴了)

#### first-line 的定义中，有一段专门解释 first-line 匹配规则，这里贴一下它的标题

```
7.1.1. First formatted line definition in CSS
......
......
 it refers to the first formatted line of that container.
......
......
```

#### 这里的 *first formatted line*被斜体加粗再一次强调。意即一个容器内第一行格式化后的文本。

#### 所谓格式化后的内容，我的理解是:浏览器结合视口， CSS 树及 DOM 树计算得出的图像内容。

#### 再看看标准中给出的 first-letter 的定义，

```
The ::first-letter pseudo-element represents the first letter of an element, if it is not preceded by any other content (such as images or inline tables) on its line
......
......
The first letter must occur on the first formatted line
......
......
```

#### first-letter 和 first-line 的结构关系

```
<P>
<P::first-line>
<P::first-letter>
S
</P::first-letter>ome text that
</P::first-line>
ends up on two lines
</P>
```

#### 从上述标准可以看出，first-letter 和 first-line 都是在浏览器布局完成后进行的二次计算。

#### 从浏览器实现的角度看，如果我们改变 first-letter（S） 的布局属性触发浏览器重排, 重排后 first-letter 依然是 S。那么如果 first-line 也支持布局属性改变会怎么样呢？例如 float，重排后，first formatted line 的内容大概率会改变，那么 first-line 的二次计算会再次触发重排。

#### 结论，first-line 支持 float 之类的属性会导致浏览器预期外的重排甚至一些边缘情况里会有 BUG 出现。所以 CSS 标准限定了 first-line 不支持布局相关属性，而 first-letter 由于副作用可控就没有这个限制了。
