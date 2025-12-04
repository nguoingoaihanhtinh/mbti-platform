import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseProvider } from '@/database/supabase.provider';
import {
  TestInsert,
  TestUpdate,
  TestVersionInsert,
  TestVersionUpdate,
  QuestionInsert,
  AnswerInsert,
  Test,
  TestVersion,
} from '@/types/common';
import { CreateQuestionDto } from '../quesion/dto/create-question.dto';

@Injectable()
export class TestService {
  constructor(private supabase: SupabaseProvider) {}

  //CREATE TEST (with version + questions + answers)
  async createTest(
    testInput: TestInsert,
    versionInput: Omit<TestVersionInsert, 'test_id'>,
    questionsInput: CreateQuestionDto[],
  ) {
    // Insert test
    const { data: test, error: testErr } = await this.supabase.client
      .from('tests')
      .insert(testInput)
      .select()
      .single();
    if (testErr) throw testErr;
    if (!test) throw new Error('Failed to create test');

    // Insert version
    const { data: version, error: verErr } = await this.supabase.client
      .from('test_versions')
      .insert({ ...versionInput, test_id: test.id })
      .select()
      .single();
    if (verErr) throw verErr;
    if (!version) throw new Error('Failed to create version');

    // Insert questions + answers
    for (const q of questionsInput) {
      const { data: question, error: qErr } = await this.supabase.client
        .from('questions')
        .insert({
          text: q.text,
          type: q.type,
          dimension: q.dimension,
          order_index: q.order_index,
          test_id: test.id,
          test_version_id: version.id,
        })
        .select()
        .single();

      if (qErr) throw qErr;
      if (!question) continue;

      for (const a of q.answers || []) {
        await this.supabase.client.from('answers').insert({
          text: a.text,
          score: a.score,
          dimension: a.dimension,
          order_index: a.order_index,
          question_id: question.id,
        });
      }
    }

    return { test, version };
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
      .order('order_index');

    if (qErr) throw qErr;

    if (questions.length === 0) {
      return { test, version, questions: [] };
    }

    const questionIds = questions.map((q) => q.id);
    const { data: answers, error: aErr } = await this.supabase.client
      .from('answers')
      .select('*')
      .in('question_id', questionIds)
      .order('order_index');

    if (aErr) throw aErr;

    const answersByQuestion = answers.reduce(
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

  async getTestVersions(testId: string): Promise<TestVersion[]> {
    const { data: versions, error } = await this.supabase.client
      .from('test_versions')
      .select('*')
      .eq('test_id', testId)
      .order('version_number', { ascending: false });
    if (error) throw error;
    return versions;
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
    data: Omit<TestVersionInsert, 'test_id' | 'id'>,
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

  async updateTest(id: string, data: TestUpdate): Promise<Test> {
    const { data: updated, error } = await this.supabase.client
      .from('tests')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    if (!updated) throw new BadRequestException('Test not found');
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

  //DELETE TEST VERSION (with cascade to questions/answers in DB)
  async deleteTestVersion(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('test_versions')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}
