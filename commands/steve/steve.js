module.exports = function(bot, data) {
    bot.sendMessage({
        to: data.channelID,
        message: ':steve: All hail the one true Steve! :steve:'
    });
    bot.sendMessage({
        to: data.channelID,
        message: 'http://i.imgur.com/zQrmXJa.gifv'
    });
};