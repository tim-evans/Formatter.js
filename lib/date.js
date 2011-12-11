require('formatter/core');
require('formatter/compiler');

var fmt = Formatter.format,
    T = Formatter.compile("{:02}");

/** @function
  @desc
  Date Formatting support (for use with `format`).

  The following flags are acceptable in a format string:

   - `a` The abbreviated weekday name ("Sun")
   - `A` The full weekday name ("Sunday")
   - `b` The abbreviated month name ("Jan")
   - `B` The full month name ("January")
   - `c` The preferred local date and time representation
   - `d` Day of the month (01..31)
   - `H` Hour of the day, 24-hour clock (00..23)
   - `I` Hour of the day, 12-hour clock (01..12)
   - `j` Day of the year (001..366)
   - `m` Month of the year (01..12)
   - `M` Minute of the hour (00..59)
   - `p` Meridian indicator ("AM" or "PM")
   - `S` Second of the minute (00..60)
   - `U` Week number of the current year, starting with the first Sunday as the first day of the first week (00..53)
   - `W` Week number of the current year, starting with the first Monday as the first day of the first week (00..53)
   - `w` Day of the week (Sunday is 0, 0..6)
   - `x` Preferred representation for the date alone, no time
   - `X` Preferred representation for the time alone, no date
   - `y` Year without a century (00..99)
   - `Y` Year with century

  For example:

      alert("Today is {:A, B d, Y}.".format(new Date()));

      alert("The time is: {:c}.".format(new Date()));

  Note: all times used with `format` are **not** in UTC time.

  @param {String} spec The specifier to transform the date to a formatted string.
  @returns {String} The Date transformed into a string as specified.
 */
Formatter.addHelper(Date, function (value, spec) {
  var result = [], i = 0,
      day = Formatter.days[value.getDay()],
      month = Formatter.months[value.getMonth()];

  for (; i < spec.length; i += 1) {
    switch (spec.charAt(i)) {
    case 'a':
      result[result.length] = day.slice(0, 3);
      break;
    case 'A':
      result[result.length] = day;
      break;
    case 'b':
      result[result.length] = month.slice(0, 3);
      break;
    case 'B':
      result[result.length] = month;
      break;
    case 'c':
      result[result.length] = fmt("{0:a b} {1:2} {0:H:M:S Y}", value, value.getDate());
      break;
    case 'd':
      result[result.length] = T(value.getDate());
      break;
    case 'H':
      result[result.length] = T(value.getHours());
      break;
    case 'I':
      result[result.length] = T(value.getHours() % 12);
      break;
    case 'j':
      result[result.length] = fmt("{:03}",
                                  Math.ceil((value - new Date(value.getFullYear(), 0, 1)) / 86400000));
        break;
    case 'm':
      result[result.length] = T(value.getMonth() + 1);
      break;
    case 'M':
      result[result.length] = T(value.getMinutes());
      break;
    case 'p':
      result[result.length] = value.getHours() > 11 ? "PM" : "AM";
      break;
    case 'S':
      result[result.length] = T(value.getSeconds());
      break;
    case 'U':
        // Monday as the first day of the week
      day = ((value.getDay() + 6) % 7) + 1;
      result[result.length] = T(
        Math.ceil((((value - new Date(value.getFullYear(), 0, 1)) / 86400000) + day) / 7) - 1);
      break;
    case 'w':
      result[result.length] = value.getDay();
      break;
    case 'W':
      result[result.length] = T(
        Math.ceil((((value - new Date(value.getFullYear(), 0, 1)) / 86400000) + value.getDay() + 1) / 7) - 1);
      break;
      case 'x':
      result[result.length] = fmt("{:m/d/y}", value);
      break;
    case 'X':
      result[result.length] = value.toLocaleTimeString();
      break;
    case 'y':
      result[result.length] = T(value.getYear() % 100);
      break;
    case 'Y':
        result[result.length] = value.getFullYear();
      break;
    default:
      result[result.length] = spec.charAt(i);
    }
  }
  return result.join('');
});

Formatter.Date = {

  /**
    Strings for the days of the week, starting
    with `'Sunday'`.

    If you want to use a different locale,
    set the `days` string to reflect the locale's.

    @type String[]
   */
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],

  /**
    Strings for the months of the year.

    If you want to use a different locale,
    set the `months` string to reflect the locale's.

    @type String[]
   */
  months: ["January", "February", "March", "April", "May", "June",
           "July", "August", "September", "October", "November", "December"]
};
