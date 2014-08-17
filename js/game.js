// File: game.js
// Author: Carlis Moore
// Date of Creation: 16 Aurgust 2014
// Date of Last Update: 16 August 2014
// Base Code: UPDATETHIS
// Purpose: This contains the definition of the Game controller object. When reusing this, you should overwrite the Game.update() with a process specific to your game.

var Game = function () {};

Game.updateables = [];
Game.removables = [];


Game.addUpdateable = function (obj)
{
	Game.updateables.push(obj);
};

Game.removeUpdateable = function (obj)
{
	var result = false;
	var i = this.updateables.indexOf(obj);
	if (i > -1) 
	{
		this.updateables.splice(i, 1);
		result = true;	
	}

	return result;
};

Game.removeUpdateableDelayed = function (obj)
{
	Game.removables.push(obj);
};

Game.callOnAll = function (fun)
{
	//Performs the function defined in "Fun" on all gameObjects in the Game.

	for (i = 0; i < Game.updateables.length; i++)
	{
		if (Utilities.isFunction(Game.updateables[i].update))
		{
			//fun(Game.updateables[i]);
			fun(Game.updateables[i], arguments[1]);
		}
	}
}

Game.clearRecords = function ()
{
	localStorage.removeItem("highscore");
	localStorage.removeItem("highspeed");
};


Game.update = function ()
{
	console.log("Warning: Using an unmodified Game.update() function. This should be overwritten.");
	if (gamePlaying)
	{
		//Update the timer.
		var currentUpdate = Date.now();
		dt = (currentUpdate - lastUpdate) / 1000.0;
		lastUpdate = currentUpdate;
	}

	//Call the update() method on all game objects.
	Game.callOnAll(function (currentGameObject) {currentGameObject.update();});

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

Game.draw = function ()
{
	Game.callOnAll(function (currentGameObject) {if (currentGameObject.visible) {currentGameObject.draw();}});
};
