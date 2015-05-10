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

	grunt.registerMultiTask('prostructure', 'Generate markdown code of your project structure tree', function () {
		
		var options = this.options({
			root: './',
            
            wrriteMD: true,
            
            output: './grunt_project_structure/project_structure.md',
			
			writeJSON: false,
			outputJSON: './grunt_project_structure/project_structure.json',
			filesArrayJSON: 'files_array',
			
			spch: 'A-Za-z0-9-_\\.',
			
			ignoreDirectories: [],
			ignoreFiles: []
		}),
			
			root = options.root,
            
            wrriteMD = options.wrriteMD,
			
			output = options.output,
			
			writeJSON = options.writeJSON,
			outputJSON = options.outputJSON,
			filesArrayJSON = options.filesArrayJSON,
			
			spch = new RegExp('^[' + options.spch + ']*$'),
			spchString,
			spchIllegal = /[\\:\*\?\"<>|]/,
			
			obj = {},
            obj_md = {},
			
			fatal = 'Can\'t to proceed.',
			path_start = './',
			count = 0,
            count_md = 0;
		
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
										'\n`spch` in `prostructure` task.' +
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
		
        function buildMD(p, chars, callback) {
            
            var arr_p = grunt.file.expand({cwd: p}, '*'),
				arr_d = [],
				arr_f = [],
				arr_t = [],
				i,
				last;
			
			count_md += 1;
            
            if (arr_p.length > 0) {
                arr_p.forEach(function (element) {
                    if (grunt.file.isDir(p + element)) {
                        arr_d.push(element);
				    } else if (grunt.file.isFile(p + element)) {
                        arr_f.push(element);
				    }
                });
				
				arr_t = arr_t.concat(arr_d).concat(arr_f);
				last = arr_t[arr_t.length - 1];
            }
            
            if (arr_d.length > 0) {
                for (i in arr_d) {
					if (arr_d.hasOwnProperty(i)) {
						obj_md.tree.push({
							"name": arr_d[i],
							"type": "dir",
							"depth": count_md,
							"last": arr_d[i] === last ? true : false,
							"intree": chars + (arr_d[i] === last ? '└── ' : '├── ')
						});
						buildMD(p + arr_d[i] + '/', chars + (arr_d[i] === last ? '    ' : '│   '), callback);
					}
				}
            }
            
            if (arr_f.length > 0) {
                for (i in arr_f) {
                    if (arr_f.hasOwnProperty(i)) {
                        obj_md.tree.push({
                            "name": arr_f[i],
                            "type": "file",
							"depth": count_md,
							"last": arr_f[i] === last ? true : false,
							"intree": chars + (arr_f[i] === last ? '└── ' : '├── ')
                        });
                    }
                }
            }
            
			count_md -= 1;
            if (count_md === 0 && callback) {
				callback();
			}
        }
        
        function writeMD() {
			var md_result = '', i;
			
			for (i in obj_md.tree) {
				if (obj_md.tree.hasOwnProperty(i)) {
					md_result += obj_md.tree[i].intree + obj_md.tree[i].name + '\n';
				}
			}
			
			grunt.log.write(md_result);
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
			//build(root, obj, write);
            if (wrriteMD) {
                obj_md.tree = [];
                buildMD(root, '', writeMD);
            }
		}


		

	});
};
