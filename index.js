import dotenv from "dotenv";
dotenv.config();

import Discord from "discord.js";
const client = new Discord.Client();
client.login(process.env.DISCORD_TOKEN);

import handleCommand from "./command.js";

client.on("ready", () => {
  // Bot is online
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", handleCommand);
