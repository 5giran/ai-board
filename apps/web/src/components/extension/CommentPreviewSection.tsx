import { authorInitials, formatDate } from "@/lib/extension-format";
import type { MockComment } from "@/mocks/extensions";

type CommentPreviewSectionProps = {
  comments: MockComment[];
  commentCount: number;
};

export function CommentPreviewSection({
  comments,
  commentCount,
}: CommentPreviewSectionProps) {
  return (
    <div className="d-sec">
      <h2>
        댓글{" "}
        <span
          style={{
            color: "hsl(var(--muted-foreground))",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {commentCount}
        </span>
      </h2>
      <div className="comment-box">
        <label className="sr-only" htmlFor="comment-preview-input">
          댓글 입력
        </label>
        <textarea
          className="input"
          id="comment-preview-input"
          rows={2}
          placeholder="댓글을 입력하세요. 예: 연구 노트 정리할 때 어떤 템플릿과 같이 쓰면 좋은지 공유해보세요."
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
          <button className="btn btn-primary btn-sm" type="button">
            댓글 등록
          </button>
        </div>
      </div>

      {comments.length === 0 ? (
        <div className="state-note idle">
          <span className="i mono">·</span>
          <span>아직 댓글이 없습니다. 첫 사용 경험을 남겨보세요.</span>
        </div>
      ) : (
        comments.map((comment) => (
          <div className="cm" key={comment.id}>
            <span className="cm-av">{authorInitials(comment.author)}</span>
            <div className="cm-b">
              <div className="cm-meta">
                <b>{comment.author}</b>
                <span>{formatDate(comment.createdAt)}</span>
              </div>
              <p>{comment.content}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
