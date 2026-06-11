import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

export type AuthenticatedUser = {
  id: string;
  email: string;
};

type JwtPayload = {
  sub: string;
  email: string;
};

// Guard는 Controller 메서드가 실행되기 "직전"에 HTTP 요청을 검사한다.
// 아직 토큰 검증 전에는 user가 없을 수 있으므로 optional(?)로 둔다.
export type RequestWithOptionalUser = {
  headers: {
    authorization?: string;
  };
  user?: AuthenticatedUser;
};

// @UseGuards(JwtAuthGuard)를 통과한 Controller에서는 user가 있다고 보고 사용한다.
// Controller에서 request.user.id를 안전하게 읽기 위한 학습용 타입이다.
export type AuthenticatedRequest = RequestWithOptionalUser & {
  user: AuthenticatedUser;
};

// CanActivate: 가드 전용 인터페이스, canActivate: 인터페이스 필수 메서드
// boolean(또는 Promise<boolean> 등)을 반환하는 인터페이스
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithOptionalUser>();

    // 클라이언트는 Authorization: Bearer <token> 형식으로 토큰을 보낸다.
    // split 결과의 첫 번째 값은 인증 방식(Bearer), 두 번째 값은 실제 JWT다.
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type?.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET ?? 'dev-secret',
      });

      // AuthService.login()에서 payload를 { sub: user.id, email: user.email }로 만들었다.
      // Controller/Service 쪽에서는 sub라는 JWT 용어보다 id가 읽기 좋기 때문에
      // 요청 객체에는 애플리케이션에서 쓰기 쉬운 { id, email } 형태로 바꿔 넣는다.
      request.user = {
        id: payload.sub,
        email: payload.email,
      };

      return true;
    } catch {
      // 토큰이 조작되거나 만료됐을 경우
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
