(function(root, name) {
    var node = typeof exports === 'object',
        mod = node ? module : {
            exports: {}
        };
    factory(mod, mod.exports);
    if (typeof define === 'function' && define.amd) {
        define(name, module.exports);
    } else if (!node) {
        root[name] = mod.exports;
    }

    function factory(module, exports) {
        var customTypes = [];
        var customConstructors = [];
        var reservedTypes = ["number", "undefined", "null", "infinity", "nan", "date", "regexp", "array", "integer", "float", "string", "function", "boolean", "object", "arguments"];
        var extendedTypes = ["nan", "infinity", "integer", "float"];
        /******************************************************************************
         * a function that returns the type of an object similarly to 'typeof' but with
         * the extended type differentiation proposed for EcmaScript 6 (Harmony). This
         * method relies on the value returned by Object.prototype.toString, converted
         * to a lower case string value matching the behavior of 'typeof', with some
         * special cases for distinguishing different numeric and object types.
         * The following values:
         *  - undefined
         *  - null
         * return their value as their type.  This is based on the following from the
         * EcmaScript 5.1 spec:
         *  > 15.2.4.2 Object.prototype.toString ( )
         *       When the toString method is called, the following steps are taken:
         *       1. If the this value is undefined, return "[object Undefined]".
         *       2. If the this value is null, return "[object Null]"
         * This differs from typeof in regards to null, which may return 'object' for
         * null values. Extended numeric type differentiation is optionally available
         * by passing a second argument.  If getting extended numeric types, the values:
         *  - Infinity
         *  - NaN
         * are given the same treatment as undefined and null - they return their value
         * as their type.  Extended numeric types also return types the following types:
         *  - integer
         *  - float
         * for values other than NaN or Infinity.  A full list of possible return values
         * is listed below.  Extended types may be added by passing a string type name
         * and a constructor.  In order to check for custom types, the extended argument
         * must be specified as true.  A third argument may be specified in the case of
         * desiring to check against custom types but not extended numeric types.
         *
         * @param value any type of JavaScript value to get the type of
         * @param {Boolean} extended whether to distinguish between numeric values and custom defined types
         * @param {Boolean} numericBase if extended is true, specifies whether to return extended numeric types
         * @returns {String} of one of one of the following types
         *      - undefined
         *      - null
         *      - infinity
         *      - nan
         *      - date
         *      - regexp
         *      - array
         *      - integer
         *      - float
         *      - string
         *      - function
         *      - boolean
         *      - object
         *
         * @example
         * var type = jsType.type;
         * type({ foo: 'bar' }); // 'object'
         * type(7.1, true); // 'float'
         * function MyClass() { }
         * defineType('myclass', MyClass);
         * var instance = new MyClass();
         * type(instance); // 'myclass'
         */
        function type(value, extended, baseNumeric) {
            if (value === 'undefined') return 'undefined';
            if (value === null) return 'null';
            if (extended) {
                var _type = typeof value;
                if (_type === 'number' && !baseNumeric) {
                    if (value.toString() === 'NaN') return 'nan';
                    if (value === Infinity) return 'infinity';
                    if (value % 1 === 0) return 'integer';
                    return 'float';
                }
                _type = null;
                var i = customTypes.length;
                while (i-- && !_type) {
                    _type = value instanceof customConstructors[i];
                    if (_type) return customTypes[i];
                }
            }
            // using split and substrings is faster than regular expressions
            var oclass = Object.prototype.toString.call(value).split(' ')[1];
            return oclass.substr(0, oclass.length - 1).toLowerCase();
        }
        exports.type = type;

        /**
         * define a custom type
         * @param {String} type named type for the constructor instances
         * @param {Function} constructor an object constructor
         */

        function define(typeName, constructor) {
            if (typeof typeName === 'function') {
                constructor = typeName;
                typeName = constructor.name || constructor;
            }
            if (reservedTypes.indexOf(typeName) > -1 || customTypes.indexOf(typeName) > -1) {
                throw new Error('"' + typeName + '" is already defined as a type');
            }
            customTypes.push(typeName);
            extendedTypes.push(typeName);
            customConstructors.push(constructor);
            var methodName = 'is' + typeName.charAt(0).toUpperCase() + typeName.substr(1);
            exports[methodName] = getMethod(typeName);
        }
        exports.define = define;

        function getMethod(curType) {
            if (extendedTypes.indexOf(curType) === -1) {
                return function(value) {
                    return type(value) === curType;
                };
            } else {
                return function (value) {
                    return type(value, true) === curType;
                };
            }
        }

        for (var i = 0, l = reservedTypes.length; i < l; i++) {
            var curType = reservedTypes[i];
            var methodName = 'is' + curType.charAt(0).toUpperCase() + curType.substr(1);
            exports[methodName] = getMethod(curType);
        }

    }
})(this, 'jsType');