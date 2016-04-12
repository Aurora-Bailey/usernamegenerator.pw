// through2 is a thin wrapper around node transform streams
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'gulp-wordbreak';

// Plugin level function(dealing with files)
function gulpWordBreak(){

    // Creating a stream through which each file will pass
    return through.obj(function(file, enc, cb) {
        if (file.isNull()) {
            // return empty file
            return cb(null, file);
        }

        var filepath = path.normalize(file.path);
        var filename = filepath.split('\\').pop().split('.')[0];

        var start = {};
        var end = {};
        var comp = {};

        var words = file.contents
            .toString()
            .toLowerCase()
            .split(' ')
            .filter(function(word){
                return word.search(/[^a-z ]/gi) == -1;
            });

        words.forEach(function(value){
            var x = value.split('');
            if(typeof x[0] == 'undefined')
                return false;

            // build the start table
            var s = x[0];
            if(typeof start[s] == 'undefined')
                start[s] = 1;
            else
                start[s] += 1;

            // build the comp table
            for(var i=0; i<x.length -1; i++){
                var current = x[i];
                var next = x[i+1];
                if(typeof comp[current] == 'undefined')
                    comp[current] = {};

                if(typeof comp[current][next] == 'undefined')
                    comp[current][next] = 1;
                else
                    comp[current][next] +=1;
            }

            // build the end table
            var e = x.pop();
            if(typeof end[e] == 'undefined')
                end[e] = 1;
            else
                end[e] += 1;

        });

        var word_string = JSON.stringify({language: filename, start: start, end: end, comp: comp});

        var jsText = "language." + filename + " = " + word_string + ";";

        if(file.isBuffer())
            file.contents = new Buffer(jsText, 'utf-8');

        cb(null, file);

    });

}

// Exporting the plugin main function
module.exports = gulpWordBreak;