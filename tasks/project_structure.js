/*
 * grunt-project-structure
 * https://github.com/solovets/grunt-project-structure
 *
 * Copyright (c) 2015 Denis Solovets
 * Licensed under the MIT license.
 */

"use strict";

var fs = require('fs'),
	path = require('path');

module.exports = function (grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	grunt.registerMultiTask('project_structure', 'Generate markdown code of your project structure tree', function () {
		
		var options = this.options({
			root: './',
			
			output: './grunt_project_structure/project_structure.md',
			
			writeJSON: false,
			outputJSON: './grunt_project_structure/project_structure.json',
			filesArrayJSON: 'files_array',
			
			ignore_folders: [],
			ignore_files: []
		}),
			root = options.root,
			
			output = options.output,
			
			writeJSON = options.writeJSON,
			outputJSON = options.outputJSON,
			filesArrayJSON = options.filesArrayJSON,
			
			obj = {},
			
			fatal = 'Can\'t to proceed.',
			count = 0;
		
		
		function build(p, b, callback) {
			
			var arr_p = grunt.file.expand({cwd: p}, '*'),
				arr_d = [],
				arr_f = [],
				i;
			
			count += 1;
						
			arr_p.forEach(function (element) {
				if (grunt.file.isDir(p + element)) {
					arr_d.push(element);
				} else if (grunt.file.isFile(p + element)) {
					arr_f.push(element);
				}
				
			});
			
			grunt.log.debug('==========================================================',
							  '\npath (`p` argument): ', p,
							  '\nbrunch: (`b` argumebt)', b,
							  '\narray in path (`arr_p` array): ', arr_p.join(', '),
							  '\narray of directories (`arr_d` array):', arr_d,
							  '\narray of files (`arr_f` array): ', arr_f);
			
			for (i in arr_d) {
				if (arr_d.hasOwnProperty(i)) {
					b[arr_d[i]] = {};
					
					build(p + arr_d[i] + '/', b[arr_d[i]], callback);
				}
			}
			
			if (arr_f.length > 0) {
				b[filesArrayJSON] = [];
				
				for (i in arr_f) {
					if (arr_f.hasOwnProperty(i)) {
						b[filesArrayJSON].push(arr_f[i]);
					}
				}
			}
			
			count -= 1;
			if (count === 0 && callback) {
				callback();
			}
			
		}
		
		function write() {
			if (writeJSON) {
				grunt.file.write(outputJSON, JSON.stringify(obj, null, 4));
				grunt.log.ok(outputJSON + ' file has been written.');
			}
		}
		
		// check if the last character of `root` option is `/`
		if (root.slice(-1) !== '/') { root += '/'; }
		
		// check if `root` is a directory
		if (!grunt.file.isDir(root)) {
			grunt.log.error('Error: `root` option value is invalid.\n' +
							'Only name of existing directory expected.');
			grunt.fail.fatal(fatal);
		} else {
			build(root, obj, write);
		}


		

	});
};
