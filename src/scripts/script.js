"use strict";

import css_ from "../css/styles.css";
import { EventDelegator, getTargetId } from "./olooEvent";
import { SubscribersDelegator } from "./olooObserver";
import { ElementDelegator, initElemObjects } from "./olooElem";

const myBase = Object.create(null);
const myApp = SubscribersDelegator();

myBase.initApplication = function init() {
  myApp.init();

  const eventSandbox = EventDelegator();
  eventSandbox.initEvent("eventSandbox", "click", { tags: ["BUTTON", "DIV"] });
  eventSandbox.addEvent(eventController);
  addElements();
  // console.log(myApp.btnAll);

  function eventController(args, e) {
    const id = getTargetId(e, args.tags);
    if (id !== undefined) {
      myBase.main(id);
    }
  }
};

function addElements() {
  const btns = ["btnAll", "btnOnline", "btnOffline"];
  const buttons = initElemObjects(btns, ElementDelegator);

  const getFeed = FeedDelegator();

  getFeed.create("test", "online", "hello", "there");

  const feeds = document.getElementById("feeds");

  feeds.appendChild(getFeed.feed);

  myApp.addObjs(buttons);
}

function FeedDelegator(proto = null) {
  const Feed = Object.create(proto);

  Feed.create = function create(id, theStatus, thetitle, thedesc) {
    this.feed = document.createDocumentFragment();

    this.feedId = id;
    this.status = theStatus;

    const feedDiv = document.createElement("div");
    feedDiv.id = id;
    feedDiv.className = `feed ${this.status}`;
    this.feed.appendChild(feedDiv);

    const icon = document.createElement("div");
    icon.className = "feed-icon";
    feedDiv.appendChild(icon);

    const title = document.createElement("div");
    title.className = "feed-title";
    title.textContent = thetitle;
    feedDiv.appendChild(title);

    const desc = document.createElement("div");
    desc.className = "feed-desc";
    desc.textContent = thedesc;
    feedDiv.appendChild(desc);
  };
  return Feed;
}

// function ButtonDelegator(proto = null) {
//   const Button = Object.create(proto);

//   Button.setup = function setup() {
//     this.toggle = 0;
//   };
//   return Button;
// }

myBase.main = function main(id) {
  console.log(id);
  const self = myApp.obj[id];
};

// ======================================================================
// Handler when the DOM is fully loaded
document.onreadystatechange = function onreadystatechange() {
  if (document.readyState === "complete") {
    if (process.env.NODE_ENV !== "production") {
      console.log("*** RUNNING IN DEV MODE! ***");
    }
    myBase.initApplication();
  } else {
    // Do something during loading (optional)
  }
};
// ======================================================================
