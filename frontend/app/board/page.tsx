// app/board/page.tsx
import { Suspense } from 'react';
import BoardContent from './BoardContent';

export default function BoardPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <BoardContent />
    </Suspense>
  );
}