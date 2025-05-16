// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { auth, RecaptchaVerifier, signInWithPhoneNumber } from './firebase';
// import { login, logout } from './store';
// import './Signing.css';

// function Signing() {
//   const [isSignUp, setIsSignUp] = useState(true);
//   const [usePhoneLogin, setUsePhoneLogin] = useState(false);

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//   });

//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [confirmation, setConfirmation] = useState(null);
//   const [otp, setOtp] = useState('');

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const currentEmail = useSelector((state) => state.user.email); // Use email instead of userId
//   const loggedInUsers = useSelector((state) => state.user.loggedInUsers);
//   const registeredEmails = useSelector((state) => state.user.registeredEmails);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const emailLowerCase = formData.email.toLowerCase();

//     if (isSignUp) {
//       if (registeredEmails.includes(emailLowerCase)) {
//         alert('User already exists with this email. Please log in or use a different email.');
//         return;
//       }
//     } else {
//       if (!registeredEmails.includes(emailLowerCase)) {
//         alert('No user found with this email. Please sign up first.');
//         return;
//       }
//     }

//     const userData = {
//       name: formData.name,
//       email: formData.email,
//       password: formData.password,
//     };

//     // Use email as the identifier instead of userId
//     dispatch(login({ email: emailLowerCase, userData }));
//     alert(isSignUp ? 'Sign up successful! Logging you in...' : 'Login successful');

//     setFormData({ name: '', email: '', password: '' });
//   };

//   const sendOTP = () => {
//     if (!window.recaptchaVerifier) {
//       window.recaptchaVerifier = new RecaptchaVerifier(
//         'recaptcha-container',
//         {
//           size: 'invisible',
//           callback: () => {
//             console.log('reCAPTCHA verified');
//           },
//         },
//         auth
//       );
//     }

//     const appVerifier = window.recaptchaVerifier;

//     signInWithPhoneNumber(auth, phoneNumber, appVerifier)
//       .then((confirmationResult) => {
//         setConfirmation(confirmationResult);
//         alert('OTP sent!');
//       })
//       .catch((error) => {
//         console.error('Error sending OTP:', error);
//         alert('Failed to send OTP. Check console.');
//       });
//   };

//   const verifyOTP = () => {
//     confirmation
//       .confirm(otp)
//       .then((result) => {
//         const phoneIdentifier = result.user.uid || phoneNumber; // Use Firebase UID or phone number as identifier
//         const userData = {
//           phone: phoneNumber,
//         };

//         // For phone login, use phone number as the identifier (since there's no email)
//         dispatch(login({ email: phoneIdentifier, userData }));
//       })
//       .catch((error) => {
//         alert('Invalid OTP');
//         console.error(error);
//       });
//   };

//   const handleLogout = () => {
//     dispatch(logout(currentEmail)); // Use email instead of userId
//     setPhoneNumber('');
//     setOtp('');
//     setConfirmation(null);
//     alert('Logged out successfully');
//   };

//   return (
//     <div className="auth-wrapper">
//       <div className="info-panel">
//         <h1>Welcome to DailyDelights 🍏</h1>
//         <p>Order fresh fruits and vegetables delivered right to your doorstep.</p>
//         <ul>
//           <li>✓ Fast delivery</li>
//           <li>✓ 100% organic produce</li>
//           <li>✓ Easy reorder from saved carts</li>
//         </ul>
//         <img src="/Images/dailyDelightLogo.png" alt="Fresh produce" className="side-image" />
//       </div>

//       <div className="signing-page">
//         <div className="form-container">
//           {currentEmail ? (
//             <div>
//               <h2>🎉 Login Successful!</h2>
//               <p>You are logged in with Email: <strong>{currentEmail}</strong></p>
//               <button className="button" onClick={handleLogout}>
//                 Logout
//               </button>
//               <button className="button" onClick={() => navigate('/cart')} style={{ marginLeft: '10px' }}>
//                 Go to Cart
//               </button>

//               <div style={{ marginTop: '20px' }}>
//                 <h3>Currently Logged-In Users:</h3>
//                 {loggedInUsers.length > 0 ? (
//                   <ul>
//                     {loggedInUsers.map((user) => (
//                       <li key={user.email}>
//                         Email: {user.email} {user.userData.phone ? `| Phone: ${user.userData.phone}` : ''}
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>No users are currently logged in.</p>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <>
//               <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>

//               <div className="toggle-link">
//                 <span>
//                   <button onClick={() => setUsePhoneLogin(!usePhoneLogin)}>
//                     {usePhoneLogin ? 'Use Email Login' : 'Use Phone Login'}
//                   </button>
//                 </span>
//               </div>

//               {!isSignUp && !usePhoneLogin && (
//                 <>
//                   <p className="welcome-msg">Welcome back! Please login to continue.</p>
//                   <ul className="login-benefits">
//                     <li>✓ Access your saved cart</li>
//                     <li>✓ Track your orders</li>
//                     <li>✓ Get exclusive offers</li>
//                   </ul>
//                 </>
//               )}

//               <form onSubmit={handleSubmit}>
//                 {!usePhoneLogin ? (
//                   <>
//                     {isSignUp && (
//                       <div className="input-field">
//                         <label htmlFor="name">Name</label>
//                         <input
//                           type="text"
//                           name="name"
//                           id="name"
//                           value={formData.name}
//                           onChange={handleChange}
//                           placeholder="Your name"
//                           required
//                         />
//                       </div>
//                     )}
//                     <div className="input-field">
//                       <label htmlFor="email">Email</label>
//                       <input
//                         type="email"
//                         name="email"
//                         id="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         placeholder="you@example.com"
//                         required
//                       />
//                     </div>
//                     <div className="input-field">
//                       <label htmlFor="password">Password</label>
//                       <input
//                         type="password"
//                         name="password"
//                         id="password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         placeholder="********"
//                         required
//                       />
//                     </div>

//                     {!isSignUp && (
//                       <div className="forgot-password">
//                         <a href="#">Forgot Password?</a>
//                       </div>
//                     )}
//                     <button className="button" type="submit">
//                       {isSignUp ? 'Sign Up' : 'Login'}
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <div className="input-field">
//                       <label htmlFor="phone">Phone Number</label>
//                       <input
//                         type="tel"
//                         name="phone"
//                         id="phone"
//                         value={phoneNumber}
//                         onChange={(e) => setPhoneNumber(e.target.value)}
//                         placeholder="+911234567890"
//                         required
//                       />
//                     </div>

//                     {!confirmation && (
//                       <button type="button" className="button" onClick={sendOTP}>
//                         Send OTP
//                       </button>
//                     )}

//                     {confirmation && (
//                       <>
//                         <div className="input-field">
//                           <label htmlFor="otp">Enter OTP</label>
//                           <input
//                             type="text"
//                             id="otp"
//                             value={otp}
//                             onChange={(e) => setOtp(e.target.value)}
//                             placeholder="Enter the OTP"
//                             required
//                           />
//                         </div>
//                         <button type="button" className="button" onClick={verifyOTP}>
//                           Verify OTP
//                         </button>
//                       </>
//                     )}
//                   </>
//                 )}
//               </form>

//               <div className="toggle-link">
//                 <span>
//                   {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
//                   <button onClick={() => setIsSignUp(!isSignUp)}>
//                     {isSignUp ? 'Login' : 'Sign Up'}
//                   </button>
//                 </span>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       <div id="recaptcha-container"></div>
//     </div>
//   );
// }

// export default Signing;




// import React, { useState } from 'react';
// import './Signing.css';

// function Signing() {
//   const [isSignUp, setIsSignUp] = useState(true);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (isSignUp) {
//       alert('Sign up successful');
//     } else {
//       alert('Login successful');
//     }
//     console.log(formData);
//     setFormData({
//       name: '',
//       email: '',
//       password: '',
//     });
//   };

//   return (
//     <div className="auth-wrapper">
//       {/* Left Banner / Extra Content */}
//       <div className="info-panel">
//         <h1>Welcome to DailyDelights 🍏</h1>
//         <p>Order fresh fruits and vegetables delivered right to your doorstep.</p>
//         <ul>
//           <li>✓ Fast delivery</li>
//           <li>✓ 100% organic produce</li>
//           <li>✓ Easy reorder from saved carts</li>
//         </ul>
//         <img src="/Images/dailyDelightLogo.png" alt="Fresh produce" className="side-image" />
//       </div>

//       {/* Existing Login/Sign Up Form */}
//       <div className="signing-page">
//         <div className="form-container">
//           <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>

//           {!isSignUp && (
//             <>
//               <p className="welcome-msg">Welcome back! Please login to continue.</p>
//               <ul className="login-benefits">
//                 <li>✓ Access your saved cart</li>
//                 <li>✓ Track your orders</li>
//                 <li>✓ Get exclusive offers</li>
//               </ul>
//             </>
//           )}

//           <form onSubmit={handleSubmit}>
//             {isSignUp && (
//               <div className="input-field">
//                 <label htmlFor="name">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   id="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="Your name"
//                   required
//                 />
//               </div>
//             )}
//             <div className="input-field">
//               <label htmlFor="email">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 id="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="you@example.com"
//                 required
//               />
//             </div>
//             <div className="input-field">
//               <label htmlFor="password">Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 id="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="********"
//                 required
//               />
//             </div>

//             {!isSignUp && (
//               <div className="forgot-password">
//                 <a href="#">Forgot Password?</a>
//               </div>
//             )}

//             <button className='button' type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
//           </form>

//           <div className="toggle-link">
//             <span>
//               {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
//               <button onClick={() => setIsSignUp(!isSignUp)}>
//                 {isSignUp ? 'Login' : 'Sign Up'}
//               </button>
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Signing;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Signing.css';
import { useDispatch } from 'react-redux';
import { login } from './store';
import { useForm } from 'react-hook-form';

function Signing() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    try {
      dispatch(login(data));
      navigate('/cart');
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="info-panel">
        <h1>Welcome to DailyDelights 🍏</h1>
        <p>Order fresh fruits and vegetables delivered right to your doorstep.</p>
        <ul>
          <li>✓ Fast delivery</li>
          <li>✓ 100% organic produce</li>
          <li>✓ Easy reorder from saved carts</li>
        </ul>
        <img src="/Images/dailyDelightLogo.png" alt="Fresh produce" className="side-image" />
      </div>

      <div className="signing-page">
        <div className="form-container">
          <h2>Login</h2>
          <p className="welcome-msg">Welcome back! Please login to continue.</p>
          <ul className="login-benefits">
            <li>✓ Access your saved cart</li>
            <li>✓ Track your orders</li>
            <li>✓ Get exclusive offers</li>
          </ul>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="input-field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' } })}
              />
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>
            <div className="input-field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="********"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
              />
              {errors.password && <p className="error-text">{errors.password.message}</p>}
            </div>

            <div className="forgot-password">
              <a href="#">Forgot Password?</a>
            </div>

            <button className="button" type="submit">Login</button>
          </form>

          <p>
            New user?{' '}
            <button type="button" className="link-button" onClick={() => navigate('/registration')}>
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signing;