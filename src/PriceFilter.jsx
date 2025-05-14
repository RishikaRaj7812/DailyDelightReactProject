// import React from 'react';
// import './FilterStyle.css';

// function PriceFilter({ maxPrice, setMaxPrice, minPrice = 0 }) {
//   return (
//     <div className="price-filter">
//       <div className="price-label">Max Price: ₹{maxPrice}</div>
//       <input
//         type="range"
//         min={minPrice}
//         max={500}
//         value={maxPrice}
//         onChange={(e) => setMaxPrice(Number(e.target.value))}
//         className="price-slider"
//       />
//     </div>
//   );
// }
// export default PriceFilter;

import React from 'react';
import './FilterStyle.css';

function PriceFilter({ maxPrice, setMaxPrice, minPrice = 0 }) {
  // Calculate the fill percentage for the slider track
  const maxSliderValue = 500;
  const range = maxSliderValue - minPrice;
  const fillPercentage = ((maxPrice - minPrice) / range) * 100;

  return (
    <div className="price-filter">
      <div className="price-label">Max Price: ₹{maxPrice}</div>
      <input
        type="range"
        min={minPrice}
        max={maxSliderValue}
        value={maxPrice}
        onChange={(e) => setMaxPrice(Number(e.target.value))}
        className="price-slider"
        style={{ '--fill-percentage': `${fillPercentage}%` }}
      />
    </div>
  );
}

export default PriceFilter;