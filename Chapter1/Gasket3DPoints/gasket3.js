'use strict'

/**
 * Sierpinski gasket function. Generates vertices for the specified number of
 * points.
 * @param {number} numPoints
 */
const sierpinski = function (numPoints) {
  const vertices = [
    vec3(-0.5, -0.5, -0.5),
    vec3( 0.5, -0.5, -0.5),
    vec3( 0.0,  0.5,  0.0),
    vec3( 0.0, -0.5,  0.5)
  ]

  const points = [ vec3(0, 0, 0) ]

  for (let i = 0; points.length < numPoints; ++i) {
    const j = Math.floor(Math.random() * 4)

    points.push(mix(points[i], vertices[j], 0.5))
  }

  return points
}

const render = (gl, numPoints) => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.drawArrays(gl.POINTS, 0, numPoints)
}

const init = () => {
  const canvas = document.getElementById('gl-canvas')

  const gl = WebGLUtils.setupWebGL(canvas)
  if (!gl) {
    alert('WebGL isn\'t available')
  }

  // Create points
  const numPoints = 5000
  const points = sierpinski(numPoints)

  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(1, 1, 1, 1)
  gl.enable(gl.DEPTH_TEST)

  // Load shaders and initialise attribute buffers
  const program = initShaders(gl, 'vertex-shader', 'fragment-shader')
  gl.useProgram(program)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW)

  const vPosition = gl.getAttribLocation(program, 'vPosition')
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(vPosition)

  render(gl, points.length)
}

window.onload = init

