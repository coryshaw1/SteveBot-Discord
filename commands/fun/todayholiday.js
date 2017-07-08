var HolidayAPI = require('node-holidayapi');
var settings = require(process.cwd() + "/settings.json");
var hapi = new HolidayAPI(settings.HOLIDAY_API_KEY).v1;
var moment = require('moment');

module.exports = function(bot, data) {
    var parameters = {
        // Required
        country: 'US',
        year: new Date().getFullYear(),
        // Optional
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        // previous: true,
        // upcoming: true,
        public: false,
        // pretty:   true,
    };

    hapi.holidays(parameters, function(err, data) {
        if (data.status !== 200)
            return bot.sendMessage({
                to: data.channelID,
                message: "Bad request to holidays..."
            });

        if (data.holidays.length == 0)
            return bot.sendMessage({
                to: data.channelID,
                message: "There are no holidays today, " + moment().format('LL')
            });

        var plural = data.holidays.length > 1;
        bot.sendMessage({
            to: data.channelID,
            message: moment().format('LL') + "has " + data.holidays.length + " " + (plural ? "holidays" : "holiday")
        });
        var holidaysMessage = '';
        data.holidays.forEach(function(holiday, index) {
            holidaysMessage += holiday.name;

            if (data.holidays.length != (index + 1))
                holidaysMessage += "\n";
        });

        bot.sendMessage({
            to: data.channelID,
            message: holidaysMessage
        });
    });
}