export interface VulnerabilityScript {
  scriptId: number;
  dependencies: number[];
}

export interface ExecutionPlan {
  waves: number[][];
  warnings: string[];
  efficiency: number;
}