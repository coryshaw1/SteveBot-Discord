var request = require('request');

module.exports = function(bot, data) {
    request('http://pebble-pickup.herokuapp.com/tweets/random', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);

            if(!json.tweet || json.tweet.length == 0) 
                return bot.sendMessage({
                            to: data.channelID,
                            message: "Bad request to Pickup Lines... Probably busy with that girl they picked up"
                        });

            bot.sendMessage({
                to: data.channelID,
                message: json.tweet
                    .replace('&quot;', '"')
                    .replace('&apos;', "'")
            });
        }
        else {
            bot.sendMessage({
                to: data.channelID,
                message: "Bad request to Pickup Lines... Probably busy with that girl they picked up"
            });
        }
    });
}

module.exports.extraCommands = ["pickupline"];