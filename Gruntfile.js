module.exports = function(grunt) {

// Load multiple grunt tasks using globbing patterns
require('load-grunt-tasks')(grunt);

// Project configuration.
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),

    makepot: {
      target: {
        options: {
          domainPath: '/languages/',    // Where to save the POT file.
          exclude: ['build/.*'],
          mainFile: 'wp-rocket.php',    // Main project file.
          potFilename: 'rocket.pot',    // Name of the POT file.
          type: 'wp-plugin',    // Type of project (wp-plugin or wp-theme).
          processPot: function( pot, options ) {
            pot.headers['report-msgid-bugs-to'] = 'http://wp-rocket.me/';
            pot.headers['plural-forms'] = 'nplurals=2; plural=n != 1;';
            pot.headers['last-translator'] = 'WP Media (http://wp-rocket.me/)\n';
            pot.headers['language-team'] = 'WP Media (http://www.transifex.com/projects/p/wp-media/)\n';
            pot.headers['x-poedit-basepath'] = '.\n';
            pot.headers['x-poedit-language'] = 'English\n';
            pot.headers['x-poedit-country'] = 'UNITED STATES\n';
            pot.headers['x-poedit-sourcecharset'] = 'utf-8\n';
            pot.headers['x-poedit-keywordslist'] = '__;_e;__ngettext:1,2;_n:1,2;__ngettext_  noop:1,2;_n_noop:1,2;_c,_nc:4c,1,2;_x:1,2c;_ex:1,2c;_nx:4c,1,2;_nx_noop:4c,1,2;\n';
            pot.headers['x-textdomain-support'] = 'yes\n';
            return pot;
          }
        }
      }
    },

    exec: {
      npmUpdate: {
        command: 'npm update'
      },
      txpull: { // Pull Transifex translation - grunt exec:txpull
        cmd: 'tx pull -a --minimum-perc=100' // Change the percentage with --minimum-perc=yourvalue
      },
      txpush_s: { // Push pot to Transifex - grunt exec:txpush_s
        cmd: 'tx push -s'
      },
    },

    po2mo: {
      files: {
        src: 'languages/*.po',
        expand: true,
      },
    },

    // Clean up build directory
    clean: {
      main: ['build/<%= pkg.name %>']
    },

    // Copy the theme into the build directory
    copy: {
      main: {
        src:  [
          '**',
          '!node_modules/**',
          '!build/**',
          '!.git/**',
          '!Gruntfile.js',
          '!package.json',
          '!.gitignore',
          '!.gitmodules',
          '!.tx/**',
          '!**/Gruntfile.js',
          '!**/package.json',
          '!**/README.md',
          '!**/*~'
        ],
        dest: 'build/<%= pkg.name %>/'
      }
    },

    //Compress build directory into <name>.zip and <name>-<version>.zip
    compress: {
      main: {
        options: {
          mode: 'zip',
          archive: './build/<%= pkg.name %>.zip'
        },
        expand: true,
        cwd: 'build/<%= pkg.name %>/',
        src: ['**/*'],
        dest: '<%= pkg.name %>/'
      }
    },

});

// Default task.
grunt.registerTask( 'default', 'exec:npmUpdate' );

// Makepot - grunt makepot

// Makepot and push it on Transifex task(s).
grunt.registerTask( 'makandpush', [ 'makepot', 'exec:txpush_s' ] );

// Pull from Transifex and create .mo task(s).
grunt.registerTask( 'tx', [ 'exec:txpull', 'po2mo' ] );

// Build task(s).
  grunt.registerTask( 'build', [ 'clean', 'copy', 'compress' ] );

};