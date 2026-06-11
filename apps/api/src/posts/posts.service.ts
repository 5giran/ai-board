import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';
import { FindPostsQueryDto } from '../dto/find-posts-query.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { TagsService } from '../tags/tags.service';
import { PostEntity } from './entities/post.entity';

type AuthorResponse = {
  id: string;
  nickname: string;
};

type TagResponse = {
  id: string;
  name: string;
  slug: string;
};

type CommentResponse = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: AuthorResponse;
};

type PostListItemResponse = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: AuthorResponse;
  tags: TagResponse[];
};

type PostDetailResponse = PostListItemResponse & {
  comments: CommentResponse[];
};

type PaginatedPostsResponse = {
  items: PostListItemResponse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

@Injectable()
export class PostsService {
  constructor(
    // Repository는 특정 Entity 테이블에 접근하는 TypeORM 객체다.
    // UsersService가 Repository<UserEntity>로 users 테이블을 다뤘듯이,
    // PostsService는 Repository<PostEntity>로 posts 테이블을 다룬다.
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    private readonly tagsService: TagsService,
  ) {}

  async create(
    dto: CreatePostDto,
    authorId: string,
  ): Promise<PostDetailResponse> {
    // 게시글 작성 시 tags 배열이 함께 들어올 수 있다.
    // TagsService는 "이미 있는 태그면 재사용, 없으면 생성"을 담당한다.
    // PostsService는 그 결과 TagEntity 배열을 게시글에 연결만 한다.
    const tags = await this.tagsService.findOrCreateMany(dto.tags);

    // Controller는 "누가 요청했는지"를 Guard를 통해 알아내고,
    // Service는 그 id를 이용해 실제 게시글 데이터를 만든다.
    // author 전체 UserEntity를 새로 조회하지 않고 id만 연결해도,
    // TypeORM은 author_id 외래 키에 authorId를 저장할 수 있다.
    const post = this.postRepository.create({
      title: dto.title,
      content: dto.content,
      author: {
        id: authorId,
      },
      tags,
    });

    const savedPost = await this.postRepository.save(post);

    // save 직후의 savedPost에는 author.nickname, tags, comments가 모두 채워져 있지 않을 수 있다.
    // 그래서 응답 직전에 findOne을 다시 사용해 프론트가 기대하는 일관된 응답 모양으로 바꾼다.
    return this.findOne(savedPost.id);
  }

  async findAll(query: FindPostsQueryDto): Promise<PaginatedPostsResponse> {
    const page = query.page;
    const limit = query.limit;
    const offset = (page - 1) * limit;

    // QueryBuilder:
    // Repository.find()는 단순 조건에는 편하지만,
    // search(제목 OR 본문), tag 필터, pagination, total count를 함께 조합하면 복잡해진다.
    // QueryBuilder는 SQL의 WHERE/JOIN/ORDER/LIMIT/OFFSET을 코드로 단계별 조립할 수 있게 해준다.
    const idsQuery = this.postRepository
      .createQueryBuilder('post')
      .select('post.id', 'id')
      .addSelect('post.createdAt', 'createdAt')
      .leftJoin('post.tags', 'filterTag')
      .where('post.deleted_at IS NULL');

    if (query.search !== undefined) {
      const search = `%${query.search}%`;

      // search 조건:
      // 제목(title)이나 본문(content) 중 하나라도 검색어를 포함하면 목록에 포함한다.
      // Brackets는 SQL의 괄호 역할을 해서
      // (post.title ILIKE ... OR post.content ILIKE ...) 조건을 안전하게 묶어준다.
      idsQuery.andWhere(
        new Brackets((where) => {
          where
            .where('post.title ILIKE :search', { search })
            .orWhere('post.content ILIKE :search', { search });
        }),
      );
    }

    if (query.tag !== undefined) {
      const tagSlug = this.tagsService.toSlug(query.tag);

      // tag 필터:
      // 프론트에서는 slug 사용을 권장한다. 예: ?tag=nestjs
      // 학습/수동 테스트 편의를 위해 원래 name도 함께 허용한다. 예: ?tag=NestJS
      idsQuery.andWhere(
        new Brackets((where) => {
          where
            .where('filterTag.slug = :tagSlug', { tagSlug })
            .orWhere('filterTag.name = :tagName', { tagName: query.tag });
        }),
      );
    }

    const totalResult = await idsQuery
      .clone()
      .select('COUNT(DISTINCT post.id)', 'total')
      .getRawOne<{ total: string }>();

    const total = Number(totalResult?.total ?? 0);

    // offset/limit pagination:
    // page=1, limit=10이면 offset=0이라 처음 10개를 가져온다.
    // page=2, limit=10이면 offset=10이라 앞의 10개를 건너뛰고 다음 10개를 가져온다.
    const idRows = await idsQuery
      .distinct(true)
      .orderBy('post.createdAt', 'DESC')
      .addOrderBy('post.id', 'DESC')
      .offset(offset)
      .limit(limit)
      .getRawMany<{ id: string }>();

    const ids = idRows.map((row) => row.id);

    if (ids.length === 0) {
      return {
        items: [],
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      };
    }

    // 첫 QueryBuilder는 "조건에 맞는 post id"만 구한다.
    // 두 번째 조회는 그 id들로 실제 응답에 필요한 author/tags 관계를 읽는다.
    // 이렇게 나누면 many-to-many join으로 생기는 중복 행이 pagination을 흔드는 일을 줄일 수 있다.
    const posts = await this.postRepository.find({
      where: {
        id: In(ids),
      },
      relations: {
        author: true,
        tags: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          id: true,
          nickname: true,
        },
        tags: {
          id: true,
          name: true,
          slug: true,
        },
      },
    });

    const postsById = new Map(posts.map((post) => [post.id, post]));

    return {
      items: ids
        .map((id) => postsById.get(id))
        .filter((post): post is PostEntity => post !== undefined)
        .map((post) => this.toListItemResponse(post)),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<PostDetailResponse> {
    const post = await this.findActivePostOrThrow(id);

    return this.toDetailResponse(post);
  }

  async update(
    id: string,
    dto: UpdatePostDto,
    currentUserId: string,
  ): Promise<PostDetailResponse> {
    const post = await this.findPostForWriteOrThrow(id);

    // ownership check:
    // "작성자만 수정 가능"은 데이터 규칙이다.
    // 어떤 Controller에서 호출하든 항상 지켜져야 하므로 Service에서 검사한다.
    this.assertOwner(post, currentUserId);

    // UpdatePostDto의 필드는 optional이다.
    // undefined인 필드는 클라이언트가 수정 의사를 보내지 않은 것이므로 기존 값을 유지한다.
    if (dto.title !== undefined) {
      post.title = dto.title;
    }

    if (dto.content !== undefined) {
      post.content = dto.content;
    }

    if (dto.tags !== undefined) {
      // tags가 undefined이면 기존 태그 유지, []이면 모든 태그 제거다.
      // 이 차이는 프론트엔드 수정 폼에서 중요하다.
      post.tags = await this.tagsService.findOrCreateMany(dto.tags);
    }

    const savedPost = await this.postRepository.save(post);

    return this.findOne(savedPost.id);
  }

  async remove(id: string, currentUserId: string): Promise<void> {
    const post = await this.findPostForWriteOrThrow(id);

    // 삭제도 수정과 마찬가지로 게시글 소유자만 할 수 있다.
    // Controller가 아니라 Service에서 확인하면, 나중에 관리자용 Controller나
    // 배치 작업이 생겨도 이 기본 규칙을 한 곳에서 관리할 수 있다.
    this.assertOwner(post, currentUserId);

    // soft delete:
    // remove/delete는 DB 행을 실제로 지우는 hard delete가 될 수 있다.
    // 여기서는 DeleteDateColumn(deleted_at)을 사용하는 soft delete를 선택했기 때문에
    // 행은 남겨 두고 deleted_at만 채워서 "삭제된 상태"로 만든다.
    await this.postRepository.softRemove(post);
  }

  private async findActivePostOrThrow(id: string): Promise<PostEntity> {
    // 게시글 상세 조회는 author, tags, comments.author가 모두 필요하다.
    // select에서 author.passwordHash를 고르지 않기 때문에 민감 정보가 응답 객체에 들어오지 않는다.
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
      relations: {
        author: true,
        tags: true,
        comments: {
          author: true,
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          id: true,
          nickname: true,
        },
        tags: {
          id: true,
          name: true,
          slug: true,
        },
        comments: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          author: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    return post;
  }

  private async findPostForWriteOrThrow(id: string): Promise<PostEntity> {
    // 수정/삭제에는 상세 댓글까지 필요 없고 작성자 id만 있으면 된다.
    // 필요한 관계만 읽으면 불필요한 DB 데이터를 줄일 수 있다.
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
      relations: {
        author: true,
        tags: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          id: true,
        },
        tags: {
          id: true,
          name: true,
          slug: true,
        },
      },
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    return post;
  }

  private assertOwner(post: PostEntity, currentUserId: string): void {
    if (post.author.id !== currentUserId) {
      throw new ForbiddenException('게시글 작성자만 변경할 수 있습니다.');
    }
  }

  private toListItemResponse(post: PostEntity): PostListItemResponse {
    // Entity -> 응답 객체 변환을 명시적으로 수행한다.
    // 이 필드 목록이 API 밖으로 내보낼 데이터의 allowlist 역할을 하므로,
    // UserEntity.passwordHash가 author에 섞여 들어올 여지를 차단한다.
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: {
        id: post.author.id,
        nickname: post.author.nickname,
      },
      tags: this.toTagResponses(post),
    };
  }

  private toDetailResponse(post: PostEntity): PostDetailResponse {
    return {
      ...this.toListItemResponse(post),
      comments: [...(post.comments ?? [])]
        .sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime())
        .map((comment) => ({
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          author: {
            id: comment.author.id,
            nickname: comment.author.nickname,
          },
        })),
    };
  }

  private toTagResponses(post: PostEntity): TagResponse[] {
    return [...(post.tags ?? [])]
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((tag) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      }));
  }
}
