import { Component } from "./framework.js";
import { enableGesture } from "./gesture.js";
import { Timeline, Animation } from "./animation.js";
import { ease } from "./ease.js";

export class Carousel extends Component {
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
      enableGesture(this.root);
      let timeline = new Timeline();
      timeline.start();
      let handler = null;
      let children = this.root.children;
      let clientWidth = 400;
      let position = 0;

      let t = 0;

      let ax = 0;

      this.root.addEventListener("start", (event) => {
        console.log("pause");
        timeline.pause();
        clearInterval(handler);
        let progress = (Date.now() - t) / 1500;
        ax = ease(progress) * clientWidth - clientWidth;
      });
      this.root.addEventListener("pan", (event) => {
        let x = event.clientX - event.startX - ax;
        let current =
          position - Math.round((x - (x % clientWidth)) / clientWidth);
        for (let offset of [-1, 0, 1]) {
          let pos = current + offset;
          pos = ((pos % children.length) + children.length) % children.length;
          console.log("pos", pos);
          children[pos].style.transition = "none";
          children[pos].style.transform = `translateX(${
            -pos * clientWidth + offset * clientWidth + (x % clientWidth)
          }px)`;
        }
      });
      this.root.addEventListener("panend", (event) => {
        timeline.reset();
        timeline.start();
        handler = setInterval(nextPicture, 3000);
        let x = event.clientX - event.startX - ax;
        let current =
          position - Math.round((x - (x % clientWidth)) / clientWidth);
        let direction = Math.round((x % clientWidth) / clientWidth);
        for (let offset of [-1, 0, 1]) {
          let pos = current + offset;
          pos = ((pos % children.length) + children.length) % children.length;
          timeline.add(
            new Animation(
              children[pos].style,
              "transform",
              -pos * clientWidth + offset * clientWidth + (x % clientWidth),
              -pos * clientWidth +
                offset * clientWidth +
                direction * clientWidth,
              500,
              0,
              ease,
              (v) => `translateX(${v}px)`
            )
          );
        }
        position = position - (x - (x % clientWidth)) / clientWidth - direction;
        position =
          ((position % children.length) + children.length) % children.length;
      });
      let nextPicture = () => {
        let children = this.root.children;
        let nextIndex = (position + 1) % children.length;
        let current = children[position];
        let next = children[nextIndex];

        //next.style.transition = "none";
        //next.style.transform = `translateX(${clientWidth - nextIndex * clientWidth}px)`;

        timeline.add(
          new Animation(
            current.style,
            "transform",
            -position * clientWidth,
            -clientWidth - position * clientWidth,
            500,
            0,
            ease,
            (v) => `translateX(${v}px)`
          )
        );
        timeline.add(
          new Animation(
            next.style,
            "transform",
            clientWidth - nextIndex * clientWidth,
            -nextIndex * clientWidth,
            500,
            0,
            ease,
            (v) => `translateX(${v}px)`
          )
        );
        position = nextIndex;
      };
      handler = setInterval(nextPicture, 3000);
      /*
      this.root.addEventListener("mousedown", (event) => {
        let children = this.root.children;
        let startX = event.clientX;
        let move = (event) => {
          let x = event.clientX - startX;
          let current = position - Math.round((x - (x % clientWidth)) / clientWidth);
          console.log("current", current);
          for (let offset of [-1, 0, 1]) {
            let pos = current + offset;
            pos = (pos + children.length) % children.length;
            console.log("pos", pos);
            children[pos].style.transition = "none";
            children[pos].style.transform = `translateX(${
              -pos * clientWidth + offset * clientWidth + (x % clientWidth)
            }px)`;
          }
        };
        let up = (event) => {
          document.removeEventListener("mousemove", move);
          document.removeEventListener("mouseup", up);
          let x = event.clientX - startX;
          position = position - Math.round(x / clientWidth);
          for (let offset of [
            0,
            -Math.sign(Math.round(x / clientWidth) - x + 200 * Math.sign(x)),
          ]) {
            let pos = position + offset;
            pos = (pos + children.length) % children.length;
            children[pos].style.transition = "";
            children[pos].style.transform = `translateX(${
              -pos * clientWidth + offset * clientWidth
            }px)`;
          }
        };
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", up);
      });

      
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
