import { vec3, mat4, MatrIdentity, MatrTranspose, MatrMulMatr} from "./mth/mth.js";
export { vec3, mat4, MatrIdentity, MatrTranspose, MatrMulMatr};

class _vert {
  constructor(p1 = null) {
    if (p1 == null) {
      this.pos = [0, 0, 0];
      this.color = [0, 0, 0, 0];
      this.normal = [0, 0, 0];
    } else if (typeof p1 == "object" && p1.length == 3) {
      this.pos = p1[0];
      this.color = p1[1];
      this.normal = p1[2];
    } else if (typeof p1 == "object" && p1.length == 10) {
      this.pos = [p1[0], p1[1], p1[2]];
      this.color = [p1[3], p1[4], p1[5], p1[6]];
      this.normal = [p1[7], p1[8], p1[9]];
    } else {
      let k = arguments.length;
      this.pos = [0, 0, 0];
      this.color = [0, 0, 0, 0];
      this.normal = [0, 0, 0];
      for (let i = 0; i < 3; i++) {
        this.pos[i] = arguments[i];
      }
      for (let i = 3; i < 7; i++) {
        this.color[i - 3] = arguments[i];
      }
      if (k == 10) {
        this.normal = [arguments[7], arguments[8], arguments[9]];
      }
    }
  }
  toArray() {
    return [].concat(this.pos, this.color, this.normal);
  } // End of 'toArray' function
}

export function vert(...args) {
  return new _vert(...args);
} // End of 'vec3' function

export function arrayVert(mode, array) {
  let res = [];
  if (mode === false) {
    for (let i = 0; i < array.length / 7; i++) {
      res.push(
        vert(
          array[i],
          array[i + 1],
          array[i + 2],
          array[i + 3],
          array[i + 4],
          array[i + 5],
          array[i + 6]
        )
      );
    }
  } else {
    for (let i = 0; i < array.length / 10; i++) {
      res.push(
        vert(
          array[i],
          array[i + 1],
          array[i + 2],
          array[i + 3],
          array[i + 4],
          array[i + 5],
          array[i + 6],
          array[i + 7],
          array[i + 8],
          array[i + 9]
        )
      );
    }
  }
  return res;
}

export function VertToArray(array) {
  let res = [];
  for (let i = 0; i < array.length; i++) {
    res.push(...array[i].toArray());
  }
  return res;
}

class _prim {
  constructor(gl, V, NumofV, I, shd) {
    this.Trans = mat4().setIdentity();
    if (V != undefined) {
        this.VA = gl.createVertexArray();
        this.VBuf = gl.createBuffer();

        gl.bindVertexArray(this.VA);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.VBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(V), gl.STATIC_DRAW);

        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 10 * 4, 0); //pos
        gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 10 * 4, 4 * 3); //color
        gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 10 * 4, 4 * 7); //normal

        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);
        gl.enableVertexAttribArray(2);

        gl.bindVertexArray(null);
    }
    if (I != undefined) {
        this.IBuf = gl.createBuffer();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IBuf);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(I), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        this.NumofElements = I.length;
    }
    else {
        this.NumofElements = V.length;
    }
    this.NV = NumofV;
    this.shader = shd;
    this.gl = gl;
  }
} // End of 'prim' construction
export function prim(...args) { // chtoby vezde new ne pisat
    return new _prim(...args);
  } // End of 'prim' function
  
export function primDraw(Pr, cam, World) {
    let w = MatrMulMatr(Pr.Trans, World);
    let winv = MatrTranspose(mat4(w).inverse());
    let wvp = MatrMulMatr(w, cam.matrVP);
    
    Pr.gl.useProgram(Pr.shader);

    Pr.gl.bindVertexArray(Pr.VA);
    let loc1 = Pr.gl.getUniformLocation(Pr.shader, "MatrWVP");
    if (loc1 != null){
      Pr.gl.uniformMatrix4fv(loc1, false, new Float32Array(wvp.toArray()));
    }
    //   let loc2 = Pr.gl.getUniformLocation(Pr.shader, "MatrW");
    //   Pr.gl.UnifromMatrix4fv(loc2, false, Float32Array(wvp.toArray()));
    //   let loc3 = Pr.gl.getUniformLocation(Pr.shader, "MatrInv");
    //   Pr.gl.UnifromMatrix4fv(loc3, false, Float32Array(wvp.toArray()));
  
    if (Pr.IBuf != undefined) {
      Pr.gl.bindBuffer(Pr.gl.ELEMENT_ARRAY_BUFFER, Pr.IBuf);
      Pr.gl.drawElements(Pr.gl.TRIANGLES, Pr.NumofElements, Pr.gl.UNSIGNED_INT, 0);
      
      Pr.gl.bindBuffer(Pr.gl.ELEMENT_ARRAY_BUFFER, null);
    } else {
      Pr.gl.drawArrays(Pr.gl.TRIANGLES, 0, Pr.NumofElements);
    }
  
    Pr.gl.bindVertexArray(null);
    Pr.gl.useProgram(null);
  }

  async function loadFileAsync(filename) {
    try {
      const response = await fetch(filename);
      const text = await response.text();
      return text;
    } catch(err) {
      console.log(err);
    }
  }

  export function PrimLoad(Pr, gl, filename, shd)
  {
    let I = [], V = [];
    //const smth = text.split('\n');
    let text = loadFileAsync(filename);
    let prom = Promise.all([text]).then((res) => {
      const smth = res[0].split('\n');
      //const smth = res[0];
      //console.log(smth);
      let g = smth.length;
      console.log(g);
      for (let i = 0; i < g; i++)
      {
        let line = smth[i];
        if (line[0] == 'v' && line[1] == ' '){
          let x, y, z;
          let input = line.split(' ');
          x = parseFloat(input[1]);
          y = parseFloat(input[2]);
          z = parseFloat(input[3]);
          let v = vert();
          v.color = [1, 0, 1, 1];
          v.pos = [x, y, z];
          V.push(v);
        }
        else if (line[0] == 'f' && line[1] == ' '){
          let input = line.split(' ');
          let input1 = input[1].split('//');
          let input2 = input[2].split('//');
          let input3 = input[3].split('//');
          I.push(parseInt(input1[0]) - 1);
          I.push(parseInt(input2[0]) - 1);
          I.push(parseInt(input3[0]) - 1);
        }
      }
      let i;
      //V = VertToArray(V);
      for (i = 0; i < I.length; i += 3)
      {
        let p0 = vec3(V[I[i]].pos);
        let p1 = vec3(V[I[i + 1]].pos);
        let p2 = vec3(V[I[i + 2]].pos);
        let N = ((p1.sub(p0)).cross(p2.sub(p0))).normalize();
        
        V[I[i]].normal = (vec3(V[I[i]].normal).add(N)).toArray();
        //console.log(N);
        V[I[i + 1]].normal = (vec3(V[I[i + 1]].normal).add(N)).toArray();
        V[I[i + 2]].normal = (vec3(V[I[i + 2]].normal).add(N)).toArray();
      }
      for (i = 0; i < V.length; i++)
      {
        V[i].normal = (vec3(V[i].normal).normalize()).toArray();
      }
      //console.log(V);
      let Pr = prim(gl, VertToArray(V), V.lenght, I, shd);
      return Pr;
  });
  return prom;  
  }  