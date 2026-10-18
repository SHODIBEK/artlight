module.exports = {
	plugins: {
		"postcss-import": {},
		tailwindcss: {},
		autoprefixer: {
			browsers: [">1%", "last 2 versions", "Firefox ESR", "not ie < 9"],
			flexbox: true,
		},
	},
};
