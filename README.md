# grunt-project-structure

> Generate markdown code of your project structure tree with Grunt.js

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-project-structure --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-project-structure');
```

## The "project_structure" task

### JSON output example

```json
{
    "folder-1_1": {
        "folder-2_1": {
            "folder-3_1": {
                "folder-4_1": {
                    "files_array": [
                        "level-5_1.txt",
                        "level-5_2.txt"
                    ]
                }
            },
            "files_array": [
                "level-3_1.txt",
                "level-3_2.txt"
            ]
        },
        "folder-2_2": {
            "files_array": [
                "level-3_1.txt",
                "level-3_2.txt"
            ]
        },
        "files_array": [
            "level-2_1.txt",
            "level-2_2.txt"
        ]
    },
    "folder-1_2": {
        "files_array": [
            "level-2_1.txt",
            "level-2_2.txt"
        ]
    },
    "files_array": [
        "level-1_1.txt",
        "level-1_2.txt"
    ]
}
```

### Overview
In your project's Gruntfile, add a section named `project_structure` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  project_structure: {
    options: {
      // Task-specific options go here.
    },
    subtask_name: {
		options: {
			// Subtask-specific options go here.
		}
    },
  },
});
```

### Options

#### options.root
Type: `String`  
Default value: `./` 

Define a directory to parse it's structure. `./` is a root directory of your project.

#### options.writeJSON
Type: `Boolen`  
Default value: `false`

If `true`, JSON file with project structure will be written. You can define filename with `outputJSON` option.

#### options.outputJSON
Type: `String`  
Default value: `./grunt_project_structure/project_structure.json`

Define directory and filename of JSON file with your project structure.

#### options.filesArrayJSON
Type: `String`  
Default value: `files_array`

Define name of files array in output JSON.

#### options.spch
Type: `String`  
Default: `A-Za-z0-9-_\\.`  

The valur of this option will be construed as a pattern for RegExp character set:  

`new RegExp('^[A-Za-z0-9-_\.]*$')`

It's an array of allowed characters and signs for names of directories and files.

You can use letters `A-Z` and `a-z`, numbers `0-9`, signs `-`, `_` and `.`.

If you'd like to asdd characters you should note that `\:*?"<>|` are illegal for directories and files names, so you'll see an error of `grunt-project-structure` task.

### Usage Examples

#### Custom Options
The task below will parse `javascript` directory and create it's structure including all directories and files. 

```js
grunt.initConfig({
  project_structure: {
    options: {
		root: './javascript/',
		writeJSON: true,
		outputJSON: './project_js_structure/js_structure.json',
		filesArrayJSON: 'filesInThisDir'
		
	}
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## TODO

### Common
* add ignore list for directories;
* add ignore list for files;
* add default ignores (node_modules directory, Gruntfile.js file, etc.);
* add ability to include default ignores in output;
* [done] ~~add validation of paths~~;
* add ability to allow `~!#$%^&+=[]';,/{}` in dirs / files names via Boolen.

### JSON
* [done] ~~create a true/false option to write or ignore writing JSON file~~;
* [done] ~~add ability to change name of `files_array` key in JSON~~;
* [done] ~~add validation of `outputJSON` option~~;
* add ability to include or not empty arrays of files in output JSON;
* add ability to inclide or not empty directories in output JSON (and output md in future);

### Markdown
The result in markdown file should be:
```
├── folder/
│   ├── folder/
│   │   ├── file.ext
│   │   └── file.ext
│   ├── file.ext
│   └── file.ext
└── file.ext
```