import del from "del";
import zipPlugin from "gulp-zip";

export const zip = () =>{
    del(`./${app.path.rootFloder}.zip`);
    return app.gulp.src(`${app.path.buildFloder}/**/*.*`, {})
    .pipe(app.plugins.plumber(
        app.plugins.notify.onError({
            title: "ZIP",
            message: "Error: <%= error.message %>"
        })
    ))
    .pipe(zipPlugin(`${app.path.rootFloder}.zip`))
    .pipe(app.gulp.dest('./'));
}