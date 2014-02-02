(function ()
{
    if (Object.prototype.__defineGetter__ && !Object.defineProperty)
    {
        Object.defineProperty = function (obj, prop, desc)
        {
            /// <summary>
            ///     Defines a new property directly on an object, or modifies an existing property on an object, and returns the object.
            /// </summary>
            /// <param name="obj" type="Object">
            ///     The object on which to define the property.
            /// </param>
            /// <param name="prop" type="String">
            ///     The name of the property to be defined or modified.
            /// </param>
            /// <param name="desc" type="Object">
            ///     The descriptor for the property being defined or modified.
            /// </param>
            /// <returns type="Object">
            ///     The object
            /// </returns>
            /// <remarks>
            ///     Base on code from http://blogs.msdn.com/b/ie/archive/2010/09/07/transitioning-existing-code-to-the-es5-getter-setter-apis.aspx
            ///     NOTE: Any code that wishes to use getters/setters should check for Object.defineProperty before doing so. All this code does is convert the legacy way to the new way, but the legacy way must exists. (If the legacy way does not exists the mapping doesn't happen so you only need to check the new way.)
            /// </remarks>
            if ("get" in desc)
            {
                obj.__defineGetter__(prop, desc.get);
            }
            if ("set" in desc)
            {
                obj.__defineSetter__(prop, desc.set);
            }
            return obj;
        }
    }

    //#region Point

    var Point_zeroPoint = new Point(0, 0);

    function Point(x, y)
    {
        if (Object.defineProperty)
        {
            Object.defineProperty(this, "X", {
                value: x,
                writable: true,
                enumerable: true,
            });

            Object.defineProperty(this, "Y", {
                value: y,
                writable: true,
                enumerable: true,
            });
        }
        else
        {
            this.X = x;
            this.Y = y;
        }
    }

    if (Object.defineProperty)
    {
        Object.defineProperty(Point.prototype, "zero", {
            get: function ()
            {
                return Point_zeroPoint;
            },
            enumerable: true,
            writable: false
        });
    }
    else
    {
        Point.prototype.zero = Point_zeroPoint;
    }

    Point.prototype.add = function (other)
    {
        return new Point(this.X + other.X, this.Y + other.Y);
    };

    Point.prototype.subtract = function (other)
    {
        return new Point(this.X - other.X, this.Y - other.Y);
    };

    Point.prototype.mutliply = function (other)
    {
        return new Point(this.X * other.X, this.Y * other.Y);
    };

    Point.prototype.divide = function (other)
    {
        return new Point(this.X / other.X, this.Y / other.Y);
    };

    Point.prototype.equals = function (obj)
    {
        return (obj instanceof Point) ? ((this.X == obj.X) && (this.Y == obj.Y)) : false;
    };

    Point.prototype.toString = function ()
    {
        return "{X:" + this.X.toString() + " Y:" + this.Y.toString() + "}";
    }

    //#endregion

    
})();