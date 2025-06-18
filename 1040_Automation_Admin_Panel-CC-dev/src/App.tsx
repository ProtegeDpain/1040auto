import AppProvider from './providers';
import AppRouter from './routes';
import { AuthProvider } from './contexts/auth-context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function App() {
  return (
    <AuthProvider>
    <AppProvider>
      <AppRouter />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </AppProvider>
    </AuthProvider>
  );
}
