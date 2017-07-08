var urban = require('urban');

module.exports = function (bot, data) {

    if (!data || !data.params || data.params.length < 1)
        return bot.sendMessage({
            to: data.channelID,
            message: "Need a search term! Ex: !urban wat"
        });

    urban(data.params.join(' ')).first(function (json) {

        if (!json || typeof json === "undefined")
            return bot.sendMessage({
                    to: data.channelID,
                    message: "No definitions found for search term: '" + data.params.join(' ') + "'!"
            });

        bot.sendMessage({
            to: data.channelID,
            message: "'" + data.params.join(' ') + "': " + json.definition
        });

        if (!json.example || json.example.length == 0) return;

        bot.sendMessage({
            to: data.channelID,
            message: "Examples:"
        });

        json.example.split("\r\n\r\n").forEach(function (example) {
            bot.sendMessage({
                to: data.channelID,
                message: example
            });
        });
    });
};