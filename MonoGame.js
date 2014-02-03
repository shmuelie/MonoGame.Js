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

	if (window.Microsoft === undefined)
	{
	    window.Microsoft = {};
	}
	if (window.Microsoft.Xna === undefined)
	{
	    window.Microsoft.Xna = {};
	}
	if (window.Microsoft.Xna.Framework === undefined)
	{
	    window.Microsoft.Xna.Framework = {};
	}
	if (window.Microsoft.Xna.Framework.Graphics === undefined)
	{
	    window.Microsoft.Xna.Framework.Graphics = {};
	}

	var Framework = window.Microsoft.Xna.Framework;
	var Grapics = Framework.Graphics;

	//#region MathHelper

	Framework.MathHelper = {};
	var MathHelper = Framework.MathHelper;

	if (Object.defineProperty)
	{
	    Object.defineProperty(MathHelper, "E", {
			value: Math.E,
			writable: false,
			enumerable: true
		});

	    Object.defineProperty(MathHelper, "Log10E", {
			value: 0.4342945,
			writable: false,
			enumerable: true
		});

	    Object.defineProperty(MathHelper, "Log2E", {
			value: 1.442695,
			writable: false,
			enumerable: true
		});

	    Object.defineProperty(MathHelper, "Pi", {
			value: Math.PI,
			writable: false,
			enumerable: true
		});

	    Object.defineProperty(MathHelper, "PiOver2", {
			value: Math.PI / 2,
			writable: false,
			enumerable: true
		});

	    Object.defineProperty(MathHelper, "PiOver4", {
			value: Math.PI / 4,
			writable: false,
			enumerable: true
		});

	    Object.defineProperty(MathHelper, "TwoPi", {
			value: 2 * Math.PI,
			writable: false,
			enumerable: true
		});
	}
	else
	{
	    MathHelper.E = Math.E;
	    MathHelper.Log10E = 0.4342945;
	    MathHelper.Log2E = 1.442695;
	    MathHelper.Pi = Math.PI;
	    MathHelper.PiOver2 = Math.PI / 2;
	    MathHelper.PiOver4 = Math.PI / 4;
	    MathHelper.TwoPi = Math.PI * 2;
	}

	MathHelper.barycentric = function (value1, value2, value3, amount1, amount2)
	{
		return value1 + (value2 - value1) * amount1 + (value3 - value1) * amount2;
	};

	MathHelper.catmullRom = function (value1, value2, value3, value4, amount)
	{
		var amountSquared = amount * amount;
		var amountCubed = amountSquared * amount;
		return (0.5 * (2.0 * value2 + (value3 - value1) * amount + (2.0 * value1 - 5.0 * value2 + 4.0 * value3 - value4) * amountSquared + (3.0 * value2 - value1 - 3.0 * value3 + value4) * amountCubed));
	};

	MathHelper.clamp = function (value, min, max)
	{
	    // First we check to see if we're greater than the max
	    value = (value > max) ? max : value;

	    // Then we check to see if we're less than the min.
	    value = (value < min) ? min : value;

	    // There's no check to see if min > max.
	    return value;
	};

	MathHelper.distance = function (value1, value2)
	{
	    return Math.abs(value1 - value2);
	};

	MathHelper.hermite = function (value1, tangent1, value2, tangent2, amount)
	{
	    var v1 = value1, v2 = value2, t1 = tangent1, t2 = tangent2, s = amount, result;
	    var sCubed = s * s * s;
	    var sSquared = s * s;

	    if (amount === 0)
	    {
	        result = value1;
	    }
	    else if (amount === 1)
	    {	
	        result = value2;
	    }
	    else
	    {
	        result = (2 * v1 - 2 * v2 + t2 + t1) * sCubed + (3 * v2 - 3 * v1 - 2 * t1 - t2) * sSquared + t1 * s + v1;
	    }
	    return result;
	};

	MathHelper.lerp = function (value1, value2, amount)
	{
	    return value1 + (value2 - value1) * amount;
	};

	MathHelper.max = function (value1, value2)
	{
	    return Math.max(value1, value2);
	};

	MathHelper.min = function (value1, value2)
	{
	    return Math.min(value1, value2);
	};

	MathHelper.smoothStep = function (value1, value2, amount)
	{
	    var result = MathHelper.clamp(amount, 0, 1);
	    result = MathHelper.hermite(value1, 0, value2, 0, result);

	    return result;
	};

	MathHelper.toDegrees = function (radians)
	{
	    return radians * 57.295779513082320876798154814105;
	};

	MathHelper.toRadians = function (degrees)
	{
	    return degrees * 0.017453292519943295769236907684886;
	};

	MathHelper.iEEERemainder = function (x, y)
	{
	    return x - (y * Math.round(x / y));
	};

	MathHelper.wrapAngle = function (angle)
	{
	    angle = MathHelper.iEEERemainder(angle, 6.2831854820251465);
	    if (angle <= -3.14159274)
	    {
	        angle += 6.28318548;
	    }
	    else
	    {
		    if (angle > 3.14159274)
	        {
		        angle -= 6.28318548;
	        }
	    }
		return angle;
	};

	MathHelper.isPowerOfTwo = function (value)
	{
	    return (value > 0) && ((value & (value - 1)) === 0);
	};

	//#endregion

	//#region Point

	var Point_zeroPoint = new Point(0, 0);

	Framework.Point = function (x, y)
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
	var Point = Framework.Point;

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
		return (obj instanceof Point) ? ((this.X === obj.X) && (this.Y === obj.Y)) : false;
	};

	Point.prototype.toString = function ()
	{
		return "{X:" + this.X.toString() + " Y:" + this.Y.toString() + "}";
	}

	//#endregion

	//#region Rectangle

	var Rectangle_emptyRectangle = new Rectangle(0, 0, 0, 0);

	Framework.Rectangle = function (x, y, width, height)
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

			Object.defineProperty(this, "Width", {
				value: width,
				writable: true,
				enumerable: true,
			});

			Object.defineProperty(this, "Height", {
				value: height,
				writable: true,
				enumerable: true,
			});
		}
		else
		{
			this.X = x;
			this.Y = y;
			this.Width = width;
			this.Height = height;
		}
	}
	var Rectangle = Framework.Rectangle;

	if (Object.defineProperty)
	{
		Object.defineProperty(Rectangle.prototype, "empty", {
			get: function ()
			{
				return Rectangle_emptyRectangle;
			},
			enumerable: true,
			writable: false
		});
	}
	else
	{
		Rectangle.prototype.empty = Rectangle_emptyRectangle;
	}

	Rectangle.prototype.equals = function (obj)
	{
		return (obj instanceof Rectangle) ? ((this.X === obj.X) && (this.Y === obj.Y) && (this.Width === obj.Width) && (this.Height === obj.Height)) : false;
	};

	Rectangle.prototype.contains = function ()
	{
		if (arguments.length === 1)
		{
			var value = arguments[0];
			if (value instanceof Point)
			{
				return ((((this.X <= value.X) && (value.X < (this.X + this.Width))) && (this.Y <= value.Y)) && (value.Y < (this.Y + this.Height)));
			}
			else if (value instanceof Rectangle)
			{
				return ((((this.X <= value.X) && ((value.X + value.Width) <= (this.X + this.Width))) && (this.Y <= value.Y)) && ((value.Y + value.Height) <= (this.Y + this.Height)));
			}
			return false;
		}
		var x = arguments[0];
		var y = arguments[1];
		return ((((this.X <= x) && (x < (this.X + this.Width))) && (this.Y <= y)) && (y < (this.Y + this.Height)));
	};

	Rectangle.prototype.offset = function ()
	{
		if (arguments.length === 1)
		{
			var offset = arguments[0];
			this.X = offset.X;
			this.Y = offset.Y;
		}
		else
		{
			var offsetX = arguments[0];
			var offsetY = arguments[1];
			this.X = offsetX;
			this.Y = offsetY;
		}
	};

	Rectangle.prototype.center = function ()
	{
		return new Point(this.X + (this.Width / 2), this.Y + (this.Height / 2));
	};

	Rectangle.prototype.inflate = function (horizontalValue, verticalValue)
	{
		this.X -= horizontalValue;
		this.Y -= verticalValue;
		this.Width += horizontalValue * 2;
		this.Height += verticalValue * 2;
	};

	Rectangle.prototype.isEmpty = function ()
	{
		return ((((this.Width == 0) && (this.Height == 0)) && (this.X == 0)) && (this.Y == 0));
	};

	Rectangle.prototype.toString = function ()
	{
		return "{X:" + this.X + " Y:" + this.Y + " Width:" + this.Width + " Height:" + this.Height + "}";
	};

	Rectangle.prototype.intersects = function (value)
	{
		return value.left() < this.right() &&
				   this.left() < value.right() &&
				   value.top() < bottom() &&
				   this.top() < value.bottom();
	};

	Rectangle.union = function (value1, value2)
	{
		var x = Math.min(value1.X, value2.X);
		var y = Math.min(value1.Y, value2.Y);
		return new Rectangle(x, y,
							 Math.max(value1.right(), value2.right()) - x,
								 Math.max(value1.bottom(), value2.bottom()) - y);
	}

	Rectangle.prototype.left = function ()
	{
		return this.X;
	};

	Rectangle.prototype.right = function ()
	{
		return this.X + this.Width;
	};

	Rectangle.prototype.top = function ()
	{
		return this.Y;
	};

	Rectangle.prototype.bottom = function ()
	{
		return this.Y + this.Height;
	};

	//#endregion
})();