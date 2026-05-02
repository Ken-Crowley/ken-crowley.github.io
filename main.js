// attributes come in from js, varyings go out to fragment shader
const vertexShaderSource = `#version 300 es
// attributes
layout(location=0) in vec4 aPosition;
layout(location=1) in vec2 aTexCoord;

// varyings
out vec2 vTexCoord;

void main()
{
    vTexCoord = aTexCoord; 
    gl_Position = aPosition;
    
}`;

// varyings come in from vertex shader, and color info goes out to frame buffer/canvas
const fragmentShaderSource = `#version 300 es
precision mediump float;

uniform sampler2D uPixelSampler;
uniform sampler2D uKittenSampler;
in vec2 vTexCoord;

out vec4 fragColor;

void main()
{
    fragColor = texture(uPixelSampler, vTexCoord) * texture(uKittenSampler, vTexCoord);
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
        console.log(gl.getShaderInfoLog(vertexShader));
        console.log(gl.getShaderInfoLog(fragmentShader));
    }
}

gl.useProgram(program);

const vertexBufferData = new Float32Array([
    -.9,-.9,
    0,.9,
    .9,-.9,
]);

const texCoordBufferData = new Float32Array([
    0,0,
    .5,1,
    1,0,
]);

const pixels = new Uint8Array([
	255,255,255,		230,25,75,			60,180,75,			255,225,25,
	67,99,216,			245,130,49,			145,30,180,			70,240,240,
	240,50,230,			188,246,12,			250,190,190,		0,128,128,
	230,190,255,		154,99,36,			255,250,200,		0,0,0,
]);

// vertex buffer
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexBufferData, gl.STATIC_DRAW);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(0);

// texCoord buffer
const texCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, texCoordBufferData, gl.STATIC_DRAW);
gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(1);

const loadImage = () => new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.src = './kitten.jpg';
});

const run = async () => {
    const image = await loadImage();

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const pixelTextureUnit = 0;
    const kittenTextureUnit = 5;

    gl.uniform1i(gl.getUniformLocation(program, 'uPixelSampler'), pixelTextureUnit);
    gl.uniform1i(gl.getUniformLocation(program, 'uKittenSampler'), kittenTextureUnit);

    const pixelTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + pixelTextureUnit);
    gl.bindTexture(gl.TEXTURE_2D, pixelTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 4, 4, 0, gl.RGB, gl.UNSIGNED_BYTE, pixels);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    const kittenTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + kittenTextureUnit);
    gl.bindTexture(gl.TEXTURE_2D, kittenTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 500, 300, 0, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
};

run();