import { read, write } from "./mod.ts";
import { assertEquals, io, path } from "./deps.ts";

Deno.test({
  name: "write and read",
  fn: async () => {
    const testfile = path.join("testdata", "test.png");
    const want = await Deno.readFile(testfile);

    await write(new io.Buffer(want));
    const got = await io.readAll(await read());
    assertEquals(got, want);
  },
});
