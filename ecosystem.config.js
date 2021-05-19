module.exports = {
  apps : [{
    script: 'index.js',
    name: 'assistant bot',
    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: '',
    instances: 1,
    autorestart: true,
    watch: false,
    watch: '.',
    autorestart: true,
    env: {
      NODE_ENV: "development",
      DEBUG:"sparkbot*,samples*",
      PORT:8000,
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
