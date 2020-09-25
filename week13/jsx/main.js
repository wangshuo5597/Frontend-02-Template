import { Component, createElement } from "./framework.js";
import { Carousel } from "./carousel.js";
import { Animation, Timeline } from "./animation.js";

let d = [
  "http://pic-bucket.ws.126.net/photo/0001/2020-09-17/FMNIIOIT56NT0001NOS.jpg",
  "http://pic-bucket.ws.126.net/photo/0001/2020-09-17/FMNIIOIU56NT0001NOS.jpg",
  "http://pic-bucket.ws.126.net/photo/0001/2020-09-17/FMNIIOIV56NT0001NOS.jpg",
  "http://pic-bucket.ws.126.net/photo/0001/2020-09-17/FMNIIOJ056NT0001NOS.jpg",
];
let a = <Carousel src={d} />;
a.mountTo(document.body);
let tl = new Timeline();

window.tl = tl;
window.animation = new Animation(
  {
    set a(v) {
      console.log(v);
    },
  },
  "a",
  0,
  100,
  1000,
  null
);
tl.start();
