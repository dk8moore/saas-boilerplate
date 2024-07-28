import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { TooltipProvider } from '@ui/tooltip';
import { LoginForm } from '@page/app/login';
import { SignUpForm } from '@page/app/signup';
import { SettingsPage } from '@page/app/settings';
import { Dashboard } from '@page/app/examples/dashboard-2';
import { ProtectedRoute } from '@lib/protected-route';
import { AuthRedirect } from '@/lib/auth-redirect';
import { useAuth } from '@/lib/use-auth';
import { logger } from '@/lib/logger';
import '@style/app.css';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  logger.log('AppRoutes: isAuthenticated =', isAuthenticated);

  return (
    <Routes>
      <Route
        path='/login'
        element={
          <AuthRedirect>
            <LoginForm />
          </AuthRedirect>
        }
      />
      <Route
        path='/signup'
        element={
          <AuthRedirect>
            <SignUpForm />
          </AuthRedirect>
        }
      />
      <Route element={<ProtectedRoute authenticationPath='/login' />}>
        <Route path='/dashboard' element={<Dashboard />} />
      </Route>
      <Route element={<ProtectedRoute authenticationPath='/login' />}>
        <Route path='/settings' element={<SettingsPage />} />
      </Route>
      {/* Redirect any unknown routes to dashboard if authenticated, otherwise to login */}
      <Route
        path='*'
        element={
          isAuthenticated ? <Navigate to='/dashboard' replace /> : <Navigate to='/login' replace />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
