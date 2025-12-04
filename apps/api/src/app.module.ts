import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TestModule } from './modules/test/test.module';
import { QuestionModule } from './modules/quesion/question.module';
import { AnswerModule } from './modules/answer/answer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    TestModule,
    QuestionModule,
    AnswerModule,
  ],
})
export class AppModule {}
