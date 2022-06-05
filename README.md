# deno-clipboard-image
A deno module that write image to, and read image from clipboard.

## Requirements
- xclip(Linux only)

## Usage
```typescript
import { read, write } from "https://deno.land/x/clipboard_image@v0.0.1/mod.ts";
import { copy } from "https://deno.land/std@0.142.0/streams/mod.ts";

(async () => {
  const image = await Deno.open("test.png");
  await write(image);
  image.close();

  const src = await read();
  const out = await Deno.create("image.png");
  await copy(src, out);
  out.close();
})();
```

## Author
skanehira
