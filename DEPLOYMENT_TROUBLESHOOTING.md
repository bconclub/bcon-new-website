# Deployment Troubleshooting Guide

## SSH Connection Timeout Error

If you see: `dial tcp 82.29.167.17:22: i/o timeout`

This means GitHub Actions cannot connect to your VPS server via SSH.

## Troubleshooting Steps

### 1. Check if Server is Online

```bash
# From your local machine, test if server is reachable
ping 82.29.167.17

# Test SSH connection manually
ssh -v your-username@82.29.167.17
```

### 2. Check SSH Service on VPS

SSH into your VPS and run:

```bash
# Check if SSH service is running
sudo systemctl status ssh
# or
sudo systemctl status sshd

# If not running, start it
sudo systemctl start ssh
sudo systemctl enable ssh
```

### 3. Check Firewall Rules

On your VPS, check firewall:

```bash
# Check UFW status
sudo ufw status

# If SSH port is blocked, allow it
sudo ufw allow 22/tcp
sudo ufw reload

# For other firewalls (iptables)
sudo iptables -L -n | grep 22
```

### 4. Verify SSH Port

```bash
# Check what port SSH is listening on
sudo netstat -tlnp | grep ssh
# or
sudo ss -tlnp | grep ssh

# Default is port 22, but might be configured differently
```

### 5. Check GitHub Secrets

Verify in GitHub repository settings → Secrets and variables → Actions:

- `VPS_HOST` - Should be `82.29.167.17` (or your server IP)
- `VPS_USERNAME` - Your SSH username
- `VPS_DEPLOY_KEY` - Your SSH private key (must be the full key including `-----BEGIN` and `-----END`)

### 6. Test SSH Key Authentication

```bash
# On your local machine, test the deploy key
ssh -i /path/to/deploy-key your-username@82.29.167.17

# If it works locally but not in GitHub Actions, the key format might be wrong
```

### 7. Check Server Resources

```bash
# Check if server has resources
free -h
df -h
top
```

### 8. Check Server Logs

```bash
# Check SSH logs for connection attempts
sudo tail -f /var/log/auth.log
# or
sudo journalctl -u ssh -f
```

## Common Solutions

### Solution 1: Server is Behind a Firewall

If your VPS provider has a firewall (like DigitalOcean, AWS, etc.):
1. Go to your VPS provider's dashboard
2. Find Firewall/Security Groups settings
3. Add rule: Allow TCP port 22 from GitHub Actions IPs

**GitHub Actions IP ranges** (check current ones):
- You may need to allow all IPs or use a specific range
- Alternatively, whitelist GitHub's IP ranges

### Solution 2: SSH Key Format Issue

The `VPS_DEPLOY_KEY` secret must include:
```
-----BEGIN OPENSSH PRIVATE KEY-----
...key content...
-----END OPENSSH PRIVATE KEY-----
```

Or for RSA:
```
-----BEGIN RSA PRIVATE KEY-----
...key content...
-----END RSA PRIVATE KEY-----
```

### Solution 3: Use Password Instead of Key (Less Secure)

If key authentication fails, you can temporarily use password:

```yaml
- name: Copy files to VPS
  uses: appleboy/scp-action@v0.1.7
  with:
    host: ${{ secrets.VPS_HOST }}
    username: ${{ secrets.VPS_USERNAME }}
    password: ${{ secrets.VPS_PASSWORD }}  # Instead of key
    source: "deploy.tar.gz"
    target: "/tmp/"
```

### Solution 4: Use Different SSH Port

If SSH is on a non-standard port:

```yaml
- name: Copy files to VPS
  uses: appleboy/scp-action@v0.1.7
  with:
    host: ${{ secrets.VPS_HOST }}
    username: ${{ secrets.VPS_USERNAME }}
    key: ${{ secrets.VPS_DEPLOY_KEY }}
    port: 2222  # Your custom SSH port
    source: "deploy.tar.gz"
    target: "/tmp/"
```

## Quick Test Script

Run this on your VPS to verify SSH is working:

```bash
#!/bin/bash
echo "Testing SSH configuration..."

# Check SSH service
echo "1. SSH Service Status:"
sudo systemctl status ssh | grep Active

# Check firewall
echo "2. Firewall Status:"
sudo ufw status | grep 22

# Check SSH listening
echo "3. SSH Listening Ports:"
sudo ss -tlnp | grep ssh

# Check SSH config
echo "4. SSH Config:"
sudo grep -E "^Port|^PermitRootLogin|^PasswordAuthentication" /etc/ssh/sshd_config

echo "Done!"
```

## Alternative: Manual Deployment

If automated deployment continues to fail, you can deploy manually:

```bash
# On your local machine
git checkout production
git pull origin production
npm run build

# Create deployment package
mkdir -p deploy
cp -r .next deploy/
cp -r public deploy/
cp package.json deploy/
cp package-lock.json deploy/
cp ecosystem.config.js deploy/
tar -czf deploy.tar.gz -C deploy .

# Copy to server
scp deploy.tar.gz your-username@82.29.167.17:/tmp/

# SSH into server and deploy
ssh your-username@82.29.167.17
cd /var/www/bconclub
tar -xzf /tmp/deploy.tar.gz -C /var/www/bconclub/
npm install --production
pm2 restart bconclub
```

## Next Steps

1. **Verify server is online**: `ping 82.29.167.17`
2. **Test SSH manually**: `ssh username@82.29.167.17`
3. **Check firewall rules**: Allow port 22
4. **Verify GitHub secrets**: Check all three secrets are correct
5. **Check server logs**: Look for connection attempts

If all else fails, contact your VPS provider support.
