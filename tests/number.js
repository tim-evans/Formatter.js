module("Number specification");

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

test("Formatting a number normally should be like formatting a string", function () {
  formatting("{}").provided(10).is("10");
  formatting("{}").provided(0.01).is("0.01");
  formatting("{}").provided(0.0100).is("0.01");
});

test("String alignment with signed numbers", function () {
  formatting("{:=3}").provided(-1).is("- 1");
});

test("Specifying a `+` sign will force both `+` and `-` to appear", function () {
  formatting("{:+}").provided(-1).is("-1");
  formatting("{:+}").provided(+1).is("+1");
});

test("Specifying a `-` sign will make only `-` appear", function () {
  formatting("{:-}").provided(-1).is("-1");
  formatting("{:-}").provided(+1).is("1");
});

test("Specifying a ` ` sign will make only ` ` appear with positive numbers", function () {
  formatting("{: }").provided(-1).is("-1");
  formatting("{: }").provided(+1).is(" 1");
});

test("`-` is the default sign specifier", function () {
  formatting("{}").provided(-1).is("-1");
  formatting("{}").provided(+1).is("1");
});

test("Zero-padding a number will put the sign in front of the 0s", function () {
  formatting("{:03}").provided(-1).is("-01");
});

test("Number precision", function () {
  formatting("{:.1}").provided(42).is("42");
  formatting("{:.2}").provided(Math.PI).is("3.1");
  formatting("{:.5}").provided(Math.PI).is("3.1415");
  formatting("{:.0}").provided(Math.PI).is("3");
  formatting("{:.1}").provided(Math.PI).is("3.");
});

test("`b` will output the number in binary", function () {
  formatting("{:b}").provided(10).is("1010");
});

test("`#b` will output the number in binary with `0b` prepended", function () {
  formatting("{:#b}").provided(10).is("0b1010");
});

test("`o` will output the number in octal", function () {
  formatting("{:o}").provided(10).is("12");
});

test("`#o` will output the number in binary with `0o` prepended", function () {
  formatting("{:#o}").provided(10).is("0o12");
});

test("`x` will output the number in hexadecimal (lowercase)", function () {
  formatting("{:x}").provided(10).is("a");
});

test("`#x` will output the number in binary with `0x` prepended", function () {
  formatting("{:#x}").provided(10).is("0xa");
});

test("`X` will output the number in hexadecimal (uppercase)", function () {
  formatting("{:X}").provided(10).is("A");
});

test("`#X` will output the number in binary with `0x` prepended", function () {
  formatting("{:#X}").provided(10).is("0xA");
});

test("`c` will output the char code for the given number", function () {
  formatting("{:c}").provided(65).is('A');
  formatting("{:c}").provided(67).is('C');
  formatting("{:c}").provided(69).is('E');
});

test("`d` will output the number in decimal", function () {
  formatting("{:d}").provided(65).is('65');
});

test("`#d` will output the number in decimal with nothing prepended", function () {
  formatting("{:#d}").provided(65).is('65');
});

// the 'n' flag is OS/browser dependent.
test("`n` will return the localized string", function () {
  formatting("{:n}").provided(20000).is((20000).toLocaleString());
});

test("`e` will return the number with an exponential (lowercase)", function () {
  formatting("{:e}").provided(1000).is('1e+3');
});

test("`E` will return the number with an exponential (uppercase)", function () {
  formatting("{:E}").provided(1000).is('1E+3');
});

test("`f` will return the number as a fixed point number (defaults to precision of 7)", function () {
  formatting("{:f}").provided(Math.PI).is('3.141593');
});

test("`f` will return the number as a fixed point number", function () {
  formatting("{:.10f}").provided(Math.PI).is('3.1415926536');
});

test("`g` will return very small numbers with an exponent", function () {
  formatting("{:g}").provided(.00000000000000000001).is('1e-20');
});

test("`g` will return very large numbers with an exponent", function () {
  formatting("{:g}").provided(1000000000000000000000).is('1e+21');
});

test("`g` will return whole numbers as they are", function () {
  formatting("{:g}").provided(42).is('42');
});

test("`g` will return floating-point numbers as they are", function () {
  formatting("{:g}").provided(1.2345).is('1.2345');
});

test("`g` will truncate floating-point numbers after 15 characters", function () {
  formatting("{:g}").provided(3.14159265358979323846264338327950288419716939937510)
                    .is('3.141592653589793');
});

test("`G` will return very small numbers with an exponent (uppercase)", function () {
  formatting("{:G}").provided(.00000000000000000001).is('1E-20');
});

test("`G` will return very large numbers with an exponent (uppercase)", function () {
  formatting("{:G}").provided(1000000000000000000000).is('1E+21');
});

test("`%` will return the number as a percentage", function () {
  formatting("{:%}").provided(.42).is('42%');
  formatting("{:%}").provided(.4201).is('42.01%');
});
