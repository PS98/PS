/// <binding AfterBuild='clean, min' />
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require("gulp-concat");
var rimraf = require("rimraf");
var cssmin = require("gulp-cssmin");
var less = require('gulp-less');
var plumber = require('gulp-plumber');


var paths = {
    webroot: "./wwwroot/"
};

paths.extmJs = paths.webroot + "ext-modules/**/*.js";
paths.psJs = paths.webroot + "psApp/**/*.js";
paths.extmCss = paths.webroot + "ext-modules/**/*.css";
paths.psCss = paths.webroot + "psApp/**/*.css";
//paths.less = paths.webroot + "css/**/*.less";
//paths.minLess = paths.webroot + "css/**/*.min.less";
paths.concatJsDest = paths.webroot + "mm.js";
paths.concatCssDest = paths.webroot + "mm.css";
//paths.concatLessDest = paths.webroot + "mm12.min.css";

gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

//gulp.task("clean:less", function (cb) {
//    rimraf(paths.concatLessDest, cb);
//});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("min:js", function () {
    return gulp.src([paths.psJs, "!" + paths.extmJs], { base: "." })
        .pipe(ngAnnotate())
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:css", function () {
    return gulp.src([paths.psCss, "!" + paths.extmCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

//gulp.task('min:less', function () {
//    return gulp.src([paths.less, "!" + paths.minLess])
//        .pipe(plumber())
//        .pipe(concat(paths.concatLessDest))
//        .pipe(less())
//        .pipe(gulp.dest('.'));
//});

gulp.task("min", ["min:js", "min:css"]);

//gulp.task('less:css', function () {
//    return gulp.src([paths.less, "!" + paths.minLess])
//        .pipe(plumber())
//        .pipe(less())
//        .pipe(gulp.dest('./wwwroot/css/'));
//});

//gulp.task("less", ["less:css"]);