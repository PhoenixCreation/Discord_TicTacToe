import dotenv from "dotenv";
dotenv.config();

import Discord from "discord.js";
const client = new Discord.Client();
client.login(process.env.DISCORD_TOKEN);

import handleCommand from "./command.js";

client.on("ready", () => {
  // Bot is online
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(
    `Number of servers the bot is in: ${client.guilds.cache.array().length}`
  );
  client.user
    .setActivity(
      `People fight with each other in ${
        client.guilds.cache.array().length
      } servers.`,
      { type: "WATCHING" }
    )
    .then((presence) =>
      console.log(`Activity set to ${presence.activities[0].name}`)
    )
    .catch(console.error);
});

client.on("message", handleCommand);
