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
			
			spch: 'A-Za-z0-9-_\\.',
			
			ignoreDirectories: [],
			ignoreFiles: []
		}),
			
			root = options.root,
			
			output = options.output,
			
			writeJSON = options.writeJSON,
			outputJSON = options.outputJSON,
			filesArrayJSON = options.filesArrayJSON,
			
			spch = new RegExp('^[' + options.spch + ']*$'),
			spchString,
			spchIllegal = /[\\:\*\?\"<>|]/,
			
			obj = {},
			
			fatal = 'Can\'t to proceed.',
			path_start = './',
			count = 0;
		
		function isEmpty(str) {
			if (str.length === 0 || !str.trim()) {
				grunt.log.error('Check your options for empty string\n' +
								'or string which contains only white-space.\n' +
								'You can also see this error when you define\n' +
								'`./` for options that require name of file.');
				grunt.fail.fatal(fatal);
			}
		}
		
		function testName(arg, ext) {
			
			isEmpty(arg);
			
			arg = arg.replace(/^\.\//, '').replace(/\/$/, '');
			
			var arr_p = arg.split('/'),
				last,
				i;
			
			for (i in arr_p) {
				if (arr_p.hasOwnProperty(i)) {
					if (!spch.test(arr_p[i]) || arr_p[i].split('\\').length > 1) {
						grunt.log.error('There\'re some illegal characters in `' + arr_p[i] +
										'\nYou can use only ' + spchString + ' characters.' +
										'\nTo allow some extra characters redefine option' +
										'\n`spch` in `project_structure` task.' +
										'\nMay be allowed ~`!#$%^&+=[]\';,/{},' + /* ~`!#$%^&+=[]';,/{} */
										'\ncan\'t be allowed \\:*?"<>|');         /* \:*?"<>| */
						grunt.fail.fatal(fatal);
					}
					
				}
			}
			
			if (ext) {
				last = arr_p[arr_p.length - 1];
				
				if (last !== -1) {
					
					isEmpty(last);
					
					if (last.substr(last.lastIndexOf('.') + 1) !== ext) {
						grunt.log.error('Some problems with extention of ' + last + '.' +
										'\nOnly ' + '*.' + ext + ' expected. For example: ' + last + '.' + ext);
						grunt.fail.fatal(fatal);
					}
				}
			}
		}
		
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
		
		function testPathStart(arg) {
			return arg.substring(0, 2) !== path_start;
		}
		
		// =====================================================================
		// check if `spch` option is valid
		// =====================================================================
		
		if (!spch instanceof RegExp) {
			grunt.log.error('Something wrong with `spch` option,\n' +
							'it isn\'t instance of RegExp.');
			grunt.fail.fatal(fatal);
		} else {
			spchString = spch.source
				.replace(/^\^\[/, '')
				.replace(/\]\*\$/, '')
				.replace(/\\/g, '');
		}
		
		// =====================================================================
		// check if `spch` option does not contains \:*?"<>|
		// =====================================================================
		
		if (spchIllegal.test(spchString)) {
			grunt.log.error('You can\'t use \\:*?\"<>| characters in `spch` option.');
			grunt.fail.fatal(fatal);
		}
		
		// =====================================================================
		// check if the last character of `root` option is `/`
		// =====================================================================
		
		if (root.slice(-1) !== '/') { root += '/'; }
		
		// =====================================================================
		// check if `root` starts with `./`
		// =====================================================================
		
		if (testPathStart(root)) { root = path_start + root; }
		
		// =====================================================================
		// check if there're unexpected characters in `root`
		// =====================================================================
		
		testName(root);
		
		// =====================================================================
		// check if `root` starts with `./`
		// =====================================================================
		
		if (testPathStart(outputJSON)) { outputJSON = path_start + outputJSON; }
		
		// =====================================================================
		// check if there're unexpected characters in `outputJSON`
		// =====================================================================
		
		testName(outputJSON, 'json');
		
		// =====================================================================
		// check if `root` is a directory
		// =====================================================================
		
		if (!grunt.file.isDir(root)) {
			grunt.log.error('Error: `root` option value is invalid.\n' +
							'Only name of existing directory expected.');
			grunt.fail.fatal(fatal);
		} else {
			build(root, obj, write);
		}


		

	});
};
