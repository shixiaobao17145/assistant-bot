//
// Copyright (c) 2016 Cisco Systems
// Licensed under the MIT License 
//

/* 
 * a Webex Teams bot that:
 *   - sends a welcome message as he joins a room, 
 *   - answers to a /hello command, and greets the user that chatted him
 *   - supports /help and a 'fallback' helper message
 *
 * + leverages the "node-sparkclient" library for bot to Webex communications.
 * 
 */

const WebexChatBot = require("node-sparkbot");
const bot = new WebexChatBot();
const Service = require('./service');
const localtunnel = require('localtunnel');
const logger = Service.logger;

async function createReportIPWebhook() {
    const accessToken = process.env.ACCESS_TOKEN;
    const port = process.env.PORT;
    const tunnel = await localtunnel({ port });

    logger.log('tunnel url==>' , tunnel.url);


    const listResp = await Service.listTeamsWebhooks(accessToken);
    await Promise.all(listResp.items.filter(item => {
        return item.name === Service.reportIPCommand;
    }).map(item => {
        return Service.deleteTeamsWebhookById(accessToken, item.id);
    }));
    await Service.createTeamsWebhook(accessToken, tunnel.url);

    tunnel.on('close', async () => {
        // tunnels are closed

        await createReportIPWebhook();
    });
}
(async () => {
    await createReportIPWebhook();
})();


// Remove comment to overload default '/' prefix to identify bot commands
//bot.interpreter.prefix = "#"; 

const SparkAPIWrapper = require("node-sparkclient");
if (!process.env.ACCESS_TOKEN) {
    logger.log("Could not start as this bot requires a Webex Teams API access token.");
    logger.log("Please add env variable ACCESS_TOKEN on the command line");
    logger.log("Example: ");
    logger.log("> ACCESS_TOKEN=XXXXXXXXXXXX DEBUG=sparkbot* node helloworld.js");
    process.exit(1);
}
const client = new SparkAPIWrapper(process.env.ACCESS_TOKEN);
//
// Help and fallback commands
//
bot.onCommand("help", function (command) {
    client.createMessage(command.message.roomId, `Hi, I am the assistant bot!\n\nType /${Service.reportIPCommand} to get ip information of your remote pc.`, { "markdown": true }, function (err, message) {
        if (err) {
            logger.log("WARNING: could not post message to room: " + command.message.roomId);
            return;
        }
    });
});
bot.onCommand("fallback", function (command) {
    client.createMessage(command.message.roomId, "Sorry, I did not understand.\n\nTry /help.", { "markdown": true }, function (err, response) {
        if (err) {
            logger.log("WARNING: could not post Fallback message to room: " + command.message.roomId);
            return;
        }
    });
});


//
// Bots commands here
//
bot.onCommand(Service.reportIPCommand, function (command) {
    let email = command.message.personEmail; // User that created the message orginally 
    let msg;
    if (process.env.REPPORT_IP_WHITE_LIST.split(',').indexOf(email) < 0) { 
        msg = "You are not allowed to use this command, please contact the admin to add you in the white list";
        logger.log("User:["+email+"] are not allowed to use this command");
    }else{
        msg = '```' + Service.getLocalNetworkInterfaces();
    }
    client.createMessage(command.message.roomId, msg, { "markdown": true }, function (err, message) {
        if (err) {
            logger.log("WARNING: could not post message to room: " + command.message.roomId);
            return;
        }
    });
});


//
// Welcome message 
// sent as the bot is added to a Room
//
bot.onEvent("memberships", "created", function (trigger) {
    let newMembership = trigger.data; // see specs here: https://developer.webex.com/endpoint-memberships-get.html
    if (newMembership.personId != bot.interpreter.person.id) {
        // ignoring
        logger.log("new membership fired, but it is not us being added to a room. Ignoring...");
        return;
    }

    // so happy to join
    logger.log("bot's just added to room: " + trigger.data.roomId);

    client.createMessage(trigger.data.roomId, "Hi, I am an assistant bot! send /[command] to see me in action.", { "markdown": true }, function (err, message) {
        if (err) {
            logger.log("WARNING: could not post Hello message to room: " + trigger.data.roomId);
            return;
        }

        if (message.roomType == "group") {
            client.createMessage(trigger.data.roomId, "**Note that this is a 'Group' room. I will wake up only when mentionned.**", { "markdown": true }, function (err, message) {
                if (err) {
                    logger.log("WARNING: could not post Mention message to room: " + trigger.data.roomId);
                    return;
                }
            });
        }
    });
});

