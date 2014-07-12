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
		if (Utilities.distance(this.x, this.y, otherX, otherY) <= 32)
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
		this.jumpToPosition(Utilities.randomIntInRange(0, gameWidth), Utilities.randomIntInRange(this.y - 8, this.y + 8));
		while (this.y < 0 || this.y > gameHeight)
		{
			this.jumpToPosition(this.x, Utilities.randomIntInRange((gameHeight/2) - 64, (gameHeight/2) + 64));
		}
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
				if (gamePlaying)
				{
					score += 10;
					timeRemaining += 0.05;
				}
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
	Game.addUpdateable(this);
 };