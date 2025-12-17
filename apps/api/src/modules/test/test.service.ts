import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseProvider } from '@/database/supabase.provider';
import {
  TestInsert,
  TestUpdate,
  TestVersionInsert,
  TestVersionUpdate,
  Test,
  TestVersion,
} from '@/types/common';

import { PaginationService } from '@/common/services/pagination.service';
import { CreateQuestionDto } from '../quesion/dto/create-question.dto';

@Injectable()
export class TestService {
  constructor(
    private supabase: SupabaseProvider,
    private pagination: PaginationService,
  ) {}

  async createTest(
    testInput: TestInsert,
    versionInput: Omit<TestVersionInsert, 'test_id'>,
    questionsInput: CreateQuestionDto[],
  ) {
    const { data: test, error: testErr } = await this.supabase.client
      .from('tests')
      .insert(testInput)
      .select()
      .single();
    if (testErr) throw testErr;
    if (!test) throw new Error('Failed to create test');

    const { data: version, error: verErr } = await this.supabase.client
      .from('test_versions')
      .insert({ ...versionInput, test_id: test.id })
      .select()
      .single();
    if (verErr) throw verErr;
    if (!version) throw new Error('Failed to create version');

    await this.createQuestionsWithAnswers(test.id, version.id, questionsInput);

    return { test, version };
  }

  private async createQuestionsWithAnswers(
    testId: string,
    versionId: string,
    questionsInput: CreateQuestionDto[],
  ) {
    for (const q of questionsInput) {
      const { data: question, error: qErr } = await this.supabase.client
        .from('questions')
        .insert({
          test_id: testId,
          test_version_id: versionId,
          text: q.text,
          type: q.type || 'single_choice',
          dimension: q.dimension || null,
          order_index: q.order_index,
        })
        .select()
        .single();

      if (qErr) throw qErr;
      if (!question) continue;

      if (q.answers && q.answers.length > 0) {
        const answersToInsert = q.answers.map((a) => ({
          question_id: question.id,
          text: a.text,
          score: a.score,
          dimension: a.dimension || null,
          order_index: a.order_index,
        }));

        const { error: aErr } = await this.supabase.client
          .from('answers')
          .insert(answersToInsert);

        if (aErr) throw aErr;
      }
    }
  }

  async getTestWithContent(testId: string, versionId?: string) {
    const { data: test, error: tErr } = await this.supabase.client
      .from('tests')
      .select('*')
      .eq('id', testId)
      .single();
    if (tErr || !test) throw new BadRequestException('Test not found');

    let version: TestVersion;
    if (versionId) {
      const { data: v, error: vErr } = await this.supabase.client
        .from('test_versions')
        .select('*')
        .eq('id', versionId)
        .single();
      if (vErr || !v) throw new BadRequestException('Version not found');
      version = v;
    } else {
      const { data: v, error: vErr } = await this.supabase.client
        .from('test_versions')
        .select('*')
        .eq('test_id', testId)
        .order('version_number', { ascending: false })
        .limit(1)
        .single();
      if (vErr || !v) throw new BadRequestException('No version found');
      version = v;
    }

    const { data: questions, error: qErr } = await this.supabase.client
      .from('questions')
      .select('*')
      .eq('test_id', testId)
      .eq('test_version_id', version.id)
      .order('order_index', { ascending: true });

    if (qErr) throw qErr;

    if (!questions || questions.length === 0) {
      return { test, version, questions: [] };
    }

    const questionIds = questions.map((q) => q.id);
    const { data: answers, error: aErr } = await this.supabase.client
      .from('answers')
      .select('*')
      .in('question_id', questionIds)
      .order('order_index', { ascending: true });

    if (aErr) throw aErr;

    const answersByQuestion = (answers || []).reduce(
      (acc, ans) => {
        if (!acc[ans.question_id]) acc[ans.question_id] = [];
        acc[ans.question_id].push(ans);
        return acc;
      },
      {} as Record<string, typeof answers>,
    );

    return {
      test,
      version,
      questions: questions.map((q) => ({
        ...q,
        answers: answersByQuestion[q.id] || [],
      })),
    };
  }

  async getAllTests(page = 1, limit = 10) {
    return this.pagination.paginate(
      () =>
        this.supabase.client
          .from('tests')
          .select('*')
          .order('created_at', { ascending: false }),
      page,
      limit,
    );
  }

  async updateTest(
    id: string,
    data: TestUpdate & { questions?: CreateQuestionDto[] },
  ): Promise<Test> {
    const updateData: TestUpdate = {
      title: data.title,
      description: data.description,
      is_active: data.is_active,
    };

    const { data: updated, error } = await this.supabase.client
      .from('tests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!updated) throw new BadRequestException('Test not found');

    if (data.questions && data.questions.length > 0) {
      const { data: version } = await this.supabase.client
        .from('test_versions')
        .select('id')
        .eq('test_id', id)
        .order('version_number', { ascending: false })
        .limit(1)
        .single();

      if (version) {
        await this.supabase.client
          .from('questions')
          .delete()
          .eq('test_id', id)
          .eq('test_version_id', version.id);

        await this.createQuestionsWithAnswers(id, version.id, data.questions);
      }
    }

    return updated;
  }

  async updateTestVersion(
    id: string,
    data: TestVersionUpdate,
  ): Promise<TestVersion> {
    const { data: updated, error } = await this.supabase.client
      .from('test_versions')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    if (!updated) throw new BadRequestException('Version not found');
    return updated;
  }

  async deleteTest(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('tests')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  async deleteTestVersion(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('test_versions')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  async getTestVersions(testId: string): Promise<TestVersion[]> {
    const { data: versions, error } = await this.supabase.client
      .from('test_versions')
      .select('*')
      .eq('test_id', testId)
      .order('version_number', { ascending: false });
    if (error) throw error;
    return versions || [];
  }

  async getTestVersionById(versionId: string): Promise<TestVersion> {
    const { data: version, error } = await this.supabase.client
      .from('test_versions')
      .select('*')
      .eq('id', versionId)
      .single();
    if (error || !version) throw new BadRequestException('Version not found');
    return version;
  }

  async createTestVersion(
    testId: string,
    data: Omit<TestVersionInsert, 'test_id'>,
  ): Promise<TestVersion> {
    const { data: existing } = await this.supabase.client
      .from('test_versions')
      .select('id')
      .eq('test_id', testId)
      .eq('version_number', data.version_number)
      .single();

    if (existing) {
      throw new BadRequestException(
        `Version ${data.version_number} already exists`,
      );
    }

    const { data: newVersion, error } = await this.supabase.client
      .from('test_versions')
      .insert({ ...data, test_id: testId })
      .select()
      .single();
    if (error) throw error;
    if (!newVersion) throw new Error('Failed to create version');
    return newVersion;
  }
}
