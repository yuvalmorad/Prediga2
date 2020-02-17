var gulp = require('gulp');
var gutil = require('gulp-util');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify-es').default;
var cleanCSS = require('gulp-clean-css');
var Server = require('karma').Server;

var BUILD_FOLDER = "build";

gulp.task('uglify-error-debugging', function () {
	return gulp.src('./public/index.html')
	.pipe(usemin({
		js: [ uglify()],
		inlinejs: [ uglify() ]
	}))
	.on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err); })
	.pipe(gulp.dest(BUILD_FOLDER + '/'));
});

gulp.task('buildJS', function(done) {
    return gulp.src('./public/index.html')
        .pipe(usemin({
            js: [ uglify()],
            inlinejs: [ uglify() ]
        }))
	    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err); })
        .pipe(gulp.dest(BUILD_FOLDER + '/'));

});

gulp.task('minify-css', function(done) {
    return gulp.src('./public/css/*.css')
        .pipe(cleanCSS(/*{compatibility: 'ie8'}*/))
	    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err); })
        .pipe(gulp.dest(BUILD_FOLDER + '/css'));
});

gulp.task('copyFolders', function(done){
    var foldersToCopy = ["fonts", "images", "config"];
    var res = foldersToCopy.map(function(folder){
        return gulp.src(['./public/' + folder + '/**/*'])
		    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err); })
            .pipe(gulp.dest(BUILD_FOLDER + '/' + folder));
    });

    res.push( //copy service worker
        gulp.src(['./public/sw.js'])
            .pipe(gulp.dest(BUILD_FOLDER))
    );

    done();
    return res;
});

gulp.task('default', gulp.series(gulp.parallel('buildJS', 'minify-css', 'copyFolders'), function (done) {
    // do something
    done();
}));

// Run test once and exit
gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});