import { ConflictException, Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdateGoalDto } from "./dto/update-goal.dto";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  create(dto: CreateUserDto & { passwordHash: string }) {
    return this.usersRepository.create(dto);
  }

  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  findById(id: string) {
    return this.usersRepository.findById(id);
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    try {
      return await this.usersRepository.updateProfile(id, dto);
    } catch (error) {
      // P2002 = unique constraint (handle is citext UNIQUE)
      if ((error as { code?: string }).code === "P2002") throw new ConflictException("Handle already taken");
      throw error;
    }
  }

  updateGoal(userId: string, dto: UpdateGoalDto) {
    return this.usersRepository.upsertGoal(userId, dto);
  }
}
