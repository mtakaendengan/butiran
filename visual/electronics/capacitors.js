/*	capacitors.js	Draw capacitors in canvas element		Sparisoma Viridi | dudung@gmai.com		20180227	Create this library.*/class Capacitor {	constructor(r1, r2) {		this.type = "paralel plate";		this.rbeg = r1;		this.rend = r2;		this.size = 20;		this.plateHeight = this.size;		this.plateWidth = 0.5 * this.size / 3.0;		this.plateSpace = 0.5 * this.size / 3.0;		this.lineColor = "#000";		this.fillColor = "#000";	}		setSize(sz) {		this.size = sz;	}		setColor(lc, fc) {		this.lineColor = lc;		this.fillColor = fc;	}}