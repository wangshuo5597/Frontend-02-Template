import { Component, createElement } from "./framework.js";
class Carousel extends Component {
  constructor() {
    super();
    this.attributes = Object.create(null);
    console.log("constructor .attributes.src", this.attributes);
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
  render() {
    this.root = document.createElement("div");
    this.root.classList.add("carousel");
    if (this.attributes) {
      for (let record of this.attributes.src) {
        let child = document.createElement("div");
        child.style.backgroundImage = `url('${record}')`;

        this.root.appendChild(child);
      }
      let position = 0;
      this.root.addEventListener("mousedown", (event) => {
        let children = this.root.children;
        let startX = event.clientX;
        let move = (event) => {
          let x = event.clientX - startX;
          let current = position - Math.round((x - (x % 400)) / 400);
          console.log("current", current);
          for (let offset of [-1, 0, 1]) {
            let pos = current + offset;
            pos = (pos + children.length) % children.length;
            console.log("pos", pos);
            children[pos].style.transition = "none";
            children[pos].style.transform = `translateX(${
              -pos * 400 + offset * 400 + (x % 400)
            }px)`;
          }
        };
        let up = (event) => {
          document.removeEventListener("mousemove", move);
          document.removeEventListener("mouseup", up);
          let x = event.clientX - startX;
          position = position - Math.round(x / 400);
          for (let offset of [
            0,
            -Math.sign(Math.round(x / 400) - x + 200 * Math.sign(x)),
          ]) {
            let pos = position + offset;
            pos = (pos + children.length) % children.length;
            children[pos].style.transition = "";
            children[pos].style.transform = `translateX(${
              -pos * 400 + offset * 400
            }px)`;
          }
        };
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", up);
      });

      /*
      setInterval(() => {
        let children = this.root.children;
        let nextIndex = (currentIndex + 1) % children.length;
        let current = children[currentIndex];
        let next = children[nextIndex];
        next.style.transition = "none";
        next.style.transform = `translateX(${100 - nextIndex * 100}%)`;
        setTimeout(() => {
          next.style.transition = "";
          current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
          next.style.transform = `translateX(${-nextIndex * 100}%)`;
          currentIndex = nextIndex;
        }, 16);
      }, 3000);
      */
    }
    return this.root;
  }
  mountTo(parent) {
    parent.appendChild(this.render());
  }
}

let d = [
  "http://pic-bucket.ws.126.net/photo/0001/2020-09-17/FMNIIOIT56NT0001NOS.jpg",
  "http://pic-bucket.ws.126.net/photo/0001/2020-09-17/FMNIIOIU56NT0001NOS.jpg",
  "http://pic-bucket.ws.126.net/photo/0001/2020-09-17/FMNIIOIV56NT0001NOS.jpg",
  "http://pic-bucket.ws.126.net/photo/0001/2020-09-17/FMNIIOJ056NT0001NOS.jpg",
];
let a = <Carousel src={d} />;
a.mountTo(document.body);
