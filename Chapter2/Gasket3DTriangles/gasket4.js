'use strict'

/**
 * Sierpinski gasket function. Generates triangles for the specified number of
 * iterations.
 * @param {number} iterations
 */
const sierpinski = function (iterations) {
  const baseColours = [
    vec3(1, 0, 0),
    vec3(0, 1, 0),
    vec3(0, 0, 1),
    vec3(0, 0, 0),
  ]

  const triangle = function (a, b, c, colour) {
    return {
      verts: [a, b, c],
      colours: R.repeat(colour, 3)
    }
  }

  const tetra = function* (a, b, c, d) {
    yield triangle(a, c, b, baseColours[0])
    yield triangle(a, c, d, baseColours[1])
    yield triangle(a, b, d, baseColours[2])
    yield triangle(b, c, d, baseColours[3])
  }

  const divideTetra = function* (a, b, c, d, count) {
    if (count <= 0) {
      yield *tetra(a, b, c, d)
      return
    }

    // Bisect the sides
    const
      ab = mix(a, b, 0.5),
      ac = mix(a, c, 0.5),
      ad = mix(a, d, 0.5),
      bc = mix(b, c, 0.5),
      bd = mix(b, d, 0.5),
      cd = mix(c, d, 0.5)

    const newCount = count - 1

    // Three new triangles
    yield *divideTetra( a, ab, ac, ad, newCount)
    yield *divideTetra(ab,  b, bc, bd, newCount)
    yield *divideTetra(ac, bc,  c, cd, newCount)
    yield *divideTetra(ad, bd, cd,  d, newCount)
  }

  const vertices = [
    vec3(  0.0000,  0.0000, -1.0000 ),
    vec3(  0.0000,  0.9428,  0.3333 ),
    vec3( -0.8165, -0.4714,  0.3333 ),
    vec3(  0.8165, -0.4714,  0.3333 )
  ]

  return [...divideTetra(...vertices, iterations)]
}

const render = (gl, numVertices) => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, numVertices)
}

const init = () => {
  // Create points
  const numDivisions = 3,
    sp = sierpinski(numDivisions),
    tris = R.chain(t => t.verts, sp),
    colours = R.chain(t => t.colours, sp),
    numVertices = tris.length

  const canvas = document.getElementById('gl-canvas')

  const gl = WebGLUtils.setupWebGL(canvas)
  if (!gl) {
    alert('WebGL isn\'t available')
  }

  // Configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(1, 1, 1, 1)

  // Enable hidden surface removal
  gl.enable(gl.DEPTH_TEST)

  // Load shaders and initialise attribute buffers
  const program = initShaders(gl, 'vertex-shader', 'fragment-shader')
  gl.useProgram(program)

  const cBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colours), gl.STATIC_DRAW)

  const vColour = gl.getAttribLocation(program, 'vColour')
  gl.vertexAttribPointer(vColour, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColour)

  const vBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, flatten(tris), gl.STATIC_DRAW)

  const vPosition = gl.getAttribLocation(program, 'vPosition')
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(vPosition)

  render(gl, numVertices)
}

window.onload = init

