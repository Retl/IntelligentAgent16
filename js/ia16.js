// File: main.js
// Author: Carlis Moore
// Date of Creation: 10 July 2014
// Date of Last Update: 16 August 2014
// Base Code: http://retl.info/experimental/ffxiiiatb.js
// Purpose: The main javascript file to setup Intelligent Agent 16 for play.
// Todo: Most of the stuff in this file should be migrated either into game.js or main.js.

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



// Keys 1-0: Menu Selection
// Key Tab: Change Menu.
// Keys Q E Enter: Cancel? Generic Action? 
		 
//Free Methods
// This is more or less our "Main" function, or the main LOOP rather.
		
		
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
				
				if (p1 != null)
				{
					p1.clickAction(mousex, mousey);
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

//Free Input Methods
function updateMousePosition(e)
{
	if (gl)
	{
		
	}
	//else
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
