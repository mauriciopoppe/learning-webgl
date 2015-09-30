var twgl = require('twgl.js').twgl

var canvas = document.querySelector('canvas')
var gl = twgl.getWebGLContext(canvas)

var VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute float a_PointSize;
void main() {
  gl_Position = a_Position;
  gl_PointSize = a_PointSize;
}
`

var FSHADER_SOURCE = `
void main() {
  gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
}
`

var program = twgl.createProgramFromSources(gl, [VSHADER_SOURCE, FSHADER_SOURCE])
gl.useProgram(program)

// creating the attribute
var aPosition = gl.getAttribLocation(program, 'a_Position')
if (aPosition < 0) {
  console.log('Failed to get the storage location of a_Position')
}
gl.vertexAttrib3f(aPosition, 0.0, 0.5, 0.0)

// another attribute
var aPointSize = gl.getAttribLocation(program, 'a_PointSize')
gl.vertexAttrib1f(aPointSize, 20.0)

gl.clearColor(0.0, 0.0, 0.0, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)

// execute the vertex shader in the mode of POINTS
// from the vertex 0 using 1 vertex
// mode, first, count
gl.drawArrays(gl.POINTS, 0, 1)
