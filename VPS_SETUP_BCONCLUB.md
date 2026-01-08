# VPS Setup for bconclub.com

## Quick Setup Commands

### 1. Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/bconclub.com
```

Paste the following configuration:

```nginx
server {
    listen 80;
    server_name bconclub.com www.bconclub.com;
    
    location / {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save and exit (Ctrl+X, then Y, then Enter).

### 2. Enable Nginx Site

```bash
sudo ln -s /etc/nginx/sites-available/bconclub.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Install SSL Certificate

```bash
sudo certbot --nginx -d bconclub.com -d www.bconclub.com
```

Follow the prompts:
- Enter your email address
- Agree to terms of service
- Choose whether to redirect HTTP to HTTPS (recommended: Yes)

### 4. Verify Setup

```bash
# Check Nginx status
sudo systemctl status nginx

# Check PM2 status
pm2 status

# Check SSL certificate
sudo certbot certificates

# Test the site
curl -I http://localhost:3003
```

## DNS Configuration

Configure these DNS records with your domain provider:

- **Type**: A Record
- **Name**: `@` (or `bconclub.com`)
- **Value**: `82.29.167.17`
- **TTL**: 3600 (or default)

- **Type**: A Record
- **Name**: `www`
- **Value**: `82.29.167.17`
- **TTL**: 3600 (or default)

## Verification

After DNS propagation (can take 24-48 hours):

```bash
# Check DNS resolution
dig bconclub.com
nslookup bconclub.com

# Test HTTPS
curl -I https://bconclub.com
```

## Notes

- The app runs on port 3003 (configured in `ecosystem.config.js`)
- PM2 manages the Node.js process
- GitHub Actions handles automatic deployment on push to `production` branch
- SSL certificate auto-renews via Certbot

## Troubleshooting

**If site is not accessible:**
1. Check PM2: `pm2 logs bconclub`
2. Check Nginx: `sudo nginx -t && sudo systemctl status nginx`
3. Check firewall: `sudo ufw status`
4. Verify app is running: `curl http://localhost:3003`

**If SSL fails:**
1. Ensure DNS is configured correctly
2. Verify port 80 is open: `sudo ufw allow 80/tcp`
3. Check Nginx config: `sudo nginx -t`
