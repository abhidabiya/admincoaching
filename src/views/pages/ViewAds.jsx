/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';
import MainCard from 'ui-component/cards/MainCard';
import { Row, Col, Modal } from 'react-bootstrap';
import Img from 'assets/images/image3.jpg';
import { useParams } from 'react-router-dom';
import { API_URL, IMAGE_PATH } from 'config/constant';
import axios from 'axios';
import { decode as base64_decode } from 'base-64';

const ViewAds = () => {
  const { ads_id } = useParams();
  const decode_ads_id = base64_decode(ads_id);
  const [show, setShow] = useState(false);
  const [ads_data, setAdsDetails] = useState([]);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [showImagePopup, setShowImagePopup] = useState(false);

  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);
  var fetchData = () => {
    console.log('ads_id : ', decode_ads_id);

    axios
      .get(`${API_URL}get_ads_details?ads_id=${decode_ads_id}`)
      .then((response) => {
        if (response.data.success) {
          setAdsDetails(response.data.add_arr);
          console.log('setTransaction', response.data.add_arr);
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
    <>
      {' '}
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
          View Ads Details
        </p>
      </div>
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
                          <p style={{}}>Point :</p>
                        </div>
                        <div className="col-lg-9">
                          <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{ads_data.discount ? ads_data.discount : 'NA'}</p>
                        </div>
                      </div>
                      <div className="row address">
                        <div className="col-lg-3">
                          <p style={{}}>Create Date & Time :</p>
                        </div>
                        <div className="col-lg-9">
                          <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{ads_data.createtime ? ads_data.createtime : 'NA'}</p>
                        </div>
                      </div>

                      <div className="row address">
                        <div className="col-lg-3">
                          <p style={{}}>Thumbnail Image : </p>
                        </div>
                        <div className="col-lg-9">
                          <div className=" row">
                            <div key={1} className="col-lg-4  mb-3">
                              <img
                                src={
                                  ads_data.thumbnail_image
                                    ? `${IMAGE_PATH}${ads_data.thumbnail_image}`
                                    : `${IMAGE_PATH}placeholderVillage.png`
                                }
                                alt={`Image ${1 + 1}`}
                                style={{
                                  width: '309px',
                                  height: '11rem',
                                  borderRadius: '5%',
                                  cursor: 'pointer',
                                  objectFit: 'cover'
                                }}
                                onClick={() =>
                                  handleImageClick(
                                    ads_data.thumbnail_image
                                      ? `${IMAGE_PATH}${ads_data.thumbnail_image}`
                                      : `${IMAGE_PATH}placeholderVillage.png`
                                  )
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleImageClick(
                                      ads_data.image ? `${IMAGE_PATH}${ads_data.thumbnail_image}` : `${IMAGE_PATH}placeholderVillage.png`
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

                      <div className="row address">
                        <div className="col-lg-3">
                          <p style={{}}>Video :</p>
                        </div>
                        <div className="col-lg-9">
                          <p style={{ fontWeight: '500', marginLeft: '50px;' }}>
                            <video
                              key={ads_data.ads_id}
                              src={`${IMAGE_PATH}${ads_data.video || 'placeholderVillage.png'}`}
                              style={{ width: '309px', height: '177px', borderRadius: '8px', cursor: 'pointer' }}
                              controls
                              onClick={() => handleImageClick(`${IMAGE_PATH}${ads_data.video || 'placeholderVillage.png'}`)}
                            >
                            </video>
                          </p>
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
    </>
  );
};

export default ViewAds;
