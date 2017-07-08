module.exports = function(bot, data) {
    bot.sendMessage({
        to: data.channelID,
        message: "Ping!"
    });
}