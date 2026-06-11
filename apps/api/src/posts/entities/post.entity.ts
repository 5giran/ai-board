import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommentEntity } from '../../comments/entities/comment.entity';
import { TagEntity } from '../../tags/entities/tag.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 120 })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'author_id' })
  author!: UserEntity;

  // OneToMany(일대다 관계):
  // 게시글 하나에는 댓글 여러 개가 달릴 수 있다.
  // 실제 외래 키는 CommentEntity의 post_id 컬럼에 있고,
  // 이 필드는 "게시글에서 댓글 목록을 읽기 위한 역방향 관계"다.
  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments!: CommentEntity[];

  // ManyToMany(다대다 관계):
  // 게시글 하나는 여러 태그를 가질 수 있고, 태그 하나도 여러 게시글에 붙을 수 있다.
  // JoinTable은 다대다 관계에서 실제 연결 테이블을 만드는 위치를 뜻한다.
  // 양쪽 Entity 중 한 곳에만 둬야 하므로, 게시글 작성/수정의 주체인 PostEntity에 둔다.
  @ManyToMany(() => TagEntity, (tag) => tag.posts)
  @JoinTable({
    name: 'post_tags',
    joinColumn: {
      name: 'post_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags!: TagEntity[];

  // DB에 맞춰서 날짜 칼럼 snake_case로 변경
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  // 삭제되기 전에는 값이 없음 - 이거 반영해야 함
  deletedAt!: Date | null;
}
