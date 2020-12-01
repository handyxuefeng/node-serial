"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg); var value = info.value;
    } catch (error) {
        reject(error); return;
    } if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}

function _asyncToGenerator(fn) {
    return function () {
        var self = this, args = arguments;
        return new Promise(function (resolve, reject) {
            var gen = fn.apply(self, args); function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined
            );
        });
    };
}

var filePath = path.resolve(__dirname, './name.txt');

function readAgeByAsync(_x) {
    return _readAgeByAsync.apply(this, arguments);
}

function _readAgeByAsync() {
    _readAgeByAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(filePath) {
        var ageFilename, ageContext;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return fs.readFile(filePath, 'utf8');

                    case 2:
                        ageFilename = _context.sent;
                        _context.next = 5;
                        return fs.readFile(path.resolve(__dirname, ageFilename), 'utf8');

                    case 5:
                        ageContext = _context.sent;
                        return _context.abrupt("return", ageContext);

                    case 7:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee);
    }));
    return _readAgeByAsync.apply(this, arguments);
}

;
readAgeByAsync(filePath).then(function (data) {
    console.log('async = ', data);
});