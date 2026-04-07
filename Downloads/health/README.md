# MediPriority - Triage Management System

A comprehensive React-based Emergency Room Triage Management System that prioritizes patients based on severity levels and manages the queue efficiently.

## 🏥 Project Overview

MediPriority is a full-stack healthcare application designed to streamline ER operations by:
- **Patient Registration**: Nurses register patients with name, age, and initial triage level (1-5)
- **Priority Queue**: Automatic sorting based on triage levels (1 = Critical, 5 = Non-Urgent)
- **Vitals Tracking**: Automatic triage level upgrades based on vital signs
- **Emergency Override**: Level 1 patients jump to the front of the queue
- **Doctor Assignment**: Doctors assign and manage patients from the queue
- **Real-time Updates**: Queue updates reflect status changes immediately

## 🎯 Key Features

### Nurse Portal
- Register new patients with demographics
- Input and track vital signs (Heart Rate, Blood Pressure)
- View prioritized patient queue
- Mark patients as emergencies (Level 1)
- Monitor patient status in real-time

### Doctor Portal
- View patients sorted by priority
- Assign patients to self for examination
- Update patient status (Examining, Treated, Discharged, Referred)
- Real-time statistics dashboard
- Queue summary by priority level

### Smart Triage Logic
- **Automatic Level Upgrades**:
  - Heart Rate > 120 bpm or < 60 bpm → Level 2
  - Blood Pressure > 160/100 or < 90/60 → Level 2
- **Priority Levels**:
  1. Critical (Immediate)
  2. Urgent (30 minutes)
  3. Semi-Urgent (1 hour)
  4. Low (2-3 hours)
  5. Non-Urgent (Routine)

## 📁 Project Structure

```
src/
├── api/                    # API calls
│   ├── authApi.js         # Login/Register
│   └── patientApi.js      # Patient operations
├── components/            # Reusable UI components
│   ├── common/
│   │   ├── Button.jsx     # Reusable button
│   │   └── Input.jsx      # Reusable input
│   └── queue/
│       ├── QueueCard.jsx  # Patient card
│       └── QueueList.jsx  # Queue display
├── features/             # Feature modules
│   ├── auth/
│   │   ├── Login.jsx      # Login form
│   │   └── Register.jsx   # Registration form
│   ├── nurse/
│   │   ├── PatientForm.jsx
│   │   └── NurseDashboard.jsx
│   └── doctor/
│       └── DoctorDashboard.jsx
├── pages/               # Route pages
├── routes/              # Router config
├── utils/               # Utility functions
├── App.jsx             # Main component
└── main.jsx            # Entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to project directory:
```bash
cd health
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 👥 Demo Credentials

### Nurse Account
- **Username**: nurse1
- **Password**: nurse123

### Doctor Account
- **Username**: doctor1
- **Password**: doctor123

## 🔑 API Endpoints (Mock)

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Patient Management (Nurse)
- `POST /api/patients` - Register new patient
- `PUT /api/patients/{id}/vitals` - Update vitals
- `PUT /api/patients/{id}/emergency` - Mark emergency
- `GET /api/patients/queue` - Get priority queue

### Patient Management (Doctor)
- `GET /api/patients/queue` - Get priority queue
- `PUT /api/patients/{id}/assign` - Assign to doctor
- `PUT /api/patients/{id}/status` - Update status
- `GET /api/patients/doctor/{doctorId}` - Get doctor's patients

### Common
- `GET /api/patients/{id}` - Get patient details
- `GET /api/patients/{id}/history` - Get patient history
- `GET /api/users` - Get all users

## 🎨 Technology Stack

- **React 18**: UI library
- **React Router v6**: Client-side routing
- **Tailwind CSS**: Styling framework
- **Vite**: Build tool
- **Mock API**: In-memory data storage (frontend only)

## 💡 Workflow

1. **Nurse Login** → Receives nurse credentials
2. **Patient Registration** → Enters name, age, initial level
3. **Vitals Check** → Updates HR and BP
4. **Auto-Upgrade** → Level upgrades if vitals abnormal
5. **Emergency Button** → Can mark patient as Level 1
6. **Queue View** → Nurse sees sorted patient queue

7. **Doctor Login** → Receives doctor credentials
8. **Queue View** → Sees all patients sorted by level
9. **Assign Patient** → Claims patient for examination
10. **Status Update** → Updates patient condition
11. **Real-time Sync** → Nurse dashboard updates instantly

## 📝 Triage Level Decision Tree

```
Register Patient (Level 1-5)
  ↓
Check Vitals?
  ├─ Yes → Calculate Recommended Level
  │   ├─ HR > 120 or < 60 → Upgrade to Level 2
  │   ├─ BP abnormal → Upgrade to Level 2
  │   └─ Apply recommended level
  └─ No → Keep initial level
  ↓
Add to Priority Queue
  (Sorted: 1, 2, 3, 4, 5)
  ↓
Doctor Views Queue → Assigns Patient
  ↓
Doctor Examines → Updates Status
  ↓
Nurse Sees Real-time Update
```

## 🔐 Authentication

- Credentials stored in mock database
- JWT tokens simulated (localStorage)
- Role-based access control
- Auto-redirect on unauthorized access

## 🎯 State Management

Using React hooks (useState, useEffect) with:
- LocalStorage for user persistence
- Mock API responses with 500ms delay (simulating network)
- Real-time queue updates via function reloads

## 📱 Responsive Design

- Mobile-friendly UI
- Adaptive grid layouts
- Touch-friendly buttons
- Responsive navigation

## 🚀 Build for Production

```bash
npm run build
```

Output files in `dist/` directory

## 📦 Dependencies

See `package.json` for complete list:
- react: ^18.2.0
- react-dom: ^18.2.0
- react-router-dom: ^6.20.0
- tailwindcss: ^3.4.1

## 🎓 Learning Outcomes

This project demonstrates:
- React component composition
- React Router for navigation
- State management with hooks
- Conditional rendering
- Form handling and validation
- Mock API simulation
- Responsive design with Tailwind CSS
- Priority queue algorithms
- Real-time data updates

## 📚 Code Style

- Beginner-friendly and well-commented
- Clear variable naming
- Modular components
- Reusable utilities
- Easy to understand logic

## 🤝 Contributing

This is a learning project. Feel free to modify and extend!

## 📄 License

MIT License

---

**Note**: This is a frontend-only demo with mock data. For production, integrate with a real backend API.
