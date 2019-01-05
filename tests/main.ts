import {Tweet as ActualTweet} from './Tweet';

interface ReferenceTweet {
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

const a: ReferenceTweet extends ActualTweet? true : false = true;
const b: ActualTweet extends ReferenceTweet? true : false = true;