import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PdfExportService } from '../services/pdf-export.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [PdfExportService],
  exports: [PdfExportService],
})
export class PdfExportModule {}
