//===========================================================================
// Functions.js   version 1.4

// Christmas Bauble Widget
// 11 December, 2018
// Originally written and Steampunked by Dean Beedell
// Dean.beedell@lightquick.co.uk
// Vitality code, advice, direction and patience from Harry Whitfield
//
//===========================================================================
/*jslint for, multivar */

/*property
    onMouseUp, scalePref, soundPref, value, visible
*/

"use strict";

var Number, changePrefs, displayLicence, mainWindow, nullfunction, resizeIt, 
    saveLocations, saveSizes, taskcommand, tingingSound, widgethelp;

include("setMenu.js");

//===============================
// function to resize all layers
//===============================
function resizeIt() {
    var Scale = Number(preferences.scalePref.value) / 100;

    //bauble1.reScale(Scale);
    eprint("Resizing: preferences.scalePref.value: " + preferences.scalePref.value);
    eprint("Scale: " + Scale);
    //mainWindow.height = mainWindowheightDefault * Scale;
    //mainWindow.width  = mainWindowwidthDefault * Scale;
}
//=====================
//End function
//=====================



//===========================================
// this function allows a spacer in the menu
//===========================================
function nullfunction() {
    return;
}
//=====================
//End function
//=====================

//===========================================
// this function opens the online help file
//===========================================
function widgethelp() {
    helpWindow.visible = true;

  	if (preferences.soundPref.value === "enabled") {
		play(tingingSound, false);
  	}
	helpWindow.visible = true;
}
//=====================
//End function
//=====================

//===========================================
// this function opens the online help file
//===========================================
christmasBaublesHelp.onMouseUp = function() {
	helpWindow.visible = false;
}
//=====================
//End function
//=====================





//==============================================================
// this function reloads the widget when preferences are changed
//==============================================================
function changePrefs() {
    log("preferences Changed");
    saveLocations();
    saveSizes();
    //sleep(2000);
    reloadWidget();
}
//=====================
//End function
//=====================

