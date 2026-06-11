import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  @MaxLength(120)
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  // tags가 undefined이면 "태그를 수정하지 않음"이다.
  // tags가 []이면 "태그를 모두 제거"한다.
  // optional 필드 하나에도 이렇게 의미 차이가 생길 수 있어 DTO 주석이 중요하다.
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
