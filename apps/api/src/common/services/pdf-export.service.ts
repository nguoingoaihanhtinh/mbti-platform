import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfExportService {
  private client: SupabaseClient;

  constructor(private config: ConfigService) {
    const url = this.config.get<string>('SUPABASE_URL');
    const key = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!url || !key) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }

    this.client = createClient(url, key);
  }

  /**
   * Tạo PDF document với font hỗ trợ tiếng Việt
   */
  private createPdfWithVietnameseFont(): PDFDocument {
    const doc = new PDFDocument({ margin: 50 });

    // Đường dẫn đến font Noto Sans (hỗ trợ Unicode + tiếng Việt)
    const fontPath = path.join(
      __dirname,
      '..',
      '..',
      'assets',
      'fonts',
      'NotoSans-Regular.ttf',
    );

    if (!fs.existsSync(fontPath)) {
      console.warn(
        `⚠️ Font file not found at ${fontPath}. Falling back to default.`,
      );
      return doc; // Dùng font mặc định (sẽ lỗi tiếng Việt)
    }

    // Đăng ký và sử dụng font
    doc.registerFont('NotoSans', fontPath);
    doc.font('NotoSans');

    return doc;
  }

  async generateAssessmentResultPDF(assessmentId: string): Promise<Buffer> {
    // Fetch assessment data
    const { data: assessment, error } = await this.client
      .from('assessments')
      .select(
        `
        id,
        completed_at,
        guest_email,
        guest_fullname,
        users(full_name, email),
        tests(title),
        results(
          mbti_type,
          mbti_types(
            type_code,
            type_name,
            overview,
            strengths,
            weaknesses,
            improvement_areas,
            career_recommendations,
            workplace_needs,
            suitable_roles,
            communication_style,
            leadership_style
          )
        )
      `,
      )
      .eq('id', assessmentId)
      .single();

    if (error || !assessment) {
      throw new Error('Assessment not found');
    }

    const user = Array.isArray(assessment.users)
      ? assessment.users[0]
      : assessment.users;
    const test = Array.isArray(assessment.tests)
      ? assessment.tests[0]
      : assessment.tests;
    const result = Array.isArray(assessment.results)
      ? assessment.results[0]
      : assessment.results;
    const mbtiTypes = result?.mbti_types?.[0] || result?.mbti_types;

    return new Promise((resolve, reject) => {
      const doc = this.createPdfWithVietnameseFont();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(24).text('Kết quả đánh giá tính cách', { align: 'center' });

      doc.moveDown();

      // Candidate Info
      doc.fontSize(16).text('Thông tin ứng viên');

      doc
        .fontSize(12)
        .text(
          `Họ tên: ${user?.full_name || assessment.guest_fullname || 'N/A'}`,
        )
        .text(`Email: ${user?.email || assessment.guest_email || 'N/A'}`)
        .text(`Bài test: ${test?.title || 'N/A'}`)
        .text(
          `Ngày hoàn thành: ${new Date(assessment.completed_at).toLocaleDateString('vi-VN')}`,
        );

      doc.moveDown();

      // MBTI Result
      doc.fontSize(16).text('Kết quả MBTI');

      doc
        .fontSize(20)
        .fillColor('#9333ea')
        .text(result?.mbti_type || 'N/A', { align: 'center' });

      doc
        .fontSize(14)
        .fillColor('#000000')
        .text(mbtiTypes?.type_name || '', { align: 'center' });

      doc.moveDown();

      // Overview
      if (mbtiTypes?.overview) {
        doc.fontSize(14).text('Tổng quan');
        doc.fontSize(11).text(mbtiTypes.overview, { align: 'justify' });
        doc.moveDown();
      }

      // Strengths
      if (mbtiTypes?.strengths && mbtiTypes.strengths.length > 0) {
        doc.fontSize(14).fillColor('#10b981').text('Điểm mạnh');
        doc.fontSize(11).fillColor('#000000');
        mbtiTypes.strengths.forEach((strength: string) => {
          doc.text(`• ${strength}`);
        });
        doc.moveDown();
      }

      // Weaknesses
      if (mbtiTypes?.weaknesses && mbtiTypes.weaknesses.length > 0) {
        doc.fontSize(14).fillColor('#f59e0b').text('Điểm yếu');
        doc.fontSize(11).fillColor('#000000');
        mbtiTypes.weaknesses.forEach((weakness: string) => {
          doc.text(`• ${weakness}`);
        });
        doc.moveDown();
      }

      // Communication Style
      if (mbtiTypes?.communication_style) {
        doc.fontSize(14).text('Phong cách giao tiếp');
        doc
          .fontSize(11)
          .text(mbtiTypes.communication_style, { align: 'justify' });
        doc.moveDown();
      }

      // Leadership Style
      if (mbtiTypes?.leadership_style) {
        doc.fontSize(14).text('Phong cách lãnh đạo');
        doc.fontSize(11).text(mbtiTypes.leadership_style, { align: 'justify' });
        doc.moveDown();
      }

      // Career Recommendations
      if (
        mbtiTypes?.career_recommendations &&
        mbtiTypes.career_recommendations.length > 0
      ) {
        doc.addPage();
        doc.fontSize(14).text('Gợi ý nghề nghiệp');
        doc.fontSize(11);
        mbtiTypes.career_recommendations.forEach((career: string) => {
          doc.text(`• ${career}`);
        });
        doc.moveDown();
      }

      // Suitable Roles
      if (mbtiTypes?.suitable_roles && mbtiTypes.suitable_roles.length > 0) {
        doc.fontSize(14).text('Vai trò phù hợp');
        doc.fontSize(11);
        mbtiTypes.suitable_roles.forEach((role: string) => {
          doc.text(`• ${role}`);
        });
        doc.moveDown();
      }

      // Workplace Needs
      if (mbtiTypes?.workplace_needs && mbtiTypes.workplace_needs.length > 0) {
        doc.fontSize(14).text('Nhu cầu môi trường làm việc');
        doc.fontSize(11);
        mbtiTypes.workplace_needs.forEach((need: string) => {
          doc.text(`• ${need}`);
        });
      }

      // Footer
      doc
        .fontSize(8)
        .fillColor('#6b7280')
        .text(
          `Báo cáo được tạo tự động vào ${new Date().toLocaleString('vi-VN')}`,
          50,
          doc.page.height - 50,
          { align: 'center' },
        );

      doc.end();
    });
  }

  async generateCompanyDashboardPDF(companyId: string): Promise<Buffer> {
    // Fetch company data
    const { data: company, error: companyErr } = await this.client
      .from('companies')
      .select('id, name, created_at')
      .eq('id', companyId)
      .single();

    if (companyErr || !company) {
      throw new Error('Company not found');
    }

    // Fetch analytics
    const { data: assessments } = await this.client
      .from('assessments')
      .select('created_at, completed_at, tests(title)')
      .eq('company_id', companyId);

    // Process monthly data
    const monthlyMap = new Map<string, number>();
    assessments?.forEach((a) => {
      const month = new Date(a.created_at).toISOString().slice(0, 7);
      monthlyMap.set(month, (monthlyMap.get(month) || 0) + 1);
    });

    // Process test preferences
    const testMap = new Map<string, number>();
    assessments?.forEach((a) => {
      const test = Array.isArray(a.tests) ? a.tests[0] : a.tests;
      const title = test?.title || 'Untitled Test';
      testMap.set(title, (testMap.get(title) || 0) + 1);
    });

    const totalAssessments = assessments?.length || 0;
    const completedAssessments =
      assessments?.filter((a) => a.completed_at).length || 0;

    return new Promise((resolve, reject) => {
      const doc = this.createPdfWithVietnameseFont();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(24).text('Báo cáo hoạt động công ty', { align: 'center' });

      doc.moveDown();

      // Company Info
      doc.fontSize(16).text('Thông tin công ty');

      doc
        .fontSize(12)
        .text(`Tên công ty: ${company.name}`)
        .text(
          `Ngày tạo: ${new Date(company.created_at).toLocaleDateString('vi-VN')}`,
        );

      doc.moveDown();

      // Statistics
      doc.fontSize(16).text('Thống kê tổng quan');

      doc
        .fontSize(12)
        .text(`Tổng số assignments: ${totalAssessments}`)
        .text(`Số assignments hoàn thành: ${completedAssessments}`)
        .text(
          `Tỷ lệ hoàn thành: ${totalAssessments > 0 ? Math.round((completedAssessments / totalAssessments) * 100) : 0}%`,
        );

      doc.moveDown();

      // Monthly breakdown
      doc.fontSize(16).text('Phân bố theo tháng');

      doc.fontSize(11);

      const sortedMonths = Array.from(monthlyMap.entries()).sort((a, b) =>
        a[0].localeCompare(b[0]),
      );

      sortedMonths.forEach(([month, count]) => {
        const date = new Date(month + '-01');
        const monthName = date.toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: 'long',
        });
        doc.text(`${monthName}: ${count} assignments`);
      });

      doc.moveDown();

      // Test preferences
      doc.fontSize(16).text('Bài test phổ biến');

      doc.fontSize(11);

      const sortedTests = Array.from(testMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      sortedTests.forEach(([test, count]) => {
        doc.text(`${test}: ${count} lượt`);
      });

      // Footer
      doc
        .fontSize(8)
        .fillColor('#6b7280')
        .text(
          `Báo cáo được tạo tự động vào ${new Date().toLocaleString('vi-VN')}`,
          50,
          doc.page.height - 50,
          { align: 'center' },
        );

      doc.end();
    });
  }
}
