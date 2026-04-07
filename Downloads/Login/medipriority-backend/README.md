# MediPriority Backend - Spring Boot

Spring Boot backend for the MediPriority Triage System.

## Prerequisites

- Java JDK 17+
- Maven 3.6+

## Quick Start

### 1. Build
```bash
mvn clean install
```

### 2. Run
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Access H2 Database Console
```
URL: http://localhost:8080/h2-console
Driver: org.h2.Driver
JDBC URL: jdbc:h2:mem:testdb
Username: sa
Password: (leave empty)
```

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/validate` - Validate token

### Nurse Operations
- `POST /api/nurse/patient/register` - Register patient
- `POST /api/nurse/patient/{id}/vitals` - Update vitals
- `GET /api/nurse/patients` - Get patients

### Doctor Operations
- `GET /api/doctor/queue` - Get priority queue
- `POST /api/doctor/patient/{id}/assign` - Assign patient
- `POST /api/doctor/patient/{id}/complete` - Complete patient
- `POST /api/doctor/patient/{id}/notes` - Add notes
- `POST /api/doctor/patient/{id}/emergency-override` - Emergency override
- `GET /api/doctor/completed-patients` - Get completed patients

## Default Demo Credentials

**Nurse:**
- Username: nurse1
- Password: password123

**Doctor:**
- Username: doctor1
- Password: password123

## Configuration

Edit `src/main/resources/application.properties`:

```properties
server.port=8080
spring.jpa.hibernate.ddl-auto=create-drop
app.jwtSecret=your-secret-key
app.jwtExpirationMs=86400000
```

## Project Structure

```
src/main/java/com/medipriority/
├── MediPriorityApplication.java      # Main Spring Boot Application
├── config/
│   └── SecurityConfig.java           # Security Configuration
├── controllers/
│   ├── AuthController.java           # Authentication endpoints
│   ├── NurseController.java          # Nurse operations
│   └── DoctorController.java         # Doctor operations
├── models/
│   ├── User.java                     # User entity
│   ├── Patient.java                  # Patient entity
│   ├── LoginRequest.java             # Login DTO
│   ├── LoginResponse.java            # Login response DTO
│   ├── PatientDTO.java               # Patient DTO
│   └── VitalsRequest.java            # Vitals update DTO
├── repositories/
│   ├── UserRepository.java           # User database access
│   └── PatientRepository.java        # Patient database access
├── security/
│   ├── JwtTokenProvider.java         # JWT token handling
│   └── JwtAuthenticationFilter.java  # JWT filter
└── services/
    ├── UserService.java              # User business logic
    ├── PatientService.java           # Patient business logic
    └── TriageService.java            # Triage calculation logic
```

## Triage Level Calculation

The system automatically calculates triage levels based on vital signs:

### Critical (Level 1) - Red
- HR: > 130 or < 40
- SBP: > 200 or < 80
- Temp: > 39.5°C or < 35°C
- RR: > 30 or < 8

### Emergency (Level 2) - Orange
- HR: > 110 or < 50
- SBP: > 180 or < 90
- Temp: > 39°C or < 35.5°C
- RR: > 25 or < 10

### Urgent (Level 3) - Yellow
- HR: > 100 or < 60
- SBP: > 160 or < 100
- Temp: > 38.5°C or < 36°C

### Semi-Urgent (Level 4) - Green
- Moderately abnormal values

### Non-Urgent (Level 5) - Blue
- Normal values

## Security

- **JWT Authentication**: Token-based authentication
- **Password Encryption**: BCrypt (strength 12)
- **CORS**: Configured for localhost:3000 and localhost:3001
- **Role-Based Access Control**: NURSE, DOCTOR, ADMIN roles

## Database

H2 in-memory database is used for development/testing.

### User Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL,
    created_at BIGINT NOT NULL
);
```

### Patient Table
```sql
CREATE TABLE patients (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    symptoms VARCHAR(500),
    heart_rate INT NOT NULL,
    blood_pressure VARCHAR(255) NOT NULL,
    temperature DOUBLE NOT NULL,
    respiratory_rate INT NOT NULL,
    triage_level VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    registered_at TIMESTAMP NOT NULL,
    seen_at TIMESTAMP,
    completed_at TIMESTAMP,
    doctor_id BIGINT,
    nurse_id BIGINT NOT NULL,
    notes VARCHAR(500),
    emergency_override BOOLEAN NOT NULL,
    FOREIGN KEY (doctor_id) REFERENCES users(id),
    FOREIGN KEY (nurse_id) REFERENCES users(id)
);
```

## Troubleshooting

### Port 8080 Already in Use
Change `server.port` in `application.properties`

### Database Errors
Check H2 console connection settings

### JWT Token Expired
Default expiration: 24 hours. Change `app.jwtExpirationMs`

### CORS Errors
Update allowed origins in `SecurityConfig.java`

## Development Tips

1. **Enable SQL Logging**: Set `spring.jpa.show-sql=true` in properties
2. **H2 Console**: Accessible at `/h2-console` for database inspection
3. **Swagger/API Docs**: Consider adding Springfox for API documentation
4. **Testing**: Run unit tests with `mvn test`

## Deploy

For production deployment:
1. Change `spring.jpa.hibernate.ddl-auto` to `validate` or `update`
2. Use production database (PostgreSQL, MySQL, etc.)
3. Update JWT secret to strong value
4. Configure CORS for production domain
5. Enable HTTPS
6. Use environment variables for sensitive config

---

**Version**: 1.0.0  
**Java**: 17+  
**Spring Boot**: 3.1.5
