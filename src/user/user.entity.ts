import { Column, Entity } from 'typeorm';
import { Base } from '../utils/base';

@Entity('User')
export class UserEntity extends Base {
	@Column({ unique: true })
	email: string;
	@Column()
	password: string;
	@Column({ default: '' })
	name: string;
	@Column({ default: false, name: 'is_admin' })
	isAdmin?: boolean;
	@Column({ default: '', name: 'avatar_path' })
	avatarPath: string;
}
