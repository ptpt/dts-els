#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var yargs = require("yargs");
var GEO_SHAPE_TYPE = [
    "{coordinates: number[], type: 'Point'}",
    "{coordinates: number[][], type: 'MultiPoint'}",
    "{coordinates: number[][], type: 'LineString'}",
    "{coordinates: number[][][], type: 'MultiLineString'}",
    "{coordinates: number[][][], type: 'Polygon'}",
    "{coordinates: number[][][][], type: 'MultiPolygon'}",
    "{coordinates: number[][], type: 'Envelope'}",
    "{coordinates: number[], radius: string | number, type: 'Circle'}",
    "{geometries: any[], type: 'GeometryCollection'}"
].join(' | ');
function getType(elsType, options) {
    if (elsType.type === 'date') {
        return 'number';
    }
    else if (elsType.type === 'keyword') {
        return 'string';
    }
    else if (elsType.type === 'nested') {
        return generate(elsType.properties, {
            'indent': options.indent + 1,
            'propertyPath': options.propertyPath
        });
    }
    else if (elsType.type === 'text') {
        return 'string';
    }
    else if (elsType.type === 'geo_shape') {
        return GEO_SHAPE_TYPE;
    }
    else if (elsType.type === 'integer') {
        return 'number';
    }
    else if (elsType.type === 'geo_point') {
        var geoPointType = { 'lon': { 'type': 'float' }, 'lat': { 'type': 'float' } };
        return generate(geoPointType, {
            'indent': options.indent + 1,
            'propertyPath': options.propertyPath
        });
    }
    else if (elsType.type === 'boolean') {
        return 'boolean';
    }
    else if (elsType.type === 'double') {
        return 'number';
    }
    else if (elsType.type === 'long') {
        return 'number';
    }
    else if (elsType.type === 'short') {
        return 'number';
    }
    else if (elsType.type === 'float') {
        return 'number';
    }
    else if (elsType.type === 'byte') {
        return 'number';
    }
    else {
        if (elsType.properties) {
            return generate(elsType.properties, {
                'indent': options.indent + 1,
                'propertyPath': options.propertyPath
            });
        }
        else {
            return 'any';
        }
    }
}
function generate(properties, options) {
    var lines = [];
    var spaces = new Array((options.indent + 1) * 4 + 1).join(' ');
    lines.push("{");
    for (var key in properties) {
        var newPropertyPath = options.propertyPath.concat([key]);
        var type = getType(properties[key], __assign({}, options, { 'propertyPath': newPropertyPath }));
        var fullKey = newPropertyPath.join('.');
        if (0 <= arrayProperties.indexOf(fullKey)) {
            type = "Array<" + type + ">";
        }
        if (0 <= maybeArrayProperties.indexOf(fullKey)) {
            type = type + " | Array<" + type + ">";
        }
        lines.push('');
        lines.push(spaces + "// " + key + ": " + properties[key].type);
        lines.push(spaces + "'" + key + "': " + type + ";");
    }
    var endingSpaces = new Array(options.indent * 4 + 1).join(' ');
    lines.push(endingSpaces + "}");
    if (options.interfaceName) {
        return "export interface " + options.interfaceName + " " + lines.join('\n');
    }
    else {
        return lines.join('\n');
    }
}
var text = '';
process.stdin.on('readable', function () {
    var data = process.stdin.read();
    if (data !== null) {
        text += data;
    }
});
var arrayProperties = [];
var maybeArrayProperties = [];
if (typeof yargs.argv.array === 'string') {
    arrayProperties = yargs.argv.array.split(',');
}
if (typeof yargs.argv.maybeArray === 'string') {
    maybeArrayProperties = yargs.argv.maybeArray.split(',');
}
process.stdin.on('end', function () {
    var interfaceName = yargs.argv._[0];
    var properties;
    try {
        properties = JSON.parse(text);
    }
    catch (err) {
        console.error(err.message);
        process.exit(1);
        return;
    }
    console.log(generate(properties, { 'interfaceName': interfaceName, 'indent': 0, 'propertyPath': [] }));
});
