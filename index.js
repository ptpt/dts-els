"use strict";
var GEO_SHAPE_TYPE = [
    "{coordinates: number[], type: 'Point'}",
    "{coordinates: number[][], type: 'MultiPoint'}",
    "{coordinates: number[][], type: 'LineString'}",
    "{coordinates: number[][][], type: 'MultiLineString'}",
    "{coordinates: number[][], type: 'Polygon'}",
    "{coordinates: number[][][][], type: 'MultiPolygon'}",
    "{coordinates: number[][], type: 'Envelope'}",
    "{coordinates: number[], radius: string | number, type: 'Circle'}",
    "{geometries: any[], type: 'GeometryCollection'}"
].join(' | ');
function getType(elsType, indent) {
    if (elsType.type === 'date') {
        return 'number';
    }
    else if (elsType.type === 'keyword') {
        return 'string';
    }
    else if (elsType.type === 'nested') {
        var subType = generate(elsType.properties, undefined, indent + 1);
        return "Array<" + subType + ">";
    }
    else if (elsType.type === 'object') {
        return 'any';
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
        return generate({ 'lon': { 'type': 'float' }, 'lat': { 'type': 'float' } }, undefined, indent + 1);
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
            return generate(elsType.properties, undefined, indent + 1);
        }
        else {
            return 'any';
        }
    }
}
function generate(properties, interfaceName, indent) {
    if (indent === void 0) { indent = 0; }
    var lines = [];
    var spaces = new Array((indent + 1) * 4 + 1).join(' ');
    lines.push("{");
    for (var key in properties) {
        var type = getType(properties[key], indent);
        lines.push('');
        lines.push(spaces + "// " + key + ": " + properties[key].type);
        lines.push(spaces + "'" + key + "': " + type + ";");
    }
    var endingSpaces = new Array(indent * 4 + 1).join(' ');
    lines.push(endingSpaces + "}");
    if (interfaceName) {
        return "export interface " + interfaceName + " " + lines.join('\n');
    }
    else {
        return lines.join('\n');
    }
}
// process.stdin.setEncoding('utf8');
var text = '';
process.stdin.on('readable', function () {
    var data = process.stdin.read();
    if (data !== null) {
        text += data;
    }
});
process.stdin.on('end', function () {
    console.log(generate(JSON.parse(text), process.argv[2]));
});
