type SortOrder = 'asc' | 'desc';

type FilterOperator =
  | 'eq'
  | 'ne'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'in'
  | 'notIn';

export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

export interface SortOption {
  field: string;
  order: SortOrder;
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  sort?: SortOption | SortOption[];
  filters?: FilterCondition[];
  fields?: string[];
  search?: {
    query: string;
    fields: string[];
  };
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export function buildPrismaFilter(filters?: FilterCondition[]): Record<string, unknown> {
  if (!filters || filters.length === 0) return {};

  const where: Record<string, unknown> = {};

  for (const filter of filters) {
    const { field, operator, value } = filter;
    const fieldParts = field.split('.');
    let current = where;

    for (let i = 0; i < fieldParts.length - 1; i++) {
      const part = fieldParts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }

    const lastField = fieldParts[fieldParts.length - 1];
    current[lastField] = mapOperatorToCondition(operator, value);
  }

  return where;
}

function mapOperatorToCondition(operator: FilterOperator, value: unknown): unknown {
  switch (operator) {
    case 'eq':
      return value;
    case 'ne':
      return { not: value };
    case 'gt':
      return { gt: value };
    case 'gte':
      return { gte: value };
    case 'lt':
      return { lt: value };
    case 'lte':
      return { lte: value };
    case 'contains':
      return { contains: value, mode: 'insensitive' };
    case 'startsWith':
      return { startsWith: value, mode: 'insensitive' };
    case 'endsWith':
      return { endsWith: value, mode: 'insensitive' };
    case 'in':
      return { in: value };
    case 'notIn':
      return { notIn: value };
    default:
      return value;
  }
}

export function buildSearchFilter(
  query?: string,
  fields?: string[],
): Record<string, unknown> | undefined {
  if (!query || !fields || fields.length === 0) return undefined;

  return {
    OR: fields.map((field) => {
      const fieldParts = field.split('.');
      if (fieldParts.length === 1) {
        return { [field]: { contains: query, mode: 'insensitive' } };
      }

      let result: Record<string, unknown> = { contains: query, mode: 'insensitive' };
      for (let i = fieldParts.length - 1; i >= 0; i--) {
        result = { [fieldParts[i]]: result };
      }
      return result;
    }),
  };
}

export function buildPrismaSort(sort?: SortOption | SortOption[]): unknown {
  if (!sort) return { createdAt: 'desc' };

  const sortArray = Array.isArray(sort) ? sort : [sort];

  if (sortArray.length === 1) {
    return buildNestedSort(sortArray[0].field, sortArray[0].order);
  }

  return sortArray.map((s) => buildNestedSort(s.field, s.order));
}

function buildNestedSort(field: string, order: SortOrder): Record<string, unknown> {
  const fieldParts = field.split('.');

  if (fieldParts.length === 1) {
    return { [field]: order };
  }

  let result: Record<string, unknown> = { [fieldParts[fieldParts.length - 1]]: order };
  for (let i = fieldParts.length - 2; i >= 0; i--) {
    result = { [fieldParts[i]]: result };
  }
  return result;
}

export function buildFieldSelection(fields?: string[]): Record<string, boolean> | undefined {
  if (!fields || fields.length === 0) return undefined;

  const select: Record<string, boolean> = {};
  for (const field of fields) {
    select[field] = true;
  }
  return select;
}

export async function paginate<T>(
  model: {
    findMany: (args: unknown) => Promise<T[]>;
    count: (args: unknown) => Promise<number>;
  },
  options: QueryOptions = {},
  additionalWhere?: Record<string, unknown>,
  include?: Record<string, unknown>,
): Promise<PaginatedResult<T>> {
  const { page = 1, limit = 10, sort, filters, search, fields } = options;

  const skip = (page - 1) * limit;
  const take = limit;

  const filterWhere = buildPrismaFilter(filters);
  const searchWhere = buildSearchFilter(search?.query, search?.fields);

  const where: Record<string, unknown> = {
    ...additionalWhere,
    ...filterWhere,
  };

  if (searchWhere) {
    where.AND = [searchWhere];
  }

  const orderBy = buildPrismaSort(sort);
  const select = buildFieldSelection(fields);

  const findManyArgs: Record<string, unknown> = {
    where,
    skip,
    take,
    orderBy,
  };

  if (select) {
    findManyArgs.select = select;
  } else if (include) {
    findManyArgs.include = include;
  }

  const [data, total] = await Promise.all([model.findMany(findManyArgs), model.count({ where })]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export function parseQueryParams(query: Record<string, unknown>): QueryOptions {
  const options: QueryOptions = {};

  if (query.page) options.page = Number(query.page);
  if (query.limit) options.limit = Number(query.limit);

  if (query.sort) {
    const sortValues = Array.isArray(query.sort) ? query.sort : [query.sort];
    const sorts: SortOption[] = [];

    for (const sortValue of sortValues) {
      if (typeof sortValue === 'string') {
        const parts = sortValue.split(',');
        for (const part of parts) {
          const [field, order = 'asc'] = part.split(':');
          sorts.push({ field: field.trim(), order: order.trim() as SortOrder });
        }
      }
    }

    if (sorts.length > 0) {
      options.sort = sorts.length === 1 ? sorts[0] : sorts;
    }
  }

  if (query.fields && typeof query.fields === 'string') {
    options.fields = query.fields.split(',').map((f) => f.trim());
  }

  if (query.search && typeof query.search === 'string') {
    const searchFields =
      typeof query.searchFields === 'string'
        ? query.searchFields.split(',').map((f) => f.trim())
        : ['name'];
    options.search = { query: query.search, fields: searchFields };
  }

  const filters: FilterCondition[] = [];
  for (const key of Object.keys(query)) {
    const match = key.match(/^filter\[(\w+)\]\[(\w+)\]$/);
    if (match) {
      const [, field, operator] = match;
      filters.push({
        field,
        operator: operator as FilterOperator,
        value: query[key],
      });
    }
  }
  if (filters.length > 0) options.filters = filters;

  return options;
}
