/**
 * Created by lonelydawn on 2017-03-09.
 */

const request = require('co-request');
const ramda = require('ramda');

module.exports = {
    config: function *(next){
        this.routeConfig = function() {
            return request.apply(request, arguments).then(function(res) {
                    return res;
                }
            );
        };
        yield next;
    }
};

