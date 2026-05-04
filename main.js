// attributes come in from js, varyings go out to fragment shader
const vertexShaderSrc = `#version 300 es
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
const fragmentShaderSrc = `#version 300 es
precision mediump float;

uniform sampler2D uSampler;
in vec2 vTexCoord;

out vec4 fragColor;

void main()
{
    fragColor = texture(uSampler, vTexCoord);
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
    // Quad 1
    -1,0,
    0,1,
    -1,1,
    -1,0,
    0,0,
    0,1,

    // Quad 2
    0,0,
    1,1,
    0,1,
    0,0,
    1,0,
    1,1,

    // Quad 3
    -1,-1,
    0,0,
    -1,0,
    -1,-1,
    0,-1,
    0,0,

    // Quad 4
    0,-1,
    1,0,
    0,0,
    0,-1,
    1,-1,
    1,0,
]);

const loadAtlas = () => new Promise(resolve => {
    const image = new Image();
    image.src = './assets/kenney_medieval-rts/output/atlas.full.png'
    image.addEventListener('load', () => resolve(image));
});
const createUVLookup = async () => {
    const file = await fetch('./assets/kenney_medieval-rts/atlas.json');
    const data = await file.json();

    const w = 128 / 1024;
    const h = 128 / 2048;
    const hPadding = .25 / 1024;
    const vPadding = .25 / 2048;

    return (name) => {
        if (!data[name]) return null;
        const [u,v] =  data[name];

        return [
            u + hPadding,                          v - vPadding + h,
            u - hPadding + w,                      v + vPadding,
            u + hPadding,                          v + vPadding,

            u + hPadding,                          v - vPadding + h,
            u - hPadding + w,                      v - vPadding + h,
            u - hPadding + w,                      v + vPadding,
        ];
    };
};

const main = async () => {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    const texCoordData = new Float32Array(2 * 4 * 6);
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoordData.byteLength, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(1);

    const image = await loadAtlas();
    const getUVs = await createUVLookup();
    texCoordData.set(getUVs('medievalTile_03'), 0);
    texCoordData.set(getUVs('medievalTile_17'), 12);
    texCoordData.set(getUVs('medievalTile_05'), 24);
    texCoordData.set(getUVs('medievalTile_07'), 36);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, texCoordData);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1024, 2048, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.drawArrays(gl.TRIANGLES, 0, 24);
};

main();