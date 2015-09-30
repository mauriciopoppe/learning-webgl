var twgl = window.twgl
var canvas = document.querySelector('canvas')
var gl = twgl.getWebGLContext(canvas)

var VSHADER_SOURCE = `
attribute vec4 a_Position;
uniform vec4 u_Translation;
uniform float u_cosB, u_sinB;
void main() {
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  gl_Position.x += a_Position.x * u_cosB - a_Position.y * u_sinB;
  gl_Position.y += a_Position.x * u_sinB + a_Position.y * u_cosB;
  gl_Position.z += a_Position.z;
  gl_Position += u_Translation;
  gl_Position.w = 1.0;
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

// translation
var uTranslation = gl.getUniformLocation(gl.program, 'u_Translation')
gl.uniform4f(uTranslation, 0.5, 0.5, 0.5, 1.0)
// rotation
var angle = Math.PI / 2
var uCosB = gl.getUniformLocation(gl.program, 'u_cosB')
var uSinB = gl.getUniformLocation(gl.program, 'u_sinB')
gl.uniform1f(uCosB, Math.cos(angle))
gl.uniform1f(uSinB, Math.sin(angle))

gl.drawArrays(gl.TRIANGLES, 0, n)
