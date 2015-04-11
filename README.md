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
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.root
Type: `String` 
Default value: `./` 

Define a directory to parse it's structure. `./` is a root directory of your project.

#### options.outputJSON
Type: `String`
Default value: `./grunt_project_structure/project_structure.json`

Define directory and filename of JSON file with your project structure.

### Usage Examples

#### Empty task
If you run `project_structure` task without any definitions, it'll create full structure of you project including all directories and files.

```js
grunt.initConfig({
	project_structure: {
		options: {}
	}
});
```

#### Custom Options
The task below will parse `javascript` directory and create it's structure including all directories and files. 

```js
grunt.initConfig({
  project_structure: {
    options: {
		root: './javascript/',
		outputJSON: './project_js_structure/js_structure.json'
		
	}
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
