var Geometry = function () {

};

Geometry.circle = function (diameter, numSegments)
{
	if (typeof diameter != "number")
	{
		diameter = 32; //This is 32 instead of 1, because a 1 point circle isn't very useful, but we can do plenty with a 32 point circle.
	}
	
	if (typeof numSegments != "number")
	{
		numSegments = diameter; //Consider using the square of the radius instead.
	}

	var radius = diameter / 2;
	var circle = {x:[], y:[]};
	
	for (var i = 0; i < numSegments; i++)
	{
		var portion = (i / numSegments);
		
		circle.x[i] = Math.cos(portion * 2 * Math.PI) * radius;
		circle.y[i] = Math.sin(portion * 2 * Math.PI) * radius;
		
	}
	return circle;
};