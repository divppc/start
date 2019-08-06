const gulp = require("gulp"),
  gulpJade = require("gulp-jade"),
  sass = require("gulp-sass"),
  csscomb = require("gulp-csscomb"),
  ftp = require("vinyl-ftp"),
  livereload = require("gulp-livereload"),
  sourcemaps = require("gulp-sourcemaps"),
  autoprefixer = require("gulp-autoprefixer"),
  minifyCSS = require("gulp-minify-css"),
  babel = require("gulp-babel"),
  clean = require("gulp-clean"),
  minifyjs = require("gulp-js-minify"),
  sftp = require("gulp-sftp"),
  webserver = require("gulp-webserver"),
  browserSync = require("browser-sync").create(),
  // svgSprite = require("gulp-svg-sprite"),
  concatCss = require("gulp-concat-css"),
  gcmq = require("gulp-group-css-media-queries");

//svg sprite generate
gulp.task("sprite", function() {
  return gulp
    .src("src/images/icons/*.svg")
    .pipe(svgSprite(config))
    .pipe(gulp.dest("."));
});

// Static server
gulp.task("browser-sync", function() {
  browserSync.init({
    server: {
      baseDir: "./dist/"
    }
  });
});

const config = {
  mode: {
    symbol: {
      dest: ".",
      sprite: "dist/assets/images/icons.svg",
      example: true,
      render: {
        scss: { dest: "src/scss/partials/_sprite.scss" }
      },
      prefix: ".icon-%s",
      dimensions: "%s",
      layout: "vertical",
      bust: false
    }
  },
  shape: {
    transform: [
      {
        svgo: {
          plugins: [
            { removeAttrs: { attrs: "(stroke|fill)" } },
            { removeUselessStrokeAndFill: true },
            { removeUselessDefs: true },
            { removeViewBox: true }
          ]
        }
      }
    ]
  }
};

//clean dist directory before build
gulp.task("clean", function() {
  return gulp.src("dist", { read: false }).pipe(clean());
});

//JS task
gulp.task("js", () =>
  gulp
    .src("src/js/*.js")
    .pipe(
      babel({
        presets: ["env"]
      })
    )
    .pipe(minifyjs())
    .pipe(gulp.dest("dist/assets/js"))
    .pipe(livereload())
);

//fonts transfer task
gulp.task("fonts", function() {
  return gulp.src("src/fonts/*").pipe(gulp.dest("dist/assets/fonts/"));
});

//images transfer task
gulp.task("images", function() {
  return gulp.src("src/images/*").pipe(gulp.dest("dist/assets/images/"));
});

//CSS task

gulp.task("css", function() {
  return gulp
    .src("src/scss/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(
      csscomb({
        "tab-size": 2,
        "block-indent": 2
      })
    )
    .pipe(
      sass({
        outputStyle: "compressed"
      })
    )
    .pipe(autoprefixer("last 2 versions"))
    .pipe(gcmq())
    .pipe(sourcemaps.write())
    .pipe(minifyCSS())
    .pipe(gulp.dest("dist/assets/css/"))
    .pipe(browserSync.stream());
});

//HTML Task

gulp.task("jade", function() {
  return gulp
    .src("src/jade/*.jade")
    .pipe(
      gulpJade({
        pretty: "\t"
      })
    )
    .pipe(gulp.dest("dist/"))
    .pipe(browserSync.stream());
});

gulp.task("html", function() {
  return gulp
    .src("src/*.html")
    .pipe(gulp.dest("dist/"))
    .pipe(browserSync.stream());
});

gulp.task("watch", function() {
  livereload.listen({ basePath: "dist" });
  gulp.watch("src/scss/**/*.scss", ["css"]);
  gulp.watch("src/*.html", ["html"]);
  gulp.watch("src/js/**/*", ["js"]);
  // gulp.watch('src/images/icons/*.svg', ['sprite']);
  gulp.watch("src/images/*", ["images"]);
  gulp.watch("src/fonts/*", ["fonts"]);
  browserSync.reload();
});

gulp.task("ftp-deploy-watch", function() {
  // var conn = getFtpConnection();
  gulp.watch("dist/**").on("change", function(event) {
    console.log(
      'Changes detected! Uploading file "' + event.path + '", ' + event.type
    );

    return gulp.src([event.path], { base: "dist/", buffer: false }).pipe(
      sftp({
        host: "",
        user: "",
        pass: "",
        port: 21,
        remotePath: "/"
        // key: './vultr_id_rs',
        // callback: function() {
        //   livereload.reload();
        // }
      })
    );
  });
});

//Work Task (run all)
gulp.task("default", ["browser-sync", "watch"]);
