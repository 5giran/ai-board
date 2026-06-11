import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { PostEntity } from '../posts/entities/post.entity';
import { CommentEntity } from './entities/comment.entity';

type CommentResponse = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    nickname: string;
  };
};

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async create(
    postId: string,
    dto: CreateCommentDto,
    authorId: string,
  ): Promise<CommentResponse> {
    // 댓글은 반드시 살아 있는 게시글에 달려야 한다.
    // PostEntity에는 DeleteDateColumn이 있으므로 findOne은 soft delete 된 게시글을 기본 제외한다.
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
      select: {
        id: true,
      },
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    const comment = this.commentRepository.create({
      content: dto.content,
      post: {
        id: postId,
      },
      author: {
        id: authorId,
      },
    });

    const savedComment = await this.commentRepository.save(comment);

    return this.findOneForResponse(savedComment.id);
  }

  async remove(
    postId: string,
    commentId: string,
    currentUserId: string,
  ): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: {
        id: commentId,
        post: {
          id: postId,
        },
      },
      relations: {
        author: true,
        post: true,
      },
      select: {
        id: true,
        author: {
          id: true,
        },
        post: {
          id: true,
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    // ownership check:
    // "댓글 작성자만 삭제 가능"은 HTTP 라우트 문제가 아니라 데이터 규칙이다.
    // 따라서 Controller가 아니라 Service에서 확인해야 어느 진입점에서 호출해도 같은 규칙이 지켜진다.
    if (comment.author.id !== currentUserId) {
      throw new ForbiddenException('댓글 작성자만 삭제할 수 있습니다.');
    }

    // soft delete:
    // 댓글 행을 완전히 지우지 않고 deleted_at을 채운다.
    // 이후 게시글 상세 조회의 댓글 목록에서는 TypeORM 기본 동작으로 제외된다.
    await this.commentRepository.softRemove(comment);
  }

  private async findOneForResponse(commentId: string): Promise<CommentResponse> {
    const comment = await this.commentRepository.findOne({
      where: {
        id: commentId,
      },
      relations: {
        author: true,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          id: true,
          nickname: true,
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: {
        id: comment.author.id,
        nickname: comment.author.nickname,
      },
    };
  }
}
