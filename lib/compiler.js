var openingBrace = '{',
    closingBrace = '}',
    specifierSeparator = ':';

function parse(template) {
  var prev = '', ch,
      currentToken = ["", null, null],
      tokens = [currentToken],
      result, idx = 0,
      len = template.length,
      wasInField = true;

  for (; idx < len; idx++) {
    ch = template.charAt(idx);

    if (prev === closingBrace) {
      if (ch !== closingBrace) {
        throw new Error(unmatchedClosing([template, idx, '^']));

      // Double-escaped closing brace.
      } else {
        currentToken[0] += closingBrace;
        prev = '';
        continue;
      }
    }

    // Begin template parsing
    if (ch === openingBrace) {

      // Double-escaped opening brace.
      if (template.length > idx + 1 &&
          template[idx + 1] === openingBrace) {
        currentToken[0] += openingBrace;
        idx++;

      // Parse out field name and format spec
      } else {
        result = parseField(template, idx, template.slice(idx + 1));
        // Field
        currentToken[1] = result[1];
        // Specifier
        currentToken[2] = result[2];

        // Advance the tokenizer
        currentToken = ["", null, null];
        tokens[tokens.length] = currentToken;

        idx += result[0]; // continue after the template.
      }

    // Normal string processing
    } else if (ch !== closingBrace) {
      currentToken[0] += ch;
    }
    prev = ch;
  }

  // Can't end with an unclosed closing brace
  if (ch === closingBrace && template.charAt(idx - 2) !== closingBrace) {
    throw new Error(unmatchedClosing([template, idx, '^']));
  }

  return tokens;
}

function parseField(fullTemplate, fullIdx, template) {
  var idx = 0, ch, len = template.length,
      field, spec = "",
      inSpecifier = false,
      iBrace = 0,
      iSpec = 0;

  for (; idx < len; idx++) {
    ch = template.charAt(idx);

    if (!inSpecifier &&
        ch === specifierSeparator) {
      iSpec = idx;
      inSpecifier = true;
      continue;
    }

    if (ch === openingBrace) {
      iBrace++;
    } else if (ch === closingBrace) {
      iBrace--;
    }

    // Spec is done.
    if (iBrace === -1) {
      field = template.slice(0, idx);
      if (inSpecifier) {
        spec = field.slice(iSpec + 1);
        field = field.slice(0, iSpec);
      }

      return [idx + 1, field, spec];
    }
  }
  throw new Error(unmatchedOpening([fullTemplate, fullIdx + 1, '^']));
}

Formatter.parse = parse;

var cache = {};

/** @ignore */
function compile (template) {
  var fn = cache[template];

  if (!fn) {
    var body = [],
        tokens = Formatter.parse(template),
        token,
        literal, field, spec;

    for (var i = 0, len = tokens.length; i < len; i++) {
      token = tokens[i];
      literal = token[0];

      if (literal) {
        body.push('"' + literal.replace(/[^\\]"/, '\"')
                               .replace(/\n/, '\\n') + '"');
      }

      field = token[1];
      spec  = token[2];

      if (field != null) {
        field = 'Formatter.getField("' + field.replace(/[^\\]"/, '\"')
                                            .replace(/\n/, '\\n') + '",args,kwargs)';
        if (spec) {
          body.push('Formatter.formatField(' + field + ',"' + spec.replace(/[^\\]"/, '\"')
                                                                .replace(/\n/, '\\n') + '")');
        } else {
          body.push(field);
        }
      }
      
    }
    cache[template] = fn = new Function(
      'args',
      'var kwargs;if(args.length===1){kwargs=args[0];}' +
      'return ' + body.join('+') + '+"";' // Ensure everything gets coerced
    );
  }

  return fn;
};

Formatter.compile = compile;

// Errors
var baseError = "Malformed format template:\n{}\n{:->{}}\n",
    unmatchedOpening = compile(baseError + "Unmatched opening brace."),
    unmatchedClosing = compile(baseError + "Unmatched closing brace.");

Formatter.getField = function (fieldName, args, kwargs) {
  return fieldName === '' ? args.shift() :
         kwargs           ? kwargs[fieldName] :
                            args[fieldName];
};

Formatter.formatField = function (value, formatSpec) {
  return value != null && value.toFormat ?
         value.toFormat(formatSpec) :
         String(value).toFormat(formatSpec);
};
