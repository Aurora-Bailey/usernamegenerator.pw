/*
* Takes all the words from english.txt validates them against dictionary-words.txt
 * and compiles them into the most common then saves to languages/english.txt
* */


var fs = require("fs"),
    path = require("path");

Array.prototype.mostCommon = function(top){
    top = parseInt(top);

    console.log('before common: ', this.length);


    var x = {};
    var y = [];
    this.forEach(function(value){
        if(typeof x[value] == 'undefined')
            x[value] = {word: value, count: 1};
        else
            x[value].count += 1;
    });

    for(var i=0; i<top; i++){
        var biggest = {word: '', count: 0};

        for(var key in x)
            if(x[key].count > biggest.count && y.indexOf(x[key].word) == -1)
                biggest = x[key];

        if(biggest.word != '')
            y.push(biggest.word);
    }

    console.log('after common: ', y.length);

    return y;
};

fs.readFile(path.join(__dirname, 'english.txt'), function(err, data){
    if(err)
        return console.error(err);

    fs.readFile(path.join(__dirname, 'dictionary-words.txt'), function(err, data_d) {
        if (err)
            return console.error(err);

        var dictionary = data_d.toString().split(' ');

        var words = data
            .toString()
            .toLowerCase()
            .replace(/[\n\r]/gi, ' ')
            .split(' ')
            .filter(function(word){
                return word.length > 5 && word.length < 15;
            })
            .filter(function(word){
                return word.search(/[^a-z ]/gi) == -1;
            })
            .filter(function(word){
                return dictionary.indexOf(word) != -1;
            })
            .mostCommon(3000);

        fs.writeFile(path.join(__dirname, '../languages', 'english.txt'), words.join(' '), function(err){
            if(err)
                return console.log(err);

            console.log('Written to languages/english');
        });
    });
});


