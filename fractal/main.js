function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
  
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) console.log("unload");
    return shader;
}


/*const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vs);
  const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fs);
    
  const program = gl.createProgram();
  gl.attachShader(program, vertexSh);
  gl.attachShader(program, fragmentSh);
  gl.linkProgram(program);
  const start = Date.now();

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert("!!!!!");
  }

  const posLoc = gl.getAttribLocation(program, "in_pos");

  const posBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  const pos = [-1, 1, 0, -1, -1, 0, 1, 1, 0, 1, -1, 0];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
  gl.vertexAttribPointer(posLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(posLoc);
  gl.useProgram(program);

  const timeFromStart = Date.now() - start;
  const loc = gl.getUniformLocation(program, "Time");
  gl.uniform1f(loc, timeFromStart / 1000);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  const draw = () => {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posLoc);
    gl.useProgram(program);
    const timeFromStart = Date.now() - start;
    gl.uniform1f(loc, timeFromStart / 1000);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    window.requestAnimationFrame(draw);
  }

  draw();

}
*/

export function initGL() {
    const canvas = document.getElementById("glCanvas");
    //const canvas = document.getElementById("glCanvas");
    const gl = canvas.getContext("webgl2");

    gl.clearColor(0, 1, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vs = `#version 300 es
    precision highp float;
    in highp vec4 in_pos;
    out highp vec4 color;
    out highp vec2 out_pos;

    void main() {
        gl_Position = in_pos;
        out_pos = in_pos.xy;
        color = vec4(in_pos.xy, 0.7, 1);
    }
  `;
  const fs = `#version 300 es
  precision highp float;
  out highp vec4 o_color;
  in highp vec2 out_pos;
  in highp vec4 color;
  uniform float Time;

  vec2 mul( vec2 z1, vec2 z2 )
    {
      return vec2(z1.x * z2.x - z1.y * z2.y, z1.x * z2.y + z1.y * z2.x);
    }

  float Julia( vec2 Z, vec2 C )
    {
      for (int n = 0; n < 255; n++)
      {
        if (dot(Z, Z) > 4.0)
        {
          return float(n);
        }
        Z = mul(Z, Z) + C;
      }
      return 256.0;
    }  

  void main() {
      o_color = color * Julia(out_pos, vec2(0.3 + sin(Time) * 0.12, 0.4)) / 256.0 * vec4(0.5, 0, 1, 1);
  }
  `;

  const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vs);
  const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fs);
    
  const program = gl.createProgram();
  gl.attachShader(program, vertexSh);
  gl.attachShader(program, fragmentSh);
  gl.linkProgram(program);
  const start = Date.now();

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert("!!!!!");
  }

  const posLoc = gl.getAttribLocation(program, "in_pos");

  const posBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  const pos = [-1, 1, 0, -1, -1, 0, 1, 1, 0, 1, -1, 0];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
  gl.vertexAttribPointer(posLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(posLoc);
  gl.useProgram(program);

  const timeFromStart = Date.now() - start;
  const loc = gl.getUniformLocation(program, "Time");
  gl.uniform1f(loc, timeFromStart / 1000);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  const draw = () => {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posLoc);
    gl.useProgram(program);
    const timeFromStart = Date.now() - start;
    gl.uniform1f(loc, timeFromStart / 1000);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    window.requestAnimationFrame(draw);
  }

  draw();

}


/*
let readline = require('readline');
let rl = readline.createInterface(process.stdin, process.stdout);
let casenum = 1, ccom = -1, l = [], isl = 0;
let t, x, y, sm = 0, isr = 0, i, m;
rl.on('line', function(line) {
    let input = line.split(' ');
    if (input.length == 2 && ccom == -1){
        ccom = parseInt(input[1]);  
        isl = 1;
    }
    else if (isl){
        isl = 0;
        l = line.split(' ');
        for (i = 0; i < l.length; i++){
                l[i] = parseInt(l[i]);
            }
    }
    else{
        if (input[0] === 'P'){
            x = parseInt(input[1]);
            y = parseInt(input[2]);
            t = l[x];
            l[x] = l[y];
            l[y] = t;
            ccom--;
        }
        else if (input[0] === 'R'){
            isr = !isr;
            ccom--;
        }
       else if (input[0] === 'S'){
            sm += parseInt(input[1]);
            ccom--;
        }
       else if (input[0] === 'M'){
            m = parseInt(input[1]);
            for (i = 0; i < l.length; i++){
                l[i] += sm;
                l[i] *= m;
            }
            sm = 0;
            ccom--;
        }
        else if (input[0] === 'D'){
            m = parseInt(input[1]);
            for (i = 0; i < l.length; i++){
                l[i] += sm;
                l[i] -= l[i] % m;
                l[i] /= m;
            }
            sm = 0;
            ccom--;
        }
        else{
            mxcase = parseInt(input[0]);
        }
        if (ccom == 0 && casenum <= mxcase){
             for (i = 0; i < l.length; i++){
                l[i] += sm;
             }
            sm = 0;
            if(isr){
                l.reverse();   
            }
            isr = 0;
            console.log(`Case ${casenum}:`);
            console.log(`${l.join(' ')}`);
            casenum++;
            ccom = -1;
        }
    }
}); */
