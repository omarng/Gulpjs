// Initialize modules
const gulp = require('gulp');
// const {src, dest, watch, series, parallel} = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const lbInclude = require('gulp-lb-include');
const rimraf = require('rimraf');

// File path variables
const files = {
    scssPath: 'src/scss/**/*.scss',
    jsPath: 'src/js/**/*.js'
}
// Sass task
function scssTask() {
    return gulp.src(files.scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/resource/css'));
}

// JS task
function jsTask() {
    return gulp.src(files.jsPath)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/resource/js'));
}

// lbInclude task
function includeTask() {
    return gulp.src('src/html/**/*.html')
        .pipe(lbInclude())
        .pipe(gulp.dest('dist/'));
}

// Cachebusting task
const cbString = new Date().getTime();
function cacheBustTask(){
    return gulp.src(['dist/index.html'])
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(gulp.dest('./dist/'));
}

// Watch task
function watchTask() {
    gulp.watch([files.scssPath, files.jsPath],
        gulp.parallel(scssTask, jsTask));
}

// Custom task
function cleanTask() {
    rimraf("dist/component", function(){
        console.log("folder deleted successfully")
    })
    return Promise.resolve();
}

// Default task
exports.default = gulp.series(
    gulp.parallel(scssTask, jsTask),
    includeTask,
    cacheBustTask,
    cleanTask
);

// Build with watch mode
exports.watch = gulp.series(
    gulp.parallel(scssTask, jsTask),
    includeTask,
    cacheBustTask,
    cleanTask,
    watchTask
);