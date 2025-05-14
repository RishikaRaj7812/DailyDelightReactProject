import React from 'react';
import { useSelector } from 'react-redux';
import './AdminPanel.css';

function AdminPanel() {
  const loginHistory = useSelector((state) => state.user.loginHistory);
  const loggedInUsers = useSelector((state) => state.user.loggedInUsers);

  // Function to find userData by email
  const getUserDataByEmail = (email) => {
    const user = loggedInUsers.find((u) => u.email === email);
    return user ? user.userData : null;
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel - Login History</h1>
      {loginHistory.length > 0 ? (
        <table className="user-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Login Time</th>
            </tr>
          </thead>
          <tbody>
            {loginHistory.map((entry, index) => {
              // Get userData for the email
              const userData = getUserDataByEmail(entry.email);
              return (
                <tr key={`${entry.email}-${index}`}>
                  <td>{entry.email}</td>
                  <td>{userData?.name || 'N/A'}</td>
                  <td>{new Date(entry.timestamp).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No login history available.</p>
      )}
    </div>
  );
}

export default AdminPanel;