import { Component, STATE, ATTRIBUTE } from "./framework.js";
import { enableGesture } from "./gesture.js";
import { Timeline, Animation } from "./animation.js";
import { ease } from "./ease.js";

export { STATE, ATTRIBUTE } from "./framework.js";

export class Carousel extends Component {
  constructor() {
    super();
  }

  render() {
    console.log("render");
    this.root = document.createElement("div");
    this.root.classList.add("carousel");
    if (this[ATTRIBUTE]) {
      for (let record of this[ATTRIBUTE].src) {
        let child = document.createElement("div");
        child.style.backgroundImage = `url('${record.img}')`;

        this.root.appendChild(child);
      }
      enableGesture(this.root);
      let timeline = new Timeline();
      timeline.start();
      let handler = null;
      let children = this.root.children;
      let clientWidth = 500;
      this[STATE].position = 0;
      let t = 0;

      let ax = 0;

      this.root.addEventListener("start", (event) => {
        timeline.pause();
        clearInterval(handler);
        if (t > 0) {
          let progress = (Date.now() - t) / 500;
          ax = ease(progress) * clientWidth - clientWidth;
        }
      });
      this.root.addEventListener("pan", (event) => {
        let x = event.clientX - event.startX - ax;
        let current =
          this[STATE].position - (x - (x % clientWidth)) / clientWidth;
        for (let offset of [-1, 0, 1]) {
          let pos = current + offset;
          pos = ((pos % children.length) + children.length) % children.length;
          children[pos].style.transition = "none";
          children[pos].style.transform = `translateX(${
            -pos * clientWidth + offset * clientWidth + (x % clientWidth)
          }px)`;
        }
      });
      this.root.addEventListener("pressend", (event) => {
        timeline.reset();
        timeline.start();
        t = 0;
        clearInterval(handler);
        handler = setInterval(nextPicture, 3000);
      });
      this.root.addEventListener("tap", (event) => {
        this.triggerEvent("click", {
          data: this[ATTRIBUTE].src[this[STATE].position],
          position: this[STATE].position,
        });
      });
      this.root.addEventListener("end", (event) => {
        timeline.reset();
        timeline.start();
        t = 0;
        clearInterval(handler);
        handler = setInterval(nextPicture, 3000);

        let x = event.clientX - event.startX - ax;
        let current =
          this[STATE].position -
          Math.round((x - (x % clientWidth)) / clientWidth);
        let direction = Math.round((x % clientWidth) / clientWidth);

        if (event.isFlick) {
          if (event.velocity < 0) {
            direction = Math.ceil((x % clientWidth) / clientWidth);
          } else {
            direction = Math.floor((x % clientWidth) / clientWidth);
          }
        }

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
        this[STATE].position =
          this[STATE].position -
          (x - (x % clientWidth)) / clientWidth -
          direction;
        this[STATE].position =
          ((this[STATE].position % children.length) + children.length) %
          children.length;
        this.triggerEvent("Change", { position: this[STATE].position });
      });
      let nextPicture = () => {
        let children = this.root.children;
        let nextIndex = (this[STATE].position + 1) % children.length;
        let current = children[this[STATE].position];
        let next = children[nextIndex];
        t = Date.now();
        timeline.add(
          new Animation(
            current.style,
            "transform",
            -this[STATE].position * clientWidth,
            -clientWidth - this[STATE].position * clientWidth,
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

        this[STATE].position = nextIndex;
        this.triggerEvent("change", { position: this[STATE].position });
      };
      handler = setInterval(nextPicture, 3000);
    }
    return this.root;
  }
}
