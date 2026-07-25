import { Link } from 'react-router-dom';

// material-ui
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthForgotPassword from '../authentication/auth-forms/AuthForgotPassword';
import Logo from 'ui-component/Logo';
import  APP_LOGO  from '../../../assets/images/logo.png';


// ================================|| AUTH3 - LOGIN ||================================ //

const Forgotpassword = () => {
    const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} justifyContent="center" alignItems="center" >
                                    <Grid item sx={{ mb: 0 }} >
                                        <Link to="#" aria-label="logo" style={{ margin: 'auto' }} >
                                        <img src={APP_LOGO} alt="App Logo Abhi-2" style={{ width: '130px', height: 'auto', borderRadius: "15px" }}  />
                                        </Link>
                                    </Grid> 


                                    <Grid item xs={12}>
                                        <AuthForgotPassword />
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

export default Forgotpassword;
