import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AuthShell } from "@/components/auth/AuthShell";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

const points = [
  {
    marker: "1",
    title: "익스텐션을 등록하세요.",
    description: "URL만 넣으면 MCP가 정보를 자동으로 채웁니다.",
  },
  {
    marker: "2",
    title: "의미 기반으로 검색하세요.",
    description: "흩어진 익스텐션을 한곳에서 비교합니다.",
  },
  {
    marker: "3",
    title: "마이페이지에서 관리하세요.",
    description: "내 글, 댓글, 북마크를 한눈에 볼 수 있어요.",
  },
];

function SignupPage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const passwordMismatch =
    passwordConfirm.length > 0 && password !== passwordConfirm;

  const handleSubmit = () => {
    setServerError("");
    if (!nickname || !email.includes("@") || password.length < 8 || passwordMismatch) {
      setServerError("입력값을 확인해 주세요.");
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setServerError("mock server error: 이미 가입된 이메일처럼 표시했습니다.");
    }, 600);
  };

  return (
    <AuthShell points={points}>
      <h1>계정 만들기</h1>
      <p className="sub">무료로 시작하고 익스텐션을 공유하세요.</p>
      <div className="field">
        <label className="label" htmlFor="signup-nickname">
          닉네임
        </label>
        <input
          className="input"
          id="signup-nickname"
          value={nickname}
          placeholder="ran"
          onChange={(event) => setNickname(event.target.value)}
        />
      </div>
      <div className="field">
        <label className="label" htmlFor="signup-email">
          이메일
        </label>
        <input
          className="input"
          id="signup-email"
          type="email"
          value={email}
          placeholder="you@example.com"
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className="field">
        <label className="label" htmlFor="signup-password">
          비밀번호
        </label>
        <input
          className="input"
          id="signup-password"
          type="password"
          value={password}
          placeholder="8자 이상"
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <div className="field">
        <label className="label" htmlFor="signup-password-confirm">
          비밀번호 확인
        </label>
        <input
          className="input"
          id="signup-password-confirm"
          type="password"
          value={passwordConfirm}
          placeholder="다시 입력"
          aria-invalid={passwordMismatch}
          onChange={(event) => setPasswordConfirm(event.target.value)}
        />
        {passwordMismatch ? (
          <p className="err">비밀번호가 일치하지 않습니다.</p>
        ) : null}
      </div>
      {serverError ? <p className="err">{serverError}</p> : null}
      <button
        className="btn btn-primary btn-lg btn-block"
        type="button"
        disabled={isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? "가입 중" : "가입하기"}
      </button>
      <p className="auth-switch">
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </p>
    </AuthShell>
  );
}
