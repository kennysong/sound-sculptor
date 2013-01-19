var pausedFrame = null;
var latestFrame = null;
var pointables = null;

window.onkeypress = function(e) {
	if (e.charCode == 32) {
		if (pausedFrame == null) {
			pausedFrame = latestFrame;
		} else {
			pausedFrame = null;
		}
	}
}
Leap.loop(function(frame) {
	latestFrame = frame;
	var pointers = new Array();
	for (var i = 0; i < ((pausedFrame || latestFrame).pointers).length; i++) {
		var coords = {};
		var pos = ((pausedFrame || latestFrame).pointers)[i].tipPosition;
		coords['x'] = pos[0];
		coords['y'] = pos[1];
		coords['z'] = pos[2];
		pointers[i] = coords;
	}
	pointables = pointers;

	var stringed = "";
	for (var i in pointers) {
		stringed += JSON.stringify(pointers[i]);
	}
	document.getElementById('out').innerHTML = (pausedFrame ? "<p><b>PAUSED</b></p>" : "") + stringed;
})
