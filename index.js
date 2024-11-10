import "dotenv/config";
import { Client } from "tmi.js";

const client = new Client({
  options: { debug: true },
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN,
  },
  channels: process.env.CHANNELS.split(","),
});

client.connect();

client.on("message", async (channel, tags, message, self) => {
  if (self) return;
  if (message.toLowerCase().startsWith("!crosspost ")) {
    let msgToSend = `${tags.username} crossposted from ${channel}: ${message.substring(message.indexOf(" ") + 1)}`;
    if (msgToSend.length > 499) {
      msgToSend = msgToSend.substring(0, 499);
    }
    for (let envChannel of process.env.CHANNELS.split(",")) {
      if (channel.toLowerCase().replace("#", "") == envChannel.toLowerCase()) {
        return; // Ignore the same channel
      }
      client.say(`#${channel}`, msgToSend);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
});
