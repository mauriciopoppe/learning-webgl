var twgl = require('twgl.js').twgl



var canvas = document.querySelector('canvas')
var gl = twgl.getWebGLContext(canvas)

var VSHADER_SOURCE = `
attribute vec4 a_Position;
void main() {
  gl_Position = a_Position;
}
`

var FSHADER_SOURCE = `
precision mediump float;
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`
function initVertexBuffers (gl) {
  var vertices = new Float32Array([
    0.0, 0.5,
    -0.5, -0.5,
    0.5, -0.5
  ])
  var n = 3

  // create a buffer for the points
  var vertexBuffer = gl.createBuffer()
  // bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  // write data into the buffer object
  // pointer to the buffer, data, hint
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  var aPosition = gl.getAttribLocation(gl.program, 'a_Position')
  // assigns the buffer stored in gl.ARRAY_BUFFER to the attribute
  // aPosition
  // - location
  // - size of each component
  // - normalized (true to normalize to (0, 1))
  // - stride (number of bytes between different vertex data)
  // - offset (the offset in bytes from where to start reading
  // the data)
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)
  // enable assignment i.e. make the connection between the buffer
  // and the attribute
  gl.enableVertexAttribArray(aPosition)
  return n
}

var program = gl.program = twgl.createProgramFromSources(gl, [VSHADER_SOURCE, FSHADER_SOURCE])
gl.useProgram(program)

// draw
gl.clearColor(0.0, 0.0, 0.0, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)
var n = initVertexBuffers(gl)
// gl.drawArrays(gl.POINTS, 0, n)
// gl.drawArrays(gl.LINES, 0, n)
// gl.drawArrays(gl.LINE_STRIP, 0, n)
gl.drawArrays(gl.LINE_LOOP, 0, n)
// gl.drawArrays(gl.TRIANGLES, 0, n)
// gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
// gl.drawArrays(gl.TRIANGLE_FAN, 0, n)
