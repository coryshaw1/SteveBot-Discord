var Discord = require('discord.io');
var pkg = require(process.cwd() + '/package.json');
var settings = require(process.cwd() + '/settings.json');
var twitch = require(process.cwd() + '/plugins/twitch');
var fs = require('fs');
var path = require('path');
var request = require('request').defaults({ encoding: null });
var commands = {};

var bot = new Discord.Client({
    token: settings.DISCORD_BOT_TOKEN,
    autorun: true
});

initializeCommands();
initializeTwitchCommands();

bot.on('ready', function () {
    console.log(bot.username + ' - (' + bot.id + ') - Version: ' + pkg.version);
});

bot.on('message', function (user, userID, channelID, message, event) {
// Don't try to run commands by itself
    if (user === bot.username) return;

    var data = {
        user: user,
        userID: userID,
        channelID: channelID,
        message: message,
        event: event
    };

    handleCommand(bot, data);
});

function initializeCommands () {
// cache all the commands here by auto requiring them and passing the bot
// supports directories no matter how deep you go. twss
    var cmd = process.cwd() + '/commands';
    var walk = function (dir) {
        fs.readdirSync(dir).forEach(function (file) {
            var _path = path.resolve(dir, file);
            fs.stat(_path, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(_path);
                } else {
                    if (file.indexOf('.js') > -1) {
                        // add commands set in file if they exist
                        if (typeof (require(_path).extraCommands) !== 'undefined') {
                            if (Array.isArray(require(_path).extraCommands)) {
                                // add each command in array into overall commands
                                require(_path).extraCommands.forEach(function (command) {
                                    commands[command] = require(_path);
                                });
                            } else {
                                throw new TypeError('Invalid extraCommands export for file: ' + _path);
                            }
                        }

                        commands[file.split('.')[0]] = require(_path);
                    }
                }
            });
        });
    };
    walk(cmd);
}

function initializeTwitchCommands () {
// Global emotes
    twitch.initializeGlobalTwitchEmotes(commands, function (key, url) {
        commands[key] = function (bot, data) {
            request(url, function (err, response, buffer) {
                bot.uploadFile({
                    to: data.channelID,
                    file: buffer,
                    filename: key + '.png'
                });
            });
        };
    });

    // Subscriber emotes specified in assets/twitch.js
    twitch.initializeSubscriberTwitchEmotes(commands, function (key, url) {
        commands[key] = function (bot, data) {
            request(url, function (err, response, buffer) {
                bot.uploadFile({
                    to: data.channelID,
                    file: buffer,
                    filename: key + '.png'
                });
            });
        };
    });

    // Bttv emotes
    twitch.initializeBttvEmotes(commands, function (key, url) {
        commands[key] = function (bot, data) {
            request(url, function (err, response, buffer) {
                bot.uploadFile({
                    to: data.channelID,
                    file: buffer,
                    filename: key + (twitch.gifCommands.indexOf(key) > -1 ? '.gif' : '.png')
                });
            });
        };
    });
}

function handleCommand (bot, data) {
    if (Object.keys(commands).length === 0) { return setTimeout(handleCommand(bot, data), 2000); }

    var cmd = data.message;
    // array of the command triggers
    var parsedCommands = [];
    // split the whole message words into tokens
    var tokens = cmd.split(' ');
    // command handler
    tokens.forEach(function (token) {
        // check if token starts with command prefix and we haven't already parsed command
        if (token.substr(0, settings.COMMAND_PREFIX.length) === settings.COMMAND_PREFIX &&
            parsedCommands.indexOf(token.substr(settings.COMMAND_PREFIX.length)) === -1) {
            // add the command used to the data sent from the chat to be used later
            data.trigger = token.substr(settings.COMMAND_PREFIX.length).toLowerCase();
            parsedCommands.push(data.trigger);
            // get index of token in all tokens
            var tokenIndex = tokens.indexOf(token);
            // the params are an array of the remaining tokens
            data.params = tokens.slice(tokenIndex + 1);
            // execute the command
            if (typeof (commands[data.trigger]) !== 'undefined') {
                // notify the user the bot received command by "typing"
                bot.simulateTyping();
                // passes session the data to the command
                commands[data.trigger](bot, data, commands);
            }
        }
    });
}
