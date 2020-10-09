import { Component, createElement } from "./framework.js";
import { Carousel } from "./carousel.js";
import { Animation, Timeline } from "./animation.js";

let d = [
  {
    img: "http://localhost:8080/assets/1.jpg",
    url: "https://time.geekbang.org",
  },
  {
    img: "http://localhost:8080/assets/2.jpg",
    url: "https://time.geekbang.org",
  },
  {
    img: "http://localhost:8080/assets/3.jpg",
    url: "https://time.geekbang.org",
  },
  {
    img: "http://localhost:8080/assets/4.jpg",
    url: "https://time.geekbang.org",
  },
];
let a = (
  <Carousel
    src={d}
    onChange={(event) => console.log(event.detail.position)}
    onClick={(event) => (window.location.href = event.detail.data.url)}
  />
);
a.mountTo(document.body);
