var request = require('request');

// Add default Twitch channels to automatically load on start
module.exports.channels = [
    'summit1g',
    'sodapoppin',
    'troflecopter',
    'lirik',
    'timthetatman',
    'h3h3Productions'
];

module.exports.twitchCommands = [];
module.exports.channelEmotes = [];
module.exports.gifCommands = [];

function getEmoteUrl (code, id, type) {
    switch (type) {
    case 'twitch':
        return 'http://static-cdn.jtvnw.net/emoticons/v1/' + id + '/1.0';
    case 'bttv':
        return 'http://cdn.betterttv.net/emote/' + id + '/3x';
    default:
        throw ('Invalid type given for twitch emote');
    }
}

module.exports.initializeTotalTwitchEmotes = function (commands, callback) {
    request('https://api.twitch.tv/kraken/chat/emoticon_images', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);

            data.emoticons.forEach(function (el, i, arr) {
                var _key = el.code.toLowerCase();

                // don't overwrite other commands
                if (typeof (commands[_key]) !== 'undefined') return;

                // don't add non-named emojis
                if (el.code.indexOf('\\') >= 0) return;

                module.exports.twitchCommands.push(_key);
                callback(_key, getEmoteUrl(_key, el.id, 'twitch'));
            });
        }
    });
};

module.exports.initializeGlobalTwitchEmotes = function (commands, callback) {
    request('https://twitchemotes.com/api_cache/v3/global.json', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);

            for (var key in data.emotes) {
                if (!data.emotes.hasOwnProperty(key)) continue;

                var _key = key.toLowerCase();

                // don't overwrite other commands
                if (typeof (commands[_key]) !== 'undefined') return;

                // don't add non-named emojis
                if (_key.indexOf('\\') >= 0) return;

                module.exports.twitchCommands.push(_key);
                callback(_key, getEmoteUrl(_key, data.emotes[key].image_id, 'twitch'));
            };
        }
    });
};

module.exports.initializeSubscriberTwitchEmotes = function (commands, callback) {
    console.log('start:twitch subscriber');
    // TODO: Cache subscriber json and update only 30 minutes, do queries on cache
    request('https://twitchemotes.com/api_cache/v3/subscriber.json', function (error, response, body) {
        console.log('finish:twitch subscriber');
        if (!error && response.statusCode === 200 && body && body.length > 10) {
            var data = JSON.parse(body);

            for (var channel in data.channels) {
                if (!data.channels.hasOwnProperty(channel) || module.exports.channels.indexOf(channel.toLowerCase()) === -1) continue;

                var channelToAdd = {
                    channel: channel.toLowerCase(),
                    emotes: []
                };

                data.channels[channel].emotes.forEach(function (el) {
                    var _key = el.code.toLowerCase();

                    // don't overwrite other commands
                    if (typeof (commands[_key]) !== 'undefined') return;

                    callback(_key, getEmoteUrl(_key, el.image_id, 'twitch'));
                    module.exports.twitchCommands.push(_key);
                    channelToAdd.emotes.push(el.code);
                });

                // console.log('add twitch', channel);
                module.exports.channelEmotes.push(channelToAdd);
            };
        }
    });
};

module.exports.initializeBttvEmotes = function (commands, callback) {
    request('http://api.betterttv.net/2/emotes', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);

            data.emotes.forEach(function (el, i, arr) {
                var _key = el.code.toLowerCase();

                if (el.code.indexOf('(') >= 0) {
                    _key = _key.replace(/([()])/g, '');
                }

                // don't overwrite other commands
                if (typeof (commands[_key]) !== 'undefined') return;

                module.exports.twitchCommands.push(_key);

                if (el.imageType === 'gif') { module.exports.gifCommands.push(_key); }

                callback(_key, getEmoteUrl(_key, el.id, 'bttv'));
            });
        }
    });
};

module.exports.addTwitchChannel = function (channelName, commands, commandCallback, messageCallback, successCallback) {
    if (module.exports.channels.indexOf(channelName.toLowerCase()) > -1) { return messageCallback('Channel already added! Run this command to find out their emotes: !twitch ' + channelName); }

    messageCallback("Searching for channel '" + channelName + "'");

    request('https://twitchemotes.com/api_cache/v3/subscriber.json', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);

            for (var channel in data.channels) {
                if (!data.channels.hasOwnProperty(channel) || channel.toLowerCase() !== channelName.toLowerCase()) continue;

                var channelToAdd = {
                    channel: channel.toLowerCase(),
                    emotes: []
                };

                data.channels[channel].emotes.forEach(function (el) {
                    var _key = el.code.toLowerCase();

                    // don't overwrite other commands
                    if (typeof (commands[_key]) !== 'undefined') return;

                    commandCallback(_key, getEmoteUrl(_key, el.image_id, 'twitch'));
                    module.exports.twitchCommands.push(_key);
                    channelToAdd.emotes.push(el.code);
                });

                // console.log('add twitch', channel);
                module.exports.channelEmotes.push(channelToAdd);

                return successCallback(channelToAdd.emotes);
            };

            return messageCallback("No Twitch channel found with emotes matching: '" + channelName + "'");
        } else {
            return messageCallback('Error contacting Twitch...');
        }
    });
};
