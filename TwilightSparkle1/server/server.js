const http = require("http");
const express = require("express");
const morgan = require("morgan");
const { Server } = require("socket.io");
let fs = require("fs");

const app = express();
app.use(morgan("combined"));
app.use(express.static("./dist"));
let fileContent1 = "";

//initialize a simple http server
const server = http.createServer(app);
const io = new Server(server);

const clients = [];
let liderBoard = [];
let fileContent = "";

function textLiderBoard() {
  let text = "";
  for (let i = 0; i < liderBoard.length; i++) {
    text +=
      "№ " +
      (i + 1) +
      " " +
      liderBoard[i].name +
      " score: " +
      liderBoard[i].score +
      " time: " +
      liderBoard[i].time +
      "\n";
  }
  return text;
}

io.on("connection", (socket) => {
  clients.push(socket);
  socket.emit("LoadHistory", fileContent1);
  for (client of clients) {
    client.emit("CountOnline", clients.length);
  }
  console.log(`Client connected with id: ${socket.id}`);
  let text1 = textLiderBoard();
  socket.emit("LeaderBoard", text1);
  socket.on("FinishGame", (msg) => {
    liderBoard.push(msg);
    console.log(liderBoard);
    liderBoard.sort((a, b) => (a.score < b.score ? 1 : -1));
    console.log(liderBoard);
    let text = textLiderBoard();
    console.log(text);
    for (client of clients) {
      client.emit("LeaderBoard", text);
    }
    fs.writeFile("lider.txt", JSON.stringify(liderBoard), function (error) {
      if (error) throw error; // ошибка чтения файла, если есть
      console.log("Данные успешно записаны записать файл");
    });
  });
  socket.on("MessageToServer", (msg) => {
    const replyMsg = msg;
    fileContent += msg;
    console.log(replyMsg);
    for (client of clients) {
      if (client === socket) {
        continue;
      }
      client.emit("MessageFromServer", replyMsg);
    }
  });
  socket.on("disconnect", () => {
    console.log(`Client disconnected with id: ${socket.id}`);
    const index = clients.indexOf(socket);
    if (index > -1) {
      clients.splice(index, 1);
    }
    for (client of clients) {
      client.emit("CountOnline", clients.length);
    }
    console.log(clients.length);
    if (clients.length === 0) {
      fs.writeFile("chat.txt", fileContent1, function (error) {
        if (error) throw error; // ошибка чтения файла, если есть
        console.log("Данные успешно записаны записать файл");
      });
    }
  });
});

server.listen(process.env.PORT || 8000, () => {
  console.log(`Server started on port ${server.address().port} :)`);
  fileContent1 = fs.readFileSync("chat.txt", "utf8");
  fileContent = fs.readFileSync("lider.txt", "utf8");
  if (fileContent.length < 5) {
    fileContent = "";
  } else {
    liderBoard = JSON.parse(fileContent);
  }
});
