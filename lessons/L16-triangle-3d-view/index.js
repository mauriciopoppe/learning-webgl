var twgl = require('twgl.js').twgl
var mat4 = require('gl-matrix').mat4
var vec3 = require('gl-matrix').vec3

var VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat4 u_ViewMatrix;
varying vec4 v_Color;
void main() {
  gl_Position = u_ViewMatrix * a_Position;
  v_Color = a_Color;
}
`

var FSHADER_SOURCE = `
precision mediump float;
varying vec4 v_Color;
void main() {
  gl_FragColor = v_Color;
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
    // (x,y,z,r,g,b)
    0.0, 0.5, -0.4, 0.4, 1.0, 0.4,
    -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
    0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

    0.5, 0.4, -0.2, 1.0, 0.4, 0.4,
    -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
    0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

    0.0, 0.5, 0.0, 0.4, 0.4, 1.0,
    -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
    0.5, -0.5, 0.0, 1.0, 0.4, 0.4
  ])
  var n = 9

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
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 6 * FSIZE, 0)
  gl.enableVertexAttribArray(aPosition)

  var aColor = gl.getAttribLocation(gl.program, 'a_Color')
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 6 * FSIZE, 3 * FSIZE)
  gl.enableVertexAttribArray(aColor)

  return n
}

function draw (gl) {
  // draw
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  var n = initVertexBuffers(gl)

  // view matrix
  var uViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix')
  var viewMatrix = mat4.create()
  mat4.lookAt(viewMatrix, [0.2, 0.25, 0.25], [0, 0, 0], [0, 1, 0])
  gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix)

  gl.drawArrays(gl.TRIANGLES, 0, n)
}

function tick () {
  // window.requestAnimationFrame(tick)
  draw(gl)
}

var gl = init()
tick()
