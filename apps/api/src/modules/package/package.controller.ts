import { Controller, Get } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';

@Controller('packages')
export class PackagesController {
  constructor(private adminService: AdminService) {}

  @Get()
  async getPublicPackages() {
    return this.adminService.getPackages();
  }
}
