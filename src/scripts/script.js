"use strict";

import css_ from "../css/styles.css";
import { EventDelegator, getTargetId } from "./olooEvent";
import { SubscribersDelegator } from "./olooObserver";
import { ElementDelegator, initElemObjects } from "./olooElem";

const $ = require("jquery");

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

myBase.main = function main(id) {
  console.log(id);
  const self = myApp.obj[id];

  const user = "ESL_SC2";
  getTwitch(user);
};

function getTwitch(user) {
  const stream = `https://wind-bow.glitch.me/twitch-api/streams/${user}?callback=?`;
  const channel = `https://wind-bow.glitch.me/twitch-api/channels/${user}?callback=?`;

  $.getJSON(channel, channelData => {
    $.getJSON(stream, streamData => {
      getData(channelData, streamData);
    });
  });
}

function getData(cd, sd) {
  const { name, url, logo } = cd;
  let userstatus;
  let game;
  let status;

  if (sd.stream === null) {
    userstatus = "offline";
  } else {
    userstatus = "online";
    game = sd.stream.game;
    status = `: ${sd.stream.channel.status}`;
  }
  displayFeed(name, url, logo, userstatus, game, status);
}

function displayFeed(name, url, logo, userstatus, game, status) {
  const getFeed = FeedDelegator();

  getFeed.create(name, userstatus, name, status);

  const feeds = document.getElementById("feeds");

  feeds.appendChild(getFeed.feed);
}

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
