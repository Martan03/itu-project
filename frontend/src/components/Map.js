import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../css/Map.css';

/*
MapLibre does not provide an out-of-the-box solution to switching tile layers,
but we can easily create one using the same interface we used to create a logo.
See https://maplibre.org/maplibre-gl-js-docs/api/markers/#icontrol
*/
class SourceSwitchControl {
	onAdd(map) {
		this._map = map;
		this._container = document.createElement('div');
		this._container.className = 'maplibregl-ctrl';

    const select = document.createElement('select');

    // available sources and their labels
    [
      { source: 'basic-tiles', label: 'Basic' },
      { source: 'outdoor-tiles', label: 'Outdoor' },
      { source: 'winter-tiles', label: 'Winter' },
      { source: 'aerial-tiles', label: 'Aerial' },
    ].forEach(item => {
    	const option = document.createElement('option');
      option.value = item.source;
      option.innerHTML = item.label;

      select.appendChild(option);
    });
    select.addEventListener('change', event => {
    	/*
      MapLibre does not allow changing the source of a layer,
      so we have to remove the old one and create a new one
      with a new source in its place.
      */
      const oldLayers = this._map.getStyle().layers;
      const layerIndex = oldLayers.findIndex(l => l.id === 'tiles');
      const layerDef = oldLayers[layerIndex];
      const before = oldLayers[layerIndex + 1] && oldLayers[layerIndex + 1].id;

      layerDef.source = event.target.value;
      this._map.removeLayer('tiles');
      this._map.addLayer(layerDef, before);
    });
    this._container.appendChild(select);

		return this._container;
	}

	onRemove() {
		this._container.parentNode.removeChild(this._container);
		this._map = undefined;
	}
}

/*
We also require you to include our logo somewhere over the map.
We create our own map control implementing a documented interface,
that shows a clickable logo.
See https://maplibre.org/maplibre-gl-js-docs/api/markers/#icontrol
*/
class LogoControl {
	onAdd(map) {
		this._map = map;
		this._container = document.createElement('div');
		this._container.className = 'maplibregl-ctrl';
		this._container.innerHTML = '<a href="http://mapy.cz/" target="_blank"><img  width="100px" src="https://api.mapy.cz/img/api/logo.svg" ></a>';

		return this._container;
	}

	onRemove() {
		this._container.parentNode.removeChild(this._container);
		this._map = undefined;
	}
}

export default function Map( { size, showRoute, coords } ) {

  const mapContainer = useRef(null);
  const map          = useRef(null);
  const [lng]        = useState(14.8981184);
  const [lat]        = useState(49.8729317);
  const [zoom]       = useState(14);
  const [API_KEY]    = useState('g_wsAV6_8gEWGC2HsUJqMiVhM0OtjnosVg906jLtybc');

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    // array of map tile sets we want to support
    const sources = {
      'basic-tiles': {
        type: 'raster',
        url: `https://api.mapy.cz/v1/maptiles/basic/tiles.json?apikey=${API_KEY}`,
        tileSize: 256,
        },
      'outdoor-tiles': {
        type: 'raster',
        url: `https://api.mapy.cz/v1/maptiles/outdoor/tiles.json?apikey=${API_KEY}`,
        tileSize: 256,
        },
      'winter-tiles': {
        type: 'raster',
        url: `https://api.mapy.cz/v1/maptiles/winter/tiles.json?apikey=${API_KEY}`,
        tileSize: 256,
        },
      'aerial-tiles': {
        type: 'raster',
        url: `https://api.mapy.cz/v1/maptiles/aerial/tiles.json?apikey=${API_KEY}`,
        tileSize: 256,
        },
    };

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      center: [lng, lat],
      zoom: 15,
      style: {
        version: 8,
        // here we use our sources
        sources,
        layers: [{
          id: 'tiles',
          type: 'raster',
          // here we set the source used when map is loaded to one of those declared above
          source: 'basic-tiles',
        }],
      },
    });

    // add control panel
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    // we add our LogoControl to the map
    map.current.addControl(new LogoControl(), 'bottom-left');
    // we add our SourceSwitchControl to the map
    map.current.addControl(new SourceSwitchControl(), 'top-left');
    // on click we read the coordinates (longitude, latitude) from the event and send a request to the rgeocode API function
    map.current.on('click', async function mapClick(event) {
      alert("Longitude: " + event.lngLat.lng + " Latitude: " + event.lngLat.lat);
    });

  }, [API_KEY, lng, lat, zoom]);

  const mapStyle = {
    width: `${size.width}`,  // Use width from the size array
    height: `${size.height}`  // Use height from the size array
  };

  return (
    <div className="map-wrap">
      <div ref={mapContainer} style={mapStyle}/>
    </div>
  );
}
