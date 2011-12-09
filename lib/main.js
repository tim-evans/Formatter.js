require('formatter/core');
require('formatter/compiler');
require('formatter/string');

// Browser
if (typeof window !== "undefined") {
  window.Formatter = Formatter;
// Node
} else if ("module" in this) {
  module.exports = Formatter;
}
