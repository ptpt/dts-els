# dts-els
A simple command line tool that generates TypeScript definition from ElasticSearch mappings.

## Installation

```
npm install dts-els
```

## Usage
```
usage: dts-els [--array ARRAY_PROPERTIES] [--maybe-array MAYBE_ARRAY_PROPERTIES] INTERFACE_NAME

ARRAY_PROPERTIES: Cast a property to an array of the derived type. Multiple properties are separated by comma.
MAYBE_ARRAY_PROPERTIES: Cast a property to the dervided type or an array of the type.
INTERFACE_NAME: Interface name of the definition
```

## Example
Assume you have [jq](https://stedolan.github.io/jq/) installed:
```shell
curl -s https://raw.githubusercontent.com/elastic/examples/master/Common%20Data%20Formats/twitter/twitter_template.json | jq .mappings.tweets.properties | npx dts-els --array=entities ITweet
```

will print out:
```typescript
export interface ITweet {

    // @timestamp: date
    '@timestamp': number;

    // text: text
    'text': string;

    // user: object
    'user': {
        // description: text
        'description': string;
    };

    // coordinates: object
    'coordinates': {
        // coordinates: geo_point
        'coordinates': {
            // lon: float
            'lon': number;
            // lat: float
            'lat': number;
        };
    };

    // entities: object
    'entities': Array<{
        // hashtags: object
        'hashtags': {
            // text: text
            'text': string;
        };
    }>;

    // retweeted_status: object
    'retweeted_status': {
        // text: text
        'text': string;
    };
}
```

## License
MIT. See License file.
