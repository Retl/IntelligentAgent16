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
	var throwaway = setInterval(Game.generateEnemy, 500);
	p1 = new player(200, 200, 0, 0); //Keyword new is necessary to instantiate.

	theMoveMarker = null;

	imgRipple = new Image;
	imgRipple.src='./images/ripple.png';

	imgCrsr = new Image;
	imgCrsr.src='./images/boundbox16x16.png';

	imgbb16 = new Image;
	imgbb16.src='./images/fp_downhard_lr.png';//The page will blow up if we don't load the image data before we get to the draw. Better to put the images in the onload or header somewhere.
	
	GLDraw.start();
};


Game.generateEnemy = function ()
{
	var sel = Utilities.randomIntInRange(0,3);
	switch (sel)
	{
		case 0:
			a = new enemyChaser(Utilities.randomIntInRange(64, (gameWidth) - 64), 0);
			break;
		
		case 1:
			a = new enemyChaser(Utilities.randomIntInRange(64, (gameWidth) - 64), gameHeight);
			break;
		
		case 2:
			a = new enemy(Utilities.randomIntInRange(64, (gameWidth) - 64), 0);
			break;
		
		case 3:
			a = new bouncer(Utilities.randomIntInRange(64, (gameWidth) - 64), 0);
			break;
			
			
		default:
			if (debugMode) {console.log("Game.generateEnemy attempted to default on the creation.");}
			break;
	}
};


Game.update = function ()
{
	if (gamePlaying)
	{
		//Update the timer.
		var currentUpdate = Date.now();
		dt = (currentUpdate - lastUpdate) / 1000.0;
		lastUpdate = currentUpdate;

		timeRemaining -= dt;
		timeElapsed = (currentUpdate - firstUpdate) / 1000.0;

		if (timeRemaining <= 0)
		{
			timeRemaining = 0;
			gamePlaying = false;
			localStorage.setItem("highscore", highscore);
			localStorage.setItem("highspeed", highspeed);
		}
	}

	//Call the update() method on all game objects.
	Game.callOnAll(function (currentGameObject) {currentGameObject.update();});

	if(p1 != null)
	{
		//p1.apInc();
		//p1.update();

		//p1.x = mousex;
		//p1.y = mousey;
		clearDisplay();
		testDrawBlackRect();
		//drawCircle(mainCanvas.width / 2, mainCanvas.height / 2, calcDistance(mainCanvas.width / 2, mainCanvas.height / 2, p1.x, p1.y));
		//drawCir$cleMarker(p1.x, p1.y);

		if (score > highscore) {highscore = score;} //Updates the highscore after it has been broken.
		if (speed > highspeed) {highspeed = speed;} //Updates the highspeed after it has been broken.

		drawTextSmall(32, 16, "You are the big one. Aiming within your Area of Influence moves you. Aiming outside uses the Snipe Shot.");
		
		drawTextSmall(32, 32, "Highscore: " + highscore);
		drawTextSmall(32, 48, "Score: " + score);
		drawTextSmall(32, 64, "Time Remaining: " + timeRemaining.toFixed(2));
		drawTextSmall(32, 80, "Time Spent: " + timeElapsed.toFixed(2));
		drawTextSmall(32, 96, "High Speed: " + Number.parseFloat(highspeed).toFixed(2));
		drawTextSmall(32, 112, "dt: " + dt);
		
		if (!gamePlaying)
		{
			drawTextSmall(gameWidth / 2, gameHeight / 2, "-{Session Terminated}-");
		}

		//Display things to help in debugging the game.
		if (debugMode) 
		{
			drawTextSmall(32, 128, "Content of input array: " + keyCodeArray.join()); 
			if (theMoveMarker != null && p1 != null) 
			{
				drawTextSmall(32, 144, "IsPlayerNearby(); " + theMoveMarker.isPlayerNearby());
				drawTextSmall(32, 160, "IsPositionNearby(); " + theMoveMarker.isPositionNearby(p1.x, p1.y));
				drawTextSmall(32, 176, "distance() <= 5; " + Utilities.distance(theMoveMarker.x, theMoveMarker.y, p1.x, p1.y) <= 16);
				drawTextSmall(32, 194, "distance(); " + Utilities.distance(theMoveMarker.x, theMoveMarker.y, p1.x, p1.y));
			}
		}

	}

	if (gl != null)
	{
		//Do stuff?
		GLDraw.clear();
	}

	//Process the inputs captured...
	processSpecialKeys();
	//NOTE: All input processing should be done before you end the input cycle.
	endInputCycle();
	
	Game.draw();
	
	while (Game.removables.length > 0)
	{
		Game.removeUpdateableImmediate(Game.removables.length - 1);
		Game.removables.pop();
	}
};
