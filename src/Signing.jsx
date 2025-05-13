import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from './firebase';
import { login } from './store'; // Import the login action from your store
import './Signing.css';
import { v4 as uuidv4 } from 'uuid';

function Signing() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [usePhoneLogin, setUsePhoneLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [redirectCountdown, setRedirectCountdown] = useState(5); // Countdown for redirect

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [otp, setOtp] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userId = uuidv4(); // Generate a unique user ID
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password, // Note: In a real app, hash the password!
    };

    if (isSignUp) {
      // On sign-up, store user data and automatically log them in
      dispatch(login({ userId, userData }));
      alert('Sign up successful! Logging you in...');
    } else {
      // On login, you should verify credentials (e.g., check email/password against a database)
      // For this example, we'll assume the login is successful
      dispatch(login({ userId, userData }));
      alert('Login successful');
    }

    setIsLoggedIn(true);
    setFormData({ name: '', email: '', password: '' });
  };

  // Redirect to cart after successful login
  useEffect(() => {
    if (isLoggedIn) {
      const timer = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            navigate('/cart'); // Redirect to cart page
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLoggedIn, navigate]);

  const sendOTP = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
          callback: () => {
            console.log('reCAPTCHA verified');
          },
        },
        auth
      );
    }

    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        setConfirmation(confirmationResult);
        alert('OTP sent!');
      })
      .catch((error) => {
        console.error('Error sending OTP:', error);
        alert('Failed to send OTP. Check console.');
      });
  };

  const verifyOTP = () => {
    confirmation
      .confirm(otp)
      .then((result) => {
        const userId = result.user.uid || uuidv4(); // Use Firebase UID or generate a new one
        const userData = {
          phone: phoneNumber,
        };

        // Store user data in Redux
        dispatch(login({ userId, userData }));

        // Mark as logged in and proceed
        setIsLoggedIn(true);
      })
      .catch((error) => {
        alert('Invalid OTP');
        console.error(error);
      });
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
          {isLoggedIn ? (
            <h2>
              🎉 Login Successful! Redirecting to your cart in {redirectCountdown} seconds...
            </h2>
          ) : (
            <>
              <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>

              <div className="toggle-link">
                <span>
                  <button onClick={() => setUsePhoneLogin(!usePhoneLogin)}>
                    {usePhoneLogin ? 'Use Email Login' : 'Use Phone Login'}
                  </button>
                </span>
              </div>

              {!isSignUp && !usePhoneLogin && (
                <>
                  <p className="welcome-msg">Welcome back! Please login to continue.</p>
                  <ul className="login-benefits">
                    <li>✓ Access your saved cart</li>
                    <li>✓ Track your orders</li>
                    <li>✓ Get exclusive offers</li>
                  </ul>
                </>
              )}

              <form onSubmit={handleSubmit}>
                {!usePhoneLogin ? (
                  <>
                    {isSignUp && (
                      <div className="input-field">
                        <label htmlFor="name">Name</label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          required
                        />
                      </div>
                    )}
                    <div className="input-field">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div className="input-field">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="********"
                        required
                      />
                    </div>

                    {!isSignUp && (
                      <div className="forgot-password">
                        <a href="#">Forgot Password?</a>
                      </div>
                    )}
                    <button className="button" type="submit">
                      {isSignUp ? 'Sign Up' : 'Login'}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="input-field">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+911234567890"
                        required
                      />
                    </div>

                    {!confirmation && (
                      <button type="button" className="button" onClick={sendOTP}>
                        Send OTP
                      </button>
                    )}

                    {confirmation && (
                      <>
                        <div className="input-field">
                          <label htmlFor="otp">Enter OTP</label>
                          <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter the OTP"
                            required
                          />
                        </div>
                        <button type="button" className="button" onClick={verifyOTP}>
                          Verify OTP
                        </button>
                      </>
                    )}
                  </>
                )}
              </form>

              <div className="toggle-link">
                <span>
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button onClick={() => setIsSignUp(!isSignUp)}>
                    {isSignUp ? 'Login' : 'Sign Up'}
                  </button>
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Required for Firebase Recaptcha */}
      <div id="recaptcha-container"></div>
    </div>
  );
}

export default Signing;




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
