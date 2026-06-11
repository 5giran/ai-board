import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { TagEntity } from './entities/tag.entity';

type NormalizedTagInput = {
  name: string;
  slug: string;
};

@Injectable()
export class TagsService {
  constructor(
    // Repository<TagEntity>는 tags 테이블을 다루는 TypeORM 객체다.
    // PostsService가 태그 저장 규칙을 직접 알기보다,
    // TagsService가 "태그를 찾거나 만든다"는 책임을 가져가도록 분리했다.
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async findOrCreateMany(names: string[] = []): Promise<TagEntity[]> {
    const normalizedTags = this.normalizeMany(names);

    if (normalizedTags.length === 0) {
      return [];
    }

    const slugs = normalizedTags.map((tag) => tag.slug);

    const existingTags = await this.tagRepository.find({
      where: {
        slug: In(slugs),
      },
    });

    const existingSlugSet = new Set(existingTags.map((tag) => tag.slug));
    const missingTags = normalizedTags
      .filter((tag) => !existingSlugSet.has(tag.slug))
      .map((tag) => this.tagRepository.create(tag));

    const createdTags =
      missingTags.length > 0 ? await this.tagRepository.save(missingTags) : [];

    const tagsBySlug = new Map<string, TagEntity>();

    for (const tag of [...existingTags, ...createdTags]) {
      tagsBySlug.set(tag.slug, tag);
    }

    // 입력 순서를 유지해서 응답 tags 순서가 사용자가 보낸 순서와 최대한 비슷하게 보이게 한다.
    return normalizedTags
      .map((tag) => tagsBySlug.get(tag.slug))
      .filter((tag): tag is TagEntity => tag !== undefined);
  }

  toSlug(name: string): string {
    const normalizedName = this.normalizeName(name);

    // slug:
    // 사람이 입력한 태그 이름을 URL/query parameter에서 비교하기 쉬운 형태로 바꾼 값이다.
    // 영어는 소문자로, 공백/특수문자는 '-'로 바꾼다.
    // 한글 태그도 학습 프로젝트에서 자연스럽게 쓸 수 있도록 한글 문자는 남겨둔다.
    return (
      normalizedName
        .normalize('NFKC')
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]+/g, '-')
        .replace(/^-+|-+$/g, '') || normalizedName.toLowerCase()
    );
  }

  private normalizeMany(names: string[]): NormalizedTagInput[] {
    const tagsBySlug = new Map<string, NormalizedTagInput>();

    for (const rawName of names) {
      if (typeof rawName !== 'string') {
        continue;
      }

      const name = this.normalizeName(rawName);

      if (name.length === 0) {
        continue;
      }

      const slug = this.toSlug(name);

      if (!tagsBySlug.has(slug)) {
        tagsBySlug.set(slug, {
          name,
          slug,
        });
      }
    }

    return [...tagsBySlug.values()];
  }

  private normalizeName(name: string): string {
    return name.trim().replace(/\s+/g, ' ');
  }
}
