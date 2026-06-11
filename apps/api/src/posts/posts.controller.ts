import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/jwt-auth.guard';
import { CreatePostDto } from '../dto/create-post.dto';
import { FindPostsQueryDto } from '../dto/find-posts-query.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // Controller의 핵심 역할은 HTTP 요청/응답의 입구를 담당하는 것이다.
  // - 어떤 URL을 받을지 정한다. 여기서는 POST /api/posts
  // - Body, Param, Request 같은 HTTP 데이터를 꺼낸다.
  // - 인증 Guard처럼 HTTP 계층에 가까운 장치를 붙인다.
  // 실제 DB 저장 규칙은 아래에서 PostsService.create()로 넘긴다.
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreatePostDto, @Req() request: AuthenticatedRequest) {
    // JwtAuthGuard가 성공하면 request.user = { id, email }을 넣어둔다.
    // 게시글 작성에는 email보다 "작성자 id"가 필요하므로 id만 Service에 전달한다.
    return this.postsService.create(dto, request.user.id);
  }

  // GET 목록/상세는 일단 공개 API다.
  // 그래서 @UseGuards(JwtAuthGuard)를 붙이지 않는다.
  // 로그인하지 않은 사용자도 게시글 목록을 볼 수 있게 하는 선택이다.
  @Get()
  findAll(@Query() query: FindPostsQueryDto) {
    // Query parameter는 URL의 ?page=1&limit=10&search=... 같은 값이다.
    // Controller는 query DTO로 값을 받고, 실제 검색/필터/페이징 조합은 Service에 맡긴다.
    return this.postsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    // id는 DB에서 uuid 타입이므로 Controller 입구에서 ParseUUIDPipe로 검증한다.
    // 잘못된 id 문자열은 Service/DB까지 내려가기 전에 400 Bad Request로 막힌다.
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePostDto,
    @Req() request: AuthenticatedRequest,
  ) {
    // Controller는 현재 로그인한 사용자 id를 꺼내 전달만 한다.
    // "이 사용자가 작성자인가?"라는 비즈니스 규칙은 Service에서 확인한다.
    return this.postsService.update(id, dto, request.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    // DELETE 성공 시 본문이 필요 없으므로 204 No Content를 사용한다.
    // 실제 삭제 방식(soft delete)은 HTTP가 아니라 데이터 처리 규칙이므로 Service가 맡는다.
    return this.postsService.remove(id, request.user.id);
  }
}
