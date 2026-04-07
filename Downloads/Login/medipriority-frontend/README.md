# MediPriority Frontend - React

React frontend for the MediPriority Triage System.

## Prerequisites

- Node.js 16+
- npm 7+ or yarn

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

The frontend will open at `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
```

## Configuration

Backend API URL is configured in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

Change this URL if your backend is running on a different port/domain.

## Project Structure

```
src/
├── App.js                      # Main app component with routing
├── index.js                    # Entry point
├── components/
│   └── ProtectedRoute.js       # Route protection wrapper
├── pages/
│   ├── Login.js                # Login page
│   ├── Register.js             # Registration page
│   ├── NurseDashboard.js       # Nurse dashboard
│   └── DoctorDashboard.js      # Doctor dashboard
├── services/
│   └── api.js                  # API client and endpoints
├── context/
│   └── AuthContext.js          # Authentication context
└── styles/
    ├── Auth.css                # Login/Register styles
    ├── Nurse.css               # Nurse dashboard styles
    └── Doctor.css              # Doctor dashboard styles
```

## Pages & Features

### Login Page (`/login`)
- User authentication
- Demo credentials displayed
- Role-based redirect after login
- Error handling

### Register Page (`/register`)
- New user registration
- Role selection (Nurse/Doctor)
- Password confirmation
- Client-side validation

### Nurse Dashboard (`/nurse/dashboard`)
- **Register Patient Tab**: Register new patients with vital signs
- **Update Vitals Tab**: Update existing patient vital signs
- Automatic triage level calculation display
- Real-time patient list

### Doctor Dashboard (`/doctor/dashboard`)
- **Queue Tab**: View prioritized patient queue
  - Sorted by triage level (highest priority first)
  - Emergency override indicator
  - Assign patient functionality
  
- **Patient Detail View**: 
  - Full patient information
  - Vital signs display
  - Clinical notes editor
  - Emergency override button
  - Mark as completed button

- **Completed Patients Tab**: 
  - Table view of all completed patients
  - Historical records

## Authentication

### Login Flow
1. User enters credentials
2. Frontend sends POST to `/api/auth/login`
3. Backend returns JWT token and user info
4. Token stored in `localStorage`
5. Token included in all subsequent requests
6. User redirected to appropriate dashboard based on role

### Protected Routes
- `/nurse/dashboard` - Only accessible to NURSE role
- `/doctor/dashboard` - Only accessible to DOCTOR role
- Non-authenticated users redirected to `/login`

### Demo Accounts

**Nurse:**
```
Username: nurse1
Password: password123
```

**Doctor:**
```
Username: doctor1
Password: password123
```

## API Integration

### API Client (`src/services/api.js`)
- Axios instance configured with base URL
- Automatic token injection in headers
- Centralized API endpoint definitions

### Available Endpoints

**Authentication**
```javascript
authAPI.register(userData)
authAPI.login(credentials)
authAPI.validateToken()
```

**Nurse**
```javascript
nurseAPI.registerPatient(patientData)
nurseAPI.updateVitals(patientId, vitalsData)
nurseAPI.getNursePatients()
```

**Doctor**
```javascript
doctorAPI.getQueue()
doctorAPI.assignPatient(patientId)
doctorAPI.completePatient(patientId, notes)
doctorAPI.updateNotes(patientId, notes)
doctorAPI.setEmergencyOverride(patientId, override)
doctorAPI.getCompletedPatients()
```

## State Management

### AuthContext (`src/context/AuthContext.js`)
Manages:
- User authentication state
- Login/logout operations
- User data (id, username, role, name)
- Token management
- Loading state

Usage:
```javascript
const { user, loading, login, register, logout } = useAuth();
```

## Styling

### Colors & Design
- Primary: #667eea (Purple)
- Secondary: #764ba2 (Dark Purple)
- Error: #d32f2f (Red)
- Success: #2e7d32 (Green)
- Warning: #f57c00 (Orange)

### Triage Level Colors
- Level 1 (Critical): Red (#d32f2f)
- Level 2 (Emergency): Orange (#f57c00)
- Level 3 (Urgent): Yellow (#fbc02d)
- Level 4 (Semi-Urgent): Green (#7cb342)
- Level 5 (Non-Urgent): Blue (#1976d2)

### Responsive Design
- Mobile-first approach
- Breakpoints: 768px, 1024px, 1200px
- Flexible grid layouts

## Error Handling

- API errors caught and displayed to user
- Validation errors shown on forms
- Network errors handled gracefully
- Token expiration redirects to login

## Development

### Environment Variables

Create `.env` file in root directory:
```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

### Debug Mode

Add debug logging in API calls:
```javascript
// In api.js interceptors
console.log('Request:', config);
console.log('Response:', response);
```

### Browser DevTools
- Check Network tab for API requests/responses
- Check Application > Local Storage for token
- React DevTools extension recommended

## Build & Deployment

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

Generates optimized build in `build/` directory.

### Deploy to Netlify/Vercel
1. Build: `npm run build`
2. Point to `build/` directory
3. Set environment variables
4. Deploy

### Deploy to Apache/Nginx
```bash
npm run build
# Copy contents of build/ to web server
sudo cp -r build/* /var/www/html/
```

Configure server for SPA routing (all routes to index.html).

## Troubleshooting

### Port 3000 Already in Use
```bash
PORT=3001 npm start
```

### CORS Errors
- Verify backend is running
- Check API_BASE_URL in api.js
- Verify CORS configuration in backend

### Login Failed
- Verify backend is accessible at `http://localhost:8080`
- Check demo credentials
- Clear localStorage and try again

### Blank Page
- Check browser console for errors
- Verify Node modules installed: `npm install`
- Clear cache: `npm cache clean --force`

### API Calls Not Working
- Check Network tab in DevTools
- Verify token in Local Storage
- Check backend logs
- Verify API endpoint URLs

## Performance Optimization

1. **Code Splitting**: React.lazy() for route components
2. **Memoization**: React.memo() for components
3. **Lazy Loading**: Images and components
4. **Bundle Analysis**: `npm run build -- --analyze`

## Security Notes

- JWT tokens stored in localStorage (consider using httpOnly cookies)
- Sensitive data not stored in localStorage
- Auto-logout on token expiration
- CORS properly configured

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

- **react**: UI library
- **react-dom**: React DOM rendering
- **react-router-dom**: Client-side routing
- **axios**: HTTP client

## Scripts

```bash
npm start       # Start development server
npm run build   # Create production build
npm test        # Run tests
npm run eject   # Eject from Create React App (not reversible)
```

---

**Version**: 1.0.0  
**React**: 18.2.0  
**Node**: 16+
