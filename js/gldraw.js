var gl;

var GLDraw = function () 
{
	;
};

GLDraw.start = function ()
{
	var glCanvas = document.getElementById("mainCanvas");
	gl = this.initWebGL(glCanvas);

	if (gl)
	{
		gl.clearColor = (0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		g1.depthFunc(g1.LEQUAL);
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH__BUFFER_BIT);
	}
	else
	{
		//Fallback to the usual canvas drawing methods in canvasdraw.js.
	}
};

GLDraw.initWebGL = function ()
{
	;
};