import React, { useState } from 'react';
// import firebase from './firebase'; // your firebase config setup
import {  auth, RecaptchaVerifier,  signInWithPhoneNumber } from './firebase';

const PhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [otp, setOtp] = useState('');

  const sendOTP = () => {
    const recaptcha = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
    });

    firebase.auth().signInWithPhoneNumber(phoneNumber, recaptcha)
      .then((confirmationResult) => {
        setConfirmation(confirmationResult);
        alert("OTP sent!");
      })
      .catch((error) => {
        console.error("SMS not sent", error);
      });
  };

  const verifyOTP = () => {
    if (confirmation && otp) {
      confirmation.confirm(otp)
        .then((result) => {
          alert("Phone number verified!");
          console.log("User:", result.user);
        })
        .catch((error) => {
          alert("Invalid OTP");
          console.error(error);
        });
    }
  };

  return (
    <div>
      <h3>Phone Login</h3>

      {/* Phone Input and OTP Send */}
      <input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="+911234567890"
      />
      <button onClick={sendOTP}>Send OTP</button>

      {/* OTP Input and Verify - Show only after OTP is sent */}
      {confirmation && (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOTP}>Verify OTP</button>
        </div>
      )}

      {/* Invisible Recaptcha container */}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneAuth;
