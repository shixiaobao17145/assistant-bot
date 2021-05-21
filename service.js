const os = require('os');
const util = require('util');

const log = require('debug')('assistant:log');
const debug = require('debug')('assistant:debug', { useColors: true });
log.log = console.log.bind(console);
const logger = {
    log,
    debug
}
module.exports = {
    logger,
    reportIPCommand: process.env.REPORT_IP_COMMAND,
    listTeamsWebhooks: function (accessToken) {
        var request = require('request');
        var options = {
            'method': 'GET',
            'url': 'https://webexapis.com/v1/webhooks',
            'headers': {
                'Authorization': 'Bearer ' + accessToken
            }
        };
        return new Promise((rs, rj) => {
            request(options, function (error, response) {
                if (error) rj(error);
                rs(JSON.parse(response.body));
            });
        });
    },
    deleteTeamsWebhookById: function (accessToken, id) {
        var request = require('request');
        var options = {
            'method': 'DELETE',
            'url': 'https://webexapis.com/v1/webhooks/' + id,
            'headers': {
                'Authorization': 'Bearer ' + accessToken
            }
        };
        return new Promise((rs, rj) => {
            request(options, function (error, response) {
                if (error) throw rj(error);
                logger.log('Old webhook deleted, id:', id);
                rs(response.body);
            });
        })
    },
    createTeamsWebhook: function (accessToken, data) {
        var request = require('request');
        if (typeof data === 'string') {
            data = {
                targetUrl: data
            }
        }
        data = Object.assign({
            "name": this.reportIPCommand,
            "resource": "all",
            "event": "all",
            "targetUrl": "https://yellow-firefox-46.loca.lt/"
        }, data);
        var options = {
            'method': 'POST',
            'url': 'https://webexapis.com/v1/webhooks',
            'headers': {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)

        };
        return new Promise((rs, rj) => {
            request(options, function (error, response) {
                if (error) rj(error);
                logger.log(`New webhook with targetUrl:${data.targetUrl} created`);
                rs(response.body);
            });
        })
    },
    getLocalNetworkInterfaces: function () {
        let interfaces = os.networkInterfaces();
        let str = util.inspect(interfaces);
        return str;
    }
}