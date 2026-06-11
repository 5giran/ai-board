import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostEntity } from '../../posts/entities/post.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  content!: string;

  // ManyToOne(다대일 관계):
  // 댓글 여러 개가 게시글 하나에 속한다.
  // DB 관점에서는 comments 테이블에 post_id 외래 키(foreign key)가 생긴다.
  // 두 번째 인자인 post.comments는 PostEntity에서 이 댓글들을 역방향으로 읽기 위한 연결점이다.
  @ManyToOne(() => PostEntity, (post) => post.comments, { nullable: false })
  @JoinColumn({ name: 'post_id' })
  post!: PostEntity;

  // 댓글 여러 개는 같은 사용자 한 명에게 속할 수 있다.
  // JoinColumn은 실제 DB 컬럼 이름을 author_id로 고정한다.
  // UserEntity 전체를 응답으로 내보내면 passwordHash가 섞일 수 있으므로,
  // Service에서 author.id와 author.nickname만 골라 응답한다.
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'author_id' })
  author!: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // soft delete:
  // 댓글을 실제 DB 행에서 지우지 않고 deleted_at만 채운다.
  // TypeORM은 기본 find/findOne 조회에서 deleted_at이 있는 행을 자동으로 제외한다.
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date | null;
}
