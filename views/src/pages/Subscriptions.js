import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.postlii.com/api/subscription/all`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSubscriptions(data.subscriptions);
      } else {
        throw new Error(data.message || 'Failed to fetch subscriptions');
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusBadge = (status) => {
    let backgroundColor;
    let textColor = '#fff';
    
    switch (status.toLowerCase()) {
      case 'active':
        backgroundColor = '#10B981'; // green
        break;
      case 'expired':
        backgroundColor = '#DC2626'; // red
        break;
      case 'pending':
        backgroundColor = '#F59E0B'; // amber
        break;
      default:
        backgroundColor = '#6B7280'; // gray
    }
    
    return (
      <span style={{
        backgroundColor,
        color: textColor,
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '0.875rem',
        fontWeight: '500',
      }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const matchesStatus = statusFilter === 'all' || subscription.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPackage = packageFilter === 'all' || subscription.package.toLowerCase() === packageFilter.toLowerCase();
    return matchesStatus && matchesPackage;
  });

  return (
    <div className="p-4" style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1E1E2F, #4B4F7A)',
      padding: '40px 20px',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h2 style={{
        paddingBottom: '10px',
        color: '#e7e2e2ff',
        fontSize: '28px',
        fontWeight: '700',
      }}>
        💳 Subscriptions
      </h2>

      <ToastContainer position="top-right" autoClose={2500} />

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center' }}>
            <div>
              <label style={{ color: '#fff', marginRight: '10px', fontSize: '16px' }}>Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  backgroundColor: '#fff',
                  color: '#333',
                  fontSize: '14px',
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label style={{ color: '#fff', marginRight: '10px', fontSize: '16px' }}>Package:</label>
              <select
                value={packageFilter}
                onChange={(e) => setPackageFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  backgroundColor: '#fff',
                  color: '#333',
                  fontSize: '14px',
                }}
              >
                <option value="all">All Packages</option>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table" style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
              color: '#333',
            }}>
              <thead>
                <tr>
                  <th style={{
                    background: 'linear-gradient(180deg, #4B4F7A, #1E1E2F)',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '1rem',
                    padding: '0.75rem',
                  }}>Email</th>
                  <th style={{
                    background: 'linear-gradient(180deg, #4B4F7A, #1E1E2F)',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '1rem',
                    padding: '0.75rem',
                  }}>Package</th>
                  <th style={{
                    background: 'linear-gradient(180deg, #4B4F7A, #1E1E2F)',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '1rem',
                    padding: '0.75rem',
                  }}>Amount</th>
                  <th style={{
                    background: 'linear-gradient(180deg, #4B4F7A, #1E1E2F)',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '1rem',
                    padding: '0.75rem',
                  }}>Start Date</th>
                  <th style={{
                    background: 'linear-gradient(180deg, #4B4F7A, #1E1E2F)',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '1rem',
                    padding: '0.75rem',
                  }}>End Date</th>
                  <th style={{
                    background: 'linear-gradient(180deg, #4B4F7A, #1E1E2F)',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '1rem',
                    padding: '0.75rem',
                  }}>Status</th>
                  <th style={{
                    background: 'linear-gradient(180deg, #4B4F7A, #1E1E2F)',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '1rem',
                    padding: '0.75rem',
                  }}>Payment Method</th>
                  <th style={{
                    background: 'linear-gradient(180deg, #4B4F7A, #1E1E2F)',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '1rem',
                    padding: '0.75rem',
                  }}>Auto Renew</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.length > 0 ? (
                  filteredSubscriptions.map((subscription) => (
                    <tr key={subscription._id}>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        fontSize: '0.95rem',
                        verticalAlign: 'middle',
                      }}>{subscription.email}</td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        fontSize: '0.95rem',
                        verticalAlign: 'middle',
                        textTransform: 'capitalize',
                        fontWeight: '500',
                      }}>{subscription.package}</td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        fontSize: '0.95rem',
                        verticalAlign: 'middle',
                      }}>${subscription.amount}</td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        fontSize: '0.95rem',
                        verticalAlign: 'middle',
                      }}>{formatDate(subscription.startDate)}</td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        fontSize: '0.95rem',
                        verticalAlign: 'middle',
                      }}>{formatDate(subscription.endDate)}</td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        fontSize: '0.95rem',
                        verticalAlign: 'middle',
                      }}>{getStatusBadge(subscription.status)}</td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        fontSize: '0.95rem',
                        verticalAlign: 'middle',
                        textTransform: 'capitalize',
                      }}>{subscription.paymentMethod.replace('_', ' ')}</td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        fontSize: '0.95rem',
                        verticalAlign: 'middle',
                      }}>
                        <span style={{
                          backgroundColor: subscription.autoRenew ? '#10B981' : '#6B7280',
                          color: '#fff',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                        }}>
                          {subscription.autoRenew ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4">No subscriptions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Subscriptions;