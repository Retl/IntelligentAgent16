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
	this.snipeAttack = function(targetX, targetY)
	{
		//Create a snipeAttack instance at the target destination.
		new snipeAttack(targetX, targetY, this);
	};

	this.burstAttack = function(targetX, targetY)
	{
		//Create a burst attack instance at the player location.
		new burstAttack(this.x, this.y, this);
	};
		
	this.clickAction = function (tx, ty)
	{
		var dist = Utilities.distance(this.x, this.y, tx, ty); 
		if ((dist < this.influenceRadius) == this.moveStyleNear)
		{
			this.moveTowardsPos(tx, ty, 128 * (dist / this.influenceRadius));
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

	
	this.update = function()
	{
		this.updatePos();
		this.clampPosToPlayingArea();
		
		speed = Utilities.magnitude({x:this.xspeed, y:this.yspeed});

		//Make the graphic spin!
		this.rotationOffset = Utilities.rotationalSpin(this.rotationOffset, this.maxRotationOffset, (Math.abs(this.xspeed) + Math.abs(this.yspeed)) / 10);
	};
	
	this.draw = function()
	{
		//Our offset for this one is horizontal center, bottom of image.
		var offsetX = 0;
		var offsetY = 0;

		//var myGeom = Geometry.circle(this.radius * 2, 8, this.rotationOffset, this.maxRotationOffset);
		
		var myGeom = Geometry.circle(this.radius * 2 * (Utilities.clamp(timeRemaining, 1, 30) / 30), 8, this.rotationOffset, this.maxRotationOffset);
		var myGeomOut = Geometry.circle(this.radius * 2, 8, this.rotationOffset, this.maxRotationOffset);
		
		//var myInfluenceGeom = Geometry.circle(this.influenceRadius * 2, 128, this.rotationOffset, this.maxRotationOffset);
		//var myInfluenceGeom = Geometry.circle(this.influenceRadius * 2, Utilities.clamp(Math.floor(32 * (Utilities.clamp(timeRemaining, 1, 30) / 30)), 3, 32), this.rotationOffset, this.maxRotationOffset);
		var myInfluenceGeom = Geometry.circle(this.influenceRadius * 2, Math.floor(32 * (Utilities.clamp(timeRemaining, 1, 30) / 30)), this.rotationOffset, this.maxRotationOffset);

		if (gl)
		{
			//PLACEHOLDER - replace all of this with GL drawing instructions.
			if (gamePlaying) {CanvasDraw.drawPolygon(this.x - offsetX, this.y - offsetY, myGeom, '#ffffff');}
			CanvasDraw.drawPolygonStroke(this.x - offsetX, this.y - offsetY, myGeomOut, '#ffffff');
			if (gamePlaying) {CanvasDraw.drawPolygonStroke(this.x - offsetX, this.y - offsetY, myInfluenceGeom, '#ffffff');}
		}
		else
		{
			if (gamePlaying) {CanvasDraw.drawPolygon(this.x - offsetX, this.y - offsetY, myGeom, '#ffffff');}
			CanvasDraw.drawPolygonStroke(this.x - offsetX, this.y - offsetY, myGeomOut, '#ffffff');
			if (gamePlaying) {CanvasDraw.drawPolygonStroke(this.x - offsetX, this.y - offsetY, myInfluenceGeom, '#ffffff');}
		}
	};
	
	//END: Methods
}
