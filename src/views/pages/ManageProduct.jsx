import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { ArrowDropDown } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import './main.css';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import { IconSearch } from '@tabler/icons-react';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import { API_URL, APP_PREFIX_PATH } from 'config/constant';
import axios from 'axios';
import { encode as base64_encode } from 'base-64';
const columns = [
  { id: 'number', label: 'S.No.', minWidth: 70, align: 'center' },
  { id: 'Action', label: 'Action', minWidth: 100, align: 'center' },
  { id: 'title', label: 'Title', minWidth: 170, align: 'center' },
  { id: 'category name', label: 'Category Name', minWidth: 100, align: 'center' },
  // { id: 'qty', label: 'Quantity', minWidth: 170, align: 'center' },
  { id: 'Status', label: 'Status', minWidth: 170, align: 'center' },
  { id: 'date_time', label: 'Create Date & Time', minWidth: 170, align: 'center' }
];

const createData = (number, product_name, price, qty, desc, date_time) => {
  return { number, product_name, price, qty, desc, date_time };
};

const ManageProduct = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const theme = useTheme();
  const navigate = useNavigate();

  // State for handling menu open/close and anchor element for menu positioning
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(null);

  const [product_data_arr, setProductAllData] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedIndex(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleView = (product_id) => {
    let encode_product_id = base64_encode(product_id.toString());
    navigate(APP_PREFIX_PATH + `/view-product/${encode_product_id}`);
    handleClose();
  };

  React.useEffect(() => {
    axios
      .get(`${API_URL}get_all_product_data`)
      .then((response) => {
        setProductAllData(response.data.product_arr);
        console.log('response.data.user_arr : ', response.data.product_arr);
      })
      .catch((error) => {
        console.error('Error fetching user count details:', error);
      });
  }, []);

  const filteredUsers = product_data_arr.filter((user) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    const category_nameMatch = user.category_name?.toLowerCase().includes(lowercasedTerm);
    const titleMatch = user.title?.toLowerCase().includes(lowercasedTerm);
    const dateMatch = user.createtime ? String(user.createtime).toLowerCase().includes(lowercasedTerm) : false;
    const statusMatch =
      lowercasedTerm === 'Pending' ? user.complete === 1 : lowercasedTerm === 'Completed' ? user.active_flag === 0 : false;

    return category_nameMatch || titleMatch || dateMatch || statusMatch;
  });

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
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
                filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell style={{ textAlign: 'center' }}>{row.s_no}</TableCell>

                    <TableCell style={{ textAlign: 'center' }}>
                      <Button className="btn btn-primary action-btn" onClick={() => handleView(row.product_id)}>
                        <VisibilityIcon style={{ marginRight: '8px' }} /> View
                      </Button>
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <Link
                        style={{ textAlign: 'center', textDecoration: 'none', color: '#364152', fontFamily: "'Poppins', sans-serif'" }}
                        to={APP_PREFIX_PATH + `view-product/${row.product_id}`}
                      >
                        {row.title}
                      </Link>
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{row.category_name}</TableCell>
                    {/* <TableCell style={{ textAlign: 'center' }}>{row.complete === 1 ? 'Completed' : 'Pending'}</TableCell> */}
                    <TableCell style={{ textAlign: 'center' }}>
                      <p
                        className="active-btn"
                        style={{
                          backgroundColor: row.complete === 1 ? '#009640' : '#FFC561',
                          color: 'white',
                          width: '95px',
                          padding: '5px 5px',
                          borderRadius: '8px',
                          display: 'inline-block',
                          textTransform: 'capitalize'
                        }}
                      >
                        {row.complete === 1 ? 'Completed' : 'Pending'}
                      </p>
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{row.createtime}</TableCell>
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
        <TablePagination
          labelRowsPerPage="Showing 1 to 20 of 5 entries:"
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) => `${from} - ${to} of ${count}`}
          rowsPerPageOptions={[5, 10, 25, 100]}
        />
      </Paper>
    </>
  );
};

export default ManageProduct;
