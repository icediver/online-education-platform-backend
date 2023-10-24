import { Base } from 'src/utils/base';
import { Column, Entity } from 'typeorm';

@Entity('Exam')
export class ExamEntity extends Base {
  @Column()
  semester: number;
  @Column()
  year: number;
  @Column()
  subject: string;
  @Column()
  date: string;
  @Column()
  description: string;
}
