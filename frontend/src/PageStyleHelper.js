/**
 * ITU project
 *
 * Tomáš Daniel <xdanie14>
 */

import Cookies from "js-cookie";

export const Helper = {
    updateFontSize(diffValue) {
        const keyValueArray = [
            ["--font-size-16", (16 + diffValue).toString() + "px"],
            ["--font-size-18", (18 + diffValue).toString() + "px"],
            ["--font-size-20", (20 + diffValue).toString() + "px"],
            ["--font-size-25", (25 + diffValue).toString() + "px"],
            ["--font-size-40", (40 + diffValue).toString() + "px"]
          ];
          this.setPropertiesFromArray(keyValueArray);
    },

    updatePageTheme(isEnabled) {
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
        this.setPropertiesFromArray(keyValueArray);
    },

    setPropertiesFromArray(keyValueArray) {
        for (const [key, value] of keyValueArray) {
            // Call the setProperty export function for each key-value pair
            document.documentElement.style.setProperty(key, value);
        }
    },

    // Returns value stored in Cookie for given key, otherwise returns default value
    getCookieValue(cookieName, defaultValue) {
        const cookieValue = Cookies.get(cookieName);
        return ((cookieValue !== undefined && isNaN(cookieName)) ? cookieValue : defaultValue);
    },

    convertSliderValueToDiff(sliderValue) {
        const keyValueArray = {
            1: -6,
            2: -3,
            3:  0,
            4:  3,
            5:  6
        };
        const newDiffValue = keyValueArray[sliderValue];
        return ((newDiffValue !== undefined) ? newDiffValue : 0);
    },

    convertThemeToBool(themeValue) {
        return ((themeValue === "Light") ? false : true);
    }
}
