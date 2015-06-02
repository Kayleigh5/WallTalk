
// ********* PROJECTION CODE ****************** \\

var colors = ["AliceBlue","Aqua","Aquamarine","Azure","Beige","Bisque","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DeepPink","DeepSkyBlue","DimGray","DodgerBlue","FireBrick","ForestGreen","Fuchsia","Gainsboro","Gold","GoldenRod","Gray","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","Lime", "Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","RebeccaPurple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];
var numberOfGrandChildren = 0;
var saved = false; //save wall initialization
var allowFacebook = false; //to allow facebook messages to come in
var globalFrameIDNewMessage = "";
var globalFrameIDNewPicture = "";
var globalNewMessage = "";
var globalNewPicture = "";
var oldMessage = [];
var oldPicture = [];
var timesDivInserted = 0;
var timesHeightAdjusted = 0;
var randomPictures = ["http://dreamatico.com/data_images/kitten/kitten-6.jpg", "https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-xft1/v/t1.0-9/10660283_865921100147683_8777487066525882489_n.jpg?oh=0fa6e12d9d303c83e43156efa4486a22&oe=55F165D3&__gda__=1438981977_48d0a01d9413501113336d4ba2839d97" , "https://scontent.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/11295583_852036748221841_2790802351986496979_n.jpg?oh=6659b82bfb7180a5fc5f17167ba29ee1&oe=55FAACE3" , "https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-xft1/v/t1.0-9/11062808_851959018204108_5194172977501782794_n.jpg?oh=9c49b86f75cda4e5bca51f0502906d4a&oe=55FD7E0D&__gda__=1442976903_14d7142af05b18498b51f4daae093182"];



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
    for(i=0; i<numberOfGrandChildren; i++){
        var randomName = document.getElementsByClassName('friend-name')[i].innerHTML;
        var message = document.getElementsByClassName('message-facebook')[i].innerHTML;
        console.log(randomName + " : " + message);

        var divHTML = "<div class='photoFrame' id='photoFrame" + i + "'><p class = 'name'>"+randomName+"</p><div class='slider'></div></div>";
        $(divHTML).insertAfter("#initializeDiv");

        var divID = "#photoFrame" + i;
        var randomIndex = Math.floor(Math.random() * colors.length);
        var randomColor = colors[randomIndex];      
        colors.remove(randomColor);
        var colorString = randomColor + " solid 5px";       
        $(divID).css({"border": colorString});
    }

    $( ".slider" ).slider();
    $('.slider').on( "slide", function( event, ui ) {
        var value = ui.value;
        $(this).parent().animate({
            borderWidth: value
        }, 1);   
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
    $(".photoFrame").css("border-color" , "black");
    $(".slider").css("opacity" , "0");
    $(".photoFrame").css("resize", "none");
}
 
function returnInitializers(){
    // When you want to adjust the initializing step
    $(".name").css("opacity" , "1");
    $(".photoFrame").css("border-color" , "white");
    $(".slider").css("opacity" , "1");
    $(".photoFrame").css("resize", "both");
    $( ".photoFrame" ).draggable('enable');
    cursorGrab(".photoFrame");
}
 
function showSaved(){

    $("<p class='saved'>SAVED</p>").insertAfter("#photoFrame0");
    $( ".saved" ).animate({"opacity" : "1" }, "slow");
    $( ".saved" ).animate({"opacity" : "0" }, "slow ", function() {
       $(".saved").remove();
       allowFacebook = true;
       saved = true;
       $( ".photoFrame" ).draggable('disable');
       cursorNormal(".photoFrame");
       fadeOutInitializers();
    });
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
                //console.log('Overlaps with: ' + messageContainerSelector);
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


function adjustMessageBox(queryMessageContainerID, queryMessageID, queryMessageIDinside){
    timesHeightAdjusted++;
    if(isEven(timesHeightAdjusted)){
        //console.log('even');
        $(queryMessageContainerID).css('width', $(queryMessageContainerID).width()/1.1);
        $(queryMessageID).css('width', $(queryMessageID).width()/1.1 - (distanceText-(distanceText/1.1)));
        $(queryMessageIDinside).css('width', $(queryMessageID).width());
        //@@NEW@@
    } else {
        //console.log('uneven');
        $(queryMessageContainerID).css('height', $(queryMessageContainerID).height()/1.1);
        $(queryMessageID).css('height', $(queryMessageID).height()/1.1 - (distanceText-(distanceText/1.1)));
        //@@NEW@@       
    }
    return "done";
}

function adjustPicture(queryPictureID){
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
            //console.log('Animated: ' + queryObjectID1 + 'with speed: ' + animationSpeed);
            animateOverflow(queryObjectID1, queryObjectID2);
        });
    }
    
}


// distance from photoframe (needed for text cloud) 1 is always needed, then add another distance
var distanceText = 20;
var distancePhotoFrame = 1 + 5;

//@@NEW@@
function tryPositions(photoFrameID, queryObjectID){
    //***try left top position
    var side = "leftTop";
    var marginTop = $(photoFrameID).offset().top - $(queryObjectID).height()-distancePhotoFrame;
    var marginLeft = $(photoFrameID).offset().left - $(queryObjectID).width()-distancePhotoFrame;   
    $(queryObjectID).css('margin-top', marginTop);
    $(queryObjectID).css('margin-left', marginLeft);

    //make message container visible if it's in the right place, else try another position
    if(rightPlace(queryObjectID)){
        $(queryObjectID).css('opacity', '1');           
    } else {
        
        //***try right top position
        side = "rightTop";
        marginTop = $(photoFrameID).offset().top - $(queryObjectID).height() - distancePhotoFrame;
        marginLeft = $(photoFrameID).offset().left + $(photoFrameID).width() + parseInt($(photoFrameID).css("border-bottom-width"))*2+distancePhotoFrame;       
        $(queryObjectID).css('margin-top', marginTop);
        $(queryObjectID).css('margin-left', marginLeft);
        
        //make message container visible if it's in the right place, else try another position
        //@@NEW@@
        if(rightPlace(queryObjectID)){
            $(queryObjectID).css('opacity', '1');
        } else {            
            
            //***try right bottom position
            side = "rightBottom";
            marginTop = $(photoFrameID).offset().top + $(photoFrameID).height() + parseInt($(photoFrameID).css("border-bottom-width"))*2+distancePhotoFrame;
            marginLeft = $(photoFrameID).offset().left + $(photoFrameID).width() + parseInt($(photoFrameID).css("border-bottom-width"))*2+distancePhotoFrame;       
            $(queryObjectID).css('margin-top', marginTop);
            $(queryObjectID).css('margin-left', marginLeft);
            
            //make message container visible if it's in the right place, else try another position
            //@@NEW@@
            if(rightPlace(queryObjectID)){
                $(queryObjectID).css('opacity', '1');
            } else {
                
                //***try left bottom position
                side = "leftBottom";
                marginTop = $(photoFrameID).offset().top + $(photoFrameID).height() + parseInt($(photoFrameID).css("border-bottom-width"))*2+distancePhotoFrame;
                marginLeft = $(photoFrameID).offset().left - $(queryObjectID).width() -distancePhotoFrame;  
                $(queryObjectID).css('margin-top', marginTop);
                $(queryObjectID).css('margin-left', marginLeft);
                
                //make message container visible if it's in the right place, else try another size and positions
                //@@NEW@@
                if(rightPlace(queryObjectID)){
                    $(queryObjectID).css('opacity', '1');
                } else {
                    //@@NEW@@
                    side = "again";
                }
            }
        }
    }
    console.log("tryPos: " + side);
    return side;
}

function placeMessageBox(photoFrameID, message){
    //console.log("place for the " + timesHeightAdjusted + " time");
    // get a message and calculate size
    console.log('place message: ' + message);
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

    if(timesHeightAdjusted==0){
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
            console.log('word: '+ wordSplit[word]);
            console.log('message id inside width: ' + $(queryMessageIDinside).width());
            console.log('length: '+ widthOfWordInDom);
            
            if(widthOfWordInDom > $(queryMessageIDinside).width()){
                console.log(messageID + ' word is bigger');
                addWordLength = widthOfWordInDom - $(queryMessageIDinside).width();
            }
        }

        console.log('addWordLength: ' + addWordLength);
        $(queryMessageIDinside).css('width', $(queryMessageIDinside).width() + addWordLength);
        $(queryMessageID).css('width', $(queryMessageIDinside).width());
        $(queryMessageID).css('height', $(queryMessageIDinside).height());
        $(queryMessageContainerID).css('width', $(queryMessageID).width() + distanceText*2);
        $(queryMessageContainerID).css('height', $(queryMessageID).height() + distanceText*2);

    }

    //@@NEW@@
    var side = tryPositions(photoFrameID, queryMessageContainerID);
    console.log('side: ' + side );
    console.log('timesHeightAdjusted: ' + timesHeightAdjusted);

    if(side == "again"){
        var status = adjustMessageBox(queryMessageContainerID, queryMessageID, queryMessageIDinside);

        if(status == 'done'){
            placeMessageBox(photoFrameID, message);
        }
    } else if(typeof(side) == 'string' && timesHeightAdjusted > 0) {
        $(queryMessageID).css('margin-top', distanceText);
        $(queryMessageID).css('margin-left', distanceText);
        createBorder(queryMessageContainerID, side);
        timesHeightAdjusted = 0;
        animateOverflow(queryMessageIDinside, queryMessageID);
    } else{
        $(queryMessageID).css('margin-top', distanceText);
        $(queryMessageID).css('margin-left', distanceText);
        createBorder(queryMessageContainerID, side);
        timesHeightAdjusted = 0;
    }
}

var blinkSpeed = 4000;

function animateBorder(photoFrameID) {        
   //setTimeout(function () {   
        $(photoFrameID).animate({
            "border-color": "white"
        }, blinkSpeed , function(){
            $(photoFrameID).animate({
            "border-color": "black"
            }, blinkSpeed, function(){
                if (globalFrameIDNewMessage == photoFrameID) {  
                    animateBorder(photoFrameID);          
                }
            });
        });     


   //}, blinkSpeed/16);
}


function placePicture(photoFrameID, pictureLink){
    
    // message IDs (text)
    var pictureID = photoFrameID.replace("#", "") + "Picture";
    var queryPictureID = "#" + pictureID;

    if(timesHeightAdjusted==0){
        //remove previous picture with this ID
        $(queryPictureID).remove();

        //insert new message container with width according to number of characters of message and font size
        var insertPictureContainerHTML = "<img class='picture' id='" + pictureID + "'/img>";
        $(insertPictureContainerHTML).insertAfter(photoFrameID);
        document.getElementById(pictureID).src = pictureLink;
        var pictureRealWidth = 0;
        var pictureRealHeight = 0;
        $(queryPictureID)
            .attr("src", document.getElementById(pictureID).src)
            .load(function(){
               pictureRealWidth = this.width;
               pictureRealHeight = this.height;
               beginPlacing();
        });     
    } else {
        beginPlacing();
    }

    function beginPlacing(){
        //deze functie nog buiten de andere functie?
        var side = tryPositions(photoFrameID, queryPictureID);

        if(side == "again"){
            var status = adjustPicture(queryPictureID);
            if(status == 'done'){
                timesHeightAdjusted++;
                placePicture(photoFrameID, pictureLink);
            }
        } else{
            createBorder(queryPictureID, side);
            $(queryPictureID).css('opacity', '1');
            timesHeightAdjusted = 0;
        }
    }   
    
}




function createBorder(queryObjectID, side){
    if(side=="leftTop"){
        $(queryObjectID).css('border-top-left-radius', '3em');
        $(queryObjectID).css('border-top-right-radius', '3em');
        $(queryObjectID).css('border-bottom-right-radius', '0em');
        $(queryObjectID).css('border-bottom-left-radius', '3em');
    } else if(side=="rightTop"){
        $(queryObjectID).css('border-top-left-radius', '3em');
        $(queryObjectID).css('border-top-right-radius', '3em');
        $(queryObjectID).css('border-bottom-right-radius', '3em');
        $(queryObjectID).css('border-bottom-left-radius', '0em');
    } else if(side=="rightBottom"){
        $(queryObjectID).css('border-top-left-radius', '0em');
        $(queryObjectID).css('border-top-right-radius', '3em');
        $(queryObjectID).css('border-bottom-right-radius', '3em');
        $(queryObjectID).css('border-bottom-left-radius', '3em');       
    } else if(side=="leftBottom"){
        $(queryObjectID).css('border-top-left-radius', '3em');
        $(queryObjectID).css('border-top-right-radius', '0em');
        $(queryObjectID).css('border-bottom-right-radius', '3em');
        $(queryObjectID).css('border-bottom-left-radius', '3em');       
    } else {
        console.log('could not find side and thus border');
    }
}

var newMessage = "";
var x = 0;

function checkNewMessage(){
    console.log('check');
    var length = document.getElementsByClassName('message-facebook').length; 
    if(x<length){
        newMessage = document.getElementsByClassName('message-facebook')[x].innerHTML;
        globalNewMessage = newMessage;
        var frameID = "#photoFrame" + x;
        //console.log('new: ' + newMessage);
        //console.log('old: ' + oldMessage[x]);
        if(!!newMessage.localeCompare(oldMessage[x]) || (oldMessage[x] == undefined) || (newMessage == "")){
            //if different then place and animate
            //console.log('different');
            //console.log('match: ' + newMessage.match(oldMessage[x]));
            //console.log('undefined: ' + (oldMessage[x] == undefined));
            globalFrameIDNewMessage = frameID;
            animateBorder(frameID);
            oldMessage[x] = newMessage;
            checkNewPicture(frameID, x);
            x++;
            placeMessageBox(frameID, newMessage); 
        } else if(!saved){
            //enable placeMessage box in unsaved mode so that the message moves with the photoframe
            checkNewPicture(frameID, x);
            x++;
            placeMessageBox(frameID, newMessage); 
        } else {
            //check another new message
            x++;
            checkNewMessage();
        }
    } else{
        x = 0;
    }
}
 //TODO in place message box als newMessage een lege string is heel dat ding verwijderen
 //ook in picture

function checkNewPicture(photoFrameID, index){
    newPicture = document.getElementsByClassName('picture-facebook')[index].innerHTML;
    newPicture = newPicture.replace('amp;amp;','');
    console.log(newPicture);
    //"https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-xft1/v/t1.0-9/10660283_865921100147683_8777487066525882489_n.jpg?oh=0fa6e12d9d303c83e43156efa4486a22&oe=55F165D3&__gda__=1438981977_48d0a01d9413501113336d4ba2839d97"
    if(newPicture != ""){
        placePicture(photoFrameID, newPicture); 
    } else {
        //remove!
    }
}


function cursorGrab(selector){
    $(selector).hover(function() {
        $(selector).css( 'cursor', '-moz-grab' );
        $(selector).css( 'cursor', '-moz-grabbing;' );
        $(selector).css( 'cursor', '-webkit-grab' );
        $(selector).css( 'cursor', '-webkit-grabbing' );
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
    // do something to let grandma know that is recording?
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
    console.log("space"); //space bar
        showSaved();
    } else if (event.keyCode==86){ //v
        saved = false;
        returnInitializers();
    }
    else if (event.keyCode == 77) {
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
    }
    //else if(event.keyCode==73){ // i van image
    //    placePicture("#photoFrame0", "https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-xft1/v/t1.0-9/10660283_865921100147683_8777487066525882489_n.jpg?oh=0fa6e12d9d303c83e43156efa4486a22&oe=55F165D3&__gda__=1438981977_48d0a01d9413501113336d4ba2839d97");
    //}
};

window.onkeyup = function(event) {
    lastEvent = null;
    delete heldKeys[event.keyCode];
    console.log('up');
    recognition.stop();
};


/*
function startRecording() {
      final_transcript = '';
      recognition.lang = 'en-US';
      recognition.start();
      ignore_onend = false;
      final_span.innerHTML = '';
      interim_span.innerHTML = '';
      start_timestamp = event.timeStamp;
};

window.onkeydown = function(e){
    if(e.keyCode == 81){ // q
        startRecording();
        console.log('start');
    } else if (e.keyCode==87){ //w
        console.log('stop');
        recognition.stop();
    } 
}
*/







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
        },
    "html");
        }
    }, 20000);
    
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
            $.get("/friends/like_part.js", "html");
            console.log("yes");

            }   

        ec.clearEmotions();
    }, 2000);

    startVideo();   
});





