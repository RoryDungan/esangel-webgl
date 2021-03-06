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

    const vBuffer = gl.createBuffer()
      , maxNumVertices = 1024
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, maxNumVertices, gl.STATIC_DRAW)

    const vPosition = gl.getAttribLocation(program, 'vPosition')
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(vPosition)

    // Counter for how many vertices we've added to the scene by clicking
    let vertexIndex = 0

    const addPoint = pos => {
      gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer)

      gl.bufferSubData(
        gl.ARRAY_BUFFER, sizeof['vec2'] * vertexIndex,
        flatten(pos)
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
        gl.drawArrays(gl.POINTS, 0, vertexIndex)
      }
    }

    window.requestAnimationFrame(render)
  }

  window.onload = init
})()
