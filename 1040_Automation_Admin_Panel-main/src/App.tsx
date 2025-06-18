import { AuthProvider } from './contexts/auth-context';
import AppProvider from './providers';
import AppRouter from './routes';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </AuthProvider>
  );
}
