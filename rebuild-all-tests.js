/**
 * Module dependencies.
 */

var stylus = require('stylus');
var fs = require('fs');
var postcss = require('postcss');
var autoprefixer = require('autoprefixer');
var glob = require('glob');
var whatToTest = process.env.npm_package_config_whatToTest || '**';

// test cases

glob.sync("./lib/*/" + whatToTest + "/tests/*.styl").forEach(function(test){
  var name = test.replace(/\.?[\/]/g, ' ').replace(' tests',':').replace('.styl','');

  var style = stylus('@require "index.styl"; @require "' + test + '"');
  style.render(function(err, css){
    if (err) throw err;

    var result = postcss()
        .use( autoprefixer({browsers: ['last 2 versions', 'ios 5', 'ie 9', 'fx 28', 'fx 21']}).postcss )
        .process(css);

    result.root.eachRule(function (rule) {
        // Insert an extra newline before each non-first rule
        if (rule.parent.rules[0] !== rule) {
            rule.before = '\n\n';
        }
    });

    css = result.css;
    // var css = postcss.parse(fs.readFileSync('test.css'));


    fs.writeFileSync(test.replace('.styl', '.css'), css);
  });
});

