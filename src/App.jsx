// import React, { useState } from 'react';
// import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
// import { Provider, useDispatch } from 'react-redux'; // Import Provider
// import store from './store'; // Import your Redux store
// import Home from './Home';
// import Fruit from './Fruit';
// import Vegetable from './Vegetable';
// import Snacks from './Snacks';
// import Milk from './Milk';
// import Chocolate from './Chocolate';
// import Signing from './Signing';
// import Cart from './Cart';
// import Order from './Order';
// import AboutUs from './AboutUs';
// import ContactUs from './ContactUs';
// import AdminPanel from './AdminPanel'; // Import AdminPanel
// import './App.css';    
// import { useSelector } from 'react-redux';
// import Registration from './Registration';

// function App() {
//   const [searchQuery, setSearchQuery] = useState("");

//   const handleSearch = (e) => {
//     e.preventDefault();
//     alert(`Searching for "${searchQuery}"`);
//     // You can integrate actual search/filter logic here
//   };

//   const cart = useSelector((state) => state.cart);
//   const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

//   const dispatch = useDispatch(); // Add useDispatch to dispatch logout action
//   // const { isAuthenticated } = useSelector((state) => state.users);

//   const isAuthenticated = useSelector((state) => state.users.isAuthenticated);

//   return (
//     <>
//     <Provider store={store}> {/* Wrap the app with Provider */}
//       <BrowserRouter>
//         <div className="app">
//           <header className="navbar">
//             <div className="logo">
//               <Link to="/home" className="logo">DailyDelights</Link>
//             </div>
//             <nav className="nav-links">
//               <Link to="/home">Home</Link>
//               <Link to="/fruit">Fruit</Link>
//               <Link to="/vegetable">Vegetable</Link>
//               <Link to="/snacks">Snacks</Link>
//               <Link to="/milk">Milk</Link>
//               <Link to="/chocolate">Chocolate</Link>
//               {/* <Link to="/signing">🔑Login</Link> */}

//               {/* Conditionally render Login or Logout based on isAuthenticated */}
//               {isAuthenticated ? (
//                 <button onClick={handleLogout} className="logout-button">
//                   🔓Logout
//                 </button>
//               ) : (
//                 <Link to="/signing">🔑Login</Link>
//               )}
        
//               <div className="cart-link-wrapper">
//                 <Link to="/cart" className="cart-link">
//                   Cart🛒
//                   {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
//                 </Link>
//               </div>

//               <Link to="/order">Order</Link>
//               <Link to="/about">About Us</Link>
//               <Link to="/contact">Contact Us</Link>
//               <Link to="/admin">Admin</Link> {/* Optional: Add a link to the admin panel */}
//             </nav>

//             {/* Search Bar */}
//             <form className="search-bar" onSubmit={handleSearch}>
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//               <button type="submit">Search</button>
//             </form>
//           </header>
//            {/* <h1 style={{ marginTop: '30px' }}>Welcome to my website</h1> */}

//           <main className="content">
//             <Routes>
//               <Route path="/home" element={<Home />} />
//               <Route path="/fruit" element={<Fruit />} />
//               <Route path="/vegetable" element={<Vegetable />} />
//               <Route path="/snacks" element={<Snacks />} />
//               <Route path="/milk" element={<Milk />} />
//               <Route path="/chocolate" element={<Chocolate />} />
//               <Route path="/signing" element={<Signing />} />
//               <Route path="/cart" element={<Cart />} />
//               <Route path="/order" element={<Order />} />
//               <Route path="/about" element={<AboutUs />} />
//               <Route path="/contact" element={<ContactUs />} />
//               <Route path="/admin" element={<AdminPanel />} />
//               <Route path="/registration" element={<Registration />} />

//             </Routes>
//           </main>
//         </div>
//       </BrowserRouter>
//     </Provider>
   

//     </>
//   );
// }

// export default App;

import React, { useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import Home from './Home';
import Fruit from './Fruit';
import Vegetable from './Vegetable';
import Snacks from './Snacks';
import Milk from './Milk';
import Chocolate from './Chocolate';
import Signing from './Signing';
import Cart from './Cart';
import Order from './Order';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';
import AdminPanel from './AdminPanel';
import './App.css';
import Registration from './Registration';
import store, { logout } from './store';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.users.isAuthenticated);
  const cart = useSelector((state) => state.cart);
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for "${searchQuery}"`);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <div className="app">
            <header className="navbar">
              <div className="logo">
                <Link to="/home" className="logo">
                  DailyDelights
                </Link>
              </div>
              <nav className="nav-links">
                <Link to="/home">Home</Link>
                <Link to="/fruit">Fruit</Link>
                <Link to="/vegetable">Vegetable</Link>
                <Link to="/snacks">Snacks</Link>
                <Link to="/milk">Milk</Link>
                <Link to="/chocolate">Chocolate</Link>

                {isAuthenticated ? (
                  <button onClick={handleLogout} className="logout-button">
                    🔓Logout
                  </button>
                ) : (
                  <Link to="/signing">🔑Login</Link>
                )}

                <div className="cart-link-wrapper">
                  <Link to="/cart" className="cart-link">
                    Cart🛒
                    {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
                  </Link>
                </div>

                <Link to="/order">Order</Link>
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact Us</Link>
                {/* <Link to="/admin">Admin</Link> */}
              </nav>

              <form className="search-bar" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">Search</button>
              </form>
            </header>

            <main className="content">
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/fruit" element={<Fruit />} />
                <Route path="/vegetable" element={<Vegetable />} />
                <Route path="/snacks" element={<Snacks />} />
                <Route path="/milk" element={<Milk />} />
                <Route path="/chocolate" element={<Chocolate />} />
                <Route path="/signing" element={<Signing />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/order" element={<Order />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/registration" element={<Registration />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App; 