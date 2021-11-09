import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Box, Paper, Fab } from '@material-ui/core';
import MapContainer from './Map';
import createPlotlyComponent from 'react-plotly.js/factory';
import LogoDashboard1 from '~assets/img/LogoDashboard1.png';
import Page from '~atoms/Page/Page';
import { makeStyles } from '@material-ui/core/styles';
import { Theme } from '~ui/themes';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { getFormCumulative, getFarmerCumulative, getRegisteredFarms } from '~services/dashboard';
import MapPopper from './MapPopper';

const Plot = createPlotlyComponent(window.Plotly);

const CompDashboard = () => {
  const classes = useStyles();
  const {
    auth: { organizationTheme }
  }: any = useSelector((state: any) => state);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mapCenter, setMapCenter] = useState<any[]>(organizationTheme?.initial_gps);
  const [polygons, setPolygons] = useState<any | undefined>(undefined);
  const [refreshMap, setRefreshMap] = useState<boolean>(false);
  const [farmerCumulative, setFarmerCumulative] = useState({
    female_count: 0,
    male_count: 0,
    age_avg: 0
  });

  const [formCumulative, setFormCumulative] = useState({
    form_count: 0
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleEditPolygon = useCallback((_polygon: any, _center: []) => {}, []);

  useEffect(() => {
    getFormCumulative().then((res: any) => {
      setFormCumulative(res?.data?.data);
    });
  }, []);

  useEffect(() => {
    getFarmerCumulative().then((res: any) => {
      setFarmerCumulative(res?.data?.data);
    });
  }, []);
  useEffect(() => {
    getRegisteredFarms().then((res: any) => {
      const data = res?.data?.data;
      const currentPolygons: any[] = [];
      data?.farms?.forEach((farm: any) => {
        if (farm?.area_sqmt !== null) {
          currentPolygons.push({
            type: 'Feature',
            geometry: farm?.area_sqmt
          });
        }
      });
      setPolygons({
        type: 'FeatureCollection',
        features: currentPolygons
      });
      setRefreshMap((prevValue: boolean) => !prevValue);
    });
  }, []);

  return (
    <Page title="Dashboard: App">
      <Grid container spacing={4} alignItems="stretch" direction="row" justifyContent="space-evenly">
        <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
          <Paper>
            <Box p={4} display="flex" flexDirection="row" justifyContent="space-between" height="280px">
              <Box p={5}>
                <Box fontWeight="bold" mb={1} fontSize="1.7rem">
                  ¡Bienvenidos, ahora su organización es digital!
                </Box>
              </Box>
              <Box>
                <img src={LogoDashboard1} alt="LogoDashboard" height="210px" width="300px" />
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Paper>
            <Box p={4} flexDirection="column" alignItems="space-between" height="280px">
              <Box fontWeight="bold" mb={1} fontSize="1.7rem" height="33%">
                AGROS
              </Box>

              <Box height="33%">Nos preocupamos por ti para que te preocupes por tus productores.</Box>
              <Box height="33%" display="flex" flexDirection="column-reverse" mt={1}>
                <Box display="flex" flexDirection="row-reverse">
                  Central de soporte: 934805856
                </Box>
                <Box display="flex" flexDirection="row-reverse">
                  Correo: hola@agros.tech
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
          <Paper className={classes.paperItemsProducer}>
            <Grid container={true}>
              <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} mb={3}>
                <Fab color="default" className={classes.fabContact}>
                  <AccountCircleIcon color="disabled" style={{ color: '#005249' }} />
                </Fab>
              </Grid>

              <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box className={classes.titleItems} display="flex" flexDirection="column" alignItems="center">
                  <Box className={classes.countItems}>
                    {' '}
                    {(farmerCumulative?.female_count ?? 0) + (farmerCumulative?.male_count ?? 0)}
                  </Box>

                  <Box className={classes.subtitleItems}>Productores inscritos</Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
          <Paper className={classes.paperItemsAge}>
            <Grid container={true}>
              <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} mb={3}>
                <Fab color="default" className={classes.fabContact}>
                  <DateRangeIcon color="disabled" style={{ color: '#005249' }} />
                </Fab>
              </Grid>

              <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box className={classes.titleItems} display="flex" flexDirection="column" alignItems="center">
                  <Box className={classes.countItems}> {farmerCumulative?.age_avg ?? 0}</Box>

                  <Box className={classes.subtitleItems}>Edad promedio de los productores</Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
          <Paper className={classes.paperItemsForm}>
            <Grid container={true}>
              <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} mb={3}>
                <Fab color="default" className={classes.fabContact}>
                  <ChromeReaderModeIcon color="disabled" style={{ color: '#005249' }} />
                </Fab>
              </Grid>

              <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box className={classes.titleItems} display="flex" flexDirection="column" alignItems="center">
                  <Box className={classes.countItems}> {formCumulative.form_count ?? 0}</Box>

                  <Box className={classes.subtitleItems}>Registros realizados en el mes</Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
          <Paper className={classes.paper} style={{ height: '460px', textAlign: 'center' }}>
            <h3 className={classes.titlePaper}> Productores por género</h3>
            {window.Plotly ? (
              <Plot
                // className="plotly-lines"
                style={{ width: '100%', marginBottom: '10px' }}
                data={[
                  {
                    values: [farmerCumulative?.male_count ?? 0, farmerCumulative?.female_count ?? 0],
                    labels: ['Varones', 'Mujeres'],
                    // textinfo: 'label+percent',
                    // textposition: 'inside',
                    // hoverinfo: 'label+percent',
                    hole: 0.8,
                    // title: {
                    //   text: smsMonthLimitPercen  tage + '% <br>TOTAL CONSUMO',
                    //   position: 'middle center'
                    // },
                    type: 'pie',
                    showlegend: false,
                    marker: {
                      colors: ['#3F860C', '#F2C94C']
                    }
                  }
                ]}
                layout={{
                  // width: 300,
                  autosize: true,
                  height: 250,
                  margin: { t: 0, b: 0, l: 0, r: 0 }
                }}
              />
            ) : (
              ''
            )}
            <>
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                style={{ padding: '5px 10px', fontWeight: 'bold' }}>
                <Grid>
                  <div
                    style={{
                      display: 'inline-block',
                      width: '10px',
                      height: '10px',
                      background: '#3F860C',
                      color: '#3F860C',
                      borderRadius: '50%',
                      MozBorderRadius: '50%',
                      WebkitBorderRadius: '50%'
                    }}></div>{' '}
                  <span> Varones: </span>
                </Grid>
                <Grid> {farmerCumulative?.male_count ?? 0} </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
                style={{ padding: '5px 10px', fontWeight: 'bold' }}>
                <Grid>
                  <div
                    style={{
                      display: 'inline-block',
                      width: '10px',
                      height: '10px',
                      background: '#F2C94C',
                      color: '#F2C94C',
                      borderRadius: '50%',
                      MozBorderRadius: '50%',
                      WebkitBorderRadius: '50%'
                    }}></div>{' '}
                  <span> Mujeres </span>
                </Grid>
                <Grid> {farmerCumulative?.female_count ?? 0} </Grid>
              </Grid>
            </>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
          <Paper style={{ height: '460px' }}>
            <Box p={2} height="460px">
              <MapContainer
                center={mapCenter}
                refresh={refreshMap}
                onEditPolygon={handleEditPolygon}
                polygon={polygons}
              />
              <MapPopper />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Page>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    paddingTop: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0)
    }
  },
  separateButton: {
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      paddingBottom: theme.spacing(1)
    }
  },
  titleWelcome: {
    textAlign: 'left',
    fontSize: '1.6em',
    // color:'#214036',
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      paddingBottom: theme.spacing(2)
    }
  },
  titleWelcomeAssociation: {
    textAlign: 'center',
    fontSize: '1.7em',
    // color:'#214036',
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      paddingBottom: theme.spacing(2)
    }
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
    // height: '300px'
  },
  paperItemsAge: {
    padding: theme.spacing(4),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    background: '#D0F2FF',
    // [theme.breakpoints.down('md')]: {
    //   paddingBottom: theme.spacing(2),
    // },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2)
    }
  },
  paperItemsProducer: {
    padding: theme.spacing(4),
    textAlign: 'center',
    background: '#C8FACD',
    color: 'theme.palette.text.secondary',
    // [theme.breakpoints.down('md')]: {
    //   paddingBottom: theme.spacing(2),
    // },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2)
    }
  },
  paperItemsForm: {
    padding: theme.spacing(4),
    textAlign: 'center',
    background: '#FFF7CD',
    color: 'theme.palette.text.secondary',
    // [theme.breakpoints.down('md')]: {
    //   paddingBottom: theme.spacing(2),
    // },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2)
    }
  },
  titleAgros: {
    fontSize: '1.3em',
    padding: '0 5px',
    fontWeight: 'bold',
    paddingBottom: theme.spacing(2)
  },
  paperAgros: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2)
    }
  },
  listEmoticon: {
    paddingBottom: theme.spacing(1.5),
    fontSize: '1.2em'
  },
  valueValoration: {
    fontSize: '1.2em'
  },
  barLineDissatisfied: {
    background: '#FA6C6D',
    height: '20px'
  },
  barLineNeutral: {
    background: '#FDD35E',
    height: '20px'
  },
  barLineSatisfied: {
    background: '#92C678',
    height: '20px'
  },
  percentageValueDissatisfied: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: '#FA6C6D'
  },
  percentageValueNeutral: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: '#FDD35E'
  },
  percentageValueSatisfied: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: '#92C678'
  },
  fabContact: {
    color: '#005249',
    background: 'linear-gradient(135deg, rgba(0, 123, 85, 0) 0%, rgba(0, 123, 85, 0.24) 97.35%);',
    opacity: 0.4
  },
  fabPhone: {
    background: '#F2994A',
    opacity: 0.4
  },
  fabSMS: {
    background: '#8AB833',
    opacity: 0.4
  },
  titleItems: {
    textAlign: 'left',
    color: '#214036'
  },

  countItems: {
    fontSize: '2em',
    fontWeight: 'bold'
  },
  subtitleItems: {
    fontSize: '1em',
    textAlign: 'left'
  },
  titlePaper: {
    textAlign: 'left',
    paddingLeft: theme.spacing(1),
    paddingBottom: '40px'
  },
  titlePaperLink: {
    textAlign: 'left',
    paddingLeft: theme.spacing(1),
    color: theme.palette.primary.main,
    textDecoration: 'none'
  },
  iconPlot: {
    color: 'red'
  },
  logoEmoticon: {
    width: '60px',
    [theme.breakpoints.down('lg')]: {
      width: '60px'
    },
    [theme.breakpoints.down('md')]: {
      width: '50px'
    },
    [theme.breakpoints.down('sm')]: {
      width: '50px'
    }
  }
}));

export default React.memo(CompDashboard);
