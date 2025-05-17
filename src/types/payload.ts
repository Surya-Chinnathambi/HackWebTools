
export type PayloadSeverity = "low" | "medium" | "high" | "critical";

export interface Payload {
  id: string;
  name: string;
  content: string;
  description: string;
  category: string;
  categoryId: string;
  path: string;
  severity: PayloadSeverity;
  tags: string[];
}

export interface PayloadCategory {
  id: string;
  name: string;
  count: number;
  description?: string;
}
