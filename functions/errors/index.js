"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

var CustomError = /*#__PURE__*/function (_Error) {
  (0, _inherits2.default)(CustomError, _Error);

  function CustomError(status, msg) {
    var _this;

    (0, _classCallCheck2.default)(this, CustomError);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(CustomError).call(this, msg));
    _this.status = status;
    _this.message = msg;
    return _this;
  }

  return CustomError;
}((0, _wrapNativeSuper2.default)(Error));

module.exports = CustomError;
//# sourceMappingURL=index.js.map