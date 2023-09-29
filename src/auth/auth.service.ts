import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, genSalt, hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService
  ) {}

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const tokens = await this.issueTokenPair(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens
    };
  }

  async getNewTokens({ refreshToken }: RefreshTokenDto) {
    if (!refreshToken) throw new UnauthorizedException('Please sign in!');

    const result = await this.jwtService.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('Invalid token or expired!');
    const user = await this.userRepository.findOne({
      where: { id: result.id }
    });
    const tokens = await this.issueTokenPair(user.id);
    return {
      user: this.returnUserFields(user),
      ...tokens
    };
  }

  async register(dto: AuthDto) {
    const oldUser = await this.userRepository.findOne({
      where: { email: dto.email }
    });

    if (oldUser)
      throw new BadRequestException(
        'User with this email is already in the system'
      );
    const salt = await genSalt(10);
    const newUser = await this.userRepository.create({
      email: dto.email,
      password: await hash(dto.password, salt),
      name: dto.email,
      avatarPath: '/uploads/avatars/batman.jpg'
    });

    const user = await this.userRepository.save(newUser);
    const tokens = await this.issueTokenPair(newUser.id);

    return {
      user: this.returnUserFields(user),
      ...tokens
    };
  }

  async validateUser(dto: AuthDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email
      },
      select: ['id', 'email', 'password', 'avatarPath', 'name']
    });

    if (!user) throw new NotFoundException('User not found!');
    const isValidPassword = await compare(dto.password, user.password);

    if (!isValidPassword) throw new UnauthorizedException('Invalid passport!');

    return user;
  }

  async issueTokenPair(userId: number) {
    const data = { id: userId };
    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '15d'
    });
    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '1d'
    });

    return { refreshToken, accessToken };
  }

  returnUserFields(user: UserEntity) {
    return {
      id: user.id,
      email: user.email,
      avatarPath: user.avatarPath,
      name: user.name,
      isAdmin: user.isAdmin
    };
  }
}
