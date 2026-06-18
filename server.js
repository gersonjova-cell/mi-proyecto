const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

http
  .createServer((request, response) => {
    const requested = request.url === "/" ? "/index.html" : request.url;
    const filePath = path.join(__dirname, path.normalize(requested).replace(/^(\.\.[/\\])+/, ""));

    fs.readFile(filePath, (error, content) => {
      if (error) {
        response.writeHead(404);
        response.end("No encontrado");
        return;
      }

      response.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "text/plain" });
      response.end(content);
    });
  })
  .listen(port, () => console.log(`Luma disponible en http://localhost:${port}`));
