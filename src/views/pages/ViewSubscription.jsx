import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';
import MainCard from 'ui-component/cards/MainCard';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import Img from 'assets/images/image3.jpg';
import { useParams } from 'react-router-dom';
import { API_URL, IMAGE_PATH } from 'config/constant';
import axios from 'axios';

import { decode as base64_decode } from 'base-64';

const ViewSubscription = () => {
  const { subscription_id } = useParams();
  const decode_subscription_id = base64_decode(subscription_id);
  const [subscription_data, setSubscriptionDetail] = useState([]);
  var fetchData = () => {
    console.log('subscription_id : ', subscription_id);

    axios
      .get(`${API_URL}view_subscription/${decode_subscription_id}`)
      .then((response) => {
        if (response.data.success) {
          setSubscriptionDetail(response.data.result);
          console.log('setTransaction', response.data.result);
        } else {
          console.error('Error fetching subscription details:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching subscription details:', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div>
        <MainCard title="Subscription Details">
          <Row>
            <Col lg={12}>
              <div className="profile">
                <div className="user-detail row ">
                  <div className="col-lg-12">
                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{}}>Subscription Type :</p>
                      </div>
                      <div className="col-lg-9">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{subscription_data?.subscription_type_filter || 'NA'}</p>
                      </div>
                    </div>
                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{}}>Amount (In Dollar) : </p>
                      </div>
                      <div className="col-lg-9">
                        <p style={{ fontWeight: '500', marginLeft: '50px;', textAlign: 'justify' }}>{subscription_data?.amount || 0} $</p>
                      </div>
                    </div>

                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{}}>Duration (In days) :</p>
                      </div>
                      <div className="col-lg-9">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{subscription_data?.duration || 'NA'} Day</p>
                      </div>
                    </div>

                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{}}>Create Date & Time :</p>
                      </div>
                      <div className="col-lg-9">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{subscription_data?.createtime || 'NA'}</p>
                      </div>
                    </div>

                    <div className="row address">
                      <div className="col-lg-3">
                        <p style={{}}>Description : </p>
                      </div>
                      <div className="col-lg-9">
                        <p style={{ fontWeight: '500', marginLeft: '50px;', textAlign: 'justify' }}>
                          {subscription_data?.description || 'NA'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </MainCard>
      </div>
    </div>
  );
};

export default ViewSubscription;
