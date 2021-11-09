/* eslint-disable @typescript-eslint/typedef */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Map, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { showMessage } from '~utils/Messages';
import L from 'leaflet';
// import geojsonArea from '@mapbox/geojson-area';
import PropTypes from 'prop-types';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    map: {
      '& .leaflet-left': {
        left: null,
        right: '0px '
      }
    }
  })
);

const ContainerMap = (props) => {
  const { refresh, center, polygon, onEditPolygon } = props;
  const [mapCenter, setMapCenter] = useState([]);
  const [count, setCount] = useState(-1);
  const mapRef = useRef(null);
  // const polygonRef = useRef(null);
  const classes = useStyles();

  useEffect(() => {
    setMapCenter(center ?? []);
    setCount(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const handleOnEditedDraw = useCallback(
    (e) => {
      try {
        const layers = e?.layers;
        if (layers?.getLayers()?.length === 0) return;
        const feature = layers?.getLayers()[0];
        const { lat, lng } = feature?.getBounds().getCenter();
        const geoJSON = feature?.toGeoJSON();
        onEditPolygon(geoJSON, [lat, lng]);
        // setArea(L.GeometryUtil.geodesicArea(feature.getLatLngs()[0]) / 10000);
        // setMapCenter([lat, lng]);
        // setFeatureCoordinates(coordinates);
      } catch (error) {
        showMessage('', 'No se pudo modificar el polígono.', 'error', true);
      }
    },
    [onEditPolygon]
  );

  // const handleOnDeleteDraw = useCallback((e) => {
  //   console.log(e);
  // const features = this.state.features;
  // e.layers.eachLayer(layer => {
  //   const indexLeaflet = layer._leaflet_id;
  //   const index = String('l'.concat(indexLeaflet));
  //   delete features[index];
  // })
  // this.setState({features});
  // const objFeatures = Object.keys(features);
  // if (objFeatures.length < 1) {
  //   await this.setState({editControlOptions:{}});
  //   this.setState({createdLote: false, editControlOptions:{draw:{polygon:true},edit:{edit:false, remove:false}}})
  // };
  // }, []);

  const _onFeatureGroupReady = useCallback(
    (reactFGref) => {
      if (polygon !== undefined) {
        const leafletGeoJSON = new L.GeoJSON(polygon);
        if (reactFGref?.leafletElement !== undefined) {
          const leafletFG = reactFGref.leafletElement;
          if (count === 0) {
            const layer = leafletGeoJSON.getLayers()[0];
            leafletFG.clearLayers();
            try {
              leafletFG.addLayer(layer);
            } catch (error) {}
            // const areaM = geojsonArea.geometry(layer?.feature?.geometry);
            // const ha = areaM / 10000;
            // setArea(ha.toFixed(2));
            setCount(1);
          }
        }
      } else {
        if (reactFGref?.leafletElement !== undefined) {
          const leafletFG = reactFGref.leafletElement;
          leafletFG.clearLayers();
        }
      }
    },
    [polygon, count]
  );

  // const handleOnTest = useCallback((e) => {
  //   console.log(e);
  // }, []);

  return (
    <>
      <Map
        ref={mapRef}
        style={{
          width: '100%',
          height: '380px',
          left: 0,
          top: 0,
          borderRadius: '10px'
        }}
        center={[(mapCenter && mapCenter[0]) ?? 0, (mapCenter && mapCenter[1]) ?? 0]}
        zoom={16}
        class={classes.map}
        maxZoom={22}
        // minZoom={14}
      >
        <TileLayer
          attribution=""
          // url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          // url="http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
          url="https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXFhYTA2bTMyeW44ZG0ybXBkMHkifQ.gUGbDOPUN1v1fTs5SeOR4A"
        />
        {/* <WMSTileLayer
          transparent={true}
          dpi={96}
          url="https://georural.minagri.gob.pe/geoservicios/services/public/PSAD56_Catastro_Rural/MapServer/WMSServer"
          format="image/png"
          layers="9"
        /> */}
        <FeatureGroup
          ref={(reactFGref) => {
            _onFeatureGroupReady(reactFGref);
          }}>
          <EditControl
            position="topright"
            // ref={editControl.ref || ((e) => {})}
            // onCreated={editControl.onCreated || ((e) => {})}
            onEdited={handleOnEditedDraw}
            // onDeleted={handleOnDeleteDraw}
            draw={{
              circle: false,
              rectangle: false,
              polyline: false,
              polygon: false,
              marker: false,
              circlemarker: false
            }}
            edit={{
              edit: true,
              remove: false
            }}
          />
        </FeatureGroup>
      </Map>
    </>
  );
};
ContainerMap.propTypes = {
  refresh: PropTypes.bool,
  center: PropTypes.array,
  polygon: Boolean,
  onEditPolygon: PropTypes.func
};

export default ContainerMap;
