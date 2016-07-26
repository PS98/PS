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

paths.concatLibDest = paths.webroot + "dist/externalLib.js";
paths.psJs = paths.webroot + "psApp/**/*.js";
paths.assetsJs = paths.webroot + "assets/**/*.js";

paths.concatJsDest = paths.webroot + "dist/mm.js";
paths.concatCssDest = paths.webroot + "dist/css/mm.css";
paths.assetsCssDest = paths.webroot + "dist/css/assets.css";
paths.concatAssetsJsDest = "dist/assets.js";

paths.psCss = paths.webroot + "psApp/**/*.css";
paths.assetsCss = paths.webroot + "assets/css/*.css";
paths.owlCarouselCss = paths.webroot + "assets/plugins/owl-carousel/**/*.css";
paths.fontAwesoneCss = paths.webroot + "assets/fonts/font-awesome/css/font-awesome.min.css";
paths.bootstrapCss = paths.webroot + "assets/plugins/bootstrap/css/bootstrap.css";
paths.sliderProCss = paths.webroot + "assets/plugins/sliderpro/css/slider-pro.css";
paths.yammCss = paths.webroot + "assets/plugins/yamm/yamm.css";
paths.animateCss = paths.webroot + "assets/plugins/animate/animate.css";
paths.jelectCss = paths.webroot + "assets/plugins/jelect/main.css";
paths.switcherCss = paths.webroot + "assets/plugins/switcher/css/switcher.css";
paths.uiGridCss = paths.webroot + "lib/ui-grid/ui-grid.min.css";

gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("clean:ExternalLibjs", function (cb) {
    rimraf(paths.webroot + "dist/css", cb);
});
gulp.task("clean", ["clean:js", "clean:css","clean:ExternalLibjs"]);

/* never change library path sequence*/
var libjsSrc = [
    paths.jquryLibraryPath,
    paths.angularLibraryPath,
    paths.uiRouterLibraryPath,
    paths.ngStorageLibraryPath,
    paths.angularCookiesLibraryPath,
    paths.uiGridLibraryPath
];

var jsSrc = [].concat(paths.assetsJs).concat(paths.psJs);
gulp.task("min:mmjs", function () {
    return gulp.src(jsSrc, { base: "." })
        .pipe(ngAnnotate())
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});
gulp.task("min:ExternalLibjs", function () {
    return gulp.src(libjsSrc, { base: "." })
        .pipe(ngAnnotate())
        .pipe(concat(paths.concatLibDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

var assestCssSrc = [paths.fontAwesoneCss];
var css = [paths.yammCss, paths.animateCss, paths.jelectCss, paths.uiGridCss];
var bootstrapSliderProCss = [paths.bootstrapCss, paths.sliderProCss];
var cssSrc = assestCssSrc.concat(paths.assetsCss).concat(bootstrapSliderProCss).concat(paths.owlCarouselCss).concat(css);
gulp.task("min:mmCss", function () {
    return gulp.src(paths.psCss)
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});
gulp.task("min", ["min:mmjs", "min:mmCss", "min:ExternalLibjs"]);


gulp.task("cleanAssets", function (cb) {
    rimraf(paths.webroot + "/assetsDist", cb);
});

gulp.task("minAssets:js", function () {
    return gulp.src([paths.assetsJs])
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(concat(paths.concatAssetsJsDest))
        .pipe(gulp.dest(paths.webroot + "/assetsDist"));
});
paths.assetsCss = paths.webroot + "assets/**/*.css";

gulp.task("minAssets:css", function () {
    return gulp.src([paths.assetsCss])
        .pipe(cssmin())
        .pipe(gulp.dest(paths.webroot + "/assetsDist"));
});

gulp.task("minAssets", ["minAssets:js", "minAssets:css"]);
