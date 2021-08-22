import {
  read,
  write,
} from "https://raw.githubusercontent.com/skanehira/deno-clipboard-image/main/mod.ts";
import { copy } from "https://deno.land/std@0.105.0/io/mod.ts";

(async function () {
  const image = await Deno.open("testdata/test.png");
  await write(image);

  const src = await read();
  const out = await Deno.create("image.png");
  await copy(src, out);
  out.close();
}());
