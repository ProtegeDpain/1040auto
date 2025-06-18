import AppProvider from './providers';
import AppRouter from './routes';
import { AuthProvider } from './contexts/auth-context';
export default function App() {
  return (
    <AuthProvider>
    <AppProvider>
      <AppRouter />
    </AppProvider>
    </AuthProvider>
  );
}
