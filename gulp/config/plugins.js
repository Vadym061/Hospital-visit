import replace from "gulp-replace"; // поиск и замена
import plumber from "gulp-plumber";// оброботка ошибок
import notify from "gulp-notify";// сообщение (подсказка)
import browserSync from "browser-sync"//локальный сервкр
import newer from "gulp-newer";// проверка обновления
import ifPlugin from "gulp-if";// условное ветвление



//Экспортируем обьект
export const plugins = {
    replace: replace,
    plumber: plumber,
    notify: notify,
    browserSync: browserSync,
    newer: newer,
    if: ifPlugin
}