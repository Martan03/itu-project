import React from 'react';
import { MapProvider,
         Map,
         ZoomControl,
         KeyboardControl,
         MouseControl,
         LayerControl,
         BASE_LAYERS,
         SearchInput } from 'mapy-cz-react';

import '../css/Map.css';

function MapElement(size) {
    return (
        <MapProvider center={{lng:  16.596715, lat: 49.226520}}
            mapLayers={[BASE_LAYERS.BASE_NEW,
                        BASE_LAYERS.TURIST,
                        BASE_LAYERS.OPHOTO,
                        BASE_LAYERS.HISTORIC,
                        BASE_LAYERS.TURIST_WINTER]} zoom={14}>

            <SearchInput className="search-map" placeholder="Search..." disableGeolocation />

            <Map height={size.height} width={size.width}>
                <ZoomControl />
                <KeyboardControl />
                <MouseControl zoom wheel />
                <LayerControl pageSize={5} />
            </Map>
        </MapProvider>
    )
}

export default MapElement;
