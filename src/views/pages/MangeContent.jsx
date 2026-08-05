import React, { useState, useMemo, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';
import MainCard from 'ui-component/cards/MainCard';
import { API_URL } from 'config/constant';
import { Modal } from 'react-bootstrap';

const ManageContent = () => {
  const options = [
    'bold',
    'italic',
    '|',
    'ul',
    'ol',
    '|',
    'font',
    'fontsize',
    '|',
    'outdent',
    'indent',
    'align',
    '|',
    'hr',
    '|',
    'fullsize',
    'brush',
    '|',
    'table',
    'link',
    '|',
    'undo',
    'redo'
  ];

  const [about, setAbout] = useState('');
  const [terms, setTerms] = useState('');
  const [privacy, setPrivacy] = useState('');
  const [android, setAndroid] = useState('');
  const [ios, setIos] = useState('');
  const [share, setShare] = useState('');
  const [value, setValue] = useState(0);

  const [toastMessage, setToastMessage] = useState('');
  const [emptycontent, setEmptyContent] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [content, setContent] = useState('');

  const contentTypes = {
    'About Us': 0,
    'Privacy Policy': 1,
    'Terms & Conditions': 2,
    'android app url': 4,
    'ios app url': 3,
    'Share Message': 5
  };

  useEffect(() => {
    fetchContent('About Us', setAbout);
    fetchContent('Terms & Conditions', setTerms);
    fetchContent('Privacy Policy', setPrivacy);
    fetchContent('android app url', setAndroid);
    fetchContent('ios app url', setIos);
    fetchContent('Share Message', setShare);
  }, []);

  const fetchContent = (contentType) => {
    console.log(contentType, 'contentType');
    const contentTypeCode = contentTypes[contentType];
    console.log(contentTypeCode, 'contentType');
    axios
      .get(`${API_URL}fetchaboutcontent?contentType=${contentTypeCode}`)
      .then((response) => {
        setContent(response.data.res);
        // const contentValue = response.data.success && response.data.res && response.data.res.length > 0 ? response.data.res[0].content : '';

        // Set the content for the selected content type
        switch (contentType) {
          case 'About Us':
            setAbout(response.data.res[0].content);
            break;
          case 'Privacy Policy':
            setPrivacy(response.data.res[0].content);
            break;
          case 'Terms & Conditions':
            setTerms(response.data.res[0].content);
            break;
          case 'android app url':
            setAndroid(response.data.res[0].content);
            break;
          case 'ios app url':
            setIos(response.data.res[0].content);
            break;
          case 'Share Message':
            setShare(response.data.res[0].content);
            break;
          default:
            break;
        }
      })
      .catch((error) => {
        console.error('Error fetching content for', contentType, error);
      });
  };

  const config1 = useMemo(
    () => ({
      readonly: false,
      placeholder: '',
      defaultActionOnPaste: 'insert_as_html',
      defaultLineHeight: 1.2,
      enter: 'div',
      buttons: options,
      buttonsMD: options,
      buttonsSM: options,
      buttonsXS: options,
      statusbar: false,
      sizeLG: 900,
      sizeMD: 700,
      sizeSM: 400,
      toolbarAdaptive: false
    }),
    []
  );

  const handleUpdateContent = (contentType) => {
    let contentStateToUpdate = '';
    console.log(contentStateToUpdate, 'new ', contentType);
    switch (contentType) {
      case 'About Us':
        contentStateToUpdate = about;
        break;
      case 'Terms & Conditions':
        contentStateToUpdate = terms;
        break;
      case 'Privacy Policy':
        contentStateToUpdate = privacy;
        break;
      case 'android app url':
        contentStateToUpdate = android;
        break;
      case 'ios app url':
        contentStateToUpdate = ios;
        break;
      case 'Share Message':
        contentStateToUpdate = share;
        break;
      default:
        contentStateToUpdate = '';
    }

    if (!contentStateToUpdate.trim()) {
      setEmptyContent('This field could not be empty');
      return;
    } else {
      setEmptyContent('');
    }
    console.log('contentStateToUpdate', contentTypes[contentType]);
    axios
      .post(`${API_URL}/updateContent`, {
        contentType: contentTypes[contentType],
        content: contentStateToUpdate,
        lang: 'english'
      })
      .then(() => {
        // console.log(`${contentType} updated successfully`);

        setToastMessage(`${contentType} updated successfully`);
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2000);
        setEmptyContent('');
      })
      .catch((error) => {
        console.log(error);
        console.log('Error occurred while updating');
      });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div className="col-xl-12" style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '10px', marginBottom: '20px' }}>
        <p
          style={{
            // margin: '2px',
            fontSize: '1.25rem',
            color: '#121926',
            fontWeight: '600',
            fontFamily: 'Poppins',
            lineHeight: '1.167',
            fontWeight: ' 500',
            marginBottom: ' 5px'
          }}
        >
          Manage Content 
        </p>
      </div>{' '}
      <div>
        <MainCard >
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="secondary"
            aria-label="content management tabs"
            variant="fullWidth"
          >
            <Tab label="About Us" />
            <Tab label="Terms & Conditions" />
            <Tab label="Privacy Policy" />

            <Tab label="Android App URL" />
            <Tab label="IOS App URL" />
            <Tab label="Share Message" />
          </Tabs>

          {value === 0 && (
            <div className="mt-4">
              <Typography variant="body1" gutterBottom >
                About us
              </Typography>
              <JoditEditor
                value={about}
                config={config1}
                onChange={(htmlString) => {
                  setAbout(htmlString), setEmptyContent('');
                }}
              />
              <br />
              <p style={{ color: 'red' }}>{emptycontent}</p>
              <button className="btn mt-2" onClick={() => handleUpdateContent('About Us')} style={{ backgroundColor: '#3268f1', color: '#fff' }}>
                Update
              </button>
            </div>
          )}

          {value === 1 && (
            <div className="mt-4">
              <Typography variant="body1" gutterBottom>
                Terms & Conditions
              </Typography>
              <JoditEditor
                value={terms}
                config={config1}
                onChange={(htmlString) => {
                  setTerms(htmlString), setEmptyContent('');
                }}
              />
              <br />
              <p style={{ color: 'red' }}>{emptycontent}</p>
              <button className="btn mt-2 btn-primary" onClick={() => handleUpdateContent('Terms & Conditions')}>
                Update
              </button>
            </div>
          )}

          {value === 2 && (
            <div className="mt-4">
              <Typography variant="body1" gutterBottom>
                Privacy Policy
              </Typography>
              <JoditEditor
                value={privacy}
                config={config1}
                onChange={(htmlString) => {
                  setPrivacy(htmlString);
                  setEmptyContent('');
                }}
              />
              <br />
              <p style={{ color: 'red' }}>{emptycontent}</p>
              <button className="btn mt-2 btn-primary" onClick={() => handleUpdateContent('Privacy Policy')}>
                Update
              </button>
            </div>
          )}

          {value === 3 && (
            <div className="mt-4">
              <Typography variant="body1" gutterBottom>
                Android App URL
              </Typography>
              <input
                type="text"
                className="form-control"
                value={android}
                onChange={(e) => {
                  setAndroid(e.target.value), setEmptyContent('');
                }}
                placeholder="Enter android app url"
              />

              <br />
              <p style={{ color: 'red' }}>{emptycontent}</p>
              <button className="btn mt-2 btn-primary" onClick={() => handleUpdateContent('android app url')}>
                Update
              </button>
            </div>
          )}

          {value === 4 && (
            <div className="mt-4">
              <Typography variant="body1" gutterBottom>
                IOS App URL
              </Typography>
              <input
                type="text"
                className="form-control"
                value={ios}
                onChange={(e) => {
                  setIos(e.target.value), setEmptyContent('');
                }}
                placeholder="Enter ios app url"
              />

              <br />
              <p style={{ color: 'red' }}>{emptycontent}</p>
              <button className="btn mt-2 btn-primary" onClick={() => handleUpdateContent('ios app url')}>
                Update
              </button>
            </div>
          )}
          {value === 5 && (
            // <div className="mt-4">
            //   <Typography variant="body1" gutterBottom>
            //     Share App
            //   </Typography>
            //   <JoditEditor
            //     value={share}
            //     config={config1}
            //     onChange={(htmlString) => {
            //       setShare(htmlString),
            //       setEmptyContent('');
            //     }}
            //   />
            //   <br />
            //   <p style={{ color: 'red' }}>{emptycontent}</p>
            //   <button className="btn mt-2 btn-primary" onClick={() => handleUpdateContent('Share Message')}>
            //     Update
            //   </button>
            // </div>
            <div className="mt-4">
              <Typography variant="body1" gutterBottom>
                Share App
              </Typography>
              <textarea
                rows={6}
                type="text"
                className="form-control"
                value={share}
                onChange={(e) => {
                  setShare(e.target.value), setEmptyContent('');
                }}
                placeholder="Enter Share App Url"
              />

              <br />
              <p style={{ color: 'red' }}>{emptycontent}</p>
              <button className="btn mt-2 btn-primary" onClick={() => handleUpdateContent('Share Message')}>
                Update
              </button>
            </div>
          )}
        </MainCard>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header>
            <Modal.Title>Update</Modal.Title>
          </Modal.Header>
          <Modal.Body>{toastMessage}</Modal.Body>
        </Modal>
      </div>
    </>

    // </div>
  );
};

export default ManageContent;
