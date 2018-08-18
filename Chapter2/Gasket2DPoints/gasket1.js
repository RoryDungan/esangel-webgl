'use strict'

/**
 * Sierpinski gasket function. Generates vertices for the specified number of
 * points.
 * @param {number} numPoints
 */
const sierpinski = function* (numPoints) {
  const vertices = [
    vec2(-1, -1),
    vec2( 0,  1),
    vec2( 1, -1)
  ]

  const u = mix(vertices[0], vertices[1], 0.5)
  const v = mix(vertices[0], vertices[2], 0.5)

  let point = mix(u, v, 0.5)

  for (let i = 0; i < numPoints; i++) {
    yield point

    const j = Math.floor(Math.random() * 3)

    point = mix(point, vertices[j], 0.5)
  }
}

const render = (gl, numPoints) => {
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.POINTS, 0, numPoints)
}

const init = () => {
  const canvas = document.getElementById('gl-canvas')

  const gl = WebGLUtils.setupWebGL(canvas)
  if (!gl) {
    alert('WebGL isn\'t available')
  }

  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(1, 1, 1, 1)

  // Load shaders and initialise attribute buffers
  const program = initShaders(gl, 'vertex-shader', 'fragment-shader')
  gl.useProgram(program)

  // Create points
  const numPoints = 5000
  const points = [...sierpinski(numPoints)]

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW)

  const vPosition = gl.getAttribLocation(program, 'vPosition')
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(vPosition)

  render(gl, numPoints)
}

window.onload = init

