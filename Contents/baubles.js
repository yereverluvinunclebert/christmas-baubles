/*
    Steampunk Bauble Object - version 1.4
    2 January, 2018
    Copyright 2014-2018 Dean Beedell and Harry Whitfield
    mailto:g6auc@arrl.net
*/

/*jslint multivar, this */

/*property
    appendChild, currentYearPref, data, fontFamily, getTime, hAlign, hOffset,
    hRegistrationPoint, height, interval, itemExists, kEaseOut, lines, onClick,
    onMouseEnter, onMouseExit, onMultiClick, onTimerFired, opacity,
    opacityPref, orderAbove, parent, round, size, soundPref, src, start, style,
    ticking, tooltip, vAlign, vOffset, vRegistrationPoint, value, visible,
    width, zOrder
*/

"use strict";

var Bauble, checkInDateRange, initialOpacity, maxFrameZorder, nothing, 
performCommand, pop, singlebell, taskcommand, tingingSound, checkInDateRange;

var carolFile;
var a, b, c, d, e, f, g, h;
var i, j, k, l, m, n, o, p;

var initialOpacity = preferences.opacityPref.value;

//===========================================
// function to create a bauble
//===========================================
function Bauble(parent, hOffset, vOffset, zOrder, scale, adventDate) {

        // timer for the creation of the bauble windows
        // the timer calls a function has to be created in the context of the bauble
        var baubleFadeTimer = new Timer();
        baubleFadeTimer.interval = 3;
        baubleFadeTimer.ticking = false;
        baubleFadeTimer.onTimerFired = baubleFade; 
        
        var newImage = function (parent, hOffset, vOffset, width, height, src, zOrder, opacity, hRegP, vRegP) {
            var oo = new Image();

            oo.src = src;
            oo.width = Math.round(scale * width);
            oo.height = Math.round(scale * height);
            oo.zOrder = zOrder;
            oo.opacity = opacity;             // opacity is an optional parameter

            hRegP = hRegP || 0;                     // hRegP and vRegP are optional parameters
            vRegP = vRegP || 0;

            hOffset += hRegP;
            vOffset += vRegP;

            oo.hOffset = Math.round(scale * hOffset);
            oo.vOffset = Math.round(scale * vOffset);

            oo.hRegistrationPoint = Math.round(scale * hRegP);
            oo.vRegistrationPoint = Math.round(scale * vRegP);

            parent.appendChild(oo);
            return oo;
        },
        newText = function (parent, hOffset, vOffset, width, lines, hAlign, vAlign, fontSize, fontFamily, zOrder, opacity) {
        	var t = new Text();
        	t.width   = scale * width;
        	t.lines  = lines;
        	t.vAlign  = vAlign;
        	t.hOffset = scale * hOffset;
        	t.vOffset = scale * vOffset;
        	t.opacity = opacity;
        	t.zOrder = zOrder;
        	t.size = scale * fontSize;
        	t.style.fontFamily = fontFamily;
            t.style.hAlign="center";
            parent.appendChild(t);

        	return t;
        },
        frame = new Frame(),
        base = "Resources/",
        image = newImage(frame, 11, 11, 180, 180, base + "layer" + adventDate + ".png", zOrder, initialOpacity),
        ringAroundGlass = newImage(frame, 6, 7, 197, 197, base + "ringAroundGlass.png", zOrder, initialOpacity),
        //layer5 = newImage(frame, 80, 80, 85, 85, base + "background.png", zOrder, initialOpacity),
        advent = newImage(frame, 79, 82, 87, 86, base + "advent" + adventDate + ".png", zOrder, 0),
        openDoor = newImage(frame, 79, 83, 100, 103, base + "open" + adventDate + ".png", zOrder, initialOpacity),
        door = newImage(frame, 77, 81, 100, 103, base + "door" + adventDate + ".png", zOrder, initialOpacity),
        num30 = newImage(frame, 106, 118, 33, 25, base + adventDate + ".png", zOrder, initialOpacity),
        hinge = newImage(frame, 163, 115, 19, 26, base + "hinge.png", zOrder, initialOpacity),
        baubledate = newImage(frame, 0, 50, 224, 124, base + "baubledate.png", zOrder, 0),
        baubleTooltip = newImage(frame, 0, 0, 166, 89, base + "baubleTooltip.png", zOrder, 0),
        
        baubleTooltipText = newText(frame, 20, 40, 130, 1, 0, 0,  13, "times", zOrder, 0),
        baubleTooltipText2 = newText(frame, 20, 55, 130, 1, 0, 0,  10, "times", zOrder, 0),
        
        nullimage = newImage(frame, 0, 0, 224, 124, base + "baubledate.png", zOrder, 0),
        that = this;

    this.size = 100 * scale;
    this.parent = parent;
    
    parent.width = 200 * scale;
    parent.height = 200 * scale;

    image.tooltip = " The " + ordinal_suffix_of(adventDate) + " day of Advent ";
    if (adventDate === 24) {
        image.tooltip = "        Christmas Eve !";        
    }
    
    if (adventDate === 25) {
        image.tooltip = "        Christmas Day !";                
    }
    
    door.visible = true;
    advent.visible = false;
    openDoor.visible = false;
    
    //creating tooltips
    
    openDoor.tooltip = "Click on me to close...";
    door.tooltip = "Click on me to open the " + ordinal_suffix_of(adventDate) + " bauble of Advent  " ;
    baubleTooltipText.data = image.tooltip;
    
    //===========================================
    // this next section formats the original filename to display the song title on the scroll tooltip
    //===========================================
    carolFile = getFileOnly(extPath[adventDate]);        // get just the filename, drop the folder
    carolFile = carolFile.substring(3);                   // remove the first 3 chars being the number and a space
    carolFile = carolFile.substr(0,carolFile.length - 4);  // remove the last four characters being the mp3 suffix
    carolFile = titleCase(carolFile);                     // change the file name to title case
                                                        // next pad the string and fit it into a string
    carolFile = formatted_string("                             ", carolFile, 'l'); 
    if (preferences.showCarolPref.value === "enable") {  // only display if the user does not want a carol surprise
        baubleTooltipText2.data = carolFile;        
    }
    
    
    //===========================================
    // function of bauble - this function could open the location of the music track
    //===========================================
    image.onMultiClick = function () {
        if (preferences.soundPref.value === "enable") {
            play(tingingSound, false);
        }

    };
    //=====================
    //End function
    //=====================


    //===========================================
    // function of bauble - this function
    //===========================================
    openDoor.onClick = function () {
        if (preferences.soundPref.value === "enable") {
            play(nothing, true);
            play(pop, false);
        }
        door.visible = true;
        advent.visible = false;
        openDoor.visible = false;
        num30.opacity = 255;
    };
    //=====================
    //End function
    //=====================

    //===========================================
    // function of bauble - this function
    //===========================================
    door.onClick = function () {
        var today = new Date();
        var ff = today.getTime();
        var christmas;
        var yearNow = preferences.currentYearPref.value;

        frame.orderAbove(null);
        frame.zOrder = maxFrameZorder;
        // stupid American date ranges , modified the from range so that it can be run at any time for a year onward
        if (checkInDateRange("11/30/" + yearNow, "1/6/" + yearNow + 1, ff)) {
            if (preferences.soundPref.value === "enable") {
                play(pop, false);
            }
            door.visible = false;
            openDoor.visible = true;
            advent.visible = true;
            num30.opacity = 0;
            
            openDoor.opacity = 255;
            advent.opacity = 255;
            openDoor.opacity = 255;

            // christmas = system.widgetDataFolder + adventDate + ".mp3";
            // previously the mp3s were found in the widget's resources folder
            // they are now extracted to the running widget's data folder
            // and the location is described in an array extPath
            
            christmas = extPath[adventDate];

            if (preferences.soundPref.value === "enable") {
                play(nothing, true);
                var thisSong = preferences["bauble" + adventDate + "Mp3"].value;
                if (thisSong === "") {
                    var exists = filesystem.itemExists(christmas);
                    if (exists) {
                        eprint("Playing " + christmas);
                        play(christmas, false);   
                    } else {
                        eprint("No song found");
                    }                
                } else {
                    var exists = filesystem.itemExists(thisSong);
                    if (exists) {
                        eprint("Playing " + thisSong);
                        play(thisSong, false);
                    } else {
                        eprint("No song found");
                    }
                }
            }
        } else {
            baubledate.opacity = 255;
            if (preferences.soundPref.value === "enable") {
                play(singlebell, false);
            }
        }
    };
    //=====================
    //End function
    //=====================

    //===========================================
    // function of bauble - this function
    //===========================================
    baubledate.onClick = function () {
        baubledate.opacity = 0;
        if (preferences.soundPref.value === "enable") {
            play(tingingSound, false);
        }
    };
    //=====================
    //End function
    //=====================

    //===========================================
    // function of bauble - this function capture the mouse over event
    //===========================================
    this.parent.onMouseEnter = function () {
        baubleTooltip.opacity = 255;
        baubleTooltipText.opacity = 255;
        baubleTooltipText2.opacity = 255;
        baubleFadeTimer.ticking = false;
        //eprint("enter");
        a = new FadeAnimation(image, 255, 100, animator.kEaseOut);
        b = new FadeAnimation(ringAroundGlass, 255, 100, animator.kEaseOut);
        d = new FadeAnimation(advent, 255, 100, animator.kEaseOut);
        e = new FadeAnimation(door, 255, 100, animator.kEaseOut);
        f = new FadeAnimation(hinge, 255, 100, animator.kEaseOut);
        if (openDoor.visible != true) {
            g = new FadeAnimation(num30, 255, 100, animator.kEaseOut);
        }
        h = new FadeAnimation(openDoor, 255, 255, animator.kEaseOut); //, fadeTooltip
        animator.start([a, b, d, e, f, g, h]);
    };
    //=====================
    //End function
    //=====================
    


    //===========================================
    // function of bauble - this function fades out the animation by triggering a timer
    //===========================================
    this.parent.onMouseExit = function () {
        baubleTooltip.opacity = 0;
        baubleTooltipText.opacity = 0;
        baubleTooltipText2.opacity = 0;
        if (openDoor.visible != true) {
            //eprint("exit");
            baubleFadeTimer.ticking = true;
        }
    };
    //=====================
    //End function
    //=====================

        
    //===========================================
    // function of bauble - this function fades out the animation called by a timer to prevent an animation conflict that causes flashing baubles
    //===========================================
    function baubleFade() {
        // the timer that calls this function has to be created in the context of the bauble
        a = new FadeAnimation(image, 50, 500, animator.kEaseOut);
        b = new FadeAnimation(ringAroundGlass, 50, 500, animator.kEaseOut);
        d = new FadeAnimation(advent, 50, 500, animator.kEaseOut);
        e = new FadeAnimation(door, 50, 500, animator.kEaseOut);
        f = new FadeAnimation(hinge, 50, 500, animator.kEaseOut);
        g = new FadeAnimation(num30, 50, 500, animator.kEaseOut);
        h = new FadeAnimation(openDoor, 50, 500, animator.kEaseOut);
        animator.start([a, b, d, e, f, g, h]);
    };
    //=====================
    //End function
    //=====================






    //===========================================
    // function of bauble - rescale images and text
    //===========================================
    this.reScale = function (scale) {
        //===========================================
        // function of reScale - rescale image
        //===========================================    
        var scaleImage = function (o, hOffset, vOffset, width, height, hRegP, vRegP) {
            o.width = Math.round(scale * width);
            o.height = Math.round(scale * height);

            hRegP = hRegP || 0;                     // hRegP and vRegP are optional parameters
            vRegP = vRegP || 0;

            hOffset += hRegP;
            vOffset += vRegP;

            o.hOffset = Math.round(scale * hOffset);
            o.vOffset = Math.round(scale * vOffset);

            o.hRegistrationPoint = Math.round(scale * hRegP);
            o.vRegistrationPoint = Math.round(scale * vRegP);
        };
        //===========================================
        // function of reScale - rescale text
        //===========================================    
        var scaleText = function (o, hOffset, vOffset, width, height,  fontSize) {
                o.width  = Math.round(scale * width);
            	//o.height = Math.round(Scale * height);

            	o.hOffset = Math.round(scale * hOffset);
            	o.vOffset = Math.round(scale * vOffset);

                o.style.fontsize = (fontSize * scale + "px");

        };

        scaleImage(that.image, 11, 11, 180, 180);
        scaleImage(that.ringAroundGlass, 6, 7, 197, 197);
        //scaleImage(that.layer5, 80, 80, 85, 85);
        scaleImage(that.advent, 79, 83, 87, 86);
        scaleImage(that.openDoor, 79, 85, 100, 103);
        scaleImage(that.door, 77, 81, 100, 103);
        scaleImage(that.num30, 106, 118, 33, 25);
        scaleImage(that.hinge, 163, 115, 19, 26);
        scaleImage(that.baubleTooltip,  0, 0, 166, 89);
        scaleText(that.baubleTooltipText,  20, 40, 130, 89, 13);
        scaleText(that.baubleTooltipText2,  20, 55, 130, 89, 10);
        scaleImage(that.baubledate, 0, 50, 19, 26);

        that.frame.width = 615 * scale;
        that.frame.height = 607 * scale;
        
        that.parent.width = 200 * scale;
    	that.parent.height = 200 * scale;
    };
    //=====================
    //End function
    //=====================

    //===========================================
    // function of bauble - when mouse scroll captured resize
    //===========================================
    function capMouseWheel(event) {
        var size = that.size,
            maxLength = Number(preferences.scalePref.maxLength),
            minLength = Number(preferences.scalePref.minLength),
            ticks = Number(preferences.scalePref.ticks),
            step = Math.round((maxLength - minLength) / (ticks - 1));

        if (event.scrollDelta > 0) {
            if (preferences.mouseWheelPref.value === "down") {
                size -= step;
                if (size < minLength) {
                    size = minLength;
                }
            } else {
                size += step;
                if (size > maxLength) {
                    size = maxLength;
                }
            }
        } else if (event.scrollDelta < 0) {
            if (preferences.mouseWheelPref.value === "down") {
                size += step;
                if (size > maxLength) {
                    size = maxLength;
                }
            } else {
                size -= step;
                if (size < minLength) {
                    size = minLength;
                }
            }
        }

        that.size = size;
        that.reScale(size / 100);
    }
    //===========================================
    // END function
    //===========================================

    //===========================================
    // function of bauble - to capture mouse scroll within the frame
    //===========================================
    frame.onMouseWheel = function (event) {
        //if (event.ctrlKey) {
            capMouseWheel(event);    //this event is not captured in the Xwidget version
        //}
    };
    //===========================================
    // END function
    //===========================================
    
    
    this.base = base;
    this.image = image;
    this.ringAroundGlass = ringAroundGlass;
    //this.layer5 = layer5;
    this.advent = advent;
    this.openDoor = openDoor;
    this.door = door;
    this.num30 = num30;
    this.hinge = hinge;
    this.baubledate = baubledate;
    this.baubleTooltip = baubleTooltip;
    this.baubleTooltipText = baubleTooltipText;
    this.baubleTooltipText2 = baubleTooltipText2;
    this.nullimage = nullimage;

    frame.hOffset = hOffset;
    frame.vOffset = vOffset;
    frame.width = 215 * scale;
    frame.height = 207 * scale;
    frame.zOrder = zOrder;
    parent.appendChild(frame);
    this.frame = frame;
}
//===========================================
// END function bauble
//===========================================
    
//===========================================
// this function places the string onto a section of text
//===========================================
function formatted_string(pad, user_str, pad_pos)
{
  if (typeof user_str === 'undefined') 
    return pad;
  if (pad_pos == 'l')
     {
     return (pad + user_str).slice(-pad.length);
     }
  else 
    {
    return (user_str + pad).substring(0, pad.length);
    }
}
//===========================================
// END function
//===========================================
    
//===========================================
// this function converts a string to Title Case
//===========================================
function titleCase(str) {
  return str.split(' ').map(function(val){ 
    return val.charAt(0).toUpperCase() + val.substr(1).toLowerCase();
  }).join(' ');
}
//===========================================
// END function
//===========================================



//===========================================
// END baubles.js
//===========================================
