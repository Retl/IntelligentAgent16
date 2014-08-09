var snipeAttack = function (xpos, ypos, originator)
{
    gameObject.call(this, xpos, ypos);
    
    this.active = true;
    this.x = 0;
    this.y = 0;
    this.xorg = 32;
    this.yorg = 32;
    
    this.power = 10;
    
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
                Game.removeUpdateable(this);
                this.active = false;
            }
        }
    }
    
    this.draw = function ()
    {
        if (gl)
        {
            var ratio = this.lifetime/this.maxLifetime;
            var lerp = Utilities.lerp(this.xorg, this.yorg, this.x, this.y, ratio)
            var col = 'rgba(255,255,255,'+ ratio +')';
            var myGeom = Geometry.circle(16, 8, this.lifetime, this.maxLifetime);
            
            CanvasDraw.drawLine(this.xorg, this.yorg, this.x, this.y, col);
            CanvasDraw.drawPolygon(lerp.x, lerp.y, myGeom, col);
        }
        else
        {
            
        }
    }
    
    //Game.callOnAll(function (currentGameObject) {currentGameObject.containsLocationOfObject(this);});
    this.checkCollisions = function (o, theObject) 
    {
        //console.log( this.toString()+ " <- Decting collision with -> " + o.toString());
        console.log(theObject.x + " " + theObject.y);
        o.containsLocationOfObject(theObject);
        theObject.containsLocationOfObject(o);
    };
    
    this.onCollision = function (theGameObject)
	{
		console.log("OMG, I shot a thing! ("+ theGameObject.toString() + typeof theGameObject +")");
	};
    
    Game.callOnAll(this.checkCollisions, this);
    Game.addUpdateable(this);
};