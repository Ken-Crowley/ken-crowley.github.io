const vertexShaderSource = `#version 300 es
void main() {
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
    gl_PointSize = 150.0;
}`;

const fragmentShaderSource = `#version 300 es
precision mediump float;

out vec4 fragColor;

void main() {
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

// get webgl2 rendering context from html canvas element
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');

// webgl2 program
const program = gl.createProgram();

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

gl.useProgram(program);

gl.drawArrays(gl.POINTS, 0, 1);
