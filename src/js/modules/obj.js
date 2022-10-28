export default function objForm(form) {
    let obj = {};
    for(let [name, value] of form) {
        if(value) {
            obj[name] = value;
        }
    }
    return obj
}
