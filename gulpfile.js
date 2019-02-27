var gulp = require('gulp');
var gm = require('gulp-gm');
var tailwindcss = require('tailwindcss');
var postcss = require('gulp-postcss');
var postcssimport = require('postcss-import');
var postcssnesting = require('postcss-nesting');
var purify = require('gulp-purifycss');
var autoprefix = require('gulp-autoprefixer');


/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Statamic theme. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

 gulp.task('css', function () {
   return gulp.src('postcss/main.css')
     .pipe(postcss([
       postcssimport(),
       postcssnesting(),
       tailwindcss('tailwind.js'),
       require('autoprefixer')
     ]))
     .pipe(gulp.dest('css'));
 });

gulp.task('purify', function(){
  return gulp.src('css/main.css')
    .pipe(purify(['*.html'],{rejected:true,minify:true}))
    .pipe(autoprefix())
    .pipe(gulp.dest('css/dist'));
});
