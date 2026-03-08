export type CableMode = 'LV' | 'HV';
export type SystemType = '1ph' | '3ph';
export type Material = 'Cu' | 'Al';

export interface CableBaseAmpacity {
  method: string;
  valueA: number;
}

export interface CableVoltageDrop {
  system: SystemType;
  mv_per_a_m: number;
}

export interface CableRecord {
  id: string;
  mode: CableMode;
  material: Material;
  conductor_mm2: number;
  cores: number;
  insulation: string;
  sheath?: string;
  installationMethods: string[];
  baseAmpacity: CableBaseAmpacity[];
  voltageDrop: CableVoltageDrop[];
  outerDiameterMm?: number;
  shortCircuit1s_kA?: number;
  notes?: string[];
  sourceRef?: string;
}

export interface DeratingFactorItem {
  key: string;
  label: string;
  factor: number;
  notes?: string;
}

export interface DeratingFactorSet {
  category: string;
  mode: CableMode;
  items: DeratingFactorItem[];
}

export interface ConduitRule {
  conduit_mm: number;
  approx_internal_diameter_mm: number;
  max_fill_ratio: number;
  notes?: string;
}

export interface ManufacturerCableRecord {
  id: string;
  conductor_mm2: number;
  ampacityA: number;
  mvPerAm: number;
  outerDiameterMm?: number;
  notes?: string;
}
