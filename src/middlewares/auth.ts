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
  } catch (err) {
    console.log(err);
    res.status(401).send({
      error: true,
      message: err?.message,
      jwtExpired: !!err?.message?.includes("jwt expired"),
      unauthorized: !!err?.message?.includes("jwt must be provided"),
      customMessage: "Usuário não autorizado!",
    });
  }
};
