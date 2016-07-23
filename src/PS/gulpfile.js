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
    webroot: "./wwwroot/",
    librariesPath: "./wwwroot/lib/"
};
paths.jquryLibraryPath = paths.librariesPath + "jquery/dist/jquery.min.js";
paths.angularLibraryPath = paths.librariesPath + "angular/angular.min.js";
paths.uiRouterLibraryPath = paths.librariesPath + "angular-ui-router/release/angular-ui-router.min.js";
paths.ngStorageLibraryPath = paths.librariesPath + "ngStorage.min.js";
paths.angularCookiesLibraryPath = paths.librariesPath + "angular-cookies/angular-cookies.min.js";
paths.uiGridLibraryPath = paths.librariesPath + "ui-grid/ui-grid.min.js";

paths.concatLibDest = paths.librariesPath + "externalLib.js";
paths.psJs = paths.webroot + "psApp/**/*.js";
paths.psCss = paths.webroot + "psApp/**/*.css";
paths.concatJsDest = paths.webroot + "dist/mm.js";
paths.concatCssDest = paths.webroot + "dist/mm.css";

paths.assetsJs = paths.webroot + "assets/**/*.js";
paths.assetsCss = paths.webroot + "assets/**/*.css";
paths.concatAssetsJsDest = "dist/assets.js";
gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});
gulp.task("clean", ["clean:js", "clean:css"]);

/* never change library path sequence*/
var libjsSrc = [
    paths.jquryLibraryPath,
    paths.angularLibraryPath,
    paths.uiRouterLibraryPath,
    paths.ngStorageLibraryPath,
    paths.angularCookiesLibraryPath,
    paths.uiGridLibraryPath
];

var jsSrc = libjsSrc.concat(paths.assetsJs).concat(paths.psJs);
gulp.task("min:js", function () {
    return gulp.src(jsSrc, { base: "." })
        .pipe(ngAnnotate())
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});
//gulp.task("min:libjs", function () {
//    return gulp.src(jsSrc)
//        .pipe(ngAnnotate())
//        .pipe(concat(paths.concatLibDest))
//        .pipe(gulp.dest("."));
//});
gulp.task("min:css", function () {
    return gulp.src([paths.psCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("min", ["min:js", "min:css"]);

//gulp.task("cleanAssets", function (cb) {
//    rimraf(paths.concatAssetsJsDest, cb);
//});

//gulp.task("cleanLib", function (cb) {
//    rimraf(paths.concatLibDest, cb);
//});
//gulp.task("minAssets:js", function () {
//    return gulp.src([paths.assetsJs])
//        .pipe(ngAnnotate())
//        .pipe(uglify())
//        .pipe(concat(paths.concatAssetsJsDest))
//        .pipe(gulp.dest(paths.webroot + "/assetsDist"));
//});
