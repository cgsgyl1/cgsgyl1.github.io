import { io } from "socket.io-client";

const shuffle = (array) => {
  let m = array.length,
    t,
    i;

  // РџРѕРєР° РµСЃС‚СЊ СЌР»РµРјРµРЅС‚С‹ РґР»СЏ РїРµСЂРµРјРµС€РёРІР°РЅРёСЏ
  while (m) {
    // Р’Р·СЏС‚СЊ РѕСЃС‚Р°РІС€РёР№СЃСЏ СЌР»РµРјРµРЅС‚
    i = Math.floor(Math.random() * m--);

    // Р РїРѕРјРµРЅСЏС‚СЊ РµРіРѕ РјРµСЃС‚Р°РјРё СЃ С‚РµРєСѓС‰РёРј СЌР»РµРјРµРЅС‚РѕРј
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
};

function arrayfill(array, n) {
  // РѕС‚ РЅСѓР»СЏ РґРѕ n
  while (array.length != 0) {
    array.pop();
  }
  for (let i = 0; i < n; i++) {
    array.push(i);
  }
}

const Countries = [
  "Austurland",
  "WatertownsConfederation",
  "PuertoCaballo",
  "Kasa",
  "Greneclyf",
  "Firtree",
  "FarbrookRepublic",
  "Asterion",
  "Arcturia",
  "CrystalEmpire",
  "ChangelingLands",
  "DragonIsles",
  "Equestria",
  "GriffonianEmpire",
  "GriffonianRepublic",
  "NewMareland",
  "NorthernDuchy",
  "NovaGriffonia",
  "Olenia",
  "Pingland",
  "PolarBearConfederation",
  "RiverFederation",
  "Stalliongrad",
  "Yakyakistan",
];
const Ans = [
  "Austurland",
  "Watertowns Confederation",
  "Puerto Caballo",
  "Kasa",
  "Greneclyf",
  "Firtree",
  "Farbrook Republic",
  "Asterion",
  "Arcturia",
  "Crystal Empire",
  "Changeling Lands",
  "Dragon Isles",
  "Equestria",
  "Griffonian Empire",
  "Griffonian Republic",
  "New Mareland",
  "Northern Duchy",
  "Nova Griffonia",
  "Olenia",
  "Pingland",
  "Polar Bear Confederation",
  "River Federation",
  "Stalliongrad",
  "Yakyakistan",
];
let i = -1;
let score = 0;
let starttime = Date.now();
let numbers = [];
let flag = 0;
let cur = 0;
let mode = true;
let game = false;
let breaks = false;
let Ispause = 0;
let Stoppause = 0;
let numContr = 20;
let prevAns = "";

async function main() {
  const socket = io();
  setInterval(() => {
    if (flag === 0 && game) {
      document.getElementById("id5").value = (
        (Date.now() - starttime) /
        1000
      ).toFixed(2);
    }
  }, 1);
  // client-side
  socket.on("connect", () => {
    document.getElementById("okno").style.display = "none";
    document.getElementById("id10").classList.add("hidden");
    document.getElementById("id10t").classList.add("hidden");
    document.getElementById("id8").classList.add("hidden");
    document.getElementById("id7").classList.add("hidden");
    document.getElementById("id1").classList.add("hidden");
    document.getElementById("id1t").classList.add("hidden");
    document.getElementById("id2").classList.add("hidden");
    document.getElementById("id2t").classList.add("hidden");
    document.getElementById("id3").value = "Unknown pony";
    document.Name = "";
    document.getElementById("id6").src = "bin/images/original.png";
    console.log(socket.id);
    socket.on("LeaderBoard", function (msg) {
      document.getElementById("id4").value = msg;
      console.log(msg);
    });
    socket.on("MessageFromServer", function (msg) {
      const value = document.getElementById("id15").value;
      document.getElementById("id15").value = value + msg;
      console.log(msg);
    });
    socket.on("LoadHistory", function (msg) {
      document.getElementById("id15").value = msg;
      console.log(msg);
    });
    socket.on("CountOnline", function (msg) {
      console.log("приветики пистолетики" + msg);
      document.getElementById("id16").textContent = "Bronies on site: " + msg;
    });
  });

  socket.on("disconnect", () => {
    console.log(socket.id); // undefined
  });

  document.getElementById("id0").addEventListener("click", (event) => {
    if (mode) {
      game = true;
      breaks = false;
      document.getElementById("id9").value = "Break game";
      document.getElementById("id7").value = "Previous answer";
      document.getElementById("id1").value = "";
      document.getElementById("id2").value = "";
      document.getElementById("id2").style.color = "FF01FF";
      document.getElementById("id7").classList.remove("hidden");
      document.getElementById("id1").classList.remove("hidden");
      document.getElementById("id1t").classList.remove("hidden");
      document.getElementById("id2").classList.remove("hidden");
      document.getElementById("id2t").classList.remove("hidden");
      numbers = [];
      arrayfill(numbers, numContr);
      shuffle(numbers);
      console.log(numbers);
      document.getElementById("id6").src =
        "bin/imageNeg/" + Countries[numbers[0]] + ".png";
      starttime = Date.now();
      i = 0;
      score = 0;
      flag = 0;
      document.getElementById("id10").classList.remove("hidden");
      document.getElementById("id10t").classList.remove("hidden");
      document.getElementById("id10").value = score + "/" + numbers.length;
    }
  });
  document.getElementById("id9").addEventListener("click", (event) => {
    if (!game) {
      mode = !mode;
      if (!mode) {
        document.getElementById("id0").classList.add("hidden");
        document.getElementById("id11").classList.add("hidden");
        document.getElementById("id11t").classList.add("hidden");
        document.getElementById("id12").classList.add("hidden");
        document.getElementById("id7").value = "Next";
        document.getElementById("id8").value = "Previous";
        document.getElementById("id9").value = "Normal mode";
        document.getElementById("id8").classList.remove("hidden");
        document.getElementById("id7").classList.remove("hidden");
        document.getElementById("id1").classList.remove("hidden");
        document.getElementById("id2").classList.add("hidden");
        document.getElementById("id2t").classList.add("hidden");
        document.getElementById("id10").classList.add("hidden");
        document.getElementById("id10t").classList.add("hidden");
        document.getElementById("id6").src =
          "bin/images/" + Countries[0] + ".png";
        document.getElementById("id1").value = Ans[0];
        cur = 0;
      } else {
        document.getElementById("id0").classList.remove("hidden");
        document.getElementById("id11").classList.remove("hidden");
        document.getElementById("id11t").classList.remove("hidden");
        document.getElementById("id12").classList.remove("hidden");
        document.getElementById("id2").classList.remove("hidden");
        document.getElementById("id2t").classList.remove("hidden");
        document.getElementById("id1").value = "";
        document.getElementById("id9").value = "Training mode";
        document.getElementById("id8").classList.add("hidden");
        document.getElementById("id1").classList.add("hidden");
        document.getElementById("id1t").classList.add("hidden");
        document.getElementById("id7").classList.add("hidden");
        document.getElementById("id6").src = "bin/images/original.png";
      }
    } else {
      game = false;
      breaks = true;
      document.getElementById("id1").value = "";
      document.getElementById("id9").value = "Training mode";
      document.getElementById("id2").classList.add("hidden");
      document.getElementById("id2t").classList.add("hidden");
      document.getElementById("id1").classList.add("hidden");
      document.getElementById("id1t").classList.add("hidden");
      document.getElementById("id7").classList.add("hidden");
      document.getElementById("id10").classList.add("hidden");
      document.getElementById("id10t").classList.add("hidden");
      document.getElementById("id6").src = "bin/images/original.png";
    }
  });
  document.getElementById("id18").addEventListener("click", (event) => {
    console.log(";(")
    document.getElementById("okno").style.display = "none";

  });
  document.getElementById("id11").addEventListener("input", (event) => {
    document.getElementById("id12").textContent =
      document.getElementById("id11").value;
    numContr = document.getElementById("id11").value;
  });
  document.getElementById("id8").addEventListener("click", (event) => {
    if (!mode) {
      if (cur - 1 < 0) {
        cur = Countries.length - 1;
      } else {
        cur--;
      }
      document.getElementById("id6").src =
        "bin/images/" + Countries[cur] + ".png";
      document.getElementById("id1").value = Ans[cur];
    }
  });
  document.getElementById("id7").addEventListener("click", (event) => {
    if (mode && breaks === false) {
      if (i == -1 && numbers.length != 0) {
        i = numbers.length;
      }
      if (i > 0) {
        if (flag === 0) {
          document.getElementById("id6").src =
            "bin/imageNeg/" + Countries[numbers[i - 1]] + ".png";
          document.getElementById("id1").value = Ans[numbers[i - 1]];

          if (prevAns === Ans[numbers[i - 1]]) {
            document.getElementById("id2").style.color = "green";
          } else {
            document.getElementById("id2").style.color = "red";
          }
          document.getElementById("id2").value = prevAns;
          document.getElementById("id7").value = "Back to game";
          Ispause = Date.now();
          flag = 1;
        } else {
          document.getElementById("id7").value = "Previous answer";
          document.getElementById("id2").value = "";
          document.getElementById("id1").value = "";
          document.getElementById("id2").style.color = "#FF01FF";
          Stoppause = Date.now();
          starttime = starttime + Stoppause - Ispause;
          console.log(((Date.now() - starttime) / 1000).toFixed(2));
          flag = 0;
          if (i != numbers.length) {
            document.getElementById("id6").src =
              "bin/imageNeg/" + Countries[numbers[i]] + ".png";
          } else {
            document.getElementById("id6").src = "bin/images/original.png";
            i = -1;
          }
        }
      }
    } else if (!mode) {
      if (cur + 1 >= Countries.length) {
        cur = 0;
      } else {
        cur++;
      }
      document.getElementById("id6").src =
        "bin/images/" + Countries[cur] + ".png";
      document.getElementById("id1").value = Ans[cur];
    }
  });
  document.getElementById("id14").onkeyup = (ev) => {
    if (ev.code === "Enter") {
      const value =
        document.getElementById("id3").value +
        ": " +
        document.getElementById("id14").value +
        "\n";
      console.log(value);
      document.getElementById("id14").value = "";
      const value1 = document.getElementById("id15").value;
      document.getElementById("id15").value = value1 + value;

      socket.emit("MessageToServer", value);
    }
  };
  document.getElementById("id2").onkeyup = (ev) => {
    if (mode) {
      if (i != -1 && flag != 1) {
        if (ev.code === "Enter") {
          //right/wrong answer
          let value = document.getElementById("id2").value;
          prevAns = value;
          if (value === Ans[numbers[i]]) {
            score++;
            document.getElementById("id1").value = "";
            document.getElementById("id10").value =
              score + "/" + numbers.length;
          } else {
            document.getElementById("id1").value = Ans[numbers[i]];
          }
          i++;
          //finish game
          if (i >= numbers.length) {
            let MLPuser = {
              name: "",
              time: 0,
              score: 0,
            };
            if (document.getElementById("id3").value === "") {
              MLPuser.name = "Anonymous";
            } else {
              MLPuser.name = document.getElementById("id3").value;
            }
            MLPuser.time = ((Date.now() - starttime) / 1000).toFixed(2);
            MLPuser.score = score;
            socket.emit("FinishGame", MLPuser);
            document.getElementById("okno").style.display = "block";
            if (score < 6) {
              document.getElementById("id19").textContent = "Ты, как и Марбл, далёк от мира за пределами твоего дома((( " + score + "/" + Countries.length;
              document.getElementById("id17").src =
        "bin/ponys/Dumb.webp";
            } else if (score < 12){
              document.getElementById("id19").textContent = "Ты, как и Коко, настоящий молодец! Но тебе, как и ей, есть куда стремиться) " + score + "/" + Countries.length;
              document.getElementById("id17").src =
        "bin/ponys/NotDumb.jfif";
            }
            else if (score < 18){
              document.getElementById("id19").textContent = "Ты, как и Рэмбоу Дэш, ооочень крут!!!) " + score + "/" + Countries.length;
              document.getElementById("id17").src =
        "bin/ponys/Cool.jpg";
            }
            else if (score < 24){
              document.getElementById("id19").textContent = "Поздравляю! Ты, как и Селестия, не один год знаешь пони!!!)))  " + score + "/" + Countries.length;
              document.getElementById("id17").src =
        "bin/ponys/Genious.webp";
            }
            else if (score === 24){
              document.getElementById("id19").textContent = "Поздравляю! Ты, как и Селестия, достоин править целой страной пони!!!)))  " + score + "/" + Countries.length;
              document.getElementById("id17").src =
        "bin/ponys/Genious.webp";
            }
            game = false;
            document.getElementById("id2").classList.add("hidden");
            document.getElementById("id2t").classList.add("hidden");
            document.getElementById("id9").value = "Training mode";
            document.getElementById("id10").classList.add("hidden");
            document.getElementById("id10t").classList.add("hidden");
            document.getElementById("id1").value = "";
            i = -1;
            breaks = false;
            document.getElementById("id6").src = "bin/images/original.png";
          } else {
            //next step
            document.getElementById("id2").value = "";
            //change map
            document.getElementById("id6").src =
              "bin/imageNeg/" + Countries[numbers[i]] + ".png";
          }
        }
      }
    }
  };
}

window.addEventListener("load", (event) => {
  document.getElementById("id5").value =
    (Date.now() - starttime - ((Date.now() - starttime) % 1000)) / 1000;
  main();
});
