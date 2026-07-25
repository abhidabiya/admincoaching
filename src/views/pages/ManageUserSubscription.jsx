import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import './main.css';
import OutlinedInput from '@mui/material/OutlinedInput';
import { IconSearch } from '@tabler/icons-react';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import Box from '@mui/material/Box';
import axios from 'axios';
import { API_URL, APP_PREFIX_PATH } from 'config/constant';
import { encode as base64_encode } from 'base-64';
import { useNavigate } from 'react-router-dom';

const columns = [
  { id: 'number', label: 'S.No.', minWidth: 70, align: 'center' },
  { id: 'action', label: 'Action', minWidth: 130, align: 'center' },
  { id: 'Username', label: 'User Name', minWidth: 130, align: 'center' },
  { id: 'Amount', label: 'Amount (In Dollar)', minWidth: 165, align: 'center' },
  { id: 'Subscription Type', label: 'Subscription Type', minWidth: 200, align: 'center' },
  { id: 'transaction_id', label: 'Transaction Id', minWidth: 200, align: 'center' },
  { id: 'Start Date', label: 'Start Date', minWidth: 140, align: 'center' },
  { id: 'End Date', label: 'End Date', minWidth: 140, align: 'center' },
  { id: 'Status', label: 'Status', minWidth: 170, align: 'center' }
];

const ManageUserSubscription = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const theme = useTheme();
  const [subscription_data, setAllSubscriptionData] = React.useState([]);
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [question, setQuestion] = React.useState('');
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  var navigate = useNavigate();
  var fetchData = () => {
    axios
      .get(`${API_URL}get_user_subscription`)
      .then((response) => {
        setAllSubscriptionData(response.data.result);
      })
      .catch((error) => {
        console.error('Error fetching data :', error);
      });
  };
  React.useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAction = (action, user_id) => {
    let encode_user_id = base64_encode(user_id.toString());
    if (action == 'View') {
      navigate(APP_PREFIX_PATH + `/view-user/${encode_user_id}`);
    }
  };

  const filteredUsers = subscription_data.filter((user) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    const status_lableMatch = user.status_lable?.toLowerCase().includes(lowercasedTerm);
    const nameMatch = user.name?.toLowerCase().includes(lowercasedTerm);
    const subscription_type_lableMatch = user.subscription_type_lable?.toLowerCase().includes(lowercasedTerm);
    const snoMatch = user.amount ? String(user.amount).toLowerCase().includes(lowercasedTerm) : false;
    const transactionIdMatch = user.transaction_id ? String(user.transaction_id).toLowerCase().includes(lowercasedTerm) : false;
    const enddateMatch = user.end_date ? String(user.end_date).toLowerCase().includes(lowercasedTerm) : false;
    const replydateMatch = user.start_date ? String(user.start_date).toLowerCase().includes(lowercasedTerm) : false;
    return snoMatch || replydateMatch || enddateMatch || status_lableMatch || subscription_type_lableMatch || nameMatch || transactionIdMatch;
  });

  const handleCloseModal = () => {
    setShowMsgModal(false);
    setQuestion('');
  };

  return (
    <>
    <div className="col-xl-12" style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '10px', marginBottom: '20px' }}>
        <p
          style={{
            // margin: '2px',
            fontSize: '1.25rem',
            color: '#121926',
            fontWeight: '600',
            fontFamily: 'Poppins',
            lineHeight: '1.167',
            fontWeight: ' 500',
            marginBottom:" 5px",
          }}
        >
          Manage Earnings
        </p>
      </div>
      <Box alignItems="center" justifyContent="space-between" display="flex" className="mobile-res">
        <OutlinedInput
          sx={{ pr: 1, pl: 2, my: 2 }}
          id="input-search-profile"
          onChange={handleSearch}
          placeholder="Search"
          startAdornment={
            <InputAdornment position="start">
              <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
            </InputAdornment>
          }
          aria-describedby="search-helper-text"
          inputProps={{
            'aria-label': 'weight'
          }}
        />
      </Box>
      <Paper sx={{ width: '100%', marginTop: '20px' }}>
        {/* <SearchSection /> */}
        <TableContainer sx={{ maxHeight: 640 }}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell style={{ textAlign: 'center' }}>{row.s_no}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <Button className="btn btn-primary" onClick={(event) => handleAction('View', row.user_id)} style={{ width: '120px' }}>
                        View
                      </Button>
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{row.name} </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{row.amount} $</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{row.subscription_type_lable}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{row.transaction_id}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{row.start_date}</TableCell>

                    <TableCell style={{ textAlign: 'center' }}>{row.end_date}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <p
                        style={{
                          borderRadius: '25px',
                          backgroundColor: row.status == 1 ? '#009640' : row.status == 2 ? '#FFA500' : '#FF2222',
                          padding: '0px 15px',
                          width: '100px',
                          color: '#fff',
                          margin: 'auto'
                        }}
                      >
                        {row.status_lable}
                      </p>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} style={{ textAlign: 'center', padding: '20px' }}>
                    No Data Available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p
            style={{ marginLeft: '26px', marginTop: '15px' }}
          >{`Showing ${Math.min(filteredUsers.length > 0 ? page * rowsPerPage + 1 : 0, filteredUsers.length)} to ${Math.min((page + 1) * rowsPerPage, filteredUsers.length)} of ${filteredUsers.length} entries`}</p>
          <div>
            <button onClick={() => handleChangePage(null, page - 1)} disabled={page === 0} style={{borderRadius:'4px',marginRight: '10px' ,background:"whitesmoke"}}>
              {'<'}
            </button>
            <button onClick={() => handleChangePage(null, page + 1)} disabled={(page + 1) * rowsPerPage >= filteredUsers.length} style={{ marginRight: '8px', borderRadius:'4px',background:"whitesmoke" }}>
              {'>'}
            </button>
          </div>
        </div>

        <Modal show={showMsgModal} onHide={handleCloseModal} style={{ zIndex: '99999' }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>View Question</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <>
              <p>{question != null ? question : 'NA'}</p>
            </>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </Paper>
    </>
  );
};

export default ManageUserSubscription;
