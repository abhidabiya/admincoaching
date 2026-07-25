import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';
import MainCard from 'ui-component/cards/MainCard';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import Img from 'assets/images/image3.jpg';
import { useParams } from 'react-router-dom';
import { API_URL, IMAGE_PATH } from 'config/constant';
import axios from 'axios';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

import { decode as base64_decode } from 'base-64';

const ViewCusQuestions = () => {
  const { customer_id } = useParams();
  const decode_user_id = base64_decode(customer_id);
  const [show, setShow] = useState(false);
  const [question_data, setQuestionDetail] = useState([]);
  const [customer_data, setCustomerData] = useState([]);
  const [clamied_data, setClamiedUserData] = useState([]);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const handleClose = () => setShow(false);

  var fetchData = () => {
    axios
      .get(`${API_URL}get_question_details/${decode_user_id}`)
      .then((response) => {
        if (response.data.success) {
          setQuestionDetail(response.data.question_arr);
          console.log('setTransaction', response.data.question_arr);
        } else {
          console.error('Error fetching question details:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching store details:', error);
      });
  };

  var fetchUseData = async () => {
    axios
      .get(`${API_URL}get_customer_detail/${decode_user_id}`)
      .then(async (response) => {
        setCustomerData(response.data.user_arr[0]);
        await fetchClamiedCustomerData(response.data.user_arr[0].user_id);
        console.log('response.data.user_arr : ', response.data.user_arr);
      })
      .catch((error) => {
        console.error('Error fetching user count details:', error);
      });
  };

  var fetchClamiedCustomerData = (business_id) => {
    axios
      .get(`${API_URL}get_customer_clamied?customer_id=${decode_user_id}`)
      .then((response) => {
        setClamiedUserData(response.data.clamied_data);
        console.log('response.data.clamied_data : ', response.data.clamied_data);
      })
      .catch((error) => {
        console.error('Error fetching user count details:', error);
      });
  };

  useEffect(() => {
    fetchUseData();
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

  function handleUserAction(action, customer_id) {
    axios
      .post(`${API_URL}approve_customer_status`, { user_id: customer_id })
      .then((response) => {
        setModalShow(true)
        fetchUseData();
        fetchData();
      })
      .catch((error) => {
        console.error('Error fetching user count details:', error);
      });
  }

  return (
    <div>
      <div>
        <MainCard title="Customer Details">
          <Row>
            <Col lg={12}>
              <div className="profile">
                <div className="user-detail row ">
                  <div className="col-lg-12">
                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{}}>First Name :</p>
                      </div>
                      <div className="col-lg-9">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{customer_data?.f_name || 'NA'}</p>
                      </div>
                    </div>

                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{}}>Last Name :</p>
                      </div>
                      <div className="col-lg-9">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{customer_data?.l_name || 'NA'}</p>
                      </div>
                    </div>

                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{}}>Mobile No. : </p>
                      </div>
                      <div className="col-lg-9">
                        <p style={{ fontWeight: '500', marginLeft: '50px;', textAlign: 'justify' }}>{customer_data?.mobile || 'NA'}</p>
                      </div>
                    </div>

                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{}}>Email : </p>
                      </div>
                      <div className="col-lg-9">
                        <p style={{ fontWeight: '500', marginLeft: '50px;', textAlign: 'justify' }}>{customer_data?.email || 'NA'}</p>
                      </div>
                    </div>

                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{}}>Address : </p>
                      </div>
                      <div className="col-lg-9">
                        <p style={{ fontWeight: '500', marginLeft: '50px;', textAlign: 'justify' }}>{customer_data?.address || 'NA'}</p>
                      </div>
                    </div>

                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{}}>Claim Date & Time :</p>
                      </div>
                      <div className="col-lg-9">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{customer_data?.formatted_createtime || 'NA'}</p>
                      </div>
                    </div>
                    {question_data.length > 0
                      ? question_data.map((result, index) => (
                          <div key={index}>
                            <div className="row address">
                              <div className="col-lg-3">
                                <p style={{ fontWeight: '600' }}>Question :</p>
                              </div>
                              <div className="col-lg-9">
                                <p style={{ fontWeight: '600' }}>{result.question ? result.question : 'NA'}</p>
                              </div>
                            </div>
                            <div className="row address">
                              <div className="col-lg-3">
                                <p style={{ fontWeight: '600' }}>Answer :</p>
                              </div>
                              <div className="col-lg-9">
                                {result.question_type === 0 ? (
                                  <p style={{ fontWeight: '600' }}>
                                    {result.answer ? (result.answer === 0 ? 'Yes' : 'No') : 'NA'}{' '}
                                    {result.answer_2 != null ? `, ${result.answer_2}` : ''}
                                  </p>
                                ) : result.question_type === 1 ? (
                                  <p style={{ fontWeight: '600' }}>{result.answer_2 ? result.answer_2 : 'NA'}</p>
                                ) : (
                                  <p style={{ fontWeight: '600' }}>{result.date ? result.date : 'NA'}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      : null}
                    {clamied_data.length > 0 ? (
                      <>
                        <div className="row address">
                          <div className="col-lg-3">
                            <p style={{ fontWeight: '700', marginLeft: '50px;' }}>Claimed By Customer</p>
                          </div>
                        </div>
                        <div className="row address">
                          <div className="col-lg-3">
                            <p style={{}}>Claim Description :</p>
                          </div>
                          <div className="col-lg-9">
                            <p style={{ fontWeight: '500', marginLeft: '50px;' }}>
                              {clamied_data.length > 0 && clamied_data[0].description ? clamied_data[0].description : 'NA'}
                            </p>
                          </div>
                        </div>
                        <div className="row address">
                          <div className="col-lg-3">
                            <p style={{}}>Claim Status :</p>
                          </div>
                          <p
                            style={{
                              borderRadius: '25px',
                              backgroundColor: clamied_data[0].approved_status == 1 ? '#009640' : '#FF2222',
                              padding: '0px 15px',
                              width: '100px',
                              height: '20px',
                              color: '#fff',
                              fontWeight: '500',
                              marginLeft: '14px'
                            }}
                          >
                            {clamied_data[0].approved_status == 1 ? 'Approved' : 'Pending'}
                          </p>
                          {clamied_data[0].approved_status == 0 ? (
                            <>
                              {' '}
                              <div
                                
                                className="material-icons deactive"
                                style={{
                                  // background: '#d4ffd4',
                                  color: '#000',
                                  lineHeight: '15px',
                                  marginLeft: "363px",
                                  marginTop:"-38px"
                                }}
                                onClick={() => handleUserAction('approved', clamied_data[0].customer_id)}
                              >
                               Approve Claim <ToggleOffIcon />
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="row address">
                          <div className="col-lg-3">
                            <p style={{}}>Claim document :</p>
                          </div>

                          <div className="col-lg-9">
                            <p style={{ fontWeight: '500', textAlign: 'justify' }}>
                              {clamied_data[0].file_type !== null ? (
                                clamied_data[0].file_type === 0 ? (
                                  <img
                                    src={
                                      clamied_data[0].file ? `${IMAGE_PATH}${clamied_data[0].file}` : `${IMAGE_PATH}placeholderVillage.png`
                                    }
                                    alt="Profile"
                                    style={{ width: '150px', height: '150px', borderRadius: '1%', objectFit: 'cover' }}
                                    onClick={() =>
                                      handleImageClick(
                                        clamied_data[0].file
                                          ? `${IMAGE_PATH}${clamied_data[0].file}`
                                          : `${IMAGE_PATH}placeholderVillage.png`
                                      )
                                    }
                                  />
                                ) : clamied_data[0].file_type === 1 ? (
                                  <a
                                    href={`${IMAGE_PATH}${clamied_data[0].file}`}
                                    download="DeletedDocument.pdf"
                                    style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
                                  >
                                    View PDF
                                  </a>
                                ) : (
                                  'NA'
                                )
                              ) : (
                                'NA'
                              )}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </MainCard>
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
              style={{ width: '30rem', height: '30rem', objectFit: 'cover' }}
            />
          </div>
        )}

        <Modal show={modalShow} onHide={() => setModalShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Approved</Modal.Title>
          </Modal.Header>
          <Modal.Body>Customer Claim Approved Successfully</Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
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

export default ViewCusQuestions;
