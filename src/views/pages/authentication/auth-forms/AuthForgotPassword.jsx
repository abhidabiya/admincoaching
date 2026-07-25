import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios'; // Make sure to import axios

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import { API_URL, APP_PREFIX_PATH } from 'config/constant';

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthForgotPassword = ({ ...others }) => {
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();


  const closeErrorModal = () => {
    setShowErrorModal(false);
    setError('');
  };

  const handleSubmit = async (values) => {
    console.log('error',error)
    if (values.email=='') {
      setError('Please enter your email');
      return;
    }

    try {
      const checkResponse = await axios.post(`${API_URL}Check_admin_email`, { email: values.email });

      if (checkResponse.data.success) {
        setShowModal(true);
        // Email exists, proceed with sending reset link
        const resetResponse = await axios.post(`${API_URL}Admin_forget_password`, { email: values.email });

        setTimeout(() => {
          setShowModal(false);
          setError('');
          navigate(`${APP_PREFIX_PATH}/`);
        }, 1000);

        // console.log('Email sent successfully');
        setError('');
      } else {
        // Email doesn't exist or other error
        setError('Email address is not register with us, please try again');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Error checking or sending reset link:', error);
      setError('Something went wrong, please try again later');
      setShowErrorModal(true);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        })}
        onSubmit={handleSubmit}
      >
        {({  handleBlur, handleChange, handleSubmit, errors, touched }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid item sx={{ mb: 3 }} style={{ textAlign: 'center' }}>
              <h3 className="mb-3">Forgot Password</h3>
              <p>Enter your email and we'll send you an email to reset your password</p>
            </Grid>
            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">Enter your Email</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={email}
                name="email"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  setEmail(e.target.value);
                  setError('');
                }}
                label="Enter your Email"
                maxLength={30}
                inputProps={{}}
              />
                {errors.email && touched.email && (
          <FormHelperText error>{errors.email}</FormHelperText>
        )}
            </FormControl>

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  fullWidth
                  size="large"
                  type="submit"
                  style={{ fontWeight: '600', display: 'flex', justifyContent: 'center', marginTop: '10px', color: '#fff' }}
                  variant="contained"
                  color="secondary"
                >
                  Send
                </Button>
              </AnimateButton>
              <Link
                to={`${APP_PREFIX_PATH}/`}
                color="secondary"
                aria-label="logo"
                sx={{ textDecoration: 'none', cursor: 'pointer' }}
                style={{ fontWeight: '600', display: 'flex', justifyContent: 'center', marginTop: '10px' , color:"secondary", textDecoration: "none" }}
              >
                Back? Login
              </Link>
            </Box>
          </form>
        )}
      </Formik>
      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show"
      
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'block',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div className="modal-dialog  pwd-modal modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title" id="exampleModalLongTitle">
                  Forgot Password
                </h3>
              </div>
              <div className="modal-body">
                <p>Password reset link has been sent Successfully</p>
              </div>
              <div className="modal-footer">{/* Optionally add a Save changes button */}</div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div
          className="modal fade show"
          // style={{ display: 'block' }}
          tabIndex="-1"
          role="dialog"
          aria-labelledby="errorModalTitle"
          aria-hidden="true"
          style={{
            // display: 'block' ,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div className="modal-dialog modal-dialog-centered pwd-modal " role="document"    >
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title" id="errorModalTitle">
                  Error
                </h3>
              </div>
              <div className="modal-body">
                <p>{error}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeErrorModal}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthForgotPassword;
