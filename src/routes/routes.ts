import { Request, Response, Router } from "express";
import { routeType } from "../interfaces/route-type";
import { useRoutes } from "../middlewares/use-routes";
import { auth } from "../middlewares/auth";

const useRoute = new useRoutes();
export class Route implements routeType {
  path = "/";
  route = Router();

  constructor() {
    this.route.get("/", auth, useRoute.getAllChats);
    this.route.get("/getProfile", auth, useRoute.getProfile);
    this.route.post("/createUser", useRoute.createUser);
    this.route.post("/login", useRoute.login);
    this.route.post("/criaChat", auth, useRoute.createChat);
    this.route.delete("/deleteChat/:chatId", useRoute.deleteChat);
    this.route.post("/addMensagem", auth, useRoute.addMessage);
    this.route.put("/atualizaChat/:chatId", useRoute.updateChat);
  }
}
