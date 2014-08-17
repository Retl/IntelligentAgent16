function camera(xpos, ypos, myWidth, myHeight)
{
	gameObject.call(this, xpos, ypos);
	this.radius = this.myWidth / 2;
    this.width = myWidth;
    this.height = myHeight;
    
    this.oldx = this.x;
	
	this.stunCooldown = 0;
    
    this.moveSpeedScalar = 64;
	
	this.timeBonus = 0.49;
	
	this.updateStun = function ()
	{
		return this.stunCooldown = Utilities.clamp(this.stunCooldown - dt, 0, 9999);
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
	
	//This is a method that should be called on each object of this type every loop. It's similar to 'step' in Gamemaker or Update() in Unity 3D. - Moore
	//this.update = update;
	this.update = function()
	{
        
        this.updatePos();
		this.updateStun();
		this.clampPosToPlayingArea();
        
		if (this.active)
		{
			if (this.isPlayerNearby())
			{
				//If the player is nearby, move this enemy, and give points.
				if (gamePlaying)
				{
					;
				}
				this.onCollision(p1);
				this.destroy();
				
			}
		}
	}
	
	this.draw = function()
	{
		if (this.visible && this.active)
		{
			CanvasDraw.drawPolygon(this.x, this.y, Geometry.circle(this.radius * 2, 4), '#ff8800');
		}
	}
	
	
	if (p1 != null)
	{
		if (this.stunCooldown <= 0) {this.moveTowardsPos(p1.x,p1.y);}
	}
 };