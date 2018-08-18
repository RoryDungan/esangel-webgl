(function() {
  'use strict'

  const render = (gl, thetaLoc) => {
    let theta = 0

    const renderHelper = () => {
      gl.clear(gl.COLOR_BUFFER_BIT)

      theta += 0.01
      gl.uniform1f(thetaLoc, theta)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      window.requestAnimationFrame(renderHelper)
    }
    renderHelper()
  }

  const init = () => {
    const canvas = document.getElementById('gl-canvas')

    const gl = WebGLUtils.setupWebGL(canvas)
    if (!gl) {
      alert("WebGL isn't available")
    }

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(1, 1, 1, 1)

    // Load shaders and initialise attribute buffers
    const program = initShaders(gl, 'vertex-shader', 'fragment-shader')
    gl.useProgram(program)

    const vertices =
      [ vec2(0, 1)
      , vec2(1, 0)
      , vec2(-1, 0)
      , vec2(0, -1)
      ]

    const vBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW)

    const vPosition = gl.getAttribLocation(program, 'vPosition')
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(vPosition)

    const thetaLoc = gl.getUniformLocation(program, 'theta')

    render(gl, thetaLoc)
  }

  window.onload = init
})()
