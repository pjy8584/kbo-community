# backend/Dockerfile
FROM node:18

WORKDIR /app

# 의존성 먼저 복사하고 설치
COPY package*.json ./
RUN npm install

# Prisma schema 먼저 복사 (generate 위해)
COPY prisma ./prisma

# 나머지 소스 코드 복사
COPY . .

# Prisma 클라이언트 생성 (Linux용)
RUN npx prisma generate

# NestJS 빌드
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]