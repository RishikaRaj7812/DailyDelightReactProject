import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AddToCart, IncrCart, DecrCart } from './store';
import './ProductStyles.css';
import PaginatedList from './PaginatedList';
import PriceFilter from './PriceFilter';
import { Link } from 'react-router-dom';

function Snacks() {
  const snacksProducts = useSelector((globalState) => globalState.products.snacks);
  const cartItems = useSelector((globalState) => globalState.cart);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);

  const filteredProducts = snacksProducts.filter(
    (product) => product.price <= maxPrice
  );

  // Render snack product item
  const renderSnackProduct = (product, index) => {
    const itemInCart = cartItems.find((item) => item.name === product.name);
    const isInCart = !!itemInCart;
    const quantity = itemInCart ? itemInCart.quantity : 0;

    return (
      <div key={index} className="product-card">
        <img src={product.image} alt={product.name} className="product-image" />
        <h3>
          {product.name} /- <span className="product-price">₹{product.price.toFixed(2)}</span>
        </h3>
        <p style={{ color: 'gray' }}>{product.description}</p>

        {!isInCart ? (
          <button onClick={() => dispatch(AddToCart(product))} className="add-to-cart-btn">
            Add To Cart
          </button>
        ) : (
          <div className="cart-item-quantity">
            <button onClick={() => dispatch(DecrCart(product))} className="qty-btn qty-decrease">
              −
            </button>
            <span className="cart-qty-count">{quantity}</span>
            <button onClick={() => dispatch(IncrCart(product))} className="qty-btn qty-increase">
              +
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="product-container">
      <h1 className="product-title">Tasty & Crunchy Snacks 🍿🍪🍫</h1>
      <PriceFilter
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
      />
      <PaginatedList
        items={filteredProducts}
        itemsPerPage={4} // You can adjust the number of items per page as needed
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        renderItem={renderSnackProduct}
      />
      <Link to="/cart" className="go-to-cart-button">🛒 Go to Cart</Link>
    </div>
  );
}

export default Snacks;
