#!/usr/bin/env python3
"""Rollback custom mega exp sprite migration."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO_POKEMON = ROOT / "assets" / "images" / "pokemon"
EXP_SPRITES_JSON = ROOT / "assets" / "exp-sprites.json"
MASTERLIST_PATH = REPO_POKEMON / "variant" / "_masterlist.json"
MIGRATION_SCRIPT = ROOT / "scripts" / "migrate-custom-mega-exp.py"

MEGA_KEYS = [
    "26-mega-x",
    "26-mega-y",
    "71-mega",
    "121-mega",
    "149-mega",
    "154-mega",
    "160-mega",
    "36-mega",
    "227-mega",
    "359-mega-z",
    "478-mega",
    "398-mega",
    "358-mega",
    "445-mega-z",
    "448-mega-z",
    "485-mega",
    "491-mega",
    "500-mega",
    "530-mega",
    "545-mega",
    "560-mega",
    "604-mega",
    "609-mega",
    "623-mega",
    "652-mega",
    "655-mega",
    "658-mega",
    "668-mega",
    "678-mega",
    "687-mega",
    "689-mega",
    "691-mega",
    "701-mega",
    "718-mega",
    "740-mega",
    "768-mega",
    "780-mega",
    "801-mega",
    "807-mega",
    "870-mega",
    "952-mega",
    "970-mega",
    "998-mega",
    "2670-mega",
]

MASTERLIST_ADDED_KEYS = [
    "604-mega",
    "609-mega",
    "652-mega",
    "668-mega",
    "687-mega",
    "701-mega",
    "718-mega",
    "740-mega",
    "801-mega",
    "870-mega",
]


def back_exp_key(key: str) -> str:
    match = re.match(r"^(\d+)(.*)$", key)
    if not match:
        raise ValueError(f"Cannot derive back exp key for {key}")
    return f"{match.group(1)}b{match.group(2)}"


def remove_sprite_files() -> int:
    removed = 0
    for key in MEGA_KEYS:
        for subdir in (REPO_POKEMON / "exp", REPO_POKEMON / "exp" / "back"):
            for suffix in (".png", ".json"):
                path = subdir / f"{key}{suffix}"
                if path.exists():
                    path.unlink()
                    removed += 1
    return removed


def remove_variant_exp_files() -> int:
    removed = 0
    for key in MEGA_KEYS:
        for subdir in (REPO_POKEMON / "variant" / "exp", REPO_POKEMON / "variant" / "exp" / "back"):
            path = subdir / f"{key}.json"
            if path.exists():
                path.unlink()
                removed += 1
    return removed


def rollback_exp_sprites_json() -> int:
    keys_to_remove = set()
    for key in MEGA_KEYS:
        keys_to_remove.add(key)
        keys_to_remove.add(back_exp_key(key))

    existing = json.loads(EXP_SPRITES_JSON.read_text(encoding="utf-8"))
    updated = [entry for entry in existing if entry not in keys_to_remove]
    removed = len(existing) - len(updated)

    EXP_SPRITES_JSON.write_text(json.dumps(updated, indent=4, ensure_ascii=False) + "\n", encoding="utf-8")
    return removed


def rollback_masterlist() -> int:
    masterlist = json.loads(MASTERLIST_PATH.read_text(encoding="utf-8"))
    removed = 0

    for key in MASTERLIST_ADDED_KEYS:
        if key in masterlist:
            del masterlist[key]
            removed += 1
        back = masterlist.get("back")
        if isinstance(back, dict) and key in back:
            del back[key]
            removed += 1

    MASTERLIST_PATH.write_text(json.dumps(masterlist, indent="\t", ensure_ascii=False) + "\n", encoding="utf-8")
    return removed


def main() -> None:
    sprite_removed = remove_sprite_files()
    variant_removed = remove_variant_exp_files()
    exp_keys_removed = rollback_exp_sprites_json()
    masterlist_removed = rollback_masterlist()

    if MIGRATION_SCRIPT.exists():
        MIGRATION_SCRIPT.unlink()

    print(f"Removed {sprite_removed} exp sprite files")
    print(f"Removed {variant_removed} variant/exp JSON files")
    print(f"Removed {exp_keys_removed} entries from exp-sprites.json")
    print(f"Removed {masterlist_removed} masterlist entries")
    print("Deleted scripts/migrate-custom-mega-exp.py")


if __name__ == "__main__":
    main()
