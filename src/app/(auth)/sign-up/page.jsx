'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounce } from 'usehooks-ts';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react'; // Loader2 spinner
import styles from './signup.module.css'; // Import your CSS module

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounce(username, 300);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${debouncedUsername}`
          );
          setUsernameMessage(response.data.message || 'Username is unique');
        } catch (error) {
          const axiosError = error
          setUsernameMessage(error.response?.data?.message || 'Username is already taken!');
          toast.error('Username is already taken!');
        } finally {
          setIsCheckingUsername(false);
        }
      } else {
        setUsernameMessage('');
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/sign-up', data); // Store response
      toast.success(response.data.message || 'Sign-up successful! Please verify your email.');
      
      router.push(`/verify/${data.username}`); // Use data.username instead of state username
    } catch (error) {
      console.error('Error during sign-up:', error);
      
      // Handle duplicate username or email error
      if (error.response?.data?.message?.includes('duplicate key error')) {
        if (error.response.data.message.includes('username')) {
          toast.error('Username is already taken! Try a different one.');
        } else if (error.response.data.message.includes('email')) {
          toast.error('Email is already registered! Try logging in.');
        }
      } else {
        toast.error('Sign-up failed! Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Join my blog channel</h1>
          <p>Sign up to start your anonymous adventure</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* Username Field */}
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              {...register('username', { required: 'Username is required' })}
              onChange={(e) => setUsername(e.target.value)}
            />
            {isCheckingUsername && (
              <div className={styles.loading}>
                <Loader2 className={styles.spinner} />
                <span>Checking...</span>
              </div>
            )}
            {!isCheckingUsername && usernameMessage && (
              <p
                className={
                  usernameMessage === 'Username is unique'
                    ? styles.success
                    : styles.error
                }
              >
                {usernameMessage}
              </p>
            )}
            {errors.username && <span className={styles.error}>{errors.username.message}</span>}
          </div>

          {/* Email Field */}
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <span className={styles.error}>{errors.email.message}</span>}
          </div>

          {/* Password Field */}
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <span className={styles.error}>{errors.password.message}</span>}
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
            {isSubmitting ? (
              <>
                <Loader2 className={styles.spinner} />
                <span>Submitting...</span>
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
        <div className={styles.footer}>
          <p>
            Already a member?{' '}
            <a href="/sign-in" className={styles.link}>
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
