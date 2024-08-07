import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@api';
import { useAuth } from '@/lib/use-auth';
import { logger } from '@/lib/logger';

import { Button } from '@ui/button';
import { Input, PasswordInput } from '@ui/input';
import { Label } from '@ui/label';
import { Card } from '@ui/card';
import { Separator } from '@ui/separator';
import { Checkbox } from '@ui/checkbox';
import { SiGoogle, SiFacebook } from 'react-icons/si';
import { FiAlertCircle } from 'react-icons/fi';

export function SignUpForm() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password1: '',
    password2: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
      // Setting the password2 value when the user types in the password1 field to not having both fields in the form
      password2: id === 'password1' ? value : prevData.password2,
    }));
    // Clear error state when user starts typing
    if (isError) {
      setIsError(false);
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setIsError(true);
      setErrorMessage('Please agree to the Terms & Privacy Policy');
      return;
    }
    logger.log('Signup form data:', formData);
    try {
      const response = await api.auth.signup(formData);
      if (response.success) {
        // Redirect to the VerifyEmail page
        navigate('/verify-email', { state: { email: formData.email } });
      } else {
        setIsError(true);
        setErrorMessage(response.error || 'An error occurred during signup. Please try again.');
      }
    } catch (error) {
      logger.error('Signup failed:', error);
      setIsError(true);
      setErrorMessage('An error occurred during signup. Please try again.');
    }
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
              <h4 className='text-2xl font-semibold text-card-foreground'>Create an account</h4>
              <p className='font-light mt-2 text-gray-400'>Enter your information to create an account</p>
            </div>
            <form onSubmit={handleSubmit} className='mt-12 space-y-3'>
              <Button variant='outline' className='items-center justify-center space-x-2 w-full mb-4'>
                <SiGoogle />
                <span className='sm:inline'>Sign up with Google</span>
              </Button>
              <Button variant='outline' className='items-center justify-center space-x-2 w-full mb-4'>
                <SiFacebook />
                <span className='sm:inline'>Sign up with Facebook</span>
              </Button>
              <Separator>
                <Label className='font-light text-gray-400'>OR</Label>
              </Separator>
              <div className='grid grid-cols-2 gap-4 mt-3'>
                <div className='space-y-2'>
                  <Label htmlFor='first_name'>First name</Label>
                  <Input id='first_name' placeholder='Michael' required onChange={handleChange} />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='last_name'>Last name</Label>
                  <Input id='last_name' placeholder='Scott' required onChange={handleChange} />
                </div>
              </div>
              <div className='space-y-2 mt-3'>
                <Label htmlFor='email'>Email</Label>
                <Input id='email' type='email' placeholder='michael.scott@dundermifflin.com' required onChange={handleChange} />
              </div>
              <div className='space-y-2 mt-3 relative'>
                <Label htmlFor='password1'>Password</Label>
                <PasswordInput id='password1' required onChange={handleChange} />
              </div>
              <div className='flex items-center space-x-2 mt-4'>
                <Checkbox id='terms' checked={agreeTerms} onCheckedChange={(checked) => setAgreeTerms(checked as boolean)} />
                <label htmlFor='terms' className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                  I agree to the{' '}
                  <a href='#' className='text-primary hover:underline'>
                    Terms & Privacy Policy
                  </a>
                </label>
              </div>
              <div className='h-6 mt-4'>
                {isError && (
                  <div className='flex items-center justify-center text-[hsl(var(--error))] text-sm'>
                    <FiAlertCircle className='flex-shrink-0 mr-2' />
                    <p>{errorMessage}</p>
                  </div>
                )}
              </div>
              <Button type='submit' className='w-full font-bold bg-primary mt-2'>
                Create an account
              </Button>
            </form>
            <div className='mt-6 text-center text-sm'>
              Already have an account?{' '}
              <Link to='/login' className='font-bold text-primary hover:underline'>
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
