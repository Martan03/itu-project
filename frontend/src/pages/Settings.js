import React from "react";
import Switch from "react-switch";
import ReactSlider from "react-slider";

import { useState } from "react";

import Layout from "../Layout";
import Cookies from "js-cookie";

import '../css/Settings.css';

function Settings(props) {
    // Initialize state for theme and font size
    const [isEnabled, setIsEnabled] = useState(false);

    const handleSwitchChange = () => {
      setIsEnabled(!isEnabled);
      handleThemeChange();
    }

    function setPropertiesFromArray(keyValueArray) {
      for (const [key, value] of keyValueArray) {
        // Call the setProperty function for each key-value pair
        document.documentElement.style.setProperty(key, value);
      }
    }

    const handleSliderChange = (value) => {
      var diff = (value === 1) ? -6 :
                 (value === 2) ? -3 :
                 (value === 3) ? 0  :
                 (value === 4) ? 3  :
                 (value === 5) ? 6  : 0;

      const keyValueArray = [
        ["--font-size-16", (16 + diff).toString() + "px"],
        ["--font-size-18", (18 + diff).toString() + "px"],
        ["--font-size-20", (20 + diff).toString() + "px"],
        ["--font-size-25", (25 + diff).toString() + "px"]
      ];
      setPropertiesFromArray(keyValueArray);
    }

    // Function to handle theme selection
    const handleThemeChange = () => {
        // Store the selected theme in a cookie
        Cookies.set('selectedTheme', ((isEnabled) ? "Dark" : "Light"), { expires: 365 });
        const keyValueArray = [
          ["--dark-100", ((isEnabled) ? "#161616" : "#E9E9E9")],
          ["--dark-150", ((isEnabled) ? "#202020" : "#DFDFDF")],
          ["--dark-200", ((isEnabled) ? "#282828" : "#D7D7D7")],
          ["--dark-250", ((isEnabled) ? "#333333" : "#CCCCCC")],
          ["--dark-300", ((isEnabled) ? "#3D3D3D" : "#C2C2C2")],
          ["--dark-400", ((isEnabled) ? "#575757" : "#C8C8C8")],
          ["--dark-500", ((isEnabled) ? "#717171" : "#8E8E8E")],
          ["--dark-600", ((isEnabled) ? "#8B8B8B" : "#747474")],

          ["--fg",       ((isEnabled) ? "#EEEEEE" : "#111111")],
          ["--fg-light", ((isEnabled) ? "#FFFFFF" : "#000000")],
          ["--fg-dark",  ((isEnabled) ? "#CCCCCC" : "#333333")],
          ["--fg-darker",((isEnabled) ? "#AAAAAA" : "#555555")]
        ];
        setPropertiesFromArray(keyValueArray);
    };

    return (
      <Layout search={props.search}>
        <h1>Settings</h1>

        <div className='settings'>
            {/* Theme Selection */}
            <div className='settings-button'>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '10px' }}>Select colour theme</span>
                <Switch
                  onChange={handleSwitchChange}
                  checked={((Cookies.get('selectedTheme') === "Dark") ? false : true)}

                  onHandleColor="#ff5050"
                  offHandleColor="#ff5050"

                  width={62}

                  offColor="#888888"
                  onColor="#888888"

                  checkedIcon={<span role="img" aria-label="dark-theme">🌙</span>}
                  uncheckedIcon={<span role="img" aria-label="light-theme">⛅</span>}
                />
              </label>
            </div>
            <div className='settings-button'
              style={{ marginTop: '10px', display: 'flex' }}>
                <span style={{ marginRight: '10px' }}>Select text size</span>
                <ReactSlider
                  className="horizontal-slider"
                  thumbClassName="example-thumb"
                  trackClassName="example-track"
                  min={1}
                  max={5}
                  step={1}
                  defaultValue={3}
                  onAfterChange={handleSliderChange}
                />
            </div>
        </div>
      </Layout>
    );
  }

  export default Settings;
