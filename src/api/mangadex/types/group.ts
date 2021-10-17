export interface ScanlationGroup {
  id: string;
  type: 'author';
  attributes: ScanlationGroupAttributes;
}

export interface ScanlationGroupAttributes {
  name: string;
  description: string;
  official: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}
