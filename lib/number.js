/** @function
  @desc
  Formatter for `Number`s.

  @param {String} spec The specifier to format the number as.
  @returns {String} The number formatted as specified.
 */
Number.prototype.toFormat = function (spec) {
  var value = this;

  // Don't want Infinity, -Infinity and NaN in here!
  if (!isFinite(value)) {
    return value;
  }

  var match = spec.match(Formatter.FORMAT_SPECIFIER),
      align = match[1],
      fill = match[2],
      sign = match[3] || '-',
      base = !!match[4],
      minWidth = match[6] || 0,
      maxWidth = match[7],
      type = match[8], precision;

  // Constants
  var emptyString = '',
      plus = '+',
      minus = '-';

  if (align) {
    align = align.slice(-1);
  }

  if (!fill && !!match[5]) {
    fill = '0';
    if (!align) {
      align = '=';
    }
  }

  precision = maxWidth && +maxWidth.slice(1);

  switch (sign) {
  case plus:
    sign = (value >= 0) ? plus: minus;
    break;
  case minus:
    sign = (value >= 0) ? emptyString: minus;
    break;
  case ' ':
    sign = (value >= 0) ? ' ': minus;
    break;
  default:
    sign = emptyString;
  }

  if (precision != null && precision !== "" && !isNaN(precision)) {
    value = +value.toFixed(precision);
  } else {
    precision = null;
    minWidth = parseInt(minWidth, 10) - sign.length;
  }

  value = Math.abs(value);

  switch (type) {
  case 'd':
    value = Math.round(this - 0.5).toString();
    break;
  case 'b':
    base = base ? '0b' : emptyString;
    value = base + value.toString(2);
    break;
  case 'c':
    value = String.fromCharCode(value);
    break;
  case 'o':
    base = base ? '0o' : emptyString;
    value = base + value.toString(8);
    break;
  case 'x':
    base = base ? '0x' : emptyString;
    value = base + value.toString(16).toLowerCase();
    break;
  case 'X':
    base = base ? '0x' : emptyString;
    value = base + value.toString(16).toUpperCase();
    break;
  case 'e':
    value = value.toExponential().toLowerCase();
    break;
  case 'E':
    value = value.toExponential().toUpperCase();
    break;
  case 'f':
    // Follow Python's example (using 6 as the default)
    if (precision) precision++;
    value = value.toPrecision(precision || 7).toLowerCase();
    minWidth = '';
    precision = null;
    break;
  case 'F':
    // Follow Python's example (using 6 as the default)
    if (precision) precision++;
    value = value.toPrecision(precision || 7).toUpperCase();
    minWidth = '';
    precision = null;
    break;
  case 'G':
    value = String(value).toUpperCase();
    break;
  case '%':
    value = (value.toPrecision(7) * 100) + '%';
    break;
  case 'n':
    value = value.toLocaleString();
    break;
  case 's':
  case 'g':
  case emptyString:
  case void 0:
    value = String(value).toLowerCase();
    break;
  default:
    throw new Error('Unrecognized format type: "{}"'.format(type));
  }

  if (align !== '=') {
    value = sign + value;
  }

  // Clean up the leftover spec and toss it over to String.prototype.toFormat
  spec = (fill || emptyString) + (align || emptyString) + (minWidth || emptyString);
  if (precision) spec += "." + (precision + 1);
  spec += (type || emptyString);
  value = String(value).toFormat(spec);

  if (align === '=') {
    value = sign + value;
  }

  return value;
};
