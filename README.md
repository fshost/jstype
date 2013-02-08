JsType
======

JavaScript explicit type checking that can be extended with custom types


### installation (Node.js)
    npm install jstype

    or load it in the browser with a script tag, or as an AMD module


### methods

#####jsType.type

######usage:

    jsType.type(value, [extended])

Returns string value type of an object similarly to 'typeof' but with the extended type differentiation similar to EcmaScript 6 (Harmony). This method relies on the value returned by Object.prototype.toString, as defined by the EcmaScript 5.1 spec:
>15.2.4.2 Object.prototype.toString ( )
   When the toString method is called, the following steps are taken:
   1. If the this value is undefined, return "[object Undefined]".
   2. If the this value is null, return "[object Null]"

Based on this, both undefined and null values return their value in string form (i.e. 'undefined' and 'null', respectively) as their type.  This differs from typeof in regards to null, which may return 'object' for null values but is more consistent with the above spec and more accurate than describing a null value to be an object.


Extended numeric type differentiation is optionally available by passing a second argument.  If getting extended numeric types, the values Infinity and NaN are given the same treatment as undefined and null - they return their value as their type.  Extended numeric types also distinguish between 'float' and 'integer' types. (See below for a full list of possible types).  

Examples:

	var type = require('jstype'),
		type = jsType.type;

    // primitives return same values as typeof
    type('some string');   // 'string'
    type(true);            // 'boolean'
    type(1);               // 'number'
    type(function() {});   // 'function'

    // object types are differentiated
    type([1, 2, 3]);       // 'array'
    type(/[a-z]/);         // 'regexp'
    type(new Date());      // 'date'
	type({ foo: 'bar' });  // 'object'

    // extended numeric types are optional
    type(1, true)          // 'integer'
    type(1.1, true);       // 'float'
	type(1/0, true);       // 'infinity'
    type(NaN, true);       // 'nan'



#####jsType.define

######usage:

    jsType.define([type], constructor)

Custom extended types may be added by passing a string type name and a constructor.  In order to check for custom types, the extended argument must be specified as true when calling the type method.  A third argument may be specified in the case of desiring to check against custom types but not extended numeric types.

Examples:
            
    function MyClass() { }
    jsType.define('myclass', MyClass);

	type(new MyClass());      // 'myclass'
    
    // or without specifying a type string (uses constructor name)
    jsType.define(MyClass);

    type(new MyClass());      // 'MyClass'

### License
MIT License

Copyright (c) 2013 Mashdraggin

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.