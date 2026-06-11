import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  // DTO validation:
  // tags는 게시글 본문과 함께 들어오는 부가 입력이다.
  // 예: { "title": "...", "content": "...", "tags": ["nestjs", "typeorm"] }
  // Transform은 문자열 앞뒤 공백을 정리하고 빈 문자열 태그를 제거한다.
  // 이후 class-validator가 배열인지, 너무 많지 않은지, 각 값이 문자열인지 검사한다.
  @Transform(({ value }) => {
    if (!Array.isArray(value)) {
      return value;
    }

    return value
      .filter((tag): tag is string => typeof tag === 'string')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ArrayUnique()
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  tags?: string[];
}
