import http from "http";
import httpProxy from "http-proxy";

const TARGET = "http://localhost:19000";
const PORT   = 5000;

const proxy = httpProxy.createProxyServer({
  target: TARGET,
  ws: true,
  changeOrigin: true,
});

proxy.on("error", (err, _req, res) => {
  if (res && !res.headersSent) {
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.end("Metro not ready yet — retrying…");
  }
});

const server = http.createServer((req, res) => {
  proxy.web(req, res);
});

server.on("upgrade", (req, socket, head) => {
  proxy.ws(req, socket, head);
});

server.listen(PORT, () => {
  console.log(`[web-proxy] PayVora Mobile Web → ${TARGET} on :${PORT}`);
});
