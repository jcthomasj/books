var _fs = require('fs'),
    folder = process.argv[3],
    output = process.argv[2],
    files = (function () {
        if (!folder)
            folder = '.';

        var results = [];
        _fs.readdirSync(folder).forEach(function(file) {
            file = folder + '/' + file;
            var stat = _fs.statSync(file);
            if (stat && !stat.isDirectory()) {
                results.push(file)
            }
        });
        return results;
    }());


if (!folder || !output) {
    console.log('Usage: node buildbook.js <folder> <output>');
    return;
}

var book = {
    title: '',
    translation: '',
    chapters: []
};

files.map(function (file) {

    if (file.indexOf('.json') !== file.length - 5)
        return null;

    console.log('   ' + file);

    var str = _fs.readFileSync(file).toString();
    var obj = JSON.parse(str);

    if (file.indexOf('book.json') === file.length - 9) {
        book.title = obj.title;
        book.translation = obj.translation;
    }
    else {
        book.chapters.push(obj);
    }

    return file;
});


book.chapters.sort(function (a, b) {
    if (a.chapter > b.chapter) return 1;
    if (a.chapter < b.chapter) return -1;
    return 0;
});

var out = JSON.stringify(book, null, 2);

_fs.writeFileSync(output, (function () {
    return out;
}()));



