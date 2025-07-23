#!/bin/bash

# iTABAZA Booking System - Web01 Deployment Script
# Server: ubuntu@52.71.25.46

echo "🚀 Deploying iTABAZA Booking System to Web01 (52.71.25.46)..."

# Configuration
SERVER_IP="52.71.25.46"
SERVER_USER="ubuntu"
SSH_KEY="~/.ssh/school"
PROJECT_NAME="itabaza-booking"
REMOTE_DIR="/home/ubuntu/${PROJECT_NAME}"
ENV_FILE=".env.web01"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 Deployment Configuration:${NC}"
echo "  Server: ${SERVER_IP}"
echo "  User: ${SERVER_USER}"
echo "  Environment: Production (Web01)"
echo "  Directory: ${REMOTE_DIR}"
echo ""

# Check if environment file exists
if [ ! -f "Backend/${ENV_FILE}" ]; then
    echo -e "${RED}❌ Environment file Backend/${ENV_FILE} not found!${NC}"
    echo "Please copy Backend/${ENV_FILE} and configure it with your actual values."
    exit 1
fi

# Create deployment package
echo -e "${YELLOW}📦 Creating deployment package...${NC}"
mkdir -p dist
cp -r Backend dist/
cp -r Frontend dist/
cp Backend/${ENV_FILE} dist/Backend/.env
cp package.json dist/ 2>/dev/null || true

# Remove development files
rm -rf dist/Backend/node_modules
rm -rf dist/Frontend/node_modules

echo -e "${GREEN}✅ Deployment package created${NC}"

# Upload to server
echo -e "${YELLOW}📤 Uploading to server...${NC}"
rsync -avz --delete -e "ssh -i ${SSH_KEY}" \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.log' \
    dist/ ${SERVER_USER}@${SERVER_IP}:${REMOTE_DIR}/

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Files uploaded successfully${NC}"
else
    echo -e "${RED}❌ Upload failed${NC}"
    exit 1
fi

# Execute deployment commands on server
echo -e "${YELLOW}🔧 Setting up application on server...${NC}"
ssh -i ${SSH_KEY} ${SERVER_USER}@${SERVER_IP} << EOF
    cd ${REMOTE_DIR}
    
    echo "Installing dependencies..."
    cd Backend && npm install --production
    
    echo "Setting up PM2 process manager..."
    npm install -g pm2 2>/dev/null || sudo npm install -g pm2
    
    echo "Stopping existing application..."
    pm2 stop itabaza-booking 2>/dev/null || true
    pm2 delete itabaza-booking 2>/dev/null || true
    
    echo "Starting application..."
    pm2 start index.js --name "itabaza-booking" --env production
    pm2 save
    pm2 startup
    
    echo "Application status:"
    pm2 status
    
    echo "Setting up nginx (if not already configured)..."
    sudo apt update
    sudo apt install -y nginx
    
    # Create nginx configuration
    sudo tee /etc/nginx/sites-available/itabaza-booking << 'NGINX_EOF'
server {
    listen 80;
    server_name ${SERVER_IP};
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGINX_EOF
    
    sudo ln -sf /etc/nginx/sites-available/itabaza-booking /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl reload nginx
    
    echo "🎉 Deployment completed!"
    echo "Application URL: http://${SERVER_IP}:8080"
    echo "Nginx Proxy URL: http://${SERVER_IP}"
EOF

# Cleanup
rm -rf dist

echo -e "${GREEN}🎉 Deployment to Web01 completed successfully!${NC}"
echo -e "${YELLOW}📍 Your application is now running at:${NC}"
echo "  Direct: http://${SERVER_IP}:8080"
echo "  Nginx:  http://${SERVER_IP}"
echo ""
echo -e "${YELLOW}🔍 To check logs:${NC}"
echo "  ssh -i ${SSH_KEY} ${SERVER_USER}@${SERVER_IP} 'pm2 logs itabaza-booking'"
