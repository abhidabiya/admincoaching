import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';
import MainCard from 'ui-component/cards/MainCard';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import Img from 'assets/images/image3.jpg';
import { useParams } from 'react-router-dom';
import { API_URL, IMAGE_PATH } from 'config/constant';
import axios from 'axios';
import {decode as base64_decode} from 'base-64';
const ViewCenter = () => {
  const { donation_center_id } = useParams();
  const decode_donation_center_id = base64_decode(donation_center_id);
  const [show, setShow] = useState(false);
  const [homes_data, setDonationCenterDetails] = useState([]);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [showImagePopup, setShowImagePopup] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  var fetchData = () => {
    console.log('donation_center_id : ', decode_donation_center_id);

    axios
      .get(`${API_URL}get_center_details/${decode_donation_center_id}`)
      .then((response) => {
        if (response.data.success) {
          setDonationCenterDetails(response.data.center_arr[0]);
          console.log('setTransaction', response.data.center_arr[0]);
        } else {
          console.error('Error fetching store details:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching store details:', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageClick = (imageUrl) => {
    setEnlargedImage(imageUrl);
    setShowImagePopup(true);
  };

  const handleCloseImage = () => {
    setEnlargedImage(null);
    setShowImagePopup(false);
  };

  return (
    <div>
      <div>
        <MainCard>
          <Row>
            <Col lg={12}>
              <div className="profile">
                <div className="user-detail row ">
                  <div className="col-lg-12">
                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{}}>Title :</p>
                      </div>
                      <div className="col-lg-9">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{homes_data.title ? homes_data.title : 'NA'}</p>
                      </div>
                    </div>
                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{}}>created On :</p>
                      </div>
                      <div className="col-lg-9">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{homes_data.createtime ? homes_data.createtime : 'NA'}</p>
                      </div>
                    </div>

                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{}}>Address :</p>
                      </div>
                      <div className="col-lg-9">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{homes_data.location ? homes_data.location : 'NA'}</p>
                      </div>
                    </div>

                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{}}>Description : </p>
                      </div>
                      <div className="col-lg-9">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' ,textAlign:'justify'}}>{homes_data.description ? homes_data.description : 0}</p>
                      </div>
                    </div>

                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{}}>Donation Center Image : </p>
                      </div>
                      <div className="col-lg-9">
                        <div className=" row">
                          <div key={1} className="col-lg-4  mb-3">
                            <img
                              src={homes_data.image ? `${IMAGE_PATH}${homes_data.image}` : `${IMAGE_PATH}image-1720095670109.png`}
                              alt={`Image ${1 + 1}`}
                              style={{ width: '100%', height: '11rem', borderRadius: '5%', cursor: 'pointer', objectFit: 'cover' }}
                              onClick={() =>
                                handleImageClick(
                                  homes_data.image ? `${IMAGE_PATH}${homes_data.image}` : `${IMAGE_PATH}image-1720095670109.png`
                                )
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleImageClick(
                                    homes_data.image ? `${IMAGE_PATH}${homes_data.image}` : `${IMAGE_PATH}image-1720095670109.png`
                                  );
                                }
                              }}
                              role="button"
                              tabIndex={0}
                            />
                          </div>

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
                                alt="Enlarged Clinic Image"
                                className="enlarged-image"
                                style={{ width: '30rem', height: '30rem', objectFit: 'cover' }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
        
          </Row>
        </MainCard>
        <Modal show={show} onHide={handleClose} className="d-flex justify-content-center align-items-center mt-5">
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <img src={Img} alt="Preview" style={{ width: '100%', height: 'auto', margin: 'auto', display: 'flex' }} />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default ViewCenter;
