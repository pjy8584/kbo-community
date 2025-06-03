import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
  Param,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // ✅ 전체 게시글 조회
  @Get()
  async getPosts(@Query('page') page: string) {
    const pageNumber = parseInt(page) || 1;
    return this.postService.getPosts(pageNumber);
  }

  // ✅ 특정 게시글 + 댓글 조회
  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return this.postService.getPostById(Number(id));
  }

  // ✅ 게시글 작성 (로그인 필요)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreatePostDto, @Request() req) {
    const userId = req.user.id;
    return this.postService.create(dto, userId);
  }

  // ✅ 댓글 작성 (로그인 필요)
  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async createComment(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.postService.createComment(Number(id), dto.content, userId);
  }
}