require('./core');
require('./compiler');

var fmt = Formatter.format,
    T = Formatter.compile("{:02}");

var floor = Math.floor,
    ceil = Math.ceil;
function weekOfYear(date, startsOnMonday, iso8061) {
  var doy = dayOfYear(date),
      dow = dayOfWeek(date, startsOnMonday);

  // ISO 8061 specification
  if (iso8061) {
    var woy = weekOfYear(date, true),
        jan1      = new Date(date.getFullYear(), 0, 1),
        dec31     = new Date(date.getFullYear(), 11, 31),
        lastJan1  = new Date(date.getFullYear() - 1, 0, 1),
        lastDec31 = new Date(date.getFullYear() - 1, 11, 31),
        jan1Day   = jan1.getDay();

    // Does it include January 4th and the first Thursday of the year?
    date = woy + (jan1Day > 4 || jan1Day <= 1 ? 0 : 1);
    if (date === 53 && dec31.getDay() < 4) {
      date = 1;
    } else if (date === 0) {
      jan1Day = lastJan1.getDay();
      date = weekOfYear(lastDec31, true) +
        (jan1Day > 4 || jan1Day <= 1 ? 0 : 1);
    }
    return date;
  }

  return startsOnMonday ?
    floor((doy + 7 - dow) / 7) :
    ceil((doy + 6 - dow) / 7);
}

function dayOfWeek(date, iso8061) {
  var day = date.getDay();
  return iso8061 ?
    (day + 6) % 7 + 1 :
    day;
}

function dayOfYear(date) {
  var jan1 = new Date(date.getFullYear(), 0, 1);
  return ceil((date - jan1) / 86400000);
}

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
Date.prototype.toFormat = function (spec) {
  var buffer = [], i = 0,
      chr = '', prev = '',
      result = '',
      value = this,
      day = Formatter.Date.days[value.getDay()],
      month = Formatter.Date.months[value.getMonth()];

  for (; i < spec.length; i += 1) {
    chr = spec.charAt(i);
    if (prev === '%') {
      switch (chr) {
      case 'n':
        result = '\n';
        break;
      case 't':
        result = '\t';
        break;

      // Year
      case 'Y':
        result = value.getFullYear();
        break;
      case 'y':
        result = T([value.getYear() % 100]);
        break;
      case 'G':
      case 'g':
        result = value.getFullYear();
        var vWeek = weekOfYear(value, true, true),
            wWeek = weekOfYear(value, true);
        if (wWeek > vWeek) {
          result++;
        } else if (wWeek === 0 && vWeek >= 52) {
          result--;
        }

        if (chr === 'g') {
          result = floor(result % 100);
        }
        break;

      // Month
      case 'b':
        result = month.slice(0, 3);
        break;
      case 'B':
        result = month;
        break;
      case 'm':
        result = T([value.getMonth() + 1]);
        break;

      // Week
      case 'U':
        result = T([weekOfYear(value)]);
        break;
      case 'W':
        // Monday as the first day of the week
        result = T([weekOfYear(value, true)]);
        break;
      case 'V':
        result = T([weekOfYear(value, true, true)]);
        break;

      // Day of the year / month
      case 'j':
        result = fmt("{:03}", dayOfYear(value));
        break;
      case 'd':
      case 'h':
        result = T([value.getDate()]);
        break;
      case 'e':
        result = fmt("{: >2}", value.getDate());
        break;

      // Day of the week
      case 'a':
        result = day.slice(0, 3);
        break;
      case 'A':
        result = day;
        break;
      case 'u':
        result = dayOfWeek(value, true);
        break;
      case 'w':
        result = dayOfWeek(value);
        break;

      // Hour, minute, second
      case 'H':
        result = T([value.getHours()]);
        break;
      case 'I':
        result = T([value.getHours() % 12]);
        break;
      case 'M':
        result = T([value.getMinutes()]);
        break;
      case 'S':
        result = T([value.getSeconds()]);
        break;

      // Other
      case 'c':
        result = fmt("{:%a %b %e %T %Y}", value);
        break;
      case 'x':
        result = value.toLocaleDateString();
        break;
      case 'X':
        result = value.toLocaleTimeString();
        break;
      case 'D':
        result = fmt("{:%m/%d/%y}", value);
        break;
      case 'F':
        result = fmt("{:%Y-%m-%d}", value);
        break;
      case 'r':
        result = fmt("{:%I:%M:%S %p}", value);
        break;
      case 'R':
        result = fmt("{:%H:%M}", value);
        break;
      case 'T':
        result = fmt("{:%H:%M:%S}", value);
        break;
      case 'p':
        result = value.getHours() > 11 ? "PM" : "AM";
        break;
      case 'z':
        var offset  = value.getTimezoneOffset();
        offset = floor(offset / 60) * 100 + Math.abs(offset % 60);
        result = fmt("{:+04}", offset * -1);
        break;
      case 'Z':
        result = '';
        break;
      default:
        result = chr;
      }
      buffer.push(result);
    } else if (chr !== '%') {
      buffer.push(chr);
    }

    prev = chr;
  }
  return buffer.join('');
};

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
