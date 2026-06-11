import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostEntity } from '../../posts/entities/post.entity';

@Entity('tags')
export class TagEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // name은 사람이 화면에서 보는 원래 태그 이름이다.
  // unique를 걸어 같은 이름의 태그가 중복으로 만들어지는 실수를 막는다.
  @Column({ length: 40, unique: true })
  name!: string;

  // slug는 URL/query parameter에서 쓰기 쉬운 검색용 이름이다.
  // 예: "Nest JS" -> "nest-js"
  // 목록 필터의 tag query는 slug를 우선 기준으로 쓰고, name도 함께 허용한다.
  @Column({ length: 80, unique: true })
  slug!: string;

  // ManyToMany(다대다 관계):
  // 게시글 하나는 태그 여러 개를 가질 수 있고,
  // 태그 하나도 게시글 여러 개에 붙을 수 있다.
  // 실제 DB에는 posts와 tags 사이를 연결하는 join table이 필요하다.
  // JoinTable은 PostEntity 쪽에만 둔다. 반대쪽(TagEntity)은 역방향 연결만 선언한다.
  @ManyToMany(() => PostEntity, (post) => post.tags)
  posts!: PostEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
