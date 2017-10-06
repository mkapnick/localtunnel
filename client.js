var EventEmitter = require('events').EventEmitter;
var debug = require('debug')('localtunnel:client');

var Tunnel = require('./lib/Tunnel');

function localtunnel(port, opt, fn) {
    if (typeof opt === 'function') {
        fn = opt;
        opt = {};
    }

    opt = opt || {};
    opt.port = port;

    var client = Tunnel(opt);
    client.open(function(err) {
        if (err) {
            return fn(err);
        }

        fn(null, client);
    });
    return client;
};

localtunnel(80, { local_host: 'vimeo.dev', local_port: '80' }, () => {
    console.log('back');
});
