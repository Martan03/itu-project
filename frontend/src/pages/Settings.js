import React from "react";
import { useState, useEffect, useRef } from "react";

import Switch from "react-switch";
import ReactSlider from "react-slider";
import Cookies from "js-cookie";

import Layout from "../Layout";
import '../css/Settings.css';

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
      setIsEnabled(getCookieValue('selectedTheme', "Dark") === "Dark" ? true : false);
      setSliderValue(parseInt(getCookieValue('sliderValue', 3)));
      initializedRef.current = true;
    }
  }, []);

  // Additional flag for initialization
  const [initialized, setInitialized] = useState(false);

  // Returns value stored in Cookie for given key, otherwise returns default value
  function getCookieValue(cookieName, defaultValue) {
    const cookieValue = Cookies.get(cookieName);
    return ((cookieValue !== "undefined" && cookieValue !== "NaN") ? cookieValue : defaultValue);
  }

  useEffect(() => {
    // Store slider value to Cookie
    Cookies.set('sliderValue', sliderValue);

    const keyValueArray = {
      1: ["Very small", -6],
      2: ["Small"     , -3],
      3: ["Normal"    ,  0],
      4: ["Larger"    ,  3],
      5: ["Large"     ,  6]
    };
    // Set new values for state variables from above array
    setDiffValue(keyValueArray[sliderValue][1]);
    setDisplayText(keyValueArray[sliderValue][0]);
  }, [sliderValue]);

  useEffect(() => {
    // On diffValue change, recalculate font sizes
    const keyValueArray = [
      ["--font-size-16", (16 + diffValue).toString() + "px"],
      ["--font-size-18", (18 + diffValue).toString() + "px"],
      ["--font-size-20", (20 + diffValue).toString() + "px"],
      ["--font-size-25", (25 + diffValue).toString() + "px"]
    ];
    setPropertiesFromArray(keyValueArray);
  }, [diffValue]);

  useEffect(() => {
    // Store the theme value to Cookie
    Cookies.set('selectedTheme', ((isEnabled) ? "Dark" : "Light"));
    // Update current CSS properties depending on theme
    const keyValueArray = [
      //                                                 Dark theme   Light theme
      ["--dark-100",            ((isEnabled) ?            "#161616" : "#E9E9E9")],
      ["--dark-150",            ((isEnabled) ?            "#202020" : "#DFDFDF")],
      ["--dark-200",            ((isEnabled) ?            "#282828" : "#D7D7D7")],
      ["--dark-250",            ((isEnabled) ?            "#333333" : "#CCCCCC")],
      ["--dark-300",            ((isEnabled) ?            "#3D3D3D" : "#C2C2C2")],
      ["--dark-400",            ((isEnabled) ?            "#575757" : "#C8C8C8")],
      ["--dark-500",            ((isEnabled) ?            "#717171" : "#8E8E8E")],
      ["--dark-600",            ((isEnabled) ?            "#8B8B8B" : "#747474")],

      ["--slider-grey",         ((isEnabled) ?            "#888888" : "#00CFCF")],
      ["--slider-track",        ((isEnabled) ?            "#AAAAAA" : "#D7D7D7")],
      ["--slider-track-active", ((isEnabled) ?            "#FF5050" : "#00CFCF")],

      ["--hover-colour",        ((isEnabled) ?            "#FFFFFF" : "#000000")],

      ["--fg",                  ((isEnabled) ?            "#EEEEEE" : "#111111")],
      ["--fg-light",            ((isEnabled) ?            "#FFFFFF" : "#000000")],
      ["--fg-dark",             ((isEnabled) ?            "#CCCCCC" : "#333333")],
      ["--fg-darker",           ((isEnabled) ?            "#AAAAAA" : "#555555")]
    ];
    setPropertiesFromArray(keyValueArray);
  }, [isEnabled]);

  function setPropertiesFromArray(keyValueArray) {
    for (const [key, value] of keyValueArray) {
      // Call the setProperty function for each key-value pair
      document.documentElement.style.setProperty(key, value);
    }
  }

  const handleSwitchChange = (value) => {
    setIsEnabled(value);
  }

  const handleSliderChange = (value) => {
    setSliderValue(value);
  }

  return (
    <Layout search={props.search}>
      <h1>Settings</h1>

      <div className='settings'>
          <div className='settings-button'>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '10px' }}>Select colour theme</span>
              <Switch
                onChange=       {handleSwitchChange}
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

                  onChange=       {handleSliderChange}
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
