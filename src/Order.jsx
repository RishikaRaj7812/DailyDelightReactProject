import React from 'react';
import { useSelector } from 'react-redux';
import './order.css'; // ✅ Importing the CSS

function Order() {
  const orders = useSelector((state) => state.order);

  return (
    <div>
      <h2>Your Past Orders</h2>
      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} className="order-card">
            <p><strong>Date:</strong> {order.date}</p>
            <ul>
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.name} x {item.quantity} - ₹{item.price}
                </li>
              ))}
            </ul>
            <p><strong>Total:</strong> ₹{order.finalPrice}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Order;
