function player(xpos, ypos, myid, mynum)
{
	//Inherit from gameObject.
	gameObject.call(this, xpos, ypos);
	
	//START: Properties
	//Properties that shouldn't change after the object is instantiated.
		this.accelerationHorizontalRate = 16;
		 
		 
	 //Properties that change frequently.
	 this.x = xpos;
	 this.y = ypos;
	 
	 this.moveStyleNear = true;
	 this.moveSpeedScalar = 2;
	 
	 this.xspeed = 0;
	 this.yspeed = 0;
	 
	 this.canAttack = true;
	 this.myid = myid;
	 this.mynum = mynum;
	 
	 this.radius = 16;
	 this.influenceRadius = this.radius * 8;
	 
	 this.rotationOffset = 0;
	 this.maxRotationOffset = 1;
	
	//END: Properties
	
	//START: Methods
	
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

	this.moveTowardsPos = function(targetX, targetY)
	{
		this.xspeed = (targetX - this.x) * this.moveSpeedScalar;
		this.yspeed = (targetY - this.y) * this.moveSpeedScalar;
	};

	this.snipeAttack = function(targetX, targetY)
	{
		//Create a snipeAttack instance at the target destination.
		new snipeAttack(targetX, targetY, this);
	};

	this.burstAttack = function(targetX, targetY)
	{
		//Create a burst attack instance at the target destination.
	};
		
	this.clickAction = function (tx, ty)
	{
		if ((Utilities.distance(this.x, this.y, tx, ty) < this.influenceRadius) == this.moveStyleNear)
		{
			this.moveTowardsPos(tx, ty);
			//Also do the close-range knockback attack to the nearest enemy within influence range.
			this.burstAttack(tx, ty);
		}
		else
		{
			this.snipeAttack(tx, ty);
		}
	}
	
	this.toggleMoveStyle = function ()
	{
		this.moveStyleNear = !this.moveStyleNear;
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
	
	this.update = function()
		{
			this.updatePos();
			this.clampPosToPlayingArea();
			
			//Make the graphic spin!
			this.rotationOffset = Utilities.rotationalSpin(this.rotationOffset, this.maxRotationOffset, (Math.abs(this.xspeed) + Math.abs(this.yspeed)) / 10);
		};
	
	this.draw = function()
			{
				//Our offset for this one is horizontal center, bottom of image.
				var offsetX = 0;
				var offsetY = 0;
				
				var myGeom = Geometry.circle(this.radius * 2, 8, this.rotationOffset, this.maxRotationOffset);
				var myInfluenceGeom = Geometry.circle(this.influenceRadius * 2, 128, this.rotationOffset, this.maxRotationOffset);
				
				if (gl)
				{
					//PLACEHOLDER - replace all of this with GL drawing instructions.
					CanvasDraw.drawPolygon(this.x - offsetX, this.y - offsetY, myGeom, '#ffffff');
					CanvasDraw.drawPolygonStroke(this.x - offsetX, this.y - offsetY, myInfluenceGeom, '#ffffff');
				}
				else
				{
					CanvasDraw.drawPolygon(this.x - offsetX, this.y - offsetY, myGeom, '#ffffff');
					CanvasDraw.drawPolygonStroke(this.x - offsetX, this.y - offsetY, myInfluenceGeom, '#ffffff');
				}
			};
	
	//END: Methods
	
	Game.addUpdateable(this);
}
