function enemyChaser(xpos, ypos)
{
    //Inherit from enemy object.
    enemy.call(this, xpos, ypos);
    
    //Overwriting the enemy's version of update with our own.'
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
				//this.jumpToRandomPosition();
				//this.active = false;
                this.destroy();
			}
            else
            {
                if(p1 != null)
                {
                    //Move towards player.
                }
            }
            
		}
	}
    
    this.destroy = function ()
    {
        Game.removeUpdateable(this);
    }
};