import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;

    const token =
      typeof authorization === "string" ? authorization.split(" ")[1] : "";

    const validToken = jwt.verify(token, process.env.SECRET_KEY ?? "") as any;

    req.body.userId = validToken.id;
    next();
  } catch (e) {
    console.log(e);
    res.status(401).send({
      error: true,
      message: e.toString(),
      customMessage: "Usuário não autorizado!",
    });
  }
};
