function enemyChaser(xpos, ypos)
{
    //Inherit from enemy object.
    enemy.call(this, xpos, ypos);
	this.moveSpeedScalar = 16;
	
	//this.moveTowardsPos(p1.x,p1.y);
    
    //Overwriting the enemy's version of update with our own.'
    this.update = function()
	{
        
        this.updatePos();
		this.updateStun();
		this.clampPosToPlayingArea();
        
		if (this.active)
		{
			if (p1 != null)
			{
				this.moveSpeedScalar += 2 * dt;
				if (this.stunCooldown <= 0) {this.moveTowardsPos(p1.x,p1.y);}
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
			CanvasDraw.drawPolygon(this.x, this.y, Geometry.circle(this.radius * 2, 8));
		}
	}
	
};

//a.moveTowardsPos(p1.x,p1.y)