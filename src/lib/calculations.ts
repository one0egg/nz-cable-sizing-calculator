import type { CableRecord, ConduitRule, SystemType } from './types';

export function calcCurrent(system: SystemType, voltage: number, powerKw: number, pf: number) {
  const p = powerKw * 1000;
  if (!voltage || !powerKw || !pf) return 0;
  return system === '3ph' ? p / (Math.sqrt(3) * voltage * pf) : p / (voltage * pf);
}

export function calcVoltageDropPercent(params: {
  currentA: number;
  mvPerAm: number;
  lengthM: number;
  voltageV: number;
}) {
  const { currentA, mvPerAm, lengthM, voltageV } = params;
  if (!currentA || !mvPerAm || !lengthM || !voltageV) return 0;
  const vdVolts = (mvPerAm * currentA * lengthM) / 1000;
  return (vdVolts / voltageV) * 100;
}

export function combineDeratingFactors(factors: number[]) {
  return factors.reduce((acc, val) => acc * val, 1);
}

export function requiredBaseAmpacity(loadCurrentA: number, totalFactor: number) {
  if (!totalFactor) return 0;
  return loadCurrentA / totalFactor;
}

export function getBaseAmp(entry: CableRecord, installationMethod: string) {
  const methodMatch = entry.baseAmpacity.find((x) => x.method === installationMethod);
  return methodMatch?.valueA ?? entry.baseAmpacity[0]?.valueA ?? 0;
}

export function getVd(entry: CableRecord, system: SystemType) {
  const systemMatch = entry.voltageDrop.find((x) => x.system === system);
  return systemMatch?.mv_per_a_m ?? entry.voltageDrop[0]?.mv_per_a_m ?? 0;
}

export function estimateResistanceOhmPerKm(mvPerAm: number, system: SystemType, pf: number) {
  const factor = system === '3ph' ? Math.sqrt(3) : 2;
  if (!mvPerAm || !pf) return 0;
  return (mvPerAm / 1000) / (factor * pf);
}

export function estimateCableLossKw(params: {
  currentA: number;
  resistanceOhmPerKm: number;
  lengthM: number;
  system: SystemType;
}) {
  const { currentA, resistanceOhmPerKm, lengthM, system } = params;
  const phaseFactor = system === '3ph' ? 3 : 2;
  return (phaseFactor * currentA * currentA * resistanceOhmPerKm * (lengthM / 1000)) / 1000;
}

export function estimateConduit(cableOdMm: number, quantity: number, conduitRules: ConduitRule[]) {
  if (!cableOdMm || !quantity) return null;

  const totalCableArea = quantity * Math.PI * Math.pow(cableOdMm / 2, 2);

  return (
    conduitRules.find((rule) => {
      const conduitArea = Math.PI * Math.pow(rule.approx_internal_diameter_mm / 2, 2);
      return totalCableArea / conduitArea <= rule.max_fill_ratio;
    }) ?? null
  );
}
