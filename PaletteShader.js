THREE.PaletteShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
    "tPalette": { type: "t", value: null },
	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",

    "uniform sampler2D tPalette;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 color = texture2D( tDiffuse, vUv );",

      "vec4 outcolor = texture2D( tPalette, vec2( color.r, 0.5));",

      //"gl_FragColor = vec4(outcolor.r, outcolor.g, outcolor.b, outcolor.a);",
      "gl_FragColor = outcolor;",

		"}"

	].join("\n")

};
