var burstAttack = function (xpos, ypos, originator)
{
    gameObject.call(this, xpos, ypos);
    
    this.active = true;
    this.x = 0;
    this.y = 0;
    this.xorg = 32;
    this.yorg = 32;
    
    this.radius = 16 * 4;
    this.power = 2;
    
    this.maxLifetime = 0.4;
    this.lifetime = this.maxLifetime;
    
    if (Utilities.isNumber(xpos))
    {
        this.x = xpos;
    }
    
    if (Utilities.isNumber(ypos))
    {
        this.y = ypos;
    }
    
    this.updateOrgs = function ()
    {
        if (Utilities.isNumber(originator.x))
        {
            this.xorg = originator.x;
        }

        if (Utilities.isNumber(originator.y))
        {
            this.yorg = originator.y;
        }
    };
    
    this.updateOrgs();
    
    this.update = function ()
    {
        if (this.active)
        {
			Game.callOnAll(this.checkCollisions, this);
			
            this.updateOrgs();
            if (this.lifetime > 0)
            {
                this.lifetime -= dt;
            }

            if (this.lifetime < 0)
            {
                this.lifetime = 0;
            }

            if (this.lifetime == 0)
            {
                this.destroy();
                this.active = false;
            }
        }
    }
    
    this.draw = function ()
    {
        if (gl)
        {
            var ratio = this.lifetime/this.maxLifetime;
			var ratioFlip = (this.maxLifetime - this.lifetime)/this.maxLifetime;
            var lerp = Utilities.lerp(this.xorg, this.yorg, this.x, this.y, ratio)
            var col = 'rgba(255,255,255,'+ ratio +')';
            var myGeom = Geometry.circle(this.radius * 2 * ratioFlip, 8, this.lifetime, this.maxLifetime);
			
            CanvasDraw.drawPolygon(this.x, this.y, myGeom, col);
        }
        else
        {
            
        }
    }
    
    this.checkCollisions = function (o, theObject) 
    {
        //console.log( this.toString()+ " <- Decting collision with -> " + o.toString());
        if (debugMode) {console.log(theObject.x + " " + theObject.y);}
        o.containsLocationOfObject(theObject);
        theObject.containsLocationOfObject(o);
    };
    
    this.onCollision = function (theGameObject)
	{
		if (debugMode) {console.log("OMG, I shot a thing! ("+ theGameObject.toString() + typeof theGameObject +")");}
	};
    
    Game.callOnAll(this.checkCollisions, this);
};