import React from "react";
import { useState, useEffect, useRef } from "react";

import Switch from "react-switch";
import ReactSlider from "react-slider";
import Cookies from "js-cookie";

import Layout from "../Layout";
import '../css/Settings.css';

import { Helper } from '../PageStyleHelper.js';

// import Map from "../components/Map.js";

function Settings(props) {
  // Initialize states for theme, slider and slider's label
  const [isEnabled  , setIsEnabled  ] = useState(false);
  const [sliderValue, setSliderValue] = useState(3);
  const [displayText, setDisplayText] = useState("Normal");
  const [diffValue  , setDiffValue  ] = useState(0);

  const initializedRef = useRef(false);

  useEffect(() => {
    // Ensure execution only once on page load
    if (!initializedRef.current) {
      // Set initial values stored in Cookies
      setIsEnabled(Helper.convertThemeToBool(Helper.getCookieValue('selectedTheme', "Dark")));
      setSliderValue(parseInt(Helper.getCookieValue('sliderValue', 3)));
      initializedRef.current = true;
    }
  }, []);

  useEffect(() => {
    // Store slider value to Cookie
    Cookies.set('sliderValue', sliderValue);

    const keyValueArray = {
      1: "Very small",
      2: "Small",
      3: "Normal",
      4: "Larger",
      5: "Large"
    };
    // Set new values for state variables from above array
    setDiffValue(Helper.convertSliderValueToDiff(sliderValue));

    const newSliderText = keyValueArray[sliderValue];
    setDisplayText((newSliderText !== undefined) ? newSliderText : "Normal");
  }, [sliderValue]);

  useEffect(() => {
    // On diffValue change, recalculate font sizes
    Helper.updateFontSize(diffValue);
  }, [diffValue]);

  useEffect(() => {
    // Store the theme value to Cookie
    Cookies.set('selectedTheme', ((isEnabled) ? "Dark" : "Light"));

    Helper.updatePageTheme(isEnabled);
  }, [isEnabled]);

  /*
  Example call:
    <Map
      size={{height: '800px', width: '800px'}}
      showRoute={true}
      coordsStart={[14.4009399, 50.0711206]}
      coordsEnd={[16.5661545, 49.1747438]}
      travelType={'car_fast'}
      lang={'cs'}
      addMarkers={true}
      markersArr={[{ lngLat: [12.550343, 55.665957] },
                    { lngLat: [12.540123, 55.670987] }]}
      waypointsArr={[[12.550343, 55.665957], [12.540123, 55.670987]]}
    />
  */

  return (
    <Layout search={props.search} menu={props.menu}>
      <h1>Settings</h1>

      <div className='settings'>
          <div className='settings-button'>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '10px' }}>Select colour theme</span>
              <Switch
                onChange=       {setIsEnabled}
                checked=        {isEnabled}
                uncheckedIcon=  {<span role="img" aria-label="dark-theme">🌙</span>}
                checkedIcon=    {<span role="img" aria-label="light-theme">⛅</span>}

                onHandleColor=  {((!isEnabled) ? "#00CFCF" : "#ff5050")}
                offHandleColor= {((!isEnabled) ? "#00CFCF" : "#ff5050")}
                offColor=       {((!isEnabled) ? "#D7D7D7" : "#888888")}
                onColor=        {((!isEnabled) ? "#D7D7D7" : "#888888")}

                width=          {62}
              />
            </label>
          </div>

          <div className='settings-button' style={{ marginTop: '20px', display: 'flex'}}>
              <span style={{ marginRight: '10px' }}>Select text size</span>
              <div style={{display: 'flex', width: '300px', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
                <ReactSlider
                  className=      "horizontal-slider"
                  thumbClassName= "slider-thumb"
                  trackClassName= "slider-track"

                  min=            {1}
                  max=            {5}
                  step=           {1}

                  onChange=       {setSliderValue}
                  value=          {sliderValue}
                />
                <p>{displayText}</p>
              </div>
          </div>
      </div>
    </Layout>
  );
}

export default Settings;
