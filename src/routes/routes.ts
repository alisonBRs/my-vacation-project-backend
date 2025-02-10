import { Request, Response, Router } from "express";
import { routeType } from "../interfaces/route-type";
import { useRoutes } from "../middlewares/use-routes";

const useRoute = new useRoutes();
export class Route implements routeType {
  path = "/";
  route = Router();

  constructor() {
    this.route.get("/", useRoute.getAllChats);
    this.route.post("/criaChat", useRoute.createMessage);
    this.route.delete("/deleteChat/:chatId", useRoute.deleteChat);
    this.route.post("/addMensagem", useRoute.addMessage);
    this.route.put("/atualizaChat/:chatId", useRoute.updateChat);
  }
}
