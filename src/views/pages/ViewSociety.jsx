import React, { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';
import MainCard from 'ui-component/cards/MainCard';
import { Row, Col, Modal, Button, BreadcrumbItem } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from 'config/constant';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import './ViewCustomer.css';
import { decode as base64_decode } from 'base-64';
import { Box, InputAdornment, OutlinedInput } from '@mui/material';
import { IconSearch } from '@tabler/icons-react';
import { useTheme } from '@mui/material/styles';
import { encode as base64_encode } from 'base-64';

const columns = [
  { id: 'number', label: 'S.No.', minWidth: 70, align: 'center' },
  // { id: 'Action', label: 'Action', minWidth: 100, align: 'center' },
  { id: 'f_name', label: ' Building Name', minWidth: 130, align: 'center' },
  // { id: 'l_name', label: 'Plate Number', minWidth: 130, align: 'center' },
  // { id: 'email', label: 'Email', minWidth: 170, align: 'center' },
  // { id: 'mobile', label: 'Mobile No.', minWidth: 170, align: 'center' },
  // { id: 'address', label: 'Address', minWidth: 170, align: 'center' },
  { id: 'date_time', label: 'Create Date & Time', minWidth: 250, align: 'center' }
];

const columns1 = [
  { id: 'number', label: 'S.No.', minWidth: 70, align: 'center' },

  { id: 'Subscription Typ', label:  'Name', minWidth: 130, align: 'center' },
  { id: 'transaction_id', label: 'Email', minWidth: 130, align: 'center' },
  // { id: 'Duration (In days)', label: 'Date', minWidth: 130, align: 'center' },
  { id: 'Start Date', label: 'Building', minWidth: 150, align: 'center' },
  // { id: 'End Date', label: 'Vehicle Type', minWidth: 130, align: 'center' },
  { id: 'Category', label: 'Mobile', minWidth: 130, align: 'center' },
  { id: 'Status', label: ' Shift Preference', minWidth: 130, align: 'center' },
  { id: 'Amount', label: 'Create Date & Time', minWidth: 130, align: 'center' },
];


const historycolumns = [

  { id: 'number', label: 'S.No.', minWidth: 70, align: 'center' },
  { id: 'parking_no', label: 'Parking No.', minWidth: 130, align: 'center' },
  { id: 'duration', label: 'Duration', minWidth: 130, align: 'center' },
  { id: 'duration', label: 'Vehicle Name', minWidth: 130, align: 'center' },
  { id: 'Status', label: 'Vehicle Number', minWidth: 130, align: 'center' },
  { id: 'Amount', label: 'Create Date & Time', minWidth: 130, align: 'center' },
];

const columns2 = [
  { id: 'number', label: 'S.No.', minWidth: 70, align: 'center' },
  { id: 'Action', label: 'Action', minWidth: 100, align: 'center' },
  // { id: 'Busniess Name', label: 'Business Name', minWidth: 170, align: 'center' },
  { id: 'f_name', label: 'First Name', minWidth: 170, align: 'center' },
  { id: 'l_name', label: 'Last Name', minWidth: 170, align: 'center' },
  { id: 'mobile', label: 'Mobile', minWidth: 170, align: 'center' },
  { id: 'date_time', label: 'Claim Date & Time', minWidth: 250, align: 'center' }
];

const ViewSociety = () => {
  const { user_id } = useParams();
  const decode_user_id = base64_decode(user_id);
  // console.log("User ID : ", decode_user_id);
  const [page, setPage] = React.useState(0);
  const [show, setShow] = useState(false);
  const [user_data, setUserDetails] = useState([]);
  const [content, setContent] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchQuery1, setSearchQuery1] = React.useState('');
  const [searchQuery2, setSearchQuery2] = React.useState('');
  const [customer_data, setCustomerData] = useState([]);
  const [deleted_customer_data, setDeletedCustomerData] = useState([]);
  const [transaction_arr, setTrasactionData] = useState([]);
  const [clamied_data, setClamiedUserData] = useState([]);
  const [parking, setParking] = useState([]);
  const [guard, setGuard] = useState([]);

  


  const [content1, setContent1] = React.useState(0);

  const contentTypes1 = {
    subscription: 0,
    post: 1
  };


  const navigate = useNavigate();
  const theme = useTheme();
  const contentTypes = {
    subscription: 0,
    claimes: 1,
    deletedClaimes: 2,
    history: 3,

  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleSearch1 = (event) => {
    setSearchQuery1(event.target.value);
  };

  const handleSearch3 = (event) => {
    setSearchQuery2(event.target.value);
  };

  const handleAction = (action, customer_id) => {
    let encode_customer_id = base64_encode(customer_id.toString());
    if (action == 'View') {
      navigate(APP_PREFIX_PATH + `/view-question/${encode_customer_id}`);
    } else if (action == "deletedView") {
      navigate(APP_PREFIX_PATH + `/view-deleted-question/${encode_customer_id}`);
    }
  };

  React.useEffect(() => {
    // let user_id = base64_decode(decode_user_id.toString());
    // console.log("Abhiiii :", decode_user_id);

    axios
      .get(`${API_URL}get_user_data/${decode_user_id}`)
      .then((response) => {
        if (response.data.success) {
          setUserDetails(response.data.res[0]);
          console.log('setTransaction Data is', response.data.res[0]);
        } else {
          console.error('Error fetching store details:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching store details:', error);
      });
  }, [user_id]);


// get building details
  React.useEffect(() => {
    if (!decode_user_id) return; 
    console.log("User Id :- ", decode_user_id);

    axios
      .get(`${API_URL}get_biuilding_details?society_id=${decode_user_id}`)
      .then((response) => {
        console.log("Building Data:", response);
        if (response.data.success && Array.isArray(response.data.data)) {
          setParking(response.data.data);
         
        } else {
          console.log("No buildings found:", response.data.msg);
        }
      })
      .catch((error) => {
        console.error("Error fetching buildings:", error);
      });
  }, [decode_user_id]);


// get guard details
  React.useEffect(() => {
    if (!decode_user_id) return; 
    console.log("User Id :- ", decode_user_id);

    axios
      .get(`${API_URL}get_society_guard?user_id=${decode_user_id}`)
      .then((response) => {
        console.log("Guard Data:", response);
        if (response.data.success && Array.isArray(response.data.data)) {
          setGuard(response.data.data);
         
        } else {
          console.log("No guard found:", response.data.msg);
        }
      })
      .catch((error) => {
        console.error("Error fetching guards:", error);
      });
  }, [decode_user_id]);

 




  const filteredUsers = customer_data.filter((user) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    const f_nameMatch = user.f_name?.toLowerCase().includes(lowercasedTerm);
    const emailMatch = user.email?.toLowerCase().includes(lowercasedTerm);
    const addressMatch = user.address?.toLowerCase().includes(lowercasedTerm);
    const l_nameMatch = user.l_name?.toLowerCase().includes(lowercasedTerm);
    const mobileMatch = user.mobile ? String(user.mobile).toLowerCase().includes(lowercasedTerm) : false;
    const dateMatch = user.createtime ? String(user.createtime).toLowerCase().includes(lowercasedTerm) : false;
    return mobileMatch || dateMatch || l_nameMatch || f_nameMatch || addressMatch || emailMatch;
  });

  const filteredUsers1 = transaction_arr.filter((user) => {
    const lowercasedTerm = searchQuery1.toLowerCase();
    const status_lableMatch = user.status_lable?.toLowerCase().includes(lowercasedTerm);
    const subscription_type_lableMatch = user.subscription_type_lable?.toLowerCase().includes(lowercasedTerm);
    const transactionIdMatch = user.transaction_id ? String(user.transaction_id).toLowerCase().includes(lowercasedTerm) : false;
    const snoMatch = user.amount ? String(user.amount).toLowerCase().includes(lowercasedTerm) : false;
    const enddateMatch = user.end_date ? String(user.end_date).toLowerCase().includes(lowercasedTerm) : false;
    const replydateMatch = user.start_date ? String(user.start_date).toLowerCase().includes(lowercasedTerm) : false;
    const noOfDayMatch = user.duration ? String(user.duration).toLowerCase().includes(lowercasedTerm) : false;
    return (
      snoMatch || replydateMatch || enddateMatch || status_lableMatch || subscription_type_lableMatch || noOfDayMatch || transactionIdMatch
    );
  });

  const filteredUsers2 = deleted_customer_data.filter((user) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    const f_nameMatch = user.f_name?.toLowerCase().includes(lowercasedTerm);
    const emailMatch = user.email?.toLowerCase().includes(lowercasedTerm);
    const addressMatch = user.address?.toLowerCase().includes(lowercasedTerm);
    const l_nameMatch = user.l_name?.toLowerCase().includes(lowercasedTerm);
    const mobileMatch = user.mobile ? String(user.mobile).toLowerCase().includes(lowercasedTerm) : false;
    const dateMatch = user.createtime ? String(user.createtime).toLowerCase().includes(lowercasedTerm) : false;
    return mobileMatch || dateMatch || l_nameMatch || f_nameMatch || addressMatch || emailMatch;
  });

  const filteredUsers3 = clamied_data.filter((user) => {
    const lowercasedTerm = searchQuery2.toLowerCase();
    const f_nameMatch = user.f_name?.toLowerCase().includes(lowercasedTerm);
    const emailMatch = user.email?.toLowerCase().includes(lowercasedTerm);
    const addressMatch = user.business_name?.toLowerCase().includes(lowercasedTerm);
    const l_nameMatch = user.l_name?.toLowerCase().includes(lowercasedTerm);
    const mobileMatch = user.mobile ? String(user.mobile).toLowerCase().includes(lowercasedTerm) : false;
    const dateMatch = user.createtime ? String(user.createtime).toLowerCase().includes(lowercasedTerm) : false;
    return dateMatch || l_nameMatch || f_nameMatch || addressMatch || emailMatch || mobileMatch;
  });

  return (
    <>
      {/* <div className="col-xl-12" style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '10px', marginBottom: '20px' }}>
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
         User Details
        </p>
      </div> */}
      <div>
        <div title="View User">
          <Row>
            <Col lg={5} className="mb-3">
              <MainCard style={{ height: '330px' }} className="d-flex justify-content-center align-items-center">
                <img
                  src={user_data.image ? `${IMAGE_PATH}${user_data.image}` : `${IMAGE_PATH}placeholder.png`}
                  alt={user_data.username}
                  style={{ width: '200px', height: '200px', borderRadius: '50%', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={handleShow}
                />
              </MainCard>
            </Col>

            <Col lg={7}>
              <MainCard title="Society Details">
                <div className="profile">
                  <div className="user-detail row ">
                    <div className="col-lg-12 ">
                      {/* <div className="row ">
                        <div className="col-lg-6 cosntomer-name">
                          <p style={{}}>First Name :</p>
                        </div>
                        <div className="col-lg-6 cosntomer-name2">
                          <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user_data.f_name ? user_data.f_name : user_data.name}</p>
                        </div>
                      </div> */}
                      <div className="row ">
                        <div className="col-lg-6 cosntomer-name">
                          <p style={{}}>Society Name  :</p>
                        </div>
                        <div className="col-lg-6 cosntomer-name2">
                          <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user_data.society_name ? user_data.society_name : "NA"}</p>
                        </div>
                      </div>

                      {/* <div className="row ">
                        <div className="col-lg-6 cosntomer-name">
                          <p style={{}}>User Type :</p>
                        </div>
                        <div className="col-lg-6 cosntomer-name2">
                          <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user_data.user_type_lable_filter}</p>
                        </div>
                      </div> */}

                      <div className="row">
                        <div className="col-lg-6 cosntomer-name">
                          <p style={{}}>Email :</p>
                        </div>
                        <div className="col-lg-6 cosntomer-name2">
                          <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user_data.email}</p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6 cosntomer-name">
                          <p style={{}}>Location : </p>
                        </div>
                        <div className="col-lg-6 cosntomer-name2">
                          <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user_data.location ? user_data.location : "NA"} </p>
                        </div>
                      </div>

                      {/* <div className="row">
                        <div className="col-lg-6 cosntomer-name">
                          <p style={{}}>Society Name : </p>
                        </div>
                        <div className="col-lg-6 cosntomer-name2">
                          <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user_data.society_name} </p>
                        </div>
                      </div> */}

                      {/* <div className="row">
                        <div className="col-lg-6 cosntomer-name">
                          <p style={{}}>Building Name : </p>
                        </div>
                        <div className="col-lg-6 cosntomer-name2">
                          <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user_data.building_name} </p>
                        </div>
                      </div> */}

                      {/*
                      <div className="row">
                        <div className="col-lg-6 cosntomer-name">
                          <p>Society Status :</p>
                        </div>
                        <div className="col-lg-6 cosntomer-name2">
                          <p
                            className="active-btn"
                            style={{
                              borderRadius: '25px',
                              backgroundColor:
                              user_data.active_flag === 1 ? 'green' : 'red',
                              padding: '0px 15px',
                              width: '90px',
                              color: '#fff',
                              fontWeight: '600',
                              textAlign: 'center',
                              margin: '0'
                            }}
                          >
                            {user_data.active_flag === 1 ? 'Active' : 'Deactive'}
                          </p>
                        </div>
                      </div>
                       */}


                      {/* <div className="row">
                        <div className="col-lg-6 cosntomer-name">
                          <p style={{}}>Gatepass Status :</p>
                        </div>
                        <div className="col-lg-6 cosntomer-name2">
                          <p
                            className="active-btn"
                            style={{
                              borderRadius: '25px',
                              backgroundColor:
                                user_data.user_side === 2 || user_data.user_side === 3
                                  ? (user_data.gatepass_active_flag === 1 ? 'green' : 'red')
                                  : '#A0A0A0',
                              padding: '0px 15px',
                              width: '90px',
                              color: '#fff',
                              fontWeight: '600',
                              textAlign: 'center',
                              margin: '0'
                            }}
                          >
                            {user_data.user_side == 2 ? (user_data.gatepass_active_flag === 1 ? 'Active' : 'Deactive') : user_data.user_side == 3 ? (user_data.gatepass_active_flag === 1 ? 'Active' : 'Deactive') : "NA"}
                          </p>
                        </div>
                      </div> */}

                      {user_data.user_type == 2 ? (
                        <>
                          {/* <div className="row ">
                            <div className="col-lg-6 cosntomer-name">
                              <p>Business Name :</p>
                            </div>
                            <div className="col-lg-6 cosntomer-name2">
                              <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user_data.business_name}</p>
                            </div>
                          </div> */}
                          {/* <div className="row ">
                            <div className="col-lg-6 cosntomer-name">
                              <p>ABN Number :</p>
                            </div>
                            <div className="col-lg-6 cosntomer-name2">
                              <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user_data.abn_number}</p>
                            </div>
                          </div> */}
                          {/* <div className="row ">
                            <div className="col-lg-6 cosntomer-name">
                              <p>Business Category Name :</p>
                            </div>
                            <div className="col-lg-6 cosntomer-name2">
                              <p style={{ fontWeight: '500', marginLeft: '0px' }}>
                                {user_data.business_id != null ? user_data.business_id : 'NA'}
                              </p>
                            </div>
                          </div> */}
                        </>
                      ) : (
                        <></>
                      )}

                      <div className="row">
                        <div className="col-lg-6 cosntomer-name">
                          <p>Create Date & Time :</p>
                        </div>
                        <div className="col-lg-6 cosntomer-name2">
                          <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user_data.createtime} </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </MainCard>
            </Col>
          </Row>




 <nav className="col-xl-10 navbar navbar-expand-lg navbar-light" style={{ padding: '10px' }}>
            <div className="container-fluid tabs justify-content-start">
              <button
                style={{ border: '1px solid #19253D', borderRadius: '0px', marginTop: '40px', height: '38px' }}
                className={`btn ${content === 0 ? 'btn-primary' : '#19253D'}`}
                type="button"
                onClick={() => setContent(contentTypes.subscription)}
              >
                Building Details
              </button>
              <button
                style={{ border: '1px solid #19253D', borderRadius: '0px', marginTop: '40px', height: '38px' }}
                className={`btn ${content === 1 ? 'btn-primary' : '#19253D'}`}
                type="button"
                onClick={() => setContent(contentTypes.claimes)}
              >
                Guard Details
              </button>
              {/* <button
                style={{ border: '1px solid #19253D', borderRadius: '0px', marginTop: '40px', height: '38px' }}
                className={`btn ${content === 2 ? 'btn-primary' : '#19253D'}`}
                type="button"
                onClick={() => setContent(contentTypes.deletedClaimes)}
              >
                Pre Approved
              </button>
              <button
                style={{ border: '1px solid #19253D', borderRadius: '0px', marginTop: '40px', height: '38px' }}
                className={`btn ${content === 3 ? 'btn-primary' : '#19253D'}`}
                type="button"
                onClick={() => setContent(contentTypes.history)}
              >
                Parking History
              </button> */}
            </div>
          </nav> 

{/* 
{content === 0 && (
            <>

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
                {parking.map((row, index) => (
                  <tr key={index}>
                    <TableCell style={{ textAlign: 'center' }}> {index + 1}</TableCell>
                   
                    <TableCell style={{ textAlign: 'center' }}>{row.building_name} </TableCell>

                    <TableCell style={{ textAlign: 'center' }}> {row.createtime} </TableCell>
                  </tr>
                ))}


                </TableBody>
              </Table>
            </>
          )} */}



{content === 0 && (
  <>
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
        {guard && guard.length > 0 ? (
          guard.map((row, index) => (
            <TableRow key={index}>
               <TableCell style={{ textAlign: 'center' }}> {index + 1}</TableCell>
                   
                   <TableCell style={{ textAlign: 'center' }}>{row.building_name} </TableCell>

                   <TableCell style={{ textAlign: 'center' }}> {row.createtime} </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns1.length} style={{ textAlign: 'center', padding: '20px' }}>
              No Data Available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </>
)}



    {content === 1 && (
  <>
    <Table>
      <TableHead>
        <TableRow>
          {columns1.map((column) => (
            <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
              {column.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {guard && guard.length > 0 ? (
          guard.map((row, index) => (
            <TableRow key={index}>
              <TableCell style={{ textAlign: 'center' }}>{index + 1}</TableCell>
              <TableCell style={{ textAlign: 'center' }}>{row.name}</TableCell>
              <TableCell style={{ textAlign: 'center' }}>{row.email}</TableCell>
              <TableCell style={{ textAlign: 'center' }}>{row.building_name}</TableCell>
              <TableCell style={{ textAlign: 'center' }}>{row.mobile}</TableCell>
              <TableCell style={{ textAlign: 'center' }}>{row.shift}</TableCell>
              <TableCell style={{ textAlign: 'center' }}>{row.createtime}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns1.length} style={{ textAlign: 'center', padding: '20px' }}>
              No Data Available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </>
)}






          {content === 2 && (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    {columns1.map((column) => (
                      <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <tr>
                    <TableCell style={{ textAlign: 'center' }}> 1</TableCell>
                    <TableCell style={{ textAlign: 'center' }}> Jos </TableCell>
                    <TableCell style={{ textAlign: 'center' }}> 890365678</TableCell>
                    <TableCell style={{ textAlign: 'center' }}> TX 5546 AB</TableCell>
                     <TableCell style={{ textAlign: 'center' }}> Two Wheeler</TableCell>
                    <TableCell style={{ textAlign: 'center' }}> Gas Delivery </TableCell>

                    <TableCell style={{ textAlign: 'center' }}> B-24</TableCell>
                    <TableCell style={{ textAlign: 'center' }}> 01-01-2025 11:15 AM</TableCell>

                  </tr>
                  <tr>
                    <TableCell style={{ textAlign: 'center' }}> 2</TableCell>
                    <TableCell style={{ textAlign: 'center' }}> Johnson Swift </TableCell>
                    <TableCell style={{ textAlign: 'center' }}> 86456125678</TableCell>
                    <TableCell style={{ textAlign: 'center' }}> CA 5678 XY</TableCell>
               <TableCell style={{ textAlign: 'center' }}> Four Wheeler</TableCell>
                    <TableCell style={{ textAlign: 'center' }}> Beautician </TableCell>
                    <TableCell style={{ textAlign: 'center' }}> B-24 </TableCell>
                    <TableCell style={{ textAlign: 'center' }}> 02-06-2025 10:15 AM</TableCell>

                  </tr>
                  <tr>
                    <TableCell style={{ textAlign: 'center' }}> 3</TableCell>
                    <TableCell style={{ textAlign: 'center' }}> Justin Bieber </TableCell>
                    <TableCell style={{ textAlign: 'center' }}> 86456125678</TableCell>
                    <TableCell style={{ textAlign: 'center' }}> CA 5678 XY</TableCell>
              <TableCell style={{ textAlign: 'center' }}> Four Wheeler</TableCell> 
                    <TableCell style={{ textAlign: 'center' }}>  Tutor </TableCell>

                    <TableCell style={{ textAlign: 'center' }}>B-24</TableCell>
                    <TableCell style={{ textAlign: 'center' }}> 02-06-2025 10:15 AM</TableCell>

                  </tr>
                </TableBody>
              </Table>
            </>
          )}

          {content === 3 && (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    {historycolumns.map((column) => (
                      <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {parking.length > 0 ? (
                    parking.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell style={{ textAlign: 'center' }}>{item.s_no}</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>{item.parking_number}</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>{item.duration}</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>{item.model_name}</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>{item.plate_number}</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>{item.createtime}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={historycolumns.length} style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        No Parking History Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </>

          )}







          <Modal show={show} onHide={handleClose} className="d-flex justify-content-center align-items-center ">
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <img
                src={user_data.image ? `${IMAGE_PATH}${user_data.image}` : `${IMAGE_PATH}placeholder.png`}
                alt="Preview"
                style={{ width: '100%', height: '356px', margin: 'auto', display: 'flex', objectFit: 'cover' }}
              />
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default ViewSociety;
