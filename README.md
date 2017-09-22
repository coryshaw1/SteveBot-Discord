# SteveBot-Discord [![Build Status](https://travis-ci.org/coryshaw1/SteveBot-Discord.svg?branch=master)](https://travis-ci.org/coryshaw1/SteveBot-Discord) [![Dependency Status](https://david-dm.org/coryshaw1/SteveBot-Discord.svg)](https://david-dm.org/coryshaw1/SteveBot-Discord) [![License](https://img.shields.io/github/license/coryshaw1/stevebot-discord.svg)](https://github.com/coryshaw1/SteveBot-Discord/blob/master/LICENSE)
A Dubtrack Bot using DubAPI

[Adding commands](#commands)
[List of commands](#commandslist)

## Requirements
1. Node

## Installation

*Note* - Windows 10 users may need to `npm install --global --production windows-build-tools` first

1. `npm install`
2. Create a `settings.json` file using a copy of `example-settings.json`, replacing each variable with your credentials
3. `node index`

## Thanks
* [izy521/discord.io](https://github.com/izy521/discord.io) by [@izy521](https://github.com/izy521/discord.io)

# [Adding Commands](#commands)

1. Simply add a `.js` file anywhere inside the `commands` directory (sub-directories are supported). The name of the file will be used as the command, so `ping.js` will add a `ping` command. By default `!ping`, which is based on the `COMMAND_PREFIX` setting that defaults to `!`.
2. The `.js` just needs to export a single function that takes in 2 parameters, preferrably `bot` and `data`
```js
module.exports = function (bot, data) {
};
```
* `bot` is the discord.io bot object, used for controlling the bot. Check out the [discord.io docs](https://izy521.gitbooks.io/discord-io/content/) for more info on how to control the bot.
* `data` is the data of chat command. Available properties of `data` are:
```js
data.user //user object of who sent the chat message
data.userID //userID of who sent the chat message
data.channelID //Discord channelID of where the chat message was sent
data.message //Message body of chat message
data.event //Event object of chat message
```
3. Now that we have the necessary objects and information, we can simply make the bot respond to the `!ping` command with a message
```js
module.exports = function (bot, data) {
    bot.sendMessage({
        to: data.channelID,
        message: 'Pong!'
    });
};
```
* We use the `bot` object passed in the parameters to call the `sendMessage` method. Then using the `data` parameter, we're able to send the message back to the same `channelID` where the command came from!

# [Commands List](#commandslist)
Below are the list of commands that have been implemented.
## Categories

### Bot

* **!bot** - Bot responds with "I'm still here"
* **!delete** - Bot deletes their last message
* **!ping** - Bot responds with "Pong!"
* **!pong** - Bot responds with "Ping!"

### Fun
* **!beer** - Show a random beer from BreweryAPI
* **!beer [search term]** - Search for a beer on BreweryAPI
* **!brewery** - Show a random brewery from BreweryAPI
* **!brewery [search term]** - Search for a brewery on BreweryAPI
* **!cage** - Show a random Nicolas Cage picture or gif
* **!cat** - Show a random cat picture or gif
* **!chuck** - Random Chuck Norris joke
* **!coinflip [heads or tails]** - Flips a coin and lets you know if your call was right
* **!dog** - Show a random dog picture or gif
* **!fact** - A random inciteful fact
* **!join** - Join a running raffle
* **!kitten** - Show a random kitten picture or gif
* **!lmgtfy [search term]** - Creates a let me Google that for you link based on your search term
* **!missuniverse** - Having a little fun with Steve
* **!pickup** - Show a random pickup line (warning: extremely cheesey)
* **!steve** - Help the rest of the room enjoy Steve even more
* **!todayfact** - A random inciteful fact about today
* **!todayholiday** - Let's you know if the current day is a holiday and which holiday it is
* **!urban [search term]** - Lookup an urban dictionary definition

### Info
* **!commands** - Basic list of commands

### Twitch
* **!twitch** - List out all added channels and Twitch emote libraries including BetterTTV
* **!twitch [channelName]** - List out all emotes for given channel name if they have been added
* **!twitchadd [channelName]** - Add all emotes for specified Twitch channel name
* **![twitchEmoji]** - Once a Twitch channel has been added with `!twitchadd [channelName]`, you will be able to simply use the emoticon's name as the command. For example: `!sodaG`

Much more to come, and suggestions are welcome! Please add an [issue](https://github.com/coryshaw1/SteveBot-Discord/issues) for any requests or bugs!
