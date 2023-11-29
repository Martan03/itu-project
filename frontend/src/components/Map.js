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

// function for calculating a bbox from an array of coordinates
function bbox(coords) {
	let minLatitude = Infinity;
	let minLongitude = Infinity;
	let maxLatitude = -Infinity;
	let maxLongitude = -Infinity;

	coords.forEach(coor => {
		minLongitude = Math.min(coor[0], minLongitude);
		maxLongitude = Math.max(coor[0], maxLongitude);
		minLatitude = Math.min(coor[1], minLatitude);
		maxLatitude = Math.max(coor[1], maxLatitude);
	});

	return [
		[minLongitude, minLatitude],
		[maxLongitude, maxLatitude],
	];
}

export default function Map( { size, showRoute, coordsStart, coordsEnd, travelType, lang } ) {

  const mapContainer = useRef(null);
  const map          = useRef(null);
  const [lng]        = useState(14.8981184);
  const [lat]        = useState(49.8729317);
  const [zoom]       = useState(10);
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
        // style for our geometry
        'route-geometry': {
          type: 'geojson',
          data: {
            type: "LineString",
            coordinates: [],
          },
        }
    };

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      center: [lng, lat],
      zoom: 9,
      style: {
        version: 8,
        // here we use our sources
        sources,
        layers: [{
          id: 'tiles',
          type: 'raster',
          // here we set the source used when map is loaded to one of those declared above
          source: 'basic-tiles',
        }, {
          id: 'route-geometry',
          type: 'line',
          source: 'route-geometry',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#0033ff',
            'line-width': 8,
            'line-opacity': 0.6,
          },
        }],
      },
    });

    // add control panel
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    // we add our LogoControl to the map
    map.current.addControl(new LogoControl(), 'bottom-left');
    // we add our SourceSwitchControl to the map
    map.current.addControl(new SourceSwitchControl(), 'top-left');

    // This is an asynchronous function for querying a route between the two points defined above
    // See https://api.mapy.cz/v1/docs/routing/#/routing/basic_route_v1_routing_route_get
    async function route() {
      try {
        const url = new URL(`https://api.mapy.cz/v1/routing/route`);

        url.searchParams.set('apikey', API_KEY);
        url.searchParams.set('lang', lang);
        url.searchParams.set('start', coordsStart.join(','));
        url.searchParams.set('end', coordsEnd.join(','));
        /* other possible routeType values include:
            car_fast,
            car_fast_traffic,
            car_short,
            foot_fast,
            bike_road,
            bike_mountain
        */
        url.searchParams.set('routeType', travelType);
        // if you want to avoid paid routes (eg. highways) set this to true
        url.searchParams.set('avoidToll', 'false');

        const response = await fetch(url.toString(), {
          mode: 'cors',
        });
        const json = await response.json();

        // we output the length and duration of the result route to the console
        console.log(`length: ${json.length / 1000} km`, `duration: ${Math.floor(json.duration / 60)}m ${json.duration % 60}s`);

        // then we set the retrieved data as the geometry of our geojson layer
        const source = map.current.getSource('route-geometry');

        if (source && json.geometry) {
          source.setData(json.geometry);
          // finally we set the map to show the whole geometry in the viewport
          map.current.jumpTo(map.current.cameraForBounds(bbox(json.geometry.geometry.coordinates), {
            padding: 40,
          }));
        }
      } catch (ex) {
        console.log(ex);
      }
    }

    // on click we read the coordinates (longitude, latitude) from the event and send a request to the rgeocode API function
    map.current.on('click', async function mapClick(event) {
      alert("Longitude: " + event.lngLat.lng + " Latitude: " + event.lngLat.lat);
    });

    map.current.on('load', () => {
      if (showRoute === true) {
        route();
      }
    });

  }, [API_KEY, lng, lat, zoom, showRoute, coordsStart, coordsEnd, travelType, lang]);

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
