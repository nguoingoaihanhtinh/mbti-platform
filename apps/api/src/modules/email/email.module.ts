// email.module.ts
import { initEmailTransporter } from '@/utils/email';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [],
})
export class EmailModule implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    initEmailTransporter(this.configService);
  }
}
