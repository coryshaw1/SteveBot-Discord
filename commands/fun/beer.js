var request = require('request');
var settings = require(process.cwd() + "/settings.json");

module.exports = function (bot, data) {
    if(!data || !data.params || data.params.length < 1)
        return getRandomBeer(bot, data);
    else
        return getSearchedBeer(bot, data);
}

function getRandomBeer(bot, data) {
    var baseRequestUrl = 'http://api.brewerydb.com/v2/beer/random?withBreweries=y&key=' + settings.BREWERYDB_API_KEY;

    request(baseRequestUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);

            if (!json || !json.data)
                return bot.sendMessage({
                    to: data.channelID,
                    message: "No beer found..."
                });

            return messageBeer(json.data, bot, data);
        } else {
            return bot.sendMessage({
                to: data.channelID,
                message: "Bad request to BreweryDB..."
            });
        }
    });
}

function getSearchedBeer(bot, data) {
    var baseRequestUrl = 'http://api.brewerydb.com/v2/search?type=beer&withBreweries=y&q=' + data.params.join("%20") + '&key=' + settings.BREWERYDB_API_KEY;

    request(baseRequestUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);

            if (!json || !json.data || json.data.length == 0)
                return bot.sendMessage({
                    to: data.channelID,
                    message: "No beer found matching " + data.params.join(" ") + "..."
                });

            return messageBeer(json.data[0], bot, data);
        } else {
            return bot.sendMessage({
                to: data.channelID,
                message: "Bad request to BreweryDB..."
            });
        }
    });
}

function messageBeer(beer, bot, data) {
    var beerInfo = "";
    var beerDesc = beer.description
        ? beer.description.replace("\r", "").replace("\n", "")
        : "";

    if (beer.style && beer.style.shortName && beer.abv)
        beerInfo = beer.nameDisplay + " (" + beer.style.shortName + " " + beer.abv + "%)";
    else
        beerInfo = beer.nameDisplay;

    if (beer.breweries && beer.breweries.length > 0)
        beerInfo += " - brewed by " + beer.breweries[0].name;

    bot.sendMessage({
        to: data.channelID,
        message: beerInfo
    });
    
    bot.sendMessage({
        to: data.channelID,
        message: beerDesc + " - Link: http://www.brewerydb.com/beer/" + beer.id
    });
}