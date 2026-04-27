# Development Guide

Guide for developers working on NodePad.

## Development Environment Setup

### Required Tools
- Node.js v16+
- npm or yarn
- Git
- VS Code (recommended)
- Postman or Thunder Client (API testing)

### Recommended VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- ESLint
- Prettier
- Auto Rename Tag
- Path Intellisense
- Thunder Client (API testing)

## Project Setup

```bash
# Clone repository
git clone <repo-url>
cd nodepad

# Install all dependencies
cd server && npm install
cd ../client && npm install

# Set up environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env
# Edit .env files with your credentials

# Start development
cd server && npm run dev    # Terminal 1
cd client && npm run dev    # Terminal 2
```

## Development Workflow

### 1. Feature Development

**Step 1: Plan**
- Define feature requirements
- Identify affected components
- Plan API endpoints if needed

**Step 2: Backend (if needed)**
```bash
cd server/src

# Add controller function
# controllers/notes.controller.js

# Add route
# routes/notes.routes.js

# Test with Thunder Client/Postman
```

**Step 3: Frontend**
```bash
cd client/src

# Add API call
# services/api.js

# Create/update component
# components/ or pages/

# Add styling
# component.css
```

**Step 4: Test**
- Manual testing in browser
- Check console for errors
- Test edge cases
- Verify responsive design

### 2. Code Style

**JavaScript/React**
```javascript
// Use functional components
function MyComponent() {
  // Hooks at the top
  const [state, setState] = useState(null);
  
  // Event handlers
  const handleClick = () => {
    // Logic here
  };
  
  // Render
  return <div>Content</div>;
}

// Named exports for utilities
export const utilityFunction = () => {};

// Default export for components
export default MyComponent;
```

**CSS**
```css
/* Use CSS variables */
.my-component {
  background: var(--surface);
  color: var(--text);
}

/* BEM-like naming */
.component-name { }
.component-name__element { }
.component-name--modifier { }
```

**File Naming**
- Components: PascalCase (NoteCard.jsx)
- Utilities: camelCase (api.js)
- Styles: match component (NoteCard.css)

### 3. Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/my-feature
```

**Commit Message Format**
```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
test: add tests
chore: update dependencies
```

## Testing

### Manual Testing Checklist

**For New Features**
- [ ] Feature works as expected
- [ ] Error handling works
- [ ] Loading states display
- [ ] Success/error messages show
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] API calls succeed

**For Bug Fixes**
- [ ] Bug is resolved
- [ ] No new bugs introduced
- [ ] Related features still work
- [ ] Edge cases handled

### API Testing with Thunder Client

1. Install Thunder Client in VS Code
2. Create new request
3. Set method (GET, POST, etc.)
4. Set URL (http://localhost:5000/api/...)
5. Add body for POST/PUT
6. Send and verify response

**Example: Create Note**
```
POST http://localhost:5000/api/notes
Content-Type: application/json

{
  "title": "Test Note",
  "content": "Test content",
  "tags": ["test"]
}
```

## Debugging

### Frontend Debugging

**React DevTools**
- Install React DevTools extension
- Inspect component props and state
- Track component renders

**Console Debugging**
```javascript
// Log state changes
console.log('Current state:', state);

// Log API responses
console.log('API response:', response);

// Log errors
console.error('Error:', error);
```

**Network Tab**
- Check API calls
- Verify request/response
- Check status codes
- Inspect headers

### Backend Debugging

**Console Logging**
```javascript
// Log incoming requests
console.log('Request body:', req.body);

// Log database queries
console.log('Fetching notes...');

// Log errors
console.error('Error:', error.message);
```

**Postman/Thunder Client**
- Test endpoints directly
- Verify request format
- Check response structure

## Common Issues

### Port Already in Use
```bash
# Find process using port
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows

# Or change port in .env
PORT=5001
```

### Firebase Connection Error
- Verify credentials in .env
- Check private key format (needs \n)
- Ensure Firestore is enabled
- Check Firebase project ID

### Cloudinary Upload Fails
- Verify API credentials
- Check file size (max 5MB)
- Ensure valid image format
- Check network connection

### CORS Error
- Verify CLIENT_URL in server .env
- Check CORS configuration
- Ensure ports match

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Performance Optimization

### Frontend
- Lazy load components
- Optimize images
- Minimize re-renders
- Use React.memo for expensive components
- Debounce search input

### Backend
- Add database indexes
- Implement caching
- Optimize queries
- Use pagination
- Compress responses

## Security Checklist

- [ ] Input validation on all endpoints
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] File upload restrictions
- [ ] Error messages don't leak info
- [ ] HTTPS in production

## Deployment Preparation

### Pre-deployment Checklist
- [ ] All features tested
- [ ] No console errors
- [ ] Environment variables documented
- [ ] README updated
- [ ] API documentation current
- [ ] Build succeeds
- [ ] Production config ready

### Build Commands
```bash
# Frontend build
cd client
npm run build

# Backend (no build needed)
cd server
npm start
```

## Adding New Dependencies

```bash
# Frontend
cd client
npm install package-name

# Backend
cd server
npm install package-name

# Update documentation
# Mention new dependency in README
```

## Code Review Guidelines

**What to Check**
- Code follows style guide
- No console.logs in production code
- Error handling present
- Comments where needed (not obvious code)
- No hardcoded values
- Responsive design
- Accessibility considerations

**Questions to Ask**
- Is this the simplest solution?
- Is it maintainable?
- Are edge cases handled?
- Is it secure?
- Does it scale?

## Resources

### Learning
- [React Docs](https://react.dev/)
- [Express Guide](https://expressjs.com/en/guide/routing.html)
- [Firebase Docs](https://firebase.google.com/docs/firestore)
- [MDN Web Docs](https://developer.mozilla.org/)

### Tools
- [Can I Use](https://caniuse.com/) - Browser compatibility
- [Regex101](https://regex101.com/) - Test regex
- [JSON Formatter](https://jsonformatter.org/) - Format JSON

## Getting Help

1. Check documentation
2. Search error message
3. Check console/network tab
4. Review similar code
5. Ask team/community

## Next Steps

- Add unit tests (Jest)
- Add E2E tests (Cypress)
- Set up CI/CD
- Add monitoring
- Implement analytics

Happy coding! 🚀