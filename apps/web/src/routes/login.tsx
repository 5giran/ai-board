import { Link, createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useState } from "react";

import { AuthShell } from "@/components/auth/AuthShell";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const points = [
  {
    marker: ">_",
    title: "자연어로 검색하세요.",
    description: "키워드가 아니라 하려는 일을 말하면 맞는 익스텐션을 찾아줘요.",
  },
  {
    marker: "✓",
    title: "MCP가 검증한 메타데이터.",
    description: "다운로드·버전·권한 정보를 원본에서 자동 수집합니다.",
  },
  {
    marker: "✦",
    title: "AI 큐레이터.",
    description: "목표를 말하면 익스텐션 조합을 추천받을 수 있어요.",
  },
];

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    if (!email.includes("@") || password.length < 4) {
      setError("이메일과 비밀번호를 확인해 주세요.");
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setError("mock server error: 아직 실제 인증은 연결하지 않았습니다.");
    }, 600);
  };

  return (
    <AuthShell points={points}>
      <h1>다시 오셨네요</h1>
      <p className="sub">계정에 로그인하고 익스텐션을 탐색하세요.</p>
      <div className="field">
        <label className="label" htmlFor="login-email">
          이메일
        </label>
        <input
          className="input"
          id="login-email"
          type="email"
          value={email}
          placeholder="you@example.com"
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className="field">
        <label className="label" htmlFor="login-password">
          비밀번호
        </label>
        <input
          className="input"
          id="login-password"
          type="password"
          value={password}
          placeholder="••••••••"
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      {error ? <p className="err">{error}</p> : null}
      <button
        className="btn btn-primary btn-lg btn-block"
        type="button"
        disabled={isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? "로그인 중" : "로그인"}
      </button>
      <p className="helper" style={{ justifyContent: "center", marginTop: 12 }}>
        <Lock size={13} aria-hidden="true" />
        JWT 발급 · Argon2 검증
      </p>
      <p className="auth-switch">
        계정이 없으신가요? <Link to="/signup">회원가입</Link>
      </p>
    </AuthShell>
  );
}
