/*
	md_opsebfs.js
	One particle in static electric and magnetic field
	
	Sparisoma Viridi | dudung@gmail.com
	Siti Nurul Khotimah | nurul@fi.itb.ac.id
	
	20180619
	Create this based on gstd.js application.
	Show the right images of xy, yz, xz.
	20180620
	Modify layout of the script, minor only, column < 64.
	Add CDN.
	20180623
	Apply revision from Siti Nurul Khotimah about clear, which
	should clear all as written in the help. Modify About menu
	and add second author.
	20180929
	Change name according to new naming convention.
	CDN https://rawgit.com/dudung/butiran/master/app
	/md_opsebfs.html
	20181120
	Change to JS.
*/

// Define some global variables
var m, q, r, v;
var EField, BField, GField;
var t, dt, tbeg, tend;
var Tdata, sample;
var proc;
var tabs1, tabs2, bgroup;
var coordMin, coordMax;

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
	
	// Calculate all forces
	var FE = Vect3.mul(q, EField);
	var FB = Vect3.cross(Vect3.mul(q, v), BField);
	var FG = Vect3.mul(m, GField);
	
	// Apply Newton second law of motion
	var F = Vect3.add(FE, FB, FG);
	var a = Vect3.div(F, m);
	
	// Integrate using Euler algorithm
	v = Vect3.add(v, Vect3.mul(a, dt));
	r = Vect3.add(r, Vect3.mul(v, dt));

	v.x = +v.x.toFixed(10);
	v.y = +v.y.toFixed(10);
	v.z = +v.z.toFixed(10);
	r.x = +r.x.toFixed(10);
	r.y = +r.y.toFixed(10);
	r.z = +r.z.toFixed(10);
	
	// Display result in certain period of time
	if(sample.sampling()) {
		var data = t + " "
			+ r.x.toExponential(2) + " "
			+ r.y.toExponential(2) + " "
			+ r.z.toExponential(2) + " "
			+ v.x.toExponential(2) + " "
			+ v.y.toExponential(2) + " "
			+ v.z.toExponential(2);
		tabs1.text("Results").push(data);
		var textarea = tabs1.element("Results");
		textarea.scrollTop = textarea.scrollHeight;
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

// Set layout of elements
function setLayout() {
	// Create title page
	var p = document.createElement("p");
	p.innerHTML = "One particle in static electric and " +
		"magnetic field";
	p.style.fontWeight = "bold";
	document.body.append(p);

	// Define first Tabs
	tabs1 = new Tabs("tabs1");
	tabs1.setWidth("450px");
	tabs1.setHeight("240px");
	tabs1.addTab("Log", 0);
	tabs1.addTab("Params", 0);
	tabs1.addTab("Results", 0);
	
	// Define second Tabs
	tabs2 = new Tabs("tabs2");
	tabs2.setWidth("300px");
	tabs2.setHeight("300px");
	tabs2.addTab("xy", 1);
	tabs2.addTab("yz", 1);
	tabs2.addTab("xz", 1);
	tabs2.addTab("xyz", 1);
	
	// Clear all tabs
	tabs1.text("Params").clear();
	tabs1.text("Results").clear();
	tabs1.text("Log").clear();
	tabs2.graphic("xy").clear();
	tabs2.graphic("yz").clear();
	tabs2.graphic("xz").clear();
	tabs2.graphic("xyz").clear();

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
	tabs1.text("Params").push("MASS 1");
	tabs1.text("Params").push("CHARGE 1");
	tabs1.text("Params").push("VELOCITY 1 0 0");
	tabs1.text("Params").push("POSITION 0 0 0");
	tabs1.text("Params").push();
	tabs1.text("Params").push("MAGNFIELD 0 0 1");
	tabs1.text("Params").push("ELECFIELD 0 0 0.1");
	tabs1.text("Params").push("GRAVFIELD 0 0 0");
	tabs1.text("Params").push("MOMEFIELD 0 0 0");
	tabs1.text("Params").push();
	tabs1.text("Params").push("TSTEP 1E-3");
	tabs1.text("Params").push("TDATA 1E-1");
	tabs1.text("Params").push("TBEG 0");
	tabs1.text("Params").push("TEND 10");
	tabs1.text("Params").push();
	tabs1.text("Params").push("COORDMIN -2 -3 -0.5");
	tabs1.text("Params").push("COORDMAX 2 1 5.5");
	var ta = tabs1.element("Params");
	ta.scrollTop = ta.scrollHeight;
}
	
// Get parameters
function readParameters() {
	var text = tabs1.element("Params").value;
	m = Parse.getFrom(text).valueOf("MASS");
	q = Parse.getFrom(text).valueOf("CHARGE");
	r = Parse.getFrom(text).valueOf("POSITION");
	v = Parse.getFrom(text).valueOf("VELOCITY");
	EField = Parse.getFrom(text).valueOf("ELECFIELD");
	BField = Parse.getFrom(text).valueOf("MAGNFIELD");
	GField = Parse.getFrom(text).valueOf("GRAVFIELD");
	tbeg = Parse.getFrom(text).valueOf("TBEG");
	tend = Parse.getFrom(text).valueOf("TEND");
	dt = Parse.getFrom(text).valueOf("TSTEP");
	Tdata = Parse.getFrom(text).valueOf("TDATA");
	coordMin = Parse.getFrom(text).valueOf("COORDMIN");
	coordMax = Parse.getFrom(text).valueOf("COORDMAX");
	
	// Initiate time
	t = tbeg;
	
	// Set sampling
	sample = new Sample(Tdata, dt);
	
	// Set coordinate ranges
	tabs2.graphic("xy").setCoord(
		[coordMin.x, coordMin.y, coordMax.x, coordMax.y]);
	tabs2.graphic("yz").setCoord(
		[coordMin.y, coordMin.z, coordMax.y, coordMax.z]);
	tabs2.graphic("xz").setCoord(
		[coordMin.x, coordMin.z, coordMax.x, coordMax.z]);
}	

// Log something and show manually	
function log() {
	try { 
		console.log(
			showOnly(logjs).forFilter(
				{
					app: "opsebf",
					date: "20180623",
					after: "1900",
				}
			)
		);
	}
	catch(err) {
		var msg = "opsebf logs only in development stage";
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
	}
	
	if(target.innerHTML == "About") {
		alert(
			"opsebf | "
			+ "One particle in static electric and magnetic field"
			+ "\n"
			+ "Version 20180623"
			+ "\n"
			+ "Sparisoma Viridi | dudung@gmail.com"
			+ "\n"
			+ "Siti Nurul Khotimah | nurul@fi.itb.ac.id"
			+ "\n"
			+ "\n"
			+ "Based on butiran "
			+ "| https://github.com/dudung/butiran"
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
		tabs2.graphic("yz").clear();
		tabs2.graphic("xz").clear();
		tabs2.graphic("xyz").clear();
		var ts = Timer.ts() + "|";
		tabs1.text("Log").push(ts + "Parameters, Results, "
			+ "and Log are cleared");
		tabs1.text("Log").push(ts + "xy, yz, xz, and xyz "
			+ "are cleared");
		var ta = tabs1.element("Log");
		ta.scrollTop = ta.scrollHeight;
		bgroup.disable("Read");
		bgroup.disable("Start");
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
	var rx = Parse.getFrom(text).column(1);
	var ry = Parse.getFrom(text).column(2);
	var rz = Parse.getFrom(text).column(3);
	var vx = Parse.getFrom(text).column(4);
	var vy = Parse.getFrom(text).column(5);
	var vz = Parse.getFrom(text).column(6);
	
	// Draw on related chart
	tabs2.graphic("xy").clear();
	tabs2.graphic("xy").setLineColor("#f00");	
	tabs2.graphic("xy").lines(rx, ry);
	tabs2.graphic("yz").clear();
	tabs2.graphic("yz").setLineColor("#0f0");	
	tabs2.graphic("yz").lines(ry, rz);
	tabs2.graphic("xz").clear();
	tabs2.graphic("xz").setLineColor("#00f");	
	tabs2.graphic("xz").lines(rx, rz);
}
