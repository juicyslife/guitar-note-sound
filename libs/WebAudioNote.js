
// INST AUDIO

INST.AUDIO = function(){
    //API
    return {
        initialize : function(){
            INST.initialize();
        },
        //xhr management
        createXHR : function(url, callback){
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            // Decode asynchronously
            request.onload = function() {
                INST.AUDIO.context.decodeAudioData(request.response, function(buffer) {
                    callback(buffer);
                    INST.loadResolved();
                }, function(){
                    throw Error("Audio couldn't load!");
                });
            }
            request.send();
        },
        //the audio context
        context : window.AudioContext ? new window.AudioContext() : new window.webkitAudioContext(),
        canPlayMP3 : function(){
            var audio  = document.createElement("audio");
            return audio.canPlayType && audio.canPlayType("audio/mpeg") !== "";
        },
        canPlayOGG : function(){
            var audio  = document.createElement("audio");
            return audio.canPlayType && audio.canPlayType("audio/ogg") !== "";
        }
    }
}();


// plays the audio
INST.PLAYER = function(key){
    this.buffer = null;
    this.key = key;
    this.source = null;
    var audioFile = KEYMAP[key.id].audio;

    if (INST.AUDIO.canPlayMP3()) {
        var url = './tabs/'+audioFile+".mp3";
    } else if (INST.AUDIO.canPlayOGG()){
        var url = './tabs/'+audioFile+".ogg";
    } else {
        var url = './tabs/'+audioFile+".m4a";
    }
    INST.AUDIO.createXHR(url, $.proxy(this.bufferLoaded, this));
}

//called when teh buffer is loaded
INST.PLAYER.prototype.bufferLoaded = function(buffer){
    this.buffer = buffer;
}

//play the note
INST.PLAYER.prototype.startNote = function(){
    this.source = INST.AUDIO.context.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(INST.AUDIO.context.destination);
    if ($.type(this.source.start) === "function") {
        this.source.start(0);
    } else {
        this.source.noteOn(0);
    }
    //invoke the callback at the end of the buffer
    var duration = this.buffer.duration;
    var that = this;
}

//stop the note
INST.PLAYER.prototype.endNote = function(){

    this.source.stop(0);
}



/*
INST KEY
 trigger a sound when clicked
 */
INST.KEY = function(id){
    this.id = id;
    //setup the dom
    this.dom = new INST.DOM(this);
    //setup the sound
    this.sound = new INST.PLAYER(this);
}

//called when a key is clicked
INST.KEY.prototype.startNote = function(){
    this.sound.startNote();
}

//called when the sound is done playing
INST.KEY.prototype.endNote = function(){
    this.sound.endNote();
}

/*
 dom interaction
 */
INST.DOM = function(key){
    this.key = key;
    //get the dom el
    this.$el = $("#"+key.id);
    //boolean value if the key is currently down to prevent multiple keyclicks while down
    this.isDown = false;
    //listen for keypresses
    var that = this;

    $(document).keydown(function(e){
        var whichKey = KEYMAP[key.id].keyCode;
        if (e.which === whichKey && INST.loaded && !that.isDown){
            e.preventDefault();
            that.isDown = true;
            that.startNote();
        }
    });
    $(document).keyup(function(e){
        var whichKey = KEYMAP[key.id].keyCode;
        if (e.which === whichKey && INST.loaded){
            that.isDown = false;
            that.endNote();
        }
    });

    INST.loadResolved();
}


//called when the sound is started
INST.DOM.prototype.startNote = function(){
    this.key.startNote();
}

//called when the sound is done playing
INST.DOM.prototype.endNote = function(){
    // this.key.endNote();
}

//initialize the sound
INST.AUDIO.initialize();