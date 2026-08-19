
import { React, useEffect, useState } from 'react';
import axios from 'axios';

// material-ui
import { Card, Grid, Typography } from '@mui/material';

import 'bootstrap/dist/css/bootstrap.min.css';

import { API_URL } from 'config/constant';

import Chart from 'react-apexcharts';

// ==============================|| USER ANALYTICAL REPORT ||============================== //

const UserAnaReport = () => {
  const [monthlyDetails, setmonthlyDetails] = useState([]);
  const [yearlyDetails, setyearlyDetails] = useState([]);
  const [yearlyCategories, setYearlyCategories] = useState([]);

  // ==============================
  // YEAR SETTINGS
  // ==============================

  const startYear = 2026;
  const totalYears = 7;

  const currentYear = new Date().getFullYear();

  // ==============================
  // FETCH ANALYTICAL REPORT DATA
  // ==============================

  const fetchManageUserDetails = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/users_analytical_report?action=get_users_analytical_report`
      );

      console.log('Analytical Report Response:', response.data);

      if (
        response.data &&
        response.data.data &&
        response.data.data.month_report_arr &&
        response.data.data.year_report_arr
      ) {
        const monDetail = response.data.data.month_report_arr;
        const yearDetail = response.data.data.year_report_arr;

        // ==============================
        // MONTHLY DATA
        // ==============================

        const newMonthlyVariable = [];

        monDetail.forEach((obj) => {
          newMonthlyVariable.push(
            Number(obj.month_user_arr) || 0
          );
        });

        // ==============================
        // YEARLY DATA
        // 2026 → 2032
        // ==============================

        const newYearVariable = [];
        const newYearCategories = [];

        for (
          let year = startYear;
          year < startYear + totalYears;
          year++
        ) {
          // Add year to chart categories
          newYearCategories.push(String(year));

          // Find matching year from API
          const foundYear = yearDetail.find(
            (obj) => Number(obj.year) === year
          );

          // If year exists in API
          if (foundYear) {
            newYearVariable.push(
              Number(foundYear.year_user_arr) || 0
            );
          } else {
            // Future year not available in API
            newYearVariable.push(0);
          }
        }

        // ==============================
        // SET STATE
        // ==============================

        setmonthlyDetails(newMonthlyVariable);

        setyearlyDetails(newYearVariable);

        setYearlyCategories(newYearCategories);
      }
    } catch (error) {
      console.error(
        'Error fetching manage user details:',
        error
      );
    }
  };

  // ==============================
  // USE EFFECT
  // ==============================

  useEffect(() => {
    fetchManageUserDetails();
  }, []);

  // ==============================
  // MONTHLY SERIES
  // ==============================

  const seriesmonthly = [
    {
      name: 'Total Students',
      data: monthlyDetails
    }
  ];

  // ==============================
  // YEARLY SERIES
  // ==============================

  const seriesyearly = [
    {
      name: 'Total Students',
      data: yearlyDetails
    }
  ];

  // ==============================
  // MONTHLY CHART CONFIGURATION
  // ==============================

  const monthly = {
    chart: {
      height: 350,
      type: 'bar',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: true
      }
    },

    plotOptions: {
      bar: {
        columnWidth: '50%',
        distributed: true,
        borderRadius: 4
      }
    },

    dataLabels: {
      enabled: true
    },

    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ],

      title: {
        text: 'Month'
      }
    },

    yaxis: {
      title: {
        text: 'Students'
      },

      min: 0,

      forceNiceScale: true
    },

    fill: {
      colors: ['#19253D']
    },

    legend: {
      show: false
    },

    colors: ['#000000'],

    tooltip: {
      y: {
        formatter: function (value) {
          return value + ' Students';
        }
      }
    }
  };

  // ==============================
  // YEARLY CHART CONFIGURATION
  // ==============================

  const yearly = {
    chart: {
      height: 380,
      type: 'bar',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: true
      }
    },

    plotOptions: {
      bar: {
        columnWidth: '50%',
        distributed: true,
        borderRadius: 4
      }
    },

    dataLabels: {
      enabled: true
    },

    // Dynamic Years
    // 2026, 2027, 2028, 2029, 2030, 2031, 2032
    xaxis: {
      categories: yearlyCategories,

      title: {
        text: 'Year'
      }
    },

    yaxis: {
      title: {
        text: 'Students'
      },

      min: 0,

      forceNiceScale: true
    },

    fill: {
      colors: ['#19253D']
    },

    legend: {
      show: false
    },

    colors: ['#000000'],

    tooltip: {
      y: {
        formatter: function (value) {
          return value + ' Students';
        }
      }
    }
  };

  // ==============================
  // RETURN
  // ==============================

  return (
    <>
      {/* ==============================
          PAGE HEADER
      ============================== */}

      <div
        className="col-xl-12"
        style={{
          backgroundColor: '#FFF',
          borderRadius: '12px',
          padding: '10px',
          marginBottom: '20px'
        }}
      >
        <p
          style={{
            fontSize: '1.25rem',
            color: '#121926',
            fontWeight: '500',
            fontFamily: 'Poppins',
            lineHeight: '1.167',
            marginBottom: '5px'
          }}
        >
          Students Analytical Reports
        </p>
      </div>

      {/* ==============================
          MONTHLY REPORT TITLE
      ============================== */}

      <Typography
        className="d-flex justify-content-center"
        style={{
          marginTop: '30px',
          marginBottom: '30px',
          color: '#b6b3b3'
        }}
        variant="h3"
        gutterBottom
      >
        {currentYear} Monthly Analytical Reports of Students
      </Typography>

      {/* ==============================
          MONTHLY CHART
      ============================== */}

      <Grid container>
        <Grid item xs={12} md={12}>
          <Card sx={{ marginTop: '10px' }}>
            <div className="chart p-4">
              <Chart
                options={monthly}
                series={seriesmonthly}
                type="bar"
                height={350}
              />
            </div>
          </Card>
        </Grid>

        {/* ==============================
            YEARLY REPORT TITLE
        ============================== */}

        <Typography
          className="d-flex justify-content-center"
          style={{
            margin: '40px auto 30px',
            color: '#b6b3b3'
          }}
          variant="h3"
          gutterBottom
        >
          2026 Onwards Yearly Analytical Reports of Students
        </Typography>

        {/* ==============================
            YEARLY CHART
        ============================== */}

        <Grid item xs={12} md={12}>
          <Card sx={{ marginTop: '10px' }}>
            <div className="chart p-4">
              <Chart
                options={yearly}
                series={seriesyearly}
                type="bar"
                height={380}
              />
            </div>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default UserAnaReport;
