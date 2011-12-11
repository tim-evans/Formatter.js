module("Format");

// Test helper
function formatting(template) {
  return {
    is: function (expectation) {
      equals(expectation, Formatter.format(template));
    },
    provided: function () {
      var args = Array.prototype.slice.call(arguments);
      return {
        is: function (expectation) {
          equals(Formatter.vformat(template, args), expectation);
        },
        raises: function (errorType) {
          var didRaise = false,
              result;
          try {
            result = Formatter.vformat(template, args);
          } catch (x) {
            didRaise = true;
            ok(x instanceof errorType,
               "Should have raised " + errorType.toString() + " error.");
          }

          ok(didRaise,
             "Should have raised an error, but returned with '" + result + "'.");
        }
      };
    },
    raises: function (errorType) {
      try {
        Formatter.format(template);
      } catch (x) {
        ok(x instanceof errorType,
           "Should have raised " + errorType.toString() + " error.");
      }
    }
  };
}

// Regular arguments
test("Regular arguments work as expected", function () {
  formatting("{}").provided("espresso").is("espresso");
  formatting("{}").provided([0]).is("0");
  formatting("{}").provided(null).is("null");
  formatting("{}").provided(undefined).is("undefined");
});

// Escaped braces
test("Escaped opening brace", function () {
  formatting("{{").is("{");
});

test("Escaped closing brace", function () {
  formatting("}}").is("}");
});

// Automatically unpacking arrays
test("Arrays are automatically unpacked", function () {
  formatting("{}").provided([0]).is('0');
});

test("Arrays can be manually unpacked too", function () {
  formatting("{0}").provided([0]).is('0');
});

// Indexing
test("Explicit argument indexing works", function () {
  formatting("{1} and {0}").provided("cigarettes", "coffee").is("coffee and cigarettes");
});

// Auto-indexing
test("By default, templates are auto-indexed", function () {
  formatting("{} and {}").provided("coffee", "cigarettes").is("coffee and cigarettes");
});

test("Extra arguments are tossed", function () {
  formatting("{}, {}, and {}").provided("coffee", "cigarettes").is("coffee, cigarettes, and undefined");
});

// Property indexing
test("Objects can be indexed by property names", function () {
  formatting("{name}").provided({ name: "Bill Murray" }).is("Bill Murray");
});

// Syntax errors
test("An unmatched opening brace should throw an error", function () {
  formatting("{answer").provided({ answer: 42 }).raises(Error);
});

test("An unmatched closing brace should throw an error", function () {
  formatting("answer}").provided({ answer: 42 }).raises(Error);
});

test("An unmatched opening brace with multiple format strings should throw an error", function () {
  formatting("What is the answer to {}, { and {}?")
         .provided('life', 'the universe', 'and everything').raises(Error);
});

test("An unmatched closing brace with multiple format strings should throw an error", function () {
  formatting("What is the answer to {}, {} and }?")
         .provided('life', 'the universe', 'and everything').raises(Error);
});

// toFormat API
test("The formatting specification should be deferred to the object being formatted", function () {
  var spec = 'abc',
      template = '{:' + spec + '}',
      didCall = false;

  formatting(template).provided({
    toFormat: function (specifier) {
      equals(spec, specifier, "The format specifier should match");
      didCall = true;
      return 'def';
    }
  }).is('def');

  ok(didCall);
});

// Clean recursion inside specifiers
test("Formatting templates can be embedded in format specifiers", function () {
  var spec = '5',
      template = '{:{}}',
      didCall = false;

  formatting(template).provided(spec, {
    toFormat: function (specifier) {
      equals(spec, specifier, "The format specifier should match");
      didCall = true;
      return 'def';
    }
  }).is('def');

  ok(didCall);
});
