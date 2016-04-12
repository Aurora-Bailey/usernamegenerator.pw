class Lib {
    static objectKeyArray(obj){
        var arr = [];

        for(var key in obj)
            arr.push(key);

        return arr;
    }

    // Takes an object (obj.a = 10 obj.b = 20 etc...) returns the random key (b)
    static weightedRandom(obj){
        var total = 0;
        for(var key in obj)
            total += obj[key];

        var r = Math.random() * total;

        for(var key in obj){
            if(r < obj[key])
                return key;
            r -= obj[key];
        }
    }

    static randomProperty(obj){
        var total = 0;
        for(var key in obj)
            total += 1;

        var r = Math.random() * total;

        for(var key in obj){
            if(r < 1)
                return obj[key];
            r -= 1;
        }
    }

    static inCommonProperty(obj, obj2){
        var r = {};
        for(var key in obj)
            if(typeof obj2[key] !== 'undefined')
                r[key] = obj[key];

        return r;
    }

    static notProperty(obj, exclude_arr){
        var r = {};
        for(var key in obj)
            if(exclude_arr.indexOf(key) == -1)
                r[key] = obj[key];

        return r;
    }

    static deepCopy(obj){
        return JSON.parse(JSON.stringify(obj));
    }

    static isObjEmpty(obj){
        // null and undefined are "empty"
        if(obj == null)
            return true;

        // Assume if it has a length property with a non-zero valuehttp%3A%2F%2Flocalhost%3A4000%2F
        // that that property is correct.
        if(obj.length > 0)
            return false;
        if(obj.length === 0)
            return true;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for(var key in obj){
            if (obj.hasOwnProperty(key))
                return false;
        }

        return true;
    }

    static socialMediaPost(site){
        var url = 'http://usernamegenerator.pw/';//encodeURI(window.location.href);
        if(site == 'facebook')
            window.open('http://www.facebook.com/share.php?u=' + url, 'Facebook', 'width=550,height=400');
        else if(site == 'twitter')
            window.open('http://twitter.com/intent/tweet?status=' + $(document).find("title").text() + '+' + url, 'Twitter', 'width=550,height=400');
    }
}

class Speech  {
    static init(){
        if(typeof this.failed !== 'undefined')
            return false;

        this.set = true;
        this.msg = new SpeechSynthesisUtterance();
        this.voices = speechSynthesis.getVoices();
    }

    static languageOptions(){
        if(typeof this.failed !== 'undefined')
            return false;

        var r = '';
        this.voices.forEach(function(voice, index){
            r += `<li voice="${voice.name}" value="${index}">${voice.name}</li>`;
        });
        return r;
    }

    static setLanguage(lang){
        if(typeof this.failed !== 'undefined')
            return false;

        this.msg.voice = this.voices[lang];
    }

    static setVolume(v){
        if(typeof this.failed !== 'undefined')
            return false;

        this.msg.volume = parseInt(v) / 10;
    }

    static speak(text){
        if(typeof this.failed !== 'undefined')
            return false;

        this.msg.text = text;
        speechSynthesis.speak(this.msg);
    }
}


class Generate {
    static newWord(settings, languages){

        // Language
        var lang = {};
        if(typeof languages[settings.language] == 'undefined'){
            //random
            lang = Lib.deepCopy(Lib.randomProperty(languages));
        }else{
            lang = Lib.deepCopy(languages[settings.language]);
        }

        // Exclude
        var exclude = settings.exclude
            .toLowerCase()
            .replace(/[^a-z]/gi, '')
            .split('');

        // Clean the lang object of excluded letters and purge empty objects
        var found_one = true;
        while(found_one){
            found_one = false;

            lang.start = Lib.notProperty(lang.start, exclude);
            lang.end = Lib.notProperty(lang.end, exclude);
            lang.comp = Lib.notProperty(lang.comp, exclude);
            for(var key in lang.comp){
                // this will leave some letters empty
                lang.comp[key] = Lib.notProperty(lang.comp[key], exclude);

                // remove duplicate letters
                delete lang.comp[key][key];

                // try again?
                if(Lib.isObjEmpty(lang.comp[key])){
                    exclude.push(key);
                    found_one = true;
                }
            }
        }

        // Starts With
        var allowed_start = Lib.objectKeyArray(lang.start);
        var start_with = settings.start
            .toLowerCase()
            .replace(/[^a-z]/gi, '')
            .split('')
            .filter(function(letter){
                return allowed_start.indexOf(letter) != -1;
            });

        // Ends With
        var allowed_end = Lib.objectKeyArray(lang.end);
        var end_with = settings.end
            .toLowerCase()
            .replace(/[^a-z]/gi, '')
            .split('')
            .filter(function(letter){
                return allowed_end.indexOf(letter) != -1;
            });

        // Length
        var set_length = parseInt(settings.length);
        var set_variance = parseInt(settings.variance);
        var length = (set_length + set_variance) - Math.floor(Math.random() * (1 + (set_variance * 2)));
        if(length < 1)
            length = 1;


        // MAIN WORD BUILDING LOOP
        var word = '';
        var loop_count = 0;
        while(word.length < length){
            if(word.length == 0){
                // first letter
                var start_letters = {};

                if(start_with.length > 0){
                    start_with.forEach(function(value){
                        start_letters[value] = lang.start[value];
                    });
                }else{
                    start_letters = lang.start;
                }

                word += Lib.weightedRandom(start_letters);
            }else if(word.length == length -1){
                // last letter
                var last_letter_end = word.slice(-1);
                var end_letters = {};
                var end_letters_from_word = lang.comp[last_letter_end];

                if(end_with.length > 0){
                    end_with.forEach(function(value){
                        end_letters[value] = lang.end[value];
                    });
                }else{
                    end_letters = lang.end;
                }

                var safe_end_letters = Lib.inCommonProperty(end_letters, end_letters_from_word);

                if(Lib.isObjEmpty(safe_end_letters)){
                    var safe_end_letters_no_user = Lib.inCommonProperty(lang.end, end_letters_from_word);
                    if(Lib.isObjEmpty(safe_end_letters_no_user))
                        word += Lib.weightedRandom(end_letters_from_word);// forget a proper ending. just make it flow.
                    else
                        word += Lib.weightedRandom(safe_end_letters_no_user);// forget user input
                }else{
                    word += Lib.weightedRandom(safe_end_letters);// in harmony with what the word should end with and what the user wants
                }

            }else{
                // middle letters
                var last_letter = word.slice(-1);

                word += Lib.weightedRandom(lang.comp[last_letter]);
            }

            loop_count++;
            if(loop_count > 100)
                break;
        }

        // Cap first letter if no prefix
        if(settings.prepend.length == 0)
            word = word.toUpperCaseFirst();

        var fullword = settings.prepend + word + settings.append;


        // Build and output
        return `<div class="word-wrapper">
        <span class="flag flag-${lang.language}" data-toggle="tooltip" data-placement="top" title="${lang.language.toUpperCaseFirst()}"></span>
        <span class="prepend">${settings.prepend}</span>
        <span class="word">${word}</span>
        <span class="append">${settings.append}</span>
        <div class="icon-right">
            <span class="speak hide-if-speech-fail" onclick="Speech.speak('${fullword}')"><i class="fa fa-volume-up fa-fw"></i></span>
            <span class="save" onclick="$(this).closest('.word-wrapper').toggleClass('favorite')"><i class="fa fa-star fa-fw"></i></span>
            <a href="http://knowem.com/checkusernames.php?u=${fullword}" target="_blank" class="lookup"><i class="fa fa-external-link fa-fw"></i></a>
            <a href="https://www.google.com/search?q=${fullword}" target="_blank" class="google"><i class="fa fa-search fa-fw"></i></a>
        </div>
        </div>`.replace(/[\n\r]\s+/gi, '');// remove the newline and spaces caused by formatting
    }
}


class Settings {
    static getSettings($element, selector, name){
        var settings = {};
        $element.find(selector).each(function(key, value){
            var n = $(value).attr(name);
            var v = $(value).val();
            settings[n] = v;
        });

        return settings;
    }

    static buildOptions(arr){
        var optionsHTML = '';

        for(var i=0; i<arr.length; i++)
            optionsHTML += `<li value="${arr[i]}"><span class="flag flag-sm flag-${arr[i]}"></span>${arr[i].toUpperCaseFirst()}</li>`;

        return optionsHTML;
    }
}

