var twgl = window.twgl
var mat4 = require('gl-matrix').mat4
var vec3 = require('gl-matrix').vec3

var VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute vec2 a_TextureCoordinate;
varying vec2 v_TextureCoordinate;
void main() {
  gl_Position = a_Position;
  v_TextureCoordinate = a_TextureCoordinate;
}
`

var FSHADER_SOURCE = `
precision mediump float;
uniform sampler2D u_Sampler;
varying vec2 v_TextureCoordinate;
void main() {
  gl_FragColor = texture2D(u_Sampler, v_TextureCoordinate);
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
    // (x, y, texture coordinates x, texture coordinates y)
    -0.5, 0.5, 0.0, 4.0,
    -0.5, -0.5, 0.0, 0.0,
    0.5, 0.5, 4.0, 4.0,
    0.5, -0.5, 4.0, 0.0
  ])
  var n = 4

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
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 4 * FSIZE, 0)
  gl.enableVertexAttribArray(aPosition)

  var aTexCoord = gl.getAttribLocation(gl.program, 'a_TextureCoordinate')
  gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 4 * FSIZE, 2 * FSIZE)
  gl.enableVertexAttribArray(aTexCoord)

  return n
}

function loadTexture (gl, n, texture, uSampler, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)

  //
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT)

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
  gl.uniform1i(uSampler, 0)

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
}

function initTextures (gl, n) {
  var texture = gl.createTexture()
  var uSampler = gl.getUniformLocation(gl.program, 'u_Sampler')
  var image = new window.Image()
  image.onload = function () {
    loadTexture(gl, n, texture, uSampler, image)
  }
  image.src = './img.jpg'
}

function draw (gl) {
  // draw
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  var n = initVertexBuffers(gl)
  initTextures(gl, n)
}

function tick () {
  // window.requestAnimationFrame(tick)
  draw(gl)
}

var gl = init()
tick()
