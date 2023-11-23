module.exports = {
  printWidth: 100, // Specifies the line length that the code will wrap on if exceeded
  tabWidth: 2, // Width of the tab character
  useTabs: false, // Indent lines with spaces instead of tabs
  semi: true, // Add semicolons at the end of statements
  singleQuote: true, // Use single quotes instead of double quotes for strings
  quoteProps: 'as-needed', // Whether to quote object properties (‘as-needed’: only if necessary, 'consistent': keep consistent, 'preserve': no restrictions)
  jsxSingleQuote: false, // Use single quotes in JSX syntax
  trailingComma: 'es5', // Add trailing commas in objects and arrays
  bracketSpacing: true, // Add space inside curly braces in objects: { name: 'rose' }
  jsxBracketSameLine: false, // Place the > of a multi-line JSX element at the end of the last line instead of being alone on the next line
  arrowParens: 'always', // Always add parentheses around arrow function parameters
  requirePragma: false, // Format files without requiring a special comment
  insertPragma: false, // Do not insert a @format pragma comment in the formatted file
  proseWrap: 'preserve', // Maintain the line breaks as per the original file
  htmlWhitespaceSensitivity: 'ignore', // Ignore whitespace differences in HTML files
  endOfLine: 'auto', // Specify the line ending convention: \n for Unix-like systems, \r\n for Windows, or auto-detect
};
