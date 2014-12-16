'use strict';

// Gulp
var browserSync = require('browser-sync');
var concat      = require('gulp-concat');
var del         = require('del');
var fs          = require('fs');
var gulp        = require('gulp');
var jade        = require('gulp-jade');
var sass        = require('gulp-sass');
var uglify      = require('gulp-uglifyjs');

gulp.task('clean', function (done) {
    del(['build'], done);
});

gulp.task('html', function () {
    var presets = {};

    fs.readdirSync('src/presets').forEach(function (file) {
        presets[file] = fs.readFileSync('src/presets/'+ file);
    });

    gulp.src('src/favicon.ico').pipe(gulp.dest('build'));

    gulp.src('src/index.jade')
        .pipe(jade({
            locals: {
                presets: presets,
                welcome: fs.readFileSync('src/welcome.txt'),
                current: 'scales.js'
            }
        }))
        .pipe(gulp.dest('build'))
});

gulp.task('sass', ['html'], function () {
    gulp.src('src/scss/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(gulp.dest('build'));
});

gulp.task('build', ['sass'], function () {
    // Copy worker helpers
    gulp.src(['src/js/helpers.js']).pipe(uglify()).pipe(gulp.dest('build'))

    return gulp.src([
        'src/js/renderer.js',
        'src/js/shader.js',
        'src/js/app.js'
    ])
        .pipe(uglify('app.js'))
        .pipe(gulp.dest('build'))
});

gulp.task('vendor', function () {
    gulp.src([
        'bower_components/jquery/dist/jquery.js',
        'bower_components/lodash/dist/lodash.js',
        'bower_components/dat-gui/build/dat.gui.js',
        'bower_components/catiline/dist/catiline.js',
        'bower_components/ace-builds/src-noconflict/ace.js',
        'bower_components/ace-builds/src-noconflict/mode-javascript.js',
        'bower_components/ace-builds/src-noconflict/theme-solarized_light.js',
    ])
        .pipe(uglify('vendors.js'))
        .pipe(gulp.dest('build'))

    gulp.src(['bower_components/ace-builds/src-noconflict/worker-javascript.js'])
        .pipe(uglify('worker-javascript.js'))
        .pipe(gulp.dest('build'))
});

gulp.task('deploy', ['clean', 'build', 'vendor'], function () {
});

gulp.task('reload', ['build'], function () {
    browserSync.reload();
});

gulp.task('serve', function () {
    browserSync({
        notify: false,
        server: {
            baseDir: 'build'
        }
    });
});

gulp.task('watch', function () {
    gulp.watch(['src/**/*'], ['reload']);
});

gulp.task('default', ['clean', 'build', 'vendor', 'serve', 'watch']);
