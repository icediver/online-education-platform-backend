import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ExamEntity } from './entities/exam.entity';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(ExamEntity)
    private readonly examRepository: Repository<ExamEntity>
  ) {}
  create(createExamDto: CreateExamDto) {
    const newExam = this.examRepository.create({
      semester: createExamDto.semester,
      year: createExamDto.year,
      subject: createExamDto.subject,
      date: createExamDto.date,
      description: createExamDto.description
    });
    return this.examRepository.save(newExam);
  }

  findAll() {
    return this.examRepository.find();
  }

  async findOne(id: number) {
    const exam = await this.examRepository.findOneById(id);
    if (!exam) throw new NotFoundException('Exam not found!');
    return exam;
  }

  async update(id: number, updateExamDto: UpdateExamDto) {
    const exam = await this.examRepository.findOneById(id);
    if (!exam) throw new NotFoundException('Exam not found!');

    return this.examRepository.save({ ...exam, ...updateExamDto });
  }

  remove(id: number) {
    return this.examRepository.delete({ id });
  }
}
