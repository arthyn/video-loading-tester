let f = (a, b) => [].concat(...a.map(a => b.map(b => [].concat(a, b))));
let cartesian = (a, b, ...c) => b ? cartesian(f(a, b), ...c) : a;

class AttributeGenerator {
    constructor(eventHandler) {
        const data = {
            sources: {
              webm: '',
              mp4: ''
            },
            parameters: [
              {
                name: 'lazyLoad',
                values: [true],
              },
              {
                name: 'visible',
                values: [true, false],
              },
              {
                name: 'preload',
                values: ['none', 'metadata', 'auto']
              },
              {
                name: 'playsinline',
                values: [true, false]
              },
              {
                name: 'autoplay',
                values: [true, false]
              }
            ],
            events: {
              status: ['onLoadStart', 'onLoadedMetadata', 'onLoadedData', 'onLoad', 'onLoadEnd', 'onCanPlay', 'onCanPlayThrough', 'onPlay', 'onPlaying'],
              exceptions: ['onAbort', 'onError', 'onStalled', 'onSuspend', 'onWaiting', 'onEmptied']
            }
          };     
        
        this.eventHandler = eventHandler;
        this.sets = this.generatePlayerList(data.parameters);
        this.handlers = this.generateEventHandlers(data.events);
    }

    generatePlayerList(data) {
        let arrays = data.map(array => array.values);
        let products = cartesian(...arrays);
        
        return products.map(product => {
            return data.reduce((set, attr, index) => {
                set[attr.name] = product[index];
                return set;
            }, {});
        });
    }

    generateEventHandlers(events) {
        return Object.keys(events).reduce((sum, key) => {
            return events[key].reduce((result, prop) => {
            result[prop] = this.eventHandler;
            return result;
            }, sum);
        }, {});
    }
    
    generateSetId = (set) => Object.keys(set).reduce((id, key) => `${id}${key}:${set[key]}|`, '');
}

export default AttributeGenerator;