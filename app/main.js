const net = require("net");
const fs = require("fs");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const flags = process.argv.slice(2);
const directory = flags.find((_, index) => flags[index - 1] == "--directory");

// const directory = process.argv[3];
console.log("flags - ", flags);

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
  });

  socket.on("data", (data) => {
    console.log(data.toString());
    const requestData = data.toString().split("\r\n");
    const requestLine = requestData[0];
    const headerValue = requestData[requestData.length - 3].split(": ")[1];

    const urlPath = requestLine.split(" ")[1];
    if (urlPath === "/") {
      socket.write(`HTTP/1.1 200 OK\r\n\r\n`);
    } else if (urlPath.includes("echo")) {
      const content = urlPath.split("/")[2];
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`
      );
    } else if (urlPath.toLowerCase().includes("user-agent")) {
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${headerValue.length}\r\n\r\n${headerValue}`
      );
    } else if (urlPath.includes("file")) {
      const fileName = urlPath.split("/")[2];
      // const directory = process.argv[3];
      console.log;
      console.log(directory);
      if (!fs.existsSync(directory + fileName)) {
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        socket.end();
        return;
      }
      fs.readFile(`${directory}/${fileName}.txt`, "utf-8", (err, data) => {
        // if (err) {
        //   socket.write(`HTTP/1.1 404 Not Found\r\n\r\n`);
        //   return;
        // }
        socket.write(
          `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length:${data.length}\r\n\r\n${data}`
        );
      });
    } else {
      socket.write(`HTTP/1.1 404 Not Found\r\n\r\n`);
    }
  });
});
//
server.listen(4221, "localhost");
