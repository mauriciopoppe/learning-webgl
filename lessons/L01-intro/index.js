var twgl = require('twgl.js').twgl
// program
// - get the canvas
// - get the rendering context for WebGL
// - initialize shaders
// - clear the canvas
// - draw
var canvas = document.querySelector('canvas')
var gl = twgl.getWebGLContext(canvas)

var VSHADER_SOURCE = `
  void main() {
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
    gl_PointSize = 10.0;
  }
`

var FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`

// initialize shaders
var program = twgl.createProgramFromSources(gl, [VSHADER_SOURCE, FSHADER_SOURCE])
gl.useProgram(program)

// clear
gl.clearColor(0.0, 0.0, 0.0, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)

// execute the vertex shader in the mode of POINTS
// from the vertex 0 using 1 vertex
// mode=gl.POINTS, first=0, count=1
gl.drawArrays(gl.POINTS, 0, 1)
