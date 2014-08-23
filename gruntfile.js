module.exports = function (grunt) {

    grunt.initConfig({
        watch: {
            files: ['**/*.scss', '**/*.php','**/*.html','**/*.js','gruntfile.js', '**/*.rb'],
            tasks: ['compass:dev'],
            options: {
                livereload: true,
            }
        },
        compass: {
            dev: {
                options: {
                    config: 'config.rb'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    
    grunt.registerTask('default', ['watch']);

};