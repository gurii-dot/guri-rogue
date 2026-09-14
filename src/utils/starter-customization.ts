import { globalScene } from "#app/global-scene";
import { speciesDataRegistry } from "#app/global-species-data-registry";
import { speciesEggMoves } from "#balance/moves/egg-moves";
import { allAbilities, allMoves } from "#data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import type { SpeciesId } from "#enums/species-id";
import type { StarterEggMoveSet } from "#types/save-data";
import { getEnumValues } from "#utils/enums";

export function hasStarterEggMoveData(starterId: SpeciesId): boolean {
  return Object.hasOwn(speciesEggMoves, starterId);
}

export function getStarterEggMoves(starterId: SpeciesId): MoveId[] {
  const custom = globalScene.gameData.starterData[starterId]?.customEggMoves;
  if (custom) {
    return [...custom];
  }
  if (hasStarterEggMoveData(starterId)) {
    return [...speciesEggMoves[starterId as keyof typeof speciesEggMoves]];
  }
  return [];
}

export function setStarterEggMove(starterId: SpeciesId, slotIndex: number, moveId: MoveId): void {
  const starterData = globalScene.gameData.starterData[starterId];
  if (!starterData || slotIndex < 0 || slotIndex > 3) {
    return;
  }

  const moves = getStarterEggMoves(starterId);
  while (moves.length < 4) {
    moves.push(MoveId.NONE);
  }
  moves[slotIndex] = moveId;
  starterData.customEggMoves = moves.slice(0, 4) as StarterEggMoveSet;
}

export function getSpeciesPassive(speciesId: SpeciesId, formIndex: number): AbilityId {
  const starterId = speciesDataRegistry.getStarter(speciesId);
  const custom = globalScene.gameData.starterData[starterId]?.customPassives?.[speciesId]?.[formIndex];
  if (custom != null) {
    return custom;
  }
  return speciesDataRegistry.getPassive(speciesId, formIndex);
}

export function setSpeciesPassive(
  starterId: SpeciesId,
  speciesId: SpeciesId,
  formIndex: number,
  abilityId: AbilityId,
): void {
  const starterData = globalScene.gameData.starterData[starterId];
  if (!starterData) {
    return;
  }

  if (!starterData.customPassives) {
    starterData.customPassives = {};
  }
  if (!starterData.customPassives[speciesId]) {
    starterData.customPassives[speciesId] = {};
  }
  starterData.customPassives[speciesId][formIndex] = abilityId;
}

export function resolveMoveIdByLocalizedName(name: string): MoveId | null {
  for (const moveId of getEnumValues(MoveId)) {
    if (moveId === MoveId.NONE) {
      continue;
    }
    if (allMoves[moveId].name === name) {
      return moveId;
    }
  }
  return null;
}

export function resolveAbilityIdByLocalizedName(name: string): AbilityId | null {
  for (const abilityId of getEnumValues(AbilityId)) {
    if (abilityId === AbilityId.NONE) {
      continue;
    }
    if (allAbilities[abilityId].name === name) {
      return abilityId;
    }
  }
  return null;
}

export function getLocalizedMoveNames(): string[] {
  return getEnumValues(MoveId)
    .filter(moveId => moveId !== MoveId.NONE)
    .map(moveId => allMoves[moveId].name);
}

export function getLocalizedAbilityNames(): string[] {
  return getEnumValues(AbilityId)
    .filter(abilityId => abilityId !== AbilityId.NONE)
    .map(abilityId => allAbilities[abilityId].name);
}
