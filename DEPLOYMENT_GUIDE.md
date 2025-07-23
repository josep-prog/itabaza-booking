# iTABAZA Booking System - Deployment Guide

## 🚀 Overview

This guide will help you deploy the iTABAZA Booking System to any server. The application has been configured to work on multiple deployment environments, not just localhost.

## 📋 Server Requirements

- **Operating System**: Ubuntu 18.04+ (or any Linux distribution)
- **Node.js**: Version 14.x or higher
- **Memory**: Minimum 1GB RAM (2GB+ recommended)
- **Storage**: At least 5GB available space
- **Network**: Internet access for dependency installation

## 🎯 Available Servers

Based on your server list, these are the configured deployment targets:

| Server | IP Address | Environment File | Deployment Script |
|--------|------------|------------------|------------------|
| LB-01  | 54.235.237.101 | `.env.lb01` | `./deploy-lb01.sh` |
| Web01  | 52.71.25.46 | `.env.web01` | `./deploy-web01.sh` |
| Web02  | 54.86.41.67 | `.env.web02` | `./deploy-web02.sh` |

## 🔧 Pre-Deployment Setup

### 1. Configure Environment Variables

Before deploying, you need to configure the environment variables for each server:

```bash
# Copy and edit the environment file for your target server
cp Backend/.env.lb01 Backend/.env.lb01.local
# Edit the file with your actual values
nano Backend/.env.lb01.local
```

**Required Variables:**
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `JWT_SECRET`: A secure random string for JWT tokens
- `EMAIL_USER`: Gmail address for sending emails
- `EMAIL_PASS`: Gmail app password

### 2. SSH Key Setup

Ensure your SSH key is properly configured:
```bash
# Test SSH connection
ssh -i ~/.ssh/school ubuntu@54.235.237.101
```

## 🚀 Deployment Options

### Option 1: Quick Deployment (Recommended)

Use the automated deployment scripts:

```bash
# Deploy to LB-01
./deploy-lb01.sh

# Deploy to Web01
./deploy-web01.sh

# Deploy to Web02
./deploy-web02.sh
```

### Option 2: Manual Deployment

If you prefer manual deployment or need to customize the process:

#### Step 1: Prepare Your Environment
```bash
# Ensure your environment file is ready
cp Backend/.env.lb01 Backend/.env
# Edit with your actual values
nano Backend/.env
```

#### Step 2: Upload to Server
```bash
# Create deployment package
mkdir -p deploy-package
cp -r Backend deploy-package/
cp -r Frontend deploy-package/
cp Backend/.env deploy-package/Backend/

# Upload to server
rsync -avz --delete -e "ssh -i ~/.ssh/school" \
    --exclude='node_modules' \
    --exclude='.git' \
    deploy-package/ ubuntu@54.235.237.101:/home/ubuntu/itabaza-booking/
```

#### Step 3: Setup on Server
```bash
# Connect to server
ssh -i ~/.ssh/school ubuntu@54.235.237.101

# Navigate to project directory
cd /home/ubuntu/itabaza-booking

# Install dependencies
cd Backend && npm install --production

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Start application
pm2 start index.js --name "itabaza-booking" --env production
pm2 save
pm2 startup

# Setup Nginx (optional, for reverse proxy)
sudo apt update && sudo apt install -y nginx
# Configure as shown in deployment scripts
```

## 🌐 Domain and CORS Configuration

### For Custom Domains

If you have a custom domain, update the environment variables:

```bash
# In your .env file
SERVER_DOMAIN=yourdomain.com
ALLOWED_ORIGINS=http://yourdomain.com,https://yourdomain.com
```

### For Multiple Domains

```bash
ALLOWED_ORIGINS=http://domain1.com,https://domain1.com,http://domain2.com,https://domain2.com
```

### For Development (Allow All Origins)

```bash
NODE_ENV=development
ALLOW_ALL_ORIGINS=true
```

## 📊 Monitoring and Maintenance

### Check Application Status
```bash
# Connect to server
ssh -i ~/.ssh/school ubuntu@SERVER_IP

# Check PM2 status
pm2 status

# View logs
pm2 logs itabaza-booking

# Restart application
pm2 restart itabaza-booking

# Monitor resources
pm2 monit
```

### Nginx Status (if using reverse proxy)
```bash
# Check Nginx status
sudo systemctl status nginx

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check that your `ALLOWED_ORIGINS` includes the correct domains
   - Ensure the frontend is accessing the correct API URL

2. **Database Connection Issues**
   - Verify Supabase credentials in environment file
   - Check network connectivity from server to Supabase

3. **Port Already in Use**
   ```bash
   # Find and kill process using port 8080
   sudo lsof -i :8080
   sudo kill -9 <PID>
   ```

4. **Permission Issues**
   ```bash
   # Fix file permissions
   chmod +x deploy-*.sh
   sudo chown -R ubuntu:ubuntu /home/ubuntu/itabaza-booking
   ```

### Health Check

Test your deployment:
```bash
# API health check
curl http://YOUR_SERVER_IP:8080/api/health

# Frontend access test
curl http://YOUR_SERVER_IP:8080
```

## 🔒 Security Considerations

### Firewall Configuration
```bash
# Allow HTTP and HTTPS traffic
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 8080  # If accessing directly
sudo ufw enable
```

### SSL Certificate (Recommended for Production)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com
```

## 🔄 Updates and Rollbacks

### Updating the Application
```bash
# Re-run deployment script
./deploy-lb01.sh

# Or manually
git pull origin main
pm2 restart itabaza-booking
```

### Rollback
```bash
# PM2 handles this automatically, but you can also:
pm2 stop itabaza-booking
# Restore previous version files
pm2 start itabaza-booking
```

## 📱 Multi-Server Setup

For high availability, you can deploy to multiple servers:

1. **Load Balancer Setup**: Use LB-01 as your main load balancer
2. **Web Servers**: Deploy to Web01 and Web02 as backend servers
3. **Database**: Use shared Supabase instance

## 📞 Support

If you encounter issues:

1. Check the logs: `pm2 logs itabaza-booking`
2. Verify environment configuration
3. Test network connectivity
4. Check server resources (memory, disk space)

## 🎉 Success!

After successful deployment, your iTABAZA Booking System will be accessible at:

- **Direct Access**: `http://YOUR_SERVER_IP:8080`
- **Nginx Proxy**: `http://YOUR_SERVER_IP` (if configured)
- **Custom Domain**: `http://yourdomain.com` (if configured)

The system will automatically detect the correct API endpoints based on the deployment environment!
