
//===========================================================================
// Christmas Bauble Widget   christmas-baubles.js   version 1.4
// Originally written and Steampunked by: Dean Beedell
//
// Resizing code, window and bauble creation, advice and patience from Harry Whitfield
//
//===========================================================================

// changed the startup to call timers, preventing white boxes forming behind windows
// added a timer for adding the separate windows that support the baubles
// added a timer for adding baubles
// create the menus
// user-defined bauble size stored and set on startup
// removed all sleep statements as they too cause white backgrounds
// de-duplicate the hark the herald angels sing
// sorted the animation conflict by moving the fadeout to a delayed timer
// added the rotating sand timer to the creation of the windows and baubles.
// clicking on a bauble door should raise the bauble and retain the opacity
// finish the remaining open doors
// added two more advent images and improved two others
// moved the busy image to the unused mainwindow
// capture an error caused by a corrupt JSON save sizes file (occurred twice)
// add a 24th December bauble
// add a 25th December something
// add the remaining advent images WIP
// list the provenance of the used tracks 
// add the remaining songs
// setmenu.js fix the menus
// fixed the location saving and restoring
// list the current song's name in the scroll pop-up
// add an option to prefs to show the trackname
// save the bauble's open/closed state
// add an info window for updating the user
//===========================================================================

// right-click menu option to open the track on Amazon
// test if any bauble window is off screen, if it is, then move it back on screen
// add a random fade-in and out of an occasional widget by timer ?
// increase the opacity of today's bauble
// test the correct day's opening
// re-open each bauble with the doors opened and the opacity to full
// slider for the default opacity for re-opened widgets
// add check to see if the doors needs to be open or not
// test operation as a .widget, check it ALL works as expected
// 


// No.  Track Name                          Singers             Source CD/youtube                   
//============================================================================
// 1. Walking in the air                    Aled Jones          NOW That's What I Call Christmas  
// 2. Away in a manger                      Kings College       O Come All Ye Faithful 
// 3. In the bleak midwinter                Kings College       O Come All Ye Faithful 
// 4. Hark the herald angels sing           Kings College       O Come All Ye Faithful 
// 5. Do They Know It's Christmas?          Band Aid 20         NOW That's What I Call Christmas 
// 6. Sussex carol                          Kings College       O Come All Ye Faithful 
// 7. Ding Dong! Merrily On High            Kings College       O Come All Ye Faithful 
// 8. The First Nowell                      Kings College       O Come All Ye Faithful 
// 9. Coventry Carol  Lully Lulla           Kings College       O Come All Ye Faithful 
// 10. God Rest You Merry, Gentlemen        Kings College       O Come All Ye Faithful 
// 11. O Come, All Ye Faithful              Kings College       O Come All Ye Faithful 
// 12. The Holly and the Ivy                Kings College       O Come All Ye Faithful 
// 13. Gaudete (2003 - Remaster)            Steeleye Span       NOW That's What I Call Christmas        
// 14. Stille Nacht Heilige nacht
// 15. Merry Christmas Everybody            Slade               NOW That's What I Call Christmas -              
// 16. While Shepherds Watched Their Flocks Kings College       Youtube                              
// 17. Lullaby, my Jesus                    Warlock
// 18. Silent Night                         Kings College       O Come All Ye Faithful  
// 19. Once in Royal Davids City            Kings College       O Come All Ye Faithful 
// 20. O Little Town Of Bethlehem           Kings College       O Come All Ye Faithful 
// 21. In Dulci Jubilo                      Kings College       Youtube
// 22. Little jesus sweetly sleep           Truro Cath. Choir   Youtube When He is King - Music For Christmas
// 23. I saw three ships come sailing in    Kings College       O Come All Ye Faithful                              
// 24. Away in a Manger - Traditional       Notts Cath. Choir   Youtube 
// 25. Joy To The World                     Kings College       O Come All Ye Faithful
// 
//===========================================================================

/*jslint for, multivar */

/*property
    availWidth, debugflgPref, getTime, hOffset, height, hidden, imageEditPref,
    interval, itemExists, name, onTimerFired, parse, push, readFile,
    savedLocations, savedSizes, shadow, size, src, stringify, ticking, title,
    vOffset, value, visible, widgetDataFolder, width, writeFile
*/

"use strict";

var Bauble, Date, JSON, Number, Scale, aVar, bScale, baubleNo, baubleTimer, 
    baubleWindowNo, baubleWindowTimer, baubleWindows, baubles, buildVitality, 
    busyCounter, checkInDateRange, christmas, createBaubleWindows, createBaubles, 
    createLicence, currIcon, eprint, ff, inithoffset, initvoffset, mainScreen, 
    mainWindow, mainWindowheightDefault, mainWindowwidthDefault, makeBaubles, 
    maxBaubles, maxFrameZorder, maxWindows, moveWindows, nothing, 
    ordinal_suffix_of, pop, resizeIt, restoreLocations, saveLocations, 
    saveSizeLocs, saveSizes, saveTimer, saved, screenWidth, setmenu, singlebell, 
    startTimer, startup, tingingSound, today, widgetName, windowInterval, debugFlg;

//resizing variables
mainWindowwidthDefault = mainWindow.width;
mainWindowheightDefault = mainWindow.height;

tingingSound = "Resources/ting.mp3";
pop = "Resources/pop.mp3";
currIcon = "Resources/icon.png";
christmas = "Resources/christmas.mp3";
nothing = "Resources/nothing.mp3";
singlebell = "Resources/singleBell.mp3";

widgetName = widget.name;

inithoffset = 0;
initvoffset = 0;
maxFrameZorder = 25;
Scale = 1;
screenWidth = screen.availWidth;

today = new Date();
ff = today.getTime();

baubleWindows = [];
maxWindows = 25;
baubles = [];
maxBaubles = 25;

busyCounter = 1;
windowInterval = preferences.delayPref.value / 10 ; //0.1;
baubleNo = 0;
baubleWindowNo = 0;
saved = "";
var extPath = [];
var file_extension = "";

bScale = [
       0.73,0.38,0.46,0.68,0.78,0.46,0.46,0.68,0.78,0.71,0.57,0.56,
       0.36,0.38,0.97,0.99,0.32,0.36,0.52,0.76,0.69,0.36,0.54,0.85,1.05];
    
 // extract the mp3 files to the widget data folder
    for (i = 1; i <= maxWindows; i += 1) {
       extPath[i] = widget.extractFile( "Resources/"+i+".mp3");
       if (i === 1) { extPath[i] = widget.extractFile( "Resources/1  walking in the air.mp3"); }
       if (i === 2) { extPath[i] = widget.extractFile( "Resources/2  away in a manger.mp3"); }
       if (i === 3) { extPath[i] = widget.extractFile( "Resources/3  in the bleak midwinter.mp3"); }
       if (i === 4) { extPath[i] = widget.extractFile( "Resources/4  hark the herald angels sing.mp3"); }
       if (i === 5) { extPath[i] = widget.extractFile( "Resources/5  do they know its christmas.mp3"); }
       if (i === 6) { extPath[i] = widget.extractFile( "Resources/6  sussex carol.mp3"); }
       if (i === 7) { extPath[i] = widget.extractFile( "Resources/7  ding dong merrily on high.mp3"); }
       if (i === 8) { extPath[i] = widget.extractFile( "Resources/8  the first nowell.mp3"); }
       if (i === 9) { extPath[i] = widget.extractFile( "Resources/9  coventry carol.mp3"); }
       if (i === 10) { extPath[i] = widget.extractFile( "Resources/10 god rest you merry gentlemen.mp3"); }
       if (i === 11) { extPath[i] = widget.extractFile( "Resources/11 o come all ye faithful.mp3"); }
       if (i === 12) { extPath[i] = widget.extractFile( "Resources/12 the holly and the ivy.mp3"); }
       if (i === 13) { extPath[i] = widget.extractFile( "Resources/13 gaudete.mp3"); }
       if (i === 14) { extPath[i] = widget.extractFile( "Resources/14 stille nacht heilige nacht.mp3"); }
       if (i === 15) { extPath[i] = widget.extractFile( "Resources/15 merry christmas everybody.mp3"); }
       if (i === 16) { extPath[i] = widget.extractFile( "Resources/16 while shepherds watched their flocks.mp3"); }
       if (i === 17) { extPath[i] = widget.extractFile( "Resources/17 lullaby my jesus.mp3"); }
       if (i === 18) { extPath[i] = widget.extractFile( "Resources/18 silent night.mp3"); }
       if (i === 19) { extPath[i] = widget.extractFile( "Resources/19 once in royal davids city.mp3"); }
       if (i === 20) { extPath[i] = widget.extractFile( "Resources/20 o little town of bethlehem.mp3"); }
       if (i === 21) { extPath[i] = widget.extractFile( "Resources/21 in dulci jubilo.mp3"); }
       if (i === 22) { extPath[i] = widget.extractFile( "Resources/22 little jesus sweetly sleep.mp3"); }
       if (i === 23) { extPath[i] = widget.extractFile( "Resources/23 i saw three ships come sailing in.mp3"); }
       if (i === 24) { extPath[i] = widget.extractFile( "Resources/24 away in a manger.mp3"); }
       if (i === 25) { extPath[i] = widget.extractFile( "Resources/25 joy to the world.mp3"); }
       //print("extPath[i] "+ extPath[i]);
    }

 // place the mp3 files into the prefs only if the prefs are blank
    for (i = 1; i <= maxWindows; i += 1) {
        //if (preferences["bauble" + i + "Mp3"].value === "") {   
            preferences["bauble" + i + "Mp3"].value = extPath[i];
        //}
    }


//===========================================
// timer creation
//===========================================

// timer for the creation of the bauble windows
baubleWindowTimer = new Timer();
baubleWindowTimer.interval = windowInterval;
baubleWindowTimer.ticking = false;
baubleWindowTimer.onTimerFired = createBaubleWindows;

// timer for the regular saving of sizes and postions
saveTimer = new Timer();
saveTimer.interval = 20;
saveTimer.ticking = false;
saveTimer.onTimerFired = saveSizeLocs;

// timer for the creation of the baubles themselves
baubleTimer = new Timer();
baubleTimer.interval = windowInterval;
baubleTimer.ticking = false;
baubleTimer.onTimerFired = createBaubles;

startTimer = new Timer();
startTimer.interval = 1;
startTimer.ticking = false;
startTimer.onTimerFired = moveWindows;

//===========================================
// timer creation ENDS
//===========================================


//===========================================
// this function writes the debug data to a log file
//===========================================
function eprint(s) {
    if (debugFlg === "1") {
        filesystem.writeFile(system.widgetDataFolder + "/log.txt", s + "\r\n", true);
        print(s);
    }
}
//=====================
//End function
//=====================






//===========================================
// this function called by a timer creates bauble windows
//===========================================
function createBaubleWindows() {
    var window;
    
    busyCounter = busyCounter + 1;
    if (busyCounter >= 7) {
        busyCounter = 1;
    }
    busy.src = "Resources/busy-F" + busyCounter + "-32x32x24.png";
    
    baubleWindowNo = baubleWindowNo + 1;
    eprint("running createBaubleWindows number " + baubleWindowNo);
    
    if  (baubleWindowNo >= Number(maxWindows)) { 
          baubleWindowTimer.ticking = false; // stop the window creation timer
          makeBaubles(); // this is the next step that creates the baubles
    }
    window = new Window();
    window.visible = true;
    window.name = "baubleWindow" + baubleWindowNo;
    window.width = 200;		// for 100% scale - reest later
    window.height = 200;	// for 100% scale - reset later
    window.title = "Christmas Bauble No." + baubleWindowNo;
    window.shadow = false;
    baubleWindows[baubleWindowNo] = window;
}
//=====================
//End function
//=====================


//===========================================
// this function is a stub to read the saved sizes and kick off the bauble timer
//===========================================
function makeBaubles() {
    var path = system.widgetDataFolder + "/saved_sizes.json";
    eprint("running makeBaubles ");

    if (filesystem.itemExists(path)) {
        eprint(path + " exists");
        saved = filesystem.readFile(path, true);    // aslines
        if (saved) {
            saved = saved[0];                       // first line
        } else {
            saved = "";
        }
        eprint("savedSizes; " + saved);
    } else {
         eprint(path + " does not exist - default sizes applied");
    }

    if (saved === "") {
        saved = preferences.savedSizes.value;
    } else {
        preferences.savedSizes.value = saved;
    }
    baubleTimer.ticking = true;
}
//=====================
//End function
//=====================

//===========================================
// this function, called by a timer, creates baubles
//===========================================
function createBaubles() {

    busyCounter = busyCounter + 1;
    if (busyCounter >= 7) {
        busyCounter = 1;
    }
    busy.src = "Resources/busy-F" + busyCounter + "-32x32x24.png";

    baubleNo = baubleNo + 1;

    if (baubleNo >= Number(maxBaubles)) { 
        busy.visible = false;
        busyBlur.visible = false;
        baubleTimer.ticking = false;
        startTimer.ticking = true;
        saveTimer.ticking = true;
        infoWindow.visible = false;
        setmenu();
    }
    
    if (saved !== "") {
        eprint("running createBaubles " + baubleNo);

        //if the json is corrupted we need to have a backup plan
        try {
            aVar = JSON.parse(saved);
            if (aVar[baubleNo - 1] === 0) {
                aVar[baubleNo - 1] = 0.6;
            }
        } catch (err) {
            // capture an error caused by a corrupt JSON file (occurred twice)
            baubles[baubleNo] = new Bauble(baubleWindows[baubleNo], 0, 0, baubleNo, Scale * bScale[baubleNo - 1], baubleNo);        
        }
        //eprint("a.length: " + aVar.length);
        //eprint("a: " + aVar.toString());

        baubles[baubleNo] = new Bauble(baubleWindows[baubleNo], 0, 0, baubleNo, Scale * aVar[baubleNo - 1], baubleNo);
    } else {
        baubles[baubleNo] = new Bauble(baubleWindows[baubleNo], 0, 0, baubleNo, Scale * bScale[baubleNo - 1], baubleNo);        
    }
}
//=====================
//End function
//=====================

//===========================================
// this stub function called by a timer saves the resized and relocated widgets
//===========================================
function saveSizeLocs() {
    saveLocations();
    saveSizes();
}
//=====================
//End function
//=====================

//===========================================
// this function called by a timer saves the resized widgets
//===========================================
function saveSizes() {
    var i;
    var aa = [];
    var path = system.widgetDataFolder + "/saved_sizes.json";
    var savedSizes;
    var theSize;

    for (i = 0; i < maxWindows; i += 1) {
        theSize = baubles[i + 1].size;
        aa[i] = theSize / 100;  //aa.push(baubles[i + 1].size / 100);
    }
    savedSizes = JSON.stringify(aa);
    filesystem.writeFile(path, savedSizes + "\r\n");
    //eprint("savedSizes; " + savedSizes);
    preferences.savedSizes.value = savedSizes;
    savePreferences();
    //sleep(1000);
}
//=====================
//End function
//=====================

//===========================================
// this function
//===========================================
function saveDoorStates() {
    var i;
    var a;
    var aa = [];
    var path = system.widgetDataFolder + "/saved_door_states.json";
    var savedDoorStates;

    for (i = 0; i < maxWindows; i += 1) {
        a = baubles[i+1].openDoor.visible;
        aa.push(a);
        eprint("baubles[i+1].openDoor.visible "+(i+1)+ " "+baubles[i+1].openDoor.visible);                    
        //eprint("aa "+ aa);                    
    }
    
    savedDoorStates = JSON.stringify(aa);
    //eprint("aa "+ aa);                    
    filesystem.writeFile(path, savedDoorStates + "\r\n");
    //eprint("savedDoorStates; " + savedDoorStates);
    preferences.savedLocations.value = savedDoorStates;
    savePreferences();
    //sleep(1000);
}
//=====================
//End function
//=====================



//===========================================
// this function
//===========================================
function restoreDoorStates() {
    var i;
    var a;
    var aa;
    var savedDoorStates = "";
    var path = system.widgetDataFolder + "/saved_door_states.json";
    
    if (filesystem.itemExists(path)) {
        print(path + " exists");
        savedDoorStates = filesystem.readFile(path, true);    // aslines
        if (savedDoorStates) {
            savedDoorStates = savedDoorStates[0];                       // first line
        } else {
            savedDoorStates = "";
        }
    }
    eprint("savedDoorStates; " + savedDoorStates);
///*
    if (savedDoorStates !== "") {
        aa = JSON.parse(savedDoorStates);
        //eprint("aa.length: " + aa.length);
        //eprint("aa: " + aa.toString());

        for (i = 0; i < maxWindows; i += 1) {
            //eprint("i "+ i);
            //eprint("maxWindows "+ maxWindows);
            a = aa[i];
            //eprint("a "+ a);
            eprint("baubles[i+1].openDoor.visible "+(i+1)+ " "+baubles[i+1].openDoor.visible);                    
            if (a === true) {
                baubles[i+1].door.visible = false;
                baubles[i+1].openDoor.visible = true;
                baubles[i+1].advent.visible = true;
                baubles[i+1].num30.opacity = 0;
                //baubles[i+1].opacity = 255;
            }
        }
    } else {
        eprint("No saved door states found.");
    }
//*/
    
}
//=====================
//End function
//=====================


//===========================================
// this function
//===========================================
function saveLocations() {
    var i;
    var a;
    var aa = [];
    var path = system.widgetDataFolder + "/saved_locations.json";
    var savedLocations;

    for (i = 0; i < maxWindows; i += 1) {
        a = [];
        a[0] = baubleWindows[i+1].hOffset;
        a[1] = baubleWindows[i+1].vOffset;
        aa.push(a);
        
        if (i === 25) {                
            eprint("baubleWindows[i].hOffset "+ baubleWindows[i].hOffset);            
            eprint("baubleWindows[i].vOffset "+ baubleWindows[i].vOffset);            
        }
        
    }
    savedLocations = JSON.stringify(aa);
    filesystem.writeFile(path, savedLocations + "\r\n");
    
    eprint("path; " + path);
    eprint("savedLocations; " + savedLocations);
    
    preferences.savedLocations.value = savedLocations;
    savePreferences();
    //sleep(1000);
}
//=====================
//End function
//=====================


function restoreDoorStates2() {

}
//=====================
//End function
//=====================


//===========================================
// this function
//===========================================
function restoreLocations() {
    var i;
    var a;
    var aa;
    var saved = "";
    var path = system.widgetDataFolder + "/saved_locations.json";
    
    if (filesystem.itemExists(path)) {
        print(path + " exists");
        saved = filesystem.readFile(path, true);    // aslines
        if (saved) {
            saved = saved[0];                       // first line
        } else {
            saved = "";
        }
    }
    //eprint("savedLocations; " + saved);

    if (saved === "") {
        saved = preferences.savedLocations.value;
    } else {
        preferences.savedLocations.value = saved;
    }

    if (saved !== "") {
        aa = JSON.parse(saved);
        //eprint("aa.length: " + aa.length);
        //eprint("aa: " + aa.toString());

        for (i = 0; i < maxWindows; i += 1) {
            //eprint("i "+ i);
            //eprint("maxWindows "+ maxWindows);
            a = aa[i];
            //eprint("a "+ a);
            baubleWindows[i+1].hOffset = a[0];
            baubleWindows[i+1].vOffset = a[1];

            if (i === 25) {                
                eprint(">>>>>>>>>>>> baubleWindows[i].hOffset "+ baubleWindows[i].hOffset);            
                eprint(">>>>>>>>>>>> baubleWindows[i].vOffset "+ baubleWindows[i].vOffset);            
            }


        }
    } else {
        eprint("No saved locations found.");
    }
}
//=====================
//End function
//=====================

//===========================================
// this function
//===========================================
function moveWindows() {
    startTimer.ticking = false;
    restoreLocations();
    restoreDoorStates();
}
//=====================
//End function
//=====================



//===========================================
// this function runs on startup
//===========================================
function startup() {
    eprint("%-I-INFO, startup");
    debugFlg = preferences.debugflgPref.value;
    debugFlg = "1"
    if (debugFlg === "1") {
		preferences.imageEditPref.hidden = false;
		preferences.savedSizes.hidden = false;
		preferences.savedLocations.hidden = false;
	} else {
		preferences.imageEditPref.hidden = true;
		preferences.savedSizes.hidden = true;
		preferences.savedLocations.hidden = true;
	}
    
    // create the licence window
    createLicence(mainWindow);
    baubleWindowTimer.ticking = true;
    
    //makeBaubleWindows(maxWindows);    // now done via a timer
    //makeBaubles();          // now done via a timer
    //saveSizes();                      // now done via a timer
    //mainScreen();                     // no longer checks
    buildVitality(currIcon);
    //resizeIt();                       // not required as the baubles are individually resized
    //setmenu();                        // now called only when the last bauble has been created
}
//=====================
//End function
//=====================

//===========================================
// this function
//===========================================
function checkInDateRange(from, to, check) {
    var fDate = new Date(from);
    var lDate = new Date(to);
    var cDate = new Date(check);
    eprint("check " + cDate);

    return ((cDate.getTime() <= lDate.getTime()) && (cDate.getTime() >= fDate.getTime()));
}
//=====================
//End function
//=====================




//===========================================
// this function converts a number to an ordinal
//===========================================
function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}
//=====================
//End function
//=====================




//===================================
// function to get the filename only
//===================================
function getFileOnly(str) {
    //print("str" + str);
    if (str !== undefined) {
		file_extension = str.split(".").pop();
		return str.replace(/^.*[\\\/]/, "");
    }
}
//=====================
//End function
//=====================

//===================================
// function to 
//===================================
function f5press() {
            play(nothing,"true");
            saveLocations();
            saveSizes();
            saveDoorStates();
            reloadWidget();
}
//=====================
//End function
//=====================


//===========================================
// this function opens the online help file
//===========================================
infoScroll.onMouseDown= function() {
    infoWindow.visible = false;
}
//=====================
//End function
//=====================


//===========================================
// END 
//===========================================

