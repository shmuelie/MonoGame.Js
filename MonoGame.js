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
		return (obj instanceof Point) ? ((this.X === obj.X) && (this.Y === obj.Y)) : false;
	};

	Point.prototype.toString = function ()
	{
		return "{X:" + this.X.toString() + " Y:" + this.Y.toString() + "}";
	}

	//#endregion

	//#region Rectangle

	var Rectangle_emptyRectangle = new Rectangle(0, 0, 0, 0);

	function Rectangle(x, y, width, height)
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