module.exports = {
  apps: [{
    name: 'bconclub',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/bconclub',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3003
    },
    error_file: '/var/www/bconclub/logs/error.log',
    out_file: '/var/www/bconclub/logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
