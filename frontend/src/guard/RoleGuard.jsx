import { useState, useEffect } from 'react';
import { useAuth } from '../core/api-hooks/useAuth'; 
import { authService } from '../core/api-services/auth.service';
import ErrorPageComponent from '../components/ErrorPageComponent';

export default function RoleGuard({ children, allowedRole }) {
  const { user, setUser } = useAuth();
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    // Flag to prevent state updates if component unmounts
    let isMounted = true;

    const checkAuth = async () => {
      // If we already have a user in context, don't call the API
      if (user) {
        if (isMounted) {
          setStatus(user.usr_role === allowedRole ? 'authorized' : 'forbidden');
        }
        return;
      }

      try {
        const userData = await authService.verifySession();
        if (isMounted) {
          setUser(userData);
          setStatus(userData.usr_role === allowedRole ? 'authorized' : 'forbidden');
        }
      } catch (err) {
        console.error('Error verifying session:', err);
        if (isMounted) {
          setStatus('unauthorized');
        }
      }
    };

    checkAuth();
    return () => { isMounted = false; };
  }, [user, allowedRole, setUser]); // user is here, so when setUser runs, this re-evaluates

  // Loading state while checking session
  if (status === 'checking') {
    return (
      <div className="h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Error handling based on verification result
  if (status === 'unauthorized') return <ErrorPageComponent status={401} />;
  if (status === 'forbidden') return <ErrorPageComponent status={403} />;

  return children;
}