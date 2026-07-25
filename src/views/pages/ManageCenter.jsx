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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Img from 'assets/images/image3.jpg';
import './main.css';
import OutlinedInput from '@mui/material/OutlinedInput';
import { IconSearch } from '@tabler/icons-react';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import Box from '@mui/material/Box';
import axios from 'axios';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from 'config/constant';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import {encode as base64_encode} from 'base-64';
// import SearchSection from './MainLayout/Header/SearchSection';

const columns = [
  { id: 'number', label: 'S.No.', align: 'center' },
  { id: 'actions', label: 'Actions', align: 'center' },
  { id: 'image', label: 'Image', align: 'center' },
  { id: 'title', label: 'Title', align: 'center' },
  { id: 'location', label: 'Address', align: 'center' },
  { id: 'date_time', label: 'Create Date & Time', align: 'center' }
];

const createData = (number, date_time) => {
  return { number, date_time };
};

const ManageCenter = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const theme = useTheme();
  const [showModal2, setShowModal2] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // State for handling menu open/close and anchor element for menu positioning
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [center_data, setAllCenterData] = React.useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ShowEditModal, setShowEditModal] = useState(false);
  const [donateToDelete, sethomesDelete] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editimage, setEditImage] = useState('');
  const [editimageError, setEditImageError] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [editTitleError, setEditTitleError] = useState('');
  const [editDescriptionError, setEditDescriptionError] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ADD homes state
  const [addTitle, setAddTitle] = useState('');
  const [addTitleError, setAddTitleError] = useState('');

  const [addDescription, setAddDescription] = useState('');
  const [addDescriptionError, setAddDesciptionError] = useState('');

  const [addAdress,setAddress] = useState("");
  const [addressError,setAddressError] = useState("")

  const [addImage, setAddImage] = useState('');
  const [addImageError, setAddImageError] = useState('');
  const [editAddress,setEditAddress] = useState("");
  const [editAddressError,setEditAddressError] = useState("");

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

  const handleDelete = (index) => {
    alert(`Deleting row ${index + 1}`);
    handleClose();
  };

  var fetchData = () => {
    axios
      .get(`${API_URL}get_all_donate_center`)
      .then((response) => {
        setAllCenterData(response.data.donate_arr);
      })
      .catch((error) => {
        console.error('Error fetching data :', error);
      });
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleAction = (action, donation_center_id, title, image, description,location) => {
    if (action === 'Edit') {
      setShowEditModal(true);
      setAnchorEl(null);
      setSelectedIndex(null);
      setEditTitle(title);
      setEditDescription(description);
      sethomesDelete(donation_center_id);
      setEditImage(image);
      setEditAddress(location);
    } else if (action === 'Delete') {
      setAnchorEl(null);
      setSelectedIndex(null);
      setSelectedUserId(null);
      setShowDeleteModal(true);
      sethomesDelete(donation_center_id);
    } else if (action === 'View') {
      let encode_donation_center_id= base64_encode(donation_center_id.toString());
      navigate(APP_PREFIX_PATH + `/view-centers/${encode_donation_center_id}`);
    }
  };

  const deleteCategory = () => {
    axios
      .post(`${API_URL}delete_donate_center`, { donation_center_id: donateToDelete })
      .then((response) => {
        if (response.data.success) {
          setShowDeleteModal(false);
          fetchData();
        } else {
          console.error('Error deleting category:', response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error deleting category:', error);
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType.startsWith('image/')) {
        setEditImage(file);
        setEditImageError('');
      } else {
        setEditImageError('Please upload valid image format');
        e.target.value = null;
      }
    }
  };

  const handleFileChange2 = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType.startsWith('image/')) {
        setAddImage(file);
        setAddImageError('');
      } else {
        setAddImageError('Please upload valid image format');
        e.target.value = null;
      }
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();

    let hasError = false;

    if (!editTitle) {
      setEditTitleError('Please Enter title');
      hasError = true;
    } else {
      setEditTitleError('');
    }

    if(!editAddress) {
      setEditAddressError("Please Enter Address");
      hasError = true;
    } else {
      setEditAddressError("");
    }

    if (!editDescription) {
      setEditDescriptionError('Please Enter Category Name');
      hasError = true;
    } else {
      setEditDescriptionError('');
    }

    if (!editimage) {
      setEditImageError('Please select image');
      hasError = true;
    } else {
      setEditImageError('');
    }

    if (hasError) {
      return;
    }

    const data = new FormData();
    data.append('donation_center_id', donateToDelete);
    data.append('title', editTitle);
    data.append('description', editDescription);
    data.append("location",editAddress);
    if (editimage) {
      data.append('image', editimage);
    }
    console.log('donateToDelete', donateToDelete);
    axios
      .post(`${API_URL}edit_donate_center`, data)
      .then((response) => {
        console.log('dempo', response);
        if (response.data.key === 'donatcenterAlreadyExist' || response.data.key === 'donatecenterNotFound') {
          response.data.key === 'donatcenterAlreadyExist'
            ? setError('Donation center Already Exists')
            : setError('Donation center Not Found');
        } else {
          fetchData();
          setEditTitle('');
          setEditImage(null);
          setEditImageError('');
          setShowEditModal(false);
          setEditTitleError('');
          setEditDescriptionError('');
          setError('');
        }
      })
      .catch((error) => {
        console.error('Error updating category:', error);
        setError('Error updating category.');
      });
  };

  const handleAdd = (e) => {
    e.preventDefault();

    let hasError = false;

    if (!addTitle) {
      setAddTitleError('Please Enter title');
      hasError = true;
    } else {
      setAddTitleError('');
    }

    if(!addAdress) {
      setAddressError("Please Enter Address");
      hasError = true;
    } else {
      setAddressError("")
    }

    if (!addDescription) {
      setAddDesciptionError('Please Enter Description');
      hasError = true;
    } else {
      setAddDesciptionError('');
    }

    if (!addImage) {
      setAddImageError('Please select image');
      hasError = true;
    } else {
      setAddImageError('');
    }

    if (hasError) {
      return;
    }

    const data = new FormData();
    data.append('title', addTitle);
    data.append('description', addDescription);
    data.append("location",addAdress);
    if (addImage) {
      data.append('image', addImage);
    }
    axios
      .post(`${API_URL}add_donate_center`, data)
      .then((response) => {
        if (response.data.key === 'donatcenterAlreadyExist') {
          setError('Donation center Already Exists');
        } else {
          setShowModal2(false);
          fetchData();
          setAddDesciptionError('');
          setAddDescription('');
          setAddTitle('');
          setAddTitleError('');
          setAddImage('');
          setAddImageError('');
          setError('');
          setAddress("");
          setAddressError("");
        }
      })
      .catch((error) => {
        console.error('Error updating Donation center:', error);
        setError('Error updating Donation center.');
      });
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = center_data.filter((user) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    const titleMatch = user.title?.toLowerCase().includes(lowercasedTerm);
    const locationMatch = user.location?.toLowerCase().includes(lowercasedTerm);
    // const mobileMatch = user.mobile ? String(user.mobile).toLowerCase().includes(lowercasedTerm) : false;
    const dateMatch = user.createtime ? String(user.createtime).toLowerCase().includes(lowercasedTerm) : false;
    // const statusMatch = lowercasedTerm === 'active' ? user.active_flag === 1 : lowercasedTerm === 'deactive' ? user.active_flag === 0 : false;

    return titleMatch || dateMatch || locationMatch;
  });

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => {
    setShowModal2(false), 
    setAddDesciptionError('');
    setAddDescription('');
    setAddTitle('');
    setAddTitleError('');
    setAddImage('');
    setAddImageError('');
    setError('');
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  return (
    <>
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
        <Button className="btn btn-primary " onClick={handleShowModal2} style={{ width: '220px' }}>
          Add Donation Center
          <AddIcon />
        </Button>
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
                      <Button
                        className="btn btn-primary"
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={(event) => handleClick(event, index)}
                      >
                        Actions <ArrowDropDown />
                      </Button>
                      <Menu id="long-menu" anchorEl={anchorEl} keepMounted open={selectedIndex === index} onClose={handleClose}>
                        <MenuItem onClick={() => handleAction('View', row.donation_center_id)} className="menu-icons">
                          <VisibilityIcon style={{ marginRight: '8px' }} />
                          View
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleAction('Edit', row.donation_center_id, row.title, row.image, row.description,row.location)}
                          className="menu-icons"
                        >
                          <EditIcon style={{ marginRight: '8px' }} />
                          Edit
                        </MenuItem>
                        <MenuItem onClick={() => handleAction('Delete', row.donation_center_id)} className="menu-icons">
                          <DeleteIcon style={{ marginRight: '8px' }} />
                          Delete
                        </MenuItem>
                      </Menu>
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <img
                        alt={row.image}
                        src={row.image ? `${IMAGE_PATH}${row.image}` : `${IMAGE_PATH}placeholder.png`}
                        style={{ width: '70px', height: '70px', borderRadius: '50%' }}
                      />
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{row.title}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{row.location}</TableCell>
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

        {/* add category Modal  */}
        <Modal show={showModal2} onHide={handleCloseModal2}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Add Center</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Add your form fields here */}
            <form onSubmit={handleEdit}>
              <div className="mb-3">
                <label htmlFor="editCategoryName" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  value={addTitle}
                  onChange={(e) => {
                    setAddTitle(e.target.value);
                    setAddTitleError('');
                  }}
                  className="form-control"
                  id="editCategoryName"
                  placeholder="Enter Title "
                  maxLength={40}
                />
                <p style={{ color: 'red' }}>{addTitleError}</p>
              </div>
              <div className="mb-3">
                <label htmlFor="editCategoryName" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  value={addAdress}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setAddressError('');
                  }}
                  className="form-control"
                  id="editCategoryName"
                  placeholder="Enter Address "
                  maxLength={40}
                />
                <p style={{ color: 'red' }}>{addressError}</p>
              </div>
              <div className="mb-3">
                <label htmlFor="editCategoryName" className="form-label">
                  Description
                </label>
                <textarea
                  value={addDescription}
                  onChange={(e) => {
                    setAddDescription(e.target.value);
                    setAddDesciptionError('');
                  }}
                  className="form-control"
                  id="editCategoryName"
                  placeholder="Enter description "
                />
                <p style={{ color: 'red' }}>{addDescriptionError}</p>
              </div>
              <div className="mb-3">
                <label htmlFor="categoryDescription" className="form-label">
                  Image
                </label>

                <Form.Control type="file" onChange={handleFileChange2} />
                <p style={{ color: 'red' }}>{addImageError}</p>
              </div>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="btn  btn-secondary" onClick={handleCloseModal2}>
              Close
            </Button>
            <Button variant="primary" className="btn btn-primary " onClick={handleAdd}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>

        {/*  Edit category Modal   */}
        <Modal show={ShowEditModal} onHide={() => {setShowEditModal(false),setEditTitle(""),setEditTitleError(""),setEditImageError(""),setEditImage(null) ,setEditDescription(""),setAddDesciptionError("")}}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Edit Center</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Add your form fields here */}
            <form onSubmit={handleEdit}>
              <div className="mb-3">
                <label htmlFor="editCategoryName" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => {
                    setEditTitle(e.target.value);
                    setEditTitleError('');
                  }}
                  className="form-control"
                  id="editCategoryName"
                  placeholder="Enter Title "
                  maxLength={40}
                />
                <p style={{ color: 'red' }}>{editTitleError}</p>
              </div>
              {/* </div> */}
              <div className="mb-3">
                <label htmlFor="editCategoryName" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => {
                    setEditAddress(e.target.value);
                    setEditAddressError('');
                  }}
                  className="form-control"
                  id="editCategoryName"
                  placeholder="Enter Address "
                  maxLength={40}
                />
                <p style={{ color: 'red' }}>{editAddressError}</p>
              </div>
              <div className="mb-3">
                <label htmlFor="editCategoryName" className="form-label">
                  Description
                </label>
                <textarea
                  type="text"
                  value={editDescription}
                  onChange={(e) => {
                    setEditDescription(e.target.value);
                    setEditDescriptionError('');
                  }}
                  className="form-control"
                  id="editCategoryName"
                  placeholder="Enter description "
                />
                <p style={{ color: 'red' }}>{editDescriptionError}</p>
              </div>
              <div className="mb-3">
                <label htmlFor="categoryDescription" className="form-label">
                  Image
                </label>

                <Form.Control type="file" onChange={handleFileChange} />
                <p style={{ color: 'red' }}>{editimageError}</p>
              </div>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              className="btn  btn-secondary"
              onClick={() => {
                setShowEditModal(false),
                setEditDescription(""),
                setEditTitleError(""),
                setEditTitle(""),
                setEditDescriptionError("")
                setEditImage(null);
                setEditImageError("")

              }}
            >
              Close
            </Button>
            <Button variant="primary" className="btn btn-primary " onClick={handleEdit}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this Homes?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={deleteCategory}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Paper>
    </>
  );
};

export default ManageCenter;
