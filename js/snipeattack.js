var snipeAttack = function (xpos, ypos, originator)
{
    this.active = true;
    this.x = 0;
    this.y = 0;
    this.xorg = 32;
    this.yorg = 32;
    
    this.maxLifetime = 0.2;
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
            var col = 'rgba(255,255,255,'+ this.lifetime/this.maxLifetime +')';
            CanvasDraw.drawLine(this.xorg, this.yorg, this.x, this.y, col);
        }
        else
        {
            
        }
    }
    
    Game.addUpdateable(this);
};