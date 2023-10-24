import { Column, Entity } from 'typeorm';
import { Base } from '../utils/base';

@Entity('User')
export class UserEntity extends Base {
  @Column({ unique: true })
  email: string;
  @Column({ select: false })
  password: string;
  @Column({ default: '' })
  name: string;
  @Column({ default: false, name: 'is_admin' })
  isAdmin?: boolean;
  @Column({ default: '', name: 'avatar_path' })
  avatarPath: string;
  @Column({ default: 'student' })
  position: string;
  @Column({ default: 1 })
  year?: number;
  @Column({ default: 1 })
  semester?: number;
  @Column({ default: '' })
  department?: string;
}
