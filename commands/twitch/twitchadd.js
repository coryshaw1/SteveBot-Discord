var twitch = require(process.cwd() + '/plugins/twitch.js');
var settings = require(process.cwd() + '/settings.json');
var request = require('request').defaults({ encoding: null });

module.exports = function (bot, data, commands) {
    if (!data || !data.params || data.params.length < 1) {
        bot.sendMessage({
            to: data.channelID,
            message: 'Invalid request. Please use this command as: !twitchadd channelToSearch'
        });
        return;
    }

    // look up by first param after command
    var channelToLookup = data.params[0].toLowerCase();

    twitch.addTwitchChannel(channelToLookup, commands,
        function (key, url) {
            // commandCallback
            commands[key] = function (bot, data) {
                request(url, function (err, response, buffer) {
                    bot.uploadFile({
                        to: data.channelID,
                        file: buffer,
                        filename: key + '.png'
                    });
                });
            };
        },
        function (message) {
            // messageCallback
            bot.sendMessage({
                to: data.channelID,
                message: message
            });
        },
        function (emotes) {
            // emotesCallback
            bot.sendMessage({
                to: data.channelID,
                message: "Successfully add Twitch channel '" + channelToLookup + "'!"
            });
            bot.sendMessage({
                to: data.channelID,
                message: 'The following emote commands have been added: ' + settings.COMMAND_PREFIX + emotes.sort().join(', ' + settings.COMMAND_PREFIX)
            });
        }
    );
};
