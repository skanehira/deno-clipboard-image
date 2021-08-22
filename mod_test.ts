import { read, write } from "./mod.ts";
import { assertNotEquals, io, path } from "./deps.ts";

Deno.test({
  name: "write and read",
  fn: async () => {
    const testfile = path.join("testdata", "test.png");
    const input = await Deno.readFile(testfile);
    await write(new io.Buffer(input));
  },
});

Deno.test({
  name: "read",
  fn: async () => {
    const got = await io.readAll(await read());
    assertNotEquals(got.length, 0);
  },
});
