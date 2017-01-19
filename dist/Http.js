'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // TODO

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HOST = 'https://api.dc01.gamelockerapp.com/shards/na/';

var Http = function () {
  function Http(apiKey) {
    var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'v1';

    _classCallCheck(this, Http);

    this.options = {
      url: HOST,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.api+json',
        Authorization: 'Bearer ' + apiKey,
        'X-TITLE-ID': 'semc-vainglory' }
    };
  }

  _createClass(Http, [{
    key: 'execute',
    value: function execute() {
      var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'GET';
      var endpoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var _this = this;

      var query = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      function parseBody(body) {
        var parseOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (parseOptions.override) {
          return body;
        }

        try {
          var parsed = JSON.parse(body);
          if ('errors' in parsed) {
            return {
              error: true,
              message: parsed.errors
            };
          }

          return parsed;
        } catch (e) {
          return {
            error: true,
            message: e
          };
        }
      }

      return new Promise(function (resolve, reject) {
        if (endpoint === null) {
          throw reject(new Error('HTTP Error: No endpoint to provide a request to.'));
        }

        // TODO: Filter query params
        // const queryParsed = query && JSON.parse(query);

        _this.options.method = method;
        _this.options.url += endpoint;

        // if (queryParsed) {
        //   this.options.body = queryParsed;
        //   this.options.json = true;
        // }

        (0, _requestPromise2.default)(_this.options).then(function (body) {
          var parsedBody = parseBody(body, options);
          if ('error' in parsedBody && parsedBody.error) {
            return reject(new Error(parsedBody));
          }

          return resolve(parsedBody);
        });
      });
    }
  }]);

  return Http;
}();

exports.default = Http;