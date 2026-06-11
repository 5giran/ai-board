import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class FindPostsQueryDto {
  // Query parameter는 HTTP에서 문자열로 들어온다.
  // main.ts의 ValidationPipe({ transform: true })와 이 Transform이 함께 동작해서
  // ?page=2 같은 값을 number 2로 바꾼 뒤 IsInt/Min 검증을 수행한다.
  @Transform(({ value }) => (value === undefined ? 1 : Number(value)))
  @IsInt()
  @Min(1)
  page = 1;

  // offset pagination:
  // page와 limit으로 "앞에서 몇 개를 건너뛰고 몇 개를 가져올지" 계산한다.
  // limit에 상한을 두면 프론트 실수나 악의적 요청으로 너무 많은 행을 읽는 일을 줄일 수 있다.
  @Transform(({ value }) => (value === undefined ? 10 : Number(value)))
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 10;

  // search는 제목(title)과 본문(content)에 모두 적용한다.
  // 빈 문자열은 조건이 없는 것과 같게 처리하기 위해 undefined로 바꾼다.
  @Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  // tag는 slug 또는 name으로 필터링한다.
  // Service에서는 입력값을 slug 형태로도 바꿔 보고, 원래 name과도 비교한다.
  @Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  tag?: string;
}
