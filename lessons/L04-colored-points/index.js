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
precision mediump float;
uniform vec4 u_FragColor;
void main() {
  gl_FragColor = u_FragColor;
}
`

var program = twgl.createProgramFromSources(gl, [VSHADER_SOURCE, FSHADER_SOURCE])
gl.useProgram(program)

// creating the attribute
var aPosition = gl.getAttribLocation(program, 'a_Position')

// another attribute
var aPointSize = gl.getAttribLocation(program, 'a_PointSize')
gl.vertexAttrib1f(aPointSize, 10.0)

// uniform
var uFragColor = gl.getUniformLocation(program, 'u_FragColor')
if (uFragColor < 0) { throw Error('invalid location') }

var gPoints = []
var gColors = []

function drawPoints () {
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  for (var i = 0; i < gPoints.length; i += 1) {
    var xy = gPoints[i]
    var rgba = gColors[i]
    gl.vertexAttrib2f(aPosition, xy[0], xy[1])
    gl.uniform4f(uFragColor, rgba[0], rgba[1], rgba[2], rgba[3])
    gl.drawArrays(gl.POINTS, 0, 1)
  }
}
drawPoints()

function click (ev) {
  var x = ev.clientX
  var y = ev.clientY
  var rect = ev.target.getBoundingClientRect()
  // coords -> (-1, 1)
  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2)
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2)
  gPoints.push([x, y])

  // colors based on the location
  if (x >= 0 && y >= 0) {
    gColors.push([1.0, 0.0, 0.0, 1.0]) // red
  } else if (x < 0 && y < 0) {
    gColors.push([0.0, 1.0, 0.0, 1.0]) // green
  } else {
    gColors.push([1.0, 1.0, 1.0, 1.0]) // white
  }
  drawPoints()
}

canvas.addEventListener('mousemove', function (ev) {
  click(ev)
})
