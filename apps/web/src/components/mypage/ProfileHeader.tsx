import type { MockViewer } from "@/mocks/extensions";

type ProfileHeaderProps = {
  viewer: MockViewer;
};

export function ProfileHeader({ viewer }: ProfileHeaderProps) {
  return (
    <div className="mp-head">
      <span className="mp-av">YR</span>
      <div style={{ flex: 1 }}>
        <h1>{viewer.nickname}</h1>
        <div className="mp-mail">{viewer.email}</div>
      </div>
      <button className="btn btn-outline btn-sm" type="button">
        프로필 수정
      </button>
    </div>
  );
}
