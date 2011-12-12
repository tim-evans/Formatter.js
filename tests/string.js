if (QUnit) { module = QUnit.module; }
module("String specification");

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

// Tests toFormat implementation against PEP 3101
//   http://www.python.org/dev/peps/pep-3101/

test("Setting the maximum width of a string", function () {
  formatting("{:.2}").provided("hello").is("he");
  formatting("{:.9}").provided("hello").is("hello");
});

test("Setting the minimum width of a string", function () {
  formatting("{:2}").provided("hello").is("hello");
  formatting("{:9}").provided("hello").is("hello    ");
});

test("Using `<` will left align a string", function () {
  formatting("{:<2}").provided("hello").is("hello");
  formatting("{:<9}").provided("hello").is("hello    ");
});

test("Using `>` will right align a string", function () {
  formatting("{:>2}").provided("hello").is("hello");
  formatting("{:>9}").provided("hello").is("    hello");
});

test("Using `^` will center align a string", function () {
  formatting("{:^2}").provided("hello").is("hello");
  formatting("{:^9}").provided("hello").is("  hello  ");
  formatting("{:^10}").provided("hello").is("  hello   ");
});

test("The fill character is by default ' '", function () {
  formatting("{:1}").provided('').is(' ');
});

test("Specifying a fill character will make the extra characters that one", function () {
  formatting("{:0<1}").provided('').is('0');
  formatting("{:1>1}").provided('').is('1');
  formatting("{:2^1}").provided('').is('2');
});
