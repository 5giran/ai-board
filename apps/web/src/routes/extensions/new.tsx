import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import {
  AutoFillPreview,
  type ImportStatus,
} from "@/components/submit/AutoFillPreview";
import { Stepper } from "@/components/submit/Stepper";
import { PageShell } from "@/components/layout/PageShell";
import type { Platform } from "@/mocks/extensions";
import { mockExtensions } from "@/mocks/extensions";

export const Route = createFileRoute("/extensions/new")({
  component: ExtensionNewPage,
});

const previewExtension = mockExtensions[2];
type DraftField = "title" | "description" | "platform" | "category" | "tags";
type FieldSource = "empty" | "mcp" | "edited";

const emptyFieldSources: Record<DraftField, FieldSource> = {
  title: "empty",
  description: "empty",
  platform: "empty",
  category: "empty",
  tags: "empty",
};

function ExtensionNewPage() {
  const [sourceUrl, setSourceUrl] = useState("");
  const [importStatus, setImportStatus] = useState<ImportStatus>("idle");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState<Platform | "">("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [fieldSources, setFieldSources] =
    useState<Record<DraftField, FieldSource>>(emptyFieldSources);

  const currentStep = getCurrentStep(importStatus, submitted);

  const handleImport = () => {
    setSubmitted(false);
    setImportStatus("loading");
    window.setTimeout(() => {
      if (!sourceUrl.trim() || sourceUrl.includes("fail")) {
        setImportStatus("error");
        return;
      }

      setTitle(previewExtension.name);
      setDescription(previewExtension.description);
      setPlatform(previewExtension.platform);
      setCategory(previewExtension.category);
      setTags(previewExtension.tags.join(", "));
      setFieldSources({
        title: "mcp",
        description: "mcp",
        platform: "mcp",
        category: "mcp",
        tags: "mcp",
      });
      setImportStatus("success");
    }, 650);
  };

  const markField = (field: DraftField, value: string) => {
    setFieldSources((current) => ({
      ...current,
      [field]: value.trim() ? "edited" : "empty",
    }));
  };

  return (
    <PageShell padded>
      <h1 className="page-title">새 익스텐션 등록</h1>
      <p className="page-sub">
        원본 URL을 붙여넣으면 MCP가 정보를 자동으로 채웁니다. 확인 후 직접
        수정할 수 있어요.
      </p>

      <Stepper currentStep={currentStep} />

      <div className="submit">
        <div className="card" style={{ padding: 20 }}>
          <div className="field">
            <label className="label" htmlFor="source-url">
              원본 URL
            </label>
            <div className="url-row">
              <input
                className="input"
                id="source-url"
                value={sourceUrl}
                placeholder="https://github.com/org/repo 또는 marketplace URL"
                onChange={(event) => {
                  setSourceUrl(event.target.value);
                  setSubmitted(false);
                  if (!event.target.value.trim()) {
                    setImportStatus("idle");
                  }
                }}
              />
              <button
                className="btn btn-primary"
                type="button"
                disabled={importStatus === "loading"}
                onClick={handleImport}
              >
                {importStatus === "loading" ? "불러오는 중" : "자동으로 불러오기"}
              </button>
            </div>
            <p className="helper">
              MCP가 이름·아이콘·설명·버전·별점·업데이트 정보를 자동으로
              가져옵니다.
            </p>
            {importStatus === "error" ? (
              <p className="inline-error">
                <span className="mono">×</span>
                자동 수집에 실패했어요. 직접 입력하거나 URL을 다시 확인하세요.
              </p>
            ) : null}
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid hsl(var(--border))",
              margin: "18px 0",
            }}
          />

          <div className="field">
            <FieldLabel
              fieldSource={fieldSources.title}
              htmlFor="extension-title"
              label="제목"
            />
            <input
              className="input"
              id="extension-title"
              value={title}
              placeholder="예: Commit Message AI"
              onChange={(event) => {
                setTitle(event.target.value);
                markField("title", event.target.value);
              }}
            />
          </div>
          <div className="field">
            <FieldLabel
              fieldSource={fieldSources.description}
              htmlFor="extension-description"
              label="설명"
            />
            <textarea
              className="input"
              id="extension-description"
              rows={2}
              value={description}
              placeholder="익스텐션이 어떤 문제를 해결하는지 짧게 적어주세요."
              onChange={(event) => {
                setDescription(event.target.value);
                markField("description", event.target.value);
              }}
            />
          </div>
          <div className="grid-2">
            <div className="field">
              <FieldLabel
                fieldSource={fieldSources.platform}
                htmlFor="extension-platform"
                label="플랫폼"
              />
              <select
                className="input"
                id="extension-platform"
                value={platform}
                onChange={(event) => {
                  setPlatform(event.target.value as Platform | "");
                  markField("platform", event.target.value);
                }}
              >
                <option value="">플랫폼 선택</option>
                <option>VS Code</option>
                <option>Chrome</option>
                <option>Obsidian</option>
                <option>Raycast</option>
                <option>Notion</option>
              </select>
            </div>
            <div className="field">
              <FieldLabel
                fieldSource={fieldSources.category}
                htmlFor="extension-category"
                label="카테고리"
              />
              <select
                className="input"
                id="extension-category"
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  markField("category", event.target.value);
                }}
              >
                <option value="">카테고리 선택</option>
                <option>Developer tools</option>
                <option>AI coding</option>
                <option>Productivity</option>
                <option>Writing</option>
                <option>Research</option>
                <option>Publishing</option>
              </select>
            </div>
          </div>
          <div className="field">
            <FieldLabel
              fieldSource={fieldSources.tags}
              htmlFor="extension-tags"
              label="태그"
            />
            <input
              className="input"
              id="extension-tags"
              value={tags}
              placeholder="git, ai, developer"
              onChange={(event) => {
                setTags(event.target.value);
                markField("tags", event.target.value);
              }}
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="extension-body">
              본문
            </label>
            <textarea
              className="input"
              id="extension-body"
              rows={3}
              value={body}
              placeholder="사용 예시, 설치 방법, 함께 쓰면 좋은 익스텐션을 적어주세요."
              onChange={(event) => setBody(event.target.value)}
            />
          </div>

          {submitted ? (
            <div className="state-note ok">
              <span className="i mono">✓</span>
              <span>등록 요청이 완료된 것처럼 표시했습니다. 실제 저장은 하지 않았어요.</span>
            </div>
          ) : null}

          <div className="form-actions">
            <button className="btn btn-ghost" type="button">
              미리보기
            </button>
            <button className="btn btn-outline" type="button">
              임시저장
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => setSubmitted(true)}
            >
              등록하기
            </button>
          </div>
        </div>

        <AutoFillPreview
          status={importStatus}
          previewExtension={previewExtension}
        />
      </div>
    </PageShell>
  );
}

type FieldLabelProps = {
  htmlFor: string;
  label: string;
  fieldSource: FieldSource;
};

function FieldLabel({ htmlFor, label, fieldSource }: FieldLabelProps) {
  return (
    <div className="field-top">
      <label className="label" htmlFor={htmlFor}>
        {label}
      </label>
      {fieldSource !== "empty" ? (
        <span
          className={`source-chip ${fieldSource === "mcp" ? "mcp" : "edited"}`}
        >
          {fieldSource === "mcp" ? "MCP filled" : "edited"}
        </span>
      ) : null}
    </div>
  );
}

function getCurrentStep(importStatus: ImportStatus, submitted: boolean) {
  if (submitted) {
    return 4;
  }

  if (importStatus === "success") {
    return 3;
  }

  if (importStatus === "loading" || importStatus === "error") {
    return 2;
  }

  return 1;
}
