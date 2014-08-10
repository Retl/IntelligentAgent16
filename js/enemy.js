function enemy(xpos, ypos)
{
	gameObject.call(this, xpos, ypos);
    this.x = xpos;
    this.y = ypos;
    this.visible = true;
    this.active = true;
    this.oldx = this.x;
	
	this.stunCooldown = 0;
    
    this.moveSpeedScalar = 32;

    this.xspeed = 0;
    this.yspeed = 0;
	
	this.hp = 10;
	
	this.timeBonus = 0.49;
	
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
			if (debugMode) {console.log("I'm hit! ("+ theGameObject.toString() + typeof theGameObject +")");}
			this.takeDamage(theGameObject.power);
        }
		else if (theGameObject.constructor == burstAttack)
		{
			//This enemy was burst-attacked. Take damage & knockback.
			if (debugMode) {console.log("I'm hit! ("+ theGameObject.toString() + typeof theGameObject +")");}
			this.takeDamage(theGameObject.power * dt);
			this.stunCooldown = dt * 16;
			this.push({x:(this.x - theGameObject.x), y:(this.y - theGameObject.y)});
		}
		
		else if (theGameObject.constructor == player)
        {
			//This enemy Rammed into the player. Destroy it and move the player away.
			var pushVector = {};
			pushVector.x = this.xspeed;
			pushVector.y = this.yspeed;
			theGameObject.push(pushVector);
			this.destroy(this.hp);
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
				timeRemaining += this.timeBonus;
			}
			//this.jumpToRandomPosition();
			//this.active = false;
			this.destroy();
		}
	};
 };