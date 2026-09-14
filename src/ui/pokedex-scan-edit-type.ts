export enum PokedexScanEditType {
  EGG_MOVE = 100,
  PASSIVE = 101,
}

export function isPokedexScanEditType(row: number): row is PokedexScanEditType {
  return row === PokedexScanEditType.EGG_MOVE || row === PokedexScanEditType.PASSIVE;
}
