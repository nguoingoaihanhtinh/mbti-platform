import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private service: UserService) {}

  @Post()
  async create(
    @Body()
    body: {
      email: string;
      password: string;
      full_name: string;
    },
  ) {
    const user = await this.service.create({
      email: body.email,
      password: body.password,
      full_name: body.full_name,
      role: 'user',
    });
    return { success: true, data: user };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.service.findOneById(id);
    return { success: true, data: user };
  }

  @Get()
  async findAll(
    @Query('page') pageStr?: string,
    @Query('limit') limitStr?: string,
    @Query('email') email?: string,
  ) {
    const page = pageStr ? parseInt(pageStr, 10) : undefined;
    const limit = limitStr ? parseInt(limitStr, 10) : undefined;

    if (page !== undefined && (isNaN(page) || page < 1)) {
      throw new BadRequestException('Invalid page');
    }
    if (limit !== undefined && (isNaN(limit) || limit < 1 || limit > 100)) {
      throw new BadRequestException('Invalid limit');
    }

    const result = await this.service.findAll(page, limit, email);
    return {
      success: true,
      data: result.data,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        total_pages: result.total_pages,
      },
    };
  }
}
