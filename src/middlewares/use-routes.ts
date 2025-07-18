import { Request, Response } from "express";
import { useService } from "./services";
import bcrypt from "bcrypt";

export class useRoutes {
  public async createUser(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      await useService.createUser({ email, password, name });

      res.send({ message: "Usuário criado com sucesso!", error: false });
    } catch (e) {
      console.log(e);
      res.status(502).send({
        customMessage: "Erro ao criar usuário",
        message: e.toString(),
        error: true,
      });
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await useService.login({ email, password });
      res.send(user);
    } catch (e) {
      console.log(e);
      res.status(401).send({
        error: true,
        message: e.toString(),
        customMessage: "Usuário não encontrado.",
      });
    }
  }

  public async getProfile(req: Request, res: Response) {
    try {
      const { userId } = req.body;

      const user = await useService.getProfile({ userId });

      res.send(user);
    } catch (e) {
      console.log(e);
      res.status(401).send({
        error: true,
        message: e.toString(),
        customMessage: "Usuário não autorizado.",
        unauthorized: true,
      });
    }
  }

  public async getAllChats(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      const result = await useService.getAllChats(userId);
      res.send(result);
    } catch (error) {
      console.log(error);
    }
  }

  public async createChat(req: Request, res: Response) {
    try {
      const { userId, email } = req.body;

      const result = await useService.createChat(userId, email);
      res.send({ result });
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: error.message });
    }
  }

  public async addMessage(req: Request, res: Response) {
    try {
      const { message, chatId, userId } = req.body;
      const result = await useService.addMessage({
        message,
        chatId,
        userId,
        createdAt: new Date(),
      });
      res.send({ result });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  public async deleteChat(req: Request, res: Response) {
    try {
      const id = req.params.chatId;
      await useService.deleteChat(id);
      res.send();
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  public async updateChat(req: Request, res: Response) {
    try {
      const { name, openned } = req.body;
      const id = req.params.chatId;
      const data = {
        ...(name ? { name } : {}),
        ...(openned ? { openned } : {}),
      };

      await useService.updateChat(data, id);

      res.send();
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
