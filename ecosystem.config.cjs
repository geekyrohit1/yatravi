module.exports = {
    apps: [
        {
            name: 'yatravi-frontend',
            script: 'node_modules/next/dist/bin/next',
            args: 'start -p 3000',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '850M',
            env: {
                NODE_ENV: 'production',
                PORT: 3000
            }
        },
        {
            name: 'yatravi-backend',
            script: 'server/index.js',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '750M',
            env: {
                NODE_ENV: 'production',
                PORT: 5000
            }
        }
    ]
};
