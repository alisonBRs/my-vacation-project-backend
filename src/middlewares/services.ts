import { PrismaClient } from "@prisma/client";
import { messageType } from "../interfaces/message-type";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
class UseService {
  public async createUser({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) {
    const alreadyExistEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (alreadyExistEmail) {
      throw new Error("Email already exists.");
    }

    const cryptoPassword = await bcrypt.hash(password, 10);

    return await prisma.user.create({
      data: {
        email,
        password: cryptoPassword,
        name,
      },
    });
  }

  public async login({ email, password }: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error("User not found.");
    }

    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
      throw new Error("User not found.");
    }

    const { password: _, ...userData } = user;

    const token = jwt.sign({ id: userData.id }, process.env.SECRET_KEY ?? "", {
      expiresIn: "1h",
    });

    return { ...userData, token };
  }

  public async getProfile({ userId }: { userId: string }) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { chats: true, message: true },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const { password, ...userData } = user;

    return userData;
  }

  public async createChat(userId: string) {
    const data = await prisma.chats.create({
      data: {
        openned: true,
        userId,
      },
      include: { message: true },
    });

    return data;
  }
  public async getAllChats(userId: string) {
    const result = await prisma.chats.findMany({
      include: { message: true },
      where: { userId },
    });

    return result;
  }

  public async addMessage(data: messageType) {
    const chat = await prisma.chats.findUnique({
      where: { id: data.chatId },
      include: {
        message: true,
      },
    });
    if (!chat) {
      throw new Error("chat not found");
    }

    await prisma.message.create({
      data,
    });

    global.io.emit("receiveMessage", data);

    return {
      ...chat,
    };
  }

  public async deleteChat(id: string) {
    const chat = await prisma.chats.findUnique({ where: { id } });
    if (!chat) {
      throw new Error("chat not found");
    }
    await prisma.chats.delete({ where: { id } });
    await prisma.message.deleteMany({
      where: {
        chatId: id,
      },
    });
  }

  public async updateChat(
    data: { name?: string; openned?: boolean },
    id: string
  ) {
    const updatedChat = await prisma.chats.update({ where: { id }, data });

    console.log(updatedChat);
  }
}

export const useService = new UseService();
