/* eslint-disable no-dupe-keys */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
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
// import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { encode as base64_encode } from 'base-64';

const columns = [
  { id: 'number', label: 'S.No.', minWidth: 70, align: 'center' },
  { id: 'actions', label: 'Actions', minWidth: 170, align: 'center' },
  { id: 'thumbnail_image', label: 'Thumbnail Image', minWidth: 170, align: 'center' },
  { id: 'Video', label: 'Video', minWidth: 170, align: 'center' },
  { id: 'discounteMatch', label: 'Cashback Points', minWidth: 170, align: 'center' },
  { id: 'discounte', label: 'Earnings per Point', minWidth: 170, align: 'center' },
  { id: 'date_time', label: 'Create Date & Time', minWidth: 170, align: 'center' }
];

const ManageAds = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(50);
  const theme = useTheme();
  const [showModal2, setShowModal2] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [add_data, setAddData] = React.useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adsToDelete, setAdsDelete] = useState('');
  const [points, setPoints] = useState('');
  const [pointsError, setPointsError] = useState('');
  const [image, setThumbnailImage] = useState('');
  const [imageError, setThumbnailImageError] = useState('');
  const [video, setVideo] = useState('');
  const [videoError, setVideoError] = useState('');

  const [searchQuery, setSearchQuery] = React.useState('');
  const [ShowEditModal, setShowEditModal] = useState(false);
  const [editPoints, seteditPoints] = useState('');
  const [editpointsError, setEditpointsError] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editImageError, setEditImageError] = useState('');
  const [editVideo, setEditVideo] = useState('');
  const [editVideoError, setEditVideoError] = useState('');

  var navigate = useNavigate();

  const handleClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedIndex(index);
  };

  var fetchData = () => {
    axios
      .get(`${API_URL}get_adds`)
      .then((response) => {
        setAddData(response.data.add_arr);
        console.error('response.data.result:', response.data.add_arr);
      })
      .catch((error) => {
        console.error('Error fetching user count details:', error);
      });
  };

  React.useEffect(() => {
    fetchData();
  }, []);

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
      // setAnchorEl(null);
      setSelectedIndex(null);
      seteditPoints(row.discount);
      setEditVideo(row.video);
      setEditImage(row.thumbnail_image);
      setAdsDelete(row.ads_id);
    } else if (action === 'Delete') {
      setAnchorEl(null);
      setSelectedIndex(null);
      setShowDeleteModal(true);
      setAdsDelete(row.ads_id);
    } else if (action === 'View') {
      var sub = row.ads_id;
      var id = base64_encode(sub.toString());
      navigate(APP_PREFIX_PATH + `/view-ads/${id}`);
    }
  };

  const deleteAds = () => {
    axios
      .post(`${API_URL}delete_ads`, { ads_id: adsToDelete })
      .then((response) => {
        if (response.data.success) {
          fetchData();
          setShowDeleteModal(false);
        } else {
          console.error('Error deleting category:', response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error deleting category:', error);
      });
  };

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => {
    setShowModal2(false);
    setPoints('');
    setShowModal2(false);
    setPointsError('');
    setThumbnailImageError('');
    setThumbnailImage('');
    setVideo('');
    setVideoError('');
  };

  const HandleAddAds = (e) => {
    e.preventDefault();

    let hasError = false;

    if (!points) {
      setPointsError('Please Enter Points');
      hasError = true;
    } else {
      setPointsError('');
    }

    if (!image) {
      setThumbnailImageError('Please Select Thumbnail Image');
      hasError = true;
    } else {
      setThumbnailImageError('');
    }

    if (!video) {
      setVideoError('Please Select Video');
      hasError = true;
    } else {
      setVideoError('');
    }

    if (hasError) {
      return;
    }

    const data = new FormData();
    data.append('points', points);
    data.append('image', image);
    data.append('video', video);

    axios
      .post(`${API_URL}add_ads`, data)
      .then((response) => {
        if (response.data.success) {
          fetchData();
          setPoints('');
          setShowModal2(false);
          setPointsError('');
          setThumbnailImageError('');
          setVideoError('');
        }
      })
      .catch((error) => {
        console.error('Error adding category:', error);
      });
  };
  const handleEdit = (e) => {
    e.preventDefault();

    let hasError = false;

    if (!editPoints) {
      setEditpointsError('Please enter points to get a cashback.');
      hasError = true;
    } else {
      setEditpointsError('');
    }
    if (!editImage) {
      setEditImageError('Please Enter Category Name');
      hasError = true;
    } else {
      setEditImageError('');
    }

    if (!editVideo) {
      setVideoError('Please Enter Category Name');
      hasError = true;
    } else {
      setVideoError('');
    }

    if (hasError) {
      return;
    }

    const data = new FormData();
    data.append('ads_id', adsToDelete);
    data.append('points', editPoints);
    data.append('image', editImage);
    data.append('video', editVideo);
    axios
      .post(`${API_URL}edit_ads`, data)
      .then((response) => {
        if (response.data.success) {
          fetchData();
          seteditPoints('');
          setShowEditModal(false);

          setEditpointsError('');
        }
      })
      .catch((error) => {
        console.error('Error updating category:', error);
      });
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filterAdds = add_data.filter((category) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    const discounteMatch = category.discount ? String(category.discount).toLowerCase().includes(lowercasedTerm) : false;
    const dateMatch = category.createtime ? String(category.createtime).toLowerCase().includes(lowercasedTerm) : false;
    return discounteMatch || dateMatch;
  });

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailImage(file);
      setThumbnailImageError('');
    } else {
      setThumbnailImageError('Please upload Thumbnail image');
      e.target.value = null;
    }
  };

  const HandleChnageVideo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setVideoError('');
    } else {
      setVideoError('Please upload Video');
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

  const HandleChnageEditVideo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditVideo(file);
      setEditVideoError('');
    } else {
      setEditVideoError('Please upload Video');
      e.target.value = null;
    }
  };

  return (
    <>
      <div className="col-xl-12" style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '10px', marginBottom: '20px' }}>
        <p
          style={{
            fontSize: '1.25rem',
            color: '#121926',
            fontWeight: '600',
            fontFamily: 'Poppins',
            lineHeight: '1.167',
            // fontWeight: ' 500',
            marginBottom: ' 5px'
          }}
        >
          Manage Ads
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
        <Button className="btn btn-primary " onClick={handleShowModal2} style={{ width: '250px' }}>

          <AddIcon />
          Add Ads
        </Button>
      </Box>

      {filterAdds.length > 0 ? (
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
                {filterAdds.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell style={{ textAlign: 'center' }}>{row.s_no}</TableCell>
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
                        {/* <MenuItem onClick={() => handleAction('View', row)} className="menu-icons">
                          <VisibilityIcon style={{ marginRight: '10px' }} />
                          view
                        </MenuItem> */}
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
                        alt={row.thumbnail_image}
                        src={
                          row.thumbnail_image && row.thumbnail_image != null
                            ? `${IMAGE_PATH}${row.thumbnail_image}`
                            : `${IMAGE_PATH}placeholder.png`
                        }
                        style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    </TableCell>

                    <TableCell style={{ textAlign: 'center' }}>
                      {/* <img
                        alt={row.thumbnail_image}
                        src={
                          row.thumbnail_image && row.thumbnail_image != null
                            ? `${IMAGE_PATH}${row.thumbnail_image}`
                            : `${IMAGE_PATH}placeholder.png`
                        }
                        style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}
                      /> */}
                      <video
                        key={row.ads_id}
                        src={`${IMAGE_PATH}${row.video || 'placeholderVillage.png'}`}
                        style={{ width: '70px', height: '70px', borderRadius: '8px', cursor: 'pointer', borderRadius: '10%', objectFit: 'cover' }}
                        controls
                      // onClick={() => handleImageClick(`${IMAGE_PATH}${row.video || 'placeholderVillage.png'}`)}
                      ></video>
                    </TableCell>

                    <TableCell style={{ textAlign: 'center' }}>{ row.discount }</TableCell>

                    <TableCell style={{ textAlign: 'center' }}>{ row.discount * 10  }</TableCell>

                    <TableCell style={{ textAlign: 'center' }}>{row.createtime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p
              style={{ marginLeft: '26px', marginTop: '15px' }}
            >{`Showing ${Math.min(filterAdds.length > 0 ? page * rowsPerPage + 1 : 0, filterAdds.length)} to ${Math.min((page + 1) * rowsPerPage, filterAdds.length)} of ${filterAdds.length} entries`}</p>
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
                disabled={(page + 1) * rowsPerPage >= filterAdds.length}
                style={{ borderRadius: '4px', marginRight: '10px', background: 'whitesmoke' }}
              >
                {'>'}
              </button>
            </div>
          </div>

          <Modal
            show={ShowEditModal}
            onHide={() => {
              setShowEditModal(false), seteditPoints(''), setEditpointsError('');
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title style={{ fontSize: '17px' }}>Edit Ads </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleEdit}>
                <div className="mb-3">
                  <label htmlFor="editPoints" className="form-label">
                  Watch ads and earn cashback! For every 1 point, get 10 Kuwaiti Dinars (KWD).
                  </label>
                  <input
                    type="number"
                    value={editPoints}
                    onChange={(e) => {
                      seteditPoints(e.target.value);
                      setEditpointsError('');
                    }}
                    className="form-control"
                    id="editPoints"
                    placeholder="Enter points to get a cashback."
                    min={0}
                  />
                  {editpointsError && <p style={{ color: 'red' }}>{editpointsError}</p>}
                </div>

                <div className="mb-3">
                  <label htmlFor="categoryName" className="form-label">
                    Select Thumbnail Image
                  </label>
                  <input type="file" className="form-control" id="thumbnail_image" onChange={handleChangeEditImage} />
                  {editImageError && <p style={{ color: 'red' }}>{editImageError}</p>}
                </div>
                <div className="mb-3">
                  <label htmlFor="categoryName" className="form-label">
                    Select Ads Video
                  </label>
                  <input type="file" className="form-control" id="video" onChange={HandleChnageEditVideo} />
                  {editVideoError && <p style={{ color: 'red' }}>{editVideoError}</p>}
                </div>

                <Modal.Footer>
                  <Button variant="primary" className="btn btn-primary" type="submit">
                    Update
                  </Button>
                </Modal.Footer>
              </form>
            </Modal.Body>
          </Modal>

          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this Ads?</Modal.Body>
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
          <Modal.Title style={{ fontSize: '17px' }}>Add Ads</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={HandleAddAds}>
            <div className="mb-3">
              <label htmlFor="categoryName" className="form-label">
              Watch ads and earn cashback! For every 1 point, get 10 Kuwaiti Dinars (KWD).
              </label>
              <input
                type="number"
                className="form-control"
                id="categoryName"
                placeholder="Enter points to get a cashback."
                value={points}
                min={0}
                onChange={(e) => {
                  setPoints(e.target.value);
                  setPointsError('');
                }}
              />
              {pointsError && <p  className='mt-2' style={{ color: 'red' }}>{pointsError}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="categoryName" className="form-label">
                Select Thumbnail Image
              </label>
              <input type="file" className="form-control" id="thumbnail_image" onChange={handleChangeImage} />
              {imageError && <p  className='mt-2' style={{ color: 'red' }}>{imageError}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="categoryName" className="form-label">
                Select Ads Video
              </label>
              <input type="file" className="form-control" id="video" onChange={HandleChnageVideo} />
              {videoError && <p  className='mt-2' style={{ color: 'red' }}>{videoError}</p>}
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" className="btn btn-primary" type="submit" onClick={HandleAddAds}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageAds;
