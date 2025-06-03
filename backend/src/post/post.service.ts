import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async getPosts(page: number) {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const [posts, totalCount] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { nickname: true },
          },
        },
      }),
      this.prisma.post.count(),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);
    return { posts, totalPages };
  }

  async getPostById(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { nickname: true },
        },
        comments: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: { nickname: true },
            },
          },
        },
      },
    });
  }

  async create(dto: CreatePostDto, userId: number) {
    return this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        authorId: userId,
      },
    });
  }

  async createComment(postId: number, content: string, userId: number) {
    return this.prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
      include: {
        author: {
          select: { nickname: true },
        },
      },
    });
  }
}