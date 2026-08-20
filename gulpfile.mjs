// --- Imports (ESM) ---
import gulp from "gulp";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import pug from "gulp-pug";
import { deleteAsync } from "del";
import browserSyncPkg from "browser-sync";
import webp from "gulp-webp";
import ttf2woff2 from "gulp-ttf2woff2";
import concat from "gulp-concat";
import autoprefixer from "gulp-autoprefixer";
import sourcemaps from "gulp-sourcemaps";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import gcmq from "gulp-group-css-media-queries";
import formatHtml from "gulp-format-html";
import imagemin from "gulp-imagemin";
import fs from "node:fs";
import { Transform } from "node:stream";

const sass = gulpSass(dartSass);
const browserSync = browserSyncPkg.create();


// --- Paths ---
export const paths = {
  pugPages: "./src/pug/pages/**/*.pug",
  pugUi: "./src/pug/ui/**/*.pug",
  pugAll: "./src/pug/**/*.pug",

  scssEntry: "./src/scss/main.scss",
  scssAll: "./src/scss/**/*.scss",

  jsAll: "./src/js/**/*.js",

  libsAll: "./src/libs/**/*.*",

  videoDir: "./src/video",
  videoAll: "./src/video/**/*.*",

  // IMAGES
  imgsSvg: "./src/img/**/*.svg",
  imgsJpgPng: "./src/img/**/*.{jpg,jpeg,png}",
  imgsOther: [
    "./src/img/**/*",
    "!./src/img/**/*.{jpg,jpeg,png,svg}"
  ],

  // FONTS
  fontsTtf: "./src/fonts/**/*.ttf",
  fontsReady: "./src/fonts/**/*.{woff,woff2}",

  // BUILD
  build: "./build/"
};


// --- Clean ---
export const clean = () => deleteAsync(paths.build);


// --- PUG ---
export function pugPages() {
  return gulp
    .src(paths.pugPages)
    .pipe(
      plumber({
        errorHandler: notify.onError(
          "PUG error: <%= error.message %>"
        )
      })
    )
    .pipe(
      pug({
        pretty: true
      })
    )
    .pipe(formatHtml())
    .pipe(gulp.dest(paths.build))
    .pipe(browserSync.stream());
}


export function pugUi() {
  return gulp
    .src(paths.pugUi)
    .pipe(
      plumber({
        errorHandler: notify.onError(
          "PUG UI error: <%= error.message %>"
        )
      })
    )
    .pipe(
      pug({
        pretty: true
      })
    )
    .pipe(formatHtml())
    .pipe(gulp.dest(`${paths.build}/ui`))
    .pipe(browserSync.stream());
}


// --- SCSS ---
export function styles() {
  return gulp
    .src(paths.scssEntry)
    .pipe(
      plumber({
        errorHandler: notify.onError(
          "SCSS error: <%= error.message %>"
        )
      })
    )
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: "expanded"
      })
    )
    .pipe(
      autoprefixer({
        cascade: false
      })
    )
    .pipe(gcmq())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(`${paths.build}/css`))
    .pipe(browserSync.stream());
}


// --- Images ---

// В Gulp 5 бинарные файлы читаем с encoding: false.
export function imgWebp() {
  return gulp
    .src(paths.imgsJpgPng, {
      allowEmpty: true,
      encoding: false
    })
    .pipe(
      imagemin({
        verbose: true
      })
    )
    .pipe(webp())
    .pipe(gulp.dest(`${paths.build}/img`));
}


export function imgCopySvg() {
  return gulp
    .src(paths.imgsSvg, {
      allowEmpty: true,
      encoding: false
    })
    .pipe(gulp.dest(`${paths.build}/img`));
}


export function imgCopyOther() {
  return gulp
    .src(paths.imgsOther, {
      allowEmpty: true,
      encoding: false
    })
    .pipe(
      imagemin({
        verbose: true
      })
    )
    .pipe(gulp.dest(`${paths.build}/img`));
}


export const images = gulp.parallel(
  imgWebp,
  imgCopySvg,
  imgCopyOther
);


// --- Fonts ---

/*
 * Если рядом с TTF уже существует одноимённый WOFF2,
 * TTF не конвертируем.
 *
 * Например:
 *
 * Inter-Bold.ttf
 * Inter-Bold.woff2
 *
 * В build попадёт готовый Inter-Bold.woff2.
 */
function skipTtfWithExistingWoff2() {
  return new Transform({
    objectMode: true,

    transform(file, encoding, callback) {
      const woff2Path = file.path.replace(
        /\.ttf$/i,
        ".woff2"
      );

      if (fs.existsSync(woff2Path)) {
        console.log(
          `Font skipped: ${file.relative} — WOFF2 already exists`
        );

        callback();
        return;
      }

      callback(null, file);
    }
  });
}


// TTF → WOFF2
export function fontsTtf2woff2() {
  return gulp
    .src(paths.fontsTtf, {
      allowEmpty: true,
      encoding: false
    })
    .pipe(skipTtfWithExistingWoff2())
    .pipe(ttf2woff2())
    .pipe(gulp.dest(`${paths.build}/fonts`));
}


// Готовые WOFF / WOFF2 копируем без преобразований.
export function fontsCopy() {
  return gulp
    .src(paths.fontsReady, {
      allowEmpty: true,
      encoding: false
    })
    .pipe(gulp.dest(`${paths.build}/fonts`));
}


export const fonts = gulp.parallel(
  fontsTtf2woff2,
  fontsCopy
);


// --- JS ---

// Здесь encoding: false НЕ нужен.
// JS обрабатывается как текст и передаётся в concat().
export function scripts() {
  return gulp
    .src(paths.jsAll, {
      allowEmpty: true
    })
    .pipe(concat("main.js"))
    .pipe(gulp.dest(`${paths.build}/js`));
}


// --- Libs ---

// В libs потенциально могут находиться бинарные файлы,
// поэтому при простом копировании используем encoding: false.
export function copyLibs() {
  return gulp
    .src(paths.libsAll, {
      allowEmpty: true,
      encoding: false
    })
    .pipe(gulp.dest(`${paths.build}/libs`));
}


// --- Video ---

// Папка video необязательна.
export function copyVideo() {
  if (!fs.existsSync(paths.videoDir)) {
    return Promise.resolve();
  }

  return gulp
    .src(paths.videoAll, {
      allowEmpty: true,
      encoding: false
    })
    .pipe(gulp.dest(`${paths.build}/video`));
}


// --- Server ---
export function server() {
  browserSync.init({
    server: {
      baseDir: paths.build
    },
    notify: false,
    open: true
  });
}


// --- Reload helper ---
function reload(done) {
  browserSync.reload();
  done();
}


// --- Watchers ---
export function watch() {

  // PUG
  //
  // Следим за всеми pug-файлами, потому что изменение
  // layout/include тоже может изменить итоговые страницы.
  gulp.watch(
    paths.pugAll,
    gulp.parallel(pugPages, pugUi)
  );


  // SCSS
  gulp.watch(
    paths.scssAll,
    styles
  );


  // JS
  gulp.watch(
    paths.jsAll,
    gulp.series(
      scripts,
      reload
    )
  );


  // LIBS
  gulp.watch(
    paths.libsAll,
    gulp.series(
      copyLibs,
      reload
    )
  );


  // IMAGES
  gulp.watch(
    paths.imgsSvg,
    gulp.series(
      imgCopySvg,
      reload
    )
  );

  gulp.watch(
    paths.imgsOther,
    gulp.series(
      imgCopyOther,
      reload
    )
  );

  gulp.watch(
    paths.imgsJpgPng,
    gulp.series(
      imgWebp,
      reload
    )
  );


  // FONTS — TTF
  gulp.watch(
    paths.fontsTtf,
    gulp.series(
      fontsTtf2woff2,
      reload
    )
  );


  // FONTS — готовые WOFF / WOFF2
  gulp.watch(
    paths.fontsReady,
    gulp.series(
      fontsCopy,
      reload
    )
  );


  // VIDEO
  gulp.watch(
    paths.videoAll,
    gulp.series(
      copyVideo,
      reload
    )
  );
}


// --- Build ---
export const build = gulp.series(
  clean,

  gulp.parallel(
    pugPages,
    pugUi,
    styles,
    scripts,
    copyLibs,
    images,
    fonts,
    copyVideo
  )
);


// --- Default ---
export default gulp.series(
  build,

  gulp.parallel(
    server,
    watch
  )
);