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
    console.log(data.toString());
    const requestData = data.toString().split("\r\n");
    // const requestLine = requestData.split("\r\n")[0];
    // const headerValue = requestData.split("\r\n")[-1];

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
    } else {
      socket.write(`HTTP/1.1 404 Not Found\r\n\r\n`);
    }
  });
});
//
server.listen(4221, "localhost");
