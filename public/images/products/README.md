# Product Images

Place your product images in subdirectories here.

## Structure

```
public/
  images/
    products/
      hoodie-black-1.jpg      ← main product shot
      hoodie-black-2.jpg      ← detail shot
      hoodie-black-3.jpg      ← lifestyle shot
      tee-black-1.jpg
      tee-black-2.jpg
      poster-speed-1.jpg
      ...
```

## Usage in products.ts

Reference images like this:
```ts
images: [
  '/images/products/hoodie-black-1.jpg',
  '/images/products/hoodie-black-2.jpg',
]
```

## Image Tips

- **Format**: JPG or WebP (WebP is ~30% smaller)
- **Size**: 800×1067px minimum for 3:4 aspect ratio
- **Max file size**: Keep under 300KB per image (use squoosh.app to compress)
- Products without images show a branded placeholder automatically
