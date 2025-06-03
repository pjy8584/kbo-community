'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // ✅ 마운트 시 토큰 검사 → 없으면 로그인 페이지로
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('✅ localStorage에 저장된 토큰:', token); 
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    console.log('✅ 등록 시 사용하는 토큰:', token); 
    
    if (!token) {
      alert('토큰이 없습니다. 다시 로그인해주세요.');
      router.push('/');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ JWT 토큰 포함
        },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        alert('게시글이 성공적으로 등록되었습니다!');
        router.push('/board');
      } else {
        const error = await res.json();
        alert(`게시글 등록 실패: ${error.message}`);
        if (res.status === 401) {
          // 인증 실패 (예: 토큰 만료 등)
          localStorage.removeItem('token');
          router.push('/');
        }
      }
    } catch (err) {
      alert('요청 중 에러 발생');
      console.error('❌ 게시글 등록 오류:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">✍️ 게시글 작성</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="제목"
          className="w-full border rounded p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="내용을 입력하세요"
          className="w-full border rounded p-2 h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          등록하기
        </button>
      </form>
    </div>
  );
}