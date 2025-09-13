module.exports = {
  apps: [{
    name: 'smart-affiliate-system',
    script: 'npm',
    args: 'run dev',
    cwd: '/opt/smart-affiliate-system',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/opt/smart-affiliate-system/logs/pm2-error.log',
    out_file: '/opt/smart-affiliate-system/logs/pm2-out.log',
    log_file: '/opt/smart-affiliate-system/logs/pm2-combined.log',
    time: true
  }]
}