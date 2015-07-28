var twgl = window.twgl
var mat4 = require('gl-matrix').mat4
var vec3 = require('gl-matrix').vec3

var VSHADER_SOURCE = `
attribute vec4 a_Position;
uniform mat4 u_ModelMatrix;
void main() {
  gl_Position = u_ModelMatrix * a_Position;
  gl_PointSize = 10.0;
}
`

var FSHADER_SOURCE = `
precision mediump float;
uniform float u_Width;
uniform float u_Height;
void main() {
  gl_FragColor = vec4(gl_FragCoord.x / u_Width, 0.0, gl_FragCoord.y / u_Height, 1.0);
}
`

function init () {
  var canvas = document.querySelector('canvas')
  var gl = twgl.getWebGLContext(canvas)
  var program = gl.program = twgl.createProgramFromSources(gl, [VSHADER_SOURCE, FSHADER_SOURCE])
  gl.useProgram(program)
  return gl
}

function initVertexBuffers (gl) {
  var verticesSizes = new Float32Array([
    // (x, y, r, g, b)
    -0.3, -0.3, 1.0, 0.0, 0.0,
    0.3, -0.3, 0.0, 1.0, 0.0,
    0, 0.3, 0.0, 0.0, 1.0
  ])
  var n = 3

  // create a buffer for the points
  var vertexBuffer = gl.createBuffer()
  // bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  // write data into the buffer object
  // pointer to the buffer, data, hint
  gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW)

  var FSIZE = verticesSizes.BYTES_PER_ELEMENT

  // vertexAttrPointer params
  // - location
  // - size of each component
  // - normalized (true to normalize to (0, 1))
  // - stride (number of bytes between different vertex data)
  // - offset (the offset in bytes from where to start reading

  // connect attribute a_Position with what's stored in gl.ARRAY_BUFFER
  var aPosition = gl.getAttribLocation(gl.program, 'a_Position')
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5 * FSIZE, 0)
  gl.enableVertexAttribArray(aPosition)

  var uWidth = gl.getUniformLocation(gl.program, 'u_Width')
  gl.uniform1f(uWidth, gl.drawingBufferWidth)
  var uHeight = gl.getUniformLocation(gl.program, 'u_Height')
  gl.uniform1f(uHeight, gl.drawingBufferHeight)

  return n
}

function draw (gl) {
  // draw
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  var n = initVertexBuffers(gl)

  // transformation
  // - (rotate(translate(mat))) = (rotate * translate) * mat
  var mat = mat4.create()
  mat4.rotateZ(mat, mat, Math.PI / 180)
  mat4.translate(mat, mat, [0.0, 0.0, 0.0])

  // translation
  var uModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix')
  // location, transpose? (must be false), array in column major order
  gl.uniformMatrix4fv(uModelMatrix, false, mat)

  gl.drawArrays(gl.TRIANGLES, 0, n)
}

function tick () {
  // window.requestAnimationFrame(tick)
  draw(gl)
}

var gl = init()
tick()
