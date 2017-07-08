var request = require('request');

module.exports = function(bot, data) {
    request('http://random.dog/woof', function(error, response, body) {
        if (!error && response.statusCode == 200 && body) {
            bot.sendMessage({
                to: data.channelID,
                message: 'http://random.dog/' + body 
            });
        } else {
            bot.sendMessage({
                to: data.channelID,
                message: "Bad request to cats..."
            });
        }
    });
}