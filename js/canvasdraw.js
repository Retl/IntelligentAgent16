var CanvasDraw = function () {

};

CanvasDraw.drawPolygon = function (x, y, poly)
{
	if (typeof poly != 'undefined' && typeof poly.x != 'undefined' && poly.x.length > 0)
		{
		var c=document.getElementById("mainCanvas");
		var ctx=c.getContext("2d");
		ctx.fillStyle = '#f00';
		ctx.beginPath();
		ctx.moveTo(poly.x[0] + x, poly.y[0] + y);
		for (var i = 1; i < poly.x.length; i++)
		{
			ctx.lineTo(poly.x[i] + x, poly.y[i] + y);
		}
		ctx.closePath();
		ctx.fill();
	}
};