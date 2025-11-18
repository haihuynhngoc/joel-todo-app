# todo-app Mobile Client

React Native mobile application built with Expo and TypeScript for the todo-app project.

## Architecture

This mobile app follows a **component-based architecture** with clear separation of concerns:

```
mobile/
├── src/
│   ├── components/    # Reusable UI components
│   ├── screens/       # Screen components (one per route)
│   ├── services/      # API client and external services
│   ├── hooks/         # Custom React hooks (useTodos, etc.)
│   ├── types/         # TypeScript type definitions
│   ├── styles/        # Theme and shared styles
│   └── App.tsx        # Root application component
├── __tests__/
│   ├── components/    # Component tests
│   └── hooks/         # Hook tests
├── assets/            # Images, fonts, and static files
└── app.json           # Expo configuration
```

### Component Layers

**Screens:**
- Top-level route components
- Compose multiple components together
- Handle screen-level state management
- Use custom hooks for data fetching

**Components:**
- Reusable, self-contained UI elements
- Accept props for customization
- Minimal internal state
- Styled using React Native StyleSheet

**Hooks:**
- Custom React hooks for shared logic
- API data fetching and caching
- State management (useTodos, etc.)
- Encapsulate complex stateful logic

**Services:**
- API client for backend communication
- External service integrations
- Async operations and error handling
- Pure functions, no React dependencies

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- iOS Simulator (macOS only) or Android Emulator
- Expo Go app (for testing on physical devices)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `mobile/` directory:

```bash
cp .env.example .env
```

Edit `.env` and configure your API URL:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

**Important:** Expo requires the `EXPO_PUBLIC_` prefix for environment variables to be accessible in your app.

### 3. Start Development Server

```bash
npm start
```

This will start the Expo development server with Metro bundler.

### 4. Run on Simulator/Emulator

**iOS (macOS only):**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

**Web:**
```bash
npm run web
```

### 5. Run on Physical Device

1. Install **Expo Go** from App Store (iOS) or Play Store (Android)
2. Run `npm start`
3. Scan the QR code displayed in your terminal with:
   - **iOS:** Camera app
   - **Android:** Expo Go app

## Development Commands

```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure Details

### /src/components

Reusable UI components following **Refactoring UI** design principles:

- Small, focused, single-responsibility components
- Props interface for type safety
- StyleSheet for styling (no inline styles)
- Documented with JSDoc comments

Example:
```typescript
// TodoItem.tsx
interface TodoItemProps {
  text: string;
  completed: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ ... }) => {
  // Component implementation
};
```

### /src/screens

Screen-level components for navigation:

- One screen per route
- Compose multiple components
- Use custom hooks for data
- Handle screen-level error states

### /src/services

API client and external integrations:

```typescript
// api.ts
export const todoApi = {
  getAll: async (): Promise<Todo[]> => { ... },
  create: async (text: string): Promise<Todo> => { ... },
  update: async (id: number, completed: boolean): Promise<Todo> => { ... },
  delete: async (id: number): Promise<void> => { ... },
};
```

### /src/hooks

Custom React hooks for shared logic:

```typescript
// useTodos.ts
export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hook implementation...

  return { todos, loading, error, addTodo, toggleTodo, deleteTodo };
};
```

### /src/types

TypeScript type definitions shared across the app:

```typescript
// todo.ts
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}
```

### /src/styles

Theme configuration and shared styles following **Refactoring UI**:

- Color palette (primary, secondary, neutral, error, success)
- Spacing scale (4px base unit: 4, 8, 12, 16, 24, 32, 48, 64)
- Typography scale (font sizes, weights, line heights)
- Shadow definitions
- Border radius values

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```
__tests__/
├── components/
│   └── TodoItem.test.tsx
└── hooks/
    └── useTodos.test.tsx
```

### Writing Tests

**Component Tests:**
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { TodoItem } from '../src/components/TodoItem';

describe('TodoItem', () => {
  it('renders todo text', () => {
    const { getByText } = render(
      <TodoItem text="Buy groceries" completed={false} onToggle={jest.fn()} onDelete={jest.fn()} />
    );
    expect(getByText('Buy groceries')).toBeTruthy();
  });
});
```

**Hook Tests:**
```typescript
import { renderHook, act } from '@testing-library/react-native';
import { useTodos } from '../src/hooks/useTodos';

describe('useTodos', () => {
  it('loads todos on mount', async () => {
    const { result } = renderHook(() => useTodos());
    await act(async () => {
      // Wait for initial load
    });
    expect(result.current.todos).toBeDefined();
  });
});
```

## Technology Stack

- **Framework:** Expo SDK 54
- **Language:** TypeScript 5.x (strict mode)
- **UI Library:** React Native 0.81
- **State Management:** React Hooks (useState, useReducer, custom hooks)
- **Testing:** Jest, React Native Testing Library
- **Code Quality:** ESLint, Prettier
- **Environment:** Expo CLI, Metro bundler

## Design System (Refactoring UI Principles)

### Color Usage
- Use semantic color names (not "blue" or "red")
- Define color scales (50-900) for each semantic color
- Use neutral grays for UI chrome
- Reserve saturated colors for primary actions

### Spacing
- Use a consistent spacing scale (4px base unit)
- Define spacing constants (xs, sm, md, lg, xl)
- Use more whitespace than you think you need
- Group related elements with proximity

### Typography
- Limit to 2-3 font sizes per screen
- Use font weight for hierarchy, not just size
- Ensure sufficient line height (1.5 for body text)
- Use letter spacing sparingly

### Shadows
- Use shadows to create depth hierarchy
- Larger shadows = closer to user
- Define 3-4 shadow levels (sm, md, lg, xl)

### Error Handling
- Show user-friendly error messages
- Provide actionable recovery options
- Never show raw error stack traces
- Use empty states for zero-data scenarios

## API Integration

The mobile app communicates with the backend REST API:

- **Base URL:** Configured in `.env` as `EXPO_PUBLIC_API_URL`
- **Endpoints:**
  - `GET /todos` - Fetch all todos
  - `POST /todos` - Create new todo
  - `PUT /todos/:id` - Update todo completion status
  - `DELETE /todos/:id` - Delete todo

Error handling:
- Network errors (offline, timeout)
- HTTP errors (400, 404, 500)
- Validation errors
- Loading states

## Troubleshooting

### Metro bundler won't start

```bash
# Clear Metro cache
npx expo start --clear
```

### TypeScript errors

```bash
# Check TypeScript compilation
npx tsc --noEmit
```

### iOS simulator issues

```bash
# Reset iOS simulator (if needed)
xcrun simctl erase all
```

### Android emulator issues

```bash
# Ensure Android emulator is running
# If issues persist, restart the emulator
```

### Tests failing

```bash
# Clear Jest cache
npx jest --clearCache
```

### Can't connect to backend API

- Ensure backend server is running on `http://localhost:3000`
- Check `.env` file has correct `EXPO_PUBLIC_API_URL`
- On iOS simulator, use `http://localhost:3000`
- On Android emulator, use `http://10.0.2.2:3000` (Android's host alias)
- On physical device, use your computer's local IP (e.g., `http://192.168.1.100:3000`)

## Related Documentation

- [Root README](../README.md) - Project overview and setup
- [Backend README](../server/README.md) - API documentation
- [Architecture Document](../docs/architecture.md) - Technical design
- [PRD](../docs/prd.md) - Product requirements
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)

## License

MIT
