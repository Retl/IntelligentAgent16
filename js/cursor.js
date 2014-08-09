function moveMarker(xpos, ypos)
{
	var result;
	if (theMoveMarker == null)
		{
			
		gameObject.call(this, xpos, ypos);
			
		this.x = xpos;
		this.y = ypos;

		this.rotationOffset = 0;
		this.maxRotationOffset = 10;

		this.radius = 4;
		this.influenceRadius = 16;


		//Short for Action Point Incrementer.
		this.isPositionNearby = function(otherX, otherY) 
        {
            var result = false;
            if (Utilities.distance(this.x, this.y, otherX, otherY) <= 32)
            {
                //Given position is within 5 pixels of our own position.
                result = true;
            }
        return result;
        }

        this.isPlayerNearby = function()
        {
            result = false;
            if(p1 != null)
            {
            result = this.isPositionNearby(p1.x, p1.y);
            }

            return result;
        }


        this.jumpToPosition = function(newX, newY)
        {
            this.x = newX;
            this.y = newY;
        }

        //This is a method that should be called on each object of this type every loop. It's similar to 'step' in Gamemaker or Update() in Unity 3D. - Moore
        //this.update = update;
        this.update = function()
        {
            if (this.isPlayerNearby())
            {
                //If the player is nearby, deactivate/remove this mouseMarker.
                if (p1 != null) {/*p1.jump();*/}
                theMoveMarker = null;
				Game.removeUpdateable(this);
            }
            
            //Make the graphic spin!
			this.rotationOffset = Utilities.rotationalSpin(this.rotationOffset, this.maxRotationOffset, 10);
        }

        this.draw = function()
        {
            var myGeom = Geometry.circle(this.radius * 2, 4, this.rotationOffset, this.maxRotationOffset);
            var myInfluenceGeom = Geometry.circle(this.influenceRadius * 2, 128, this.rotationOffset, this.maxRotationOffset);
            
            if (gl)
            {
                //PLACEHOLDER - replace all of this with GL drawing instructions.
                CanvasDraw.drawPolygon(this.x, this.y, myGeom, '#ffffff');
                CanvasDraw.drawPolygonStroke(this.x, this.y, myInfluenceGeom, '#ffffff');
            }
            //else 
            {
				
                CanvasDraw.drawPolygon(this.x, this.y, myGeom, '#ffffff');
                CanvasDraw.drawPolygonStroke(this.x, this.y, myInfluenceGeom, '#ffffff');
				
				
				/*
				var offsetX = imgCrsr.width / 2;
				var offsetY = imgCrsr.height / 2;
				drawImg(this.x - offsetX, this.y - offsetY, imgCrsr);
				*/
            }
			
			
        }
		
		Game.addUpdateable(this);
		result = this;
     }
     else
     {
        result = theMoveMarker;
     }
	 
	 return result;
 };