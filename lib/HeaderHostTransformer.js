var stream = require('stream');
var util = require('util');
var debug = require('debug')('localtunnel:client');

var Transform = stream.Transform;

var HeaderHostTransformer = function(opts) {
    if (!(this instanceof HeaderHostTransformer)) {
        return new HeaderHostTransformer(opts);
    }

    opts = opts || {}
    Transform.call(this, opts);

    var self = this;
    self.host = opts.host || 'localhost';
    self.replaced = false;
}
util.inherits(HeaderHostTransformer, Transform);

// since HeaderHostTransformer inherits from stream.Transform, we are
// overriding the _transform function and providing our own
HeaderHostTransformer.prototype._transform = function (chunk, enc, cb) {
    var self = this;

    // after replacing the first instance of the Host header
    // we just become a regular passthrough
    if (!self.replaced) {
        chunk = chunk.toString();
        debug('replacing first instance of the host header %s', chunk);
        self.push(chunk.replace(/(\r\n[Hh]ost: )\S+/, function(match, $1) {
            self.replaced = true;
            debug('replaced with %s %s', $1, self.host);
            return $1 + self.host;
        }));
    }
    else {
        self.push(chunk);
    }

    cb();
};

module.exports = HeaderHostTransformer;
