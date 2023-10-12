import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash } from 'bcryptjs';
import { ILike, Like, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async byId(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id
      }
    });

    if (!user) throw new NotFoundException('User not found!');

    return user;
  }

  async updateProfile(id: number, dto: UpdateUserDto) {
    const user = await this.byId(id);

    const isSameUser = await this.userRepository.findOneBy({
      email: dto.email
    });
    if (isSameUser && id !== isSameUser.id)
      throw new NotFoundException('Email busy!');
    if (dto.password) {
      const salt = await genSalt(10);
      user.password = await hash(dto.password, salt);
    }
    user.email = dto.email;
    if (dto.isAdmin || dto.isAdmin === false) user.isAdmin = dto.isAdmin;
    if (dto.name) user.name = dto.name;
    if (dto.avatarPath) user.avatarPath = dto.avatarPath;

    await this.userRepository.save(user);

    return user;
  }

  async getCount() {
    return this.userRepository.count();
  }

  async getAll(searchTerm?: string) {
    let options = {};

    if (searchTerm)
      options = {
        email: new RegExp(searchTerm, 'i')
      };
    const users = await this.userRepository.find({
      where: { email: ILike(`%${searchTerm}%`) },
      order: {
        name: 'DESC'
      },
      select: {
        id: true,
        createdAt: true,
        email: true,
        name: true,
        isAdmin: true,
        avatarPath: true
      }
    });
    return users;
  }

  async delete(id: number) {
    return this.userRepository.delete({ id });
  }
}
