module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        zetzer: {
            main: {
                options: {
                    partials: "partials",
                    templates: "templates"
                },
                files: [
                  {
                      expand: true,
                      //cwd: "",
                      src: "*.partial.html",
                      dest: "/",
                      ext: ".html",
                      flatten: true
                  }
                ]
            },
        }
    });
    grunt.loadNpmTasks('grunt-zetzer');

    grunt.registerTask('default', ['zetzer']);
};