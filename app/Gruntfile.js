module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: './public/sass',
          src: ['**/*.scss'],
          dest: './public/dist/css',
          ext: '.css'
        }]
      },
      dev: {
        files: [{
          expand: true,
          cwd: './public/sass',
          src: ['**/*.scss'],
          dest: './public/css',
          ext: '.css'
        }]
      }
    },

    imagemin: {
      options: {
        optimizationLevel: 5,
        progressive: true
      },

      dist: {
        files: [{
          expand: true,
          cwd: './public/images/',
          src: ['**/*.{png,jpg,jpeg}'],
          dest: './public/dist/images/'
        }]
      }
    },

    copy: {
      main: {
        files: [
          { expand: true, cwd: './public/', src: ['fonts/*'], dest: './public/dist/' },
          { expand: true, cwd: './public/', src: ['scripts/**'], dest: './public/dist/' },
          { expand: true, cwd: './public/sass/font-awesome', src: ['fonts/*'], dest: './public/dist/css' }
        ]
      }
    },

    watch: {
      scss: {
        files: ['**/*.scss'],
        tasks: ['sass:dev'],
        options: {
          interrupt: true
        }
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        }, 
        files: [{
          expand: true,
          cwd: './views/',
          src: ['**/*.twig'],
          dest: './views/min'
        }]
      }
    },

    cssmin: {
      dist: {
        files: [{
          expand: true,
          cwd: './public/dist/css',
          src: ['**/*.css'],
          dest: './public/dist/css',
          ext: '.css'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('dev', [
    'sass:dev'
  ]);

  grunt.registerTask('production', [
    'sass:dist',
    'cssmin:dist',
    'imagemin:dist',
    'copy',
    'htmlmin:dist'
  ]);

}