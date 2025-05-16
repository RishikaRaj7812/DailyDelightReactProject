import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from './store';
import './Registration.css';

function Registration() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    try {
      dispatch(registerUser(data));
      alert('Registration successful!');
      navigate('/signing');
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="info-panel">
        <h1>Join DailyDelights 🍏</h1>
        <p>Create an account to enjoy fresh produce delivered to your door.</p>
        <ul>
          <li>✓ Fast delivery</li>
          <li>✓ 100% organic produce</li>
          <li>✓ Exclusive member offers</li>
        </ul>
        <img src="/Images/dailyDelightLogo.png" alt="Fresh produce" className="side-image" />
      </div>

      <div className="registration-page">
        <div className="form-container">
          <h2>Sign Up</h2>
          <p className="welcome-msg">Create your account to get started.</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="input-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                placeholder="Your name"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <p className="error-text">{errors.name.message}</p>}
            </div>

            <div className="input-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' },
                })}
              />
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>

            <div className="input-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="********"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
              />
              {errors.password && <p className="error-text">{errors.password.message}</p>}
            </div>

            <button className="button" type="submit">
              Sign Up
            </button>
          </form>

          <p>
            Already have an account?{' '}
            <button type="button" className="link-button" onClick={() => navigate('/signing')}>
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Registration;