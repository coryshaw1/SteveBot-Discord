module.exports = function (bot, data, commands) {
    bot.getMessages({
        channelID: data.channelID,
        limit: 100
    }, function (err, messagesArr) {
        if (err) { return console.log(err); }

        var messages = messagesArr.filter(function (message) {
            return message.author.username === bot.username;
        });

        if (messages.length === 0) {
            return bot.sendMessage({
                to: data.channelID,
                message: 'No messages found by me...'
            });
        }

        var timesToLoop = data.params.length === 0
            ? 1
            : parseInt(data.params[0]);

        if (isNaN(timesToLoop)) { timesToLoop = 1; }

        if (data.params.length > 0 && data.params[0].toLowerCase() === 'all') { timesToLoop = messages.length; }

        for (var i = 0; i < timesToLoop; i++) {
            bot.deleteMessage({
                channelID: data.channelID,
                messageID: messages[i].id
            });
        }
    });
};
