if (QUnit) { module = QUnit.module; }
module("Date specification");

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

// Test every combination of month and day of the week
var jan = new Date(1325400000000), // January    1, 2012
    feb = new Date(1328200000000), // February   2, 2012
    mar = new Date(1331000000000), // March      5, 2012
    apr = new Date(1333590000000), // April      4, 2012
    may = new Date(1337390000000), // May       18, 2012
    jun = new Date(1339290000000), // June       9, 2012
    jul = new Date(1341290000000), // July       3, 2012
    aug = new Date(1345290000000), // August    18, 2012
    sep = new Date(1347290000000), // September 10, 2012
    oct = new Date(1351290000000), // October   26, 2012
    nov = new Date(1352290000000), // November   7, 2012
    dec = new Date(1357000000000); // December  31, 2012

// Test against strftime documentation
// @see http://en.cppreference.com/w/cpp/chrono/c/strftime

test("`%%` will return `%`", function () {
  formatting("{:%%}").provided(jan).is("%");
});

test("`%n` will return `\n`", function () {
  formatting("{:%n}").provided(jan).is("\n");
});

test("`%t` will return `\t`", function () {
  formatting("{:%t}").provided(jan).is("\t");
});

// Year
test("`%Y` will return the year with the century", function () {
  formatting("{:%Y}").provided(jan).is("2012");
});

test("`%y` will return the year without the century", function () {
  formatting("{:%y}").provided(jan).is("12");
});

test("`%G` will return the year with the century", function () {
  formatting("{:%G}").provided(jan).is("2011");
  formatting("{:%G}").provided(mar).is("2012");
});

test("`%g` will return the year without the century", function () {
  formatting("{:%g}").provided(jan).is("11");
  formatting("{:%g}").provided(mar).is("12");
});


// Month
test("`%b` will return the abbreviated month of the year", function () {
  formatting("{:%b}").provided(jan).is("Jan");
  formatting("{:%b}").provided(feb).is("Feb");
  formatting("{:%b}").provided(mar).is("Mar");
  formatting("{:%b}").provided(apr).is("Apr");
  formatting("{:%b}").provided(may).is("May");
  formatting("{:%b}").provided(jun).is("Jun");
  formatting("{:%b}").provided(jul).is("Jul");
  formatting("{:%b}").provided(aug).is("Aug");
  formatting("{:%b}").provided(sep).is("Sep");
  formatting("{:%b}").provided(oct).is("Oct");
  formatting("{:%b}").provided(nov).is("Nov");
  formatting("{:%b}").provided(dec).is("Dec");
});

test("`%B` will return the full month of the year", function () {
  formatting("{:%B}").provided(jan).is("January");
  formatting("{:%B}").provided(feb).is("February");
  formatting("{:%B}").provided(mar).is("March");
  formatting("{:%B}").provided(apr).is("April");
  formatting("{:%B}").provided(may).is("May");
  formatting("{:%B}").provided(jun).is("June");
  formatting("{:%B}").provided(jul).is("July");
  formatting("{:%B}").provided(aug).is("August");
  formatting("{:%B}").provided(sep).is("September");
  formatting("{:%B}").provided(oct).is("October");
  formatting("{:%B}").provided(nov).is("November");
  formatting("{:%B}").provided(dec).is("December");
});

test("`%m` will return the month of the year as a number", function () {
  formatting("{:%m}").provided(jan).is("01");
  formatting("{:%m}").provided(feb).is("02");
  formatting("{:%m}").provided(mar).is("03");
  formatting("{:%m}").provided(apr).is("04");
  formatting("{:%m}").provided(may).is("05");
  formatting("{:%m}").provided(jun).is("06");
  formatting("{:%m}").provided(jul).is("07");
  formatting("{:%m}").provided(aug).is("08");
  formatting("{:%m}").provided(sep).is("09");
  formatting("{:%m}").provided(oct).is("10");
  formatting("{:%m}").provided(nov).is("11");
  formatting("{:%m}").provided(dec).is("12");
});

// Week
test("`%U` will return the week of the year (starting with the first Sunday)", function () {
  formatting("{:%U}").provided(jan).is("01");
  formatting("{:%U}").provided(mar).is("10");
  formatting("{:%U}").provided(jul).is("27");
  formatting("{:%U}").provided(apr).is("14");
  formatting("{:%U}").provided(feb).is("05");
  formatting("{:%U}").provided(may).is("20");
  formatting("{:%U}").provided(jun).is("23");
});

test("`%W` will return the week of the year (starting with the first Monday)", function () {
  formatting("{:%W}").provided(jan).is("00");
  formatting("{:%W}").provided(mar).is("10");
  formatting("{:%W}").provided(jul).is("27");
  formatting("{:%W}").provided(apr).is("14");
  formatting("{:%W}").provided(feb).is("05");
  formatting("{:%W}").provided(may).is("20");
  formatting("{:%W}").provided(jun).is("23");
});

test("`%V` will return the week of the year (according to ISO 8061)", function () {
  formatting("{:%V}").provided(jan).is("52");
  formatting("{:%V}").provided(mar).is("10");
  formatting("{:%V}").provided(jul).is("27");
  formatting("{:%V}").provided(apr).is("14");
  formatting("{:%V}").provided(feb).is("05");
  formatting("{:%V}").provided(may).is("20");
  formatting("{:%V}").provided(jun).is("23");
});

// Day of the year / month
test("`%j` will return the day of the year", function () {
  formatting("{:%j}").provided(jan).is("001");
  formatting("{:%j}").provided(feb).is("033");
  formatting("{:%j}").provided(mar).is("065");
  formatting("{:%j}").provided(apr).is("095");
  formatting("{:%j}").provided(may).is("139");
  formatting("{:%j}").provided(jun).is("161");
  formatting("{:%j}").provided(jul).is("184");
  formatting("{:%j}").provided(aug).is("231");
  formatting("{:%j}").provided(sep).is("254");
  formatting("{:%j}").provided(oct).is("300");
  formatting("{:%j}").provided(nov).is("312");
  formatting("{:%j}").provided(dec).is("366");
});

test("`%d` will return the day of the month", function () {
  formatting("{:%d}").provided(jan).is("01");
  formatting("{:%d}").provided(feb).is("02");
  formatting("{:%d}").provided(mar).is("05");
  formatting("{:%d}").provided(apr).is("04");
  formatting("{:%d}").provided(may).is("18");
  formatting("{:%d}").provided(jun).is("09");
  formatting("{:%d}").provided(jul).is("03");
  formatting("{:%d}").provided(aug).is("18");
  formatting("{:%d}").provided(sep).is("10");
  formatting("{:%d}").provided(oct).is("26");
  formatting("{:%d}").provided(nov).is("07");
  formatting("{:%d}").provided(dec).is("31");
});

test("`%h` is equivalent to `%d`", function () {
  formatting("{:%h}").provided(jan).is("01");
  formatting("{:%h}").provided(feb).is("02");
  formatting("{:%h}").provided(mar).is("05");
  formatting("{:%h}").provided(apr).is("04");
  formatting("{:%h}").provided(may).is("18");
  formatting("{:%h}").provided(jun).is("09");
  formatting("{:%h}").provided(jul).is("03");
  formatting("{:%h}").provided(aug).is("18");
  formatting("{:%h}").provided(sep).is("10");
  formatting("{:%h}").provided(oct).is("26");
  formatting("{:%h}").provided(nov).is("07");
  formatting("{:%h}").provided(dec).is("31");
});

test("`%e` will return the day of the month (with space-padding)", function () {
  formatting("{:%e}").provided(jan).is(" 1");
  formatting("{:%e}").provided(feb).is(" 2");
  formatting("{:%e}").provided(mar).is(" 5");
  formatting("{:%e}").provided(apr).is(" 4");
  formatting("{:%e}").provided(may).is("18");
  formatting("{:%e}").provided(jun).is(" 9");
  formatting("{:%e}").provided(jul).is(" 3");
  formatting("{:%e}").provided(aug).is("18");
  formatting("{:%e}").provided(sep).is("10");
  formatting("{:%e}").provided(oct).is("26");
  formatting("{:%e}").provided(nov).is(" 7");
  formatting("{:%e}").provided(dec).is("31");
});

// Day of the week
test("`%a` will return the abbreviated day of the week", function () {
  formatting("{:%a}").provided(jan).is("Sun");
  formatting("{:%a}").provided(mar).is("Mon");
  formatting("{:%a}").provided(jul).is("Tue");
  formatting("{:%a}").provided(apr).is("Wed");
  formatting("{:%a}").provided(feb).is("Thu");
  formatting("{:%a}").provided(may).is("Fri");
  formatting("{:%a}").provided(jun).is("Sat");
});

test("`%A` will return the full day of the week", function () {
  formatting("{:%A}").provided(jan).is("Sunday");
  formatting("{:%A}").provided(mar).is("Monday");
  formatting("{:%A}").provided(jul).is("Tuesday");
  formatting("{:%A}").provided(apr).is("Wednesday");
  formatting("{:%A}").provided(feb).is("Thursday");
  formatting("{:%A}").provided(may).is("Friday");
  formatting("{:%A}").provided(jun).is("Saturday");
});

test("`%u` will return the day of the week (starting on Sunday, from 1)", function () {
  formatting("{:%u}").provided(jan).is("7");
  formatting("{:%u}").provided(mar).is("1");
  formatting("{:%u}").provided(jul).is("2");
  formatting("{:%u}").provided(apr).is("3");
  formatting("{:%u}").provided(feb).is("4");
  formatting("{:%u}").provided(may).is("5");
  formatting("{:%u}").provided(jun).is("6");
});

test("`%w` will return the day of the week (starting on Sunday, from 0)", function () {
  formatting("{:%w}").provided(jan).is("0");
  formatting("{:%w}").provided(mar).is("1");
  formatting("{:%w}").provided(jul).is("2");
  formatting("{:%w}").provided(apr).is("3");
  formatting("{:%w}").provided(feb).is("4");
  formatting("{:%w}").provided(may).is("5");
  formatting("{:%w}").provided(jun).is("6");
});

// Hour, minute, second
test("`%H` will return the hour of the day (in 24hr format)", function () {
  formatting("{:%H}").provided(jan).is("01");
  formatting("{:%H}").provided(feb).is("11");
  formatting("{:%H}").provided(mar).is("21");
  formatting("{:%H}").provided(apr).is("21");
  formatting("{:%H}").provided(may).is("21");
  formatting("{:%H}").provided(jun).is("21");
  formatting("{:%H}").provided(jul).is("00");
  formatting("{:%H}").provided(aug).is("07");
  formatting("{:%H}").provided(sep).is("11");
  formatting("{:%H}").provided(oct).is("18");
  formatting("{:%H}").provided(nov).is("07");
  formatting("{:%H}").provided(dec).is("19");
});

test("`%I` will return the hour of the day (in 12hr format)", function () {
  formatting("{:%I}").provided(jan).is("01");
  formatting("{:%I}").provided(feb).is("11");
  formatting("{:%I}").provided(mar).is("09");
  formatting("{:%I}").provided(apr).is("09");
  formatting("{:%I}").provided(may).is("09");
  formatting("{:%I}").provided(jun).is("09");
  formatting("{:%I}").provided(jul).is("00");
  formatting("{:%I}").provided(aug).is("07");
  formatting("{:%I}").provided(sep).is("11");
  formatting("{:%I}").provided(oct).is("06");
  formatting("{:%I}").provided(nov).is("07");
  formatting("{:%I}").provided(dec).is("07");
});

test("`%M` will return the minute of the hour", function () {
  formatting("{:%M}").provided(jan).is("40");
  formatting("{:%M}").provided(feb).is("26");
  formatting("{:%M}").provided(mar).is("13");
  formatting("{:%M}").provided(apr).is("40");
  formatting("{:%M}").provided(may).is("13");
  formatting("{:%M}").provided(jun).is("00");
  formatting("{:%M}").provided(jul).is("33");
  formatting("{:%M}").provided(aug).is("40");
  formatting("{:%M}").provided(sep).is("13");
  formatting("{:%M}").provided(oct).is("20");
  formatting("{:%M}").provided(nov).is("06");
  formatting("{:%M}").provided(dec).is("26");
});

test("`%S` will return the seconds of the minute", function () {
  formatting("{:%S}").provided(jan).is("00");
  formatting("{:%S}").provided(feb).is("40");
  formatting("{:%S}").provided(mar).is("20");
  formatting("{:%S}").provided(apr).is("00");
  formatting("{:%S}").provided(may).is("20");
  formatting("{:%S}").provided(jun).is("00");
  formatting("{:%S}").provided(jul).is("20");
  formatting("{:%S}").provided(aug).is("00");
  formatting("{:%S}").provided(sep).is("20");
  formatting("{:%S}").provided(oct).is("00");
  formatting("{:%S}").provided(nov).is("40");
  formatting("{:%S}").provided(dec).is("40");
});

// Other
test("`%c` will return the local time", function () {
  formatting("{:%c}").provided(jan).is("Sun Jan  1 01:40:00 2012");
  formatting("{:%c}").provided(dec).is("Mon Dec 31 19:26:40 2012");
});

test("`%x` will return the date as a local date string", function () {
  formatting("{:%x}").provided(jan).is(jan.toLocaleDateString());
});

test("`%X` will return the date as a local time string", function () {
  formatting("{:%X}").provided(jan).is(jan.toLocaleTimeString());
});

test("`%D` is equivalent to `%m/%d/%y`", function () {
  formatting("{:%D}").provided(jan).is(Formatter.format("{:%m/%d/%y}", jan));
});

test("`%F` is equivalent to `%Y-%m-%d`", function () {
  formatting("{:%F}").provided(jan).is(Formatter.format("{:%Y-%m-%d}", jan));
});

test("`%r` is equivalent to `%I:%M:%S %p`", function () {
  formatting("{:%r}").provided(jan).is(Formatter.format("{:%I:%M:%S %p}", jan));
});

test("`%R` is equivalent to `%H:%M`", function () {
  formatting("{:%R}").provided(jan).is(Formatter.format("{:%R}", jan));
});

test("`%T` is equivalent to `%H:%M:%S`", function () {
  formatting("{:%T}").provided(jan).is(Formatter.format("{:%H:%M:%S}", jan));
});

test("`%p` will return the meridian indicator", function () {
  formatting("{:%p}").provided(jan).is("AM");
  formatting("{:%p}").provided(feb).is("AM");
  formatting("{:%p}").provided(mar).is("PM");
  formatting("{:%p}").provided(apr).is("PM");
  formatting("{:%p}").provided(may).is("PM");
  formatting("{:%p}").provided(jun).is("PM");
  formatting("{:%p}").provided(jul).is("AM");
  formatting("{:%p}").provided(aug).is("AM");
  formatting("{:%p}").provided(sep).is("AM");
  formatting("{:%p}").provided(oct).is("PM");
  formatting("{:%p}").provided(nov).is("AM");
  formatting("{:%p}").provided(dec).is("PM");
});
