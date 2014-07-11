var Utilities = function ()
{
	;
};

Utilities.distance = function (x1, y1, x2, y2)
{
	var result = 0;
	var xdist = x2 - x1;
	var ydist = y2 - y1;
	result = Math.sqrt(Math.pow(xdist, 2) + Math.pow(ydist, 2)); //Working back from Pythagorean Theorum. 
	return result;
};

Utilities.randomIntInRange = function(min, max)
{
	//This is an inclusive range. - Moore.
	var range = Math.abs(max - min) + 1;
	return Math.floor((Math.random() * range) + min);
};