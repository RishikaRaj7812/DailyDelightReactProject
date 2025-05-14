import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './ProductStyles.css';
import { AddToCart, IncrCart, DecrCart } from './store';
import PaginatedList from './PaginatedList';
import PriceFilter from './PriceFilter';
import { Link } from 'react-router-dom';

function Chocolate() {
  const chocolateProducts = useSelector((globalState) => globalState.products.chocolates);
  const cartItems = useSelector((globalState) => globalState.cart);
  const dispatch = useDispatch();

  const [maxPrice, setMaxPrice] = useState(500); // Only maxPrice is needed for PriceFilter
  const [currentPage, setCurrentPage] = useState(1);

  // Filter products based on maxPrice
  const filteredProducts = chocolateProducts.filter(
    (product) => product.price <= maxPrice
  );

  // Render each chocolate product
  const renderChocolateProduct = (product, index) => {
    const itemInCart = cartItems.find((item) => item.name === product.name);
    const isInCart = !!itemInCart;
    const quantity = itemInCart ? itemInCart.quantity : 0;

    return (
      <div key={index} className="product-card">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />
        <h3>
          {product.name} /- <span className="product-price">₹{product.price.toFixed(2)}</span>
        </h3>
        <p style={{ color: 'gray' }}>{product.description}</p>

        {!isInCart ? (
          <button
            onClick={() => dispatch(AddToCart(product))}
            className="add-to-cart-btn"
          >
            Add To Cart
          </button>
        ) : (
          <div className="cart-item-quantity">
            <button
              onClick={() => dispatch(DecrCart(product))}
              className="qty-btn qty-decrease"
            >
              −
            </button>
            <span className="cart-qty-count">{quantity}</span>
            <button
              onClick={() => dispatch(IncrCart(product))}
              className="qty-btn qty-increase"
            >
              +
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="product-container">
      <h1 className="product-title">Delicious Chocolates 🍫🍬</h1>
      <PriceFilter
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
      />
      <PaginatedList
        items={filteredProducts} // Use filtered products
        itemsPerPage={4}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        renderItem={renderChocolateProduct}
      />
      <Link to="/cart" className="go-to-cart-button">🛒 Go to Cart</Link>
    </div>
  );
}

export default Chocolate;