import React from 'react';
import './ProductStyles.css';

function PriceFilter({ maxPrice, setMaxPrice, minPrice = 0 }) {
  return (
    <div className="price-filter">
      <div className="price-label">Max Price: ₹{maxPrice}</div>
      <input
        type="range"
        min={minPrice}
        max={1000}
        value={maxPrice}
        onChange={(e) => setMaxPrice(Number(e.target.value))}
        className="price-slider"
      />
    </div>
  );
}
export default PriceFilter;