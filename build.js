/**
 * Simple Build Script for NASjs
 * No external dependencies required!
 */

const fs = require('fs');
const path = require('path');

console.log('🔨 Building NASjs...\n');

// Create dist folder if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
  console.log('✅ Created dist/ folder');
}

// Simple JavaScript minification
function minifyJS(code) {
  return code
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove single-line comments (but keep URLs)
    .replace(/([^:]|^)\/\/.*$/gm, '$1')
    // Remove multiple spaces
    .replace(/\s+/g, ' ')
    // Remove spaces around special characters
    .replace(/\s*([{}();,:])\s*/g, '$1')
    // Remove spaces around operators
    .replace(/\s*([\+\-\*\/\=\<\>])\s*/g, '$1')
    .trim();
}

// Simple CSS minification
function minifyCSS(code) {
  return code
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove multiple spaces and newlines
    .replace(/\s+/g, ' ')
    // Remove spaces around special characters
    .replace(/\s*([{}:;,>~\+])\s*/g, '$1')
    // Remove last semicolon in blocks
    .replace(/;\}/g, '}')
    // Remove spaces after colons
    .replace(/:\s+/g, ':')
    .trim();
}

try {
  // Check if source files exist
  if (!fs.existsSync('src/nasjs.js')) {
    console.error('❌ Error: src/nasjs.js not found!');
    console.log('💡 Make sure you have a src/ folder with nasjs.js file');
    process.exit(1);
  }

  if (!fs.existsSync('src/nasjs.css')) {
    console.error('❌ Error: src/nasjs.css not found!');
    console.log('💡 Make sure you have a src/ folder with nasjs.css file');
    process.exit(1);
  }


  // Read source files
  console.log('📖 Reading source files...');
  const js = fs.readFileSync('src/nasjs.js', 'utf8');
  const css = fs.readFileSync('src/nasjs.css', 'utf8');

  // Get original sizes
  const jsSize = (js.length / 1024).toFixed(2);
  const cssSize = (css.length / 1024).toFixed(2);

  // Minify
  console.log('⚡ Minifying...');
  const minifiedJS = minifyJS(js);
  const minifiedCSS = minifyCSS(css);

  // Get minified sizes
  const minJsSize = (minifiedJS.length / 1024).toFixed(2);
  const minCssSize = (minifiedCSS.length / 1024).toFixed(2);

  // Write minified files
  fs.writeFileSync('dist/nasjs.min.js', minifiedJS);
  fs.writeFileSync('dist/nasjs.min.css', minifiedCSS);

  // Also copy source files to dist for development
  fs.writeFileSync('dist/nasjs.js', js);
  fs.writeFileSync('dist/nasjs.css', css);

  // Calculate savings
  const jsSavings = ((1 - minifiedJS.length / js.length) * 100).toFixed(1);
  const cssSavings = ((1 - minifiedCSS.length / css.length) * 100).toFixed(1);
  const totalSavings = ((1 - (minifiedJS.length + minifiedCSS.length) / (js.length + css.length)) * 100).toFixed(1);

  // Success message
  console.log('\n✅ Build complete!\n');
  console.log('📦 Output:');
  console.log(`   dist/nasjs.min.js     ${minJsSize} KB (${jsSavings}% smaller)`);
  console.log(`   dist/nasjs.min.css    ${minCssSize} KB (${cssSavings}% smaller)`);
  console.log(`   dist/nasjs.js         ${jsSize} KB (source)`);
  console.log(`   dist/nasjs.css        ${cssSize} KB (source)`);
  console.log(`\n💾 Total minified size: ${(parseFloat(minJsSize) + parseFloat(minCssSize)).toFixed(2)} KB`);
  console.log(`📉 Overall size reduction: ${totalSavings}%\n`);
  console.log('🎉 Ready to publish!');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}