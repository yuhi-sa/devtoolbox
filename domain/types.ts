export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  implemented: boolean;
}

export interface PipelineStep {
  toolId: string;
  config?: Record<string, unknown>;
}
