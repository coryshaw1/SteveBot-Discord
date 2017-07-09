module.exports = function (bot, data) {
    if (!data || !data.params || data.params.length < 1 || (data.params[0].toLowerCase() !== 'heads' && data.params[0].toLowerCase() !== 'tails')) {
        return bot.sendMessage({
            to: data.channelID,
            message: 'Need to call a side! Ex: !coinflip heads OR !coinflip tails'
        });
    }

    var sideChosen = Math.floor(Math.random() * 2) === 0 ? 'heads' : 'tails';

    bot.sendMessage({
        to: data.channelID,
        message: sideChosen === data.params[0].toLowerCase()
            ? "It's " + sideChosen + '! You won!'
            : 'Sorry, it landed on ' + sideChosen
    });
};
