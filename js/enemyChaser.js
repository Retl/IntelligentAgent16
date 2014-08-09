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
		this.clampPosToPlayingArea();
        
		if (this.active)
		{
			if (p1 != null)
			{
				this.moveSpeedScalar += 2 * dt;
				this.moveTowardsPos(p1.x,p1.y);
			}
			if (this.isPlayerNearby())
			{
				//If the player is nearby, move this balloon, and give points.
				if (gamePlaying)
				{
					;
				}
				this.onCollision(p1);
				this.destroy();
				
			}
		}
	};
};

//a.moveTowardsPos(p1.x,p1.y)