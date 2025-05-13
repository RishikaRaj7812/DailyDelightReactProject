import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AddToCart, IncrCart, DecrCart } from './store';
import './ProductStyles.css';
import PaginatedList from './PaginatedList';
import PriceFilter from './PriceFilter';

function Milk() {
  const milkProducts = useSelector((state) => state.products.milk);
  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  const filteredProducts = milkProducts.filter(
    (product) => product.price <= maxPrice
  );

  const renderMilkProduct = (product, index) => {
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
            <button onClick={() => dispatch(DecrCart(product))} className="qty-btn qty-decrease">−</button>
            <span className="cart-qty-count">{quantity}</span>
            <button onClick={() => dispatch(IncrCart(product))} className="qty-btn qty-increase">+</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="product-container">
      <h1 className="product-title">Fresh & Healthy Milk Products 🥛🧈🧀</h1>
      <PriceFilter
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
      />
      <PaginatedList
        items={filteredProducts}
        itemsPerPage={4}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        renderItem={renderMilkProduct}
      />
    </div>
  );
}

export default Milk;
