const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
    server.close();
  });

  socket.on("data", (data) => {
    const requestData = data.toString();
    const requestLine = requestData.split("\r\n")[0];
    const urlPath = requestLine.split(" ")[1];
    const content = urlPath.split("/")[2];
    console.log(urlPath);
    console.log(content);

    socket.write(
      `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`
    );
    // if (urlPath === "/") {
    //   socket.write(`HTTP/1.1 200 OK\r\n\r\n`);
    // } else {
    //   socket.write(`HTTP/1.1 404 Not Found\r\n\r\n`);
    // }
  });
});
//
server.listen(4221, "localhost");
