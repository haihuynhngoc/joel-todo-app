# Todo App

A full-stack todo application with React Native (mobile + web) and Node.js backend.

## Quick Start

### Step 1: Start Database
```bash
docker-compose up -d
```

### Step 2: Install Dependencies
```bash
npm run install:all
```

### Step 3: Setup Environment Variables

```bash
# Setup server environment
cd server
cp .env.example .env
cd ..

# Setup mobile environment
cd mobile
cp .env.example .env
cd ..
```

**For Physical Device (Expo Go):** Edit `mobile/.env` and replace localhost with your computer's IP address:
```
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000
```

> Note: Server `.env` is configured for Docker by default. If using local PostgreSQL, update `server/.env` with your database credentials.

### Step 4: Setup Database
```bash
npm run migrate
```

### Step 5: Start Backend Server
```bash
npm run dev:server
```
Backend will run on `http://localhost:3000`

Leave this terminal running and open a new terminal for the next step.

### Step 6: Start the App

**Option A: Web (Fastest - Recommended for Quick Review)**
```bash
npm run dev:web
```
Opens automatically in your browser.

**Option B: Expo Go (Physical Device)**
```bash
npm run dev:mobile
# Scan the QR code with Expo Go app
```

**Option C: iOS/Android Simulator**
```bash
npm run dev:mobile
# Press 'i' for iOS or 'a' for Android
```

## Development Commands

### Tests
```bash
npm test                     # Run all tests (backend + mobile)
npm run test:server          # Backend tests only
npm run test:mobile          # Mobile tests only
```

### Code Quality
```bash
npm run lint                 # Lint all code
npm run lint:server          # Lint backend only
npm run lint:mobile          # Lint mobile only
npm run format               # Format all code
npm run format:check         # Check formatting
```

### Type Checking
```bash
cd server && npm run type-check
cd mobile && npm run type-check
```

## API Endpoints

- `GET /todos` - List all todos
- `POST /todos` - Create todo (body: `{text: string}`)
- `PUT /todos/:id` - Toggle completion (body: `{completed: boolean}`)
- `DELETE /todos/:id` - Delete todo

## Tech Stack

- **Frontend:** React Native, TypeScript, Expo
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **Testing:** Jest, React Native Testing Library, Supertest

## Project Structure

```
├── mobile/          # React Native app (iOS, Android, Web)
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── hooks/
│   │   └── services/
│   └── src/tests/
│
└── server/          # Node.js API
    ├── src/
    │   ├── controllers/
    │   ├── services/
    │   ├── repositories/
    │   └── routes/
    └── src/tests/
```

## Troubleshooting

- **"Network request failed"**: Update `mobile/.env` with correct API URL
- **"relation 'todos' does not exist"**: Run `cd server && npm run migrate`
- **Database issues**: Ensure Docker is running or PostgreSQL is installed
