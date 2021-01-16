import Discord from "discord.js";
const client = new Discord.Client();
// TODO : Shift token to env file
client.login("Nzk5ODYwMzE2NzQxMTczMjQ4.YAJt-A.vPKJ79KkMzfNFjQ792kQEk4WOfk");

import handleCommand from "./command.js";

client.on("ready", () => {
  // Bot is online
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", handleCommand);
