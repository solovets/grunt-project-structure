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
			treeTop: '',
            
            writeMD: true,
			headingMD: '',
			outputMD: './grunt_project_structure/project_structure.md',
			
			writeJSON: true,
			typeJSON: 1,
			outputJSON: './grunt_project_structure/project_structure.json',
			filesArrayJSON: 'files_array',
			filesArrayEmptyJSON: false,
			
			spch: 'A-Za-z0-9-_\\.',
			
			ignoreDirectories: [],
			ignoreFiles: []
		}),
			
			root = options.root,
			treeTop = options.treeTop,
            
            writeMD = options.writeMD,
			headingMD = options.headingMD,
			outputMD = options.outputMD,
			
			writeJSON = options.writeJSON,
			typeJSON = options.typeJSON,
			outputJSON = options.outputJSON,
			filesArrayJSON = options.filesArrayJSON,
			filesArrayEmptyJSON = options.filesArrayEmptyJSON,
			
			spch = new RegExp('^[' + options.spch + ']*$'),
			spchString,
			spchIllegal = /[\\:\*\?\"<>|]/,
			
			tree,
			
			obj = {},
            o = {},
			o_md = o,
			
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
		
		function build(path, chars, branch, draft, callback) {
			
			var arr_p = grunt.file.expand({cwd: path}, '*'), // array of current branch
				arr_d = [],                                  // array of directories
				arr_f = [],                                  // array of files
				arr_t = [],                                  // temporary array
				i,
				last;
			
			count += 1;
			
			if (arr_p.length > 0) {
                arr_p.forEach(function (element) {
                    if (grunt.file.isDir(path + element)) {
                        arr_d.push(element);
				    } else if (grunt.file.isFile(path + element)) {
                        arr_f.push(element);
				    }
                });
				arr_t = arr_t.concat(arr_d).concat(arr_f);
				last = arr_t[arr_t.length - 1];
            }
			
			if (arr_d.length > 0) {
				for (i in arr_d) {
					if (arr_d.hasOwnProperty(i)) {
						
						branch[arr_d[i]] = {};
						
						draft.push({
							"name": arr_d[i] + '/',
							"type": "dir",
							"depth": count,
							"last": arr_d[i] === last ? true : false,
							"intree": chars + (arr_d[i] === last ? '└── ' : '├── ')
						});
						build(path + arr_d[i] + '/', chars + (arr_d[i] === last ? '    ' : '│   '), branch[arr_d[i]], callback);
					}
				}
            }
            
			if (arr_f.length > 0 || filesArrayEmptyJSON === true) {
				branch[filesArrayJSON] = [];
			}
			
            if (arr_f.length > 0) {
                for (i in arr_f) {
                    if (arr_f.hasOwnProperty(i)) {
						
						branch[filesArrayJSON].push(arr_f[i]);
						
                        draft.push({
                            "name": arr_f[i],
                            "type": "file",
							"depth": count,
							"last": arr_f[i] === last ? true : false,
							"intree": chars + (arr_f[i] === last ? '└── ' : '├── ')
                        });
                    }
                }
            }
            
			count -= 1;
            if (count === 0 && callback) {
				callback();
			}
			
		}
        
		function write() {
			
			var md = '', json, i;
			
			if (writeJSON) {
				
				if (typeJSON === 1) {
					
					json = JSON.parse(JSON.stringify(o));
					for (i in json.tree) {
						if (json.tree.hasOwnProperty(i)) {
							delete json.tree[i].intree;
						}
					}
				}
				
				switch (typeJSON) {
				case 1:
					grunt.file.write(outputJSON, JSON.stringify(json, null, 4), {encoding: 'utf-8'});
					break;
				case 2:
					//grunt.file.write(outputJSON, JSON.stringify(obj, null, 4), {encoding: 'utf-8'});
					break;
				}
				
				grunt.log.ok(outputJSON + ' file has been written.');
			}
			
			if (writeMD) {
				// Add heading if needed
				if (typeof headingMD === 'string' && headingMD.length > 0) {
					md += headingMD + '\n```\n';
				} else {
					md += '```\n';
				}

				// change tree top if needed
				if (typeof treeTop === 'string' && treeTop.length > 0) {
					md += treeTop + '\n';
				} else {
					md += root.replace(/^\.\//, '') + '\n';
				}

				// write tree
				for (i in o.tree) {
					if (o.tree.hasOwnProperty(i)) {
						md += o.tree[i].intree + o.tree[i].name + '\n';
					}
				}

				md += '```';

				grunt.log.debug(md);
				//grunt.file.write(outputMD, md, {encoding: 'utf-8'});
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
		// check if `filesArrayEmptyJSON` is Boolen
		// =====================================================================
		
		if (typeof filesArrayEmptyJSON !== 'boolean') {
			filesArrayEmptyJSON = false;
			grunt.log.error('Type of `filesArrayEmptyJSON` is not `boolen`.\n' +
							'It has been set to `false`.');
		}
		
		treeTop = 'filestructure';
		if (treeTop.length > 0) {
			tree = treeTop;
		} else {
			tree = root.replace(/^\.\//, '').replace(/\/$/, '');
		}
		
		// =====================================================================
		// check if `root` is a directory
		// =====================================================================
		
		if (!grunt.file.isDir(root)) {
			grunt.log.error('Error: `root` option value is invalid.\n' +
							'Only name of existing directory expected.');
			grunt.fail.fatal(fatal);
		} else {
			if (writeMD === true || writeJSON === true) {
				o.tree = [];
				build(root, '', obj, o[tree], write);
			} else {
				grunt.log.error('None of `writeMD` or `writeJSON` is `true`');
			}
		}

	});
};
