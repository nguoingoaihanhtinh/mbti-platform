import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TestModule } from './modules/test/test.module';
import { QuestionModule } from './modules/quesion/question.module';
import { AnswerModule } from './modules/answer/answer.module';
import { PaginationService } from './common/services/pagination.service';
import { AssessmentModule } from './modules/assessment/assessment.module';
import { HRModule } from './modules/hr/hr.module';
import { CompanyModule } from './modules/company/company.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    TestModule,
    QuestionModule,
    AnswerModule,
    AssessmentModule,
    HRModule,
    CompanyModule,
    AdminModule,
  ],
  providers: [PaginationService],
})
export class AppModule {}
