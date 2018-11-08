/*
 * @Author: yangtingting 
 * @Date: 2018-11-08 08:28:24 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-11-08 08:56:12
 */

var gulp=require('gulp');
var sass=require('gulp-sass');
var uglify=require('gulp-uglify');
var babel=require('gulp-babel');
var webserver=require('gulp-webserver');
var fs=require('fs');
var path=require('path');
var url=require('url');
var data=require('./src/data/data');
gulp.task('sass',function(){
    return gulp.src('./src/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./src/css'))
})
gulp.task('change',function(){
    return gulp.watch('./src/scss/*.scss',gulp.series('sass'))
})
gulp.task('ugli',function(){
    return gulp.src('./src/js/*.js')
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./src/js/main'))
})
gulp.task('web',function(){
    gulp.src('/src')
    .pipe(webserver({
        port:'8081',
        host:'localhost',
        middleware:[function(req,res,next){
           if(req.url==='/favicon.ico'){
               req.end('');
               return;
           }
            var pathname=url.parse(req.url).pathname;
            if(/^\/api/.test(req.url)){
              if(pathname==='/api/login'){
                  res.json({data:data})
              }  
            }else{
                pathname=pathname=='/'?'index.html':pathname;
                res.end(fs.readFileSync(path.join(__dirname,'src',pathname)))
            }
        }]
    }))
})
gulp.task('dev',gulp.series('sass','ugli','web','change'));