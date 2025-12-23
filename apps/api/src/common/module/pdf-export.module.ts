import { Module } from '@nestjs/common';

import { PdfExportService } from '../services/pdf-export.service';

@Module({
  providers: [PdfExportService],
  exports: [PdfExportService],
})
export class PdfExportModule {}
