import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
  async paginate<T>(baseQuery: () => any, page = 1, limit = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { count, error: countError } = await baseQuery().select('*', {
      count: 'exact',
      head: true,
    });

    if (countError) throw countError;

    const { data, error } = await baseQuery().range(from, to);

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit),
    };
  }
}
