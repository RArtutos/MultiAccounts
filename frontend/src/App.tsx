import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AccountList from './pages/AccountList';
import SessionManager from './pages/SessionManager';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/accounts" element={<PrivateRoute element={<AccountList />} />} />
            <Route path="/sessions" element={<PrivateRoute element={<SessionManager />} />} />
          </Routes>
        </Router>
      </AuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}