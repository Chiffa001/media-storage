import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly dbService: DatabaseService) {}

  async getByEmail(email: string) {
    return this.dbService.user.findFirst({ where: { email } });
  }

  async getById(id: number) {
    return this.dbService.user.findFirst({ where: { id } });
  }

  async create(
    user: Pick<User, 'email' | 'passwordHash' | 'name' | 'surname'>,
  ) {
    return this.dbService.user.create({
      data: user,
    });
  }

  async clearRt(id: number) {
    await this.dbService.user.updateMany({
      where: {
        id,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });

    return true;
  }

  async updateRt(id: number, rt: string) {
    await this.dbService.user.update({
      where: {
        id,
      },
      data: {
        hashedRt: rt,
      },
    });
  }
}
