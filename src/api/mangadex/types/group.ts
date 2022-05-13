import { Title } from "./manga";

export interface ScanlationGroup {
  id: string;
  type: 'scanlation_group';
  attributes: ScanlationGroupAttributes;
}

export interface ScanlationGroupAttributes {
  name: string;
  altNames: Title[];
  website?: string | null;
  ircServer?: string | null;
  ircChannel?: string | null;
  discord?: string | null;
  contactEmail?: string | null;
  description?: string | null;
  twitter?: string | null;
  mangaUpdates?: string | null;
  locked: boolean;
  official: boolean;
  inactive: boolean;
  publishDelay: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}
