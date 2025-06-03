// ✅ 1. 로그인 페이지 (/page.tsx)
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 

export default function MainPage() {
  const [tab, setTab] = useState<'signup' | 'signin'>('signup');
  const [signupForm, setSignupForm] = useState({ email: '', password: '', nickname: '' });
  const [signinForm, setSigninForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const router = useRouter(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'signup' | 'signin') => {
    const { name, value } = e.target;
    if (type === 'signup') {
      setSignupForm({ ...signupForm, [name]: value });
    } else {
      setSigninForm({ ...signinForm, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = tab === 'signup' ? signupForm : signinForm;
    const url = tab === 'signup' ? 'http://localhost:3001/user/signup' : 'http://localhost:3001/auth/login';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify({ id: data.userId, nickname: data.nickname }));
      setMessage(`${tab === 'signup' ? '회원가입' : '로그인'} 성공! ${data.nickname || data.email}님 환영합니다.`);

      if (tab === 'signin') {
        router.push('/board');
      }

    } catch (err: any) {
      setMessage(`${tab === 'signup' ? '회원가입' : '로그인'} 실패: ` + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-center text-gray-900 mb-6">{tab === 'signup' ? '회원가입' : '로그인'}</h1>

        <div className="flex mb-6 border-b">
          <button
            onClick={() => setTab('signup')}
            className={`w-1/2 py-2 text-sm font-medium ${tab === 'signup' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
          >
            회원가입
          </button>
          <button
            onClick={() => setTab('signin')}
            className={`w-1/2 py-2 text-sm font-medium ${tab === 'signin' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
          >
            로그인
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="이메일"
            value={tab === 'signup' ? signupForm.email : signinForm.email}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black text-black"
            onChange={(e) => handleChange(e, tab)}
          />
          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            value={tab === 'signup' ? signupForm.password : signinForm.password}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black text-black"
            onChange={(e) => handleChange(e, tab)}
          />
          {tab === 'signup' && (
            <input
              name="nickname"
              placeholder="닉네임"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black text-black"
              onChange={(e) => handleChange(e, 'signup')}
            />
          )}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition"
          >
            {tab === 'signup' ? '회원가입' : '로그인'} 하기
          </button>
        </form>

        {message && <p className="text-center text-sm text-red-500 mt-4">{message}</p>}
      </div>
    </div>
  );
}