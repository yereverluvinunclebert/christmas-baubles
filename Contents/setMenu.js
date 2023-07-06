//===========================================================================
// setMenu.js   version 1.4
// Christmas Bauble Widget
// 13 November, 2018
// Originally written and Steampunked by Dean Beedell
// 
// Vitality code, advice, direction and patience from Harry Whitfield
//
//===========================================================================

/*jslint multivar */

/*property
    appendChild, contextMenuItems, imageEditPref, itemExists, lastIndexOf,
    onContextMenu, onSelect, platform, push, reveal, rotation, substring,
    ticking, title, userWidgetsFolder, value
*/

"use strict";

var mainWindow, widgetName, tankHelpShow, displayLicense, temperatureTimer, debugFlg,
		editWidget, pointer, pointerShadow, updateTemperature;
        
//===========================================
// this function edits the widget
//===========================================
function editWidget() {
    //var answer = alert("Editing the widget. Proceed?", "Open Editor", "No Thanks");
    //if (answer === 1) {
		//uses the contents of imageEditPref to initiate your default editor
        performCommand();
    //}

}
//=====================
//End function
//=====================        

//===========================================
// this function opens the online help file
//===========================================
function menuitem1OnClick() {
    var answer = alert("This button opens a browser window and connects to the help page for this widget. Do you wish to proceed?", "Open Browser Window", "No Thanks");

    if (answer === 1) {
		openURL("https://www.facebook.com/profile.php?id=100012278951649");
        //beep();
        //alert("Sorry - not available.");
    }
}
//=====================
//End function
//=====================

//===========================================
// this function opens the URL for paypal
//===========================================
function donate() {
    var answer = alert("Help support the creation of more widgets like this, send us a coffee! This button opens a browser window and connects to the Kofi donate page for this widget). Will you be kind and proceed?", "Open Browser Window", "No Thanks");

    if (answer === 1) {
                openURL("https://www.ko-fi.com/yereverluvinunclebert");
    }
}
//=====================
//End function
//=====================

//===========================================
// this function opens my Amazon URL wishlist
//===========================================
function amazon() {
    var answer = alert("Help support the creation of more widgets like this. Buy me a small item on my Amazon wishlist! This button opens a browser window and connects to my Amazon wish list page). Will you be kind and proceed?", "Open Browser Window", "No Thanks");

    if (answer === 1) {
        openURL("http://www.amazon.co.uk/gp/registry/registry.html?ie=UTF8&id=A3OBFB6ZN4F7&type=wishlist");
    }
}
//=====================
//End function
//=====================

//===========================================
// this function opens other widgets URL
//===========================================
function otherwidgets() {
    var answer = alert("This button opens a browser window and connects to the Steampunk widgets page on my site. Do you wish to proceed", "Open Browser Window", "No Thanks");

    if (answer === 1) {
        openURL("https://www.deviantart.com/yereverluvinuncleber/gallery/59981269/yahoo-widgets");
    }
}
//=====================
//End function
//=====================

//===========================================
// this function opens the download URL
//===========================================
function update() {
    var answer = alert("Download latest version of the widget - this button opens a browser window and connects to the widget download page where you can check and download the latest zipped .WIDGET file). Proceed?", "Open Browser Window", "No Thanks");

    if (answer === 1) {
        openURL("https://www.deviantart.com/yereverluvinuncleber/gallery/59981269/yahoo-widgets");
    }
}
//=====================
//End function
//=====================

//===========================================
// this function opens the browser at the contact URL
//===========================================
function contact() {
    var answer = alert("Visiting the support page - this button opens a browser window and connects to our contact us page where you can send us a support query or just have a chat). Proceed?", "Open Browser Window", "No Thanks");

    if (answer === 1) {
        openURL("http://www.facebook.com/profile.php?id=100012278951649");
    }
}
//=====================
//End function
//=====================

//===========================================
// this function opens the browser at the contact URL
//===========================================
function facebookChat() {
    var answer = alert("Visiting the Facebook chat page - this button opens a browser window and connects to our Facebook chat page.). Proceed?", "Open Browser Window", "No Thanks");
    if (answer === 1) {
        openURL("http://www.facebook.com/profile.php?id=100012278951649");
    }
}
//=====================
//End function
//=====================

//===========================================
// this function causes explorer to be opened and the file selected
//===========================================
function findWidget() {

 // temporary development version of the widget
    var widgetFullPath = convertPathToPlatform(system.userWidgetsFolder + "/" + widgetName);
    var alertString = "The widget folder is: \n";
    if (filesystem.itemExists(widgetFullPath)) {
        alertString += system.userWidgetsFolder + " \n\n";
        alertString += "The widget name is: \n";
        alertString += widgetName + ".\n ";

        alert(alertString, "Open the widget's folder?", "No Thanks");

        filesystem.reveal(widgetFullPath);
    } else {
        widgetFullPath = resolvePath(".");   
        filesystem.reveal(widgetFullPath);
        print("widgetFullPath " + widgetFullPath);
    }
}
//=====================
//End function
//=====================

//======================================================================================
// Function to perform commands
//======================================================================================
function performCommand() {
     if (preferences.soundPref.value === "enabled") {
        play(tingingSound, false);
    }

   	eprint("preferences.imageEditPref.value " + preferences.imageEditPref.value);
   	runCommandInBg(preferences.imageEditPref.value, "runningTask");
 }
//=====================
//End function
//=====================


//================================================
// this function creates the onContextMenu handler
//================================================
function setmenu() {
        var items = [], mItem, sItem;
        
        mItem = new MenuItem();
        mItem.title = "Donate a Coffee with Ko-Fi";
        mItem.onSelect = function () {
            donate();
        };
        items.push(mItem);


        mItem = new MenuItem();
        mItem.title = "-";
        items.push(mItem);

        mItem = new MenuItem();
        mItem.title = widgetName + " Help";
        mItem.onSelect = function () {
            widgethelp();
        };
        items.push(mItem);

        mItem = new MenuItem();
        mItem.title = "Online Help and other online options";
        items.push(mItem);

        sItem = new MenuItem();
        sItem.title = "See More Steampunk Widgets";
        sItem.onSelect = function () {
            otherwidgets();
        };
        mItem.appendChild(sItem);

        sItem = new MenuItem();
        sItem.title = "Download Latest Version";
        sItem.onSelect = function () {
            update();
        };
        mItem.appendChild(sItem);

        sItem = new MenuItem();
        sItem.title = "Contact Support";
        sItem.onSelect = function () {
            contact();
        };
        mItem.appendChild(sItem);

        sItem = new MenuItem();
        sItem.title = "Chat about Steampunk Widgets on Facebook";
        sItem.onSelect = function () {
            facebookChat();
        };
        mItem.appendChild(sItem);

        mItem = new MenuItem();
        mItem.title = "Display Licence Agreement...";
        mItem.onSelect = function () {
            displayLicence();
        };
        items.push(mItem);

        mItem = new MenuItem();
        mItem.title = "-";
        items.push(mItem);

        mItem = new MenuItem();
        if (system.platform === "macintosh") {
            mItem.title = "Reveal Widget in a Finder window";
        } else {
            mItem.title = "Reveal Widget in Windows Explorer";
        }
        mItem.onSelect = function () {
            findWidget();
        };
        items.push(mItem);

        mItem = new MenuItem();
        mItem.title = "-";
        items.push(mItem);

        mItem = new MenuItem();
        mItem.title = "Reload Widget (F5)";
        mItem.onSelect = function () {
            f5press();
        };
        items.push(mItem);

		if ((preferences.imageEditPref.value !== "") && (debugFlg === "1")) {
			mItem = new MenuItem();
			mItem.title = "Edit Widget using " + preferences.imageEditPref.value;
			mItem.onSelect = function () {
				editWidget();
			};
			items.push(mItem);
	 	}

        item = new MenuItem();
        item.title = "Save Bauble Positions and Sizes";
        item.onSelect = function () {
            saveLocations();
            saveSizes();
            saveDoorStates(); 
            infoScrollText.data= "  Saved";
            infoWindow.visible = true;
            eprint("Saved");       
        };
        items.push(item);

        mainWindow.contextMenuItems = items;
        for (i = 1; i <= maxWindows; i += 1) {
            baubleWindows[i].contextMenuItems = items;
        }        mainWindow.contextMenuItems = items;

}
//=====================
//End function
//=====================
