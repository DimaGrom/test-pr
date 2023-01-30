const gulp = require('gulp')
const clean = require('gulp-clean')
const htmlmin = require('gulp-htmlmin')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const babel = require('gulp-babel')
const minify = require('gulp-minify')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const newer = require('gulp-newer')
const size = require('gulp-size')
const browserSync = require('browser-sync').create()
const cleanCSS = require('gulp-clean-css')


const paths = {
	html: {
		src: './src/*.html',
		dest: './dist/'
	},
	styles: {
		src: './src/css/**/*.css',
		dest: './dist/css/'
	},
	scripts: {
		src: './src/scripts/**/*.js',
		dest: './dist/js/'
	},
	images: {
		src: './src/img/**/*.**',
		dest: './dist/img/'
	}
}


function clear() {
	return gulp.src('./dist/*', {
		read: false
	})
		.pipe(clean())
}


function html() {
	return gulp.src(paths.html.src)
    .pipe(htmlmin({ 
    	collapseWhitespace: true,
    	removeComments: true
    }))
    .pipe(size())
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream())
}


function styles() {
	return gulp.src(paths.styles.src)
		.pipe(sourcemaps.init())
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(cleanCSS({
			level: 2
		}))
		.pipe(concat('main.min.css'))
		.pipe(sourcemaps.write('.'))
		.pipe(size())
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browserSync.stream())
}


function scripts() {
	return gulp.src(paths.scripts.src)
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['@babel/env']
		}))
	  .pipe(concat('main.min.js'))
	  .pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(size())
		.pipe(gulp.dest(paths.scripts.dest))
		.pipe(browserSync.stream())
}


function img() {
	return gulp.src(paths.images.src)
		.pipe(newer(paths.images.dest))
		.pipe(gulp.dest(paths.images.dest))
		.pipe(browserSync.stream())
}


const watch = () => {
	browserSync.init({
    server: "./dist/",
    port: 4000,
		notify: true
  })

  gulp.watch(paths.html.dest).on('change', browserSync.reload)

  gulp.watch(paths.html.src, html)
	gulp.watch(paths.styles.src, styles)
	gulp.watch(paths.scripts.src, scripts)
	gulp.watch(paths.images.src, img)
}


const build = gulp.series(clear, html, gulp.parallel(styles, scripts, img), watch)


exports.clear = clear
exports.html = html
exports.styles = styles
exports.scripts = scripts
exports.img = img
exports.watch = watch
exports.build = build
exports.default = build