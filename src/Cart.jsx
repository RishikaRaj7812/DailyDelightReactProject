import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './cart.css';
import { clearCart, DecrCart, IncrCart, RemoveFromCart, addOrder } from './store';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';
import { FaPercent, FaGift, FaFire } from 'react-icons/fa';
import emailjs from 'emailjs-com';
import { v4 as uuidv4 } from 'uuid';

function Cart() {
  const cartObjects = useSelector((state) => state.cart);
  const email = useSelector((state) => state.user?.email); // Use email instead of userId
  const userData = useSelector((state) => state.user?.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalItems = cartObjects.reduce((sum, item) => sum + item.quantity, 0);

  const [purchased, setPurchased] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(10);
  const [finalPriceCache, setFinalPriceCache] = useState(0);

  const couponRef = useRef();
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponCodeDiscountPer, setCouponCodeDiscountPer] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const userEmail = userData?.email || '';

  const handleApplyCoupon = () => {
    const couponCode = couponRef.current.value.trim().toUpperCase();
    switch (couponCode) {
      case 'RATAN10':
      case 'RISHIKA10':
        setCouponCodeDiscountPer(10);
        setAppliedCoupon(couponCode);
        break;
      case 'RATAN20':
      case 'RISHIKA20':
        setCouponCodeDiscountPer(20);
        setAppliedCoupon(couponCode);
        break;
      case 'RATAN30':
      case 'RISHIKA30':
        setCouponCodeDiscountPer(30);
        setAppliedCoupon(couponCode);
        break;
      default:
        alert('❌ Invalid Coupon Code');
        setCouponCodeDiscountPer(0);
        setAppliedCoupon('');
    }
  };

  const CalculatingAmount = () => {
    const totalPrice = cartObjects.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const discountAmount = totalPrice * (appliedDiscount / 100);
    const couponAmount = totalPrice * (couponCodeDiscountPer / 100);
    const priceAfterDiscount = totalPrice - (discountAmount + couponAmount);
    const taxPrice = priceAfterDiscount * 0.05;
    const shipping = 50.00;
    const finalPrice = priceAfterDiscount + taxPrice + shipping;

    return {
      totalPrice: totalPrice.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      couponDiscount: couponAmount.toFixed(2),
      taxPrice: taxPrice.toFixed(2),
      finalPrice: finalPrice.toFixed(2),
      finalPriceNum: parseFloat(finalPrice.toFixed(2)),
      shipping: shipping.toFixed(2),
    };
  };

  const {
    totalPrice,
    discountAmount,
    couponDiscount,
    taxPrice,
    shipping,
    finalPrice,
    finalPriceNum,
  } = CalculatingAmount();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handlePurchase = () => {
    if (!email) {
      alert('Please log in to proceed with the purchase.');
      navigate('/signing');
      return;
    }

    if (!userEmail) {
      alert('No email found. Please log in with an email address to receive the receipt.');
      navigate('/signing');
      return;
    }

    let emailToUse = userEmail;
    if (newEmail.trim()) {
      if (!validateEmail(newEmail)) {
        setEmailError('❌ Please enter a valid email address.');
        return;
      }
      emailToUse = newEmail;
      setEmailError('');
    }

    if (finalPriceNum <= 0) {
      alert('❌ Invalid payment amount. Please check discounts and try again.');
      return;
    }

    setFinalPriceCache(finalPrice);
    const purchaseDateTime = new Date().toLocaleString();
    let uniqueId = 'ORD' + uuidv4().slice(0, 8).toUpperCase();

    let purchaseDetails = {
      id: uniqueId,
      purchaseDateTime: purchaseDateTime,
      items: [...cartObjects],
      finalPrice: finalPrice,
    };

    if (paymentMethod === 'card') {
      if (!cardName || !cardNumber || !expiry || !cvv) {
        alert('Please fill in all card details.');
        return;
      }
    }

    dispatch(addOrder(purchaseDetails));
    setPurchased(true);
    dispatch(clearCart());

    const githubRawBase = 'https://raw.githubusercontent.com/RishikaRaj7812/Images/main';

    const templateParams = {
      logo: `${githubRawBase}/dailyDelightLogo.png`,
      order_id: purchaseDetails.id,
      to_email: emailToUse,
      orders: purchaseDetails.items.map((item) => ({
        name: item.name,
        price: item.price.toFixed(2),
        units: item.quantity,
        image_url: `${githubRawBase}/${item.image.replace(/^\/+/, '')}`,
      })),
      cost: {
        subtotal: totalPrice,
        shipping: 50,
        discount: discountAmount,
        coupon: couponDiscount,
        tax: taxPrice,
        total: finalPriceNum,
      },
    };

    emailjs
      .send('rishika123', 'template_30dc0ip', templateParams, 'SX77ys4f6EnCgI0xf')
      .then(() => {
        console.log('✅ Email sent successfully to', emailToUse);
        alert(`✅ Receipt sent to your email: ${emailToUse}`);
      })
      .catch((error) => {
        console.error('❌ Failed to send email:', error);
        alert('❌ Failed to send receipt. Please check your email settings.');
      });
  };

  const handleProceedToCheckout = () => {
    if (email) {
      setShowPaymentOptions(true);
    } else {
      alert('Please log in to proceed with the checkout.');
      navigate('/signing');
    }
  };

  useEffect(() => {
    if (purchased) {
      const timer = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            navigate('/order');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [purchased, navigate]);

  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method);
  };

  const upiUrl = `upi://pay?pa=rishika7812@ybl&pn=DailyDelights&am=${encodeURIComponent(
    finalPriceNum.toFixed(2)
  )}&cu=INR`;

  return (
    <div className="cart-container">
      {cartObjects.length > 0 && !purchased && !showPaymentOptions && !paymentMethod && (
        <>
          <h1>Your 🛒Cart Items are...</h1>
          <p className="cart-title">
            Total Items: <span className="cart-item-count">({totalItems} items)</span>
          </p>
        </>
      )}

      {cartObjects.length > 0 && !purchased && !showPaymentOptions && !paymentMethod && (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartObjects.map((item, index) => (
                <tr key={index} className="cart-item-row">
                  <td>
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                  </td>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <div className="cart-item-quantity">
                      <button onClick={() => dispatch(IncrCart(item))} className="qty-increase">
                        +
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => dispatch(DecrCart(item))} className="qty-decrease">
                        -
                      </button>
                    </div>
                  </td>
                  <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => dispatch(RemoveFromCart(item))}
                      className="remove-button"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="email-input">
            <h3 style={{ marginBottom: '10px', color: '#333' }}>
              Enter an email to receive the receipt (optional, defaults to: {userEmail || 'N/A'}):
            </h3>
            <input
              type="email"
              placeholder="Enter alternate email (optional)"
              className="email-input input"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            {emailError && <p style={{ color: 'red', marginTop: '8px' }}>{emailError}</p>}
          </div>

          <div className="cart-summary-section">
            <div className="cart-summary">
              <h2>💳 Payment Details</h2>

              <div className="summary-row">
                <span>💰 Subtotal:</span>
                <span>₹{totalPrice}</span>
              </div>

              {appliedDiscount > 0 && (
                <div className="summary-row discount-row">
                  <span>💸 Discount ({appliedDiscount}%):</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              {couponCodeDiscountPer > 0 && (
                <div className="summary-row discount-row">
                  <span>🏷️ Coupon ({couponCodeDiscountPer}%):</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}

              <div className="summary-row tax-row">
                <span>🧾 Tax (5%):</span>
                <span>+₹{taxPrice}</span>
              </div>

              <div className="summary-row tax-row">
                <span>🧾 Shipping Cost:</span>
                <span>₹{shipping}</span>
              </div>

              <div className="summary-row total-row">
                <span>🟰 Total:</span>
                <span>₹{finalPrice}</span>
              </div>

              <button onClick={handleProceedToCheckout} className="checkout-button">
                🛒 Proceed to Checkout
              </button>
            </div>

            <div className="discount-coupon-side">
              <h2>Apply Discount:</h2>
              <div className="discount-buttons">
                <button onClick={() => setAppliedDiscount(10)}>
                  <FaPercent style={{ marginRight: '5px' }} /> Get 10% Discount
                </button>
                <button onClick={() => setAppliedDiscount(20)}>
                  <FaGift style={{ marginRight: '5px' }} /> Get 20% Discount
                </button>
                <button onClick={() => setAppliedDiscount(30)}>
                  <FaFire style={{ marginRight: '5px' }} /> Get 30% Discount
                </button>
              </div>

              <div className="coupon-form-wrapper">
                <div className="coupon-input-wrapper">
                  <input
                    type="text"
                    ref={couponRef}
                    placeholder="Enter coupon code"
                    className="styled-coupon-input"
                  />
                  <button className="styled-coupon-button" onClick={handleApplyCoupon}>
                    Apply Coupon
                  </button>
                </div>
              </div>

              {appliedCoupon && (
                <div className="coupon-applied-msg">
                  ✅ Applied Coupon: <strong>{appliedCoupon}</strong>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {showPaymentOptions && !purchased && (
        <div className="payment-method">
          <h3>Select Payment Method</h3>
          <button
            onClick={() => handleSelectPaymentMethod('qr')}
            className={paymentMethod === 'qr' ? 'selected' : ''}
          >
            📲 QR Code
          </button>
          <button
            onClick={() => handleSelectPaymentMethod('card')}
            className={paymentMethod === 'card' ? 'selected' : ''}
          >
            💳 Card
          </button>
        </div>
      )}

      {paymentMethod === 'card' && !purchased && (
        <div className="card-payment-form">
          <h3>💳 Enter Card Details</h3>
          <input
            type="text"
            placeholder="Cardholder Name"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Card Number"
            maxLength="16"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <input
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />
          <input
            type="text"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
          />
          <button type="button" className="confirm-payment-button" onClick={handlePurchase}>
            Confirm Card Payment
          </button>
        </div>
      )}

      {paymentMethod === 'qr' && !purchased && (
        <div className="qr-code-wrapper">
          <h3>📲 Scan to Pay ₹{finalPrice}</h3>
          {finalPriceNum > 0 ? (
            <>
              <QRCode value={upiUrl} />
              <p>UPI ID: rishika7812@ybl</p>
              <button onClick={handlePurchase} className="confirm-payment-button">
                Confirm Payment
              </button>
            </>
          ) : (
            <p>❌ Invalid payment amount. Please check discounts and try again.</p>
          )}
        </div>
      )}

      {purchased && (
        <div>
        <h2 className="thank-you-message">Your Order placed Successfully...</h2>
        <h2 className="thank-you-message">
          🎉 Thank you for your purchase! Redirecting to your{' '}
          <a href="/order" onClick={() => navigate('/order')}>
            orders
          </a>{' '}
          in {redirectCountdown} seconds...
        </h2>
        </div>
      )}

      {cartObjects.length === 0 && !purchased && (
        <div className="empty-cart">
          <h2>Your cart is empty.</h2>
          <button onClick={() => navigate('/home')} className="shop-now-button" style={{backgroundColor:'lightblue'}}>
            Shop Now
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;

// import React, { useRef, useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import './cart.css';
// import store, { clearCart, DecrCart, IncrCart, RemoveFromCart } from './store';
// import { addOrder } from './store';
// import QRCode from 'react-qr-code';
// import { useNavigate } from 'react-router-dom';
// import { FaPercent, FaGift, FaFire } from 'react-icons/fa';
// import emailjs from 'emailjs-com';
// import { v4 as uuidv4 } from 'uuid';

// function Cart() {
//   const cartObjects = useSelector((state) => state.cart);
//   const userId = useSelector((state) => state.user?.userId); // Access userId from Redux store
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const totalItems = cartObjects.reduce((sum, item) => sum + item.quantity, 0);

//   const [purchased, setPurchased] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState('');
//   const [showPaymentOptions, setShowPaymentOptions] = useState(false);
//   const [redirectCountdown, setRedirectCountdown] = useState(10);
//   const [finalPriceCache, setFinalPriceCache] = useState(0); // Store price before clearing cart

//   const couponRef = useRef();
//   const [appliedDiscount, setAppliedDiscount] = useState(0);
//   const [couponCodeDiscountPer, setCouponCodeDiscountPer] = useState(0);
//   const [appliedCoupon, setAppliedCoupon] = useState('');

//   const [email, setEmail] = useState('');
//   const [emailError, setEmailError] = useState('');

//   // Optional: card input states
//   const [cardName, setCardName] = useState('');
//   const [cardNumber, setCardNumber] = useState('');
//   const [expiry, setExpiry] = useState('');
//   const [cvv, setCvv] = useState('');

//   const handleApplyCoupon = () => {
//     const couponCode = couponRef.current.value.trim().toUpperCase();
//     switch (couponCode) {
//       case 'RATAN10':
//       case 'RISHIKA10':
//         setCouponCodeDiscountPer(10);
//         setAppliedCoupon(couponCode);
//         break;
//       case 'RATAN20':
//       case 'RISHIKA20':
//         setCouponCodeDiscountPer(20);
//         setAppliedCoupon(couponCode);
//         break;
//       case 'RATAN30':
//       case 'RISHIKA30':
//         setCouponCodeDiscountPer(30);
//         setAppliedCoupon(couponCode);
//         break;
//       default:
//         alert('❌ Invalid Coupon Code');
//         setCouponCodeDiscountPer(0);
//         setAppliedCoupon('');
//     }
//   };

//   const CalculatingAmount = () => {
//     const totalPrice = cartObjects.reduce(
//       (total, item) => total + item.price * item.quantity,
//       0
//     );
//     const discountAmount = totalPrice * (appliedDiscount / 100);
//     const couponAmount = totalPrice * (couponCodeDiscountPer / 100);
//     const priceAfterDiscount = totalPrice - (discountAmount + couponAmount);
//     const taxPrice = priceAfterDiscount * 0.05;
//     const shipping = 50.00;
//     const finalPrice = priceAfterDiscount + taxPrice + shipping;

//     return {
//       totalPrice: totalPrice.toFixed(2),
//       discountAmount: discountAmount.toFixed(2),
//       couponDiscount: couponAmount.toFixed(2),
//       taxPrice: taxPrice.toFixed(2),
//       finalPrice: finalPrice.toFixed(2),
//       finalPriceNum: parseFloat(finalPrice.toFixed(2)),
//       shipping: shipping.toFixed(2),
//     };
//   };

//   const {
//     totalPrice,
//     discountAmount,
//     couponDiscount,
//     taxPrice,
//     shipping,
//     finalPrice,
//     finalPriceNum,
//   } = CalculatingAmount();

//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(String(email).toLowerCase());
//   };

//   const handlePurchase = () => {
    
//     if (!validateEmail(email)) {
//       setEmailError('❌ Please enter a valid email address.');
//       return;
//     }

//     if (finalPriceNum <= 0) {
//       alert('❌ Invalid payment amount. Please check discounts and try again.');
//       return;
//     }

//     alert('✅ Email is valid. Proceeding...');
//     setEmailError('Check your email id');

//     setFinalPriceCache(finalPrice); // Store the value for thank-you message
//     const purchaseDateTime = new Date().toLocaleString();
//     let uniqueId = 'ORD' + uuidv4().slice(0, 8).toUpperCase();

//     let purchaseDetails = {
//       id: uniqueId,
//       purchaseDateTime: purchaseDateTime,
//       items: [...cartObjects],
//       finalPrice: finalPrice,
//     };

//     if (paymentMethod === 'card') {
//       if (!cardName || !cardNumber || !expiry || !cvv) {
//         alert('Please fill in all card details.');
//         return;
//       }
//     }

//     dispatch(addOrder(purchaseDetails));
//     setPurchased(true);
//     dispatch(clearCart());

//     const githubRawBase = 'https://raw.githubusercontent.com/RishikaRaj7812/Images/main';

//     const templateParams = {
//       logo: `${githubRawBase}/dailyDelightLogo.png`,
//       order_id: purchaseDetails.id,
//       to_email: email,
//       orders: purchaseDetails.items.map((item) => ({
//         name: item.name,
//         price: item.price.toFixed(2),
//         units: item.quantity,
//         image_url: `${githubRawBase}/${item.image.replace(/^\/+/, '')}`,
//       })),
//       cost: {
//         subtotal: totalPrice,
//         shipping: 50,
//         discount: discountAmount,
//         coupon: couponDiscount,
//         tax: taxPrice,
//         total: finalPriceNum,
//       },
//     };

//     emailjs
//       .send('rishika123', 'template_30dc0ip', templateParams, 'SX77ys4f6EnCgI0xf')
//       .then(() => {
//         console.log('✅ Email sent successfully');
//       })
//       .catch((error) => {
//         console.error('❌ Failed to send email:', error);
//       });
//   };

//   const handleProceedToCheckout = () => {
//     if (userId) {
//       // User is logged in, proceed to payment options
//       setShowPaymentOptions(true);
//     } else {
//       // User is not logged in, redirect to login page
//       alert('Please log in to proceed with the checkout.');
//       navigate('/signing');
//     }
//   };

//   useEffect(() => {
//     if (purchased) {
//       const timer = setInterval(() => {
//         setRedirectCountdown((prev) => {
//           if (prev === 1) {
//             clearInterval(timer);
//             navigate('/order');
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//       return () => clearInterval(timer);
//     }
//   }, [purchased, navigate]);

//   const handleSelectPaymentMethod = (method) => {
//     setPaymentMethod(method);
//     // Removed setShowPaymentOptions(false) to keep payment options visible
//     // No need to hide payment options when a method is selected
//   };

//   const upiUrl = `upi://pay?pa=rishika7812@ybl&pn=DailyDelights&am=${encodeURIComponent(
//     finalPriceNum.toFixed(2)
//   )}&cu=INR`;

//   return (
//     <div className="cart-container">
//       {cartObjects.length > 0 && !purchased && !showPaymentOptions && !paymentMethod && (
//         <>
//           <h1>Your 🛒Cart Items are...</h1>
//           <p className="cart-title">
//             Total Items: <span className="cart-item-count">({totalItems} items)</span>
//           </p>
//         </>
//       )}

//       {cartObjects.length > 0 && !purchased && !showPaymentOptions && !paymentMethod && (
//         <>
//           <table className="cart-table">
//             <thead>
//               <tr>
//                 <th>Image</th>
//                 <th>Product</th>
//                 <th>Price</th>
//                 <th>Quantity</th>
//                 <th>Total</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {cartObjects.map((item, index) => (
//                 <tr key={index} className="cart-item-row">
//                   <td>
//                     <img src={item.image} alt={item.name} className="cart-item-image" />
//                   </td>
//                   <td>{item.name}</td>
//                   <td>₹{item.price}</td>
//                   <td>
//                     <div className="cart-item-quantity">
//                       <button onClick={() => dispatch(IncrCart(item))} className="qty-increase">
//                         +
//                       </button>
//                       <span>{item.quantity}</span>
//                       <button onClick={() => dispatch(DecrCart(item))} className="qty-decrease">
//                         -
//                       </button>
//                     </div>
//                   </td>
//                   <td>₹{(item.price * item.quantity).toFixed(2)}</td>
//                   <td>
//                     <button
//                       onClick={() => dispatch(RemoveFromCart(item))}
//                       className="remove-button"
//                     >
//                       Remove
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div className="email-input">
//             <h3 style={{ marginBottom: '10px', color: '#333' }}>
//               Enter your Email to get the receipt:
//             </h3>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               className="email-input input"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             {emailError && <p style={{ color: 'red', marginTop: '8px' }}>{emailError}</p>}
//           </div>

//           <div className="cart-summary-section">
//             <div className="cart-summary">
//               <h2>💳 Payment Details</h2>

//               <div className="summary-row">
//                 <span>💰 Subtotal:</span>
//                 <span>₹{totalPrice}</span>
//               </div>

//               {appliedDiscount > 0 && (
//                 <div className="summary-row discount-row">
//                   <span>💸 Discount ({appliedDiscount}%):</span>
//                   <span>-₹{discountAmount}</span>
//                 </div>
//               )}

//               {couponCodeDiscountPer > 0 && (
//                 <div className="summary-row discount-row">
//                   <span>🏷️ Coupon ({couponCodeDiscountPer}%):</span>
//                   <span>-₹{couponDiscount}</span>
//                 </div>
//               )}

//               <div className="summary-row tax-row">
//                 <span>🧾 Tax (5%):</span>
//                 <span>+₹{taxPrice}</span>
//               </div>

//               <div className="summary-row tax-row">
//                 <span>🧾 Shipping Cost:</span>
//                 <span>₹{shipping}</span>
//               </div>

//               <div className="summary-row total-row">
//                 <span>🟰 Total:</span>
//                 <span>₹{finalPrice}</span>
//               </div>

//               <button onClick={handleProceedToCheckout} className="checkout-button">
//                 🛒 Proceed to Checkout
//               </button>
//             </div>

//             <div className="discount-coupon-side">
//               <h2>Apply Discount:</h2>
//               <div className="discount-buttons">
//                 <button onClick={() => setAppliedDiscount(10)}>
//                   <FaPercent style={{ marginRight: '5px' }} /> Get 10% Discount
//                 </button>
//                 <button onClick={() => setAppliedDiscount(20)}>
//                   <FaGift style={{ marginRight: '5px' }} /> Get 20% Discount
//                 </button>
//                 <button onClick={() => setAppliedDiscount(30)}>
//                   <FaFire style={{ marginRight: '5px' }} /> Get 30% Discount
//                 </button>
//               </div>

//               <div className="coupon-form-wrapper">
//                 <div className="coupon-input-wrapper">
//                   <input
//                     type="text"
//                     ref={couponRef}
//                     placeholder="Enter coupon code"
//                     className="styled-coupon-input"
//                   />
//                   <button className="styled-coupon-button" onClick={handleApplyCoupon}>
//                     Apply Coupon
//                   </button>
//                 </div>
//               </div>

//               {appliedCoupon && (
//                 <div className="coupon-applied-msg">
//                   ✅ Applied Coupon: <strong>{appliedCoupon}</strong>
//                 </div>
//               )}
//             </div>
//           </div>
//         </>
//       )}

//       {showPaymentOptions && !purchased && (
//         <div className="payment-method">
//           <h3>Select Payment Method</h3>
//           <button
//             onClick={() => handleSelectPaymentMethod('qr')}
//             className={paymentMethod === 'qr' ? 'selected' : ''}
//           >
//             📲 QR Code
//           </button>
//           <button
//             onClick={() => handleSelectPaymentMethod('card')}
//             className={paymentMethod === 'card' ? 'selected' : ''}
//           >
//             💳 Card
//           </button>
//         </div>
//       )}

//       {paymentMethod === 'card' && !purchased && (
//         <div className="card-payment-form">
//           <h3>💳 Enter Card Details</h3>
//           <input
//             type="text"
//             placeholder="Cardholder Name"
//             value={cardName}
//             onChange={(e) => setCardName(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Card Number"
//             maxLength="16"
//             value={cardNumber}
//             onChange={(e) => setCardNumber(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="MM/YY"
//             value={expiry}
//             onChange={(e) => setExpiry(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="CVV"
//             value={cvv}
//             onChange={(e) => setCvv(e.target.value)}
//           />
//           <button type="button" className="confirm-payment-button" onClick={handlePurchase}>
//             Confirm Card Payment
//           </button>
//         </div>
//       )}

//       {paymentMethod === 'qr' && !purchased && (
//         <div className="qr-code-wrapper">
//           <h3>📲 Scan to Pay ₹{finalPrice}</h3>
//           {finalPriceNum > 0 ? (
//             <>
//               <QRCode value={upiUrl} />
//               <p>UPI ID: rishika7812@ybl</p>
//               <button onClick={handlePurchase} className="confirm-payment-button">
//                 Confirm Payment
//               </button>
//             </>
//           ) : (
//             <p>❌ Invalid payment amount. Please check discounts and try again.</p>
//           )}
//         </div>
//       )}

//       {purchased && (
//         <h2 className="thank-you-message">
//           🎉 Thank you for your purchase! Redirecting to your{' '}
//           <a href="/order" onClick={() => navigate('/order')}>
//             orders
//           </a>{' '}
//           in {redirectCountdown} seconds...
//         </h2>
//       )}

//       {cartObjects.length === 0 && !purchased && (
//         <div className="empty-cart">
//           <h2>Your cart is empty.</h2>
//           <button onClick={() => navigate('/home')} className="shop-now-button" style={{backgroundColor:'lightblue'}}>
//             Shop Now
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Cart;