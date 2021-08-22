# deno-clipboard-image
A deno module that write image to, and read image from clipboard.

## Requirements
- xclip(Linux only)

## Usage
- Read image from clipboard
  ```
  src = await read();
  const out = await Deno.create("image.png");
  await copy(src, out);
  out.close();
  ```

- Write image to clipboard
  ```
  const image = await Deno.open("test.png");
  await write(image);
  ```

## Author
skanehira
