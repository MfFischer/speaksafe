# 🚀 SpeakSafe Production Deployment Guide

This guide provides comprehensive instructions for deploying SpeakSafe to production with full blockchain and backend infrastructure.

## 📋 Prerequisites

### System Requirements
- **Server**: Ubuntu 20.04+ or similar Linux distribution
- **RAM**: Minimum 8GB, Recommended 16GB+
- **Storage**: Minimum 100GB SSD
- **CPU**: 4+ cores
- **Network**: Stable internet connection with public IP

### Required Software
- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+
- Git
- SSL certificates (Let's Encrypt recommended)

### Required Accounts & Keys
- **Polygon RPC URL** (Alchemy, Infura, or QuickNode)
- **IPFS API access** (Infura IPFS or self-hosted)
- **Domain name** with DNS access
- **SSL certificates**
- **Wallet private key** for contract deployment

## 🔧 Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/MfFischer/speaksafe.git
cd speaksafe
```

### 2. Create Environment Files

Create `.env.production`:
```bash
# Server Configuration
NODE_ENV=production
PORT=3001
API_VERSION=v1

# Database Configuration
DATABASE_URL=postgresql://speaksafe:SECURE_PASSWORD@postgres:5432/speaksafe
POSTGRES_PASSWORD=SECURE_PASSWORD

# Redis Configuration
REDIS_URL=redis://redis:6379

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-256-bits-minimum
JWT_EXPIRES_IN=7d

# Encryption
ENCRYPTION_KEY=your-32-character-encryption-key-here

# Blockchain Configuration
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your-wallet-private-key-for-deployment

# IPFS Configuration
IPFS_API_URL=https://ipfs.infura.io:5001
IPFS_GATEWAY_URL=https://ipfs.infura.io
IPFS_PROJECT_ID=your-infura-project-id
IPFS_PROJECT_SECRET=your-infura-project-secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Security
CORS_ORIGIN=https://yourdomain.com
HELMET_CSP_DIRECTIVES=default-src 'self'

# Monitoring
GRAFANA_PASSWORD=secure-grafana-password
```

## 🏗️ Infrastructure Deployment

### 1. Deploy Smart Contracts

```bash
# Navigate to contracts directory
cd contracts

# Install dependencies
npm ci

# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to Polygon mainnet
npm run deploy:polygon

# Save contract addresses to environment
```

### 2. Setup Zero-Knowledge Circuits

```bash
# Navigate to ZK circuits directory
cd ../zk-circuits

# Install dependencies
npm ci

# Compile circuits (this may take 30+ minutes)
npm run compile:all

# Setup trusted setup (this may take 1+ hours)
npm run setup

# Test circuits
npm test
```

### 3. Deploy Backend Infrastructure

```bash
# Return to root directory
cd ..

# Start infrastructure services
docker-compose up -d postgres redis ipfs

# Wait for services to be ready
sleep 30

# Run database migrations
docker-compose exec backend npm run migrate

# Start backend service
docker-compose up -d backend
```

### 4. Deploy Frontend

```bash
# Build frontend
cd frontend
npm ci
npm run build

# Deploy to your hosting provider (Vercel, Netlify, etc.)
# Or serve with nginx in Docker
cd ..
docker-compose up -d frontend nginx
```

## 🔒 Security Configuration

### 1. SSL/TLS Setup

```bash
# Install Certbot for Let's Encrypt
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 3. Security Headers

Update `nginx/nginx.conf` with security headers:
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

## 📊 Monitoring Setup

### 1. Start Monitoring Services

```bash
# Start monitoring stack
docker-compose up -d prometheus grafana loki promtail

# Access Grafana at http://yourdomain.com:3003
# Default login: admin / your-grafana-password
```

### 2. Configure Alerts

Set up alerts for:
- High CPU/Memory usage
- Database connection issues
- Blockchain network issues
- IPFS node problems
- Application errors

## 🔄 Backup Strategy

### 1. Database Backups

```bash
# Create backup script
cat > backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR
docker-compose exec -T postgres pg_dump -U speaksafe speaksafe > $BACKUP_DIR/database.sql
gzip $BACKUP_DIR/database.sql
EOF

chmod +x backup-db.sh

# Schedule daily backups
crontab -e
# Add: 0 2 * * * /path/to/backup-db.sh
```

### 2. IPFS Data Backup

```bash
# Backup IPFS data
docker cp $(docker-compose ps -q ipfs):/data/ipfs /backups/ipfs-$(date +%Y%m%d)
```

## 🚀 Deployment Process

### 1. Zero-Downtime Deployment

```bash
# Pull latest code
git pull origin main

# Build new images
docker-compose build

# Rolling update
docker-compose up -d --no-deps backend
docker-compose up -d --no-deps frontend

# Verify deployment
curl -f https://api.yourdomain.com/health
```

### 2. Rollback Procedure

```bash
# Rollback to previous version
git checkout previous-commit-hash
docker-compose build
docker-compose up -d --no-deps backend frontend

# Restore database if needed
gunzip -c /backups/latest/database.sql.gz | docker-compose exec -T postgres psql -U speaksafe speaksafe
```

## 📈 Performance Optimization

### 1. Database Optimization

```sql
-- Create indexes for better performance
CREATE INDEX CONCURRENTLY idx_reports_status ON reports(status);
CREATE INDEX CONCURRENTLY idx_reports_category ON reports(category);
CREATE INDEX CONCURRENTLY idx_reports_created_at ON reports(created_at);
CREATE INDEX CONCURRENTLY idx_donations_donor_address ON donations(donor_address);
CREATE INDEX CONCURRENTLY idx_dao_votes_report_id ON dao_votes(report_id);
```

### 2. Redis Caching

Configure Redis for:
- Session storage
- API response caching
- Rate limiting
- Real-time data caching

### 3. CDN Setup

Configure CDN for:
- Static assets
- IPFS gateway
- Frontend distribution

## 🔍 Health Monitoring

### 1. Health Check Endpoints

- Backend: `https://api.yourdomain.com/health`
- Frontend: `https://yourdomain.com/health`
- Database: Monitor via Grafana
- IPFS: Monitor via Prometheus

### 2. Log Monitoring

```bash
# View application logs
docker-compose logs -f backend

# View system logs
journalctl -f

# View nginx logs
docker-compose logs -f nginx
```

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check PostgreSQL service status
   - Verify connection string
   - Check firewall rules

2. **Blockchain Connection Issues**
   - Verify RPC URL
   - Check API key limits
   - Monitor gas prices

3. **IPFS Issues**
   - Check IPFS node status
   - Verify API credentials
   - Monitor storage usage

4. **High Memory Usage**
   - Monitor Docker container resources
   - Check for memory leaks
   - Optimize database queries

### Emergency Contacts

- **System Administrator**: [Your contact]
- **Blockchain Developer**: [Your contact]
- **Security Team**: [Your contact]

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Polygon Documentation](https://docs.polygon.technology/)
- [IPFS Documentation](https://docs.ipfs.io/)
- [Grafana Documentation](https://grafana.com/docs/)

---

**⚠️ Important Security Notes:**
- Never commit private keys or secrets to version control
- Regularly update all dependencies and base images
- Monitor security advisories for all components
- Implement proper access controls and audit logging
- Regular security audits and penetration testing
