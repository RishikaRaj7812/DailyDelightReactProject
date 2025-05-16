// import React from 'react';
// import { useSelector } from 'react-redux';
// import './order.css';

// function Order() {
//   const orders = useSelector((state) => state.order);

//   return (
//     <div className="order-history-container">
//       <h2 className="order-history-title">Your Past Orders</h2>
//       {orders.length === 0 ? (
//         <p className="no-orders">No orders placed yet.</p>
//       ) : (
//         <div className="orders-list">
//           {orders.map((order, index) => (
//             <div key={order.id || index} className="order-card">
//               <div className="order-header">
//                 <p className="order-id">Order ID: {order.id}</p>
//                 <p className="order-date">
//                   <strong>Date & Time:</strong> {order.purchaseDateTime}
//                 </p>
//               </div>
//               <div className="order-items">
//                 <h4>Items:</h4>
//                 <ul>
//                   {order.items.map((item, i) => (
//                     <li key={i} className="order-item">
//                       <span className="item-name">{item.name}</span>
//                       <span className="item-quantity">x {item.quantity}</span>
//                       <span className="item-price">
//                         ₹{item.price.toFixed(2)} each (Total: ₹{(item.price * item.quantity).toFixed(2)})
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <div className="order-footer">
//                 <p className="order-total">
//                   <strong>Total Price:</strong> ₹{parseFloat(order.finalPrice).toFixed(2)}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Order;

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './order.css';

function Order() {
  const orders = useSelector((state) => state.order);
  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleShowMore = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <div className="order-history-container">
      <h2 className="order-history-title">Your Past Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders">No orders placed yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => {
            const isExpanded = expandedOrders[order.id] || false;
            const displayItems = isExpanded ? order.items : order.items.slice(0, 2);
            const showMoreButton = order.items.length > 2;

            return (
              <div key={order.id || index} className="order-card">
                <div className="order-header">
                  <p className="order-id">Order ID: {order.id}</p>
                  <p className="order-date">
                    <strong>Date & Time:</strong> {order.purchaseDateTime}
                  </p>
                </div>
                <div className="order-items">
                  <h4>Items:</h4>
                  <ul>
                    {displayItems.map((item, i) => (
                      <li key={i} className="order-item">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">x {item.quantity}</span>
                        <span className="item-price">
                          ₹{item.price.toFixed(2)} each (Total: ₹{(item.price * item.quantity).toFixed(2)})
                        </span>
                      </li>
                    ))}
                  </ul>
                  {showMoreButton && (
                    <button
                      className="show-more-btn"
                      onClick={() => toggleShowMore(order.id)}
                    >
                      {isExpanded ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>
                <div className="order-footer">
                  <p className="order-total">
                    <strong>Total Price:</strong> ₹{parseFloat(order.finalPrice).toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Order;