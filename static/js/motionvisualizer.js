var canvas;
var stage;
var circleCount = 20;
var text;
var pointerVisuals;
var inited = false;

var LEAP_X_RANGE = 360, //x leapCoords range from -180 to 180
    LEAP_Y_RANGE = 460; //y leapCoords range from 0 to 460

var CANVAS_WIDTH = 960,
    CANVAS_HEIGHT = 400;

$(document).ready(init);

function init() {
  if (window.top != window) {
    document.getElementById("header").style.display = "none";
  }

  canvas = document.getElementById("interfaceCanvas");
  // CANVAS_WIDTH = $("#interfaceCanvas").width();
  // CANVAS_HEIGHT = $("#interfaceCanvas").height();

  stage = new createjs.Stage(canvas);
  stage.enableMouseOver(10);

  pointerVisuals = [];

  createjs.Touch.enable(stage);
  createjs.Ticker.addListener(window);

  inited = true;
}

function handleLeapMove(leapCoords) {
  var coords = leapCoordsToPixels(leapCoords);
  // if(coords[0])
  //   console.log('x: ' + coords[0].x + ', y: ' + coords[0].y);

  for(var i = 0; i < coords.length; i++) {
    if(pointerVisuals[i]) {
      pointerVisuals[i].moveTo({'x': coords[i].x, 'y': coords[i].y});
    }
    else {
      pointerVisuals.push(new PointerVisual({'x': coords[i].x, 'y': coords[i].y}));
    }
  }

  //this loop runs when there are fewer pointers this frame than last
  for(var i = coords.length; i < pointerVisuals.length; i++) {
    console.log('about to destroy visual ' + i);
    pointerVisuals[i].destroy();
    pointerVisuals.splice(i, 1);
  }

  if(coords.length == 0) {
    stage.clear();  
  }
}

function leapCoordsToPixels(leapCoords) {
  var result = [];

  // if(leapCoords[0]) {
  //   console.log('x: ' + leapCoords[0].x + ', y: ' + leapCoords[0].y);
  //   console.log("canvas_width" + (CANVAS_WIDTH));
  // }

  var coords, newx, newy;
  for(var i = 0; i < leapCoords.length; i++) {
    coords = leapCoords[i];
    newx = (coords.x + (LEAP_X_RANGE / 2)) * (CANVAS_WIDTH / LEAP_X_RANGE);
    newy = (LEAP_Y_RANGE - coords.y) * (CANVAS_HEIGHT / LEAP_Y_RANGE);
    result.push({'x': newx, 'y': newy});
  }

  return result;
}

function tick() {
    if (pointerVisuals[0] && pointerVisuals[0].activeCount) { 
      stage.update(); 
    }
}

function PointerVisual(coords) {
  this.tweens = [];
  this.activeCount = circleCount;

  this.tweenComplete = function() {
    this.activeCount--;
  }

  this.moveTo = function(coords) {
    // console.log("moving to: ");
    // console.log(coords);

    for (var i=0; i<circleCount; i++) {
      var ref = this.tweens[i].ref;
      var tween = this.tweens[i].tween;
      createjs.Tween.get(ref,{override:true}).to({x:coords.x,y:coords.y}, (0.5+i*0.12)*1000, createjs.Ease.elasticOut).call($.proxy(this.tweenComplete, this));
    }
    this.activeCount = circleCount;
  }

  this.destroy = function() {
    for(var i = 0; i < this.tweens.length; i++) {
      stage.removeChild(this.tweens[i].ref);
    }
  }

  //make the concentric circles:
  for (var i=0; i<circleCount; i++) {
      // draw the circle, and put it on stage:
      var circle = new createjs.Shape();
      circle.graphics.setStrokeStyle(15);
      circle.graphics.beginStroke("#113355");
      circle.graphics.drawCircle(0,0,(i+1)*4);
      circle.alpha = 1-i*0.02;
      circle.x = coords.x;
      circle.y = coords.y;
      circle.compositeOperation = "lighter";

      var tween = createjs.Tween.get(circle).to({x:circle.x,y:circle.y}, (0.5+i*0.12)*1000, createjs.Ease.elasticOut).call($.proxy(this.tweenComplete, this));
      this.tweens.push({tween:tween, ref:circle});
      stage.addChild(circle);
  }
}

Leap.loop(function(frame) {
  var pointables = new Array();
  for (var i = 0; i < frame.pointables.length; i++) {
    var coords = {};
    var pos = (frame.pointables)[i].tipPosition;
    coords['x'] = pos[0];
    coords['y'] = pos[1];
    coords['z'] = pos[2];
    pointables[i] = coords;
  }

  if(inited)
    handleLeapMove(pointables);
});
