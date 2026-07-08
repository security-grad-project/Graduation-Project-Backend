export interface CreateLogSourceDto {
  name: string;
  category: 'endpoint' | 'windows' | 'network' | 'cloud' | 'application';
  vendor: string;
  product: string;
  description: string; 
  dataset: string;     
  agent: string;
  pipeline: string;
  index: string;
  retentionDays?: number;
  shards?: number;
  enabled?: boolean;
  tags?: string[];
}
