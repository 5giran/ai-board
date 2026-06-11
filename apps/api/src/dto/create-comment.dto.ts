import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  // DTO validation:
  // Controller에 들어온 request body가 이 조건을 만족하는지 ValidationPipe가 먼저 검사한다.
  // 비어 있는 댓글은 저장 의미가 없으므로 IsNotEmpty로 막고,
  // 지나치게 긴 입력은 DB/API 사용성을 위해 MaxLength로 제한한다.
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content!: string;
}
