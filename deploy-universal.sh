#!/bin/bash

# iTABAZA Booking System - Universal Deployment Script
# Deploy to any server with custom configuration

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to display usage
show_usage() {
    echo -e "${BLUE}iTABAZA Booking System - Universal Deployment Script${NC}"
    echo ""
    echo "Usage: $0 -i SERVER_IP -u USER [-k SSH_KEY] [-p PORT] [-d DOMAIN] [-e ENV_FILE]"
    echo ""
    echo "Required parameters:"
    echo "  -i SERVER_IP    Target server IP address"
    echo "  -u USER         SSH username (e.g., ubuntu)"
    echo ""
    echo "Optional parameters:"
    echo "  -k SSH_KEY      SSH private key path (default: ~/.ssh/school)"
    echo "  -p PORT         Application port (default: 8080)"
    echo "  -d DOMAIN       Server domain name for CORS configuration"
    echo "  -e ENV_FILE     Environment file to use (default: .env.template)"
    echo ""
    echo "Examples:"
    echo "  $0 -i 54.235.237.101 -u ubuntu"
    echo "  $0 -i 52.71.25.46 -u ubuntu -k ~/.ssh/mykey -p 3000"
    echo "  $0 -i mydomain.com -u ubuntu -d mydomain.com -e .env.production"
}

# Parse command line arguments
while getopts "i:u:k:p:d:e:h" opt; do
    case $opt in
        i) SERVER_IP="$OPTARG" ;;
        u) SERVER_USER="$OPTARG" ;;
        k) SSH_KEY="$OPTARG" ;;
        p) SERVER_PORT="$OPTARG" ;;
        d) SERVER_DOMAIN="$OPTARG" ;;
        e) ENV_FILE="$OPTARG" ;;
        h) show_usage; exit 0 ;;
        \?) echo "Invalid option -$OPTARG" >&2; show_usage; exit 1 ;;
    esac
done

# Validate required parameters
if [ -z "$SERVER_IP" ] || [ -z "$SERVER_USER" ]; then
    echo -e "${RED}❌ Error: SERVER_IP and USER are required parameters${NC}"
    show_usage
    exit 1
fi

# Set defaults
SSH_KEY="${SSH_KEY:-~/.ssh/school}"
SERVER_PORT="${SERVER_PORT:-8080}"
SERVER_DOMAIN="${SERVER_DOMAIN:-$SERVER_IP}"
ENV_FILE="${ENV_FILE:-.env.template}"
PROJECT_NAME="itabaza-booking"
REMOTE_DIR="/home/$SERVER_USER/${PROJECT_NAME}"

echo -e "${BLUE}🚀 iTABAZA Universal Deployment${NC}"
echo -e "${YELLOW}📋 Deployment Configuration:${NC}"
echo "  Server IP: $SERVER_IP"
echo "  User: $SERVER_USER"
echo "  SSH Key: $SSH_KEY"
echo "  Port: $SERVER_PORT"
echo "  Domain: $SERVER_DOMAIN"
echo "  Environment: $ENV_FILE"
echo "  Remote Directory: $REMOTE_DIR"
echo ""

# Test SSH connection
echo -e "${YELLOW}🔐 Testing SSH connection...${NC}"
if ! ssh -i "$SSH_KEY" -o ConnectTimeout=10 -o BatchMode=yes "$SERVER_USER@$SERVER_IP" echo "Connection successful" 2>/dev/null; then
    echo -e "${RED}❌ SSH connection failed. Please check:${NC}"
    echo "  - Server IP: $SERVER_IP"
    echo "  - SSH Key: $SSH_KEY"
    echo "  - User: $SERVER_USER"
    exit 1
fi
echo -e "${GREEN}✅ SSH connection successful${NC}"

# Check if environment file exists
if [ ! -f "Backend/$ENV_FILE" ]; then
    echo -e "${YELLOW}⚠️  Environment file Backend/$ENV_FILE not found${NC}"
    echo "Creating basic environment file..."
    
    # Create a basic environment file
    cat > "Backend/.env.deploy" << EOF
# iTABAZA Booking System - Auto-generated Environment Configuration
# Server: $SERVER_USER@$SERVER_IP

# Supabase Configuration (PLEASE UPDATE WITH YOUR ACTUAL VALUES)
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_here_$(date +%s)

# Email Configuration (for nodemailer)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# Server Configuration
PORT=$SERVER_PORT
HOST=0.0.0.0
NODE_ENV=production

# Deployment Configuration
SERVER_DOMAIN=$SERVER_DOMAIN
ALLOWED_ORIGINS=http://$SERVER_DOMAIN:$SERVER_PORT,https://$SERVER_DOMAIN:$SERVER_PORT,http://$SERVER_DOMAIN,https://$SERVER_DOMAIN

# Redis Configuration (optional)
# redisPassword=your_redis_password
# redisHost=your_redis_host
# redisPort=your_redis_port
EOF
    
    ENV_FILE=".env.deploy"
    echo -e "${YELLOW}📝 Please edit Backend/$ENV_FILE with your actual configuration before continuing${NC}"
    echo -e "${YELLOW}Press Enter to continue after editing, or Ctrl+C to abort...${NC}"
    read -r
fi

# Create deployment package
echo -e "${YELLOW}📦 Creating deployment package...${NC}"
rm -rf dist
mkdir -p dist
cp -r Backend dist/
cp -r Frontend dist/
cp "Backend/$ENV_FILE" dist/Backend/.env
cp package.json dist/ 2>/dev/null || true

# Remove development files
rm -rf dist/Backend/node_modules
rm -rf dist/Frontend/node_modules
rm -rf dist/Backend/.env.*
rm -f dist/Backend/env-template.txt

echo -e "${GREEN}✅ Deployment package created${NC}"

# Upload to server
echo -e "${YELLOW}📤 Uploading to server...${NC}"
rsync -avz --delete -e "ssh -i $SSH_KEY" \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.log' \
    dist/ "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Files uploaded successfully${NC}"
else
    echo -e "${RED}❌ Upload failed${NC}"
    exit 1
fi

# Execute deployment commands on server
echo -e "${YELLOW}🔧 Setting up application on server...${NC}"
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" << EOF
    set -e
    cd $REMOTE_DIR
    
    echo "📥 Installing Node.js (if not already installed)..."
    if ! command -v node &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
    
    echo "📦 Installing dependencies..."
    cd Backend && npm install --production
    
    echo "🔄 Setting up PM2 process manager..."
    if ! command -v pm2 &> /dev/null; then
        sudo npm install -g pm2
    fi
    
    echo "🛑 Stopping existing application..."
    pm2 stop $PROJECT_NAME 2>/dev/null || true
    pm2 delete $PROJECT_NAME 2>/dev/null || true
    
    echo "🚀 Starting application..."
    pm2 start index.js --name "$PROJECT_NAME" --env production
    pm2 save
    pm2 startup ubuntu 2>/dev/null || pm2 startup 2>/dev/null || true
    
    echo "📊 Application status:"
    pm2 status
    
    echo "🌍 Setting up Nginx reverse proxy..."
    if ! command -v nginx &> /dev/null; then
        sudo apt update
        sudo apt install -y nginx
    fi
    
    # Create nginx configuration
    sudo tee /etc/nginx/sites-available/$PROJECT_NAME << 'NGINX_EOF'
server {
    listen 80;
    server_name $SERVER_DOMAIN;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    location / {
        proxy_pass http://localhost:$SERVER_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
NGINX_EOF
    
    # Enable site
    sudo ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
    
    # Test and reload nginx
    if sudo nginx -t; then
        sudo systemctl enable nginx
        sudo systemctl restart nginx
        echo "✅ Nginx configured successfully"
    else
        echo "❌ Nginx configuration error"
    fi
    
    # Setup firewall
    if command -v ufw &> /dev/null; then
        echo "🔒 Configuring firewall..."
        sudo ufw --force enable
        sudo ufw allow ssh
        sudo ufw allow 80
        sudo ufw allow 443
        sudo ufw allow $SERVER_PORT
    fi
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo "📍 Application URLs:"
    echo "  Direct: http://$SERVER_DOMAIN:$SERVER_PORT"
    echo "  Nginx:  http://$SERVER_DOMAIN"
    echo ""
    echo "🔍 Useful commands:"
    echo "  Check status: pm2 status"
    echo "  View logs:    pm2 logs $PROJECT_NAME"
    echo "  Restart:      pm2 restart $PROJECT_NAME"
EOF

# Cleanup
rm -rf dist

echo -e "${GREEN}🎉 Universal deployment completed successfully!${NC}"
echo ""
echo -e "${YELLOW}📍 Your iTABAZA Booking System is now running at:${NC}"
echo "  🌐 Direct Access: http://$SERVER_DOMAIN:$SERVER_PORT"
echo "  🌐 Nginx Proxy:   http://$SERVER_DOMAIN"
echo ""
echo -e "${YELLOW}🔧 Management Commands:${NC}"
echo "  📊 Check status: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 status'"
echo "  📋 View logs:    ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 logs $PROJECT_NAME'"
echo "  🔄 Restart:      ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 restart $PROJECT_NAME'"
echo ""
echo -e "${BLUE}🎯 Next Steps:${NC}"
echo "1. Update your environment variables in Backend/$ENV_FILE with actual values"
echo "2. Test the application in your browser"
echo "3. Consider setting up SSL certificates for production use"
echo "4. Monitor the application logs for any issues"
