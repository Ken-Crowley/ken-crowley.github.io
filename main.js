// attributes come in from js, varyings go out to fragment shader
const vertexShaderSource = `#version 300 es
// attributes
layout(location=0) in vec4 aPosition;
layout(location=1) in vec4 aColor;

// varyings
out vec4 vColor;

void main() {
    vColor = aColor;
    gl_Position = aPosition;
}`;

// varyings come in from vertex shader, and color info goes out to frame buffer/canvas
const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec4 vColor;

out vec4 fragColor;

void main() {
    fragColor = vColor;
}`;

// get webgl2 rendering context from html canvas element
const gl = document.querySelector('canvas').getContext('webgl2');

// webgl2 program
const program = gl.createProgram();
{
    // create vertex shader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER); // create shader
    gl.shaderSource(vertexShader, vertexShaderSource); // set GLSLS source code
    gl.compileShader(vertexShader); // compile shader
    gl.attachShader(program, vertexShader); // attach to program

    // create fragment shaderw
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); // create shader
    gl.shaderSource(fragmentShader, fragmentShaderSource); // set GLSLS source code
    gl.compileShader(fragmentShader); // compile shader
    gl.attachShader(program, fragmentShader); // attach to program

    // link program
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { // if linking program fails
        console.log(gl.getShaderInfoLog(fragmentShader));
    }
}

gl.useProgram(program);

const arrayVertexData = new Float32Array([ // x,y position and rbg color
	0,0,				1,0,0,
	0.00000,1.00000,	1,0,0,
	0.95106,0.30902,	1,0,0,

	0,0,				0,1,0,
	0.95106,0.30902,	0,1,0,
	0.58779,-.80902,	0,1,0,

	0,0,				0,0,1,
	0.58779,-.80902,	0,0,1,
	-.58779,-.80902,	0,0,1,

	0,0,				1,1,0,
	-.58779,-.80902,	1,1,0,
	-.95106,0.30902,	1,1,0,

	0,0,				1,0,1,
	-.95106,0.30902,	1,0,1,
	0.00000,1.00000,	1,0,1,
]);

const elementVertexData = new Float32Array([
	0,0,				0,0,0,
	0.00000,1.00000,	1,0,0,
	0.95106,0.30902,	0,1,0,
	0.58779,-.80902,	0,0,1,
	-.58779,-.80902,	1,1,0,
	-.95106,0.30902,	1,0,1,
]);

const elementIndexData = new Uint8Array([
    0,1,2,
    0,2,3,
    0,3,4,
    0,4,5,
    0,5,1,
])

// buffer
const arrayVertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, arrayVertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, arrayVertexData, gl.STATIC_DRAW);

const elementVertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, elementVertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, elementVertexData, gl.STATIC_DRAW);

const elementIndexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementIndexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elementIndexData, gl.STATIC_DRAW);

// gl.bindBuffer(gl.ARRAY_BUFFER, arrayVertexBuffer);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 5*4, 0);
gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 5*4, 2*4);

gl.enableVertexAttribArray(0);
gl.enableVertexAttribArray(1);

// gl.drawArrays(gl.TRIANGLES, 0, 15);
gl.drawElements(gl.TRIANGLES, 15, gl.UNSIGNED_BYTE, 0);