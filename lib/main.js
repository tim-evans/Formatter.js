require('./core');
require('./compiler');
require('./string');
require('./number');
require('./date');

// Browser
if (typeof window !== "undefined") {
  window.Formatter = Formatter;
// Node
} else if ("module" in this) {
  module.exports = Formatter;
}
