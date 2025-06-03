// app/board/BoardContent.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: {
    nickname: string;
  };
};

export default function BoardContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.replace('/');
      return;
    }

    fetch(`http://localhost:3001/posts?page=${currentPage}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.error('게시글 불러오기 실패:', err));
  }, [currentPage, router]);

  const handlePageChange = (page: number) => {
    router.push(`/board?page=${page}`);
  };

  const handlePostClick = (id: number) => {
    router.push(`/board/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">📋 커뮤니티 게시판</h1>
          <Link href="/board/write">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
              ✍️ 글쓰기
            </button>
          </Link>
        </div>

        <ul className="space-y-4 mb-8">
          {posts.map((post) => (
            <li
              key={post.id}
              onClick={() => handlePostClick(post.id)}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <h2 className="text-lg font-semibold text-gray-800">{post.title}</h2>
              <div className="text-sm text-gray-500 mt-1">
                {post.author.nickname} · {new Date(post.createdAt).toLocaleDateString('ko-KR')}
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-4 py-2 rounded ${
                page === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}