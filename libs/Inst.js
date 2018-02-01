// INST
var INST = function(){

	var version = "";

	//tally up the loading
	var totalLoad = 0;
	for (var i in KEYMAP){
		totalLoad++;
	}

	function initialize(){
		console.log("Juicy's Life instrument !");
		makeKeys();
	}

	//all the piano keys

	function makeKeys(){
		for (var id in KEYMAP){
			new INST.KEY(id);
		}
	}

	var loadCount = 0;

	//called when a load is resolved
	function loadResolved(){
		loadCount++;
		if (loadCount === totalLoad*2){
			allLoaded();
		}
	}

	function allLoaded(){
		INST.loaded = true;
	}

	return {
		initialize : initialize,
		loadResolved : loadResolved,
		loaded : false
	}
}();
