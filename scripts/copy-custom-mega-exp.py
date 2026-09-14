#!/usr/bin/env python3
"""Copy custom mega sprites from pokeupdate into repo exp/ (no variant changes)."""

from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_POKEMON = Path(r"D:\pokeupdate\pokerogue-all-in-one\assets\images\pokemon")
REPO_POKEMON = ROOT / "assets" / "images" / "pokemon"
EXP_SPRITES_JSON = ROOT / "assets" / "exp-sprites.json"

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


def back_exp_key(key: str) -> str:
    match = re.match(r"^(\d+)(.*)$", key)
    if not match:
        raise ValueError(f"Cannot derive back exp key for {key}")
    return f"{match.group(1)}b{match.group(2)}"


def copy_sprite_pairs() -> int:
    copied = 0
    for key in MEGA_KEYS:
        for source_subdir, dest_subdir in (("", "exp"), ("back", "exp/back")):
            for suffix in (".png", ".json"):
                source = SOURCE_POKEMON / source_subdir / f"{key}{suffix}"
                dest_dir = REPO_POKEMON / dest_subdir
                dest_dir.mkdir(parents=True, exist_ok=True)
                dest = dest_dir / f"{key}{suffix}"
                shutil.copy2(source, dest)
                copied += 1
    return copied


def register_exp_sprite_keys() -> int:
    keys_to_add: list[str] = []
    for key in MEGA_KEYS:
        keys_to_add.append(key)
        keys_to_add.append(back_exp_key(key))

    existing = json.loads(EXP_SPRITES_JSON.read_text(encoding="utf-8"))
    existing_set = set(existing)
    added = 0
    for key in keys_to_add:
        if key not in existing_set:
            existing.append(key)
            existing.append(key)
            existing_set.add(key)
            added += 2

    EXP_SPRITES_JSON.write_text(json.dumps(existing, indent=4, ensure_ascii=False) + "\n", encoding="utf-8")
    return added


def main() -> None:
    copied = copy_sprite_pairs()
    added = register_exp_sprite_keys()
    print(f"Copied {copied} files ({len(MEGA_KEYS)} mega keys, front + back)")
    print(f"Added {added} entries to exp-sprites.json")
    print("Variant files unchanged")


if __name__ == "__main__":
    main()
