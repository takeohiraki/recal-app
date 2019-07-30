var Bot = require("slackbots");
//require("dotenv").config();
var keys = require("./keys.js");

// settings
var settings = {
  token: keys.slack.secret,
  name: "noodle-cal"
};

var channel = "leads";
var bot = new Bot(settings);

bot.on("start", function() {
  bar.postMessageToChannel(
    channel,
    "Hello Channel. I am successfully connected"
  );
});

bot.on("message", function() {
  if (message.type === "message" && Boolean(message.text)) {
    console.log(message.channel);
    if (typeof message.channel === "string" && message.channel[0] === "C") {
      console.log(message.text.toLowerCase());
    }
  }
});
