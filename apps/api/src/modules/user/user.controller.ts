import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
@Controller('admin/users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private service: UserService) {}

  private checkAdmin(req: any) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Admin access required');
    }
  }
  @Post()
  async create(
    @Req() req: any,
    @Body()
    body: {
      email: string;
      password: string;
      full_name: string;
      role?: string;
      company_name?: string; // ← THÊM FIELD NÀY CHO COMPANY
    },
  ) {
    this.checkAdmin(req);

    const role = body.role || 'candidate';
    const hashedPassword = await bcrypt.hash(body.password, 10);

    let company_id: string | undefined;

    if (role === 'company') {
      if (!body.company_name) {
        throw new BadRequestException(
          'Company name is required for company user',
        );
      }
      company_id = await this.service.createCompany(body.company_name);
    }

    const user = await this.service.create({
      email: body.email,
      password: hashedPassword,
      full_name: body.full_name,
      role,
      company_id, // ← LIÊN KẾT VỚI CÔNG TY
    });

    return { success: true, data: user };
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    this.checkAdmin(req);
    const user = await this.service.findOneById(id);
    return { success: true, data: user };
  }

  @Get()
  async findAll(
    @Req() req: any,
    @Query('page') pageStr?: string,
    @Query('limit') limitStr?: string,
    @Query('email') email?: string,
  ) {
    this.checkAdmin(req);

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
  @Post(':id/soft-delete')
  async softDelete(@Req() req: any, @Param('id') id: string) {
    this.checkAdmin(req);
    await this.service.softDelete(id);
    return { success: true };
  }
}
