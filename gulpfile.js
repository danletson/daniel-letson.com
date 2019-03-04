const gulp = require('gulp');
const imageResize = require('gulp-image-resize');
const tailwindcss = require('tailwindcss');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const postcssimport = require('postcss-import');
const postcssnesting = require('postcss-nesting');
const purify = require('gulp-purifycss');
const autoprefix = require('gulp-autoprefixer');


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

function resize(cb) {
  [800,1500].forEach(function (size) {
    gulp.src('img/*.{jpg,jpeg,png}')
      .pipe(imageResize({
        width: size,
        upscale: false,
        interlace: true
      }))
      .pipe(imagemin())
      .pipe(webp())
      .pipe(gulp.dest('img/dist/'+ size +'/'))
  });
  cb();
}

gulp.task('resize', resize);

gulp.task('purify', function(){
  return gulp.src('css/main.css')
    .pipe(purify(['projects/index.html','resume/index.html','index.html'],{rejected:true,minify:true}))
    .pipe(autoprefix())
    .pipe(gulp.dest('css/dist'));
});
