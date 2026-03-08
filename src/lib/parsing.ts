import type { ManufacturerCableRecord } from './types';

export function parseManufacturerCsv(text: string): ManufacturerCableRecord[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => line.split(',').map((cell) => cell.trim()))
    .filter((cells) => cells.length >= 3 && !Number.isNaN(Number(cells[0])))
    .map((cells, index) => ({
      id: cells[4] || `MFR-${index + 1}`,
      conductor_mm2: Number(cells[0]),
      ampacityA: Number(cells[1]),
      mvPerAm: Number(cells[2]),
      outerDiameterMm: cells[3] ? Number(cells[3]) : undefined,
      notes: cells[4] ? `Imported: ${cells[4]}` : undefined,
    }));
}
