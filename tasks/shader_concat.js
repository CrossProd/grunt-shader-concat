/*
 * grunt-shader-concat
 * https://github.com/Robert/shader-concat
 *
 * Copyright (c) 2017 Robert
 * Licensed under the MIT license.
 */

'use strict';

var os = require('os');
var path = require('path');

module.exports = function (grunt) {
    var directiveGroupTag = "//#shader-concat-group";
    var directiveNameTag = "//#shader-concat-name";

    grunt.registerMultiTask('shader_concat', 'Merges all shader files into one file.', function () {
        var options = this.options({
            lineEndings: '\n',
            stripEmptyLines: true,
            stripComments: true,
            fragmentExtension: 'frag',
            vertexExtension: 'vert',
            groupByShaderType: true
        });

        var groups = {
            default: {}
        };

        this.files.forEach(function (f) {
            f.src.filter(function (filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');

                    return false;
                } else {
                    grunt.log.ok('Source file "' + filepath + '" found.');

                    return true;
                }
            }).map(function (filepath) {
                var shaderSource = grunt.util.normalizelf(grunt.file.read(filepath));

                var content = getLinesAndDirectivesFromSource(shaderSource, options);

                var source = '';

                for (var i = 0; i < content.lines.length; i++) {
                    source += content.lines[i];
                }

                if (!groups[content.directives.group]) {
                    groups[content.directives.group] = {};
                }

                var fileDetails = splitFilepath(filepath);

                var shaderType = null;

                if (options.groupByShaderType) {
                    if (fileDetails.extension === options.fragmentExtension) {
                        shaderType = 'fragment';
                    } else if (fileDetails.extension === options.vertexExtension) {
                        shaderType = 'vertex';
                    }
                }

                var name = content.directives.name ? content.directives.name : fileDetails.name;

                if (shaderType) {
                    if (!groups[content.directives.group][shaderType]) {
                        groups[content.directives.group][shaderType] = {};
                    }

                    groups[content.directives.group][shaderType][content.directives.name] = source;
                } else {
                    groups[content.directives.group][content.directives.name] = source;
                }
            });

            var output = 'var shaders = \n';

            output += JSON.stringify(groups, null, 4);

            // Write the destination file.
            grunt.file.write(f.dest, output);

            // Print a success message.
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });

    function getLinesAndDirectivesFromSource(source, options) {
        var sourceLines = source.split(options.lineEndings);

        var directives = readAndStripDirectives(sourceLines);

        if (options.stripEmptyLines === true) {
            stripEmptyLines(sourceLines);
        }

        if (options.stripComments === true) {
            stripComments(sourceLines);
        }

        return {
            lines: sourceLines,
            directives: directives
        };
    }

    function splitFilepath(filepath) {
        var base = path.basename(filepath);
        var tokens = base.split('.');

        return {
            name: tokens[0],
            extension: tokens[1]
        };
    }

    function stripComments(lines) {
        var line = 0;

        while (line < lines.length) {
            if (lines[line].trim().substring(0, 2) === '//') {
                lines.splice(line, 1);
            } else {
                line++;
            }
        }
    }

    function stripEmptyLines(lines) {
        var line = 0;

        while (line < lines.length) {
            if (!lines[line]) {
                lines.splice(line, 1);
            } else {
                line++;
            }
        }
    }

    function sanitizedFilename(filename) {
        filename = filename.split('\\').pop().split('/').pop();

        return filename.replace(/[^a-z0-9_]/gi, '_');
    }

    function readAndStripDirectives(lines, defaultFilename) {
        var result = {
            group: 'default',
            name: defaultFilename
        };

        var directive;

        var line = 0;
        while (line < lines.length) {
            if (lines[line].startsWith(directiveGroupTag)) {
                directive = lines.splice(line, 1)[0];

                directive = directive.substring(directiveGroupTag.length + 1, directive.length).trim();
                directive = sanitizedFilename(directive);

                result.group = directive;
            } else if (lines[line].startsWith(directiveNameTag)) {
                directive = lines.splice(line, 1)[0];

                directive = directive.substring(directiveNameTag.length + 1, directive.length).trim();
                directive = sanitizedFilename(directive);

                result.name = directive;
            } else {
                line++;
            }
        }

        return result;
    }
};
