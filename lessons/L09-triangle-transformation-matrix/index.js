var twgl = window.twgl
var mat4 = require('gl-matrix').mat4
var vec3 = require('gl-matrix').vec3
var canvas = document.querySelector('canvas')
var gl = twgl.getWebGLContext(canvas)

var VSHADER_SOURCE = `
attribute vec4 a_Position;
uniform mat4 u_TransformMatrix;
void main() {
  gl_Position = u_TransformMatrix * a_Position;
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
    -0.5, -0.5,
    0.5, -0.5,
    0, 0.5
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

var mat = mat4.create()
mat4.rotateZ(mat, mat, Math.PI / 2)
mat4.translate(mat, mat, [0.5, 0.5, 0.5])

// translation
var uTransformMatrix = gl.getUniformLocation(gl.program, 'u_TransformMatrix')
// location, transpose? (must be false), array in column major order
gl.uniformMatrix4fv(uTransformMatrix, false, mat)

gl.drawArrays(gl.TRIANGLES, 0, n)
