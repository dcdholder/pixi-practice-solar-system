var app = new PIXI.Application({width: 800, height: 600, antialias: true, resolution: 1});

document.body.appendChild(app.view);

var moonOrbitDistance  = 50;
var moonRadius         = 10;
var moonRevolutionTime = 5;
var moonRadians        = 0;

var earthOrbitDistance  = 150;
var earthRadius         = 20;
var earthRevolutionTime = 60;
var earthRadians        = 0;

var sunRadius = 40;

var sunPosition = {
  x: app.renderer.width/2,
  y: app.renderer.height/2
};

var earthPosition = {
  x: app.renderer.width/2+earthOrbitDistance,
  y: app.renderer.height/2
};

var moonPosition = {
  x: earthPosition.x+moonOrbitDistance,
  y: earthPosition.y
};

//moon
var moon = new PIXI.Graphics();

moon.beginFill(0xAAAAAA);
moon.lineStyle(3,0xFF0000,1);
moon.drawCircle(0,0,moonRadius);
moon.endFill();

app.stage.addChild(moon);

//earth
var earth = new PIXI.Graphics();

earth.beginFill(0x00FF00);
earth.lineStyle(3,0xFF00000,1);
earth.drawCircle(0,0,earthRadius);
earth.endFill();

app.stage.addChild(earth);

//sun
var sun = new PIXI.Graphics();

sun.beginFill(0xFF5500);
sun.lineStyle(3,0xFF00000,1);
sun.drawCircle(sunPosition.x,sunPosition.y,sunRadius);
sun.endFill();

app.stage.addChild(sun);

app.ticker.add(function(delta) {
  var trueTime = delta / 60;

  earthRadians += (1/earthRevolutionTime)*trueTime*2*Math.PI;
  moonRadians  += (1/moonRevolutionTime)*trueTime*2*Math.PI;

  earthPosition = {
    x: sunPosition.x + earthOrbitDistance*Math.cos(earthRadians),
    y: sunPosition.y - earthOrbitDistance*Math.sin(earthRadians)
  };

  moonPosition = {
    x: earthPosition.x + moonOrbitDistance*Math.cos(moonRadians),
    y: earthPosition.y - moonOrbitDistance*Math.sin(moonRadians)
  };

  moon.x = moonPosition.x;
  moon.y = moonPosition.y;

  earth.x = earthPosition.x;
  earth.y = earthPosition.y;
});
