/// <binding AfterBuild='clean, cleanAssets, min, minAssets' />
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

paths.psJs = paths.webroot + "psApp/**/*.js";
paths.psCss = paths.webroot + "psApp/**/*.css";
paths.concatJsDest = paths.webroot + "dist/mm.js";
paths.concatCssDest = paths.webroot + "dist/mm.css";

paths.assetsJs = paths.webroot + "assets/**/*.js";
paths.assetsCss = paths.webroot + "assets/**/*.css";

gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("min:js", function () {
    return gulp.src([paths.psJs], { base: "." })
        .pipe(ngAnnotate())
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:css", function () {
    return gulp.src([paths.psCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("min", ["min:js", "min:css"]);

gulp.task("cleanAssets", function (cb) {
    rimraf(paths.webroot + "/assetsDist", cb);
});

gulp.task("minAssets:js", function () {
    return gulp.src([paths.assetsJs])
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest(paths.webroot + "/assetsDist"));
});

gulp.task("minAssets:css", function () {
    return gulp.src([paths.assetsCss])
        .pipe(cssmin())
        .pipe(gulp.dest(paths.webroot + "/assetsDist"));
});

gulp.task("minAssets", ["minAssets:js", "minAssets:css"]);