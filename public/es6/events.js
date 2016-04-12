// Bootstrap Tooltips
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

// Make Bootstrap drop down act like form options
$(".options-dropdown").each(function(index, value){
    var $dropdown = $(value);

    $dropdown.on('reset', function(){
        // Reset the click events for the possible new items
        $dropdown.find('ul li').unbind('click').click(function(){
            $dropdown.val($(this).attr('value')).find('.dropdown-title').html($(this).html());
            $dropdown.trigger('updated');
        });

        // Set the drop down to the first item in the list
        var $first = $dropdown.find('ul li:first-child');
        if($first.length > 0)
            $dropdown.val($first.attr('value')).find('.dropdown-title').html($first.html());
        else
            $dropdown.val('default').find('.dropdown-title').html('Dropdown');

        // Trigger update for any functions that should run when the value changes
        $dropdown.trigger('updated');
    });

    $dropdown.trigger('reset');
});

// Generator
$('.generate-button button').click(function(){
    var options = Settings.getSettings($('#settings'), '.setting-value', 'name');
    var words = [];
    for(let i=0; i<options.results; i++){
        words.push(Generate.newWord(options, language));
    }
    $('#generate .generate-window .word-wrapper:not(.favorite)').remove();
    $('#generate .generate-window').append(words.join('')).find('[data-toggle="tooltip"]').tooltip();
}).trigger('click');


// Settings
$("#select-language ul").append(Settings.buildOptions(Lib.objectKeyArray(language)));// load the languages
$("#select-language").trigger('reset');
$('.range-input').on('input', function(){
    $(this).parent().find('.range-value').html($(this).val());
}).trigger('input');
$('#reset-settings').click(function(){
    var $form = $('#settings-form');
    $form[0].reset();
    $form.find(".options-dropdown").trigger('reset');
    $form.find('.range-input').trigger('input');
    $('.generate-button button').click();
});

// Chrome speech synthesis
if('speechSynthesis' in window){
    window.speechSynthesis.onvoiceschanged = function() {
        if(typeof Speech.set !== 'undefined')
            return false;

        Speech.init();
        $("#select-speech ul").append(Speech.languageOptions());
        $("#select-speech").on('updated', function(){
            Speech.setLanguage($(this).val());
        }).trigger('reset');
        $("#volume-speech").on('input', function(){
            Speech.setVolume($(this).val());
        }).trigger('input');


        // Attempt English UK
        $('#select-speech ul li[voice="Google UK English Male"]').click();
    };
}else{
    Speech.failed = true;
    $('head').append($('<style>.hide-if-speech-fail{display:none !important;}</style>'));
}






/*
    GREYSCALE STUFF
 */

// jQuery to collapse the navbar on scroll
function collapseNavbar() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
}
$(window).scroll(collapseNavbar);
$(document).ready(collapseNavbar);

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    if ($(this).attr('class') != 'dropdown-toggle active' && $(this).attr('class') != 'dropdown-toggle') {
        $('.navbar-toggle:visible').click();
    }
});

