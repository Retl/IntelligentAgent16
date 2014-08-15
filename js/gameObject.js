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
	 
	 this.radius = 16;
	 
	 this.moveSpeedScalar = 16;
	 
	 this.xspeed = 0;
	 this.yspeed = 0;
	 
	 this.visible = true;
	 this.active = true;
	
	//END: Properties
	
	//START: Methods
	
    this.isPositionNearby = function(otherX, otherY) 
	{
        var result = false;
        if (Utilities.distance(this.x, this.y, otherX, otherY) <= this.radius*2)
        {
            //Given position is within our radius.
            result = true;
        }
        
	   return result;
	};
	
	this.isGameObjectNearby = function(other) 
	{
        var result = false;
        if (Utilities.distance(this.x, this.y, other.x, other.y) <= this.radius * 2 + other.radius * 2)
        {
            //Given position is within our radius.
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
	};
	
	this.jumpToPosition = function(newX, newY)
	{
		this.x = newX;
		this.y = newY;
	};

	this.moveTowardsPos = function(targetX, targetY, speed)
	{
		if (!Utilities.isNumber(speed))
		{
			speed = this.moveSpeedScalar;
		}
		var targetVector = {};
		
		targetVector.x = (targetX - this.x);
		targetVector.y = (targetY - this.y);
		
		targetVector = Utilities.normalize(targetVector);
		
		this.xspeed = targetVector.x * speed;
		this.yspeed = targetVector.y * speed;
	};
	
	this.updatePos = function ()
	{
		this.x += this.xspeed * dt;
		this.y += this.yspeed * dt;
	};
	
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
	};
	
	this.containsLocationOfObject = function (theObject)
	{
		result = false;
		if (this.isPositionNearby(theObject.x, theObject.y))
		{
			result = true;
			this.onCollision(theObject);
			return result;
		}
		
		return result;
	};
	
	this.push = function (forceVector)
	{
		this.xspeed += forceVector.x;
		this.yspeed += forceVector.y;
	};
	
	this.onCollision = function (theGameObject)
	{
		console.log(this.toString() + " has detected a collission with " + theGameObject.toString() + ".")
	};
	
	this.update = function()
	{
		this.updatePos();
		this.clampPosToPlayingArea();
	};
	
	this.draw = function()
	{
		if (this.visible)
		{
			console.log(this.toString() + ": attempting to draw with unimplemented draw function.");
		}
	};
    
    this.destroy = function ()
    {
        Game.removeUpdateable(this);
    };
	
	//END: Methods
	Game.addUpdateable(this);
}
