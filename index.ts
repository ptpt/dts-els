#!/usr/bin/env node
import * as yargs from 'yargs';

interface PropertyType {
    type?: string;
    properties?: Properties;
}

interface Properties {
    [key: string]: PropertyType;
}

const GEO_SHAPE_TYPE: string = [
    `{coordinates: number[], type: 'Point'}`,
    `{coordinates: number[][], type: 'MultiPoint'}`,
    `{coordinates: number[][], type: 'LineString'}`,
    `{coordinates: number[][][], type: 'MultiLineString'}`,
    `{coordinates: number[][], type: 'Polygon'}`,
    `{coordinates: number[][][][], type: 'MultiPolygon'}`,
    `{coordinates: number[][], type: 'Envelope'}`,
    `{coordinates: number[], radius: string | number, type: 'Circle'}`,
    `{geometries: any[], type: 'GeometryCollection'}`
].join(' | ');

interface Options {
    indent: number;
    interfaceName?: string;
    propertyPath: string[];
}

function getType(elsType: PropertyType, options: Options) {
    if (elsType.type === 'date') {
        return 'number';
    } else if (elsType.type === 'keyword') {
        return 'string';
    } else if (elsType.type === 'nested') {
        return generate(elsType.properties as Properties, {
            'indent': options.indent + 1, 
            'propertyPath': options.propertyPath,
        });
    } else if (elsType.type === 'text') {
        return 'string';
    } else if (elsType.type === 'geo_shape') {
        return GEO_SHAPE_TYPE;
    } else if (elsType.type === 'integer') {
        return 'number';
    } else if (elsType.type === 'geo_point') {
        const geoPointType = {'lon': {'type': 'float'}, 'lat': {'type': 'float'}};
        return generate(geoPointType, {
            'indent': options.indent + 1, 
            'propertyPath': options.propertyPath,
        });
    } else if (elsType.type === 'boolean') {
        return 'boolean';
    } else if (elsType.type === 'double') {
        return 'number';
    } else if (elsType.type === 'long') {
        return 'number';
    } else if (elsType.type === 'short') {
        return 'number';
    } else if (elsType.type === 'float') {
        return 'number';
    } else if (elsType.type === 'byte') {
        return 'number';
    } else {
        if (elsType.properties) {
            return generate(elsType.properties, {
                'indent': options.indent + 1, 
                'propertyPath': options.propertyPath,
            });
        } else {
            return 'any';
        }
    }
}

function generate(properties: Properties, options: Options) {
    const lines: string[] = [];
    const spaces = new Array((options.indent + 1) * 4 + 1).join(' ');
    lines.push(`{`);
    for (const key in properties) {
        const newPropertyPath = [...options.propertyPath, key];
        let type = getType(properties[key], {...options, 'propertyPath': newPropertyPath});
        const fullKey = newPropertyPath.join('.');
        if (0 <= arrayProperties.indexOf(fullKey)) {
            type = `Array<${type}>`;
        } if (0 <= maybeArrayProperties.indexOf(fullKey)) {
            type = `${type} | Array<${type}>`;
        }
        lines.push('');
        lines.push(`${spaces}// ${key}: ${properties[key].type}`);
        lines.push(`${spaces}'${key}': ${type};`);
    }
    const endingSpaces = new Array(options.indent * 4 + 1).join(' ');
    lines.push(`${endingSpaces}}`);
    if (options.interfaceName) {
        return `export interface ${options.interfaceName} ${lines.join('\n')}`;
    } else {
        return lines.join('\n');
    }
}

let text: string = '';
process.stdin.on('readable', () => {
    const data = process.stdin.read();
    if (data !== null) {
        text += data;
    }
});

let arrayProperties: string[] = [];
let maybeArrayProperties: string[] = [];
if (typeof yargs.argv.array === 'string') {
    arrayProperties = yargs.argv.array.split(',');
}
if (typeof yargs.argv.maybeArray === 'string') {
    maybeArrayProperties = yargs.argv.maybeArray.split(',');
}

process.stdin.on('end', () => {
    const interfaceName = yargs.argv._[0];
    let properties: Properties;
    try {
        properties = JSON.parse(text);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
        return;
    }
    console.log(generate(properties, {'interfaceName': interfaceName, 'indent': 0, 'propertyPath': []}));
});