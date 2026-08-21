import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import './main.css';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import { IconSearch } from '@tabler/icons-react';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import MainCard from 'ui-component/cards/MainCard';
import { Row, Col, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from 'config/constant';

import { encode as base64_encode } from 'base-64';
const columns = [
  { id: 'number', label: 'S.No.', minWidth: 70, align: 'center' },
  { id: 'action', label: 'Action', minWidth: 130, align: 'center' },
  { id: 'Username', label: 'Student Name', minWidth: 130, align: 'center' },
  { id: 'Amount', label: 'Amount (In Dollar)', minWidth: 165, align: 'center' },
  { id: 'Subscription Type', label: 'Subscription Type', minWidth: 200, align: 'center' },
  { id: 'transaction_id', label: 'Transaction Id', minWidth: 200, align: 'center' },
  { id: 'Start Date', label: 'Start Date', minWidth: 140, align: 'center' },
  { id: 'End Date', label: 'End Date', minWidth: 140, align: 'center' },
  { id: 'Status', label: 'Status', minWidth: 170, align: 'center' }
];

const SubscriptionReportedList = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const theme = useTheme();
  const navigate = useNavigate();

  const [subscription_data, setUserData] = React.useState([]);
  const [from_date, setFromDate] = React.useState('');
  const [to_date, setTodate] = React.useState('');
  const [from_date_error, setFromDateError] = React.useState('');
  const [to_date_error, setToDateError] = React.useState('');
  const [msg, setMessage] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleView = (action, user_id) => {
    // let encode_user_id = base64_encode(user_id.toString());
    // navigate(APP_PREFIX_PATH + `/view-customer/${encode_user_id}`);
    let encode_user_id = base64_encode(user_id.toString());
    if (action == 'View') {
      navigate(APP_PREFIX_PATH + `/view-user/${encode_user_id}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;

    if (!from_date) {
      setFromDateError('Please Enter From Date.');
      hasError = true;
    } else {
      setFromDateError('');
    }

    if (!to_date) {
      setToDateError('Please Enter To Date');
      hasError = true;
    } else if (to_date < from_date) {
      setToDateError('To Date Must Be Greter Than from date');
    } else {
      setToDateError('');
    }

    if (hasError) {
      return;
    }

    axios
      .get(`${API_URL}get_tabular_subscription?from_date=${from_date}&to_date=${to_date}`)
      .then((response) => {
        if (response.data.success) {
          setUserData(response.data.subscription_arr);
          setMessage('No Data Found');
        } else {
          setMessage('No Data Found');
        }
      })
      .catch((error) => {
        console.error('Error fetching user count details:', error);
      });
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
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
    return (
      snoMatch || replydateMatch || enddateMatch || status_lableMatch || subscription_type_lableMatch || nameMatch || transactionIdMatch
    );
  });
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      subscription_data.map((user, index) => ({
        'S. No.': index + 1,

        'User Name': user.name,
        Amount: user.amount,
        'Transaction Id': user.transaction_id,
        'End Date': user.end_date,
        'Start Date': user.start_date,
        Status: user.status_lable,
        'Create Date & Time': user.createtime
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SubscriptionReport');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'SubscriptionReport.xlsx');
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
            marginBottom: ' 5px'
          }}
        >
          Manage Subscripotion Tabular Reports
        </p>
      </div>
      <MainCard title="Subscription Report" className="mb-3">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={5}>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>From Date</Form.Label>
                <Form.Control
                  type="date"
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setFromDateError('');
                    setToDateError('');
                  }}
                />
              </Form.Group>
              <p style={{ color: 'red' }}>{from_date_error}</p>
            </Col>

            <Col md={5}>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>To Date</Form.Label>
                <Form.Control
                  type="date"
                  onChange={(e) => {
                    if (!from_date) {
                      setToDateError('Please Select From Date first');
                    } else {
                      setToDateError('');
                      setTodate(e.target.value);
                    }
                  }}
                  min={from_date ? from_date : ''}
                />
              </Form.Group>
              <p style={{ color: 'red' }}>{to_date_error}</p>
            </Col>

            <Col md={2}>
              <Button className="btn btn-primary" type="submit" style={{ marginTop: '27px' }}>
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </MainCard>

      {subscription_data.length > 0 || msg == 'No Data Found' ? (
        <>
          {subscription_data.length > 0 ? (
            <>
              <div className="d-flex justify-content-between flex-wrap">
                <div>
                  <Box alignItems="center" justifyContent="space-start" display="flex" className="mobile-res">
                    <OutlinedInput
                      sx={{ pr: 1, pl: 2, my: 2 }}
                      id="input-search-profile"
                      placeholder="Search"
                      onChange={handleSearch}
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
                </div>
                <div>
                  <Button
                    variant="success"
                    onClick={exportToExcel}
                    className="mb-3"
                    style={{ backgroundColor: '#19253D', border: 'none', marginTop: '22px', marginBottom: '5px', color: '#f2f2f2' }}
                  >
                    Export to Excel
                  </Button>
                </div>
              </div>

              <Paper sx={{ width: '100%' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
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
                        <>
                          {' '}
                          {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                            <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                              <TableCell style={{ textAlign: 'center' }}>{row.s_no}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <Button
                                  className="btn btn-primary"
                                  onClick={(event) => handleView('View', row.user_id)}
                                  style={{ width: '120px' }}
                                >
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
                          ))}
                        </>
                      ) : (
                        <>
                          {' '}
                          <TableRow>
                            <TableCell colSpan={columns.length} style={{ textAlign: 'center', padding: '20px' }}>
                              {msg || 'No Data Available'}
                            </TableCell>
                          </TableRow>
                        </>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p
                    style={{ marginLeft: '26px', marginTop: '15px' }}
                  >{`Showing ${Math.min(filteredUsers.length > 0 ? page * rowsPerPage + 1 : 0, filteredUsers.length)} to ${Math.min((page + 1) * rowsPerPage, filteredUsers.length)} of ${filteredUsers.length} entries`}</p>
                  <div>
                    <button
                      onClick={() => handleChangePage(null, page - 1)}
                      disabled={page === 0}
                      style={{ borderRadius: '4px', marginRight: '10px', background: 'whitesmoke' }}
                    >
                      {'<'}
                    </button>
                    <button
                      onClick={() => handleChangePage(null, page + 1)}
                      disabled={(page + 1) * rowsPerPage >= filteredUsers.length}
                      style={{ marginRight: '8px', borderRadius: '4px', background: 'whitesmoke' }}
                    >
                      {'>'}
                    </button>
                  </div>
                </div>
              </Paper>
            </>
          ) : (
            <>
              <Box alignItems="center" justifyContent="space-start" display="flex" className="mobile-res">
                <OutlinedInput
                  sx={{ pr: 1, pl: 2, my: 2 }}
                  id="input-search-profile"
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

              <Paper sx={{ width: '100%' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
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
                      <TableRow>
                        <TableCell colSpan={columns.length} style={{ textAlign: 'center', padding: '20px' }}>
                          {msg || 'No Data Available'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </>
          )}
        </>
      ) : null}
    </>
  );
};

export default SubscriptionReportedList;
