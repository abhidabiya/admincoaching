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
const ViewProduct = () => {
  const { product_id } = useParams();
  const decode_product_id = base64_decode(product_id);
  const [show, setShow] = useState(false);
  const [product_data, setProductDetail] = useState([]);
  const [product_image, setProductImageDetail] = useState([]);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [showImagePopup, setShowImagePopup] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  var fetchData = () => {
    console.log('product_id : ', product_id);

    axios
      .get(`${API_URL}get_product_data/${decode_product_id}`)
      .then((response) => {
        if (response.data.success) {
          setProductDetail(response.data.product_Arr[0]);
          console.log('setTransaction', response.data.product_Arr[0]);
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

  useEffect(() => {
    axios
      .get(`${API_URL}get_product_image/${decode_product_id}`)
      .then((response) => {
        if (response.data.success) {
          console.log('Image Response:', response.data.product_image_arr);
          setProductImageDetail(response.data.product_image_arr);
        } else {
          console.error('Error fetching image details:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching image details:', error);
      });
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
        <MainCard title="Product Details">
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
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{product_data.title ? product_data.title : 'NA'}</p>
                      </div>
                    </div>
                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{}}>Category Name :</p>
                      </div>
                      <div className="col-lg-9">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>
                          {product_data.category_name ? product_data.category_name : 'NA'}
                        </p>
                      </div>
                    </div>
                    {product_data.category_id == 3 ? (
                      <>
                        <div className="row address">
                          <div className="col-lg-3">
                            <p style={{}}>Quantity : </p>
                          </div>
                          <div className="col-lg-9">
                            <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{product_data.quantity ? product_data.quantity : 0}</p>
                          </div>
                        </div>
                        <div className="row address">
                          <div className="col-lg-3">
                            <p style={{}}>Mg : </p>
                          </div>
                          <div className="col-lg-9">
                            <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{product_data.mg ? product_data.mg : 0}</p>
                          </div>
                        </div>

                        <div className="row address">
                          <div className="col-lg-3">
                            <p style={{}}>Expiry Date : </p>
                          </div>
                          <div className="col-lg-9">
                            <p style={{ fontWeight: '500', marginLeft: '50px;' }}>
                              {product_data.expiry_date ? product_data.expiry_date : 'NA'}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : null}

                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{}}>Status : </p>
                      </div>
                      <div className="col-lg-9">
                        <p  style={{
                        backgroundColor: product_data.complete === 1 ? '#009640' : '#FFC561',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '8px',
                        display: 'inline-block',
                        textTransform: 'capitalize',
                       
                      }}>{product_data.complete === 1 ? 'completed' : 'Pending'}</p>
                      </div>
                    </div>

                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{}}>Create Date & Time :</p>
                      </div>
                      <div className="col-lg-9">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{product_data.createtime ? product_data.createtime : 'NA'}</p>
                      </div>
                    </div>
                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{}}>description : </p>
                      </div>
                      <div className="col-lg-9">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>
                          {product_data.description ? product_data.description : 'NA'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <Col xl={12}>
              <h6 className="mc-divide-title mb-4 mt-3">{'product_images'}</h6>
              <div className=" row">
                {product_image && product_image.length > 0 ? (
                  product_image.map((imageObj, index) => (
                    <div key={index} className="col-lg-2  mb-3">
                      <img
                        src={imageObj.image ? `${IMAGE_PATH}${imageObj.image}` : `${IMAGE_PATH}image-1720095670109.png`}
                        alt={`Clinic Image ${index + 1}`}
                        style={{ width: '100%', height: '9rem', borderRadius: '5%', cursor: 'pointer', objectFit: 'cover' }}
                        onClick={() =>
                          handleImageClick(imageObj.image ? `${IMAGE_PATH}${imageObj.image}` : `${IMAGE_PATH}image-1720095670109.png`)
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleImageClick(imageObj.image ? `${IMAGE_PATH}${imageObj.image}` : `${IMAGE_PATH}image-1720095670109.png`);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      />
                    </div>
                  ))
                ) : (
                  <p>{'no_images_available'}</p>
                )}
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

export default ViewProduct;
