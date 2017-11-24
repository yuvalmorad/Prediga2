var gulp = require('gulp');

var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');

gulp.task('default', function() {
    gulp.start('buildJS', 'copyFolders');
});

gulp.task('buildJS', function() {
    return gulp.src('./public/index.html')
        .pipe(usemin({
            js: [ uglify()],
            inlinejs: [ uglify() ]
        }))
        .pipe(gulp.dest('build/'));
});

gulp.task('copyFolders', function(){
    var foldersToCopy = ["css", "fonts", "images"];
    var res = foldersToCopy.map(function(folder){
        return gulp.src(['./public/' + folder + '/**/*'])
            .pipe(gulp.dest('build/' + folder));
    });

    res.push(//TODO remove when server is working
        gulp.src(['./public/js/mock/*.json'])
            .pipe(gulp.dest('build/js/mock'))
    );

    return res;
});