# Yatravi Deployment Guide for Spaceship VPS

This guide outlines the process to deploy the Yatravi Next.js and Express application on a Spaceship Virtual Machine (Ubuntu).

## 1. Initial VPS Setup
SSH into your Spaceship VM:
```bash
ssh root@209.74.82.27 -p 22022
```

Update your system and install essential packages:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install curl -y
```

Install Node.js (v20+ recommended) and NPM:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Install PM2 globally to manage node processes:
```bash
sudo npm install -g pm2
```

## 2. Get Your Code on the Server
Clone your repository or upload the files using secure copy (`scp`) or an FTP client like FileZilla.
```bash
# Example if using Git
git clone https://github.com/your-username/yatravi.git
cd yatravi
```

## 3. Install Dependencies
Run the installation script in the root folder:
```bash
npm install
```

## 4. Setup Environment Variables
You MUST set up your `.env` and `.env.local` files on the production server.
```bash
nano .env
```
Ensure all required variables are set, especially:
- `JWT_SECRET`
- `NODE_ENV=production`
- `PORT=5000`
- MongoDB URI
- ImageKit Credentials
- Email credentials for OTP

## 5. Build the Frontend
Next.js requires a production build:
```bash
npm run build
```

## 6. Start the App with PM2
An `ecosystem.config.cjs` file has already been added to your code base locally. Simply run it to start both the Next.js frontend and Express backend:
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

## 7. Setup Nginx Reverse Proxy
To make the site accessible via port 80/443 (HTTP/HTTPS) and link your domain name:
Install Nginx:
```bash
sudo apt install nginx -y
```

Create a new configuration block for your domain:
```bash
sudo nano /etc/nginx/sites-available/yatravi
```

Paste the following configuration (replace `yourdomain.com` with your actual domain):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Route API requests to Express Backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Route everything else to Next.js Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/yatravi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 8. Secure with SSL (Certbot)
Install Let's Encrypt Certbot to get an SSL certificate:
```bash
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Your website should now be live and secure!
