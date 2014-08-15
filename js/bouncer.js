function bouncer(xpos, ypos)
{
    //Inherit from enemy object.
    enemy.call(this, xpos, ypos);
	this.moveSpeedScalar = 16;
	
	//this.moveTowardsPos(p1.x,p1.y);
    
    //Overwriting the enemy's version of update with our own.
	
	
	this.vertiBounce = function()
	{
		if (this.y + this.radius > gameHeight)
		{
			this.yspeed /= -1.5;
			if (this.yspeed <= 0 && Utilities.randomIntInRange(0,10) == 10)
			{
				this.yspeed -= gameHeight / 10;
			}
		}
	};
	
    this.update = function()
	{
        
        this.updatePos();
		this.updateStun();
		
		this.vertiBounce();
		
		this.clampPosToPlayingArea();
        
		if (this.active)
		{
			if (p1 != null)
			{
				if (this.stunCooldown <= 0) {this.yspeed += 16 * dt;}
			}
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
	};
	
	this.draw = function()
	{
		if (this.visible && this.active)
		{
			CanvasDraw.drawPolygon(this.x, this.y, Geometry.circle(this.radius * 2, 6), '#ff00ff');
		}
	}
	
};

//a.moveTowardsPos(p1.x,p1.y)