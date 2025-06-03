// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. 첫 번째 유저 가져오기
  const user = await prisma.user.findFirst();

  if (!user) {
    console.error('❌ 유저가 존재하지 않습니다. 먼저 회원가입을 진행해주세요.');
    return;
  }

  // 2. 게시글 5개 생성
  for (let i = 1; i <= 5; i++) {
    await prisma.post.create({
      data: {
        title: `샘플 게시글 ${i}`,
        content: `이것은 ${i}번째 샘플 게시글입니다.`,
        authorId: user.id,
      },
    });
  }

  console.log('✅ 게시글 5개가 성공적으로 생성되었습니다.');
}

main()
  .catch((e) => {
    console.error('❌ 에러 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });