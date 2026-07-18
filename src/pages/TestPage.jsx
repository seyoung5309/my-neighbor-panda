// src/pages/TestPage.jsx
//
// 회원 관리 서비스 함수 동작 확인용 테스트 페이지입니다. 스타일 없음.
// App.jsx에서 임시로 이 컴포넌트를 렌더링해서 확인하시면 됩니다.
//
// 예: App.jsx
//   import TestPage from './pages/TestPage';
//   function App() { return <TestPage />; }

import { useState } from 'react';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithOAuth,
  signInWithNaver,
  signOut,
  getCurrentUser,
  deleteAccount,
} from '../services/authService';
import {
  checkNicknameDuplicate,
  updateNickname,
  getProfile,
} from '../services/profileService';
import {
  setLocation,
  overrideVillage,
  searchVillages,
  getMyLocation,
} from '../services/locationService';

export default function TestPage() {
  // 결과 출력용
  const [result, setResult] = useState(null);

  // 입력값 상태
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [userId, setUserId] = useState('');

  const [c, setC] = useState('');
  const [g, setG] = useState('');
  const [d, setD] = useState('');

  const [villageKeyword, setVillageKeyword] = useState('');
  const [villageId, setVillageId] = useState('');

  // 공통 실행 래퍼: 결과를 그대로 화면에 찍어줌
  async function run(label, fn) {
    console.log(`[${label}] 실행`);
    const res = await fn();
    console.log(`[${label}] 결과`, res);
    setResult({ label, ...res });
  }

  return (
    <div>
      <h2>회원 관리 테스트 페이지</h2>

      <section>
        <h3>1. 회원가입 / 로그인</h3>
        <div>
          <input
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={() => run('회원가입', () => signUpWithEmail(email, password))}>
          회원가입 (MM-001)
        </button>
        <button onClick={() => run('로그인', () => signInWithEmail(email, password))}>
          로그인 (MM-004)
        </button>
        <button onClick={() => run('구글 로그인', () => signInWithOAuth('google'))}>
          구글 로그인 (MM-002)
        </button>
        <button onClick={() => signInWithNaver()}>
          네이버 로그인 (MM-002)
        </button>
        <button onClick={() => run('로그아웃', () => signOut())}>
          로그아웃 (MM-004)
        </button>
        <button onClick={() => run('현재 유저', () => getCurrentUser())}>
          현재 유저 조회
        </button>
      </section>

      <hr />

      <section>
        <h3>2. 닉네임 / 프로필</h3>
        <div>
          <input
            placeholder="userId (현재 유저 조회 결과에서 복사)"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <button onClick={() => run('닉네임 중복확인', () => checkNicknameDuplicate(nickname))}>
          닉네임 중복확인 (MM-003)
        </button>
        <button onClick={() => run('닉네임 변경', () => updateNickname(userId, nickname))}>
          닉네임 변경 (MM-003)
        </button>
        <button onClick={() => run('프로필 조회', () => getProfile(userId))}>
          프로필 조회
        </button>
      </section>

      <hr />

      <section>
        <h3>3. 위치 / 마을</h3>
        <div>
          <input placeholder="시 (c)" value={c} onChange={(e) => setC(e.target.value)} />
          <input placeholder="구 (g)" value={g} onChange={(e) => setG(e.target.value)} />
          <input placeholder="동 (d)" value={d} onChange={(e) => setD(e.target.value)} />
        </div>
        <button
          onClick={() =>
            run('위치 설정', () => setLocation(userId, { c, g, d }))
          }
        >
          위치 설정 / 마을 자동매칭 (MM-005)
        </button>
        <button onClick={() => run('내 위치 조회', () => getMyLocation(userId))}>
          내 위치 조회
        </button>

        <div>
          <input
            placeholder="마을 검색 키워드"
            value={villageKeyword}
            onChange={(e) => setVillageKeyword(e.target.value)}
          />
          <button onClick={() => run('마을 검색', () => searchVillages(villageKeyword))}>
            마을 검색
          </button>
        </div>

        <div>
          <input
            placeholder="villageId (마을 검색 결과에서 복사)"
            value={villageId}
            onChange={(e) => setVillageId(e.target.value)}
          />
          <button
            onClick={() =>
              run('마을 수동변경', () => overrideVillage(userId, Number(villageId)))
            }
          >
            마을 수동 변경 (MM-006)
          </button>
        </div>
      </section>

      <hr />

      <section>
        <h3>4. 회원 탈퇴</h3>
        <button onClick={() => run('회원 탈퇴', () => deleteAccount(userId))}>
          회원 탈퇴 (MM-007)
        </button>
      </section>

      <hr />

      <section>
        <h3>결과 출력</h3>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </section>
    </div>
  );
}