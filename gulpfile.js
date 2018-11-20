var gulp = require("gulp");
var ts = require("gulp-typescript");
var cucumber = require("gulp-cucumber");
var reporter = require("cucumber-html-reporter");
var clean = require("gulp-clean");

/* delete the "report" directory first */
gulp.task('clean', function(){
    return gulp.src('report/**', {read:false})
       .pipe(clean());
});

/* create the "report" directory */
gulp.task('directories', ['clean'], function(){
    return gulp.src('*.*', {read : false})
        .pipe(gulp.dest('./report'))
});

/* transpile typescript */
gulp.task("ts", ['directories'], function(){
    var tsResult = gulp.src("src/**/*.ts")
           .pipe(ts({
               target : "es6",
               strict : true,
               module : "commonjs",
               strictPropertyInitialization : false,
               esModuleInterop : true
           }))
    
    return tsResult.js.pipe(gulp.dest("gtranspiled"));
});

/* cucumber */
gulp.task('cucumber', ['ts'], function(){
    return gulp.src('src/features/**/*.feature').pipe(cucumber({
        'steps' : 'gtranspiled/step_definitions/**/*.js',
        'format' : 'json:report/cucumber_report.json' 
    })) 
});

/* make the report */
gulp.task('cucureport', ['cucumber'], function(){
    
    return gulp.src('report/cucumber_report.json').pipe(reporter.generate({
        theme : 'bootstrap',
        jsonFile : 'report/cucumber_report.json',
        output : 'report/cucumber_report.html',
        name : 'starting up in gulp'
    }))
})


gulp.task('default', [ 'clean', 'directories', 'ts', 'cucumber', 'cucureport']);