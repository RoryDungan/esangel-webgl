'use strict'

/**
 * Sierpinski gasket function. Generates triangles for the specified number of
 * iterations.
 * @param {number} iterations
 */
const sierpinski = function (iterations) {
  const divideTriangle = function* (a, b, c, count) {
    if (count <= 0) {
      yield a
      yield b
      yield c
      return
    }

    // Bisect the sides
    const
      ab = mix(a, b, 0.5),
      ac = mix(a, c, 0.5),
      bc = mix(b, c, 0.5)

    const newCount = count - 1

    // Three new triangles
    yield *divideTriangle(a, ab, ac, newCount)
    yield *divideTriangle(c, ac, bc, newCount)
    yield *divideTriangle(b, bc, ab, newCount)
  }

  const vertices = [
    vec2(-1, -1),
    vec2( 0,  1),
    vec2( 1, -1)
  ]

  return [...divideTriangle(...vertices, iterations)]
}

const render = (gl, numVertices) => {
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, numVertices)
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
  const numDivisions = 5,
    tris = sierpinski(numDivisions),
    numVertices = tris.length

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, flatten(tris), gl.STATIC_DRAW)

  const vPosition = gl.getAttribLocation(program, 'vPosition')
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(vPosition)

  render(gl, numVertices)
}

window.onload = init

