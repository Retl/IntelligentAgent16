var CanvasDraw = function () {

};

CanvasDraw.drawPolygon = function (x, y, poly, col)
{
	if (typeof poly != 'undefined' && typeof poly.x != 'undefined' && poly.x.length > 0)
		{
		var c=document.getElementById("mainCanvas");
		var ctx=c.getContext("2d");
		if (typeof col == 'undefined')
		{
			col = '#f00';
		}
		ctx.fillStyle = col;
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

CanvasDraw.drawPolygonStroke = function (x, y, poly, col)
{
	if (typeof poly != 'undefined' && typeof poly.x != 'undefined' && poly.x.length > 0)
		{
		var c=document.getElementById("mainCanvas");
		var ctx=c.getContext("2d");
		if (typeof col == 'undefined')
		{
			col = '#fff';
		}
		ctx.strokeStyle = col;
		ctx.beginPath();
		ctx.moveTo(poly.x[0] + x, poly.y[0] + y);
		for (var i = 1; i < poly.x.length; i++)
		{
			ctx.lineTo(poly.x[i] + x, poly.y[i] + y);
		}
		ctx.closePath();
		ctx.stroke();
	}
};