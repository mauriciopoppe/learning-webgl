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
uniform sampler2D u_Sampler1;
uniform sampler2D u_Sampler2;
varying vec2 v_TextureCoordinate;
void main() {
  vec4 color1 = texture2D(u_Sampler1, v_TextureCoordinate);
  vec4 color2 = texture2D(u_Sampler2, v_TextureCoordinate);
  gl_FragColor = color1 / color2;
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
    -0.5, 0.5, 0.0, 1.0,
    -0.5, -0.5, 0.0, 0.0,
    0.5, 0.5, 1.0, 1.0,
    0.5, -0.5, 1.0, 0.0
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

var loaded = 0
function loadTexture (gl, n, texture, uSampler, image, textUnit) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)

  if (textUnit === 0) {
    gl.activeTexture(gl.TEXTURE0)
  } else {
    gl.activeTexture(gl.TEXTURE1)
  }
  gl.bindTexture(gl.TEXTURE_2D, texture)

  loaded += 1

  //
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT)

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
  gl.uniform1i(uSampler, textUnit)

  if (loaded === 2) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
  }
}

function initTextures (gl, n) {
  var tex1 = gl.createTexture()
  var uSampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1')
  var image1 = new window.Image()
  image1.onload = function () {
    loadTexture(gl, n, tex1, uSampler1, image1, 0)
  }
  image1.src = './img.jpg'

  var tex2 = gl.createTexture()
  var uSampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2')
  var image2 = new window.Image()
  image2.onload = function () {
    loadTexture(gl, n, tex2, uSampler2, image2, 1)
  }
  image2.src = './mask.png'
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
