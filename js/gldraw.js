var gl;

var GLDraw = function () 
{
	;
};

GLDraw.start = function ()
{
	var glCanvas = document.getElementById("mainGL");
	gl = GLDraw.initWebGL(glCanvas);

	if (gl)
	{
		gl.clearColor = (0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	}
	else
	{
		//Fallback to the usual canvas drawing methods in canvasdraw.js.
	}
};

GLDraw.clear = function ()
{
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
}

GLDraw.initWebGL = function (canvas)
{
	gl = null;
	try
	{
		gl = canvas.getContext("webgl") || glCanvas.getContext("experimental-webgl");
	}
	catch(e)
	{
		alert("Unable to initialize WebGL. Your browser may not support it.");
		gl = null;
	}
	
	return gl;
};