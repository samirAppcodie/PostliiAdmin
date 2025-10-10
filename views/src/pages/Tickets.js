import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import '../assets/css/UserList.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConfirmStatusToast = ({ ticketId, newStatus, onConfirm, onCancel }) => (
  <div style={{
    maxWidth: '420px',
    margin: '0 auto',
    backgroundColor: '#fff',
    padding: '24px 32px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  }}>
    <p style={{
      marginBottom: '20px',
      fontSize: '16px',
      fontWeight: '500',
      color: '#333'
    }}>
      ⚠️ Are you sure you want to update the status of ticket {ticketId} to "{newStatus}"?
    </p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
      <button
        onClick={() => {
          toast.dismiss();
          onConfirm();
        }}
        style={{
          width: '140px',
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'background 0.3s',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#218838')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#28a745')}
      >
        Yes, Update
      </button>
      <button
        onClick={() => {
          toast.dismiss();
          onCancel();
        }}
        style={{
          width: '140px',
          padding: '10px 20px',
          backgroundColor: '#6c757d',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'background 0.3s',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#5a6268')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#6c757d')}
      >
        Cancel
      </button>
    </div>
  </div>
);

const ConfirmBulkStatusToast = ({ newStatus, selectedCount, onConfirm, onCancel }) => (
  <div style={{
    maxWidth: '420px',
    margin: '0 auto',
    backgroundColor: '#fff',
    padding: '24px 32px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  }}>
    <p style={{
      marginBottom: '20px',
      fontSize: '16px',
      fontWeight: '500',
      color: '#333'
    }}>
      ⚠️ Are you sure you want to update the status of {selectedCount} ticket(s) to "{newStatus}"?
    </p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
      <button
        onClick={() => {
          toast.dismiss();
          onConfirm();
        }}
        style={{
          width: '140px',
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'background 0.3s',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#218838')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#28a745')}
      >
        Yes, Update
      </button>
      <button
        onClick={() => {
          toast.dismiss();
          onCancel();
        }}
        style={{
          width: '140px',
          padding: '10px 20px',
          backgroundColor: '#6c757d',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'background 0.3s',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#5a6268')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#6c757d')}
      >
        Cancel
      </button>
    </div>
  </div>
);

const CustomPagination = ({
  rowsPerPage,
  rowCount,
  currentRowFrom,
  currentRowTo,
  onChangePage,
  onChangeRowsPerPage,
  currentPage = 1,
  totalPages = Math.ceil(rowCount / rowsPerPage)
}) => {
  const handleRowsPerPageChange = (e) => {
    const value = e.target.value;
    const newRowsPerPage = value === 'All' ? rowCount : parseInt(value, 10);
    console.log('Rows per page changed to:', newRowsPerPage); // Debug log
    onChangeRowsPerPage(newRowsPerPage, 1); // Reset to page 1
  };

  const handlePageChange = (page) => {
    console.log('Page changed to:', page); // Debug log
    onChangePage(page);
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || totalPages === 0;

  const displayRowsPerPage = rowsPerPage === rowCount && rowCount > 0 ? 'All' : rowsPerPage;

  const calculatedFrom = currentRowFrom || ((currentPage - 1) * rowsPerPage + 1);
  const calculatedTo = currentRowTo || Math.min(currentPage * rowsPerPage, rowCount);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '8px 12px',
        backgroundColor: '#ffffff',
        color: '#333333',
        fontSize: '14px',
        borderTop: '1px solid #dee2e6',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: '#6c757d', fontSize: '13px' }}>Rows per page:</span>
          <select
            onChange={handleRowsPerPageChange}
            value={displayRowsPerPage}
            style={{
              backgroundColor: '#ffffff',
              color: '#333333',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              padding: '4px 6px',
              fontSize: '14px',
              cursor: 'pointer',
              minWidth: '50px',
            }}
          >
            {[25, 50, 75, 100, 'All'].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div style={{ fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap' }}>
          {rowCount > 0
            ? `${calculatedFrom}-${calculatedTo} of ${rowCount}`
            : '0 of 0'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <button
            onClick={() => handlePageChange(1)}
            disabled={isFirstPage}
            style={{
              background: 'none',
              border: 'none',
              color: isFirstPage ? '#6c757d' : '#495057',
              fontSize: '30px',
              cursor: isFirstPage ? 'not-allowed' : 'pointer',
              padding: '4px 2px',
              opacity: isFirstPage ? 0.5 : 1,
              lineHeight: 1,
            }}
          >
            «
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={isFirstPage}
            style={{
              background: 'none',
              border: 'none',
              color: isFirstPage ? '#6c757d' : '#495057',
              fontSize: '30px',
              cursor: isFirstPage ? 'not-allowed' : 'pointer',
              padding: '4px 4px',
              opacity: isFirstPage ? 0.5 : 1,
              lineHeight: 1,
            }}
          >
            ‹
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={isLastPage}
            style={{
              background: 'none',
              border: 'none',
              color: isLastPage ? '#6c757d' : '#495057',
              fontSize: '30px',
              cursor: isLastPage ? 'not-allowed' : 'pointer',
              padding: '4px 4px',
              opacity: isLastPage ? 0.5 : 1,
              lineHeight: 1,
            }}
          >
            ›
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={isLastPage}
            style={{
              background: 'none',
              border: 'none',
              color: isLastPage ? '#6c757d' : '#495057',
              fontSize: '30px',
              cursor: isLastPage ? 'not-allowed' : 'pointer',
              padding: '4px 2px',
              opacity: isLastPage ? 0.5 : 1,
              lineHeight: 1,
            }}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(25);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('ticketId');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);

  const fetchTickets = async (page, limit = perPage, status = statusFilter, sort = sortField, direction = sortDirection) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found');
        setLoading(false);
        return;
      }
      const statusParam = status === 'all' ? '' : status.toLowerCase();
      const effectiveLimit = limit === totalRows && totalRows > 0 ? totalRows : limit;
      const url = `https://api.postlii.com/api/support/tickets?page=${page}&limit=${effectiveLimit}${statusParam ? `&status=${statusParam}` : ''}&sort=${sort}&direction=${direction}`;
      console.log('Fetching tickets with URL:', url);
      console.log('Current perPage:', limit, 'Total rows:', totalRows);
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('API Response:', response.data);
      if (response.data.success) {
        let fetchedTickets = response.data.tickets || [];
        // Client-side fallback filtering for status
        if (statusParam) {
          fetchedTickets = fetchedTickets.filter(ticket => 
            ticket.status && ticket.status.toLowerCase() === statusParam
          );
        }
        // Client-side pagination fallback if API returns more tickets than limit
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedTickets = limit === totalRows ? fetchedTickets : fetchedTickets.slice(0, limit);
        setTickets(fetchedTickets);
        setFilteredTickets(paginatedTickets);
        setTotalRows(response.data.total || fetchedTickets.length);
        setCurrentPage(page);
        if (fetchedTickets.length === 0 && statusParam) {
          toast.info(`No tickets found with status "${status}"`);
        }
      } else {
        toast.error('Failed to fetch tickets: ' + (response.data.message || 'Unknown error'));
        setTickets([]);
        setFilteredTickets([]);
        setTotalRows(0);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Error fetching tickets: ' + (error.response?.data?.message || error.message));
      setTickets([]);
      setFilteredTickets([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  };

  const applySearchFilter = (ticketsData, search) => {
    const filtered = ticketsData.filter(ticket => {
      const text = search.toLowerCase().trim();
      return (
        (ticket.ticketId && ticket.ticketId.toString().toLowerCase().includes(text)) ||
        (ticket.email && ticket.email.toLowerCase().includes(text)) ||
        (ticket.subject && ticket.subject.toLowerCase().includes(text)) ||
        (ticket.query && ticket.query.toLowerCase().includes(text))
      );
    });
    console.log('Filtered tickets (search):', filtered);
    setFilteredTickets(filtered);
  };

  useEffect(() => {
    fetchTickets(1);
  }, [statusFilter, perPage, sortField, sortDirection]);

  useEffect(() => {
    applySearchFilter(tickets, searchText);
  }, [searchText, tickets]);

  const handleStatusUpdate = (ticketId, newStatus) => {
    if (!newStatus) return;
    toast.info(
      <ConfirmStatusToast
        ticketId={ticketId}
        newStatus={newStatus}
        onConfirm={async () => {
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              toast.error('No authentication token found');
              return;
            }
            const response = await axios.put(`https://api.postlii.com/api/support/ticket/${ticketId}/status`, {
              status: newStatus.toLowerCase(),
            }, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.success) {
              toast.success(`Ticket ${ticketId} status updated to ${newStatus}`);
              const updatedTickets = tickets.map(ticket =>
                ticket.ticketId === ticketId ? { ...ticket, status: newStatus.toLowerCase() } : ticket
              );
              setTickets(updatedTickets);
              applySearchFilter(updatedTickets, searchText);
            } else {
              toast.error('Failed to update ticket status: ' + (response.data.message || 'Unknown error'));
            }
          } catch (error) {
            console.error('Error updating ticket status:', error);
            toast.error('Error updating status: ' + (error.response?.data?.message || error.message));
          }
        }}
        onCancel={() => toast.info('Status update cancelled')}
      />,
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        icon: false,
        style: { background: 'transparent', boxShadow: 'none' },
      }
    );
  };

  const handleBulkStatusUpdate = (newStatus) => {
    if (selectedRows.length === 0 || !newStatus) return;
    toast.info(
      <ConfirmBulkStatusToast
        newStatus={newStatus}
        selectedCount={selectedRows.length}
        onConfirm={async () => {
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              toast.error('No authentication token found');
              return;
            }
            const updatePromises = selectedRows.map(ticket =>
              axios.put(`https://api.postlii.com/api/support/ticket/${ticket.ticketId}/status`, {
                status: newStatus.toLowerCase(),
              }, {
                headers: { Authorization: `Bearer ${token}` },
              })
            );
            await Promise.all(updatePromises);
            const updatedTickets = tickets.map(ticket =>
              selectedRows.find(row => row.ticketId === ticket.ticketId)
                ? { ...ticket, status: newStatus.toLowerCase() }
                : ticket
            );
            setTickets(updatedTickets);
            applySearchFilter(updatedTickets, searchText);
            toast.success(`Updated ${selectedRows.length} tickets to ${newStatus}`);
            setSelectedRows([]);
            setToggleCleared(!toggleCleared);
          } catch (error) {
            console.error('Error updating bulk ticket status:', error);
            toast.error('Bulk status update failed: ' + (error.response?.data?.message || error.message));
          }
        }}
        onCancel={() => toast.info('Bulk status update cancelled')}
      />,
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        icon: false,
        style: { background: 'transparent', boxShadow: 'none' },
      }
    );
  };

  const handlePageChange = (page) => {
    console.log('Handling page change to:', page);
    setCurrentPage(page);
    fetchTickets(page, perPage, statusFilter, sortField, sortDirection);
  };

  const handlePerPageChange = (newPerPage, page) => {
    console.log('Handling rows per page change to:', newPerPage);
    setPerPage(newPerPage);
    setCurrentPage(page);
    fetchTickets(page, newPerPage, statusFilter, sortField, sortDirection);
  };

  const handleStatusFilterChange = (e) => {
    const newStatus = e.target.value;
    console.log('Status filter changed to:', newStatus);
    setStatusFilter(newStatus);
    setCurrentPage(1);
    fetchTickets(1, perPage, newStatus, sortField, sortDirection);
  };

  const handleSort = (column, direction) => {
    const field = typeof column.selector === 'function' ? column.selector.toString().match(/row\.(\w+)/)?.[1] || 'ticketId' : column.selector;
    console.log('Sorting by:', field, direction);
    setSortField(field);
    setSortDirection(direction);
    fetchTickets(1, perPage, statusFilter, field, direction);
  };

  const columns = [
    { name: 'Ticket ID', selector: row => row.ticketId || '', sortable: true },
    { name: 'Email', selector: row => row.email || '', sortable: true },
    { name: 'Subject', selector: row => row.subject || '', sortable: true },
    {
      name: 'Query',
      selector: row => row.query || '',
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
          {row.query || 'No Query'}
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
      selector: row => row.status || '',
      sortable: true,
      cell: row => (
        <div
          className="status-badge"
          style={{
            backgroundColor:
              row.status && row.status.toLowerCase() === 'open' ? '#ffc107' :
              row.status && row.status.toLowerCase() === 'in-progress' ? '#007bff' :
              row.status && row.status.toLowerCase() === 'resolved' ? '#17a2b8' :
              row.status && row.status.toLowerCase() === 'closed' ? '#28a745' : '#6c757d',
            color: '#fff',
            padding: '5px 10px',
            borderRadius: '4px',
            fontWeight: 'bold',
            textTransform: 'capitalize',
          }}
        >
          {row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : 'Unknown'}
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
          {row.status && row.status.toLowerCase() === 'open' && (
            <>
              <option value="in-progress">Start Progress</option>
              <option value="resolved">Mark as Resolved</option>
              <option value="closed">Close Ticket</option>
            </>
          )}
          {row.status && row.status.toLowerCase() === 'in-progress' && (
            <>
              <option value="resolved">Mark as Resolved</option>
              <option value="closed">Close Ticket</option>
            </>
          )}
          {row.status && row.status.toLowerCase() === 'resolved' && (
            <option value="closed">Close Ticket</option>
          )}
          {row.status && row.status.toLowerCase() === 'closed' && (
            <option value="open">Reopen Ticket</option>
          )}
        </select>
      ),
    },
  ];

  const customStyles = {
    table: {
      style: {
        minWidth: '100%',
        width: '100%',
      },
    },
    headCells: {
      style: {
        background: 'linear-gradient(180deg, #4B4F7A, #1E1E2F)',
        fontWeight: 'bold',
        fontSize: '15px',
        color: '#e7dfdfff',
        padding: '12px 8px',
      },
    },
    cells: {
      style: {
        fontSize: '16px',
        padding: '12px 8px',
      },
    },
    rows: {
      style: {
        minHeight: '48px',
      },
    },
  };

  return (
    <div className="user-table" style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1E1E2F, #4B4F7A)',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif',
    }}>
      <ToastContainer position="top-right" autoClose={4000} />
      <h2 style={{
        color: '#edeff1ff',
        paddingBottom: '20px',
        fontSize: '28px',
        fontWeight: '700',
        textShadow: '0 1px 2px rgba(0,0,0,0.1)',
      }}>
        🎫 Support Tickets
      </h2>

      <div className="add-member-container d-flex justify-content-between align-items-center mb-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div className="search-container position-relative">
            <i className="fa fa-search search-icon" style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#999',
              fontSize: '16px',
            }} />
            <input
              type="text"
              placeholder="Search by ticket ID, email, subject..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="form-control search-input ps-5"
              style={{
                padding: '10px 12px 10px 40px',
                borderRadius: '8px',
                border: '2px solid #4c4e52ff',
                outline: 'none',
                width: '300px',
                fontSize: '15px',
                color: '#333'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <label htmlFor="statusFilter" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#edeff1ff'
            }}>
              Filter by Status:
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              style={{
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #4c4e52ff',
                backgroundColor: '#f5f5f5',
                color: '#333',
                cursor: 'pointer',
                width: '150px'
              }}
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="in-progress">In-Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          {selectedRows.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <label style={{ color: '#edeff1ff', fontSize: '14px', fontWeight: '500' }}>
                Update Selected ({selectedRows.length}):
              </label>
              <select
                value=""
                onChange={e => handleBulkStatusUpdate(e.target.value)}
                style={{
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #4c4e52ff',
                  backgroundColor: '#f5f5f5',
                  color: '#333',
                  cursor: 'pointer',
                  width: '150px'
                }}
              >
                <option value="" disabled>Select Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In-Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          )}
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
          data={filteredTickets}
          selectableRows
          selectableRowsHighlight
          clearSelectedRows={toggleCleared}
          onSelectedRowsChange={(state) => setSelectedRows(state.selectedRows)}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationDefaultPage={currentPage}
          onChangePage={handlePageChange}
          paginationPerPage={perPage}
          onChangeRowsPerPage={handlePerPageChange}
          paginationRowsPerPageOptions={[25, 50, 75, 100, 'All']}
          paginationComponentOptions={{ rowsPerPageText: 'Rows per page:' }}
          paginationComponent={CustomPagination}
          highlightOnHover
          responsive
          persistTableHead
          customStyles={customStyles}
          sortServer
          onSort={handleSort}
          defaultSortFieldId="ticketId"
          defaultSortAsc={sortDirection === 'asc'}
          noDataComponent={
            <div className="p-4 text-center">
              <p style={{ color: '#333', fontSize: '16px' }}>
                {statusFilter === 'all' ? 'No tickets found' : `No ${statusFilter} tickets found`}
              </p>
            </div>
          }
        />
      )}
    </div>
  );
};

export default Tickets;