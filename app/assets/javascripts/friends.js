
// ********* PROJECTION CODE ****************** \\

var numberOfGrandChildren = 0;
var saved = false; //save wall initialization
var allowFacebook = false; //to allow facebook messages to come in
var globalFrameID = "";
var previousGlobalFrameID = "";
var oldMessage = [];
var timesDivInserted = 0;
var timesMessageAdjusted = 0;
var timesPictureAdjusted = 0;
var messageIndex = 0;
var likeStatuses = [];
var lastTry = 0;

if( !window.chrome){
     var windowLocation = window.location;
     windowLocation = windowLocation.toString();
    if (!windowLocation.contains('/static_pages/usechrome.html')) {
        window.location = '/static_pages/usechrome.html';
    }
}

String.prototype.contains = function(it) { 
        return this.indexOf(it) != -1; 
    };

function begin(){
    if(timesDivInserted == 0){
        insertDiv();
        timesDivInserted++;
    } else if(allowFacebook){
        checkNewMessage();   
    }
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};


function insertDiv(){
    var widestName = 0;
    for(i=0; i<numberOfGrandChildren; i++){
        var name = document.getElementsByClassName('friend-name')[i].innerHTML;
        var divHTML = "<div class='photoFrame' id='photoFrame" + i + "'><p class = 'name'>"+name+"</p><div class='sliderBorder'></div><div class='sliderRotate'></div></div>";
        $(divHTML).insertAfter("#initializeDiv");
        var nameWidth = getTextWidth(name, parseInt($('.name').css('font-family')), parseInt($('.name').css('font-size')));
        if(nameWidth > widestName){
            widestName = nameWidth;
        }
    }
    $('.photoFrame').css('width', widestName + parseInt($('.photoFrame').css('border-width')));

    $( ".sliderBorder" ).slider();
    $('.sliderBorder').on( "slide", function( event, ui ) {
        var value = ui.value;
        $(this).parent().css('border-width', value); 
    });

    $( ".sliderRotate" ).slider({
        min: -10,
        max: 10,
        value: 0
    });
    $('.sliderRotate').on( "slide", function( event, ui ) {
        var value = ui.value;
        var rotation = "rotate(" + value + "deg)"; //rotate(7deg);
        console.log(rotation);
        $(this).parent().css('-webkit-transform', rotation);
    });
    
    $("#initializeDiv").remove();
    $( ".photoFrame" ).draggable({ 
        containment: "body",
        drag: function(event, ui) {
            $( "div" ).css({"float": "none"});
            $(this).css({"position" : "fixed"});            
        }
    });
    cursorGrab(".photoFrame");

}

function fadeOutInitializers(){
    // The initializer handles are made invisible for the facebook message animation to begin
    $(".name").css("opacity" , "0");
    $(".sliderBorder").css("opacity" , "0");
    $(".sliderRotate").css("opacity" , "0");
    $(".photoFrame").css({
        "border-color" : "black",
        "resize" : "none"
    });
}
 
function returnInitializers(){
    // When you want to adjust the initializing step
    $(".name").css("opacity" , "1");
    $(".sliderBorder").css("opacity" , "1");
    $(".sliderRotate").css("opacity" , "1");
    $( ".photoFrame" ).draggable('enable');
    $(".photoFrame").css({
        "border-color" : "white",
        "resize" : "both"
    });
    cursorGrab(".photoFrame");
}
 
function showSaved(){
    allowFacebook = true;
    saved = true;
    $( ".photoFrame" ).draggable('disable');
    cursorNormal(".photoFrame");
    fadeOutInitializers();
}



function overlaps(element1, element2){

    var element1OffsetRight =  element1.offset().left + element1.width() + parseInt(element1.css("border-bottom-width"))*2;
    var element1OffsetBottom =  element1.offset().top + element1.height() + parseInt(element1.css("border-bottom-width"))*2;
    var element1OffsetLeft =  element1.offset().left ;
    var element1OffsetTop =  element1.offset().top;

    var element2OffsetRight =  element2.offset().left + element2.width() + parseInt(element2.css("border-bottom-width"))*2;
    var element2OffsetBottom =  element2.offset().top +  element2.height() + parseInt(element2.css("border-bottom-width"))*2;
    var element2OffsetLeft =  element2.offset().left ;
    var element2OffsetTop =  element2.offset().top ;

    return !(element1OffsetRight < element2OffsetLeft || 
    element1OffsetLeft > element2OffsetRight || 
    element1OffsetBottom < element2OffsetTop || 
    element1OffsetTop > element2OffsetBottom);
}

function outOfWindow(queryMessageBoxID){

    var offsetBottom = $(queryMessageBoxID).offset().top + $(queryMessageBoxID).height();
    var offsetRight = $(queryMessageBoxID).offset().left + $(queryMessageBoxID).width();
    return (    $(queryMessageBoxID).offset().top < 0 ||
                $(queryMessageBoxID).offset().left < 0 ||
                offsetBottom > $(window).height() ||
                offsetRight > $(window).width()
    );
}

function rightPlace(queryObjectID){

    //if message box overlaps with one of the resizable divs, return false
    for(i=0; i<$( '.photoFrame' ).length; i++){
        var photoFrameSelector = "#" + $( '.photoFrame' )[i].id;
        if( overlaps($( queryObjectID ) , $(photoFrameSelector)) ){
            //console.log('Overlaps with: ' + photoFrameSelector);
            return false;
        }
    }
    //if message box overlaps with one of the other message boxes, return false
    for(i=0; i<$( '.messageContainer' ).length; i++){
        var queryMessageContainerID = "#" + $( '.messageContainer' )[i].id;        
        //if i is not the id of this box
        if( $( '.messageContainer' )[i].id != $( queryObjectID ).attr("id") ){
            if( overlaps($( queryObjectID ) , $(queryMessageContainerID)) ){
                //console.log('Overlaps with: ' + queryMessageContainerID);
                return false;
            }
        }               
    }

    for(i=0; i<$( '.picture' ).length; i++){
        var queryPictureID = "#" + $( '.picture' )[i].id;       
        //if i is not the id of this box
        if( $( '.picture' )[i].id != $( queryObjectID ).attr("id") ){
            if( overlaps($( queryObjectID ) , $(queryPictureID)) ){
                //console.log('Overlaps with: ' + queryPictureID);
                return false;
            }
        }               
    }

    //if out of window bounds, return false
    if(outOfWindow(queryObjectID)){
        //console.log(queryObjectID + ' is out of window');
        return false;
    }   
    return true;        
}

function getTextWidth(text, font, fontSize) {
    // if given, use cached canvas for better performance
    // else, create new canvas
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    insertFont = fontSize + " " + font;
    context.font = insertFont;
    var metrics = context.measureText(text);
    return metrics.width;
}

function isEven(x) { 
    return (x%2 )== 0; 
}


function adjustMessageBox(queryMessageContainerID, queryMessageID, queryMessageIDinside, widestWord){
    timesMessageAdjusted++;
    var resizeFactor = 1.1;
    if(!isEven(timesMessageAdjusted)){        
        //console.log('uneven WW: ' + widestWord);
        //console.log('uneven inside: ' + $(queryMessageIDinside).width()/resizeFactor);

        if(lastTry == 0){
            if(widestWord <= $(queryMessageIDinside).width()/resizeFactor){
            //the width may only become smaller if there is no word wider than the width (we don't want a sideway overflow)
            //console.log('adjust width');
            $(queryMessageID).css('width', $(queryMessageID).width()/resizeFactor);
            $(queryMessageIDinside).css('width', $(queryMessageID).width());
            $(queryMessageContainerID).css('width', $(queryMessageID).width()+ 2*distanceText);
            } else {
                timesMessageAdjusted++;
            }
        }        
    } 

    if(isEven(timesMessageAdjusted)) {
        //console.log('adjust height...'); 

        $(queryMessageID).css('height', $(queryMessageID).height()/resizeFactor);  
        //console.log('height: ' + $(queryMessageID).height());
        //console.log('fontheight: ' + parseInt($(queryMessageIDinside).css('font-size')));
        if( $(queryMessageID).height() >= parseInt(  $(queryMessageIDinside).css('font-size')  ) *resizeFactor){            
            $(queryMessageContainerID).css('height',  $(queryMessageID).height() + 2*distanceText);
            //console.log('...and height');
        } else if( $(queryMessageContainerID).width() < $(window).width()){ 
            //console.log('...and width bigger*resizeFactor (height too small)');
            //if the container is smaller than the size of the letters, it is unreadable
            $(queryMessageID).css('height', parseInt($(queryMessageIDinside).css('font-size')) *resizeFactor);
            $(queryMessageContainerID).css('height', $(queryMessageID).height() + 2*distanceText);
            $(queryMessageID).css('width',  $(queryMessageID).width()*resizeFactor);
            $(queryMessageIDinside).css('width', $(queryMessageID).width());
            $(queryMessageContainerID).css('width', $(queryMessageID).width() + 2*distanceText);            
        } else {
            //try two times a high and small messagebox
            console.log('last try!');
            lastTry++;
            if(lastTry < 2){
                $(queryMessageIDinside).css('width', $(queryMessageIDinside).width() / 4);
                $(queryMessageID).css('width', $(queryMessageIDinside).width());
                $(queryMessageContainerID).css('width', $(queryMessageID).width() + 2*distanceText);     
                $(queryMessageID).css('height', $(queryMessageID).height()*4);
                $(queryMessageContainerID).css('height', $(queryMessageID).height() + 2*distanceText);

            } else {
                //stop because there's no place for the message box
                lastTry = 0;
                timesMessageAdjusted = 1000;
            }
        }
    }
    return "done";
}

function adjustPicture(queryPictureID){
    timesPictureAdjusted++;
    $(queryPictureID).css('width', $(queryPictureID).width()/1.5);
    return "done";
}

function animateOverflow(queryObjectID1, queryObjectID2){
    $(queryObjectID1).css('margin-top', '0');
    var marginToAnimate = -($(queryObjectID1).height() - $(queryObjectID2).height());
    var animationSpeed = (-marginToAnimate)*150;
    if(animationSpeed>1){
        $(queryObjectID1).animate({ 
            marginTop: marginToAnimate
        }, animationSpeed, function() {
            animateOverflow(queryObjectID1, queryObjectID2);
        });
    }
}

// distance from photoframe (needed for text cloud) 1 is always needed, then add another distance
var distanceText = 12;
var distancePhotoFrame = 1 + 5;

function tryPositions(photoFrameID, queryObjectID){
    //***try left top position
    var side = "leftTop";
    var marginTop = $(photoFrameID).offset().top - $(queryObjectID).height()-distancePhotoFrame;
    var marginLeft = $(photoFrameID).offset().left - $(queryObjectID).width()-distancePhotoFrame;   
    $(queryObjectID).css({
        'margin-top' : marginTop,
        'margin-left' : marginLeft
    });

    if(timesMessageAdjusted > 400 || timesPictureAdjusted > 400){
        return "error";
    }

    //make message container visible if it's in the right place, else try another position
    if(rightPlace(queryObjectID)){
        $(queryObjectID).css('opacity', '1');           
    } else {
        
        //***try right top position
        side = "rightTop";
        marginTop = $(photoFrameID).offset().top - $(queryObjectID).height() - distancePhotoFrame;
        marginLeft = $(photoFrameID).offset().left + $(photoFrameID).width() + parseInt($(photoFrameID).css("border-bottom-width"))*2+distancePhotoFrame;       
        $(queryObjectID).css({
            'margin-top' : marginTop,
            'margin-left' : marginLeft
        });
        
        //make message container visible if it's in the right place, else try another position
        if(rightPlace(queryObjectID)){
            $(queryObjectID).css('opacity', '1');
        } else {            
            
            //***try right bottom position
            side = "rightBottom";
            marginTop = $(photoFrameID).offset().top + $(photoFrameID).height() + parseInt($(photoFrameID).css("border-bottom-width"))*2+distancePhotoFrame;
            marginLeft = $(photoFrameID).offset().left + $(photoFrameID).width() + parseInt($(photoFrameID).css("border-bottom-width"))*2+distancePhotoFrame;       
            $(queryObjectID).css({
                'margin-top' : marginTop,
                'margin-left' : marginLeft
            });
            
            //make message container visible if it's in the right place, else try another position
            if(rightPlace(queryObjectID)){
                $(queryObjectID).css('opacity', '1');
            } else {
                
                //***try left bottom position
                side = "leftBottom";
                marginTop = $(photoFrameID).offset().top + $(photoFrameID).height() + parseInt($(photoFrameID).css("border-bottom-width"))*2+distancePhotoFrame;
                marginLeft = $(photoFrameID).offset().left - $(queryObjectID).width() -distancePhotoFrame;  
                $(queryObjectID).css({
                    'margin-top' : marginTop,
                    'margin-left' : marginLeft
                });
                
                //make message container visible if it's in the right place, else try another size and positions
                if(rightPlace(queryObjectID)){
                    $(queryObjectID).css('opacity', '1');
                } else {
                    side = "again";
                }
            }
        }
    }
    return side;
}

function placeMessageBox(photoFrameID, message, widestWord){

    var messageSplit = message.split("");
    var numberOfCharacters = messageSplit.length;
    
    // message IDs (text)
    var messageID = photoFrameID.replace("#", "") + "message";
    var queryMessageID = "#" + messageID;   
    var queryMessageIDinside = queryMessageID + "Inside";

    // message container IDs
    var messageContainerID = messageID + "Container";
    var queryMessageContainerID = "#" + messageContainerID;

    var messageContainerPlaced = false; 

    if(timesMessageAdjusted==0){
        //stop previous message animation
        $(queryMessageID).stop();
        //remove previous message container with this ID
        $(queryMessageContainerID).remove();    
        
        //insert new message container with width according to number of characters of message and font size
        var insertMessageContainerHTML = "<div class='messageContainer' id='" + messageContainerID + "'></div>";
        $(insertMessageContainerHTML).insertAfter(photoFrameID);
        //calculate width of container div dependent on text width
        var textWidth = getTextWidth(message, $('.messageInside').css('font-family'), $('.message').css('font-size'));
        var containerRatio = Math.sqrt(textWidth)*0.1;
        var calculateContainerWidth = textWidth / containerRatio + distanceText*2;
       
        $(queryMessageContainerID).css('width', calculateContainerWidth);
        //insert the message text
        var insertMessageTextHTML = "<span class='message' id='" + messageID + "'><p class='messageInside' id='" + messageID + "Inside'>" + message + "</p></span>";
        $(queryMessageContainerID).html(insertMessageTextHTML); 
        //height of container div becomes height of text <p>
        var wordSplit = message.split(" ");
        var addWordLength = 0;

        for(word = 0; word < wordSplit.length; word++){
            var widthOfWordInDom = getTextWidth(wordSplit[word], $('.messageInside').css('font-family'), $('.message').css('font-size'));
            //console.log('word: '+ wordSplit[word]);
            //console.log('message id inside width: ' + $(queryMessageIDinside).width());
            //console.log('widthofwordindom: '+ widthOfWordInDom);
            
            if(widthOfWordInDom > widestWord){
                //console.log(messageID + ' word is bigger');
                widestWord = widthOfWordInDom;
            }
        }

        if(widestWord > $(queryMessageIDinside).width() ){
            addWordLength = widestWord - $(queryMessageIDinside).width();
        }
        
        //console.log('length of word "' + thaword + '" is: ' + widestWord);

        //console.log('addWordLength: ' + addWordLength);
        $(queryMessageIDinside).css('width', $(queryMessageIDinside).width() + addWordLength);
        $(queryMessageID).css({
            'width' : $(queryMessageIDinside).width(),
            'height': $(queryMessageIDinside).height()
        });
        $(queryMessageContainerID).css({
            'width' : $(queryMessageID).width() + distanceText*2 ,
            'height': $(queryMessageID).height() + distanceText*2
        });
        $(queryMessageID).css({
            'margin-top' : distanceText,
            'margin-left': distanceText
        });

    }

    var side = tryPositions(photoFrameID, queryMessageContainerID);
    //console.log('side: ' + side );
    //console.log('timesMessageAdjusted: ' + timesMessageAdjusted);

    if(side == "again"){
        //box not placed because needs to be resized
        var status = adjustMessageBox(queryMessageContainerID, queryMessageID, queryMessageIDinside, widestWord);
        if(status == 'done'){
            placeMessageBox(photoFrameID, message, widestWord);
        }
        //@@NEW deze elseif verplaatsen
    } else if(side == "error"){
        //box not placed because too many tries
        console.log('too many tries message -> not placed');
        globalFrameID = previousGlobalFrameID;
        timesMessageAdjusted = 0;
    } else if(typeof(side) == 'string' && timesMessageAdjusted > 0) {
        //box placed in more times
        previousGlobalFrameID = globalFrameID;
        animateBorder(globalFrameID);
        createBorder(queryMessageContainerID, side);
        timesMessageAdjusted = 0;
        animateOverflow(queryMessageIDinside, queryMessageID);
    }  else{
        //box placed in 1 time! :D
        previousGlobalFrameID = globalFrameID;
        animateBorder(globalFrameID);
        createBorder(queryMessageContainerID, side);
        timesMessageAdjusted = 0;
    }
}

function animateBorder(photoFrameID) {        
    $(".photoFrame").not(photoFrameID).css('-webkit-animation-iteration-count', '0');
    $(photoFrameID).css({
        '-webkit-animation-name' : 'border',
        '-webkit-animation-iteration-count' : 'infinite'
    });
}


function placePicture(photoFrameID, pictureLink){
    
    //console.log("Placing picture on " + photoFrameID + "...");
    // message IDs (text)
    var pictureID = photoFrameID.replace("#", "") + "Picture";
    var queryPictureID = "#" + pictureID;

    if(timesPictureAdjusted==0){
        //console.log("...for the first time");
        //remove previous picture with this ID
        $(queryPictureID).remove();
        //insert new message container with width according to number of characters of message and font size
        var insertPictureContainerHTML = "<img class='picture' id='" + pictureID + "'/img>";
        $(insertPictureContainerHTML).insertAfter(photoFrameID);
        document.getElementById(pictureID).src = pictureLink;
        $(queryPictureID)
            .attr("src", document.getElementById(pictureID).src)
            .load(function(){
                $(this).css('width', $(window).width()*0.15);
                beginPlacing();
        });     
    } else {
        beginPlacing();
    }

    function beginPlacing(){
        //TODO deze functie nog buiten de andere functie?
        //console.log('Begin place picture');
        var side = tryPositions(photoFrameID, queryPictureID);

        //console.log('picture ' + side);

        if(side == "again"){
            //picture not placed, because needs to be resized
            var status = adjustPicture(queryPictureID);
            if(status == 'done'){
                placePicture(photoFrameID, pictureLink);
            }
        } else if (side == "error"){
            //picture not placed, because too many tries
            console.log('too many tries picture -> not placed');
            globalFrameID = previousGlobalFrameID;
            timesPictureAdjusted = 0;
        } else{
            //picture is placed! :D
            previousGlobalFrameID = globalFrameID ;
            createBorder(queryPictureID, side);
            //@@NEW
            animateBorder(globalFrameID);
            $(queryPictureID).css('opacity', '1');
            timesPictureAdjusted = 0;
        }
    }   
}

function createBorder(queryObjectID, side){
    if(side=="leftTop"){
        $(queryObjectID).css({
            'border-top-left-radius' : '3em',
            'border-top-right-radius' : '3em',
            'border-bottom-right-radius' : '0em',
            'border-bottom-left-radius' : '3em'
        });
    } else if(side=="rightTop"){
        $(queryObjectID).css({
            'border-top-left-radius' : '3em',
            'border-top-right-radius' : '3em',
            'border-bottom-right-radius' : '3em',
            'border-bottom-left-radius' : '0em'
        });
    } else if(side=="rightBottom"){
        $(queryObjectID).css({
            'border-top-left-radius' : '0em',
            'border-top-right-radius' : '3em',
            'border-bottom-right-radius' : '3em',
            'border-bottom-left-radius' : '3em'
        });      
    } else if(side=="leftBottom"){
        $(queryObjectID).css({
            'border-top-left-radius' : '3em',
            'border-top-right-radius' : '0em',
            'border-bottom-right-radius' : '3em',
            'border-bottom-left-radius' : '3em'
        });       
    } else {
        console.log('could not find side and thus border');
    }
}

var latestDate = new Date(394648309130.185);
console.log('initial date: ' + latestDate);

function checkNewMessage(){
    console.log('check: ' + globalFrameID);
    var newMessage = "";
    var length = document.getElementsByClassName('message-facebook').length; 

    if(messageIndex<length){
        newMessage = document.getElementsByClassName('message-facebook')[messageIndex].innerHTML;
        
        var photoFrameID = "#photoFrame" + messageIndex;
        var timeStamp = new Date(parseInt(document.getElementsByClassName('message-facebook')[messageIndex].id));
        console.log('latest date: ' + latestDate);
        console.log('time stamp: ' + timeStamp);
        if(!!newMessage.localeCompare(oldMessage[messageIndex]) || (oldMessage[messageIndex] == undefined) || (newMessage == "")){
            //if different or empty then place
            likeStatuses[messageIndex] = "unliked";
            if(timeStamp > latestDate){
                console.log('bigger!');
                latestDate = timeStamp;
                globalFrameID = photoFrameID;
            }
            oldMessage[messageIndex] = newMessage;            
            messageIndex++;
            if(newMessage != "" ){
                placeMessageBox(photoFrameID, newMessage,0); 
            } else {
                var queryMessageBoxID = photoFrameID + 'messageContainer';
                $(queryMessageBoxID).remove();
            }
            checkNewPicture(photoFrameID);
        } else if(!saved){
            //enable placeMessage box in unsaved mode so that the message moves with the photoframe            
            messageIndex++;
            placeMessageBox(photoFrameID, newMessage,0); 
            checkNewPicture(photoFrameID);
        } else {
            //check another new message
            messageIndex++;
            checkNewMessage();
        }
    } else{
        messageIndex = 0;
    }
}

function filterLink(link){
    var linkUnfiltered = link.includes('&amp;');
    var counter = 0;
    while(linkUnfiltered){
        if(counter > 200){
            //deze shit gaat later weg, als het blijkt dat deze functie waterdicht werkt :P
            console.log('HELP ME, IM STUCK IN A WHILE LOOP');
        }
        link = link.replace('&amp;', '&');
        linkUnfiltered = link.includes('&amp;');
        counter++;
    }
    return link;
}

function checkNewPicture(photoFrameID){
    var index = parseInt( photoFrameID.replace("#photoFrame", "") );
    var newPicture = document.getElementsByClassName('picture-facebook')[index].innerHTML; 
    newPicture = filterLink(newPicture);
    if(newPicture != ""){
        placePicture(photoFrameID, newPicture); 
    } else {
        var queryPictureID = photoFrameID + 'Picture';
        $(queryPictureID).remove();
    }
}


function cursorGrab(selector){
    $(selector).hover(function() {
        $(selector).css({
            'cursor' : '-webkit-grab',
            'cursor' : '-webkit-grabbing' 
        });
    }, function(){
        $(selector).css( 'cursor', 'auto');
    });
}

function cursorNormal(selector){
    $(selector).hover(function() {
        $(selector).css( 'cursor', 'auto');
    }, function(){
        $(selector).css( 'cursor', 'auto');
    });

}

function showLike(){
    var likeIndex = parseInt(globalFrameID.replace("#photoFrame", "")); 

    if(likeStatuses[likeIndex] == "unliked"){
        $('.heart').remove();
        var divHTML = "<div class='heart'>&hearts;</div>";
        $( globalFrameID ).prepend( divHTML );
        var frameHeight = (1/3)* $( globalFrameID ).height();
        var frameWidth = $( globalFrameID ).width();
        $('.heart').css({
            'height': frameHeight,
            'font-size':  frameHeight,
            'margin-top' : frameHeight,
            '-webkit-animation-iteration-count' : '4'
        });
        $('.heart').css('margin-left', 0.5*frameWidth - 0.5*$('.heart').width());

        var duration = ($('.heart').css('-webkit-animation-iteration-count') * parseInt($('.heart').css('-webkit-animation-duration'))) * 1000;
        setTimeout(function(){ 
            //console.log('remove heart');
            $('.heart').remove();
        }, duration);
        likeStatuses[likeIndex] = "liked";
    }
}

function showRecording(direction){
    $('.recording').remove();
    if(direction == "down"){
        var divHTML = "<img class='recording'/>";
        $( globalFrameID ).prepend( divHTML );
        var frameHeight = (1/3)* $( globalFrameID ).height();
        var frameWidth = $( globalFrameID ).width();
        $('.recording').css({
            'height': frameHeight,
            'margin-top' : frameHeight,
            '-webkit-animation-iteration-count' : 'infinite'
        });
        if($('.recording').width() > frameWidth){
            $('.recording').css('width', frameWidth);
        }
    }
}





















// ********* SPEECH RECOGNITION CODE ****************** \\



var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;

if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  
  recognition.onstart = function() {
    recognizing = true;
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      ignore_onend = false;
    }
    if (event.error == 'audio-capture') {
      ignore_onend = false;
    }
    if (event.error == 'not-allowed') {
      ignore_onend = false;
    }
  };

  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }

    if (!final_transcript) {
      return;
    }
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    final_transcript = capitalize(final_transcript);
    final_string = String(final_transcript);
    if (final_string) {
        console.log(final_string);
        $.ajax({
            url: '/friends/comment_part.js',
            type: 'get',
            data: { message: final_string},
            contentType: 'html'
        });
        final_string = "";
    }
  };
}

function upgrade() {
  start_button.style.visibility = 'hidden';
}

var two_line = /\n\n/g;
var one_line = /\n/g;

function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

var lastEvent;
var heldKeys = {};

window.onkeydown = function(event) {
    if(event.keyCode==32){
        showSaved();
    } else if (event.keyCode==86){ //v
        saved = false;
        returnInitializers();
    }
    else if (event.keyCode == 71) {
        if (lastEvent && lastEvent.keyCode == event.keyCode) {
            return;
        }

        lastEvent = event;
        heldKeys[event.keyCode] = true;        
        final_transcript = '';
        recognition.lang = 'en-US';
        recognition.start();
        ignore_onend = false;
        start_timestamp = event.timeStamp;
        console.log("down");
        showRecording('down');
    }
};

window.onkeyup = function(event) {
    if (event.keyCode == 71) {
        lastEvent = null;
        delete heldKeys[event.keyCode];
        console.log('up');
        recognition.stop();
        showRecording('up');
    }
};







// ********* EMOTION RECOGNITION CODE ****************** \\





$(".friends.index").ready(function(){
    $.get("/friends/refresh_part.js", function(data){
        $("#partial_for_friend_and_message").html(data);
    },
    "html");

    setInterval(function(){
        if (recognizing) {
            console.log("rec");
        }
        else {
            console.log("gettin it");
            $.get("/friends/refresh_part.js", function(data){
                $("#partial_for_friend_and_message").html(data);
            },"html");
        }
    }, 5000);

    var vid = document.getElementById('videoel');
    var overlay = document.getElementById('overlay');
    var overlayCC = overlay.getContext('2d');
    
    /********** check and set up video/webcam **********/

    function enablestart() {
        var startbutton = document.getElementById('startbutton');
        startbutton.value = "start";
        startbutton.disabled = null;
    }
    
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

    // check for camerasupport
    if (navigator.getUserMedia) {
        // set up stream
        
        var videoSelector = {video : true};
        if (window.navigator.appVersion.match(/Chrome\/(.*?) /)) {
            var chromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
            if (chromeVersion < 20) {
                videoSelector = "video";
            }
        };
    
        navigator.getUserMedia(videoSelector, function( stream ) {
            if (vid.mozCaptureStream) {
                vid.mozSrcObject = stream;
            } else {
                vid.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
            }
            vid.play();
        }, function() {
            //insertAltVideo(vid);
            alert("There was some problem trying to fetch video from your webcam. If you have a webcam, please make sure to accept when the browser asks for access to your webcam.");
        });
    } else {
        //insertAltVideo(vid);
        alert("This demo depends on getUserMedia, which your browser does not seem to support. :(");
    }

    vid.addEventListener('canplay', enablestart, false);
    
    /*********** setup of emotion detection *************/

    var ctrack = new clm.tracker({useWebGL : true});
    ctrack.init(pModel);

    function startVideo() {
        // start video
        vid.play();
        // start tracking
        ctrack.start(vid);
        // start loop to draw face
        drawLoop();
    }
    
   function drawLoop() {
        //console.log("DRAWING");
        requestAnimFrame(drawLoop);
        overlayCC.clearRect(0, 0, 400, 300);
        //psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
        if (ctrack.getCurrentPosition()) {
            ctrack.draw(overlay);
        }
        var cp = ctrack.getCurrentParameters();
        
        var er = ec.meanPredict(cp);
    }
    
    var ec = new emotionClassifier();
    ec.init(emotionModel);
    var emotionData = ec.getBlank();
    window.setInterval(function(){
        var happyval = ec.getHappyValue();
        var sadval = ec.getSadValue();
        var surprisedval = ec.getSurprisedValue();
        var angryval = ec.getAngryValue();   
        if (happyval > sadval && happyval > surprisedval && happyval > angryval && happyval > 50){
            //  TO DO: display like on wall
            if(allowFacebook){
                $.get("/friends/like_part.js", "html");
                console.log("Like!");
                showLike();
            }
        }   

        ec.clearEmotions();
    }, 2000);

    startVideo();   
});





