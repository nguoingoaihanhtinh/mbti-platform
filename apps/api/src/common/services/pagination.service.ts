import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
  async paginate<T>(
    queryFn: (page: number, limit: number) => any,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> {
    const countQuery = queryFn(page, limit)
      .range(0, 0)
      .select('*', { count: 'exact' });

    const { count, error: countError } = await countQuery;
    if (countError) throw countError;

    if (count === 0) {
      return { data: [], total: 0, page, limit, total_pages: 0 };
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await queryFn(page, limit).range(from, to);

    if (error?.code === 'PGRST116') {
      return {
        data: [],
        total: count,
        page,
        limit,
        total_pages: Math.ceil(count / limit),
      };
    }

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      total_pages: Math.ceil(count / limit),
    };
  }
}
