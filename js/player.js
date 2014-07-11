function player (xpos, ypos, myid, mynum)
{
	//START: Properties
	//Properties that shouldn't change after the object is instantiated.
		this.accelerationHorizontalRate = 16;
		 
		 
	 //Properties that change frequently.
	 this.x = xpos;
	 this.y = ypos;
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
			this.xspeed = (targetX - this.x);
			this.yspeed = (targetY - this.y);
		};
	
	this.update = function()
		{
			this.x += this.xspeed * dt;
			this.y += this.yspeed * dt;
			
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
}


/*
function player(xpos, ypos, myid, mynum)
	{
		//Properties that shouldn't change after the object is instantiated.
		this.accelerationHorizontalRate = 16;
		 
		 
		 //Properties that change frequently.
		 this.x = xpos;
		 this.y = ypos;
		 this.xsub = 0;
		 this.ysub = 0;
		 this.xspeed = -5; //In Subpixels.
		 this.yspeed = 1; //In Subpixels.
		 this.canJump = true;
		 this.myid = myid;
		 this.mynum = mynum;
		 
		 this.apMax = 400;
		 this.ap = this.apMax;
		 this.rap = 0; //Reserve AP.
		 
		//player Methods
		this.apInc=apInc; //This is necessary for function visibility.
		
		//Short for Action Point Incrementer.
		function apInc() 
		{
			if (this.ap < this.apMax)
			{
				this.ap++;					
			}
			
			if (this.rap < this.apMax)
			{
				this.rap++;					
			}
		return this.ap;
		}
		
		//Player-specific utilities
		this.isPositionNearby = function(otherX, otherY)  //Is there a better way to give this to player and move markers and stuff? Maybe via subclass?
			{
				var result = false;
				if (Utilities.distance(this.x, this.y, otherX, otherY) <= 32)
				{
					//Given position is within 16 pixels of our own position.
					result = true;
				}
			return result;
			}
			
			this.isMoveMarkerNearby = function()
			{
				result = false;
				if(theMoveMarker != null)
				{
					result = this.isPositionNearby(theMoveMarker.x, theMoveMarker.y);
				}
				
				return result;
			}
		
		//Player movement commands
		this.moveLeft = function()
		{
			if (this.xspeed > 0)
			{
				this.xspeed -= 2 * this.accelerationHorizontalRate;
			}
			else
			{
				this.xspeed -= this.accelerationHorizontalRate;
			}
		}
		
		this.moveRight = function()
		{
			if (this.xspeed < 0)
			{
				this.xspeed += 2 * this.accelerationHorizontalRate;
			}
			else
			{
				this.xspeed += this.accelerationHorizontalRate;
			}
		}
		
		this.slowDownNeutral = function()
		{
			if (this.xspeed > 0) { this.xspeed -= 16;}
			else if (this.xspeed < 0) {this.xspeed += 16;}
		}
		
		this.jump = function()
		{
			if (this.canJump)
			{
				this.canJump = false;
				if (this.yspeed <= 0) {this.yspeed -= 756;}
				else {this.yspeed = -756;}
			}
		}
		
		this.quickDescent = function()
		{
			//If the player was jumping and then stopped jumping, they descend faster. Following theMoveMarker ignores this.
		}
		
		this.followMoveMarker = function()
		{
			if (theMoveMarker != null)
			{
				if (this.x < theMoveMarker.x)
				{
					this.moveRight();
				}
				else
				{
					this.moveLeft();
				}
			}
		}
		
		//This is a method that should be called on each object of this type every loop. It's similar to 'step' in Gamemaker or Update() in Unity 3D. - Moore
		this.update = function()
		{
			
			//If there's a move marker, ignore keyboard input. If there isn't, allow keyboard input.
			if (theMoveMarker != null)
			{
				this.followMoveMarker();
			}
			else
			{
				this.processInput();
			}
			
		
			if (this.xspeed > 768) {this.xspeed -= 32;} 
			if (this.xspeed < -768) {this.xspeed += 32;} //This enforces a maximum speed by dropping the speed then ramping back up on hitting the limit. - Moore
			
			if (this.yspeed > 2048) {this.yspeed = 2048;}
			if (this.yspeed < -2048) {this.yspeed = -2048;}
			
			//Gravity pulls down.
			//If we're not at the bottom and there is no platform below us, let gravity do what it does.
			if (this.y < FLOORHEIGHT)
			{
				this.yspeed += 40; //Might want to put a toggle based on the input here to make it 40 on low or 160 on holding down / releasing up. 
			}
			else
			{
			this.canJump = true;
				if (this.yspeed > 0)
				{
					this.yspeed = 0;
					this.ysub = 0;
				}
			}
		
			//Each update, we immediately need to update positions relative to speed.
			this.xsub += this.xspeed;
			this.ysub += this.yspeed;
			
			//Wrapping/clamping Pixel to Subpixel.
			clampSubPosToMain(this, 256, 0);
			this.x = wrapAround(this.x, 0, document.getElementById("mainCanvas").width);
			this.y = wrapAround(this.y, 0, document.getElementById("mainCanvas").width);
			
		}
		
		this.processInput = function()
		{
			//START Controlling and moving the player around - Moore
			if (keyCodeArray[65] > 0){this.moveLeft();} // A key
			if (keyCodeArray[68] > 0){this.moveRight();} // D key
			if (!(keyCodeArray[65] > 0 || keyCodeArray[68] > 0)) //Neither A or D
				{
					this.slowDownNeutral();
				}
			//if (e.which == 83){;} - I forgot which key this was, anyway.
			
			if (keyCodeArray[32] > 0 || keyCodeArray[87] == 2 || keyCodeArray[16] > 0) //Spacebar, W key, Shift.
			{
				this.jump();
			}
			//END of Controlling and moving the player - Moore
		}
		
		this.draw = function()
			{
				//Our offset for this one is horizontal center, bottom of image.
				var offsetX = imgCrsr.width / 2;
				var offsetY = imgCrsr.height;
				//drawImg(this.x - offsetX, this.y - offsetY, imgbb16);
				CanvasDraw.drawPolygon(this.x - offsetX, this.y - offsetY, Geometry.circle());
			}

		 return this;
		 
	 }
 */