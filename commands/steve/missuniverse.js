module.exports = function (bot, data) {
    bot.sendMessage({
        to: data.channelID,
        message: 'And the winner of Miss Universe is...'
    });
    setTimeout(function () {
        bot.sendMessage({
            to: data.channelID,
            message: 'Miss Colombia!!!'
        });
        setTimeout(function () {
            bot.sendMessage({
                to: data.channelID,
                message: "Haha just kidding, it's Miss Steve Harvey"
            });
            bot.sendMessage({
                to: data.channelID,
                message: "It's on the card here, see"
            });
        }, 3000);
    }, 2000);
};
