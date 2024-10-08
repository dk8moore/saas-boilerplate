import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@api';
import { useAuth } from '@lib/use-auth';
import { logger } from '@lib/logger';

import { Button } from '@ui/button';
import { Input, PasswordInput } from '@ui/input';
import { Label } from '@ui/label';
import { Card } from '@ui/card';
import { Separator } from '@ui/separator';
import { SiGoogle, SiFacebook } from 'react-icons/si';
import { FiAlertCircle } from 'react-icons/fi';
import { set } from 'date-fns';

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isError, setIsError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin, checkAuthStatus } = useAuth();

  useEffect(() => {
    const checkExistingToken = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const isValid = await api.auth.isTokenValid(token);
          if (isValid) {
            await checkAuthStatus();
            navigate('/dashboard');
          }
        } catch (error) {
          // Token is invalid, clear it
          api.auth.clearAuthTokens();
        }
      }
    };

    checkExistingToken();
  }, [navigate, checkAuthStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.auth.login(formData);

      if (response.success) {
        await checkAuthStatus(); // Check auth status immediately after login
        authLogin();
        logger.info('User logged in successfully');
        navigate('/dashboard');
      } else if (response.needsVerification) {
        setNeedsVerification(true);
        setErrorMessage('Email is not verified.');
        setIsError(true);
      } else {
        setErrorMessage(response.error || 'An error occurred during login. Please try again.');
        setIsError(true);
        setIsShaking(true);
      }
    } catch (error) {
      logger.error('An error occurred during login:', error);
      setIsError(true);
      setIsShaking(true);
      setErrorMessage('An error occurred during login. Please try again.');
    }
  };

  const handleResendVerification = async () => {
    try {
      const response = await api.auth.resendVerificationEmail(formData.email);
      if (response.success) {
        setSuccessMessage('Verification email sent. Check your inbox.');
        setIsSuccess(true);
      } else {
        setErrorMessage(response.error || 'Failed to resend verification email. Please try again.');
        setIsError(true);
      }
    } catch (error) {
      logger.error('Failed to resend verification email:', error);
      setErrorMessage('An error occurred. Please try again.');
      setIsError(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // Clear error state when user starts typing
    if (isError) {
      setIsError(false);
      setErrorMessage('');
    }
  };

  const handleAnimationEnd = () => {
    // Stop the shaking animation, but keep the error state
    setIsShaking(false);
  };

  return (
    <div className='flex dotted-background items-center justify-center min-h-screen min-w-[400px] px-4 py-12 relative'>
      <div className='absolute inset-0 lg:hidden'>
        <img src='https://picsum.photos/1080/1920' alt='Background Image' className='w-full h-full object-cover opacity-20' />
      </div>
      <Card className='flex items-center max-w-6xl lg:min-h-[800px] max-h-[800px] rounded-lg shadow-lg overflow-hidden z-10'>
        <div className='grid grid-cols-1 lg:grid-cols-2 h-full min-h-[600px]'>
          <div className='hidden lg:block h-full'>
            <img src='https://picsum.photos/1080/1920' alt='Image' className='h-full w-full object-cover' />
          </div>
          <div className='flex flex-col justify-center mx-auto w-full max-w-md p-12'>
            <div className='text-center'>
              <h4 className='text-2xl font-semibold text-card-foreground'>Welcome back</h4>
              <p className='font-light mt-2 text-gray-400'>Sign in to access to your dashboard, settings and projects.</p>
            </div>
            <form onSubmit={handleSubmit} className='mt-8 space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='john.doe@example.com'
                  required
                  onChange={handleChange}
                  isError={isError}
                  isShaking={isShaking}
                  onAnimationEnd={handleAnimationEnd}
                />
              </div>
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='password'>Password</Label>
                  <Link to='/forgot-password' className='text-xs text-primary hover:underline'>
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  id='password'
                  required
                  onChange={handleChange}
                  isError={isError}
                  isShaking={isShaking}
                  onAnimationEnd={handleAnimationEnd}
                />
              </div>
              <div className='h-5 mb-1'>
                {isError && (
                  <div className='flex items-center justify-center space-x-1 text-sm'>
                    <div className='flex items-center text-[hsl(var(--error))]'>
                      <FiAlertCircle className='flex-shrink-0 mr-2' />
                      <p>{errorMessage}</p>
                    </div>
                    {needsVerification && (
                      <button type='button' onClick={handleResendVerification} className='hover:underline whitespace-nowrap'>
                        Resend verification email
                      </button>
                    )}
                  </div>
                )}
              </div>
              <Button type='submit' className='w-full font-bold bg-primary'>
                Login
              </Button>
              <Separator>
                <Label className='font-light text-gray-400'>OR CONTINUE WITH</Label>
              </Separator>
              <div className='flex space-x-2'>
                <Button variant='outline' className='flex-1 flex items-center justify-center space-x-2'>
                  <SiGoogle />
                  <span className='hidden sm:inline'>Google</span>
                </Button>
                <Button variant='outline' className='flex-1 flex items-center justify-center space-x-2'>
                  <SiFacebook />
                  <span className='hidden sm:inline'>Facebook</span>
                </Button>
              </div>
            </form>
            <div className='mt-6 text-center text-sm'>
              Don&apos;t have an account?{' '}
              <Link to='/signup' className='font-bold text-primary hover:underline'>
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
