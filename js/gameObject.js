var idManager = {idNum: 0};
idManager.newId = function () 
{
    return idManager.idNum++; //Returns the value, then increments.
}

function gameObject(xpos, ypos)
{
	//START: Properties
	//Properties that shouldn't change after the object is instantiated.
    this.id = idManager.newId();
		 
	 //Properties that change frequently.
	 this.x = xpos;
	 this.y = ypos;
	 
	 this.moveSpeedScalar = 2;
	 
	 this.xspeed = 0;
	 this.yspeed = 0;
	
	//END: Properties
	
	//START: Methods
	
    this.isPositionNearby = function(otherX, otherY) 
	{
        var result = false;
        if (Utilities.distance(this.x, this.y, otherX, otherY) <= 32)
        {
            //Given position is within 5 pixels of our own position.
            result = true;
        }
        
	   return result;
	};
	
	this.horizontalReflect = function(dampen)
	{
		this.xspeed /= -dampen;
	};

	this.verticalReflect = function(dampen)
	{
		this.yspeed /= -dampen;
	};

	this.fullReflect = function(dampen)
	{
		this.verticalReflect(dampen);
		this.horizontalReflect(dampen);
	};
    
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

	this.moveTowardsPos = function(targetX, targetY)
	{
		this.xspeed = (targetX - this.x) * this.moveSpeedScalar;
		this.yspeed = (targetY - this.y) * this.moveSpeedScalar;
	};
	
	this.updatePos = function ()
	{
		this.x += this.xspeed * dt;
		this.y += this.yspeed * dt;
	}
	
	this.clampPosToPlayingArea = function ()
	{
		//Stay within the playing area.
		if (this.x < 0)
		{
			this.x = 0;
			this.horizontalReflect(2);
		}

		if (this.x > gameWidth)
		{
			this.x = gameWidth;
			this.horizontalReflect(2);
		}

		if (this.y < 0)
		{
			this.y = 0;
			this.verticalReflect(2);
		}

		if (this.y > gameHeight)
		{
			this.y -= (this.y - gameHeight);
			this.verticalReflect(2);
		}
	}
	
	this.update = function()
		{
			this.updatePos();
			this.clampPosToPlayingArea();
		};
	
	this.draw = function()
			{
				console.log(this.toString() + ": attempting to draw with unimplemented draw function.");
			};
    
    this.destroy = function ()
    {
        Game.removeUpdateable(this);
    }
	
	//END: Methods
	
	Game.addUpdateable(this);
}
