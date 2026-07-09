import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';
import logger from '../../../common/utils/logger';
import { Prisma } from '@prisma/client';
import { prisma } from '../../../config/postgres';
import { elasticClient } from '../../../config/elasticsearch';
import {
  createDashboardData,
  ListDashboardsQuery,
  updateDashboardData,
  DashboardDataQuery,
  DashboardPanelDefinition,
  MetricPanelDefinition,
  HistogramPanelDefinition,
  BreakdownPanelDefinition,
  DashboardPanelsData,
  PanelStat,
  HistogramPoint,
  BreakdownItem,
} from '../types/types';
import { buildDashboardFilter } from './dashboard.utils';

export const createDashboardService = async (ownerId: string, data: createDashboardData) => {
  const dashboard = await prisma.dashboard.create({
    data: {
      title: data.title,
      description: data.description,
      tags: data.tags ?? [],
      panels: data.panels ? (data.panels as unknown as Prisma.InputJsonValue) : undefined,
      ownerId,
    },
  });
  logger.info(`dashboard created successfully: title ${dashboard.title}`);
  return dashboard;
};

export const updateDashboardService = async (id: string, data: updateDashboardData) => {
  const dashboard = await prisma.dashboard.update({
    where: { id },
    data: {
      ...data,
      panels: data.panels ? (data.panels as unknown as Prisma.InputJsonValue) : undefined,
    },
  });

  logger.info(`dashboard updated successfully: id ${id}`);
  return dashboard;
};

export const deleteDashboardService = async (id: string) => {
  await prisma.dashboard.delete({ where: { id } });
  logger.info(`dashboard deleted successfully: id ${id}`);
};

export const getDashboardService = async (id: string) => {
  const dashboard = await prisma.dashboard.findUnique({ where: { id } });
  if (!dashboard) throw new ApiErrorHandler(404, 'Dashboard Not Found');

  logger.info(`dashboard retrieved successfully: id ${id}`);
  return dashboard;
};

export const getAllDashboardsService = async (query: ListDashboardsQuery) => {
  const where = buildDashboardFilter({ search: query.search });

  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.dashboard.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.dashboard.count({ where }),
  ]);

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
};

const DEFAULT_RANGE_HOURS = 24;

const buildTimeRange = (query: DashboardDataQuery) => {
  const to = query.to ? new Date(query.to) : new Date();
  const from = query.from
    ? new Date(query.from)
    : new Date(to.getTime() - DEFAULT_RANGE_HOURS * 60 * 60 * 1000);
  return { gte: from.toISOString(), lte: to.toISOString() };
};

const buildFilterClauses = (filter?: Record<string, string>) =>
  filter ? Object.entries(filter).map(([field, value]) => ({ term: { [field]: value } })) : [];

const buildBoolQuery = (
  timeRange: { gte: string; lte: string },
  filter?: Record<string, string>,
) => ({
  bool: {
    filter: [{ range: { '@timestamp': timeRange } }, ...buildFilterClauses(filter)],
  },
});

const runMetricPanel = async (
  panel: MetricPanelDefinition,
  timeRange: { gte: string; lte: string },
): Promise<PanelStat> => {
  const { spec } = panel;
  const query = buildBoolQuery(timeRange, spec.filter);

  if (spec.aggType === 'count') {
    const res = await elasticClient.count({ index: spec.index, query });
    return { label: panel.title, value: res.count };
  }

  if (spec.aggType === 'cardinality') {
    if (!spec.field) throw new Error(`Panel "${panel.title}": cardinality metric requires "field"`);
    const res = await elasticClient.search({
      index: spec.index,
      size: 0,
      query,
      aggs: { unique: { cardinality: { field: spec.field } } },
    });
    const value = (res.aggregations as Record<string, any>)?.unique?.value ?? 0;
    return { label: panel.title, value };
  }

  const [totalRes, numeratorRes] = await Promise.all([
    elasticClient.count({ index: spec.index, query }),
    elasticClient.count({
      index: spec.index,
      query: buildBoolQuery(timeRange, { ...spec.filter, ...spec.numeratorFilter }),
    }),
  ]);
  const total = totalRes.count;
  const numerator = numeratorRes.count;
  const value = total > 0 ? `${((numerator / total) * 100).toFixed(1)}%` : '0.0%';
  return { label: panel.title, value };
};

const runHistogramPanel = async (
  panel: HistogramPanelDefinition,
  timeRange: { gte: string; lte: string },
): Promise<HistogramPoint[]> => {
  const { spec } = panel;
  const res = await elasticClient.search({
    index: spec.index,
    size: 0,
    query: buildBoolQuery(timeRange, spec.filter),
    aggs: {
      over_time: { date_histogram: { field: '@timestamp', fixed_interval: spec.interval ?? '1h' } },
    },
  });

  const buckets = ((res.aggregations as Record<string, any>)?.over_time?.buckets ?? []) as {
    key: number;
    doc_count: number;
  }[];

  return buckets.map((b) => ({
    time: new Date(b.key).toISOString().slice(11, 16),
    count: b.doc_count,
  }));
};

const runBreakdownPanel = async (
  panel: BreakdownPanelDefinition,
  timeRange: { gte: string; lte: string },
): Promise<BreakdownItem[]> => {
  const { spec } = panel;
  const res = await elasticClient.search({
    index: spec.index,
    size: 0,
    query: buildBoolQuery(timeRange, spec.filter),
    aggs: { by_field: { terms: { field: spec.field, size: spec.size ?? 5 } } },
  });

  const buckets = ((res.aggregations as Record<string, any>)?.by_field?.buckets ?? []) as {
    key: string;
    doc_count: number;
  }[];

  return buckets.map((b) => ({ label: String(b.key), value: b.doc_count }));
};

export const getDashboardDataService = async (
  id: string,
  query: DashboardDataQuery,
): Promise<DashboardPanelsData> => {
  const dashboard = await prisma.dashboard.findUnique({ where: { id } });
  if (!dashboard) throw new ApiErrorHandler(404, 'Dashboard Not Found');

  const panels = (dashboard.panels as unknown as DashboardPanelDefinition[]) ?? [];
  const timeRange = buildTimeRange(query);

  const stats: PanelStat[] = [];
  let histogram: HistogramPoint[] = [];
  let breakdown: BreakdownItem[] = [];

  await Promise.all(
    panels.map(async (panel) => {
      try {
        if (panel.type === 'metric') {
          stats.push(await runMetricPanel(panel, timeRange));
        } else if (panel.type === 'histogram') {
          histogram = await runHistogramPanel(panel, timeRange);
        } else if (panel.type === 'breakdown') {
          breakdown = await runBreakdownPanel(panel, timeRange);
        }
      } catch (error) {
        logger.error(`Failed to compute panel "${panel.title}" for dashboard ${id}`, { error });
      }
    }),
  );

  return { stats, histogram, breakdown };
};
