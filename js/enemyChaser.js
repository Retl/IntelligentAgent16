function enemyChaser(xpos, ypos)
{
    //Inherit from enemy object.
    enemy.call(this, xpos, ypos);
	
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
				this.moveTowardsPos(p1.x,p1.y);
			}
			if (this.isPlayerNearby())
			{
				//If the player is nearby, move this balloon, and give points.
				if (gamePlaying)
				{
					score += 10;
					timeRemaining += 0.05;
				}
				//this.jumpToRandomPosition();
				//this.active = false;
				this.destroy();
				
			}
		}
	};
};

//a.moveTowardsPos(p1.x,p1.y)