function enemy(xpos, ypos)
{
	gameObject.call(this, xpos, ypos);
    this.x = xpos;
    this.y = ypos;
    this.visible = true;
    this.active = true;
    this.oldx = this.x;
    
    this.moveSpeedScalar = 2;

    this.xspeed = 0;
    this.yspeed = 0;
	
	this.hp = 10;
	
	this.isPlayerNearby = function()
	{
		result = false;
		if(p1 != null)
		{
		result = this.isPositionNearby(p1.x, p1.y);
		}
		
		return result;
	}
    
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
	
	//This is a method that should be called on each object of this type every loop. It's similar to 'step' in Gamemaker or Update() in Unity 3D. - Moore
	//this.update = update;
	this.update = function()
	{
        
        this.updatePos();
		this.clampPosToPlayingArea();
        
		if (this.active)
		{
			/*
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
			*/
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
	
	this.onCollision = function (theGameObject)
	{
        if (theGameObject.constructor == snipeAttack)
        {
			//This enemy was shot. Take damage.
			console.log("I'm hit! ("+ theGameObject.toString() + typeof theGameObject +")");
			this.takeDamage(theGameObject.power);
        }
	};
	
	this.takeDamage = function (dmg)
	{
		this.hp = Utilities.clamp(this.hp - dmg, 0, this.hp);
		if (this.hp <= 0)
		{
			//Enemy defeated, destroy it and reward the player.
			if (gamePlaying)
			{
				score += 10;
				timeRemaining += 0.05;
			}
			//this.jumpToRandomPosition();
			//this.active = false;
			this.destroy();
		}
	};
 };