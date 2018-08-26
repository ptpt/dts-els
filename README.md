# dts-els
A simple command line tool that generate TypeScript definition from ElasticSearch mappings.

## Usage
```
usage: dts-els [--array ARRAY_PROPERTIES] [--maybe-array MAYBE_ARRAY_PROPERTIES] INTERFACE_NAME

ARRAY_PROPERTIES: Cast a property to an array of the derived type. Multiple properties are separated by comma.
MAYBE_ARRAY_PROPERTIES: Cast a property to the dervided type or an array of the type.
INTERFACE_NAME: Interface name of the definition
```

## Example
Assume you have had the [tweet mapping](https://github.com/elastic/examples/blob/master/Common%20Data%20Formats/twitter/twitter_template.json) loaded, and [jq](https://stedolan.github.io/jq/) installed.
```shell
curl -s "localhost:9200/tweets/_mapping/tweet" | jq .tweets.mappings.tweets.properties | dts-els --array=entities
```

```typescript
{

    // @timestamp: date
    '@timestamp': number;

    // coordinates: undefined
    'coordinates': {

        // coordinates: geo_point
        'coordinates': {

            // lon: float
            'lon': number;

            // lat: float
            'lat': number;
        };
    };

    // entities: undefined
    'entities': Array<{

        // hashtags: undefined
        'hashtags': {

            // text: text
            'text': string;
        };
    }>;

    // retweeted_status: undefined
    'retweeted_status': {

        // text: text
        'text': string;
    };

    // text: text
    'text': string;

    // user: undefined
    'user': {

        // description: text
        'description': string;
    };
}
```

## License
MIT. See License file.