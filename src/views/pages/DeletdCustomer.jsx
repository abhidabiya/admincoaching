import * as React from 'react';
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
import { useNavigate } from 'react-router-dom';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import DeleteIcon from '@mui/icons-material/Delete';
import Img from 'assets/images/image.jpg';
import './main.css';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import { IconSearch } from '@tabler/icons-react';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from 'config/constant';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { encode as base64_encode } from 'base-64';
import axios from 'axios';
import { Modal } from 'react-bootstrap';

const columns = [
    { id: 'number', label: 'S.No.', minWidth: 70, align: 'center' },
    { id: 'Action', label: 'Action', minWidth: 100, align: 'center' },
    { id: 'f_name', label: 'Name', minWidth: 130, align: 'center' },
    // { id: 'l_name', label: 'Last Name', minWidth: 130, align: 'center' },
    { id: 'image', label: 'Image', minWidth: 100, align: 'center' },
    { id: 'email', label: 'Email', minWidth: 170, align: 'center' },
    { id: 'mobile', label: 'Mobile No.', minWidth: 170, align: 'center' },
    // { id: 'user_type', label: 'User Type', minWidth: 170, align: 'center' },
    { id: 'reason', label: 'Reason', minWidth: 170, align: 'center' },
    // { id: 'delete reason', label: 'Delete Reason', minWidth: 170, align: 'center' },
    { id: 'date_time', label: 'Delete Date & Time', minWidth: 180, align: 'center' }
];

const DeletedCustomer = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);
    const navigate = useNavigate();
    const theme = useTheme();
    const [user_data, setUserAllData] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(null);

    const [showModal, setShowModal] = React.useState(false);
    const [users, setShowUserData] = React.useState(null);

    // const [showModal, setShowModal] = useState(false);
    const [showMsgModal, setShowMsgModal] = React.useState(false);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedIndex(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setShowMsgModal(false);
        setShowUserData(null);
    };

    // const handleChangeRowsPerPage = (event) => {
    //   setRowsPerPage(+event.target.value);
    //   setPage(0);
    // };

    const handleView = (index, action, user_id) => {
        // let encode_user_id = base64_encode(user_id.toString());
        // navigate(APP_PREFIX_PATH + `/view-user/${encode_user_id}`);

         let encode_user_id = base64_encode(user_id.toString());
         navigate(APP_PREFIX_PATH + `/view-user/${encode_user_id}`);

        handleClose();
    };

    const filteredUsers = user_data.filter((user) => {
        const lowercasedTerm = searchQuery.toLowerCase();
        const emailMatch = user.email?.toLowerCase().includes(lowercasedTerm);
        
        const f_nameMatch = user.name?.toLowerCase().includes(lowercasedTerm);
        const UserTypeMatch = user.user_type_lable_filter?.toLowerCase().includes(lowercasedTerm);
        const activeMatch = user.active_flag_lable?.toLowerCase().includes(lowercasedTerm);
        const l_nameMatch = user.l_name?.toLowerCase().includes(lowercasedTerm);
        const mobileMatch = user.mobile ? String(user.mobile).toLowerCase().includes(lowercasedTerm) : false;
        const dateMatch = user.createtime ? String(user.createtime).toLowerCase().includes(lowercasedTerm) : false;
        const statusMatch =
            lowercasedTerm === 'active' ? user.active_flag === 1 : lowercasedTerm === 'deactive' ? user.active_flag === 0 : false;

        return mobileMatch || emailMatch || dateMatch || statusMatch || l_nameMatch || f_nameMatch || activeMatch || UserTypeMatch;
    });

    React.useEffect(() => {
        axios
            .get(`${API_URL}get_deleted_all_user_data`)
            .then((response) => {
                setUserAllData(response.data.user_arr);
            })
            .catch((error) => {
                console.error('Error fetching user count details:', error);
            });
    }, []);

    const handleClick = (event, index) => {
        setAnchorEl(event.currentTarget);
        setSelectedIndex(index);
    };

    const handleAction = (index, action, user) => {
        // console.log('user : ', user);

        setAnchorEl(null);
        setSelectedIndex(null);

        if (action === 'reason') {
            setShowUserData(user);
            setShowModal(true);
        }
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
                        // fontWeight: ' 500',
                        marginBottom: ' 5px'
                    }}
                >
                    Manage Deleted Users
                </p>
            </div>
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
            {filteredUsers.length > 0 ? (
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
                                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                        <TableCell style={{ textAlign: 'center' }}>{row.s_no}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <Button
                                                className="btn btn-primary"
                                                aria-label="more"
                                                aria-controls="long-menu"
                                                aria-haspopup="true"
                                                onClick={(event) => handleClick(event, index)}
                                                style={{ width: '120px' }}
                                            >
                                                Action <ArrowDropDown />
                                            </Button>
                                            <Menu
                                                id="long-menu"
                                                anchorEl={anchorEl}
                                                keepMounted
                                                open={selectedIndex === index}
                                                onClose={handleClose}
                                            >
                                                <MenuItem onClick={() => handleView(index, 'view', row.user_id)} className="menu-icons">
                                                    <VisibilityIcon style={{ marginRight: '8px' }} />
                                                    View
                                                </MenuItem>
                                                {/* <MenuItem onClick={() => handleAction(index, 'reason', row)} className="menu-icons">
                                                    <DeleteForeverIcon style={{ marginRight: '8px' }} />
                                                    Delete Reason
                                                </MenuItem> */}
                                            </Menu>
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>{row.name ? row.name : 'NA'}</TableCell>
                                        {/* <TableCell style={{ textAlign: 'center' }}>{row.l_name ? row.l_name : 'NA'}</TableCell> */}
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <img
                                                alt={row.username}
                                                src={row.image ? `${IMAGE_PATH}${row.image}` : `${IMAGE_PATH}placeholder.png`}
                                                style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>{row.email ? row.email : 'NA'}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>{row.mobile ? row.mobile : 'NA'}</TableCell>
                                        {/* <TableCell style={{ textAlign: 'center' }}>{row.user_type_lable_filter ? row.user_type_lable_filter : 'NA'}</TableCell> */}
                                        <TableCell style={{ textAlign: 'center' }}>
                                           
                                            
                                                {row.delete_reason ? row.delete_reason : "NA"}
                                            
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>{row.createtime ? row.createtime : 'NA'}</TableCell>
                                    </TableRow>
                                ))}
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
                                style={{ marginRight: '8px', borderRadius: '4px', background: 'whitesmoke' }}
                            >
                                {'<'}
                            </button>
                            <button
                                onClick={() => handleChangePage(null, page + 1)}
                                disabled={(page + 1) * rowsPerPage >= filteredUsers.length}
                                style={{ borderRadius: '4px', marginRight: '10px', background: 'whitesmoke' }}
                            >
                                {'>'}
                            </button>
                        </div>
                    </div>
                    {/* View Messages Modal */}
                    <Modal show={showModal} onHide={handleCloseModal} style={{ zIndex: '99999' }}>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '17px' }}>Messages from {users?.f_name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Account Delete Reason : {users ? users.delete_reason : 'No Reason'}</p>
                        </Modal.Body>
                        <Modal.Footer>
                            {/* <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button> */}
                        </Modal.Footer>
                    </Modal>
                </Paper>
            ) : (
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
                                        No Data Available
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
        </>
    );
};

export default DeletedCustomer;
