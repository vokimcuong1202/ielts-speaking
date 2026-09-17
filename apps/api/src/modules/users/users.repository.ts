import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateUserDto & { passwordHash: string }) {
    return this.prisma.user.create({ data: dto });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        targetBand: true,
        examDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
