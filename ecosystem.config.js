// Note: for pm2 startup config, you need add the line below to the sytemd service config file(/etc/systemd/system/pm2-bob.service on linux for example)
// ExecStartPre=/bin/bash -c 'until host api.ciscospark.com; do sleep 1; done'

module.exports = {
  apps : [{
    script: 'index.js',
    name: 'assistant bot',
    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: '',
    instances: 1,
    autorestart: true,
    watch: '.',
    env: {
      NODE_ENV: "development",
      DEBUG:"sparkbot*, assistant*",
      PORT:8000,
      REPORT_IP_COMMAND:'ip-remote-pc1',
      REPPORT_IP_WHITE_LIST:"xiaobshi@cisco.com",
      ACCESS_TOKEN:"**************"
    },
  }],

  // deploy : {
  //   production : {
  //     user : 'SSH_USERNAME',
  //     host : 'SSH_HOSTMACHINE',
  //     ref  : 'origin/master',
  //     repo : 'GIT_REPOSITORY',
  //     path : 'DESTINATION_PATH',
  //     'pre-deploy-local': '',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
  //     'pre-setup': ''
  //   }
  // }
};
