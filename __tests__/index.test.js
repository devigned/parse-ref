const { expect, test } = require("@jest/globals");
const process = require("process");
const cp = require("child_process");
const path = require("path");

const runAction = (ref) => {
  const copy = { ...process.env };
  copy.INPUT_REF = ref;
  const index = path.join(__dirname, "../src/index.js");
  return cp.execSync(`node ${index}`, { env: copy }).toString().trim();
};

test("a valid reference outputs variables correctly", async () => {
  const expectation = `
::set-output name=nomatch::false

::set-output name=crate::my-crate

::set-output name=version::1.2.3

::set-output name=runtime::my-crate
`.trim();
  expect(runAction("refs/tags/my-crate/v1.2.3")).toBe(expectation);
});

test("an invalid reference", async () => {
  const expectation = `
::set-output name=nomatch::true
`.trim();
  expect(runAction("refs/tags/wat/boo/1.2.3")).toBe(expectation);
});

test("a valid reference with a runtime crate", async () => {
  const expectation = `
::set-output name=nomatch::false

::set-output name=crate::containerd-shim-wasmtime

::set-output name=version::1.2.3

::set-output name=runtime::wasmtime
`.trim();
  expect(runAction("refs/tags/containerd-shim-wasmtime/v1.2.3")).toBe(
    expectation,
  );
});
