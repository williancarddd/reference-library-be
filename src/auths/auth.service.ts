import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/users/users.service';
import { LoginDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      delete user.password;
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async signIn(data: LoginDto): Promise<{ access_token: string }> {
    const user = await this.userService.findByEmail(data.email);
    
    if (!user) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    const isMatch = await bcrypt.compare(data.password, user?.password);

    if (!isMatch) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    const payload = { id: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(userDto: any) {
    const hashedPassword = await bcrypt.hash(
      userDto.password,
      bcrypt.genSaltSync(),
    );
    const user = await this.userService.createUser({
      ...userDto,
      password: hashedPassword,
    });
    return user;
  }
}
