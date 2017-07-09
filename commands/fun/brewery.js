var request = require('request');
var settings = require(process.cwd() + '/settings.json');

module.exports = function (bot, data) {
    if (!data || !data.params || data.params.length < 1) { return getRandomBrewery(bot, data); } else { return getSearchedBrewery(bot, data); }
};

function getRandomBrewery (bot, data) {
    var baseRequestUrl = 'http://api.brewerydb.com/v2/brewery/random?key=' + settings.BREWERYDB_API_KEY;

    request(baseRequestUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var json = JSON.parse(body);

            if (!json || !json.data) {
                return bot.sendMessage({
                    to: data.channelID,
                    message: 'No brewery found...'
                });
            }

            return messageBrewery(json.data, bot, data);
        } else {
            return bot.sendMessage({
                to: data.channelID,
                message: 'Bad request to BreweryDB...'
            });
        }
    });
}

function getSearchedBrewery (bot, data) {
    var baseRequestUrl = 'http://api.brewerydb.com/v2/search?type=brewery&q=' + data.params.join('%20') + '&key=' + settings.BREWERYDB_API_KEY;

    request(baseRequestUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var json = JSON.parse(body);

            if (!json || !json.data || json.data.length === 0) {
                return bot.sendMessage({
                    to: data.channelID,
                    message: 'No brewery found matching ' + data.params.join(' ') + '...'
                });
            }

            return messageBrewery(json.data[0], bot, data);
        } else {
            return bot.sendMessage({
                to: data.channelID,
                message: 'Bad request to BreweryDB...'
            });
        }
    });
}

function messageBrewery (brewery, bot, data) {
    var breweryInfo = brewery.name;
    var breweryDesc = brewery.description
        ? brewery.description.replace('\r', '').replace('\n', '')
        : '';

    bot.sendMessage({
        to: data.channelID,
        message: breweryInfo
    });
    bot.sendMessage({
        to: data.channelID,
        message: breweryDesc + ' - Link: ' + (brewery.website ? brewery.website : 'http://www.brewerydb.com/brewery/' + brewery.id)
    });
}
