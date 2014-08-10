var gameWidth;
var gameHeight;

var main;
var score;
var highscore;
var speed;
var highspeed;
var FLOORHEIGHT;
var timerspeed; //1000 miliseconds is one second. Divide by 60 for 60updates per second.
var countCycles;
var p1;
//Setup the balloons.
var blnArray = [];

var theMoveMarker;

var imgRipple;

var imgCrsr;

function main ()
{
	gameWidth = window.innerWidth;
	gameHeight = window.innerHeight;
	
	
	document.getElementById("mainCanvas").width = gameWidth;
	document.getElementById("mainCanvas").height = gameHeight;
	playingArea = document.getElementById("mainCanvas");

	main;
	score = 0;
	speed = 0;
	highscore = localStorage.getItem("highscore");
	if (highscore == null)
	{
		highscore = 2000;
	}
	highspeed = localStorage.getItem("highspeed");
	if (highspeed == null)
	{
		highspeed = 32;
	}
	
	FLOORHEIGHT = 320;
	timerspeed = 1000/60; //1000 miliseconds is one second. Divide by 60 for 60updates per second.
	countCycles = 0;
	mainTimer = setInterval("Game.update();", timerspeed);
	var throwaway = setInterval(function () {a = new enemyChaser(Utilities.randomIntInRange(64, (gameWidth) - 64), 0);}, 500);
	p1 = new player(200, 200, 0, 0); //Keyword new is necessary to instantiate.

	/*
	//Setup the balloons.
	blnArray = [];

	for (i = 0; i < 10; i++) 
	{
		blnArray[i] = new balloon(i * 64 + 32, FLOORHEIGHT );
	}
	*/


	theMoveMarker = null;

	imgRipple = new Image;
	imgRipple.src='./images/ripple.png';

	imgCrsr = new Image;
	imgCrsr.src='./images/boundbox16x16.png';

	imgbb16 = new Image;
	imgbb16.src='./images/fp_downhard_lr.png';//The page will blow up if we don't load the image data before we get to the draw. Better to put the images in the onload or header somewhere.
	
	GLDraw.start();
}