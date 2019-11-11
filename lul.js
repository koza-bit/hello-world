var code = {
	setup: {
		background: '#000',
		minimumSize: 0.5,
		globalScale: 25,
		globalCompositeOperation: "source-over",
		layers: 2,
		pan: false
	},
	startShape: 'start',
	start: {
		shapes: [
			{ shape: "sky", scale: "=window.innerHeight/12", x: "=-window.innerWidth/50", y: "=window.innerHeight/50", light: 0.5, setHueTarget: 60, saturation: 1, zIndex: 0},
			{ shape: "PLANT", scale: "=window.innerHeight/650", y: "=window.innerHeight/50", zIndex: 1, saturation: 1 }
		]
	},
	sky: {
		shapes: [
			{ shape: "CIRCLE", scale: 3, x: 1.4 },
			{ shape: "sky", scale: 0.75, hue: 5, y: 0.001 }
		]
	},
	PLANT: {
		shapes: [
			{ shape: "EITHER", x: -2 },
			{ shape: "EITHER", x:  2 },
			{ shape: "EITHER", x: -4 },
			{ shape: "EITHER", x:  2 }
		]
	},
	EITHER: [
		{ shape: "BL", hue: 1, light: 0.5 },
		{ shape: "BL", hue: 2, light: 0.5, flip: 90 }
	],
	BL: {
		shapes: [
			{ shape: "SQUARE", scale: [1, 1.7] },
			{ shape: "WL", scale: 0.95, y: -1.6 }
		]
	},
	WL: [
		{ weight: 15, shape: "BL", rotate: 3, x: -0.03, y: 0.1, hue: 7 },
		{ weight: 15, shape: "BL", rotate: 4, x: -0.04, y: 0.1, hue: 6 },
		{ weight: 15, shape: "BL", rotate: 5, x: -0.05, y: 0.1, hue: 5 },
		{ weight: 15, shape: "BL", rotate: 6, x: -0.06, y: 0.1, hue: 4 },
		{ weight: 15, shape: "BL", rotate: 7, x: -0.07, y: 0.1, hue: 3 },
		{ weight:  5, shapes: [
			{ shape: "BL", rotate: 30,  x: -0.5, y: 0.2 },
			{ shape: "BL", rotate: -30, x:  0.5, y: 0.2, flip: 90 }
		]},
		{ weight:  5, shape: "BL", rotate: -10, x: 0.14, y: 0.2, flip: 90 },
		{ weight: 50, shapes: [
			{ shape: "WL" },
			{ shape: "CIRCLE", y: 10, hue: 15 }
		]}
	]
};

document.getElementById( "generate" ).onclick = CFAjs.render;

CFAjs.render( code );
