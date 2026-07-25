import { React, useEffect, useState } from 'react';
import axios from 'axios';

// material-ui
import { Card, Grid, Typography } from '@mui/material';

import 'bootstrap/dist/css/bootstrap.min.css';

import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from 'config/constant';
// project import

// import { gridSpacing } from 'config.js';
import Chart from 'react-apexcharts';

// ==============================|| SAMPLE PAGE ||============================== //

const BusinessClaimAnaReport = () => {
  const [monthlyDetails, setmonthlyDetails] = useState([]);
  const [yearlyDetails, setyearlyDetails] = useState([]);

  const fetchManageUserDetails = async () => {
    try {
      //    var data={action:"get_users_analytical_report"};
      const response = await axios.get(`${API_URL}/business_analytical_report_claims?action=get_business_analytical_report`);
      const monDetail = response.data.data.month_report_arr;

      const yearDetail = response.data.data.year_report_arr;

      var newVariable = [];
      monDetail.forEach(function (obj) {
        newVariable.push(obj['month_user_arr']);
      });

      var newYearVariable = [];
      yearDetail.forEach(function (obj) {
        newYearVariable.push(obj['year_user_arr']);
      });

      setmonthlyDetails(newVariable);
      setyearlyDetails(newYearVariable);
    } catch (error) {
      console.error('Error fetching manage user details:', error);
    }
  };
  useEffect(() => {
    fetchManageUserDetails();
  }, []);

  const seriesmonthly = [
    {
      name: 'Total Claims Business ',
      data: monthlyDetails
    }
  ];
  const seriesyearly = [
    {
      name: 'Total Claims Business ',
      data: yearlyDetails
    }
  ];
  // Monthly chart configuration
  const monthly = {
    chart: {
      height: 350,
      type: 'bar',
      zoom: {
        enabled: false
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        distributed: true
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yaxis: {
      title: {
        text: 'Claims  Business'
      }
    },

    fill: {
      colors: ['#19253D']
    },
    legend: {
      show: false
    },
    colors: ['#000000']
  };

  // Yearly chart configuration
  const yearly = {
    chart: {
      height: 380,
      type: 'bar',
      zoom: {
        enabled: false
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        distributed: true
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['2020', '2021', '2022', '2023', '2024', '2025']
    },
    yaxis: {
      title: {
        text: 'Claims  Business'
      }
    },

    fill: {
      colors: ['#19253D']
    },
    legend: {
      show: false
    },
    colors: ['#000000']
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
          Business Claims Analytical Reports
        </p>
      </div>
      <Typography
        className="d-flex justify-content-center"
        style={{ marginTop: '30px', marginBottom: '30px', color: '#000' }}
        variant="h3"
        gutterBottom
      >
        2025 Monthly Analytical Reports of Business Claims
      </Typography>

      <Grid container>
        <Grid item xs={12} md={12}>
          <Card sx={{ marginTop: '10px' }}>
            <div className="chart p-4">
              {/* ApexCharts component */}
              <Chart options={monthly} series={seriesmonthly} type="bar" height={350} />
            </div>
          </Card>
        </Grid>

        <Typography className="" style={{ margin: ' 40px auto 30px', color: '#000' }} variant="h3" gutterBottom>
          2025 Yearly Analytical Reports of Business Claims
        </Typography>

        <Grid item xs={12} md={12}>
          <Card sx={{ marginTop: '10px' }}>
            <div className="chart p-4">
              {/* ApexCharts component */}
              <Chart options={yearly} series={seriesyearly} type="bar" height={350} />
            </div>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default BusinessClaimAnaReport;
