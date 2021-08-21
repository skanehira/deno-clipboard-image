import { add } from "./mod.ts";
import { assertEquals } from "./deps.ts";

Deno.test({
  name: "add",
  fn: () => {
    const got = add(1, 2);
    assertEquals(got, 3);
  },
});
