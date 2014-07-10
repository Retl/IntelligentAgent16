// File: burstparty.js
// Author: Carlis Moore
// Date of Creation: 20 February 2014
// Date of Last Update: 26 April 2014
// Base Code: http://retl.info/experimental/ffxiiiatb.js
// Purpose: Same as listed in .htm. This is a chunk of the JS that makes it go.

//Objects
var debugMode = false;

var mousex;
var mousey;

var timeRemaining = 30;
var timeElapsed = 0;
var gamePlaying = true;
var lastUpdate = Date.now();
var firstUpdate = lastUpdate;
var dt = 0;

var theLastE;

var keyCodeArray = []; //Index corresponds to keycode. Value of 0 is unpressed. Value of 1 is pressed. Value of 2 is just-pressed.

//var theMoveMarker = null;


// Keys 1-0: Menu Selection
// Key Tab: Change Menu.
// Keys Q E Enter: Cancel? Generic Action? 

function moveMarker(xpos, ypos)
		{
		if (theMoveMarker == null)
				{
				 this.x = xpos;
				 this.y = ypos;
				 
				
				//Short for Action Point Incrementer.
				this.isPositionNearby = function(otherX, otherY) 
				{
					var result = false;
					if (distance(this.x, this.y, otherX, otherY) <= 32)
					{
						//Given position is within 5 pixels of our own position.
						result = true;
					}
				return result;
				}
				
				this.isPlayerNearby = function()
				{
					result = false;
					if(p1 != null)
					{
					result = this.isPositionNearby(p1.x, p1.y);
					}
					
					return result;
				}
				
				
				this.jumpToPosition = function(newX, newY)
				{
					this.x = newX;
					this.y = newY;
				}
				
				//This is a method that should be called on each object of this type every loop. It's similar to 'step' in Gamemaker or Update() in Unity 3D. - Moore
				//this.update = update;
				this.update = function()
				{
					if (this.isPlayerNearby())
					{
						//If the player is nearby, deactivate/remove this mouseMarker.
						if (p1 != null) {p1.jump();}
						theMoveMarker = null;
					}
				}
				
				this.draw = function()
				{
					var offsetX = imgCrsr.width / 2;
					var offsetY = imgCrsr.height / 2;
					drawImg(this.x - offsetX, this.y - offsetY, imgCrsr);
				}

				 return this;
			 }
			 else
			 {
				return theMoveMarker;
			 }
		 }
		 
		 function player(xpos, ypos, myid, mynum)
		{
			//Properties that shouldn't change after the object is instantiated.
			this.accelerationHorizontalRate = 16;
			 
			 
			 //Properties that change frequently.
			 this.x = xpos;
			 this.y = ypos;
			 this.xsub = 0;
			 this.ysub = 0;
			 this.xspeed = -5; //In Subpixels.
			 this.yspeed = 1; //In Subpixels.
			 this.canJump = true;
			 this.myid = myid;
			 this.mynum = mynum;
			 
			 this.apMax = 400;
			 this.ap = this.apMax;
			 this.rap = 0; //Reserve AP.
			 
			//player Methods
			this.apInc=apInc; //This is necessary for function visibility.
			
			//Short for Action Point Incrementer.
			function apInc() 
			{
				if (this.ap < this.apMax)
				{
					this.ap++;					
				}
				
				if (this.rap < this.apMax)
				{
					this.rap++;					
				}
			return this.ap;
			}
			
			//Player-specific utilities
			this.isPositionNearby = function(otherX, otherY)  //Is there a better way to give this to player and move markers and stuff? Maybe via subclass?
				{
					var result = false;
					if (distance(this.x, this.y, otherX, otherY) <= 32)
					{
						//Given position is within 16 pixels of our own position.
						result = true;
					}
				return result;
				}
				
				this.isMoveMarkerNearby = function()
				{
					result = false;
					if(theMoveMarker != null)
					{
						result = this.isPositionNearby(theMoveMarker.x, theMoveMarker.y);
					}
					
					return result;
				}
			
			//Player movement commands
			this.moveLeft = function()
			{
				if (this.xspeed > 0)
				{
					this.xspeed -= 2 * this.accelerationHorizontalRate;
				}
				else
				{
					this.xspeed -= this.accelerationHorizontalRate;
				}
			}
			
			this.moveRight = function()
			{
				if (this.xspeed < 0)
				{
					this.xspeed += 2 * this.accelerationHorizontalRate;
				}
				else
				{
					this.xspeed += this.accelerationHorizontalRate;
				}
			}
			
			this.slowDownNeutral = function()
			{
				if (this.xspeed > 0) { this.xspeed -= 16;}
				else if (this.xspeed < 0) {this.xspeed += 16;}
			}
			
			this.jump = function()
			{
				if (this.canJump)
				{
					this.canJump = false;
					if (this.yspeed <= 0) {this.yspeed -= 756;}
					else {this.yspeed = -756;}
				}
			}
			
			this.quickDescent = function()
			{
				//If the player was jumping and then stopped jumping, they descend faster. Following theMoveMarker ignores this.
			}
			
			this.followMoveMarker = function()
			{
				if (theMoveMarker != null)
				{
					if (this.x < theMoveMarker.x)
					{
						this.moveRight();
					}
					else
					{
						this.moveLeft();
					}
				}
			}
			
			//This is a method that should be called on each object of this type every loop. It's similar to 'step' in Gamemaker or Update() in Unity 3D. - Moore
			this.update = function()
			{
				
				//If there's a move marker, ignore keyboard input. If there isn't, allow keyboard input.
				if (theMoveMarker != null)
				{
					this.followMoveMarker();
				}
				else
				{
					this.processInput();
				}
				
			
				if (this.xspeed > 768) {this.xspeed -= 32;} 
				if (this.xspeed < -768) {this.xspeed += 32;} //This enforces a maximum speed by dropping the speed then ramping back up on hitting the limit. - Moore
				
				if (this.yspeed > 2048) {this.yspeed = 2048;}
				if (this.yspeed < -2048) {this.yspeed = -2048;}
				
				//Gravity pulls down.
				//If we're not at the bottom and there is no platform below us, let gravity do what it does.
				if (this.y < FLOORHEIGHT)
				{
					this.yspeed += 40; //Might want to put a toggle based on the input here to make it 40 on low or 160 on holding down / releasing up. 
				}
				else
				{
				this.canJump = true;
					if (this.yspeed > 0)
					{
						this.yspeed = 0;
						this.ysub = 0;
					}
				}
			
				//Each update, we immediately need to update positions relative to speed.
				this.xsub += this.xspeed;
				this.ysub += this.yspeed;
				
				//Wrapping/clamping Pixel to Subpixel.
				clampSubPosToMain(this, 256, 0);
				this.x = wrapAround(this.x, 0, document.getElementById("mainCanvas").width);
				this.y = wrapAround(this.y, 0, document.getElementById("mainCanvas").width);
				
			}
			
			this.processInput = function()
			{
				//START Controlling and moving the player around - Moore
				if (keyCodeArray[65] > 0){this.moveLeft();} // A key
				if (keyCodeArray[68] > 0){this.moveRight();} // D key
				if (!(keyCodeArray[65] > 0 || keyCodeArray[68] > 0)) //Neither A or D
					{
						this.slowDownNeutral();
					}
				//if (e.which == 83){;} - I forgot which key this was, anyway.
				
				if (keyCodeArray[32] > 0 || keyCodeArray[87] == 2 || keyCodeArray[16] > 0) //Spacebar, W key, Shift.
				{
					this.jump();
				}
				//END of Controlling and moving the player - Moore
			}
			
			this.draw = function()
				{
					//Our offset for this one is horizontal center, bottom of image.
					var offsetX = imgCrsr.width / 2;
					var offsetY = imgCrsr.height;
					//drawImg(this.x - offsetX, this.y - offsetY, imgbb16);
					CanvasDraw.drawPolygon(this.x - offsetX, this.y - offsetY, Geometry.circle());
				}

			 return this;
			 
		 }
		
		//DEFINITION FOR THE BALLOON OBJECTS.
		function balloon(xpos, ypos)
		{
			 this.x = xpos;
			 this.y = ypos;
			 this.visible = true;
			 this.active = true;
			 this.oldx = this.x;
			 
			this.isPositionNearby = function(otherX, otherY) 
			{
				var result = false;
				if (distance(this.x, this.y, otherX, otherY) <= 32)
				{
					//Given position is within 5 pixels of our own position.
					result = true;
				}
			return result;
			}
			
			this.isPlayerNearby = function()
			{
				result = false;
				if(p1 != null)
				{
				result = this.isPositionNearby(p1.x, p1.y);
				}
				
				return result;
			}
			
			
			this.jumpToRandomPosition = function()
			{
				this.tempX = Math.floor(Math.random() * document.getElementById("mainCanvas").width - 64) + 32;
				this.jumpToPosition(this.tempX, this.y);
			}
			
			this.jumpToPosition = function(newX, newY)
			{
				this.x = newX;
				this.y = newY;
			}
			
			//This is a method that should be called on each object of this type every loop. It's similar to 'step' in Gamemaker or Update() in Unity 3D. - Moore
			//this.update = update;
			this.update = function()
			{
				if (this.active)
				{
					if (this.isPlayerNearby())
					{
						//If the player is nearby, move this balloon, and give points.
						score += 10;
						this.jumpToRandomPosition();
						//this.active = false;
					}
				}
			}
			
			this.draw = function()
			{
				if (this.visible && this.active)
				{
					var offsetX = 8;
					var offsetY = 8;
					CanvasDraw.drawPolygon(this.x - offsetX, this.y - offsetY, Geometry.circle(16));
				}
			}

			 return this;
		 }
		 
//Free Methods
// This is more or less our "Main" function, or the main LOOP rather.
		
		function updateEverything()
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
				}
			}
			
			//Update the player character.
			if(p1 != null)
			{
			p1.apInc();
			p1.update();
			
			//p1.x = mousex;
			//p1.y = mousey;
			clearDisplay();
			testDrawBlackRect();
			//drawCircle(mainCanvas.width / 2, mainCanvas.height / 2, calcDistance(mainCanvas.width / 2, mainCanvas.height / 2, p1.x, p1.y));
			//drawCircleMarker(p1.x, p1.y);
			
			if (score > highscore) {highscore = score;} //Updates the highscore after it has been broken.
			
			drawTextSmall(32, 32, "Highscore: " + highscore);
			drawTextSmall(32, 48, "Score: " + score);
			drawTextSmall(32, 64, "Time Remaining: " + timeRemaining.toFixed(2));
			drawTextSmall(32, 80, "Time Spent: " + timeElapsed.toFixed(2));
			drawTextSmall(32, 96, "dt: " + dt);
			
			
			p1.draw();
			
			//drawRectAtb(p1);
			
			/*
			//Playing around with animated Hexagons.
			drawHexagon(0, 0);
			drawHexagonScaled(64, 0, 2);
	
			whichSide = Math.floor(Math.random()*6) + 1
			drawHexagonSide(96, 3, whichSide);
			countCycles += 1;
			whichSide = (countCycles % 6) + 1;
			drawHexagonSideScaled(128, 0, whichSide, 2);
			*/
			
			//Demonstration related text.
			//drawTextSmall(32, 128, "A pale imitation of some aspects of the FFXIII ATB (and an unrelated circle thing)."); 
			//drawTextSmall(32, 144, "Press the 1(!) key to drain 100 points of ACT.");
			//drawTextSmall(32, 160, "Press the Shift key to 'paradigm shift' and get an ACT refresh if you've built up enough.");
			
			//Display things to help in debugging the game.
			if (debugMode) 
			{
				drawTextSmall(32, 128, "Content of input array: " + keyCodeArray.join()); 
				if (theMoveMarker != null && p1 != null) 
				{
					drawTextSmall(32, 144, "IsPlayerNearby(); " + theMoveMarker.isPlayerNearby());
					drawTextSmall(32, 160, "IsPositionNearby(); " + theMoveMarker.isPositionNearby(p1.x, p1.y));
					drawTextSmall(32, 176, "distance() <= 5; " + distance(theMoveMarker.x, theMoveMarker.y, p1.x, p1.y) <= 16);
					drawTextSmall(32, 194, "distance(); " + distance(theMoveMarker.x, theMoveMarker.y, p1.x, p1.y));
				}
			}
			
			}
			
			if(theMoveMarker != null){theMoveMarker.update();} //Gotta check again after the update, as update can unset it before drawing.
			if(theMoveMarker != null){theMoveMarker.draw();}
			
			for (i = 0; i < 10 /*blnArray.length()*/; i++)
			{
				if (blnArray[i] != null)
				{
					blnArray[i].update();
					blnArray[i].draw();
				}
			}
			
			//Process the inputs captured...
			processSpecialKeys();
			//NOTE: All input processing should be done before you end the input cycle.
			endInputCycle();
		}
		
		
		//HANDLING USER INPUT
		//MOUSE
		function noMouseDrag(e)
		{
			e.preventDefault();
			return false;
		}
		
		function handleMouseDown(e)
		{
			if (e)
			{
				noMouseDrag(e);
				//document.getElementById("testInfoDiv").innerHTML="Mouse click-down at relative position X: " + e.clientX + " Y: " +e.clientY;
				updateMousePosition(e);
				if (theMoveMarker != null)// placeMoveMarker(e.clientX, e.clientX);
				{
					theMoveMarker.jumpToPosition(mousex, mousey);
				}
				else
				{
					theMoveMarker = new moveMarker(mousex, mousey);
				}
			}
		}
		
		function handleMouseUp(e)
		{
			if (e)
			{
			noMouseDrag(e);
			//document.getElementById("testInfoDiv").innerHTML="Mouse click-release at relative position X: " + e.clientX + " Y: " +e.clientY;				
			updateMousePosition(e);
			}
		}
		//END OF USER INPUT HANDLING
		
//Free Utility Methods
//Wrapping/clamping Pixel to Subpixel.
function calcDistance(x1, y1, x2, y2)
{
	return Math.sqrt(Math.pow((x2 - x1),2) + Math.pow((y2 - y1),2));
}

// D'oh. Can't pass by reference unelss we pass an object and tweak the object. Might as well do some copypasta.
function clampSubPosToMain(subVariable, mainVariable, upperBounds, lowerBounds)
{
	while (subVariable >= upperBounds)
	{
		mainVariable++;
		subVariable -= upperBounds;
	}
	
	while (subVariable < lowerBounds)
	{
		mainVariable--;
		subVariable += upperBounds;
	}
}

//And now the copypasta version. 
function clampSubPosToMain(p, upperBounds, lowerBounds)
{
	while (p.xsub >= upperBounds)
	{
		p.x++;
		p.xsub -= upperBounds;
	}
	
	while (p.xsub < lowerBounds)
	{
		p.x--;
		p.xsub += upperBounds;
	}
	
	while (p.ysub >= upperBounds)
	{
		p.y++;
		p.ysub -= upperBounds;
	}
	
	while (p.ysub < lowerBounds)
	{
		p.y--;
		p.ysub += upperBounds;
	}
}

/*
function clampSubPosToMain(subVariable, mainVariable, upperBounds)
{
	clampSubPosToMain(subVariable, mainVariable, upperBounds, 0);
}
*/

function wrapAround(current, lowEnd, highEnd)
{

	while (current > highEnd)
	{
		current -= (highEnd - lowEnd); //Wraps around in such a fashion that if something's moving at an absurd speed, it will eventually get back on screen.
	}
	
	while (current < lowEnd)
	{
		current += (highEnd - lowEnd); //Wraps around in such a fashion that if something's moving at an absurd speed, it will eventually get back on screen.
	}
	
	return current;
}

function distance(x1, y1, x2, y2)
{
	var result = 0;
	var xdist = x2 - x1;
	var ydist = y2 - y1;
	result = Math.sqrt(Math.pow(xdist, 2) + Math.pow(ydist, 2)); //Working back from Pythagorean Theorum. 
	return result;
	
}


//Free Input Methods
function updateMousePosition(e)
{
	if (mainCanvas != null)
	{
		mousex = (e.clientX + document.body.scrollLeft) - mainCanvas.offsetLeft;
		mousey = (e.clientY + document.body.scrollTop) - mainCanvas.offsetTop;
	}
	else
	{
		mousex = e.clientX + document.body.scrollLeft;
		mousey = e.clientY + document.body.scrollTop;

	}
}	

//HANDLING USER INPUT
//KEYBOARD
function handleKeyboard(e)
{
	if (e && e.which)
	{
	
	theLastE = e; //TESTING LINE DELETEME
	
	//document.getElementById("testInfoDiv").innerHTML="Last recieved keycode from keypress: " + e.which;
	
	//P1 Exclusive Section
		if (e.which == 49 && p1) //1 key.
		{
			if (p1.ap > 100) {p1.ap -=100;}
		}
	//End of P1 Section
		
		if (e.which == 37){;}
		if (e.which == 38){;}
		if (e.which == 39){;}
		if (e.which == 40){;}
		
		if (e.which == 65){;}
		if (e.which == 68){;} //Watch out. Order swap here in the ASWD set.
		if (e.which == 83){;}
		
		if (e.which == 32 || e.which == 87 || e.which == 16) //Spacebar, W key, Shift.
		{
			;
		}
		
		
		
		
		//Getting the Reserve AP is an All-or-Nothing bid.
		//For testing, we'll just swap.
		//Ideally, this would occur automatically when
		//changing paradigm.
		
		if (e.which == 16) //Shift key.
		{
			if (p1.rap >= p1.apMax)
			{
				p1.ap = p1.rap; //Replace AP with reserve.
				p1.rap = -p1.rap; //Sets reserve back to negative to build up.
			} 
			else
			{
				p1.ap = 0;
			}
			
		}
		
	}
}

function handleKeyPress(e)
{
	if (e && e.which)
	{
		if (keyCodeArray[e.keyCode] == 0) {keyCodeArray[e.keyCode] = 2;} //Set the key as 'just pressed'.
		//NOTE: Since we handle this with each received input, we end up with a problem where holding down a key sends this over and over.
	}
}

function handleKeyRelease(e)
{
	if (e && e.which)
	{
		keyCodeArray[e.keyCode] = 0;
	}
}

function processSpecialKeys()
{
	if (keyCodeArray[84] == 2) 
	{
		debugMode = !debugMode;
	}
}

function endInputCycle()
{
	if (keyCodeArray != null)
	{
		for (i = 1; i < keyCodeArray.length; i++)
		{
			if (keyCodeArray[i] == 2) {keyCodeArray[i] = 1;}
		}
	}
}

//END OF USER INPUT HANDLING
	
//Free Graphical Methods
function testDrawRect() 
{
	var c=document.getElementById("mainCanvas");
	var ctx=c.getContext("2d");
	ctx.fillStyle="#FF0000";
	ctx.fillRect(0,0,150,75);
}

function testDrawBlackRect() 
{
	var c=document.getElementById("mainCanvas");
	var ctx=c.getContext("2d");
	ctx.fillStyle="#000000";
	var w = c.width;
	var h = c.height;
	ctx.fillRect(0,0,w,h);
}

function drawRectAtb(char) 
{
	var c=document.getElementById("mainCanvas");
	var ctx=c.getContext("2d");
	ctx.fillStyle="#999999";
	ctx.fillRect(32, mainCanvas.height - 128,atbLength,4);
	
	ctx.fillStyle="#FF9F00";
	ctx.fillRect(32, mainCanvas.height - 128,(atbLength * (char.ap/char.apMax)),4);
	
	ctx.fillStyle="#EEEEEE";
	for (var i=0; i < atbSegments; i++)
	{
		ctx.fillRect(32 + (atbLength / atbSegments * i), mainCanvas.height - 128,1,4);
	}
	/*ctx.fillRect(32 + (atbLength / 4 * 1), mainCanvas.height - 128,1,4);
	ctx.fillRect(32 + (atbLength / 4 * 2), mainCanvas.height - 128,1,4);
	ctx.fillRect(32 + (atbLength / 4 * 3), mainCanvas.height - 128,1,4);*/
	
	/*
	//ATB Label
	drawText(40, mainCanvas.height - 128, "ACT");
	*/
	
	//ATB Numeric Display with Label
	drawText(40, mainCanvas.height - 128, "ACT: " + p1.ap + " / " + p1.apMax);
	
	//ATB Reserve Ready!
	if (p1.rap >= p1.apMax) {drawText(24, mainCanvas.height - 128, "!");}
	
}

function testDrawCircle() 
{
var c=document.getElementById("mainCanvas");
var ctx=c.getContext("2d");
ctx.beginPath();
ctx.arc(95,50,40,0,2*Math.PI);
ctx.stroke();
}

function clearDisplayOfCanvas(theId)
{
	var c=document.getElementById(theId);
	var ctx=c.getContext("2d");
	ctx.clearRect(0, 0, c.width, c.height);
}

function clearDisplay() 
{
	clearDisplayOfCanvas("mainCanvas");
}

function drawHexagon(x, y)
{
var c=document.getElementById("mainCanvas");
var ctx=c.getContext("2d");
//ctx.fillStyle = '#f00';
ctx.strokeStyle="#FFFFFF";
ctx.beginPath();
ctx.moveTo(x + 15, y + 8);
ctx.lineTo(x + 9, y + 12);
ctx.lineTo(x + 9, y + 19);
ctx.lineTo(x + 15, y + 23);
ctx.lineTo(x + 16, y + 23);
ctx.lineTo(x + 22, y + 19);
ctx.lineTo(x + 22, y + 12);
ctx.lineTo(x + 16, y + 8);

/*
ctx.moveTo(x + 0, y + 0);
ctx.lineTo(x + 100, y + 50);
ctx.lineTo(x + 50, y + 100);
ctx.lineTo(x + 0, y + 90);
*/
ctx.closePath();
//ctx.fill();
ctx.stroke();
}

function drawHexagonOnCanvas(theId, x, y)
{
var c=document.getElementById(theId);
var ctx=c.getContext("2d");
//ctx.fillStyle = '#f00';
ctx.strokeStyle="#FFFFFF";
ctx.beginPath();
ctx.moveTo(x + 15, y + 8);
ctx.lineTo(x + 9, y + 12);
ctx.lineTo(x + 9, y + 19);
ctx.lineTo(x + 15, y + 23);
ctx.lineTo(x + 16, y + 23);
ctx.lineTo(x + 22, y + 19);
ctx.lineTo(x + 22, y + 12);
ctx.lineTo(x + 16, y + 8);

/*
ctx.moveTo(x + 0, y + 0);
ctx.lineTo(x + 100, y + 50);
ctx.lineTo(x + 50, y + 100);
ctx.lineTo(x + 0, y + 90);
*/
ctx.closePath();
//ctx.fill();
ctx.stroke();
}

function drawHexagonScaled(x, y, scale)
{
var c=document.getElementById("mainCanvas");
var ctx=c.getContext("2d");
//ctx.fillStyle = '#f00';
ctx.strokeStyle="#FFFFFF";
ctx.beginPath();
ctx.moveTo(x + (15 * scale), y + (8 * scale));
ctx.lineTo(x + (9 * scale), y + (12 * scale));
ctx.lineTo(x + (9 * scale), y + (19 * scale));
ctx.lineTo(x + (15 * scale), y + (23 * scale));
ctx.lineTo(x + (16 * scale), y + (23 * scale));
ctx.lineTo(x + (22 * scale), y + (19 * scale));
ctx.lineTo(x + (22 * scale), y + (12 * scale));
ctx.lineTo(x + (16 * scale), y + (8 * scale));
ctx.closePath();
ctx.stroke();
}

function drawHexagonSideScaledOnCanvas(theId, x, y, side , scale)
{
var c=document.getElementById(theId);
var ctx=c.getContext("2d");
//ctx.fillStyle = '#f00';
ctx.strokeStyle="#FFFFFF";
ctx.beginPath();
switch (side)
	{
	case 1:
		ctx.moveTo(x + (15 * scale), y + (8 * scale));
		ctx.lineTo(x + (9 * scale), y + (12 * scale));
		break;
	case 2:
		ctx.moveTo(x + (9 * scale), y + (12 * scale));
		ctx.lineTo(x + (9 * scale), y + (19 * scale));
		break;
	case 3:
		ctx.moveTo(x + (9 * scale), y + (19 * scale));
		ctx.lineTo(x + (15 * scale), y + (23 * scale));
		break;
	case 4:
		ctx.moveTo(x + (16 * scale), y + (23 * scale));
		ctx.lineTo(x + (22 * scale), y + (19 * scale));
		break;
	case 5:
		ctx.moveTo(x + (22 * scale), y + (19 * scale));
		ctx.lineTo(x + (22 * scale), y + (12 * scale));
		break;
	case 6:
		ctx.moveTo(x + (22 * scale), y + (12 * scale));
		ctx.lineTo(x + (16 * scale), y + (8 * scale));
		break;
	default:
		ctx.moveTo(x + (15 * scale), y + (8 * scale));
		ctx.lineTo(x + (9 * scale), y + (12 * scale));
		ctx.lineTo(x + (9 * scale), y + (19 * scale));
		ctx.lineTo(x + (15 * scale), y + (23 * scale));
		ctx.lineTo(x + (16 * scale), y + (23 * scale));
		ctx.lineTo(x + (22 * scale), y + (19 * scale));
		ctx.lineTo(x + (22 * scale), y + (12 * scale));
		ctx.lineTo(x + (16 * scale), y + (8 * scale));
		break;
	}
ctx.closePath();
ctx.stroke();
}

function drawHexagonSideScaled(x, y, side , scale)
{
	drawHexagonSideScaledOnCanvas("mainCanvas", x, y, side , scale)
}

function drawHexagonSide(x, y, side)
{
	drawHexagonSideScaled(x, y, side, 1)
}


function drawCircle(x,y,r) 
{
var c=document.getElementById("mainCanvas");
var ctx=c.getContext("2d");
ctx.strokeStyle="#FFFFFF";
ctx.beginPath();
ctx.arc(x,y,r,0,2*Math.PI);
ctx.stroke();
}

function drawCircleMarker(x,y) 
{
var c=document.getElementById("mainCanvas");
var ctx=c.getContext("2d");
ctx.fillStyle="#FF9F00";
ctx.beginPath();
ctx.arc(x,y,6,0,2*Math.PI);
ctx.fill();
}

function drawText(x, y, t) 
{
var c=document.getElementById("mainCanvas");
var ctx=c.getContext("2d");
ctx.fillStyle = '#FF9F00';
ctx.font = 'italic bold 28px sans-serif';
ctx.textBaseline = 'bottom';
ctx.fillText(t, x, y);
}

function drawTextSmall(x, y, t) 
{
var c=document.getElementById("mainCanvas");
var ctx=c.getContext("2d");
ctx.fillStyle = '#BB5B00';
ctx.font = '12px sans-serif';
ctx.textBaseline = 'bottom';
ctx.fillText(t, x, y);
}

function drawImg(x, y, img) 
{
var c=document.getElementById("mainCanvas");
var ctx=c.getContext("2d");
ctx.drawImage(img, x, y);
}
