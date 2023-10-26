import express from "express";
import { Server } from "socket.io";
import http from "http";
import Routes from "./routes.js";
import { logger } from "./util.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: false,
  },
});

app.use(express.json());

io.on("connection", (socket) => logger.info("someone connected!" + socket.id));

const routes = new Routes(io);

app.options("/", routes.options);
app.post("/", (request, response) => routes.post(request, response));

app.get("/", (request, response) => routes.get(request, response));

const PORT = 3000;
server.listen(PORT, () => {
  const { address, port } = server.address();
  logger.info(`App running at http://localhost:${port}`);
});
