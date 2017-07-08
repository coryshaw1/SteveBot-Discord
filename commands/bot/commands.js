var twitch = require(process.cwd() + "/plugins/twitch.js");
var settings = require(process.cwd() + "/settings.json");

module.exports = function(bot, data, commands) {
    var commandsNonTwitchEmotes = Object.keys(commands).filter(function(c) {
        return twitch.twitchCommands.indexOf(c) === -1;
    }).sort();

    bot.sendMessage({
        to: data.channelID,
        message: "The following commands are available to use:\n" +
                    settings.COMMAND_PREFIX + commandsNonTwitchEmotes.join(", " + settings.COMMAND_PREFIX)
    });
}