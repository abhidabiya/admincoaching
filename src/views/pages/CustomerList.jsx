import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { ArrowDropDown } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import { IconSearch } from '@tabler/icons-react';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from 'config/constant';
import { Modal } from 'react-bootstrap';
import { encode as base64_encode } from 'base-64';

const columns = [
    { id: 'number', label: 'S.No.', minWidth: 70, align: 'center' },
    { id: 'Action', label: 'Action', minWidth: 100, align: 'center' },
    { id: 'f_name', label: 'Name', minWidth: 130, align: 'center' },
    { id: 'image', label: 'Image', minWidth: 100, align: 'center' },
    { id: 'email', label: 'Email', minWidth: 170, align: 'center' },
    { id: 'user_type', label: 'Students Type', minWidth: 170, align: 'center' },
    { id: 'mobile', label: 'Mobile No.', minWidth: 170, align: 'center' },
    { id: 'status1', label: 'Parkom Status', minWidth: 170, align: 'center' },
    { id: 'status2', label: 'Gatepass Status', minWidth: 170, align: 'center' },
    { id: 'date_time', label: 'Create Date & Time', minWidth: 200, align: 'center' }
];

const CustomerList = () => {
    const [parkomStatus, setParkomStatus] = useState(null); // Stores Parkom value (1 or 0)
    const [gatepassStatus, setGatepassStatus] = useState(null); // Stores Gatepass value (1 or 0)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage] = React.useState(50);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const [user_data, setUserAllData] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [showActiveModal, setShowActiveModal] = React.useState(false);
    const [activemodalUserid, setactivemodalUserid] = React.useState({});
    const [msg, setmsg] = React.useState('');
    const theme = useTheme();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("All Students"); // Default value
    const dropdownRef = useRef(null);

    const handleToggle = () => {
        setOpen(!open);
    };

    const handleSelect = (option, fetchFunction) => {
        setSelectedOption(option); // Update button text
        setOpen(false); // Close dropdown
        fetchFunction(); // Call respective function
    };

const fetchUserData=()=>{
        axios
            .get(`${API_URL}get_all_user_data`)
            .then((response) => {
                setUserAllData(response.data.user_arr);
                setSelectedOption("All Students");

            })
            .catch((error) => {
                console.error('Error fetching user count details:', error);
            });
        }

    React.useEffect(()=>{
        fetchUserData();
        
        
    },[])

    const FetchAllUser = () => {
        axios
            .get(`${API_URL}get_all_user_data`)
            .then((response) => {
                setUserAllData(response.data.user_arr);
                console.log("response", response.data.user_arr);
                
            })
            .catch((error) => {
                console.error('Error fetching user count details:', error);
            });
    };

    const FetchParkomUser = () => {
        axios
            .get(`${API_URL}get_all_parkom_user_data`)
            .then((response) => {
                setUserAllData(response.data.user_arr);
            })
            .catch((error) => {
                console.error('Error fetching user count details:', error);
            });
    };

    const FetchGatePassUser = () => {
        axios
            .get(`${API_URL}get_all_gatepass_user_data`)
            .then((response) => {
                setUserAllData(response.data.user_arr);
            })
            .catch((error) => {
                console.error('Error fetching user count details:', error);
            });
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

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

    const handleAction = (action, user_id, active_flag, user_side, parkom_active_flag, gatepass_active_flag) => {
      
        console.log("Status Abhi:- ",user_side, active_flag, parkom_active_flag, gatepass_active_flag);
        
        if (action === 'View') {
            let encode_user_id = base64_encode(user_id.toString());
            navigate(APP_PREFIX_PATH + `/view-user/${encode_user_id}`);


        } else if (action === 'Activate/Deactivate') {

            // console.log("Status Abhi:- ", parkom_active_flag, gatepass_active_flag);

            // if(parkom_active_flag){
            //     setmsg(parkom_active_flag === 1 ? 0 : 1);
            // }
            // if(gatepass_active_flag){
            //     setmsg(gatepass_active_flag === 1 ? 0 : 1 );
            // }
            
            setShowActiveModal(true);
            // setmsg(active_flag);
            setactivemodalUserid({ user_id, status: active_flag, user_side, parkom_active_flag, gatepass_active_flag });
            // console.log('check Abhi', msg, active_flag);
            // console.log("Status Abhi:- ", parkom_active_flag, gatepass_active_flag);

    // 
            if (user_side === 1) {
                setmsg(parkom_active_flag == 0 ? 1 : 0);
                setParkomStatus(parkom_active_flag == 0 ? 1 : 0); 
            } else if (user_side === 2) {
                setmsg(gatepass_active_flag == 0 ? 1 : 0);
                setGatepassStatus(gatepass_active_flag == 0 ? 1 : 0);
            } else if (user_side === 3) {
             
                setParkomStatus(parkom_active_flag);
                setGatepassStatus(gatepass_active_flag);
            }
           
        }
        handleClose();
      
    };
    

    console.log("user_data : ",user_data);
    
    const handleActivateDeactivate = () => {
        if (activemodalUserid) {
            const { user_id, user_side } = activemodalUserid;
    
            const newParkomStatus = user_side === 1 || user_side === 3 ? parkomStatus : null;
            const newGatepassStatus = user_side === 2 || user_side === 3 ? gatepassStatus : null;
    // console.log('chkd', newParkomStatus , newGatepassStatus);
    
            axios
                .post(`${API_URL}ActivateDeactivateUser`, {
                    user_id,
                    parkomStatus: newParkomStatus ,
                    gatepassStatus: newGatepassStatus ,
                })
                .then((res) => {
                    if (res.data.success) {
                        const updatedUserDetails = user_data.map((user) =>
                            user.user_id === user_id
                                ? {
                                    ...user,
                                    parkom_active_flag: user_side === 1 || user_side === 3 ? newParkomStatus : user.parkom_active_flag,
                                    gatepass_active_flag: user_side === 2 || user_side === 3 ? newGatepassStatus : user.gatepass_active_flag,
                                }
                                : user
                        );
                        fetchUserData()
                        setUserAllData(updatedUserDetails);
                        setShowActiveModal(false);
                       
                    }
                })
                .catch((error) => {
                    console.log('Error updating user status:', error);
                });
        }
    };





    const filteredUsers = user_data.filter((user) => {
        const lowercasedTerm = searchQuery.toLowerCase();
        const f_nameMatch = user.name?.toLowerCase().includes(lowercasedTerm);
        const emailMatch = user.email?.toLowerCase().includes(lowercasedTerm);
        const mobileMatch = user.mobile ? String(user.mobile).toLowerCase().includes(lowercasedTerm) : false;
        const dateMatch = user.createtime ? String(user.createtime).toLowerCase().includes(lowercasedTerm) : false;
        return mobileMatch || dateMatch || f_nameMatch || emailMatch;
    });

    return (
        <>
            <div className="col-xl-12" style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '10px', marginBottom: '20px' }}>
                <p style={{ fontSize: '1.25rem', color: '#121926', fontWeight: '600', fontFamily: 'Poppins', lineHeight: '1.167', marginBottom: '5px' }}>
                    Manage Students List
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
                />
                <div style={{ position: "relative", display: "inline-block", marginLeft: "20px" }} ref={dropdownRef}>
                    <button
                        className="btn btn-primary"
                        onClick={handleToggle}
                        style={{ padding: "10px 20px", cursor: "pointer", borderRadius: "5px", display: "flex", alignItems: "center", gap: "5px" }}
                    >
                        {selectedOption} <ArrowDropDown />
                    </button>
                    {open && (
                        <div style={{ position: "absolute", top: "45px", left: "0", background: "#fff", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", borderRadius: "10px", width: "180px", zIndex: 10 }}>
                            <ul style={{ listStyle: "none", padding: "10px", margin: 0 }}>
                                <li style={{ padding: "8px", cursor: "pointer", borderBottom: "1px solid #ddd" }} onClick={() => handleSelect("All User", FetchAllUser)}>All User</li>
                                <li style={{ padding: "8px", cursor: "pointer", borderBottom: "1px solid #ddd" }} onClick={() => handleSelect("Parkom User", FetchParkomUser)}>Parkom User</li>
                                <li style={{ padding: "8px", cursor: "pointer", borderBottom: "1px solid #ddd" }} onClick={() => handleSelect("Gatepass User", FetchGatePassUser)}>Gatepass User</li>
                            </ul>
                        </div>
                    )}
                </div>
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
                                                <MenuItem
                                                    onClick={() => handleAction('View', row.user_id, row.active_flag)}
                                                    className="menu-icons"
                                                >
                                                    <VisibilityIcon style={{ marginRight: '8px' }} />
                                                    View
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => handleAction('Activate/Deactivate', row.user_id, row.active_flag, row.user_side, row.parkom_active_flag, row.gatepass_active_flag)}
                                                    className="menu-icons"
                                                >
                                                    <ToggleOffIcon style={{ marginRight: '8px' }} />
                                                    Active/Deactive
                                                </MenuItem>
                                            </Menu>
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>{row.name}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <img
                                                alt={row.image}
                                                src={row.image && row.image != null ? `${IMAGE_PATH}${row.image}` : `${IMAGE_PATH}placeholder.png`}
                                                style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>{row.email ? row.email : 'NA'}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            {row.user_side === 1 ? "Parkom User" : row.user_side === 2 ? "Gatepass User" : row.user_side === 3 ? "Both User" : "All User"}
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>{row.mobile ? row.mobile : 'NA'}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <p
                                                className="active-btn"
                                                style={{
                                                    backgroundColor: row.user_side === 2 ? '#A0A0A0' : row.parkom_active_flag === 1 ? '#009640' : '#FF2222',
                                                    color: 'white',
                                                    padding: '5px 10px',
                                                    borderRadius: '8px',
                                                    display: 'inline-block',
                                                    textTransform: 'capitalize'
                                                }}
                                            >
                                                {row.user_side === 1 ? (row.parkom_active_flag === 1 ? 'active' : 'deactive') : row.user_side === 2 ? 'NA' : row.user_side === 3 ? (row.parkom_active_flag === 1 ? 'active' : 'deactive') : "NA"}
                                            </p>
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <p
                                                className="active-btn"
                                                style={{
                                                    backgroundColor: row.user_side === 1 ? '#A0A0A0' : row.gatepass_active_flag === 1 ? '#009640' : '#FF2222',
                                                    color: 'white',
                                                    padding: '5px 10px',
                                                    borderRadius: '8px',
                                                    display: 'inline-block',
                                                    textTransform: 'capitalize'
                                                }}
                                            >
                                                {row.user_side === 1 ? 'NA' : row.user_side === 2 ? (row.gatepass_active_flag === 1 ? 'active' : 'deactive') : row.user_side === 3 ? (row.gatepass_active_flag === 1 ? 'active' : 'deactive') : "NA"}
                                            </p>
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>{row.createtime}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ marginLeft: '26px', marginTop: '15px' }}>
                            {`Showing ${Math.min(filteredUsers.length > 0 ? page * rowsPerPage + 1 : 0, filteredUsers.length)} to ${Math.min((page + 1) * rowsPerPage, filteredUsers.length)} of ${filteredUsers.length} entries`}
                        </p>
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

<Modal show={showActiveModal} onHide={() => setShowActiveModal(false)}>
    <Modal.Header closeButton>
        <Modal.Title>Active/Deactive User</Modal.Title>
    </Modal.Header>
    <Modal.Body>

    {    
            activemodalUserid.user_side !== 3 
            ? `Are you sure you want to ${msg === 1 ? "activate" : "deactivate"} this user?` 
            : ""
    }

        
        {/* Are you sure you want to change this user's status? */}

        {/* Are you sure, you want to change the status of this user? */}

        <br /><br />
    
        {(activemodalUserid.user_side === 3) && (
            
            <label>
                For Parkom:
                <span style={{ marginLeft: "10px" }}>
                    <input
                        type="radio"
                        name="parkom"
                        value="1"
                        checked={parkomStatus === 1}
                        onChange={(e) => setParkomStatus(1)}
                    />
                    <span style={{ marginLeft: "5px", marginRight: "10px" }}>Active</span>
                    <input
                        type="radio"
                        name="parkom"
                        value="0"
                        checked={parkomStatus === 0}
                        onChange={(e) => setParkomStatus(0)}
                    />
                    <span style={{ marginLeft: "5px" }}>Deactive</span> <br /><br />
                </span>
            </label>
        )}

     

       
        {(activemodalUserid.user_side === 3) && (
            <label>
                For Gatepass:
                <span style={{ marginLeft: "10px" }}>
                    
                    <input
                        type="radio"
                        name="gatepass"
                        value="1"
                        checked={gatepassStatus === 1}
                        onChange={(e) => setGatepassStatus(1)}
                    />
                    <span style={{ marginLeft: "5px", marginRight: "10px", }}>Active</span>
                    <input
                        type="radio"
                        name="gatepass"
                        value="0"
                        checked={gatepassStatus === 0}
                        onChange={(e) => setGatepassStatus(0)}
                    />
                    <span style={{ marginLeft: "5px" }}>Deactive</span>
                </span>
            </label>
        )}

       
    </Modal.Body>
    <Modal.Footer>
        <Button variant="primary" className="btn btn-primary" onClick={handleActivateDeactivate}>
            Ok
        </Button>
    </Modal.Footer>
</Modal>
        </>
    );
};

export default CustomerList;