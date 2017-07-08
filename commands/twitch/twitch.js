var twitch = require(process.cwd() + "/plugins/twitch.js");
var settings = require(process.cwd() + "/settings.json");

module.exports = function(bot, data) {
    if (!data || !data.params || data.params.length < 1) {
        bot.sendMessage({
            to: data.channelID,
            message: "All global emotes, BetterTwitchTV emotes, and all of the following channels have their emotes added:"
        });
        bot.sendMessage({
            to: data.channelID,
            message: twitch.channels.sort().join(", ")
        });
        bot.sendMessage({
            to: data.channelID,
            message: "To find out commands for each channel use: !twitch channelName"
        });
        return;
    }

    //look up by first param after command
    var channelToLookup = data.params[0].toLowerCase();

    var matchingChannel = twitch.channelEmotes.filter(function(c) {
        return c.channel == channelToLookup;
    });

    if (matchingChannel.length == 0)
        return bot.sendMessage({
            to: data.channelID,
            message: "No channel matching '" + channelToLookup + "' found!"
        });

    bot.sendMessage({
        to: data.channelID,
        message: "The following commands are available for " + matchingChannel[0].channel + ": " + settings.COMMAND_PREFIX + matchingChannel[0].emotes.sort().join(", " + settings.COMMAND_PREFIX)
    });
}