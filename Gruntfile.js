
module.exports = function (grunt) {
// Load npm plugins to provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.initConfig({
		uglify: {
			main: {
				files: {'geocoder-service.min.js': 'geocoder-service.js'}
			}
		}
	});
	grunt.registerTask('build', [
		'uglify'
	]);
};