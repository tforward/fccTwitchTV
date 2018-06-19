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

  const users = [
    "ESL_SC2",
    "OgamingSC2",
    "cretetion",
    "freecodecamp",
    "storbeck",
    "habathcx",
    "RobotCaleb",
    "noobs2ninjas"
  ];

  users.forEach(user => getTwitch(user));

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

  Feed.create = function create(id, theStatus, thetitle, game, theDesc, url, logo) {
    this.feed = document.createDocumentFragment();

    this.feedId = id;
    this.status = theStatus;

    const feedMain = document.createElement("div");
    feedMain.id = id;
    feedMain.className = `feed ${this.status}`;
    this.feed.appendChild(feedMain);

    const icon = document.createElement("a");
    icon.className = "feed-icon";
    icon.href = `${url}`;
    icon.style.backgroundImage = `url(${logo})`;
    feedMain.appendChild(icon);

    const titleLink = document.createElement("a");
    titleLink.className = "feed-title";
    titleLink.href = `${url}`;
    feedMain.appendChild(titleLink);

    const title = document.createElement("div");
    title.textContent = thetitle;
    titleLink.appendChild(title);

    const descLink = document.createElement("a");
    descLink.className = "feed-desc";
    descLink.href = `${url}`;
    feedMain.appendChild(descLink);

    const desc = document.createElement("div");
    desc.textContent = "Offline";
    if (this.status === "online") {
      desc.textContent = `${game}: ${theDesc}`;
    }
    descLink.appendChild(desc);
  };
  return Feed;
}

myBase.main = function main(id) {
  displayFilter(id);
};

function displayFilter(id) {
  const feeds = document.getElementById("feeds");
  const feedsOffline = document.getElementById("feedsOffline");

  switch (id) {
    case "btnAll":
      feeds.classList.remove("hidden");
      feedsOffline.classList.remove("hidden");
      break;
    case "btnOnline":
      feeds.classList.remove("hidden");
      feedsOffline.classList.add("hidden");
      break;
    case "btnOffline":
      feeds.classList.add("hidden");
      feedsOffline.classList.remove("hidden");
      break;
    default:
      break;
  }
}

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
  let streamStatus;
  let game;
  let desc;

  if (sd.stream === null) {
    streamStatus = "offline";
  } else {
    streamStatus = "online";
    game = sd.stream.game;
    desc = `: ${sd.stream.channel.status}`;
  }
  displayFeed(name, url, logo, streamStatus, game, desc);
}

function displayFeed(name, url, logo, streamStatus, game, desc) {
  const getFeed = FeedDelegator();

  getFeed.create(name, streamStatus, name, game, desc, url, logo);

  const feeds = document.getElementById("feeds");
  const feedsOffline = document.getElementById("feedsOffline");

  if (streamStatus === "online") {
    feeds.appendChild(getFeed.feed);
  } else {
    feedsOffline.appendChild(getFeed.feed);
  }
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
