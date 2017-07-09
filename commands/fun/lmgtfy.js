module.exports = function (bot, data) {
    if (!data || !data.params || data.params.length < 1) {
        return bot.sendMessage({
            to: data.channelID,
            message: 'Need a search term! Ex: !lmgtfy how do i not be dumb'
        });
    }

    bot.sendMessage({
        to: data.channelID,
        message: 'http://lmgtfy.com/?q=' + encodeURI(data.params.join('+'))
    });
};

module.exports.extraCommands = ['google'];
