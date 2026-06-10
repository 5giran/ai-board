import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// TypeORM (@)데코레이터: 이 클래스와 속성을 DB 테이블/컬럼으로 매핑한다.

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  nickname!: string;

  @Column()
  passwordHash!: string;

  @CreateDateColumn()
  createAt!: Date;
}
