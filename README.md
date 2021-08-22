# deno-clipboard-image
A deno module that write image to, and read image from clipboard.

## Requirements
- xclip(Linux only)

## Usage
- Read image from clipboard
  ```typescript
  src = await read();
  const out = await Deno.create("image.png");
  await copy(src, out);
  out.close();
  ```

- Write image to clipboard
  ```typescript
  const image = await Deno.open("test.png");
  await write(image);
  image.close();
  ```

## Author
skanehira
