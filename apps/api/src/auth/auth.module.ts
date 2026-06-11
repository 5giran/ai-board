import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-secret',
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  providers: [AuthService, JwtAuthGuard],
  controllers: [AuthController],
  // 다른 모듈의 Controller에서 @UseGuards(JwtAuthGuard)를 사용할 때,
  // Guard 자체뿐 아니라 Guard가 의존하는 JwtService도 함께 접근 가능해야 한다.
  // JwtService는 JwtModule이 제공하므로 AuthModule 밖으로 JwtModule도 export한다.
  exports: [JwtAuthGuard, JwtModule],
})
export class AuthModule {}
