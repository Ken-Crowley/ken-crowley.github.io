const vertexShaderSource = `#version 300 es
uniform float uPointSize;
uniform vec2 uPosition;

void main() {
    gl_PointSize = uPointSize;
    gl_Position = vec4(uPosition, 0.0, 1.0);
}`;

const fragmentShaderSource = `#version 300 es
precision mediump float;

uniform int uIndex;
uniform vec4 uColors[3];

out vec4 fragColor;

void main() {
    fragColor = uColors[uIndex];
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

const uPositionLoc = gl.getUniformLocation(program, 'uPosition');
gl.uniform2f(uPositionLoc, 0, -.2);

const uPointSizeLoc = gl.getUniformLocation(program, 'uPointSize');
gl.uniform1f(uPointSizeLoc, 100);

const uIndexLoc = gl.getUniformLocation(program, `uIndex`);
const uColorsLoc = gl.getUniformLocation(program, 'uColors') 

gl.uniform1i(uIndexLoc, 0);
gl.uniform4fv(uColorsLoc, [
    1,0,0,1,
    0,1,0,1,
    0,0,1,1,
]);

gl.drawArrays(gl.POINTS, 0, 1);

