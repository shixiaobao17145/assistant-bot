# Report Local IP Bot
This is a webex teams chat bot with function of reporting local network interfaces.

## Prerequisites
- nodejs installed 
- Go to https://developer.webex.com/my-apps/new/bot to create a webex teams bot
- Remember the access token as well as the name of that bot, we'll need that later

## Run the service
1. Clone this repo to local
2. Run `npm install` or `yarn` to install dependencies
3. Run `DEBUG=sparkbot*,samples* PORT=8000 ACCESS_TOKEN=YOUR-BOT'S-ACCESS-TOKEN node index.js`

## Use it
 Go to webex teams app, create a conversation with the bot(with the bot name while we create the bot) and send a message of `/ip`, you will see the ip interfaces replied by the bot.


> Or if you use pm2 to make it running forever, I suggest you put the `DEBUG`,`PORT` and `ACCESS_TOKEN` info in the `ecosystem.config.js` file and do `pm2 start ecosystem.config.js` instead of the 3rd step of `Run the service` section above.
