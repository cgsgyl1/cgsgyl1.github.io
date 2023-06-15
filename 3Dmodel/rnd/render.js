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
            nl = dot(normalize(in_normal), normalize(vec3(2, 2, 2)));
            if (nl < 0.1)
                nl = 0.1;
            gl_Position = MatrWVP * vec4(in_pos, 1);
            v_color = vec4(1, 0.5, 1, 1) * nl;
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

    let dataBuf = [
            0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 
            0, 1, 1, 1, 0, 0, 1, 1, 0, 0,
            1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 
            1, 0, 1, 1, 1, 0, 1, 1, 0, 0,
            1, 0, 1, 1, 0, 1, 1, -1, 0, 0, 
            1, 1, 1, 0, 1, 1, 1, -1, 0, 0, 
            1, 1, 0, 1, 0, 0, 1, -1, 0, 0, 
            1, 0, 0, 0, 1, 0, 1, -1, 0, 0, 
            1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 
            0, 0, 0, 1, 0.5, 1, 0.3, 0, 1, 0, 
            0, 1, 0, 1, 1, 0.4, 1, 0, 1, 0, 
            1, 1, 0, 1, 1, 0.5, 0.4, 0, 1, 0, 
            0, 0, 0, 1, 0, 0, 1, 0, -1, 0, 
            0, 0, 1, 1, 0, 0, 1, 0, -1, 0, 
            0, 1, 1, 1, 0, 1, 1, 0, -1, 0, 
            0, 1, 0, 1, 0, 0, 1, 0, -1, 0, 
            0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 
            0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 
            1, 1, 0, 1, 0, 0, 1, 0, 0, 1,
            1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 
            0, 0, 1, 1, 0, 0, 1, 0, 0, -1,
            0, 0, 0, 1, 0, 0, 1, 0, 0, -1, 
            1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 
            1, 0, 1, 1, 0, 1, 1, 0, 0, -1,
          ];
      let p = [[0, 0, 1], 
               [0, 1, 1], 
               [1, 1, 1],
               [1, 0, 1],
               [1, 0, 1], 
               [1, 1, 1],
               [1, 1, 0],
               [1, 0, 0],
               [1, 0, 0], 
               [0, 0, 0],
               [0, 1, 0],
               [1, 1, 0],
               [0, 0, 0],
               [0, 0, 1],
               [0, 1, 1],
               [0, 1, 0],
               [0, 1, 1],
               [0, 1, 0],
               [1, 1, 0],
               [1, 1, 1],
               [0, 0, 1],
               [0, 0, 0],
               [1, 0, 0],
               [1, 0, 1]
        ];
      let ind = [
        0, 1, 2,
        0, 2, 3, 
        4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14,
        15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
      ];
    let i, p0, p1, p2;
    let Pr = prim(gl, dataBuf, 24, ind, shaderProgram); //prim1
    let cam1 = camera();
    Pr = PrimLoad(Pr, gl, './rnd/cow.obj', shaderProgram).then((res) => {
        Pr = res;

        const render = () => {
        /*gl.bindBuffer(gl.ARRAY_BUFFER, vBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dataBuf), gl.STATIC_DRAW);

        gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 8 * 4, 0);     // pos
        gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 8 * 4, 4 * 4); // color

        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);

        gl.useProgram(shaderProgram);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, dataBuf.length / 8); */
            gl.enable(gl.DEPTH_TEST);

            primDraw(Pr, cam1, MatrMulMatr(mat4().MatrScale([0.1, 0.1, 0.1]), mat4().setRotate(Math.sin((Date.now() / 1000) % 1000), vec3(2, 2, 2)))); // mat4().setRotate(Math.sin((Date.now() / 1000) % 1000), vec3(2, 2, 2))
            window.requestAnimationFrame(render);
        }
    /*for (i = 0; i < ind.length(); i += 3)
    {
        p0 = vec3(p[ind[i]][0], p[ind[i]][1], p[ind[i]][2]);
        p1 = vec3(p[ind[i + 1]][0], p[ind[i + 1]][1], p[ind[i + 1]][2]);
        p2 = vec3(p[ind[i + 2]][0], p[ind[i + 2]][1], p[ind[i + 2]][2]);
    }*/

        render();
    });
}
