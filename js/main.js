var main;
var score = 0;
var highscore = 50;
var FLOORHEIGHT = 320;
var timerspeed = 1000/60; //1000 miliseconds is one second. Divide by 60 for 60updates per second.
var countCycles = 0;
mainTimer = setInterval("updateEverything();", timerspeed);
var p1 = new player(200, 200, 0, 0); //Keyword new is necessary to instantiate.

//Setup the balloons.
var blnArray = [];

for (i = 0; i < 10; i++) 
{
	blnArray[i] = new balloon(i * 64 + 32, FLOORHEIGHT );
}


//var theMoveMarker = new moveMarker(200, 200, 0, 0);
var theMoveMarker = null;

var imgRipple = new Image;
imgRipple.src='./images/ripple.png';

var imgCrsr = new Image;
imgCrsr.src='./images/boundbox16x16.png';

var imgbb16 = new Image;
imgbb16.src='./images/fp_downhard_lr.png';//The page will blow up if we don't load the image data before we get to the draw. Better to put the images in the onload or header somewhere.