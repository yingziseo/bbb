#!/usr/bin/env python3
import argparse
from pathlib import Path

from PIL import Image, ImageOps


def main() -> None:
    parser = argparse.ArgumentParser(description='Convert one generated cover to the website WebP format.')
    parser.add_argument('source', type=Path)
    parser.add_argument('destination', type=Path)
    args = parser.parse_args()

    if not args.source.is_file():
        raise FileNotFoundError(args.source)
    if args.destination.exists():
        raise FileExistsError(f'Refusing to overwrite existing cover: {args.destination}')

    args.destination.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(args.source) as image:
        image = ImageOps.exif_transpose(image).convert('RGB')
        image = ImageOps.fit(
            image,
            (1200, 675),
            method=Image.Resampling.LANCZOS,
            centering=(0.5, 0.5),
        )
        image.save(args.destination, format='WEBP', quality=86, method=6)

    with Image.open(args.destination) as result:
        if result.size != (1200, 675) or result.format != 'WEBP':
            raise RuntimeError(f'Invalid output: format={result.format}, size={result.size}')

    print(f'{args.destination}\t1200x675\t{args.destination.stat().st_size} bytes')


if __name__ == '__main__':
    main()
