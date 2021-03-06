/*
	gb_sandavl.js
	Sandpile avalanche simulation based on grid model

	Sparisoma Viridi | dudung@gmail.com
	Zahrotul Firdaus Tri Wahyu Lestari | firdauszahrotul@gmail.com

	20180623
	Create this based on tdsbgm.js application as template.
	20180625
	Continue this in RCNP, Osaka University, Osaka, Japan.
	20180626
	Continue from room in RCNP to lab.
	20180627
	Integrate Pile to butiran.js and add phase 5 for mimicing
	experiment results.
	20180929
	Change name according to new naming convention.
	CDN https://rawgit.com/dudung/butiran/master/app
	/gb_sandavl.html
	20181120
	Changet to JS.
*/

// Define some global variables
var tabs1, tabs2, bgroup;
var proc, tbeg, tend, dt, Tdata, tt, sample;
var coordMin, coordMax;
var pile, pilePhase;
var phase, probL, probR, probU, probD;
var probSol, probLiq, probGas, probGra;
var dryLayer, dryPeriod, nextLayer, thickness;
var clear = true;

// Call main function
main();

// Define main function
function main() {
	// Set layout of elements
	setLayout();

	// Log something
	log();

	// Set timer for processing simulation
	proc = new Timer(simulate, 1);
}

// Perform simulation
function simulate() {
	// Format time t
	t = +t.toFixed(10);

	// Manipulate Pile
	if(phase == 0) {
		manipulate(pile).as("gas");
	} else if(phase == 1) {
		manipulate(pile).as("fluid");
	} else if(phase == 2){
		manipulate(pile).as("solid");
	} else if(phase == 3) {
		manipulate(pile).as("granular");
	} else if(phase == 4){
		manipulate(pile).as("granular2");
	} else if(phase == 5){
		manipulate(pile).as("granular-solid");
	}

	// Display result in certain period of time
	if(sample.sampling()) {
		tt = ((t - tbeg) / (tend - tbeg));
		tt = +tt.toFixed(10);
		var data = tt + " "
			+ "";
		tabs1.text("Results").push(data);
		var textarea = tabs1.element("Results");
		textarea.scrollTop = textarea.scrollHeight;

		drawPile(pile).on("xy");
	}
	
	if(nextLayer.sampling()) {
		evolveDryLayer();
	}

	// Terminate simulation when end time is reached
	if(t >= tend) {
		proc.stop();
		var ts = Timer.ts() + "|";
		tabs1.text("Log").push(ts + "Simulation stopped t = tend");
		bgroup.disable("Start");
		bgroup.setCaption("Start").to("Start");
		bgroup.enable("Draw");
	}

	// Increase time t
	t += dt;
}

// Manipulate Pile
function manipulate(p) {
	var retval = {
		as: function(state) {
			var msg;
			if(state == "gas") {
				algorithmGas(p);
			} else if(state == "fluid") {
				algorithmFluid(p);
			} else if(state == "solid") {
				algorithmSolid(p);
			} else if(state == "granular") {
				algorithmGranular(p);
			} else if(state == "granular2") {
				algorithmGranular2(p);
			} else if(state == "granular-solid") {
				algorithmGranularSolid(p);
			}
		}
	};
	return retval;
}

// Define algorithm for different state -- only for 2-d -- gas
function algorithmGas(p) {
	// Preapare value of Pile
	var Ndir = 8;
	var Nx = p.Nx;
	var Ny = p.Ny;
	var grid = p.value;

	// Move grid of grain
	for(var iy = 0; iy < Ny; iy++) {
		for(var ix = 0; ix < Nx; ix++) {
			var grain = grid[iy][ix];
			if(grain == 1) {
				var mag = Random.randInt(0, 1);
				var dx = Random.randInt(-Ndir, +Ndir);
				var dy = Random.randInt(-Ndir, +Ndir);
				var newix = ix + dx * mag;
				var newiy = iy + dy * mag;
				var wallX = (newix < 0) || (newix > Nx - 1);
				var wallY = (newiy < 0) || (newiy > Ny - 1);
				if(!wallX && !wallY) {
					var newgrain = grid[newiy][newix];
					if(newgrain == 0) {
						grid[newiy][newix] = grid[iy][ix];
						grid[iy][ix] = 0;
					}
				}
			}
		}
	}
}

// Define algorithm for different state -- only for 2-d -- fluid
function algorithmFluid(p) {
	// Preapare value of Pile
	var Ndir = 8;
	var Nx = p.Nx;
	var Ny = p.Ny;
	var grid = p.value;

	// Move grid of grain
	for(var iy = 0; iy < Ny; iy++) {
		for(var ix = 0; ix < Nx; ix++) {
			var grain = grid[iy][ix];
			if(grain == 1) {
				var mag = Random.randInt(0, 1);
				var dx = Random.randInt(-Ndir, +Ndir);
				var dy = Random.randInt(-Ndir, 0.5 * Ndir);
				var newix = ix + dx * mag;
				var newiy = iy + dy * mag;
				var wallX = (newix < 0) || (newix > Nx - 1);
				var wallY = (newiy < 0) || (newiy > Ny - 1);
				if(!wallX && !wallY) {
					var newgrain = grid[newiy][newix];
					if(newgrain == 0) {
						grid[newiy][newix] = grid[iy][ix];
						grid[iy][ix] = 0;
					}
				}
			}
		}
	}
}

// Define algorithm for different state -- only for 2-d -- solid
function algorithmSolid(p) {
}

// Define algorithm for different state -- only for 2-d -- granular
function algorithmGranular(p) {
	// Preapare value of Pile
	var Ndir = 8;
	var Nx = p.Nx;
	var Ny = p.Ny;
	var grid = p.value;

	// Move grid of grain
	for(var iy = 0; iy < Ny; iy++) {
		for(var ix = 0; ix < Nx; ix++) {
			var grain = grid[iy][ix];
			if(grain == 1) {

				var mag = Random.randInt(0, 1);
				var dx = Random.randInt(-0.5 * Ndir, +0.5 * Ndir);
				var dy = Random.randInt(-Ndir, -0.5 * Ndir);

				var newix = ix + dx * mag;
				var newiy = iy + dy * mag;
				var wallX = (newix < 0) || (newix > Nx - 1);
				var wallY = (newiy < 0) || (newiy > Ny - 1);
				if(!wallX && !wallY) {
					var newgrain = grid[newiy][newix];
					if(newgrain == 0) {
						grid[newiy][newix] = grid[iy][ix];
						grid[iy][ix] = 0;
					}
				}
			}
		}
	}
}

// Define algorithm for different state -- only for 2-d -- granular
function algorithmGranular2(p) {
	// Preapare value of Pile
	var Ndir = 8;
	var Nx = p.Nx;
	var Ny = p.Ny;
	var grid = p.value;

	// Move grid of grain
	for(var iy = 0; iy < Ny; iy++) {
		for(var ix = 0; ix < Nx; ix++) {
			var grain = grid[iy][ix];
			if(grain == 1) {
				var mag = Random.randInt(0, 1);
				var dx = Random.randInt(probL * Ndir, probR * Ndir);
				var dy = Random.randInt(probD * Ndir, probU * Ndir);
				var newix = ix + dx * mag;
				var newiy = iy + dy * mag;
				var wallX = (newix < 0) || (newix > Nx - 1);
				var wallY = (newiy < 0) || (newiy > Ny - 1);
				if(!wallX && !wallY) {
					var newgrain = grid[newiy][newix];
					if(newgrain == 0) {
						grid[newiy][newix] = grid[iy][ix];
						grid[iy][ix] = 0;
					}
				}
			}
		}
	}
}

// Define algorithm for granular-solid
function algorithmGranularSolid(p) {
	// Preapare value of Pile
	var Ndir = 8;
	var Nx = p.Nx;
	var Ny = p.Ny;
	var grid = p.value;
	
	// Move grid of grain
	for(var iy = 0; iy < Ny; iy++) {
		for(var ix = 0; ix < Nx; ix++) {
			var grain = grid[iy][ix];
			if(grain == 1) {
				
				var cellPhase = pilePhase.value[iy][ix];
				var inSolid = (cellPhase == 2) ? true : false;
				
				var probL, probR, probU, probD;
				if(inSolid) {
					probL = probSol[0];
					probR = probSol[1];
					probU = probSol[2];
					probD = probSol[3];
				} else {
					probL = probGra[0];
					probR = probGra[1];
					probU = probGra[2];
					probD = probGra[3];
				}
				
				var mag = Random.randInt(0, 1);
				var dx = Random.randInt(probL * Ndir, probR * Ndir);
				var dy = Random.randInt(probD * Ndir, probU * Ndir);
				var newix = ix + dx * mag;
				var newiy = iy + dy * mag;
				var wallX = (newix < 0) || (newix > Nx - 1);
				var wallY = (newiy < 0) || (newiy > Ny - 1);
				if(!wallX && !wallY) {
					var newgrain = grid[newiy][newix];
					if(newgrain == 0) {
						grid[newiy][newix] = grid[iy][ix];
						grid[iy][ix] = 0;
					}
				}
			}
		}
	}
}

// Evolve dry layer
function evolveDryLayer() {
	var text = tabs1.element("Params").value;
	var Nx = Parse.getFrom(text).valueOf("SIZEX");
	var Ny = Parse.getFrom(text).valueOf("SIZEY");
	var xbeg = Parse.getFrom(text).valueOf("BXBEG").x;
	var xend = Parse.getFrom(text).valueOf("BXEND").x;
	var ybeg = Parse.getFrom(text).valueOf("BXBEG").y;
	var yend = Parse.getFrom(text).valueOf("BXEND").y;
	
	// Pile for storing probSol and probGra
	pilePhase.setFill(3); // granular
	pilePhase.fillGrid([0, Nx-1], [0, Ny-1]);
	pilePhase.setFill(2); // solid
	thickness += dryLayer;
	var th = thickness;
	pilePhase.fillGrid([xbeg+th, xend-th], [ybeg, yend-th]);
}

// Draw Pile
function drawPile(p) {
	var isPile = p instanceof Pile;
	if(isPile) {
		var retval = {
			on: function(label) {
				tabs2.graphic(label).clear();
				for(var iy = 0; iy < p.Ny; iy++) {
					for(var ix = 0; ix < p.Nx; ix++) {
						var cR, cG, cB;
						var state = pilePhase.value[iy][ix];
						if(state == 0) {
							// Set color of gas
							cR = 1;
							cG = 0;
							cB = 0;
						} else if(state == 1) {
							// Set color of fluid
							cR = 0;
							cG = 0;
							cB = 1;
						} else if(state == 2) {
							// Set color of solid
							cR = 0;
							cG = 0;
							cB = 0;
						} else if(state == 3) {
							// Set color of granular
							cR = 0.5;
							cG = 0.5;
							cB = 0.5;
						}
						
						// Set color
						var col = RGB.double2rgb(cR, cG, cB);
						
						// Omit empty grid
						if(p.value[iy][ix] == 0) {
							col = RGB.double2rgb(1, 1, 1);
						}
						tabs2.graphic(label).setFillColor(col);
						tabs2.graphic(label).fillRect(ix, iy, 1.07, 1.07);
					}
				}
			}
		}
		return retval;
	}
}

// Set layout of elements
function setLayout() {
	// Create title page
	var p = document.createElement("p");
	p.innerHTML = "Sandpile avalanche simulation based on grid model";
	p.style.fontWeight = "bold";
	document.body.append(p);

	// Define first Tabs
	tabs1 = new Tabs("tabs1");
	tabs1.setWidth("300px");
	tabs1.setHeight("300px");
	tabs1.addTab("Log", 0);
	tabs1.addTab("Params", 0);
	tabs1.addTab("Results", 0);

	// Define second Tabs
	tabs2 = new Tabs("tabs2");
	tabs2.setWidth("300px");
	tabs2.setHeight("300px");
	tabs2.addTab("xy", 1);

	// Clear all tabs
	tabs1.text("Params").clear();
	tabs1.text("Results").clear();
	tabs1.text("Log").clear();
	tabs2.graphic("xy").clear();

	// Define bgroup
	bgroup = new Bgroup("bgroup");
	bgroup.setWidth("60px");
	bgroup.setHeight("147px");
	bgroup.addButton("Clear");
	bgroup.addButton("Load");
	bgroup.addButton("Read");
	bgroup.addButton("Start");
	bgroup.addButton("Draw");
	bgroup.addButton("Help");
	bgroup.addButton("About");
	bgroup.disable("Read");
	bgroup.disable("Start");
	bgroup.disable("Draw");
}

// Load parameters
function loadParameters() {
	tabs1.text("Params").push("SIZEX 300");
	tabs1.text("Params").push("SIZEY 300");
	tabs1.text("Params").push("BXBEG 100 0 0");
	tabs1.text("Params").push("BXEND 199 199 0");
	tabs1.text("Params").push();
	tabs1.text("Params").push("PHASE 5");
	tabs1.text("Params").push("PROBL -1");
	tabs1.text("Params").push("PROBR +1");
	tabs1.text("Params").push("PROBU +1");
	tabs1.text("Params").push("PROBD -1");
	tabs1.text("Params").push();
	tabs1.text("Params").push("PROBSOL 0 0 0 0");
	tabs1.text("Params").push("PROBLIQ -1 1 0.5 -1");
	tabs1.text("Params").push("PROBGAS -1 1 1 -1");
	tabs1.text("Params").push("PROBGRA -0.5 0.5 0 -1");
	tabs1.text("Params").push("DRYLAYER 10");
	tabs1.text("Params").push("DRYPERIOD 500");
	tabs1.text("Params").push();
	tabs1.text("Params").push("TSTEP 1");
	tabs1.text("Params").push("TDATA 10");
	tabs1.text("Params").push("TBEG 0");
	tabs1.text("Params").push("TEND 10000");
	tabs1.text("Params").push();
	tabs1.text("Params").push("COORDMIN 0 0 0");
	tabs1.text("Params").push("COORDMAX 300 300 1");
	var ta = tabs1.element("Params");
	ta.scrollTop = ta.scrollHeight;
}

// Get parameters
function readParameters() {
	var text = tabs1.element("Params").value;
	var Nx = Parse.getFrom(text).valueOf("SIZEX");
	var Ny = Parse.getFrom(text).valueOf("SIZEY");
	var Nz = Parse.getFrom(text).valueOf("SIZEZ");
	var xbeg = Parse.getFrom(text).valueOf("BXBEG").x;
	var xend = Parse.getFrom(text).valueOf("BXEND").x;
	var ybeg = Parse.getFrom(text).valueOf("BXBEG").y;
	var yend = Parse.getFrom(text).valueOf("BXEND").y;
	phase = Parse.getFrom(text).valueOf("PHASE");
	tbeg = Parse.getFrom(text).valueOf("TBEG");
	tend = Parse.getFrom(text).valueOf("TEND");
	dt = Parse.getFrom(text).valueOf("TSTEP");
	Tdata = Parse.getFrom(text).valueOf("TDATA");
	coordMin = Parse.getFrom(text).valueOf("COORDMIN");
	coordMax = Parse.getFrom(text).valueOf("COORDMAX");

	if(phase == 4) {
		probL = Parse.getFrom(text).valueOf("PROBL");
		probR = Parse.getFrom(text).valueOf("PROBR");
		probU = Parse.getFrom(text).valueOf("PROBU");
		probD = Parse.getFrom(text).valueOf("PROBD");
	}
	
	// Add additional parameters for nonuniform rate of
	// evaporation (probL, probR, propU, probD are now
	// time and space dependent)
	if(phase == 5) {
		probSol = Parse.getFrom(text).valueOf("PROBSOL");
		probLiq = Parse.getFrom(text).valueOf("PROBLIQ");
		probGas = Parse.getFrom(text).valueOf("PROBGAS");
		probGra = Parse.getFrom(text).valueOf("PROBGRA");
		dryLayer = Parse.getFrom(text).valueOf("DRYLAYER");
		dryPeriod = Parse.getFrom(text).valueOf("DRYPERIOD");
	}

	if(clear) {
		// Define pile with parameters
		pile = new Pile(Nx, Ny);
		pile.fillGrid([xbeg, xend], [ybeg, yend]);
		pilePhase = new Pile(Nx, Ny);
		thickness = -dryLayer;
		evolveDryLayer();
		
		// Initiate time
		t = tbeg;

		// Set sampling
		sample = new Sample(Tdata, dt);
		nextLayer = new Sample(dryPeriod, dt);
		
	}

	// Set coordinate ranges
	tabs2.graphic("xy").setCoord(
		[coordMin.x, coordMin.y, coordMax.x, coordMax.y]);
}

// Log something and show manually
function log() {
	try {
		console.log(
			showOnly(logjs).forFilter(
				{
					app: "sasbgm",
					date: "20180627",
					after: "1100",
				}
			)
		);
	}
	catch(err) {
		var msg = "sasbgp logs only in development stage";
		console.warn(msg);
	}
}

// Do something when buttons clicked
function buttonClick(event) {
	var target = event.target;

	if(target.innerHTML == "Start") {
		target.innerHTML = "Stop";
		proc.start();
		var ts = Timer.ts() + "|";
		tabs1.text("Log").push(ts + "Simulation is starting");
		var ta = tabs1.element("Log");
		ta.scrollTop = ta.scrollHeight;
		bgroup.disable("Draw");
	} else if(target.innerHTML == "Stop"){
		target.innerHTML = "Start";
		proc.stop();
		var ts = Timer.ts() + "|";
		tabs1.text("Log").push(ts + "Simulation stopped");
		var ta = tabs1.element("Log");
		ta.scrollTop = ta.scrollHeight;
		bgroup.enable("Draw");
		clear = false;
	}

	if(target.innerHTML == "About") {
		alert(
			"sasbgm | "
			+ "Sandpile avalanche simulation based on grid model"
			+ "\n"
			+ "Version 20180623"
			+ "\n"
			+ "Sparisoma Viridi | dudung@gmail.com"
			+ "\n"
			+ "Zahrotul Firdaus Tri Wahyu Lestari | "
			+ "firdauszahrotul@gmail.com"
			+ "\n"
			+ "\n"
			+ "Based on butiran "
			+ " | https://github.com/dudung/butiran"
			+ "\n"
			+ "MIT License | "
			+ "Copyright (c) 2018 Sparisoma Viridi"
		);
		var ts = Timer.ts() + "|";
		tabs1.text("Log").push(ts + "About is called");
		var ta = tabs1.element("Log");
		ta.scrollTop = ta.scrollHeight;
	}

	if(target.innerHTML == "Help") {
		alert(""
			+ "[Clear]    clear all text and graphic\n"
			+ "[Load]     load default parameters\n"
			+ "[Read]     read parameters from text\n"
			+ "[Start]     start simulation\n"
			+ "[Draw]     draw results\n"
			+ "[Help]     show this help\n"
			+ "[About]   describe this application\n"
		);
		var ts = Timer.ts() + "|";
		tabs1.text("Log").push(ts + "Help is called");
		var ta = tabs1.element("Log");
		ta.scrollTop = ta.scrollHeight;
	}

	if(target.innerHTML == "Load") {
		tabs1.text("Params").clear();
		loadParameters();
		var ts = Timer.ts() + "|";
		tabs1.text("Log").push(ts + "Default parameters are loaded");
		var ta = tabs1.element("Log");
		ta.scrollTop = ta.scrollHeight;
		bgroup.enable("Read");
	}

	if(target.innerHTML == "Read") {
		readParameters();
		var ts = Timer.ts() + "|";
		tabs1.text("Log").push(ts + "Parameters are read");
		var ta = tabs1.element("Log");
		ta.scrollTop = ta.scrollHeight;
		bgroup.enable("Start");
	}

	if(target.innerHTML == "Clear") {
		tabs1.text("Params").clear();
		tabs1.text("Results").clear();
		tabs1.text("Log").clear();
		tabs2.graphic("xy").clear();
		var ts = Timer.ts() + "|";
		tabs1.text("Log").push(ts + "Parameters, Results, "
			+ "and Log are cleared");
		tabs1.text("Log").push(ts + "xy is cleared");
		var ta = tabs1.element("Log");
		ta.scrollTop = ta.scrollHeight;
		bgroup.disable("Read");
		bgroup.disable("Start");
		clear = true;
	}

	if(target.innerHTML == "Draw") {
		drawResults();
		var ts = Timer.ts() + "|";
		tabs1.text("Log").push(ts + "Results will be drawn");
		var ta = tabs1.element("Log");
		ta.scrollTop = ta.scrollHeight;
	}
}

// Draw on chart
function drawResults() {
	// Get results
	var text = tabs1.element("Results").value;
	var tt = Parse.getFrom(text).column(0);

	// Draw on related chart
	tabs2.graphic("xy").clear();
	tabs2.graphic("xy").setLineColor("#f00");
}
