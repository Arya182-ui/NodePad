# Deployment Checklist

Complete checklist before deploying NodePad to production.

## Pre-Deployment

### Code Quality
- [ ] All features tested and working
- [ ] No console.log statements in production code
- [ ] No commented-out code
- [ ] All TODO comments addressed
- [ ] Code follows style guide
- [ ] No hardcoded values
- [ ] Error handling implemented everywhere

### Security
- [ ] Environment variables properly configured
- [ ] No sensitive data in code
- [ ] .env files not committed to Git
- [ ] Rate limiting configured
- [ ] CORS properly set up
- [ ] Input validation on all endpoints
- [ ] File upload restrictions in place
- [ ] Helmet security headers enabled
- [ ] HTTPS enforced in production

### Database
- [ ] Firebase project created
- [ ] Firestore database initialized
- [ ] Security rules configured
- [ ] Indexes created (if needed)
- [ ] Backup strategy in place

### Storage
- [ ] Cloudinary account set up
- [ ] Upload folder configured
- [ ] Transformation settings optimized
- [ ] Quota limits checked

### Testing
- [ ] All API endpoints tested
- [ ] Frontend tested on Chrome
- [ ] Frontend tested on Firefox
- [ ] Frontend tested on Safari
- [ ] Mobile responsive design verified
- [ ] Image upload tested
- [ ] Search functionality tested
- [ ] Error scenarios tested
- [ ] Loading states verified

### Performance
- [ ] Images optimized
- [ ] API response times acceptable
- [ ] No memory leaks
- [ ] Build size optimized
- [ ] Lazy loading implemented (if needed)

### Documentation
- [ ] README.md updated
- [ ] API documentation current
- [ ] Environment variables documented
- [ ] Setup instructions verified
- [ ] Architecture docs updated

## Deployment Configuration

### Environment Variables

#### Production Server (.env)
```env
NODE_ENV=production
PORT=5000

# Firebase Production
FIREBASE_PROJECT_ID=prod-project-id
FIREBASE_PRIVATE_KEY="prod-private-key"
FIREBASE_CLIENT_EMAIL=prod-email@project.iam.gserviceaccount.com

# Cloudinary Production
CLOUDINARY_CLOUD_NAME=prod-cloud-name
CLOUDINARY_API_KEY=prod-api-key
CLOUDINARY_API_SECRET=prod-api-secret

# Security
JWT_SECRET=strong-random-secret-change-this
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Client URL
CLIENT_URL=https://your-domain.com
```

#### Production Client (.env)
```env
VITE_API_URL=https://api.your-domain.com/api
```

### Build Commands

#### Frontend Build
```bash
cd client
npm install
npm run build
# Output: client/dist/
```

#### Backend (No build needed)
```bash
cd server
npm install --production
```

## Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend)

#### Frontend on Vercel
1. [ ] Create Vercel account
2. [ ] Connect GitHub repository
3. [ ] Configure build settings:
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/dist`
   - Install Command: `cd client && npm install`
4. [ ] Add environment variables
5. [ ] Deploy

#### Backend on Render
1. [ ] Create Render account
2. [ ] Create new Web Service
3. [ ] Connect GitHub repository
4. [ ] Configure:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Root Directory: `server`
5. [ ] Add environment variables
6. [ ] Deploy

### Option 2: Netlify (Frontend) + Railway (Backend)

#### Frontend on Netlify
1. [ ] Create Netlify account
2. [ ] Connect repository
3. [ ] Configure:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`
4. [ ] Add environment variables
5. [ ] Deploy

#### Backend on Railway
1. [ ] Create Railway account
2. [ ] Create new project
3. [ ] Connect repository
4. [ ] Configure:
   - Root directory: `server`
   - Start command: `npm start`
5. [ ] Add environment variables
6. [ ] Deploy

### Option 3: Full Stack on Heroku

1. [ ] Create Heroku account
2. [ ] Install Heroku CLI
3. [ ] Create two apps (frontend, backend)
4. [ ] Configure buildpacks
5. [ ] Set environment variables
6. [ ] Deploy both apps

### Option 4: VPS (DigitalOcean, AWS, etc.)

1. [ ] Provision server
2. [ ] Install Node.js
3. [ ] Install PM2 for process management
4. [ ] Clone repository
5. [ ] Install dependencies
6. [ ] Configure environment variables
7. [ ] Set up Nginx reverse proxy
8. [ ] Configure SSL with Let's Encrypt
9. [ ] Start applications with PM2

## Post-Deployment

### Verification
- [ ] Visit production URL
- [ ] Test all features
- [ ] Create a note
- [ ] Edit a note
- [ ] Delete a note
- [ ] Upload an image
- [ ] Search notes
- [ ] Test on mobile device
- [ ] Check browser console for errors
- [ ] Verify API calls succeed

### Monitoring
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure uptime monitoring
- [ ] Set up analytics (Google Analytics, Plausible)
- [ ] Monitor API response times
- [ ] Check database usage
- [ ] Monitor storage usage

### DNS & SSL
- [ ] Domain purchased
- [ ] DNS configured
- [ ] SSL certificate installed
- [ ] HTTPS enforced
- [ ] WWW redirect configured

### Backup
- [ ] Database backup configured
- [ ] Backup schedule set
- [ ] Backup restoration tested

### Performance
- [ ] CDN configured (if needed)
- [ ] Caching headers set
- [ ] Compression enabled
- [ ] Load time acceptable (<3s)

## Maintenance

### Regular Tasks
- [ ] Monitor error logs
- [ ] Check uptime reports
- [ ] Review analytics
- [ ] Update dependencies monthly
- [ ] Test backup restoration quarterly
- [ ] Review security quarterly

### Updates
- [ ] Create staging environment
- [ ] Test updates in staging
- [ ] Deploy to production
- [ ] Verify deployment
- [ ] Monitor for issues

## Rollback Plan

### If Deployment Fails
1. [ ] Identify the issue
2. [ ] Check error logs
3. [ ] Revert to previous version
4. [ ] Fix issue locally
5. [ ] Test thoroughly
6. [ ] Redeploy

### Rollback Commands
```bash
# Git rollback
git revert HEAD
git push

# Or restore previous deployment
# (Platform-specific)
```

## Security Checklist

### Before Going Live
- [ ] Change all default passwords
- [ ] Use strong JWT secret
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set up Firestore security rules
- [ ] Enable HTTPS only
- [ ] Hide error stack traces in production
- [ ] Sanitize user inputs
- [ ] Implement CSP headers
- [ ] Regular security audits

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /notes/{noteId} {
      // Add authentication when ready
      allow read, write: if true;  // Temporary
      
      // Future with auth:
      // allow read, write: if request.auth != null;
    }
  }
}
```

## Performance Optimization

### Frontend
- [ ] Code splitting implemented
- [ ] Images lazy loaded
- [ ] Bundle size optimized
- [ ] Unused dependencies removed
- [ ] Service worker configured (PWA)

### Backend
- [ ] Database queries optimized
- [ ] Response compression enabled
- [ ] Caching implemented
- [ ] Connection pooling configured
- [ ] Rate limiting tuned

## Cost Optimization

### Free Tier Limits
- [ ] Firebase: 50K reads/day, 20K writes/day
- [ ] Cloudinary: 25 credits/month
- [ ] Vercel: 100GB bandwidth/month
- [ ] Render: 750 hours/month

### Monitor Usage
- [ ] Set up billing alerts
- [ ] Monitor API calls
- [ ] Track storage usage
- [ ] Review monthly costs

## Support & Documentation

### User Documentation
- [ ] User guide created
- [ ] FAQ documented
- [ ] Contact information provided
- [ ] Terms of service (if needed)
- [ ] Privacy policy (if needed)

### Developer Documentation
- [ ] API documentation complete
- [ ] Architecture documented
- [ ] Deployment guide updated
- [ ] Troubleshooting guide current

## Launch Checklist

### Final Steps
- [ ] All above items completed
- [ ] Team notified
- [ ] Users notified (if applicable)
- [ ] Social media announcement (if applicable)
- [ ] Monitor closely for first 24 hours
- [ ] Celebrate! 🎉

## Emergency Contacts

```
Developer: [Your Name]
Email: [Your Email]
Phone: [Your Phone]

Firebase Support: https://firebase.google.com/support
Cloudinary Support: https://support.cloudinary.com
Hosting Support: [Your hosting provider]
```

## Notes

- Keep this checklist updated
- Document any issues encountered
- Share learnings with team
- Iterate and improve

---

Good luck with your deployment! 🚀