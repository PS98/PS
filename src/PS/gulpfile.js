/// <binding />
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

paths.js = paths.webroot + "js/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.less = paths.webroot + "css/**/*.less";
paths.minLess = paths.webroot + "css/**/*.min.less";
paths.concatJsDest = paths.webroot + "js/completeJs.min.js";
paths.concatCssDest = paths.webroot + "css/completeCss.min.css";
paths.concatLessDest = paths.webroot + "css/completeLess.min.css";

gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("clean:less", function (cb) {
    rimraf(paths.concatLessDest, cb);
});

gulp.task("clean", ["clean:js", "clean:css", "clean:less"]);

gulp.task("min:js", function () {
    return gulp.src([paths.js, "!" + paths.minJs], { base: "." })
        .pipe(ngAnnotate())
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:css", function () {
    return gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task('min:less', function () {
    return gulp.src([paths.less, "!" + paths.minLess])
        .pipe(plumber())
        .pipe(concat(paths.concatLessDest))
        .pipe(less())
        .pipe(gulp.dest('.'));
});

gulp.task("min", ["min:js", "min:css", "min:less"]);

gulp.task('less:css', function () {
    return gulp.src([paths.less, "!" + paths.minLess])
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest('./wwwroot/css/'));
});

gulp.task("less", ["less:css"]);