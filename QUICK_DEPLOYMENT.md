# 🚀 iTABAZA Booking System - Quick Deployment Guide

## ✅ What's Been Fixed

Your iTABAZA booking system has been **completely transformed** from localhost-only to **universally deployable**! Here's what changed:

### 🔧 Server Configuration
- ✅ **CORS**: Now accepts connections from any domain/IP
- ✅ **Host Binding**: Listens on `0.0.0.0` (all network interfaces)
- ✅ **Environment-aware**: Adapts to any deployment environment
- ✅ **Dynamic Origins**: Automatically includes your server IP/domain

### 🌐 Frontend Configuration
- ✅ **Smart baseURL**: Automatically detects the correct API endpoint
- ✅ **Multi-environment**: Works on localhost, IP addresses, and custom domains
- ✅ **Browser-aware**: Uses current domain when deployed on same server

## 🎯 Ready-to-Use Deployment Scripts

### Option 1: Pre-configured Servers
```bash
# Deploy to your specific servers
./deploy-lb01.sh    # 54.235.237.101
./deploy-web01.sh   # 52.71.25.46  
./deploy-web02.sh   # 54.86.41.67
```

### Option 2: Universal Deployment (Any Server)
```bash
# Deploy to any server with one command
./deploy-universal.sh -i SERVER_IP -u USERNAME

# Examples:
./deploy-universal.sh -i 54.235.237.101 -u ubuntu
./deploy-universal.sh -i mydomain.com -u ubuntu -d mydomain.com
```

## ⚡ Super Quick Start

**1. Configure Environment** (30 seconds)
```bash
# Edit your server's environment file
nano Backend/.env.lb01  # Replace with actual Supabase & email credentials
```

**2. Deploy** (2 minutes)
```bash
./deploy-lb01.sh
```

**3. Access Your App** 
- 🌐 **Direct**: `http://54.235.237.101:8080`
- 🌐 **Nginx**: `http://54.235.237.101`

## 📱 Your Application URLs

After deployment, your iTABAZA booking system will be accessible at:

| Server | Direct Access | Nginx Proxy |
|--------|---------------|-------------|
| LB-01  | http://54.235.237.101:8080 | http://54.235.237.101 |
| Web01  | http://52.71.25.46:8080 | http://52.71.25.46 |
| Web02  | http://54.86.41.67:8080 | http://54.86.41.67 |

## 🔍 Environment Files Created

Pre-configured environment files for your servers:
- `Backend/.env.lb01` - For server 54.235.237.101
- `Backend/.env.web01` - For server 52.71.25.46
- `Backend/.env.web02` - For server 54.86.41.67

## 🛠️ What Each Script Does

1. **Tests SSH connection** to your server
2. **Creates deployment package** (excludes dev files)
3. **Uploads files** via rsync
4. **Installs dependencies** on the server
5. **Sets up PM2** (process manager)
6. **Configures Nginx** (reverse proxy)
7. **Starts your application**

## 🎉 Success Indicators

After deployment, you should see:
```bash
✅ SSH connection successful
✅ Files uploaded successfully  
✅ Dependencies installed
✅ Application started
✅ Nginx configured
🎉 Deployment completed successfully!
```

## 🔧 Management Commands

```bash
# Check application status
ssh -i ~/.ssh/school ubuntu@54.235.237.101 'pm2 status'

# View logs
ssh -i ~/.ssh/school ubuntu@54.235.237.101 'pm2 logs itabaza-booking'

# Restart application
ssh -i ~/.ssh/school ubuntu@54.235.237.101 'pm2 restart itabaza-booking'
```

## ⚠️ Important Notes

1. **Update Environment Variables**: Replace placeholder values in `.env` files with your actual:
   - Supabase credentials
   - JWT secret
   - Email credentials

2. **SSH Key**: Scripts assume `~/.ssh/school` - update if different

3. **Firewall**: Scripts configure UFW to allow necessary ports

4. **SSL**: For production, consider adding SSL certificates

## 🆘 Need Help?

If deployment fails, check:
1. SSH connection: `ssh -i ~/.ssh/school ubuntu@SERVER_IP`
2. Environment file: Ensure all required values are set
3. Server resources: Ensure adequate memory/disk space
4. Logs: `pm2 logs itabaza-booking`

## 🌟 The Result

Your iTABAZA booking system is now **100% deployment-ready** and can run on **any server** with these key improvements:

- 🌐 **Universal Access**: No more localhost limitations
- 🔄 **Auto-Configuration**: Adapts to any environment
- 🚀 **Production-Ready**: PM2, Nginx, security headers
- 📱 **Multi-Server**: Deploy to unlimited servers
- 🔧 **Easy Management**: Simple deployment and maintenance scripts

**Your application now works everywhere, not just localhost!** 🎉
