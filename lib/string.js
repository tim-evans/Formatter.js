/** @function
  @desc
  Format formats a string in the vein of Python's format,
  Ruby #{templates}, and .NET String.Format.

  To write { or } in your Strings, just double them, and
  you'll end up with a single one.

  If you have more than one argument, then you can reference
  by the argument number (which is optional on a single argument).

  If you want to tie into this, and want to specify your own
  format specifier, override toFormat on your object, and it will
  pass you in the specifier (after the colon). You return the
  string it should look like, and that's it!

  For an example of an formatting extension, look at the Date mix.
  It implements the Ruby/Python formatting specification for Dates.

  @returns {String} The formatted string.
  @example
    alert("b{0}{0}a".format('an'));
    // => "banana"

  @example
    alert("I love {pi:.{precision}}".format({ pi: 22 / 7, precision: 2 }));
    // => "I love 3.14"

  @example
    alert("The {thing.name} is {thing.desc}.".format({
      thing: {
        name: 'cake',
        desc: 'a lie'
      }
    }));
    // => "The cake is a lie."

  @example
    alert(":-{{".format());  // Double {{ or }} to escape it.
    // => ":-{"
 */
if (Formatter.ENV.EXTEND_PROTOTYPES) {
  var vformat = Formatter.vformat;
  String.prototype.format = function () {
    return vformat(this, arguments);
  };
}

var repeat = function (s, n) {
  if (s.repeat) {
    return s.repeat(n);
  }

  var result = '',
      str = s + '';
  while (--n >= 0) {
    result += str;
  }
  return result;
};

/** @function
  @desc
  Formatter for `String`s.

  Don't call this function- It's here for `Formatter.format`
  to take care of business for you.

  @param {String} spec The specifier string.
  @returns {String} The string formatted using the format specifier.
 */
String.prototype.toFormat = function (spec) {
  var match = spec.match(Formatter.FORMAT_SPECIFIER),
      align = match[1],
      fill = match[2] || ' ',
      minWidth = match[6] || 0,
      maxWidth = match[7] || null, len, before, after, value,
      length = this.length;

  if (align) {
    align = align.slice(-1);
  }

  len = Math.max(minWidth, length);
  before = len - length;
  after = 0;

  switch (align) {
  case '>':
    break;
  case '^':
    after = Math.ceil(before / 2);
    before = Math.floor(before / 2);
    break;
  default:
    after = before;
    before = 0;
    break;
  }

  value = this;
  if (maxWidth != null) {
    maxWidth = +maxWidth.slice(1);
    value = isNaN(maxWidth) ? value : value.slice(0, maxWidth);
  }

  return repeat(fill, before) + value + repeat(fill, after);
};
