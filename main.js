// attributes come in from js, varyings go out to fragment shader
const vertexShaderSrc = `#version 300 es
// attributes
layout(location=0) in vec4 aPosition;
layout(location=1) in vec2 aTexCoord;
layout(location=2) in float aDepth;

// varyings
out vec2 vTexCoord;
out float vDepth;

void main()
{
    vTexCoord = aTexCoord;
    vDepth = aDepth;
    gl_Position = aPosition;
}`;

// varyings come in from vertex shader, and color info goes out to frame buffer/canvas
const fragmentShaderSrc = `#version 300 es
precision mediump float;
precision mediump sampler2DArray;

uniform sampler2DArray uSampler;
in vec2 vTexCoord;
in float vDepth;

out vec4 fragColor;

void main()
{
    fragColor = texture(uSampler, vec3(vTexCoord, vDepth));
}`;

// get webgl2 rendering context from html canvas element
const gl = document.querySelector('canvas').getContext('webgl2');

// webgl2 program
const program = gl.createProgram();

// create vertex shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER); // create shader
gl.shaderSource(vertexShader, vertexShaderSrc); // set GLSLS source code
gl.compileShader(vertexShader); // compile shader
gl.attachShader(program, vertexShader); // attach to program

// create fragment shaderw
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); // create shader
gl.shaderSource(fragmentShader, fragmentShaderSrc); // set GLSLS source code
gl.compileShader(fragmentShader); // compile shader
gl.attachShader(program, fragmentShader); // attach to program

// link program
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { // if linking program fails
    console.log(gl.getShaderInfoLog(vertexShader));
    console.log(gl.getShaderInfoLog(fragmentShader));
    console.log(gl.getProgramInfoLog(program));
    throw new Error('failed to link');
}

gl.useProgram(program);

const positionData = new Float32Array([
    -1,-1,      0,1,
    1,1,        1,0,
    -1,1,       0,0,
    -1,-1,      0,1,
    1,-1,       1,1,
    1,1,        1,0,
]);

const loadImage = (name) => new Promise(resolve => {
    const image = new Image();
    image.src = `./assets/kenney_medieval-rts/output/${name}.png`;
    image.addEventListener('load', () => resolve(image));
});

const createUVLookup = async () => {
    const file = await fetch('./assets/kenney_medieval-rts/atlas.json');
    const data = await file.json();

    const names = Object.keys(data);

    return (index) => names[index] ?? null;
};

const getImageData = (image) => {
    const { width, height } = image; // Step 1: get the image width and height
    const tmpCanvas = document.createElement('canvas'); // Step 2: create a canvas of the same size
    tmpCanvas.width = width;
    tmpCanvas.height = height;
    const context = tmpCanvas.getContext('2d'); // Step 3: get a 2D Rendering Context object (aka Context API context)
    context.drawImage(image, 0,0); // Step 4: upload your image to the GPU
    return context.getImageData(0,0, width, height).data; // Step 5: read the pixel data off the canvas and return it
};

const main = async () => {
    const image = await loadImage('atlas.full');
    const imageData = getImageData(image);
    const getImageName = await createUVLookup();
    
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
    gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.RGBA8, 128,128,126);

    const pbo = gl.createBuffer();
    gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, pbo);
    gl.bufferData(gl.PIXEL_UNPACK_BUFFER, imageData, gl.STATIC_DRAW);
    gl.pixelStorei(gl.UNPACK_ROW_LENGTH, image.width);
    gl.pixelStorei(gl.UNPACK_IMAGE_HEIGHT, image.height);
    
    for (let i = 0; i < 126; i++) {
        const row = Math.floor(i / 8) * 128;
        const col = (i % 8) * 128;
        // Set origin
        gl.pixelStorei(gl.UNPACK_SKIP_PIXELS, col);
        gl.pixelStorei(gl.UNPACK_SKIP_ROWS, row);
        // load texture
        gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0,0,0, i, 128,128,1, gl.RGBA, gl.UNSIGNED_BYTE, 0);
    }
    
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 4*4, 0);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 4*4, 8);
    gl.vertexAttrib1f(2, 78);
    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
};

main();