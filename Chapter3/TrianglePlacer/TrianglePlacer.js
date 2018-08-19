(function () {
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

    // Vertices buffer
    const vBuffer = gl.createBuffer()
      , maxNumVertices = 1024
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, maxNumVertices, gl.STATIC_DRAW)

    const vPosition = gl.getAttribLocation(program, 'vPosition')
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(vPosition)

    // Colours buffer
    const colours =
      [ vec4(0, 0, 0, 1) // Black
      , vec4(1, 0, 0, 1) // Red
      , vec4(1, 1, 0, 1) // Yellow
      , vec4(0, 1, 0, 1) // Green
      , vec4(0, 0, 1, 1) // Blue
      , vec4(1, 0, 1, 1) // Magenta
      , vec4(0, 1, 1, 1) // Cyan
      ]

    const cBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, maxNumVertices, gl.STATIC_DRAW)

    const vColour = gl.getAttribLocation(program, 'vColour')
    gl.vertexAttribPointer(vColour, 4, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(vColour)

    // Counter for how many vertices we've added to the scene by clicking
    let vertexIndex = 0

    const addPoint = pos => {
      gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer)
      gl.bufferSubData(
        gl.ARRAY_BUFFER,
        sizeof['vec2'] * vertexIndex,
        flatten(pos)
      )

      gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer)
      const c = colours[vertexIndex % colours.length]
      gl.bufferSubData(
        gl.ARRAY_BUFFER,
        sizeof['vec4'] * vertexIndex,
        flatten(c)
      )
      vertexIndex++
    }

    // Click to add points
    canvas.addEventListener('click', evt => {
      const pos = vec2(
        -1 + 2 * evt.clientX / canvas.width,
        -1 + 2 * (canvas.height - evt.clientY) / canvas.height
      )
      addPoint(pos)

      window.requestAnimationFrame(render)
    })

    const render = () => {
      gl.clear(gl.COLOR_BUFFER_BIT)
      if (vertexIndex > 0) {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexIndex)
      }
    }

    window.requestAnimationFrame(render)
  }

  window.onload = init
})()
