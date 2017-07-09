var request = require('request');

module.exports = function (bot, data) {
    request('http://api.icndb.com/jokes/random', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var json = JSON.parse(body);

            if (!json.type || json.type !== 'success') {
                return bot.sendMessage({
                    to: data.channelID,
                    message: 'Bad request to Chuck Norris... Probably busy kicking ass'
                });
            }

            bot.sendMessage({
                to: data.channelID,
                message: json.value.joke
                    .replace('&quot;', '"')
                    .replace('&apos;', "'")
            });
        } else {
            bot.sendMessage({
                to: data.channelID,
                message: 'Bad request to Chuck Norris... Probably busy kicking ass'
            });
        }
    });
};
