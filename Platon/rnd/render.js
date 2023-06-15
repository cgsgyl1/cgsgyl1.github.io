import { prim, primDraw, PrimLoad } from "./prim.js";
import { vec3, mat4, camera, MatrIdentity, MatrMulMatr } from "./mth/mth.js";
export { vec3 };

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Shader not compiled!")
    }

    return shader;
}

export function initGL() {
    const canvas = document.getElementById("glCanvas");
    const gl = canvas.getContext("webgl2");

    gl.clearColor(1, 0.75, 0.79, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Code below you may delete for test

    const vs = `#version 300 es
        precision highp float;
        layout(location = 0) in vec3 in_pos;
        layout(location = 1) in vec4 in_color;
        layout(location = 2) in vec3 in_normal;
        uniform mat4 MatrWVP;        
        out vec4 v_color;

        void main() {
            float nl;
            nl = dot(normalize(in_normal), normalize(vec3(-1, -1, -1)));
            if (nl < 0.1)
                nl = 0.1;
            gl_Position = MatrWVP * vec4(in_pos, 1);
            v_color = vec4(nl, 0.5 * nl, nl, 1);
        }
    `;

    const fs = `#version 300 es
        precision highp float;
        out vec4 f_color;
        in vec4 v_color;

        void main() {
            f_color = v_color;
        }
    `;

    const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fs);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexSh);
    gl.attachShader(shaderProgram, fragmentSh);
    gl.linkProgram(shaderProgram);

    const vBuf = gl.createBuffer();

    let tetr_dtBuf = [
        1, 2, 1, 1, 0, 0, 1, 1, 2, 1, 0, 1, 2, 0, 1, 0, 1, 0, 1, 2, 0, 1, 0, 0, 0,
        1, 1, 0, 1, 0, 2, 1, 0, 0, 1, 0, 1, 2, 1, 0, 2, 1, 2, 1, 0, 0, 1, 2, 1, 2,
        1, 0, 1, 0, 1, 0, 1, 1, 0, 1,
      ];
    
      let tetr_ind = [
        0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 1, 4, 1, 4, 5, 3, 4, 5, 2, 3, 5, 1, 2, 5,
      ];

    let cube_dtBuf = [
        -1, -1, 1, 0, 1, 0, 1, 1, -1, -1, -1, 1, 1, 1, 0, 0, 1, 1, -1, -1, 1, 1, 1,
        0, 0, 1, 1, 1, -1, -1, 1, -1, 1, 1, 1, 0, 1, 1, -1, -1, 1, -1, 1, 1, 0, 1,
        1, -1, -1, -1, 1, 1, 1, 0, 1, 1, 1, -1, -1, -1, 1, 1, -1, 1, 0, 1, 1, -1,
        -1, -1, 1, -1, -1, 1, 1, 0, 1, -1, -1, -1, 1, -1, -1, 1, 0, 1, 1, -1, 1, -1,
        -1, -1, -1, 0, 0, 1, -1, -1, 1, -1, -1, 1, -1, 1, 1, 0, 1, -1, 1, -1, 1, 1,
        -1, 1, 0, 1, 1, -1, 1, -1, -1, -1, -1, 1, 0, 1, 1, -1, -1, -1, -1, -1, 1, 0,
        0, 1, 1, -1, -1, -1, -1, 1, 1, 1, 0, 1, 1, -1, -1, -1, -1, 1, -1, 1, 0, 1,
        1, -1, -1, -1, -1, 1, 1, 0, 1, 1, 1, -1, -1, 1, -1, 1, -1, 1, 1, 1, 1, -1,
        -1, 1, 1, 1, -1, 1, 0, 0, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1,
        -1, 1, 0, 0, 1, 1, -1, -1, -1, -1, -1, -1, 0, 1, 0, 1, -1, -1, -1, 1, -1,
        -1, 1, 1, 1, 1, -1, -1, -1, 1, -1, 1, 1, 0, 1, 1, -1, -1, -1,
      ];
    
      let cube_ind = [
        0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14,
        15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
      ];
    
      let oct_dtBuf = [
        1, 2, 1, 1, 1, 0, 1, 1, 2, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 2, 0, 0, 1, 0,
        1, 1, 2, 0, 0, 1, 0, 2, 0, 1, 0, 1, 1, 0, 2,
      ];
    
      let oct_ind = [0, 1, 2, 0, 2, 3, 0, 1, 3, 1, 2, 3];
    
      let icos_dtBuf = [
        0, -1, 0, 0, 1, 0, 1, 1, 0, 0, -0.276, -0.447, -0.851, 1, 0, 0, 1, 1, 0, 0,
        0.724, -0.447, -0.526, 1, 1, 0, 1, 1, 0, 0, 0.724, -0.447, 0.526, 1, 0, 0,
        1, -1, 0, 0, -0.276, -0.447, 0.851, 0, 1, 0, 1, -1, 0, 0, -0.894, -0.447, 0,
        1, 1, 0.4, 1, 0, 1, 0, -0.724, 0.447, 0.526, 1, 1, 0.5, 0.4, 0, 1, 0,
        -0.724, 0.447, -0.526, 0, 0, 1, 1, 1, 0, 0, 0.276, 0.447, -0.851, 1, 0, 1,
        1, -1, 0, 0, 0.894, 0.447, 0, 0, 1, 1, 1, -1, 0, 0, 0.276, 0.447, 0.851, 1,
        0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0.5, 1, 0.3, 0, 1, 0,
      ];
    
      let icos_ind = [
        0, 1, 2, 0, 1, 5, 0, 4, 5, 0, 3, 4, 0, 2, 3, 6, 10, 11, 6, 7, 11, 7, 8, 11,
        8, 9, 11, 9, 10, 11, 2, 3, 9, 1, 2, 8, 1, 5, 7, 4, 5, 6, 3, 4, 10, 4, 6, 10,
        5, 6, 7, 1, 7, 8, 2, 8, 9, 3, 9, 10,
      ];
    
      let dodec_dtBuf = [
        0.149, -0.631, -0.459, 0, 1, 0, 1, 1, 0, 0,
        -0.39, -0.631, -0.284, 1, 0, 0, 1, 1, 0, 0, 
        -0.39, -0.631, 0.284, 1, 1, 0, 1, 1, 0, 0,
        0.149, -0.631, 0.459, 1, 0, 0, 1, -1, 0, 0,
        0.483, -0.631, 0,     0, 1, 0, 1, -1, 0, 0, 
        -0.149, 0.631, 0.459, 1, 1, 0.4, 1, 0, 1, 0, 
        -0.483, 0.631, 0, 1, 1, 0.5, 0.4, 0, 1, 0,
        -0.149, 0.631, -0.459, 0, 0, 1, 1, 0, 1, 0, 0.39, 0.631, -0.284, 1, 1, 0, 1,
        0, 1, 0, 0.39, 0.631, 0.284, 1, 0, 1, 1, 0, 1, 0, 0.781, -0.149, 0, 1, 1, 0,
        1, 0, 1, 0, 0.241, -0.149, -0.743, 1, 0, 1, 1, 0, 1, 0, -0.631, -0.149,
        -0.459, 0, 1, 0, 1, 0, 1, 0, -0.631, -0.149, 0.459, 1, 1, 0, 1, 0, 1, 0,
        0.241, -0.149, 0.743, 1, 0, 1, 1, 0, 1, 0, -0.241, 0.149, 0.743, 1, 1, 0, 1,
        0, 1, 0, -0.781, 0.149, 0, 0, 1, 1, 1, 0, 1, 0, -0.241, 0.149, -0.743, 1, 0,
        1, 1, 0, 1, 0, 0.631, 0.149, -0.459, 0, 1, 1, 1, 0, 1, 0, 0.631, 0.149,
        0.459, 0, 0, 1, 1, 0, 1, 0,
      ];
    
      let dodec_ind = [
        0, 1, 2, 0, 2, 3, 0, 3, 4, 5, 6, 7, 5, 7, 9, 7, 8, 9, 5, 9, 15, 9, 14, 15,
        9, 14, 19, 2, 13, 15, 2, 3, 15, 3, 14, 15, 5, 6, 15, 6, 15, 16, 13, 15, 16,
        3, 4, 14, 4, 14, 19, 4, 10, 19, 1, 2, 13, 1, 12, 13, 12, 13, 16, 7, 8, 17,
        8, 11, 17, 8, 11, 18, 10, 11, 18, 4, 10, 11, 0, 4, 11, 8, 9, 19, 8, 18, 19,
        10, 18, 19, 0, 1, 11, 1, 11, 17, 1, 12, 17, 12, 16, 17, 6, 16, 17, 6, 7, 17,
      ];
    
    let tetr = prim(gl, tetr_dtBuf, 24, tetr_ind, shaderProgram); 
    let oct = prim(gl, oct_dtBuf, 24, oct_ind, shaderProgram); 
    let cube = prim(gl, cube_dtBuf, 24, cube_ind, shaderProgram); 
    let icos = prim(gl, icos_dtBuf, 24, icos_ind, shaderProgram);
    let dodec = prim(gl, dodec_dtBuf, 24, dodec_ind, shaderProgram);  
    let cam1 = camera();
    
    const render = () => {
            gl.enable(gl.DEPTH_TEST);

            //primDraw(first, cam1, MatrMulMatr(mat4().MatrScale([0.3, 0.3, 0.3]), mat4().setRotate(Math.sin((Date.now() / 1000) % 1000), vec3(2, 2, 2)))); // mat4().setRotate(Math.sin((Date.now() / 1000) % 1000), vec3(2, 2, 2))
            //primDraw(tetr, cam1, MatrMulMatr(mat4().setRotate(Math.sin((Date.now() / 1000) % 1000), vec3(2, 2, 2))), mat4().MatrTranslate(2, 2, 0));
            primDraw(tetr, cam1, MatrMulMatr(mat4().MatrScale([0.3, 0.3, 0.3]), MatrMulMatr(mat4().MatrTranslate(vec3(2, 2, 0)), mat4().setRotate(Math.sin(Date.now() / 1123.0), vec3(2, 2, 3))))); // mat4().setRotate(Math.sin((Date.now() / 1000) % 1000), vec3(2, 2, 2))
            primDraw(oct, cam1, MatrMulMatr(mat4().MatrScale([0.3, 0.3, 0.3]), MatrMulMatr(mat4().MatrTranslate(vec3(1, 2, 0)), mat4().setRotate(Math.sin(Date.now() / 1123.0), vec3(2, 2, 3))))); // mat4().setRotate(Math.sin((Date.now() / 1000) % 1000), vec3(2, 2, 2))
            primDraw(cube, cam1, MatrMulMatr(mat4().MatrScale([0.3, 0.3, 0.3]), MatrMulMatr(mat4().MatrTranslate(vec3(0, 2, 0)), mat4().setRotate(Math.sin(Date.now() / 1123.0), vec3(2, 2, 3)))));
            primDraw(icos, cam1, MatrMulMatr(mat4().MatrScale([0.3, 0.3, 0.3]), MatrMulMatr(mat4().MatrTranslate(vec3(-1, 2, 0)), mat4().setRotate(Math.sin(Date.now() / 1123.0), vec3(2, 2, 3)))));
            primDraw(dodec, cam1, MatrMulMatr(mat4().MatrScale([0.3, 0.3, 0.3]), MatrMulMatr(mat4().MatrTranslate(vec3(-2, 2, 0)), mat4().setRotate(Math.sin(Date.now() / 1123.0), vec3(2, 2, 3)))));
            window.requestAnimationFrame(render);
        }

        render();
}
