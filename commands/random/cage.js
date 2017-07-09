module.exports = function (bot, data) {
    bot.sendMessage({
        to: data.channelID,
        message: 'http://www.placecage.com/c/' + (Math.floor(Math.random() * 600) + 200) + '/' + (Math.floor(Math.random() * 600) + 200)
    });
};
