var planets = {
  mercury: {
    color: 0xFFFFFF,
    radius: 2440,
    orbitRadius: 5.79*Math.pow(10,7),
    yearLength: 0.241,
    moons: []
  },

  venus: {
    color: 0xFFFF00,
    radius: 6052,
    orbitRadius: 1.08*Math.pow(10,8),
    yearLength: 0.616,
    moons: []
  },

  earth: {
    color: 0x0055FF,
    radius: 6371,
    orbitRadius: 1.50*Math.pow(10,8),
    yearLength: 1.0,
    moons: {
      moon: {
        color: 0xD3D3D3,
        radius: 1737,
        orbitRadius: 385000,
        yearLength: 0.0833
      }
    }
  },

  mars: {
    color: 0xFF5555,
    radius: 3390,
    orbitRadius: 2.28*Math.pow(10,8),
    yearLength: 1.88,
    moons: {
      phobos: {
        color: 0xD3D3D3,
        radius: 11.1,
        orbitRadius: 6000,
        yearLength: 0.000913
      },
      deimos: {
        color: 0xD3D3D3,
        radius: 6.2,
        orbitRadius: 23460,
        yearLength: 0.00342
      }
    }
  }
};

//fixed position
var sun = {
  radius: 6.96*Math.pow(10,5),
  color:  0xFF5500
};

var kmPerPixelScale = {
  moonOrbit:    15000,
  planetOrbit:  5*Math.pow(10,5),
  moonRadius:   320,
  planetRadius: 320,
  sunRadius:    16000
};

var borderColor = {
  sun: 0xFF0000,
  planet: 0x00FF00,
  moon: 0x0000FF
};

var borderThickness = {
  sun:    4,
  planet: 3,
  moon:   2
};

var app = new PIXI.Application({width: 1200, height: 900, antialias: true, resolution: 1});

document.body.appendChild(app.view);

//initialize initial orbit angle of each orbiting body to 0
for (let planet in planets) {
  planets[planet].radians = Math.random()*2.0*Math.PI;
  for (let moon in planets[planet].moons) {
    planets[planet].moons[moon].radians = Math.random()*2.0*Math.PI;
  }
}

//initialize the shapes representing the planets and moons
for (let planet in planets) {
  planets[planet].graphics = new PIXI.Graphics();

  planets[planet].graphics.beginFill(planets[planet].color);
  planets[planet].graphics.lineStyle(borderThickness.planet,borderColor.planet,1);
  planets[planet].graphics.drawCircle(0,0,planets[planet].radius/kmPerPixelScale.planetRadius+1); //add 1 to lower-bound radius
  planets[planet].graphics.endFill();

  app.stage.addChild(planets[planet].graphics);

  for (let moon in planets[planet].moons) {
    planets[planet].moons[moon].graphics = new PIXI.Graphics();

    planets[planet].moons[moon].graphics.beginFill(planets[planet].moons[moon].color);
    planets[planet].moons[moon].graphics.lineStyle(borderThickness.moon,borderColor.moon,1);
    planets[planet].moons[moon].graphics.drawCircle(0,0,planets[planet].moons[moon].radius/kmPerPixelScale.moonRadius+1); //add 1 to lower-bound radius
    planets[planet].moons[moon].graphics.endFill();

    app.stage.addChild(planets[planet].moons[moon].graphics);
  }
}

//initialize the shape and set a fixed position for the sun
sun.position = {};
sun.position.x = app.renderer.width/2;
sun.position.y = app.renderer.height/2;

sun.graphics = new PIXI.Graphics();

sun.graphics.beginFill(sun.color);
sun.graphics.lineStyle(borderThickness.sun,borderColor.sun,1);
sun.graphics.drawCircle(sun.position.x,sun.position.y,sun.radius/kmPerPixelScale.sunRadius);
sun.graphics.endFill();

app.stage.addChild(sun.graphics);

app.ticker.add(function(delta) {
  var trueTime = delta / 60 / 60; //1 year = 1 minute

  for (let planet in planets) {
    planets[planet].radians += (1/planets[planet].yearLength)*trueTime*2*Math.PI;
    planets[planet].graphics.x = sun.position.x + (sun.radius/kmPerPixelScale.sunRadius + planets[planet].orbitRadius/kmPerPixelScale.planetOrbit)*Math.cos(planets[planet].radians);
    planets[planet].graphics.y = sun.position.y - (sun.radius/kmPerPixelScale.sunRadius + planets[planet].orbitRadius/kmPerPixelScale.planetOrbit)*Math.sin(planets[planet].radians);

    for (let moon in planets[planet].moons) {
      planets[planet].moons[moon].radians += (1/planets[planet].moons[moon].yearLength)*trueTime*2*Math.PI;
      planets[planet].moons[moon].graphics.x = planets[planet].graphics.x + (borderThickness.planet + borderThickness.moon + planets[planet].radius/kmPerPixelScale.planetRadius + planets[planet].moons[moon].orbitRadius/kmPerPixelScale.moonOrbit)*Math.cos(planets[planet].moons[moon].radians);
      planets[planet].moons[moon].graphics.y = planets[planet].graphics.y - (borderThickness.planet + borderThickness.moon + planets[planet].radius/kmPerPixelScale.planetRadius + planets[planet].moons[moon].orbitRadius/kmPerPixelScale.moonOrbit)*Math.sin(planets[planet].moons[moon].radians);
    }
  }
});
