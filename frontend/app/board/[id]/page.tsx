// ✅ /board/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Comment = {
  id: number;
  content: string;
  createdAt: string;
  author: {
    nickname: string;
  };
};

type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: {
    nickname: string;
  };
  comments: Comment[];
};

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`http://localhost:3001/posts/${id}`);
      const data = await res.json();
      setPost(data);
    };
    fetchPost();
  }, [id]);

  const handleCommentSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    const res = await fetch(`http://localhost:3001/posts/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: newComment }),
    });

    if (res.ok) {
      const createdComment = await res.json();
      setNewComment('');
      setPost((prev) =>
        prev
          ? {
              ...prev,
              comments: [...(prev.comments ?? []), createdComment],
            }
          : prev
      );
    }
    else {
      alert('댓글 등록 실패');
    }
  };

  if (!post) return <div className="p-8">로딩 중...</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-2 text-black">{post.title}</h1>
      <p className="text-gray-600 mb-4">
        {post.author.nickname} · {new Date(post.createdAt).toLocaleString()}
      </p>
      <div className="mb-8 text-black">{post.content}</div>

      <h2 className="text-xl font-semibold mb-4 text-black">💬 댓글</h2>
      <ul className="mb-4 space-y-3">
        {post.comments.map((comment) => (
          <li key={comment.id} className="p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-700">{comment.content}</p>
            <p className="text-xs text-gray-500">
              {comment.author.nickname} · {new Date(comment.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 border border-gray-300 p-2 rounded text-black"
          placeholder="댓글을 입력하세요"
        />
        <button
          onClick={handleCommentSubmit}
          className="bg-blue-500 text-white px-4 rounded"
        >
          등록
        </button>
      </div>
    </div>
  );
}