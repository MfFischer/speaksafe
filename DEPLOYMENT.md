# 🚀 SpeakSafe Deployment Guide

This guide covers deploying SpeakSafe to various platforms for development, testing, and production use.

## 📋 Prerequisites

- Node.js 18+ installed
- Git configured
- GitHub account
- Vercel account (for deployment)

## 🔧 Local Development

### Quick Start
```bash
# Clone the repository
git clone https://github.com/MfFischer/speaksafe.git
cd speaksafe

# Install dependencies
cd frontend
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:3000`

## 🌐 Vercel Deployment

### Automatic Deployment (Recommended)

1. **Connect GitHub Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `speaksafe` repository

2. **Configure Build Settings**
   - Framework Preset: `Create React App`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application
   - You'll get a live URL like `https://speaksafe-xyz.vercel.app`

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel --prod

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name: speaksafe
# - Directory: frontend
```

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json
    
    - name: Install dependencies
      run: cd frontend && npm ci
    
    - name: Build application
      run: cd frontend && npm run build
    
    - name: Deploy to Vercel
      uses: vercel/action@v1
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: frontend
```

## 🌍 Custom Domain Setup

### Vercel Custom Domain

1. **Purchase Domain** (recommended: Namecheap, Google Domains)
2. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your domain (e.g., `speaksafe.org`)
3. **Configure DNS**
   - Add CNAME record: `www` → `cname.vercel-dns.com`
   - Add A record: `@` → `76.76.19.61`
4. **SSL Certificate**
   - Vercel automatically provides SSL certificates
   - Your site will be available at `https://yourdomain.com`

## 🔒 Environment Variables

### Production Environment Variables

Create environment variables in Vercel dashboard:

```bash
# API Configuration
REACT_APP_API_URL=https://api.speaksafe.org
REACT_APP_ENVIRONMENT=production

# Blockchain Configuration
REACT_APP_POLYGON_RPC_URL=https://polygon-rpc.com
REACT_APP_CONTRACT_ADDRESS=0x...

# Analytics (Optional)
REACT_APP_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

### Local Environment Variables

Create `frontend/.env.local`:

```bash
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development
REACT_APP_POLYGON_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/your-key
```

## 📊 Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
cd frontend
npm install -g webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

### Vercel Performance Settings

- **Edge Functions**: Enable for faster response times
- **Image Optimization**: Automatic image optimization
- **Compression**: Gzip/Brotli compression enabled by default

## 🔍 Monitoring & Analytics

### Vercel Analytics

Enable in Vercel dashboard:
- Real User Monitoring (RUM)
- Core Web Vitals tracking
- Performance insights

### Error Tracking (Optional)

Add Sentry for error tracking:

```bash
cd frontend
npm install @sentry/react @sentry/tracing
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Routing Issues**
   - Ensure `vercel.json` includes SPA rewrites
   - Check that all routes are properly configured

3. **Environment Variables**
   - Verify all required environment variables are set
   - Restart deployment after adding new variables

### Debug Mode

```bash
# Enable debug mode
cd frontend
DEBUG=* npm start
```

## 📈 Scaling Considerations

### Future Infrastructure

As the project grows, consider:

- **CDN**: Cloudflare for global content delivery
- **Database**: PostgreSQL for backend data
- **Blockchain**: Polygon mainnet for production
- **IPFS**: Decentralized storage for reports
- **Load Balancing**: Multiple server instances

## 🎯 Grant Application Deployment

### Demo URL for Grants

Your deployed application will be available at:
- **Primary**: `https://speaksafe.vercel.app`
- **Custom Domain**: `https://yourdomain.com` (when configured)

### Features to Highlight

- ✅ Complete user journey demonstration
- ✅ Professional UI/UX design
- ✅ Mobile-responsive interface
- ✅ Accessibility compliance
- ✅ Multi-language ready architecture
- ✅ Blockchain integration ready

---

**Your SpeakSafe deployment is now ready to showcase to grant organizations and potential partners!**
