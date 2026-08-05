
import * as React from 'react';
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './main.css';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import { IconSearch } from '@tabler/icons-react';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from 'config/constant';
import { useNavigate } from 'react-router-dom';
import { encode as base64_encode } from 'base-64';

const columns = [
  { id: 'number', label: 'S.No.', minWidth: 70, align: 'center' },
  { id: 'actions', label: 'Actions', minWidth: 100, align: 'center' },
  { id: 'banner_image', label: 'Banner Image', minWidth: 170, align: 'center' },
  { id: 'date_time', label: 'Create Date & Time', minWidth: 170, align: 'center' }
];

const ManageBanner = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(50);
  const theme = useTheme();
  const [showModal2, setShowModal2] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [banner_data, setBannerData] = React.useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bannerToDelete, setBannerDelete] = useState('');
  const [image, setBannerImage] = useState('');
  const [imageError, setBannerImageError] = useState('');

  const [searchQuery, setSearchQuery] = React.useState('');
  const [ShowEditModal, setShowEditModal] = useState(false);
  const [editImage, setEditImage] = useState('');
  const [editImageError, setEditImageError] = useState('');
   const [enlargedImage, setEnlargedImage] = useState(null);
      const [showImagePopup, setShowImagePopup] = useState(false);

  var navigate = useNavigate();

  const handleClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedIndex(index);
  };

  var fetchData = () => {
    axios
      .get(`${API_URL}get_banner`)
      .then((response) => {
        setBannerData(response.data.banner_arr);
        console.error('response.data.banner_arr:', response.data.banner_arr);
      })
      .catch((error) => {
        console.error('Error fetching user count details:', error);
      });
  };

  // React.useEffect(() => {
  //   fetchData();
  // }, []);

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedIndex(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleAction = (action, row) => {
    if (action === 'Edit') {
      setShowEditModal(true);
      setSelectedIndex(null);
      setEditImage(row.image);
      setBannerDelete(row.banner_id);
    } else if (action === 'Delete') {
      setAnchorEl(null);
      setSelectedIndex(null);
      setShowDeleteModal(true);
      setBannerDelete(row.banner_id);
    } else if (action === 'View') {
      var sub = row.banner_id;
      var id = base64_encode(sub.toString());
      navigate(APP_PREFIX_PATH + `/view-ads/${id}`);
    }
  };

  const deleteAds = () => {
    axios
      .post(`${API_URL}delete_banner`, { banner_id: bannerToDelete })
      .then((response) => {
        if (response.data.success) {
          fetchData();
          setShowDeleteModal(false);
        } else {
          console.error('Error deleting banner:', response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error deleting banner:', error);
      });
  };

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => {
    setShowModal2(false);
    setShowModal2(false);
    setBannerImage('');
    setBannerImageError('');
    setBannerImage('');
  };

  const handleAddBanner = (e) => {
    e.preventDefault();

    let hasError = false;

    if (!image) {
      setBannerImageError('Please Select Banner Image');
      hasError = true;
    } else {
      setBannerImageError('');
    }

    if (hasError) {
      return;
    }

    const data = new FormData();
    data.append('image', image);

    axios
      .post(`${API_URL}add_banner`, data)
      .then((response) => {
        if (response.data.success) {
          fetchData();
          setShowModal2(false);
          setBannerImage('');
          setBannerImageError('');
        } else {
          setBannerImageError('Error Adding Banner');
        }
      })
      .catch((error) => {
        console.error('Error adding banner:', error);
      });
  };
  const handleEdit = (e) => {
    e.preventDefault();

    let hasError = false;

    if (!editImage) {
      setEditImageError('Please Enter banner Name');
      hasError = true;
    } else {
      setEditImageError('');
    }

    if (hasError) {
      return;
    }

    const data = new FormData();
    data.append('banner_id', bannerToDelete);
    data.append('image', editImage);
    axios
      .post(`${API_URL}edit_banner`, data)
      .then((response) => {
        if (response.data.success) {
          fetchData();
          setShowEditModal(false);
        }
      })
      .catch((error) => {
        console.error('Error updating banner:', error);
      });
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filterBanner = banner_data.filter((banner) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    const dateMatch = banner.createtime_format ? String(banner.createtime_format).toLowerCase().includes(lowercasedTerm) : false;
    return dateMatch;
  });

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImage(file);
      setBannerImageError('');
    } else {
      setBannerImageError('Please upload Banner image');
      e.target.value = null;
    }
  };

  const handleChangeEditImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      setEditImageError('');
    } else {
      setEditImageError('Please upload Video');
      e.target.value = null;
    }
  };

  const handleImageClick = (imageUrl) => {
    setEnlargedImage(imageUrl);
    setShowImagePopup(true);
};

const handleCloseImage = () => {
    setEnlargedImage(null);
    setShowImagePopup(false);
};

  return (
    <>
      <div className="col-xl-12" style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '10px', marginBottom: '40px' }}>
        <p
          style={{
            fontSize: '1.25rem',
            color: '#121926',
            fontWeight: '600',
            fontFamily: 'Poppins',
            lineHeight: '1.167',
            // fontWeight: ' 500',
            marginBottom: '5px'
          }}
        >
          Gatepass  Banners
        </p>
      </div>
    

      <Box alignItems="end" justifyContent="end" display="flex" className="mobile-res">
      
      
        <Button className="btn" onClick={handleShowModal2} 
        style={{ width: '160px'  , backgroundColor: '#3268f1', color: '#fff' ,marginLeft: '10px'  , marginBottom: '40px' }}
        >
        <AddIcon /> Add Banner
        </Button>
      </Box>

      {filterBanner.length > 0 ? (
        <Paper sx={{ width: '100%' }}>
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
                {filterBanner.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell style={{ textAlign: 'center' }}>{index + 1}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <Button
                        className="btn btn-primary "
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={(event) => handleClick(event, index)}
                      >
                        Actions <ArrowDropDown />
                      </Button>
                      <Menu id="long-menu" anchorEl={anchorEl} keepMounted open={selectedIndex === index} onClose={handleClose}>
                        <MenuItem onClick={() => handleAction('Edit', row)} className="menu-icons">
                          <EditIcon style={{ marginRight: '10px' }} />
                          Edit
                        </MenuItem>
                        <>
                          {' '}
                          <MenuItem onClick={() => handleAction('Delete', row)} className="menu-icons">
                            <DeleteIcon style={{ marginRight: '8px' }} />
                            Delete
                          </MenuItem>{' '}
                        </>
                      </Menu>
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <img
                        alt={row.image}
                        src={row.image && row.image != null ? `${IMAGE_PATH}${row.image}` : `${IMAGE_PATH}placeholderVillage.png`}
                        style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}
                        onClick={() => handleImageClick(row.image ? `${IMAGE_PATH}${row.image}` : `${IMAGE_PATH}placeholderVillage.png`)}
                      />
                    </TableCell>

                    <TableCell style={{ textAlign: 'center' }}>{row.createtime_format}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p
              style={{ marginLeft: '26px', marginTop: '15px' }}
            >{`Showing ${Math.min(filterBanner.length > 0 ? page * rowsPerPage + 1 : 0, filterBanner.length)} to ${Math.min((page + 1) * rowsPerPage, filterBanner.length)} of ${filterBanner.length} entries`}</p>
            <div>
              <button
                onClick={() => handleChangePage(null, page - 1)}
                disabled={page === 0}
                // style={{ marginRight: '8px' }}
                style={{ marginRight: '8px', borderRadius: '4px', background: 'whitesmoke' }}
              >
                {'<'}
              </button>
              <button
                onClick={() => handleChangePage(null, page + 1)}
                disabled={(page + 1) * rowsPerPage >= filterBanner.length}
                style={{ borderRadius: '4px', marginRight: '10px', background: 'whitesmoke' }}
              >
                {'>'}
              </button>
            </div>
          </div>

          <Modal
            show={ShowEditModal}
            onHide={() => {
              setShowEditModal(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title style={{ fontSize: '17px' }}>Edit Banner </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleEdit}>
                <div className="mb-3">
                  <label htmlFor="bannerName" className="form-label">
                    Select Banner Image
                  </label>
                  <input type="file" className="form-control" id="image" onChange={handleChangeEditImage} />
                  {editImageError && <p style={{ color: 'red' }}>{editImageError}</p>}
                </div>

                <Modal.Footer>
                  <Button variant="primary" className="btn btn-primary" type="submit">
                     Save
                  </Button>
                </Modal.Footer>
              </form>
            </Modal.Body>
          </Modal>

          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this Banner?</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" className="btn btn-primary" onClick={deleteAds}>
                Delete
              </Button>
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
      <Modal show={showModal2} onHide={handleCloseModal2} style={{ zIndex: '99999' }}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '17px' }}>Add Banner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddBanner}>
            <div className="mb-3">
              <label htmlFor="bannerName" className="form-label">
                Select Banner Image
              </label>
              <input type="file" className="form-control" id="image" onChange={handleChangeImage} />
              {imageError && <p style={{ color: 'red' }}>{imageError}</p>}
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" className="btn btn-primary" type="submit" onClick={handleAddBanner}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {showImagePopup && (
        <div
          className="enlarged-image-overlay"
          onClick={handleCloseImage}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              handleCloseImage();
            }
          }}
          role="button"
          tabIndex={0}
        >
          <span
            className="close-button"
            onClick={handleCloseImage}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCloseImage();
              }
            }}
            role="button"
            tabIndex={0}
          >
            &times;
          </span>
          <img
            src={enlargedImage}
            alt="Enlarged Profile Image"
            className="enlarged-image"
            style={{ width: '20rem', height: '20rem', objectFit: 'cover' }}
          />
        </div>
      )}
    </>
  );
};

export default ManageBanner;
