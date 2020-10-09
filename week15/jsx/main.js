import { Component, createElement } from "./framework.js";
import { Carousel } from "./Carousel.js";
import { Button } from "./Button.js";
import { List } from "./List.js";
let d = [
  {
    img: "http://localhost:8080/assets/1.jpg",
    url: "https://time.geekbang.org",
    title: "1狗",
  },
  {
    img: "http://localhost:8080/assets/2.jpg",
    url: "https://time.geekbang.org",
    title: "2狗",
  },
  {
    img: "http://localhost:8080/assets/3.jpg",
    url: "https://time.geekbang.org",
    title: "3狗",
  },
  {
    img: "http://localhost:8080/assets/4.jpg",
    url: "https://time.geekbang.org",
    title: "4狗",
  },
];
/*
let a = (
  <Carousel
    src={d}
    onChange={(event) => console.log(event.detail.position)}
    onClick={(event) => (window.location.href = event.detail.data.url)}
  />
);
*/
let a = (
  <List data={d}>
    {(record) => (
      <div>
        <img src={record.img}></img>
        <a href={record.url}>{record.title}</a>
      </div>
    )}
  </List>
);
a.mountTo(document.body);
