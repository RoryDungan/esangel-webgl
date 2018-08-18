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
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW)

    const vPosition = gl.getAttribLocation(program, 'vPosition')
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(vPosition)
  }
})()
