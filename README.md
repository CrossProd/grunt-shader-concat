# grunt-shader-concat

> Merges all shader files into one file in a object structure.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-shader-concat --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-shader-concat');
```

## The "shader_concat" task

### Overview
In your project's Gruntfile, add a section named `shader_concat` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  shader_concat: {
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

#### options.lineEndings
Type: `String`
Default value: `\n`

A string value that defines the line break in your shader files. This is needed to split the file content in lines.

#### options.fragmentExtension
Type: `String`
Default value: `frag`

A string value that is used to determine if the file parsed is a fragment shader.

#### options.vertexExtension
Type: `String`
Default value: `vert`

A string value that is used to determine if the file parsed is a vertex shader.

#### options.groupByShaderType
Type: `Boolean`
Default value: true

A boolean value that determines if the shaders should be subgrouped by shader type.

### Directives

In the shader files you can use two directives to control the group and name of the shader in the final file.

#### shader-concat-group {group name}

Default value: `default`.

For example: //#shader-concat-group ssao

```c
//#shader-concat-group ssao

precision mediump float;

void main() {
  // etc
}
```

#### shader-concat-name {group name}

For example: //#shader-concat-name merger

```c
//#shader-concat-name merger

precision mediump float;

void main() {
  // etc
}
```

### Usage Examples

#### Default Options

```js
grunt.initConfig({
  shader_concat: {
    options: {},
    files: {
      'tmp/default_options': [
        'test/fixtures/shader1.frag', 
        'test/fixtures/shader1.vert'
      ]
    },
  },
});
```

#### Custom Options

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
