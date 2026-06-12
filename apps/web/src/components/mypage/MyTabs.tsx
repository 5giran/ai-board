export type MyTab = "extensions" | "comments" | "bookmarks" | "drafts";

const tabs: Array<{ label: string; value: MyTab }> = [
  { label: "내가 등록한 익스텐션", value: "extensions" },
  { label: "작성한 댓글", value: "comments" },
  { label: "북마크", value: "bookmarks" },
  { label: "임시저장", value: "drafts" },
];

type MyTabsProps = {
  selectedTab: MyTab;
  onChange: (tab: MyTab) => void;
};

export function MyTabs({ selectedTab, onChange }: MyTabsProps) {
  return (
    <div className="mp-tabs" role="tablist" aria-label="마이페이지 탭">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={selectedTab === tab.value ? "on" : undefined}
          type="button"
          role="tab"
          aria-selected={selectedTab === tab.value}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
