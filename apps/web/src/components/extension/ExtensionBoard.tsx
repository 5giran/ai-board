import { ExtensionListItem } from "@/components/extension/ExtensionListItem";
import type { ExtensionSummary } from "@/mocks/extensions";

type ExtensionBoardProps = {
  extensions: ExtensionSummary[];
};

export function ExtensionBoard({ extensions }: ExtensionBoardProps) {
  return (
    <section className="board" aria-label="게시판 검색 결과">
      <div className="board-head">
        <span>익스텐션 / 태그</span>
        <span>플랫폼</span>
        <span>작성자</span>
        <span>평점</span>
        <span>댓글</span>
        <span style={{ textAlign: "right" }}>등록일</span>
      </div>
      {extensions.map((extension) => (
        <ExtensionListItem extension={extension} key={extension.id} />
      ))}
    </section>
  );
}
