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

async function createReportIPWebhook() {
    const accessToken = process.env.ACCESS_TOKEN;
    const port = process.env.PORT;
    const tunnel = await localtunnel({ port });

    console.log('tunnel url=>', tunnel.url);


    const listResp = await Service.listTeamsWebhooks(accessToken);
    await Promise.all(listResp.items.map(item => {
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
    console.log("Could not start as this bot requires a Webex Teams API access token.");
    console.log("Please add env variable ACCESS_TOKEN on the command line");
    console.log("Example: ");
    console.log("> ACCESS_TOKEN=XXXXXXXXXXXX DEBUG=sparkbot* node helloworld.js");
    process.exit(1);
}
const client = new SparkAPIWrapper(process.env.ACCESS_TOKEN);
//
// Help and fallback commands
//
bot.onCommand("help", function (command) {
    client.createMessage(command.message.roomId, "Hi, I am the assistant bot!\n\nType /ip to get ip information of your remote pc.", { "markdown": true }, function (err, message) {
        if (err) {
            console.log("WARNING: could not post message to room: " + command.message.roomId);
            return;
        }
    });
});
bot.onCommand("fallback", function (command) {
    client.createMessage(command.message.roomId, "Sorry, I did not understand.\n\nTry /help.", { "markdown": true }, function (err, response) {
        if (err) {
            console.log("WARNING: could not post Fallback message to room: " + command.message.roomId);
            return;
        }
    });
});


//
// Bots commands here
//
bot.onCommand("ip", function (command) {
    // let email = command.message.personEmail; // User that created the message orginally 
    client.createMessage(command.message.roomId, '```' + Service.getLocalNetworkInterfaces(), { "markdown": true }, function (err, message) {
        if (err) {
            console.log("WARNING: could not post message to room: " + command.message.roomId);
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
        console.log("new membership fired, but it is not us being added to a room. Ignoring...");
        return;
    }

    // so happy to join
    console.log("bot's just added to room: " + trigger.data.roomId);

    client.createMessage(trigger.data.roomId, "Hi, I am the Hello World bot !\n\nType /hello to see me in action.", { "markdown": true }, function (err, message) {
        if (err) {
            console.log("WARNING: could not post Hello message to room: " + trigger.data.roomId);
            return;
        }

        if (message.roomType == "group") {
            client.createMessage(trigger.data.roomId, "**Note that this is a 'Group' room. I will wake up only when mentionned.**", { "markdown": true }, function (err, message) {
                if (err) {
                    console.log("WARNING: could not post Mention message to room: " + trigger.data.roomId);
                    return;
                }
            });
        }
    });
});

