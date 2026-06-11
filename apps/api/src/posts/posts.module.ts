import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { TagsModule } from '../tags/tags.module';
import { PostEntity } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [
    // Repository<PostEntity>를 PostsService에 주입하려면 현재 모듈에
    // TypeOrmModule.forFeature([PostEntity])가 등록되어 있어야 한다.
    // UsersModule이 UserEntity 저장소를 등록했던 방식과 같은 패턴이다.
    TypeOrmModule.forFeature([PostEntity]),

    // PostsController의 POST/PATCH/DELETE는 JwtAuthGuard를 사용한다.
    // JwtAuthGuard는 AuthModule에서 provider/export로 공개되어 있으므로,
    // PostsModule이 AuthModule을 import해야 Guard 의존성을 찾을 수 있다.
    AuthModule,

    // 게시글 작성/수정 때 태그 이름 배열을 받아
    // 기존 태그 재사용 또는 신규 태그 생성을 처리하기 위해 TagsService를 사용한다.
    TagsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
