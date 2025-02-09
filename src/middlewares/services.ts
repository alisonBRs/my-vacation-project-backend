import { PrismaClient } from "@prisma/client";
import { messageType } from "../interfaces/message-type";
const prisma = new PrismaClient();
class UseService {
  public async createChat() {
    return await prisma.chats.create({
      data: {
        openned: false,
      },
    });
  }
  public async getAllChats() {
    const result = await prisma.chats.findMany({
      include: { message: true },
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

  public async updateAllChats({
    chatsIds,
    data,
  }: {
    chatsIds: string[];
    data: { name?: string; openned?: boolean };
  }) {
    await prisma.chats.updateMany({ where: { id: { in: chatsIds } }, data });
  }
}

export const useService = new UseService();
