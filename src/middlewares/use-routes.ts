import { Request, Response } from "express";
import { useService } from "./services";
import bcrypt from "bcrypt";

export class useRoutes {
  public async createUser(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      const cryptoPassword = await bcrypt.hash(password, 10);

      await useService.createUser({ email, password: cryptoPassword, name });

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

  public async getAllChats(req: Request, res: Response) {
    try {
      const result = await useService.getAllChats();
      res.send(result);
    } catch (error) {
      console.log(error);
    }
  }

  public async createMessage(req: Request, res: Response) {
    try {
      const result = await useService.createChat();
      res.send({ result });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  public async addMessage(req: Request, res: Response) {
    try {
      const { message, chatId } = req.body;
      const result = await useService.addMessage({ message, chatId });
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
