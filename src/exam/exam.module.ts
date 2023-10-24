import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamEntity } from './entities/exam.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExamEntity])],
  controllers: [ExamController],
  providers: [ExamService]
})
export class ExamModule {}
