var request = require('request');

module.exports = function(bot, data) {
    request('http://random.cat/meow', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);

            bot.sendMessage({
                to: data.channelID,
                message: json.file
            });
        } else {
            bot.sendMessage({
                to: data.channelID,
                message: "Bad request to cats..."
            });
        }
    });
}