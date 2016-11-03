'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function (global, factory) {
    (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.manba = factory();
})(global || window, function () {
    "use strict";

    var FORMAT_LIST = {
        "l": "YYYY-MM-DD",
        "ll": "YYYY年MM月DD日",
        "k": "YYYY-MM-DD hh:mm",
        "kk": "YYYY年MM月DD日 hh点mm分",
        "kkk": "YYYY年MM月DD日 hh点mm分 q",
        "f": "YYYY-MM-DD hh:mm:ss",
        "ff": "YYYY年MM月DD日 hh点mm分ss秒",
        "fff": "YYYY年MM月DD日 hh点mm分ss秒 星期w",
        "n": "MM-DD",
        "nn": "MM月DD日"
    };

    var _SECONDS = 1000;
    var _MINUTES = 1000 * 60;
    var _HOURS = 1000 * 60 * 60;
    var _DAYS = 1000 * 60 * 60 * 24;
    var _WEEKS = _DAYS * 7;
    var _YEARS = _DAYS * 365;
    var MSE = new Date(1970, 0, 1, 0, 0, 0).getTime();

    var WEEK = ['日', '一', '二', '三', '四', '五', '六'];
    var DAY_STRING = ['上午', '下午'];
    var _manba = function _manba() {
        Utils.initmanba.apply(Utils, [this].concat(Array.prototype.slice.call(arguments)));
    };

    var Utils = {
        initmanba: function initmanba(manba_obj, arg_1, type) {
            var _date = new Date(),
                date_bak = _date;
            if (arg_1 != undefined) {
                if (Utils.isNumber(arg_1)) {
                    if (arg_1 < 9999999999) arg_1 = arg_1 * 1000;
                    _date.setTime(arg_1);
                } else if (Utils.isArray(arg_1)) {
                    Utils.padMonth(arg_1);
                    _date = new (Function.prototype.bind.apply(Date, [null].concat(_toConsumableArray(arg_1))))();
                } else if (Utils.isDate(arg_1)) {
                    _date = arg_1;
                } else if (Utils.isString(arg_1)) {
                    _date = Utils.parse(arg_1);
                } else if (arg_1 instanceof _manba) {
                    return arg_1;
                }
            }
            manba_obj._date = _date;
            if (date_bak === _date && manba_obj.timeDelay != 0) {
                manba_obj.add(manba_obj.timeDelay, manba.TIME);
            }
        },
        parse: function parse(str) {
            var aspNetJsonRegex = /^(\d{4})\-?(\d{2})\-?(\d{2})\s?\:?(\d{2})?\:?(\d{2})?\:?(\d{2})?$/i;
            var matched = aspNetJsonRegex.exec(str);
            if (matched !== null) {
                matched.shift();
                Utils.padMonth(matched);
                Utils.popUndefined(matched);
                return new (Function.prototype.bind.apply(Date, [null].concat(_toConsumableArray(matched))))();
            }
            var date = new Date(str);
            if (date == "Invalid Date") {
                console.error("Invalid date parse from \"" + str + "\"");
                return null;
            } else {
                return date;
            }
        },
        popUndefined: function popUndefined(arr) {
            if (arr.length > 0 && arr[arr.length - 1] == undefined) {
                arr.pop();
                return Utils.popUndefined(arr);
            }
            return arr;
        },
        padMonth: function padMonth(arr) {
            //自动补充月份
            if (arr.length > 1 && arr[1] > 0) arr[1] -= 1;
        },
        isLeapYear: function isLeapYear(year) {
            return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
        },
        format: function format(date, formatStr) {
            var str = formatStr;
            str = str.replace(/yyyy|YYYY/, date.getFullYear());
            str = str.replace(/yy|YY/, date.getYear() % 100 > 8 ? (date.getYear() % 100).toString() : '0' + date.getYear() % 100);
            str = str.replace(/MM/, date.getMonth() > 8 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1));
            str = str.replace(/M/g, date.getMonth() + 1);
            str = str.replace(/w|W/g, WEEK[date.getDay()]);
            str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
            str = str.replace(/d|D/g, date.getDate());
            str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
            str = str.replace(/h|H/g, date.getHours());
            str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
            str = str.replace(/m/g, date.getMinutes());
            str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
            str = str.replace(/s|S/g, date.getSeconds());
            str = str.replace(/q|Q/g, date.getHours() > 12 ? DAY_STRING[1] : DAY_STRING[0]);
            return str;
        },
        timestamp: function timestamp(date) {
            return Math.floor(date.getTime() / 1000);
        },
        getDays: function getDays(date) {
            return Math.floor((date.getTime() - MSE) / _DAYS);
        },
        getHours: function getHours(date) {
            return Math.floor((date.getTime() - MSE) / _HOURS);
        },
        getMonths: function getMonths(date) {
            return date.getYear() * 12 + date.getMonth() + 1;
        },
        isObject: function isObject(input) {
            return Object.prototype.toString.call(input) === '[object Object]';
        },
        isArray: function isArray(input) {
            return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
        },
        isDate: function isDate(input) {
            return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
        },
        isNumber: function isNumber(input) {
            return input instanceof Number || Object.prototype.toString.call(input) === '[object Number]';
        },
        isString: function isString(input) {
            return input instanceof String || Object.prototype.toString.call(input) === '[object String]';
        },
        extend: function extend(a, b) {
            for (var i in b) {
                if (hasOwnProp(b, i)) {
                    a[i] = b[i];
                }
            }

            if (hasOwnProp(b, 'toString')) {
                a.toString = b.toString;
            }

            if (hasOwnProp(b, 'valueOf')) {
                a.valueOf = b.valueOf;
            }

            return a;
        },
        makeGetSet: function makeGetSet(unit) {
            return function (value) {
                if (value != undefined) {
                    // if(unit=="Month")value = value>0?(value-1):0;
                    Date.prototype["set" + unit].call(this._date, value);
                    return this;
                } else {
                    return Date.prototype["get" + unit].call(this._date);
                    // return unit=="Month"?(result+1):result;
                }
            };
        }
    };

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    _manba.prototype = {
        timeDelay: 0,
        format: function format(str) {
            var m = this;

            var v = this.isValid();
            if (v !== true) return v;

            str = str || "l";
            var formatStr = FORMAT_LIST[str] || str;
            return Utils.format(m._date, formatStr);
        },
        toString: function toString() {
            var v = this.isValid();
            if (v !== true) return v;
            return this._date.toString();
        },
        toISOString: function toISOString() {
            var v = this.isValid();
            if (v !== true) return v;
            return this._date.toISOString();
        },
        distance: function distance(_m, type) {
            var v = this.isValid();
            if (v !== true) return v;
            var m = this;
            type = type || manba.DAY;
            _m = manba(_m);
            v = _m.isValid();
            if (v !== true) return v;
            switch (type) {
                case manba.MINUTE:
                    return Math.floor((m.time() - _m.time()) / 60 / 1000);
                case manba.HOUR:
                    return Utils.getHours(m._date) - Utils.getHours(_m._date);
                case manba.DAY:
                    return Utils.getDays(m._date) - Utils.getDays(_m._date);
                case manba.MONTH:
                    return Utils.getMonths(m._date) - Utils.getMonths(_m._date);
                case manba.YEAR:
                    return m._date.getYear() - _m._date.getYear();
            }
            return 0;
        },
        getWeekOfYear: function getWeekOfYear(weekStart) {
            var diff = 0;
            if (weekStart && weekStart == manba.MONDAY) {
                diff = 1;
            }
            var _date = this._date;
            var year = _date.getFullYear();
            var firstDay = new Date(year, 0, 1);
            var firstWeekDays = 7 - firstDay.getDay() + diff;
            var dayOfYear = (new Date(year, _date.getMonth(), _date.getDate()) - firstDay) / (24 * 3600 * 1000) + 1;
            return Math.ceil((dayOfYear - firstWeekDays) / 7) + 1;
        },
        getWeekOfMonth: function getWeekOfMonth(weekStart) {
            var diff = 0;
            if (weekStart && weekStart == manba.MONDAY) {
                diff = 1;
            }
            var dayOfWeek = this.day();
            var day = this.date();
            return Math.ceil((day - dayOfWeek - 1) / 7) + (dayOfWeek >= weekStart ? 1 : 0);
        },
        isLeapYear: function isLeapYear() {
            var v = this.isValid();
            if (v !== true) return v;
            return Utils.isLeapYear(this.year());
        },
        isThisYear: function isThisYear() {
            var v = this.isValid();
            if (v !== true) return v;
            return Utils.timestamp(this._date);
        },
        isBefore: function isBefore() {
            var v = this.isValid();
            if (v !== true) return v;
            return Utils.timestamp(this._date);
        },
        isAfter: function isAfter() {
            var v = this.isValid();
            if (v !== true) return v;
            return Utils.timestamp(this._date);
        },
        month: function month(num) {
            var v = this.isValid();
            if (v !== true) return v;
            var m = this;
            if (num == undefined) {
                return m._date.getMonth() + 1;
            }
            num = parseInt(num);
            num = m._date.setMonth(num - 1);
            return m;
        },
        add: function add(num, type) {
            var v = this.isValid();
            if (v !== true) return v;
            var m = this;
            num = parseInt(num);
            type = type || manba.DAY;

            switch (type) {
                case manba.DAY:
                    m.time(m.time() + num * _DAYS);
                    break;
                case manba.MONTH:
                    var month_add = m.month() + num;
                    var year_add = Math.floor(month_add / 12);
                    month_add = month_add % 12;
                    m.add(year_add, manba.YEAR);
                    m.month(month_add);
                    break;
                case manba.YEAR:
                    m.year(m.year() + num);
                    break;
                case manba.WEEK:
                    m.time(m.time() + num * _WEEKS);
                    break;
                case manba.HOUR:
                    m.time(m.time() + num * _HOURS);
                    break;
                case manba.MINUTE:
                    m.time(m.time() + num * _MINUTES);
                    break;
                case manba.SECOND:
                    m.time(m.time() + num * _SECONDS);
                    break;
                case manba.TIME:
                    m.time(m.time() + num);
                    break;
            }
            return m;
        },
        endOf: function endOf(type, set) {
            var v = this.isValid();
            if (v !== true) return v;
            var m = this;
            type = type || manba.DAY;
            m.startOf(type, set);
            m.add(1, type);
            // if (manba.DAY == type||manba.WEEK == type) {
            m.add(-1, manba.SECOND);
            // } else {
            // m.add(-1, manba.DAY);
            // }
            return m;
        },
        startOf: function startOf(type, set) {
            var v = this.isValid();
            if (v !== true) return v;
            var m = this;
            type = type || manba.DAY;
            switch (type) {
                case manba.DAY:
                    m.milliseconds(0);
                    m.seconds(0);
                    m.minutes(0);
                    m.hours(0);
                    break;
                case manba.MONTH:
                    m.date(1);
                    m.startOf(manba.DAY);
                    break;
                case manba.WEEK:
                    m.startOf(manba.DAY);
                    set = set || manba.SUNDAY;
                    var startDay = set == manba.SUNDAY ? 0 : 1;
                    if (m.day() == 0 && startDay == 1) {
                        startDay = -6;
                    }
                    m.add(-m.day() + startDay, manba.DAY);
                    break;
                case manba.YEAR:
                    m.month(1);
                    m.date(1);
                    m.startOf(manba.DAY);
                    break;
                case manba.HOUR:
                    m.time(Math.floor(m.time() / _HOURS) * _HOURS);
                    break;
            }
            return m;
        },
        isValid: function isValid() {
            return Utils.isDate(this._date) ? true : "Invalid Date";
        }
    };

    var manbaPrototype__proto = _manba.prototype;

    var methods = {
        "year": "FullYear",
        "day": "Day",
        "date": "Date",
        "hours": "Hours",
        "milliseconds": "Milliseconds",
        "seconds": "Seconds",
        "minutes": "Minutes",
        "time": "Time"
    };

    for (var unit in methods) {
        manbaPrototype__proto[unit] = Utils.makeGetSet(methods[unit]);
    }

    var manba = function manba(param) {
        if (param instanceof _manba) {
            return param;
        } else if (Utils.isObject(param)) {
            //config
            if (param.formatString && Utils.isObject(param.formatString)) {
                Utils.extend(FORMAT_LIST, param.formatString);
            }
            if (param.now) {
                _manba.prototype.timeDelay = manba(param.now).time() - manba().time();
            }
        } else {
            return new _manba(param);
        }
    };

    manba.config = function (param) {
        if (param.formatString && Utils.isObject(param.formatString)) {
            Utils.extend(FORMAT_LIST, param.formatString);
        }
        if (param.now) {
            _manba.prototype.timeDelay = manba(param.now).time() - manba().time();
        }
    };

    manba.SECOND = 2;
    manba.MINUTE = 3;
    manba.HOUR = 4;
    manba.DAY = 5;
    manba.MONTH = 6;
    manba.YEAR = 7;
    manba.WEEK = 8;
    manba.TIME = 9;

    manba.MONDAY = 1;
    manba.SUNDAY = 2;
    return manba;
});