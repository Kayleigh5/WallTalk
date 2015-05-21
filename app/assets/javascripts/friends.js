var colors = ["AliceBlue","Aqua","Aquamarine","Azure","Beige","Bisque","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DeepPink","DeepSkyBlue","DimGray","DodgerBlue","FireBrick","ForestGreen","Fuchsia","Gainsboro","Gold","GoldenRod","Gray","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","Lime", "Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","RebeccaPurple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];
var numberOfGrandChildren = 0;

$(document).ready(function(){
numberOfGrandChildren = document.getElementById('num').innerHTML;
if (numberOfGrandChildren > 0){
	console.log(numberOfGrandChildren);
	insertDiv();
}
});

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
	var count = 0;
	for(i=0; i<numberOfGrandChildren; i++){
		console.log(numberOfGrandChildren);	
		var randomName = document.getElementsByClassName('friend-name')[count].innerHTML;
		var message = document.getElementsByClassName('message')[count].innerHTML;
        
        count += 1;

		var divHTML = "<div class='divResizable' id='block" + ((numberOfGrandChildren-1)-i) + "'><p>"+randomName+"</p><p>"+message+"</p><div class='slider'></div></div>";
        $(divHTML).insertAfter("#initializeDiv");
		var randomIndex = Math.floor(Math.random() * colors.length);
		var randomColor = colors[randomIndex];		
		colors.remove(randomColor);
		var divID = "#block" + ((numberOfGrandChildren-1)-i);
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
	$( ".divResizable" ).draggable({ 
		containment: "body",
		drag: function(event, ui) {
        	$( "div" ).css({"float": "none"});
        	jQuery(this).css({"position" : "fixed"});
    	}
    });	
}

function fadeOutInitializers(){
    // The initializer handles are made invisible for the facebook message animation to begin
    $("p").css("opacity" , "0");
    $(".divResizable").css("border-color" , "black");
    $(".slider").css("opacity" , "0");
    $(".divResizable").css("resize", "none");
}
 
function returnInitializers(){
    // When you want to adjust the initializing step
    $("p").css("opacity" , "1");
    $(".divResizable").css("border-color" , "white");
    $(".slider").css("opacity" , "1");
    $(".divResizable").css("resize", "both");
}
 
function showSaved(){
    $("<p class='saved'>SAVED</p>").insertAfter("#block0");
    $( ".saved" ).animate({"opacity" : "1" }, "slow");
    $( ".saved" ).animate({"opacity" : "0" }, "slow ", function() {
       $(".saved").remove();
       saved = true;
       fadeOutInitializers();
    });
    
}
 
var overlaps = (function () {
    function getPositions( elem ) {
        var pos, width, height;
        pos = $( elem ).position();
        width = $( elem ).width();
        height = $( elem ).height();
        return [ [ pos.left, pos.left + width ], [ pos.top, pos.top + height ] ];
    }
 
    function comparePositions( p1, p2 ) {
        var r1, r2;
        r1 = p1[0] < p2[0] ? p1 : p2;
        r2 = p1[0] < p2[0] ? p2 : p1;
        return r1[1] > r2[0] || r1[0] === r2[0];
    }
 
    return function ( a, b ) {
        var pos1 = getPositions( a ),
            pos2 = getPositions( b );
        return comparePositions( pos1[0], pos2[0] ) && comparePositions( pos1[1], pos2[1] );
    };
}) ();
 
function getRandomBlockID(){
    // To get a random block to show a message on
    // This function should be deleted, and replaced with the facebook incoming id
    var blocks = document.getElementsByClassName("divResizable"); 
    var randomIndex = Math.floor(Math.random() * blocks.length);
    var randomName = blocks[randomIndex];
    console.log(randomName.id);
    queryString = "#"+randomName.id;
    return queryString;
}
 
function getRandomMessage(){
    // To get a random message to show
    // This function should be deleted, and replaced with the facebook incoming message
    var randomIndex = Math.floor(Math.random() * messages.length);
    var randomMessage = messages[randomIndex];
    return randomMessage;
}
 
function showMessage(blockID){
    var message = getRandomMessage();
    var queryString = "<p class='message'>" + message + "</p>";
    $(queryString).insertAfter(blockID);
}
 
function animateBorder(blockID) {        
   setTimeout(function () {   
        $(blockID).animate({
            "border-color": "white"
        }, blinkSpeed , function(){
            $(blockID).animate({
            "border-color": "black"
            }, blinkSpeed, function(){
                if (newIncomingMessage == blockID) {  
                    animateBorder(blockID);          
                }
            });
        });     
 
   }, blinkSpeed/4);
}
 
function newMessage(blockID){
    newIncomingMessage = blockID;
    animateBorder(blockID);
    showMessage(blockID);
}
 
window.onkeydown = function(e){
    if(e.keyCode==32){ //space bar
        showSaved();
    } else if (e.keyCode==70){ // f van facebook
        var blockID = getRandomBlockID();
        newMessage(blockID);
    } else if (e.keyCode==66){ // b
        returnInitializers();
    } else if (e.keyCode==84){ // t van test
        var block0 = $( '#block0' )[0];
        var block1 = $( '#block1' )[0];
        console.log(overlaps(block0, block1));
        // meaning of this: if the message overlaps with a block, change it?
    }
};
