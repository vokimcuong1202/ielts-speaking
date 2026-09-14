import { Injectable } from "@nestjs/common";
import { ExercisesRepository } from "./exercises.repository";
import { CreateExerciseDto } from "./dto/create-exercise.dto";

@Injectable()
export class ExercisesService {
  constructor(private readonly exercisesRepository: ExercisesRepository) {}

  findAll() {
    return this.exercisesRepository.findAll();
  }

  findById(id: string) {
    return this.exercisesRepository.findById(id);
  }

  create(dto: CreateExerciseDto) {
    return this.exercisesRepository.create(dto);
  }
}
