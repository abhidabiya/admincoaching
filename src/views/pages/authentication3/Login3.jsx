import { Link } from 'react-router-dom';

// material-ui
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthLogin from '../authentication/auth-forms/AuthLogin';
import Logo from 'ui-component/Logo';
import  APP_LOGO  from '../../../assets/images/logo.png';

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
  
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 60px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} justifyContent="center" alignItems="center" >
                  <Grid item sx={{ mb: 0 }} >
                    <Link to="#" aria-label="logo" style={{ margin: 'auto' }} >
                    <img src={APP_LOGO} alt="App Logo Abhi-3" style={{ width: '130px', height: 'auto', borderRadius: "15px" }} />
                    </Link>
                  </Grid>


                  <Grid item xs={12}>
                    <AuthLogin />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>

      </Grid>
    </AuthWrapper1>
  );
};

export default Login;
