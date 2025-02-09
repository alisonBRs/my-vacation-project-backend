import express from "express";
import cors from "cors";
import { corsOptions } from "./corsConfig";
import { routeType } from "./interfaces/route-type";
import http from "http";
import { Server } from "socket.io";

interface listennerType {
  port: number;
  message: string;
}
export class App {
  public app: express.Application = express();
  public server = http.createServer(this.app);
  public io = new Server(this.server, {
    cors: {
      origin: "https://example.com",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });
  constructor({ path, route }: routeType) {
    this.middlewares();
    this.route({ path, route });
  }
  private route({ path, route }: routeType) {
    this.app.use(path, route);
    console.log(`App ${path} initialized!`);
  }

  private middlewares() {
    this.app.use(express.json());
    this.app.use(cors(corsOptions));

    this.io.on("connection", (socket) => {
      console.log("Usuário conectado", socket.id);

      socket.on("sendMessage", (message) => {
        console.log("Mensagem recebida:", message);

        this.io.emit("receiveMessage", message);
      });

      socket.on("disconnect", () => {
        console.log("Usuário desconectado", socket.id);
      });
    });
  }
  public listenner({ port, message }: listennerType) {
    this.app.listen(port, () => console.log(message));
    this.server.listen(3030, () => {
      console.log(`Servidor rodando na porta ${3030}`);
    });
  }
}
