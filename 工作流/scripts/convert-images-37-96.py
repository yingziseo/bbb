from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path('/root/bbb')
PROMPT_PATH = ROOT / '工作流/图片prompt-37-96.json'
PNG_DIR = ROOT / '工作流/封面图'
WEBP_DIR = PNG_DIR / '已经转webp'
PUBLIC_DIR = ROOT / 'public/images/blog'
TARGET_SIZE = (1200, 675)


def main() -> None:
    assets = json.loads(PROMPT_PATH.read_text(encoding='utf-8'))
    WEBP_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    converted = 0
    for asset in assets:
        source = PNG_DIR / asset['filename']
        if not source.is_file():
            raise FileNotFoundError(f'Missing PNG: {source}')

        webp_name = f"{source.stem}.webp"
        workflow_output = WEBP_DIR / webp_name
        public_output = PUBLIC_DIR / webp_name

        with Image.open(source) as image:
            image.load()
            normalized = ImageOps.fit(
                image.convert('RGB'),
                TARGET_SIZE,
                method=Image.Resampling.LANCZOS,
                centering=(0.5, 0.5),
            )
            normalized.save(workflow_output, 'WEBP', quality=90, method=6)
            normalized.save(public_output, 'WEBP', quality=90, method=6)

        converted += 1

    for output_dir in (WEBP_DIR, PUBLIC_DIR):
        for asset in assets:
            output = output_dir / f"{Path(asset['filename']).stem}.webp"
            if not output.is_file() or output.stat().st_size == 0:
                raise RuntimeError(f'Invalid WebP output: {output}')
            with Image.open(output) as image:
                if image.size != TARGET_SIZE or image.format != 'WEBP':
                    raise RuntimeError(
                        f'Unexpected WebP output {output}: {image.format} {image.size}'
                    )

    print(json.dumps({
        'converted': converted,
        'workflowWebp': converted,
        'publicWebp': converted,
        'size': f'{TARGET_SIZE[0]}x{TARGET_SIZE[1]}',
        'quality': 90,
    }, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
