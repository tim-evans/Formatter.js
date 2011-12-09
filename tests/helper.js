module("Compile");

test("Compiling a format string returns a function", function () {
  ok(typeof Formatter.compile("Foo bar"), "function");
});
