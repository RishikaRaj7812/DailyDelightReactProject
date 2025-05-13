import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <header className="home-hero">
        <div className="hero-content">
          <h1>Freshness Delivered Daily</h1>
          <p>Shop premium groceries, snacks, and more from the comfort of your home.</p>
          <Link to="/fruit">
            <button className="shop-now-btn">Shop Now</button>
          </Link>
        </div>
      </header>

      <section className="home-categories">
        <h2>Shop by Categories</h2>
        <div className="category-cards">
          <div className="category-card"><Link to="/fruit"><h2>🍎 Fruit</h2><p>Fresh and organic fruits.</p></Link></div>
          <div className="category-card"><Link to="/vegetable"><h2>🥕 Vegetable</h2><p>From farm to your table.</p></Link></div>
          <div className="category-card"><Link to="/snacks"><h2>🍪 Snacks</h2><p>Crave-worthy treats.</p></Link></div>
          <div className="category-card"><Link to="/milk"><h2>🧀 Dairy</h2><p>Milks, cheeses, and more.</p></Link></div>
          <div className="category-card"><Link to="/chocolate"><h2>🍫 Chocolate</h2><p>Decadent delights await.</p></Link></div>
        </div>
      </section>

      <section className="why-choose-us">
        <h2>Why Choose DailyDelights?</h2>
        <ul>
          <li>🌿 100% Organic & Fresh Products</li>
          <li>🚚 Same-Day Delivery in Select Areas</li>
          <li>🛒 Seamless Online Shopping Experience</li>
          <li>💳 Secure Payment Options</li>
        </ul>
      </section>

      <section className="testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <p>“Super fresh fruits delivered right to my door. Love the service!”</p>
            <span>– Ayesha K.</span>
          </div>
          <div className="testimonial-card">
            <p>“Easy to order, fast delivery, and great quality. Highly recommend!”</p>
            <span>– Rohit S.</span>
          </div>
        </div>
      </section>

      <section className="newsletter-signup">
        <h2>Stay Updated!</h2>
        <p>Subscribe to our newsletter for exclusive deals and updates.</p>
        <input type="email" placeholder="Enter your email" /> <br /><br />
        <button>Subscribe</button>
      </section>

      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} DailyDelights. All Rights Reserved.</p>
        <div className="social-links">
          <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
        </div>
      </footer>
    </div>
  );
}

export default Home;

