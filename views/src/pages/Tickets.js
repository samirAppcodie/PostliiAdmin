import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import '../assets/css/UserList.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(10);

  const fetchTickets = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.postlii.com/api/support/tickets?page=${page}`);
      if (response.data.success) {
        setTickets(response.data.tickets || []);
        setTotalPages(response.data.totalPages || Math.ceil(response.data.total / perPage));
        setCurrentPage(page);
      } else {
        toast.error('Failed to fetch tickets');
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Error fetching tickets: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(currentPage);
  }, [currentPage]);

  const handleStatusUpdate = async (ticketId, newStatus) => {
    if (!newStatus) return; // Prevent empty selection
    try {
      const response = await axios.put(`http://localhost:5000/api/support/ticket/${ticketId}/status`, {
        status: newStatus,
      });
      if (response.data.success) {
        toast.success(`Ticket status updated to ${newStatus}`);
        setTickets(tickets.map(ticket =>
          ticket.ticketId === ticketId ? { ...ticket, status: newStatus } : ticket
        ));
      } else {
        toast.error('Failed to update ticket status');
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast.error('Error updating status: ' + (error.response?.data?.message || error.message));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

 const columns = [
  { name: 'Ticket ID', selector: row => row.ticketId, sortable: true },
  { name: 'Email', selector: row => row.email, sortable: true }, // Changed from 'Name' to 'Email'
  { name: 'Subject', selector: row => row.subject, sortable: true },
  {
    name: 'Query',
    selector: row => row.query,
    sortable: true,
    cell: row => (
      <div
        style={{
          width: '100%',
          minHeight: '60px',
          padding: '8px',
          border: '1px solid #ced4da',
          borderRadius: '4px',
          backgroundColor: '#f8f9fa',
          whiteSpace: 'pre-wrap',
          overflowY: 'auto',
          maxHeight: '100px',
          fontSize: '14px',
          lineHeight: '1.5',
        }}
      >
        {row.query}
      </div>
    ),
  },
  {
    name: 'Attachment',
    cell: row =>
      row.attachment ? (
        <a href={`https://api.postlii.com${row.attachment}`} target="_blank" rel="noopener noreferrer">
          View Attachment
        </a>
      ) : (
        'No Attachment'
      ),
  },
  {
    name: 'Status',
    selector: row => row.status,
    sortable: true,
    cell: row => (
      <div
        className="status-badge"
        style={{
          backgroundColor:
            row.status === 'open' ? '#ffc107' :
            row.status === 'in-progress' ? '#007bff' :
            row.status === 'resolved' ? '#17a2b8' :
            '#28a745',
          color: '#fff',
          padding: '5px 10px',
          borderRadius: '4px',
          fontWeight: 'bold',
          textTransform: 'capitalize',
        }}
      >
        {row.status}
      </div>
    ),
  },
  {
    name: 'Actions',
    cell: row => (
      <select
        value=""
        onChange={e => handleStatusUpdate(row.ticketId, e.target.value)}
        className="form-select form-select-sm"
        style={{
          width: '150px',
          padding: '5px',
          borderRadius: '4px',
          border: '1px solid #ced4da',
          backgroundColor: '#fff',
          color: '#333',
        }}
      >
        <option value="" disabled>
          Select Action
        </option>
        {row.status === 'open' && (
          <>
            <option value="in-progress">Start Progress</option>
            <option value="resolved">Mark as Resolved</option>
            <option value="closed">Close Ticket</option>
          </>
        )}
        {row.status === 'in-progress' && (
          <>
            <option value="resolved">Mark as Resolved</option>
            <option value="closed">Close Ticket</option>
          </>
        )}
        {row.status === 'resolved' && (
          <option value="closed">Close Ticket</option>
        )}
        {row.status === 'closed' && (
          <option value="open">Reopen Ticket</option>
        )}
      </select>
    ),
  },
];

  const customStyles = {
    headCells: {
      style: {
        background: 'linear-gradient(180deg, #5f7cdb, #589ebe)',
        fontWeight: 'bold',
        fontSize: '15px',
        color: '#fff',
        paddingLeft: '16px',
        paddingRight: '16px',
      },
    },
    cells: {
      style: {
        fontSize: '14px',
        paddingLeft: '16px',
        paddingRight: '16px',
      },
    },
    rows: {
      style: {
        minHeight: '80px', // Increased to accommodate textarea-like query field
      },
    },
  };

  return (
    <div className="user-table">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2
        style={{
          color: '#111827',
          paddingBottom: '20px',
          fontSize: '28px',
          fontWeight: '700',
          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
        }}
      >
        🎫 Support Tickets
      </h2>

      <div className="add-member-container d-flex justify-content-between align-items-center mb-4">
        <div className="search-container position-relative">
          <i className="fa fa-search search-icon" />
          <input
            type="text"
            placeholder="Search by ticket ID, name, subject..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="form-control search-input ps-5"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2" style={{ color: '#333' }}>Loading tickets...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={tickets.filter(ticket => {
  const text = searchText.toLowerCase().trim();
  return (
    (ticket.ticketId && ticket.ticketId.toString().toLowerCase().includes(text)) ||
    (ticket.email && ticket.email.toLowerCase().includes(text)) || // Changed from ticket.name to ticket.email
    (ticket.subject && ticket.subject.toLowerCase().includes(text)) ||
    (ticket.query && ticket.query.toLowerCase().includes(text))
  );
})}
          pagination
          paginationServer
          paginationTotalRows={totalPages * perPage}
          paginationDefaultPage={currentPage}
          onChangePage={handlePageChange}
          paginationPerPage={perPage}
          highlightOnHover
          responsive
          persistTableHead
          customStyles={customStyles}
          noDataComponent={
            <div className="p-4 text-center">
              <p style={{ color: '#333', fontSize: '16px' }}>No tickets found</p>
            </div>
          }
        />
      )}
    </div>
  );
};

export default Tickets;