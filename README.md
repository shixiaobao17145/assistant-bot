# Assistant Bot
This is a [webex](https://www.webex.com/team-collaboration.html) chat bot with function of reporting local network interfaces.

## Prerequisites
- nodejs installed 
- Go to https://developer.webex.com/my-apps/new/bot to create a webex teams bot
- Remember the access token as well as the username of that bot, we'll need that later

## Run the service
1. Clone this repo to local
2. Run `npm install` or `yarn` to install dependencies
3. Run `DEBUG=sparkbot*,samples* PORT=8000 ACCESS_TOKEN=YOUR-BOT'S-ACCESS-TOKEN node index.js`

> Or if you use [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/) to make it running forever, I suggest you put the `DEBUG`,`PORT` and `ACCESS_TOKEN` info in the `ecosystem.config.js` file and do `pm2 start ecosystem.config.js` instead of the 3rd step of this section above.


## Use it
 Go to webex teams app, create a conversation with the bot(with the bot's username) and send a message of `/ip`, you will see the ip interfaces replied by the bot.
![image](https://user-images.githubusercontent.com/1640561/118807543-066baa80-b8db-11eb-8eae-cd5db4e1a915.png)


