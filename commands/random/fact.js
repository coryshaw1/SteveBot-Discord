var request = require('request');

module.exports = function (bot, data) {
    request('http://numbersapi.com/random/trivia', function (error, response, body) {
        bot.sendMessage({
            to: data.channelID,
            message: !error && response.statusCode === 200
                ? body
                : 'Bad request to facts...'
        });
    });
};
