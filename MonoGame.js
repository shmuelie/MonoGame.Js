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
			if ("value" in desc)
			{
				obj[prop] = desc.value;
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
	var Graphics = Framework.Graphics;

	var MIN_DATE = new Date(-8640000000000000);

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

	Framework.Point = function (x, y)
	{
		if (Object.defineProperty)
		{
			Object.defineProperty(this, "x", {
				value: x,
				writable: true,
				enumerable: true,
			});

			Object.defineProperty(this, "y", {
				value: y,
				writable: true,
				enumerable: true,
			});
		}
		else
		{
			this.x = x;
			this.y = y;
		}
	}
	var Point = Framework.Point;

	var Point_zeroPoint = new Point(0, 0);

	if (Object.defineProperty)
	{
		Object.defineProperty(Point.prototype, "zero", {
			get: function ()
			{
				return Point_zeroPoint;
			},
			enumerable: true
		});
	}
	else
	{
		Point.prototype.zero = Point_zeroPoint;
	}

	Point.prototype.add = function (other)
	{
		return new Point(this.x + other.x, this.y + other.y);
	};

	Point.prototype.subtract = function (other)
	{
		return new Point(this.x - other.x, this.y - other.y);
	};

	Point.prototype.mutliply = function (other)
	{
		return new Point(this.x * other.x, this.y * other.y);
	};

	Point.prototype.divide = function (other)
	{
		return new Point(this.x / other.x, this.y / other.y);
	};

	Point.prototype.equals = function (obj)
	{
		return (obj instanceof Point) ? ((this.x === obj.x) && (this.y === obj.y)) : false;
	};

	Point.prototype.toString = function ()
	{
		return "{x:" + this.x.toString() + " y:" + this.y.toString() + "}";
	}

	//#endregion

	//#region Rectangle

	Framework.Rectangle = function (x, y, width, height)
	{
		if (Object.defineProperty)
		{
			Object.defineProperty(this, "x", {
				value: x,
				writable: true,
				enumerable: true,
			});

			Object.defineProperty(this, "y", {
				value: y,
				writable: true,
				enumerable: true,
			});

			Object.defineProperty(this, "width", {
				value: width,
				writable: true,
				enumerable: true,
			});

			Object.defineProperty(this, "height", {
				value: height,
				writable: true,
				enumerable: true,
			});
		}
		else
		{
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
		}
	}
	var Rectangle = Framework.Rectangle;

	var Rectangle_emptyRectangle = new Rectangle(0, 0, 0, 0);

	if (Object.defineProperty)
	{
		Object.defineProperty(Rectangle.prototype, "empty", {
			get: function ()
			{
				return Rectangle_emptyRectangle;
			},
			enumerable: true,
		});
	}
	else
	{
		Rectangle.prototype.empty = Rectangle_emptyRectangle;
	}

	Rectangle.prototype.equals = function (obj)
	{
		return (obj instanceof Rectangle) ? ((this.x === obj.x) && (this.y === obj.y) && (this.width === obj.width) && (this.height === obj.height)) : false;
	};

	Rectangle.prototype.contains = function ()
	{
		if (arguments.length === 1)
		{
			var value = arguments[0];
			if (value instanceof Point)
			{
				return ((((this.x <= value.x) && (value.x < (this.x + this.width))) && (this.y <= value.y)) && (value.y < (this.y + this.height)));
			}
			else if (value instanceof Rectangle)
			{
				return ((((this.x <= value.x) && ((value.x + value.width) <= (this.x + this.width))) && (this.y <= value.y)) && ((value.y + value.height) <= (this.y + this.height)));
			}
			return false;
		}
		var x = arguments[0];
		var y = arguments[1];
		return ((((this.x <= x) && (x < (this.x + this.width))) && (this.y <= y)) && (y < (this.y + this.height)));
	};

	Rectangle.prototype.offset = function ()
	{
		if (arguments.length === 1)
		{
			var offset = arguments[0];
			this.x = offset.x;
			this.y = offset.y;
		}
		else
		{
			var offsetx = arguments[0];
			var offsety = arguments[1];
			this.x = offsetx;
			this.y = offsety;
		}
	};

	Rectangle.prototype.center = function ()
	{
		return new Point(this.x + (this.width / 2), this.y + (this.height / 2));
	};

	Rectangle.prototype.inflate = function (horizontalValue, verticalValue)
	{
		this.x -= horizontalValue;
		this.y -= verticalValue;
		this.width += horizontalValue * 2;
		this.height += verticalValue * 2;
	};

	Rectangle.prototype.isEmpty = function ()
	{
		return ((((this.width == 0) && (this.height == 0)) && (this.x == 0)) && (this.y == 0));
	};

	Rectangle.prototype.toString = function ()
	{
		return "{x:" + this.x + " y:" + this.y + " width:" + this.width + " height:" + this.height + "}";
	};

	Rectangle.prototype.intersects = function (value)
	{
		return value.left() < this.right() &&
				   this.left() < value.right() &&
				   value.top() < this.bottom() &&
				   this.top() < value.bottom();
	};

	Rectangle.union = function (value1, value2)
	{
		var x = Math.min(value1.x, value2.x);
		var y = Math.min(value1.y, value2.y);
		return new Rectangle(x, y,
							 Math.max(value1.right(), value2.right()) - x,
								 Math.max(value1.bottom(), value2.bottom()) - y);
	}

	Rectangle.prototype.left = function ()
	{
		return this.x;
	};

	Rectangle.prototype.right = function ()
	{
		return this.x + this.width;
	};

	Rectangle.prototype.top = function ()
	{
		return this.y;
	};

	Rectangle.prototype.bottom = function ()
	{
		return this.y + this.Height;
	};

	//#endregion

	//#region Vector2

	Framework.Vector2 = function (x, y)
	{
		if (y === undefined)
		{
			y = x;
		}

		if (Object.defineProperty)
		{
			Object.defineProperty(this, "x", {
				value: x,
				writable: true,
				enumerable: true,
			});

			Object.defineProperty(this, "y", {
				value: y,
				writable: true,
				enumerable: true,
			});
		}
		else
		{
			this.x = x;
			this.y = y;
		}
	}
	var Vector2 = Framework.Vector2;

	var Vector2_zeroVector = new Vector2(0);
	var Vector2_unitVector = new Vector2(1);
	var Vector2_unitXVector = new Vector2(1, 0);
	var Vector2_unitYVector = new Vector2(0, 1);

	if (Object.defineProperty)
	{
		Object.defineProperty(Vector2.prototype, "zero", {
			get: function ()
			{
				return Vector2_zeroVector;
			},
			enumerable: true
		});

		Object.defineProperty(Vector2.prototype, "unitVector", {
			get: function ()
			{
				return Vector2_unitVector;
			},
			enumerable: true
		});

		Object.defineProperty(Vector2.prototype, "unitXVector", {
			get: function ()
			{
				return Vector2_unitXVector;
			},
			enumerable: true
		});

		Object.defineProperty(Vector2.prototype, "unitYVector", {
			get: function ()
			{
				return Vector2_unitYVector;
			},
			enumerable: true
		});
	}
	else
	{
		Vector2.prototype.zero = Vector2_zeroVector;
		Vector2.prototype.unitVector = Vector2_unitVector;
		Vector2.prototype.unitXVector = Vector2_unitXVector;
		Vector2.prototype.unitYVector = Vector2_unitYVector;
	}

	Vector2.prototype.negate = function ()
	{
		return new Vector2(this.x, this.y);
	};

	Vector2.prototype.equals = function (obj)
	{
		return (obj instanceof Vector2) ? ((obj.x === this.x) && (obj.y === this.y)) : false;
	};

	Vector2.prototype.add = function (other)
	{
		return new Vector2(this.x + other.x, this.y + other.y);
	};

	Vector2.prototype.multiply = function (other)
	{
		if (typeof other === "number")
		{
			return new Vector2(this.x * other, this.y * other);
		}
		return new Vector2(this.x * other.x, this.y * other.y);
	};

	Vector2.prototype.divide = function (other)
	{
		if (typeof other === "number")
		{
			return new Vector2(this.x / other, this.y / other);
		}
		return new Vector2(this.x / other.x, this.y / other.y);
	};

	Vector2.distance = function (value1, value2)
	{
		var v1 = value1.x - value2.x, v2 = value1.y - value2.y;
		return Math.sqrt((v1 * v1) + (v2 * v2));
	};

	Vector2.distanceSquared = function (value1, value2)
	{
		var v1 = value1.x - value2.x, v2 = value1.y - value2.y;
		return (v1 * v1) + (v2 * v2);
	};

	Vector2.reflect = function (vector, normal)
	{
		var result = new Vector2(0, 0);
		var val = 2.0 * ((vector.x * normal.x) + (vector.y * normal.y));
		result.x = vector.x - (normal.x * val);
		result.y = vector.y - (normal.y * val);
		return result;
	};

	Vector2.prototype.length = function ()
	{
		return Math.sqrt((this.x * this.x) + (this.y * this.y));
	};

	Vector2.prototype.lengthSquared = function ()
	{
		return (this.x * this.x) + (this.y * this.y);
	};

	Vector2.max = function (value1, value2)
	{
		return new Vector2(value1.x > value2.x ? value1.x : value2.x, value1.y > value2.y ? value1.y : value2.y);
	};

	Vector2.min = function (value1, value2)
	{
		return new Vector2(value1.x < value2.x ? value1.x : value2.x, value1.y < value2.y ? value1.y : value2.y);
	};

	Vector2.prototype.normalize = function ()
	{
		var val = 1.0 / Math.sqrt((this.x * this.x) + (this.y * this.y));
		this.x *= val;
		this.y *= val;
	};

	Vector2.barycentric = function (value1, value2, value3, amount1, amount2)
	{
		return new Vector2(MathHelper.barycentric(value1.x, value2.x, value3.x, amount1, amount2), MathHelper.barycentric(value1.y, value2.y, value3.y, amount1, amount2));
	};

	Vector2.catmullRom = function (value1, value2, value3, value4, amount)
	{
		return new Vector2(MathHelper.catmullRom(value1.x, value2.x, value3.x, value4.x, amount), MathHelper.catmullRom(value1.y, value2.y, value3.y, value4.y, amount));
	};

	Vector2.clamp = function (value1, min, max)
	{
		return new Vector2(MathHelper.clamp(value1.x, min.x, max.x), MathHelper.clamp(value1.y, min.y, max.y));
	};

	Vector2.lerp = function (value1, value2, amount)
	{
		return new Vector2(MathHelper.lerp(value1.x, value2.x, amount), MathHelper.lerp(value1.y, value2.y, amount));
	};

	Vector2.smoothStep = function (value1, value2, amount)
	{
		return new Vector2(MathHelper.smoothStep(value1.x, value2.x, amount), MathHelper.smoothStep(value1.y, value2.y, amount));
	};

	Vector2.transform = function ()
	{
		switch(arguments.length)
		{
			case 2:
				return Vector2_transform2(arguments[0], arguments[1]);
			case 3:
				return Vector2_transform6(arguments[0], 0, arguments[1], arguments[2], 0, arguments[0].length);
			case 6:
				return Vector2_transform6(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
		}
	};

	function Vector2_transform2 (position, matrix)
	{
		return new Vector2((position.x * matrix.m11) + (position.y * matrix.m21) + matrix.m41, (position.x * matrix.m12) + (position.y * matrix.m22) + matrix.m42);
	}

	function Vector2_transform6 (sourceArray, sourceIndex, matrix, destinationArray, destinationIndex, length)
	{
		for (var x = 0; x < length; x++) {
			var position = sourceArray[sourceIndex + x];
			var destination = destinationArray[destinationIndex + x];
			destination.x = (position.x * matrix.m11) + (position.y * matrix.m21) + matrix.m41;
			destination.y = (position.x * matrix.m12) + (position.y * matrix.m22) + matrix.m42;
			destinationArray[destinationIndex + x] = destination;
		}
	}

	Vector2.transformNormal = function (normal, matrix)
	{
		return new Vector2((normal.x * matrix.m11) + (normal.y * matrix.m21), (normal.x * matrix.m12) + (normal.y * matrix.m22));
	};

	//#endregion

	//#region Matrix

	Framework.Matrix = function (m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44)
	{
		if (Object.defineProperties)
		{
			Object.defineProperty(Matrix, "m11", {
				value: m11,
				writable: true,
				enumerable: true,
			});
			Object.defineProperty(Matrix, "m12", {
				value: m12,
				writable: true,
				enumerable: true,
			});
			Object.defineProperty(Matrix, "m13", {
				value: m13,
				writable: true,
				enumerable: true,
			});
			Object.defineProperty(Matrix, "m14", {
				value: m14,
				writable: true,
				enumerable: true,
			});

			Object.defineProperty(Matrix, "m21", {
				value: m21,
				writable: true,
				enumerable: true,
			});
			Object.defineProperty(Matrix, "m22", {
				value: m22,
				writable: true,
				enumerable: true,
			});
			Object.defineProperty(Matrix, "m23", {
				value: m23,
				writable: true,
				enumerable: true,
			});
			Object.defineProperty(Matrix, "m24", {
				value: m24,
				writable: true,
				enumerable: true,
			});

			Object.defineProperty(Matrix, "m31", {
				value: m31,
				writable: true,
				enumerable: true,
			});
			Object.defineProperty(Matrix, "m32", {
				value: m32,
				writable: true,
				enumerable: true,
			});
			Object.defineProperty(Matrix, "m33", {
				value: m33,
				writable: true,
				enumerable: true,
			});
			Object.defineProperty(Matrix, "m34", {
				value: m34,
				writable: true,
				enumerable: true,
			});

			Object.defineProperty(Matrix, "m41", {
				value: m41,
				writable: true,
				enumerable: true,
			});
			Object.defineProperty(Matrix, "m42", {
				value: m42,
				writable: true,
				enumerable: true,
			});
			Object.defineProperty(Matrix, "m43", {
				value: m43,
				writable: true,
				enumerable: true,
			});
			Object.defineProperty(Matrix, "m44", {
				value: m44,
				writable: true,
				enumerable: true,
			});
		}
		else
		{
			this.m11 = m11;
			this.m12 = m12;
			this.m13 = m13;
			this.m14 = m14;

			this.m21 = m21;
			this.m22 = m22;
			this.m23 = m23;
			this.m24 = m24;

			this.m31 = m31;
			this.m32 = m32;
			this.m33 = m33;
			this.m34 = m34;

			this.m41 = m41;
			this.m42 = m42;
			this.m43 = m43;
			this.m44 = m44;
		}
	}
	var Matrix = Framework.Matrix;

	var Matrix_identity = new Matrix(1, 0, 0, 0,
									 0, 1, 0, 0,
									 0, 0, 1, 0,
									 0, 0, 0, 1);

	if (Object.defineProperties)
	{
		Object.defineProperty(Matrix.prototype, "identity", {
			get: function ()
			{
				return Matrix_identity;
			},
			enumerable: true
		});
	}
	else
	{
		Matrix.prototype.identity = Matrix_identity;
	}

	Matrix.add = function (matrix1, matrix2)
	{
		var newMatrix = new Matrix(
		matrix1.m11 + matrix2.m11,
		matrix1.m12 + matrix2.m12,
		matrix1.m13 + matrix2.m13,
		matrix1.m14 + matrix2.m14,
		matrix1.m21 + matrix2.m21,
		matrix1.m22 + matrix2.m22,
		matrix1.m23 + matrix2.m23,
		matrix1.m24 + matrix2.m24,
		matrix1.m31 + matrix2.m31,
		matrix1.m32 + matrix2.m32,
		matrix1.m33 + matrix2.m33,
		matrix1.m34 + matrix2.m34,
		matrix1.m41 + matrix2.m41,
		matrix1.m42 + matrix2.m42,
		matrix1.m43 + matrix2.m43,
		matrix1.m44 + matrix2.m44)
		return newMatrix;
	};

	Matrix.createOrthographic = function (width, height, zNearPlane, zFarPlane)
	{
		var matrix = new Matrix(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		matrix.m11 = 2 / width;
		matrix.m12 = matrix.m13 = matrix.m14 = 0;
		matrix.m22 = 2 / height;
		matrix.m21 = matrix.m23 = matrix.m24 = 0;
		matrix.m33 = 1 / (zNearPlane - zFarPlane);
		matrix.m31 = matrix.m32 = matrix.m34 = 0;
		matrix.m41 = matrix.m42 = 0;
		matrix.m43 = zNearPlane / (zNearPlane - zFarPlane);
		matrix.m44 = 1;
		return matrix;
	};

	Matrix.createOrthographicOffCenter = function (left, right, bottom, top, zNearPlane, zFarPlane)
	{
		var matrix = new Matrix(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		matrix.m11 = (2.0 / (right - left));
		matrix.m12 = 0.0;
		matrix.m13 = 0.0;
		matrix.m14 = 0.0;
		matrix.m21 = 0.0;
		matrix.m22 = (2.0 / (top - bottom));
		matrix.m23 = 0.0;
		matrix.m24 = 0.0;
		matrix.m31 = 0.0;
		matrix.m32 = 0.0;
		matrix.m33 = (1.0 / (zNearPlane - zFarPlane));
		matrix.m34 = 0.0;
		matrix.m41 = ((left + right) / (left - right));
		matrix.m42 = ((top + bottom) / (bottom - top));
		matrix.m43 = (zNearPlane / (zNearPlane - zFarPlane));
		matrix.m44 = 1.0;
		return matrix;
	};

	Matrix.createPerspective = function (width, height, nearPlaneDistance, farPlaneDistance)
	{
		var matrix = new Matrix(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		if (nearPlaneDistance <= 0)
		{
			throw new Error("nearPlaneDistance <= 0");
		}
		if (farPlaneDistance <= 0)
		{
			throw new Error("farPlaneDistance <= 0");
		}
		if (nearPlaneDistance >= farPlaneDistance)
		{
			throw new Error("nearPlaneDistance >= farPlaneDistance");
		}
		matrix.m11 = (2 * nearPlaneDistance) / width;
		matrix.m12 = matrix.m13 = matrix.m14 = 0;
		matrix.m22 = (2 * nearPlaneDistance) / height;
		matrix.m21 = matrix.m23 = matrix.m24 = 0;
		matrix.m33 = farPlaneDistance / (nearPlaneDistance - farPlaneDistance);
		matrix.m31 = matrix.m32 = 0;
		matrix.m34 = -1;
		matrix.m41 = matrix.m42 = matrix.m44 = 0;
		matrix.m43 = (nearPlaneDistance * farPlaneDistance) / (nearPlaneDistance - farPlaneDistance);
		return matrix;
	};

	Matrix.createPerspectiveFieldOfView = function (fieldOfView, aspectRatio, nearPlaneDistance, farPlaneDistance)
	{
		var matrix = new Matrix(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		if ((fieldOfView <= 0) || (fieldOfView >= 3.141593))
		{
			throw new Error("fieldOfView <= 0 O >= PI");
		}
		if (nearPlaneDistance <= 0)
		{
			throw new Error("nearPlaneDistance <= 0");
		}
		if (farPlaneDistance <= 0)
		{
			throw new Error("farPlaneDistance <= 0");
		}
		if (nearPlaneDistance >= farPlaneDistance)
		{
			throw new Error("nearPlaneDistance >= farPlaneDistance");
		}
		var num = 1 / (Math.tan((fieldOfView * 0.5)));
		var num9 = num / aspectRatio;
		matrix.m11 = num9;
		matrix.m12 = matrix.m13 = matrix.m14 = 0;
		matrix.m22 = num;
		matrix.m21 = matrix.m23 = matrix.m24 = 0;
		matrix.m31 = matrix.m32 = 0;
		matrix.m33 = farPlaneDistance / (nearPlaneDistance - farPlaneDistance);
		matrix.m34 = -1;
		matrix.m41 = matrix.m42 = matrix.m44 = 0;
		matrix.m43 = (nearPlaneDistance * farPlaneDistance) / (nearPlaneDistance - farPlaneDistance);
		return matrix;
	};

	Matrix.createPerspectiveOffCenter = function (left, right, bottom, top, nearPlaneDistance, farPlaneDistance)
	{
		var matrix = new Matrix(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		if (nearPlaneDistance <= 0)
		{
			throw new Error("nearPlaneDistance <= 0");
		}
		if (farPlaneDistance <= 0)
		{
			throw new Error("farPlaneDistance <= 0");
		}
		if (nearPlaneDistance >= farPlaneDistance)
		{
			throw new Error("nearPlaneDistance >= farPlaneDistance");
		}
		matrix.m11 = (2 * nearPlaneDistance) / (right - left);
		matrix.m12 = matrix.m13 = matrix.m14 = 0;
		matrix.m22 = (2 * nearPlaneDistance) / (top - bottom);
		matrix.m21 = matrix.m23 = matrix.m24 = 0;
		matrix.m31 = (left + right) / (right - left);
		matrix.m32 = (top + bottom) / (top - bottom);
		matrix.m33 = farPlaneDistance / (nearPlaneDistance - farPlaneDistance);
		matrix.m34 = -1;
		matrix.m43 = (nearPlaneDistance * farPlaneDistance) / (nearPlaneDistance - farPlaneDistance);
		matrix.m41 = matrix.m42 = matrix.m44 = 0;
		return matrix;
	};

	Matrix.createScale = function ()
	{
		if (arguments.length === 1)
		{
			var scale = arguments[0];
			return new Matrix(scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, 1);
		}
		var xScale = arguments[0];
		var yScale = arguments[1];
		var zScale = arguments[2];
		return new Matrix(zScale, 0, 0, 0, 0, yScale, 0, 0, 0, 0, zScale, 0, 0, 0, 0, 1);
	};

	Matrix.createTranslation = function (xPosition, yPosition, zPosition)
	{
		return new Matrix(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, xPosition, yPosition, zPosition, 1);
	};

	Matrix.prototype.determinant = function ()
	{
		var num22 = this.m11;
		var num21 = this.m12;
		var num20 = this.m13;
		var num19 = this.m14;
		var num12 = this.m21;
		var num11 = this.m22;
		var num10 = this.m23;
		var num9 = this.m24;
		var num8 = this.m31;
		var num7 = this.m32;
		var num6 = this.m33;
		var num5 = this.m34;
		var num4 = this.m41;
		var num3 = this.m42;
		var num2 = this.m43;
		var num = this.m44;
		var num18 = (num6 * num) - (num5 * num2);
		var num17 = (num7 * num) - (num5 * num3);
		var num16 = (num7 * num2) - (num6 * num3);
		var num15 = (num8 * num) - (num5 * num4);
		var num14 = (num8 * num2) - (num6 * num4);
		var num13 = (num8 * num3) - (num7 * num4);
		return ((((num22 * (((num11 * num18) - (num10 * num17)) + (num9 * num16))) - (num21 * (((num12 * num18) - (num10 * num15)) + (num9 * num14)))) + (num20 * (((num12 * num17) - (num11 * num15)) + (num9 * num13)))) - (num19 * (((num12 * num16) - (num11 * num14)) + (num10 * num13))));
	};

	Matrix.divide = function (matrix1, other)
	{
		if (other instanceof Matrix)
		{
			var matrix2 = new Matrix(
			matrix1.m11 / other.m11,
			matrix1.m12 / other.m12,
			matrix1.m13 / other.m13,
			matrix1.m14 / other.m14,
			matrix1.m21 / other.m21,
			matrix1.m22 / other.m22,
			matrix1.m23 / other.m23,
			matrix1.m24 / other.m24,
			matrix1.m31 / other.m31,
			matrix1.m32 / other.m32,
			matrix1.m33 / other.m33,
			matrix1.m34 / other.m34,
			matrix1.m41 / other.m41,
			matrix1.m42 / other.m42,
			matrix1.m43 / other.m43,
			matrix1.m44 / other.m44);
			return matrix2;
		}
		var num = 1 / other;
		var matrix3 = new Matrix(
		matrix1.m11 * num,
		matrix1.m12 * num,
		matrix1.m13 * num,
		matrix1.m14 * num,
		matrix1.m21 * num,
		matrix1.m22 * num,
		matrix1.m23 * num,
		matrix1.m24 * num,
		matrix1.m31 * num,
		matrix1.m32 * num,
		matrix1.m33 * num,
		matrix1.m34 * num,
		matrix1.m41 * num,
		matrix1.m42 * num,
		matrix1.m43 * num,
		matrix1.m44 * num);
		return matrix3;
	};

	Matrix.prototype.equals = function (other)
	{
		return (other instanceof Matrix) ? ((((((this.m11 == other.m11) && (this.m22 == other.m22)) && ((this.m33 == other.m33) && (this.m44 == other.m44))) && (((this.m12 == other.m12) && (this.m13 == other.m13)) && ((this.m14 == other.m14) && (this.m21 == other.m21)))) && ((((this.m23 == other.m23) && (this.m24 == other.m24)) && ((this.m31 == other.m31) && (this.m32 == other.m32))) && (((this.m34 == other.m34) && (this.m41 == other.m41)) && (this.m42 == other.m42)))) && (this.m43 == other.m43)) : false;
	};

	Matrix.invert = function (matrix)
	{
		var result = new Matrix(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		var num1 = matrix.m11;
		var num2 = matrix.m12;
		var num3 = matrix.m13;
		var num4 = matrix.m14;
		var num5 = matrix.m21;
		var num6 = matrix.m22;
		var num7 = matrix.m23;
		var num8 = matrix.m24;
		var num9 = matrix.m31;
		var num10 = matrix.m32;
		var num11 = matrix.m33;
		var num12 = matrix.m34;
		var num13 = matrix.m41;
		var num14 = matrix.m42;
		var num15 = matrix.m43;
		var num16 = matrix.m44;
		var num17 = (num11 * num16 - num12 * num15);
		var num18 = (num10 * num16 - num12 * num14);
		var num19 = (num10 * num15 - num11 * num14);
		var num20 = (num9 * num16 - num12 * num13);
		var num21 = (num9 * num15 - num11 * num13);
		var num22 = (num9 * num14 - num10 * num13);
		var num23 = (num6 * num17 - num7 * num18 + num8 * num19);
		var num24 = -(num5 * num17 - num7 * num20 + num8 * num21);
		var num25 = (num5 * num18 - num6 * num20 + num8 * num22);
		var num26 = -(num5 * num19 - num6 * num21 + num7 * num22);
		var num27 = (1.0 / (num1 * num23 + num2 * num24 + num3 * num25 + num4 * num26));

		result.m11 = num23 * num27;
		result.m21 = num24 * num27;
		result.m31 = num25 * num27;
		result.m41 = num26 * num27;
		result.m12 = -(num2 * num17 - num3 * num18 + num4 * num19) * num27;
		result.m22 = (num1 * num17 - num3 * num20 + num4 * num21) * num27;
		result.m32 = -(num1 * num18 - num2 * num20 + num4 * num22) * num27;
		result.m42 = (num1 * num19 - num2 * num21 + num3 * num22) * num27;
		var num28 = (num7 * num16 - num8 * num15);
		var num29 = (num6 * num16 - num8 * num14);
		var num30 = (num6 * num15 - num7 * num14);
		var num31 = (num5 * num16 - num8 * num13);
		var num32 = (num5 * num15 - num7 * num13);
		var num33 = (num5 * num14 - num6 * num13);
		result.m13 = (num2 * num28 - num3 * num29 + num4 * num30) * num27;
		result.m23 = -(num1 * num28 - num3 * num31 + num4 * num32) * num27;
		result.m33 = (num1 * num29 - num2 * num31 + num4 * num33) * num27;
		result.m43 = -(num1 * num30 - num2 * num32 + num3 * num33) * num27;
		var num34 = (num7 * num12 - num8 * num11);
		var num35 = (num6 * num12 - num8 * num10);
		var num36 = (num6 * num11 - num7 * num10);
		var num37 = (num5 * num12 - num8 * num9);
		var num38 = (num5 * num11 - num7 * num9);
		var num39 = (num5 * num10 - num6 * num9);
		result.m14 = -(num2 * num34 - num3 * num35 + num4 * num36) * num27;
		result.m24 = (num1 * num34 - num3 * num37 + num4 * num38) * num27;
		result.m34 = -(num1 * num35 - num2 * num37 + num4 * num39) * num27;
		result.m44 = (num1 * num36 - num2 * num38 + num3 * num39) * num27;
	};

	Matrix.lerp = function (matrix1, matrix2, amount)
	{
		var result = new Matrix(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		result.m11 = matrix1.m11 + ((matrix2.m11 - matrix1.m11) * amount);
		result.m12 = matrix1.m12 + ((matrix2.m12 - matrix1.m12) * amount);
		result.m13 = matrix1.m13 + ((matrix2.m13 - matrix1.m13) * amount);
		result.m14 = matrix1.m14 + ((matrix2.m14 - matrix1.m14) * amount);
		result.m21 = matrix1.m21 + ((matrix2.m21 - matrix1.m21) * amount);
		result.m22 = matrix1.m22 + ((matrix2.m22 - matrix1.m22) * amount);
		result.m23 = matrix1.m23 + ((matrix2.m23 - matrix1.m23) * amount);
		result.m24 = matrix1.m24 + ((matrix2.m24 - matrix1.m24) * amount);
		result.m31 = matrix1.m31 + ((matrix2.m31 - matrix1.m31) * amount);
		result.m32 = matrix1.m32 + ((matrix2.m32 - matrix1.m32) * amount);
		result.m33 = matrix1.m33 + ((matrix2.m33 - matrix1.m33) * amount);
		result.m34 = matrix1.m34 + ((matrix2.m34 - matrix1.m34) * amount);
		result.m41 = matrix1.m41 + ((matrix2.m41 - matrix1.m41) * amount);
		result.m42 = matrix1.m42 + ((matrix2.m42 - matrix1.m42) * amount);
		result.m43 = matrix1.m43 + ((matrix2.m43 - matrix1.m43) * amount);
		result.m44 = matrix1.m44 + ((matrix2.m44 - matrix1.m44) * amount);
		return result;
	};

	Matrix.multiply = function (matrix1, other)
	{
		var result = new Matrix(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		if (other instanceof Matrix)
		{
			var m11 = (((matrix1.m11 * other.m11) + (matrix1.m12 * other.m21)) + (matrix1.m13 * other.m31)) + (matrix1.m14 * other.m41);
			var m12 = (((matrix1.m11 * other.m12) + (matrix1.m12 * other.m22)) + (matrix1.m13 * other.m32)) + (matrix1.m14 * other.m42);
			var m13 = (((matrix1.m11 * other.m13) + (matrix1.m12 * other.m23)) + (matrix1.m13 * other.m33)) + (matrix1.m14 * other.m43);
			var m14 = (((matrix1.m11 * other.m14) + (matrix1.m12 * other.m24)) + (matrix1.m13 * other.m34)) + (matrix1.m14 * other.m44);
			var m21 = (((matrix1.m21 * other.m11) + (matrix1.m22 * other.m21)) + (matrix1.m23 * other.m31)) + (matrix1.m24 * other.m41);
			var m22 = (((matrix1.m21 * other.m12) + (matrix1.m22 * other.m22)) + (matrix1.m23 * other.m32)) + (matrix1.m24 * other.m42);
			var m23 = (((matrix1.m21 * other.m13) + (matrix1.m22 * other.m23)) + (matrix1.m23 * other.m33)) + (matrix1.m24 * other.m43);
			var m24 = (((matrix1.m21 * other.m14) + (matrix1.m22 * other.m24)) + (matrix1.m23 * other.m34)) + (matrix1.m24 * other.m44);
			var m31 = (((matrix1.m31 * other.m11) + (matrix1.m32 * other.m21)) + (matrix1.m33 * other.m31)) + (matrix1.m34 * other.m41);
			var m32 = (((matrix1.m31 * other.m12) + (matrix1.m32 * other.m22)) + (matrix1.m33 * other.m32)) + (matrix1.m34 * other.m42);
			var m33 = (((matrix1.m31 * other.m13) + (matrix1.m32 * other.m23)) + (matrix1.m33 * other.m33)) + (matrix1.m34 * other.m43);
			var m34 = (((matrix1.m31 * other.m14) + (matrix1.m32 * other.m24)) + (matrix1.m33 * other.m34)) + (matrix1.m34 * other.m44);
			var m41 = (((matrix1.m41 * other.m11) + (matrix1.m42 * other.m21)) + (matrix1.m43 * other.m31)) + (matrix1.m44 * other.m41);
			var m42 = (((matrix1.m41 * other.m12) + (matrix1.m42 * other.m22)) + (matrix1.m43 * other.m32)) + (matrix1.m44 * other.m42);
			var m43 = (((matrix1.m41 * other.m13) + (matrix1.m42 * other.m23)) + (matrix1.m43 * other.m33)) + (matrix1.m44 * other.m43);
			var m44 = (((matrix1.m41 * other.m14) + (matrix1.m42 * other.m24)) + (matrix1.m43 * other.m34)) + (matrix1.m44 * other.m44);
			result.m11 = m11;
			result.m12 = m12;
			result.m13 = m13;
			result.m14 = m14;
			result.m21 = m21;
			result.m22 = m22;
			result.m23 = m23;
			result.m24 = m24;
			result.m31 = m31;
			result.m32 = m32;
			result.m33 = m33;
			result.m34 = m34;
			result.m41 = m41;
			result.m42 = m42;
			result.m43 = m43;
			result.m44 = m44;
		}
		else
		{
			result.m11 = matrix1.m11 * other;
			result.m12 = matrix1.m12 * other;
			result.m13 = matrix1.m13 * other;
			result.m14 = matrix1.m14 * other;
			result.m21 = matrix1.m21 * other;
			result.m22 = matrix1.m22 * other;
			result.m23 = matrix1.m23 * other;
			result.m24 = matrix1.m24 * other;
			result.m31 = matrix1.m31 * other;
			result.m32 = matrix1.m32 * other;
			result.m33 = matrix1.m33 * other;
			result.m34 = matrix1.m34 * other;
			result.m41 = matrix1.m41 * other;
			result.m42 = matrix1.m42 * other;
			result.m43 = matrix1.m43 * other;
			result.m44 = matrix1.m44 * other;
		}
		return result;
	};

	Matrix.negate = function (matrix)
	{
		var result = new Matrix(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		result.m11 = -matrix.m11;
		result.m12 = -matrix.m12;
		result.m13 = -matrix.m13;
		result.m14 = -matrix.m14;
		result.m21 = -matrix.m21;
		result.m22 = -matrix.m22;
		result.m23 = -matrix.m23;
		result.m24 = -matrix.m24;
		result.m31 = -matrix.m31;
		result.m32 = -matrix.m32;
		result.m33 = -matrix.m33;
		result.m34 = -matrix.m34;
		result.m41 = -matrix.m41;
		result.m42 = -matrix.m42;
		result.m43 = -matrix.m43;
		result.m44 = -matrix.m44;
	};

	Matrix.prototype.toString = function ()
	{
		return "{m11:" + this.m11 + " m12:" + this.m12 + " m13:" + this.m13 + " m14:" + this.m14 + "}"
			 + "{m21:" + this.m21 + " m22:" + this.m22 + " m23:" + this.m23 + " m24:" + this.m24 + "}"
			 + "{m31:" + this.m31 + " m32:" + this.m32 + " m33:" + this.m33 + " m34:" + this.m34 + "}"
			 + "{m41:" + this.m41 + " m42:" + this.m42 + " m43:" + this.m43 + " m44:" + this.m44 + "}";
	};

	//#endregion

	//#region Stopwatch

	Framework.Stopwatch = function ()
	{
		if (Object.defineProperty)
		{
			Object.defineProperty(this, "_startTime", {
				value: MIN_DATE,
				writable: true,
				enumerable: false
			});
			Object.defineProperty(this, "isRunning", {
				value: false,
				writable: true,
				enumerable: true
			})
		}
		else
		{
			this._startTime = MIN_DATE;
			this.isRunning = false;
		}
	};
	var Stopwatch = Framework.Stopwatch;

	Stopwatch.prototype.elapsedMilliseconds = function ()
	{
		if (this._startTime.getUTCMilliseconds() !== MIN_DATE.getMilliseconds())
		{
			var now = new Date();
			return now.valueOf() - this._startTime.valueOf();
		}
		return 0;
	};

	Stopwatch.prototype.start = function ()
	{
	    if (this._startTime.valueOf() === MIN_DATE.valueOf())
		{
			this._startTime = new Date();
		}
		this.isRunning = true;
	};

	Stopwatch.prototype.stop = function ()
	{
		this.isRunning = false;
	};

	Stopwatch.prototype.reset = function ()
	{
		this.stop();
		this._startTime = MIN_DATE;
	};

	Stopwatch.prototype.restart = function ()
	{
		this.reset();
		this.start();
	};

	Stopwatch.StartNew = function ()
	{
		var watch = new Stopwatch();
		watch.start();
		return watch;
	}

	//#endregion

	//#region Graphics.RenderTarget2D

	Graphics.RenderTarget2D = function ()
	{
		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");

		if (Object.defineProperty)
		{
			Object.defineProperty(this, "_context", {
				value: context,
				writable: false,
				enumerable: false
			});
		}
		else
		{
			this._context = context;
		}
	};

	//#endregion 

	//#region ContentManager

	Framework.ContentManager = function (context)
	{
		if (Object.defineProperty)
		{
			Object.defineProperty(this, "_context", {
				value: context,
				writable: false,
				enumerable: false
			});
		}
		else
		{
			this._context = context;
		}
	};
	var ContentManager = Framework.ContentManager;

	ContentManager.prototype.loadTexture = function (url, callback)
	{
		var img = new Image();
		img.src = url;
		var texture2D = {};
		if (Object.defineProperty)
		{
		    Object.defineProperty(texture2D, "width", {
		        get: function ()
		        {
		            return img.width;
		        },
		        enumerable: true
		    });
		    Object.defineProperty(texture2D, "height", {
		        get: function ()
		        {
		            return img.height;
		        },
		        enumerable: true
		    });
		    Object.defineProperty(texture2D, "_img", {
		        value: img,
		        writable: false,
		        enumerable: false
		    });
		}
		else
		{
		    texture2D.with = img.width;
		    texture2D.height = img.height;
		    texture2D._img = img;
		}
		img.onload = function ()
		{
			callback(texture2D);
		}
		return texture2D;
	};

	ContentManager.prototype.loadFont = function (name, size, bold, italic)
	{
		var style = "";
		
		if (bold)
		{
			style += "bold ";
		}
		if (italic)
		{
			style += "italic";
		}

		style += size + " " + name;

		var spriteFont = {};
		if (Object.defineProperty)
		{
			Object.defineProperty(spriteFont, "_font", {
				value: style,
				writable: false,
				enumerable: false
			});
		}
		else
		{
			spriteFont._font = style;
		}
		var $this = this;
		spriteFont.measureString = function (text)
		{
			return new Vector2($this._context.measureString(text).width, parseInt(size, 10));
		};
		return spriteFont;
	};

	//#endregion

	//#region Graphics.GraphicsDevice

	Graphics.GraphicsDevice = function (manager, canvas)
	{
		var clientBounds = canvas.getBoundingClientRect();
		var viewport = {};
		if (Object.defineProperty)
		{
			Object.defineProperty(this, "_manager", {
				value: manager,
				writable: false,
				enumerable: false
			});
			Object.defineProperty(this, "_currentDraw", {
				value: manager._game._display,
				writable: true,
				enumerable: false
			});
			Object.defineProperty(viewport, "x", {
				get: function ()
				{
					var xclientBounds = canvas.getBoundingClientRect();
					return xclientBounds.left;
				},
				enumerable: false
			});
			Object.defineProperty(viewport, "y", {
				get: function ()
				{
					var yclientBounds = canvas.getBoundingClientRect();
					return yclientBounds.top;
				},
				enumerable: false
			});
			Object.defineProperty(viewport, "width", {
				get: function ()
				{
					var widthclientBounds = canvas.getBoundingClientRect();
					return widthclientBounds.right - widthclientBounds.left;
				},
				enumerable: false
			});
			Object.defineProperty(viewport, "height", {
				get: function ()
				{
					var heightclientBounds = canvas.getBoundingClientRect();
					return heightclientBounds.bottom - heightclientBounds.top;
				},
				enumerable: false
			});
			Object.defineProperty(this, "viewport", {
				value: viewport,
				writable: false,
				enumerable: true
			});
		}
		else
		{
			this._manager = manager;
			this._currentDraw = manager._game._display;
			viewport.x = clientBounds.left;
			viewport.y = clientBounds.top;
			viewport.width = clientBounds.right - clientBounds.left;
			viewport.height = clientBounds.bottom - clientBounds.top;
			this.viewport = viewport;
		}
	}
	var GraphicsDevice = Graphics.GraphicsDevice;

	GraphicsDevice.prototype.clear = function ()
	{
		this._currentDraw.clearRect(0, 0, this._currentDraw.canvas.width, this._currentDraw.canvas.height);
	};

	GraphicsDevice.prototype.setRenderTarget = function (target)
	{
		if (target === null)
		{
			this._currentDraw = this._manager._game._display;
		}
		else
		{
			this._currentDraw = target;
		}
	}

	//#endregion

	//#region GraphicsDeviceManager

	Framework.GraphicsDeviceManager = function (game, canvas)
	{
		if (Object.defineProperty)
		{
			Object.defineProperty(this, "_game", {
				value: game,
				writable: false,
				enumerable: false
			});
			Object.defineProperty(this, "graphicsDevice", {
				value: new GraphicsDevice(this, canvas),
				writable: false,
				enumerable: false
			});
		}
		else
		{
			this._game = game;
			this.graphicsDevice = new GraphicsDevice(this, canvas);
		}
	};
	var GraphicsDeviceManager = Framework.GraphicsDeviceManager;

	//#endregion

	//#region SpriteBatch

	Graphics.SpriteBatch = function (graphicsDevice)
	{
		if (Object.defineProperty)
		{
			Object.defineProperty(this, "_graphicsDevice", {
				value: graphicsDevice,
				writable: false,
				enumerable: false
			});
			Object.defineProperty(this, "_drawing", {
				value: false,
				writable: true,
				enumerable: false
			});
		}
		else
		{
			this._graphicsDevice = graphicsDevice;
			this._drawing = false;
		}
	};
	var SpriteBatch = Graphics.SpriteBatch;

	SpriteBatch.prototype.begin = function ()
	{
		this._drawing = true;
		this._graphicsDevice._currentDraw.save();
	};

	SpriteBatch.prototype.end = function ()
	{
		this._drawing = false;
		this._graphicsDevice._currentDraw.restore();
	};

	SpriteBatch.prototype.draw = function (texture, destinationRectangle, sourceRectangle, rotation, scale)
	{
		if (!this._drawing)
		{
			throw new Error("Cannot be called till after begin is called");
		}

		scale = scale || new Vector2(1);
		if (!(scale instanceof Vector2))
		{
			scale = new Vector2(scale);
		}

		else if (destinationRectangle instanceof Vector2)
		{
			destinationRectangle = new Rectangle(destinationRectangle.x, destinationRectangle.y, texture.width * scale.x, texture.height * scale.y);
		}
		else if (!(destinationRectangle instanceof Rectangle))
		{
			destinationRectangle = new Rectangle(0, 0, texture.width * scale.x, texture.height * scale.y);
		}

		sourceRectangle = sourceRectangle || new Rectangle(0, 0, texture.width, texture.height);

		rotation = rotation || 0;

		this._graphicsDevice._currentDraw.save();
		this._graphicsDevice._currentDraw.rotate(rotation);
		this._graphicsDevice._currentDraw.scale(scale.x, scale.y);
		this._graphicsDevice._currentDraw.drawImage(texture._img || texture._context, sourceRectangle.x, sourceRectangle.y, sourceRectangle.width, sourceRectangle.height, destinationRectangle.x, destinationRectangle.y, destinationRectangle.width, destinationRectangle.height);
		this._graphicsDevice._currentDraw.restore();
	};

	SpriteBatch.prototype.drawString = function (spriteFont, text, position, color, rotation, scale)
	{
	    text = text.toString();

	    scale = scale || new Vector2(1);
	    if (!(scale instanceof Vector2))
	    {
	        scale = new Vector2(scale);
	    }

		this._graphicsDevice._currentDraw.save();
		this._graphicsDevice._currentDraw.rotate(rotation);
		this._graphicsDevice._currentDraw.scale(scale.x, scale.y);
		this._graphicsDevice._currentDraw.textAlign = "left";
		this._graphicsDevice._currentDraw.textBaseline = "top";
		this._graphicsDevice._currentDraw.font = spriteFont._font
		this._graphicsDevice._currentDraw.fillStyle = color;
		this._graphicsDevice._currentDraw.fillText(text, position.x, position.y);
		this._graphicsDevice._currentDraw.restore();
	};

	//#endregion

	//#region Game

	var maxElapsedMilliseconds = 500;

	Framework.Game = function ()
	{
	}
	var Game = Framework.Game;

	Game.createGame = function (cstr)
	{
		function realGameConstructor()
		{
			if (Object.defineProperty)
			{
				Object.defineProperty(this, "isFixedTimeStep", {
					value: true,
					writable: true,
					enumerable: true
				});
				Object.defineProperty(this, "targetElapsedMilliseconds", {
					value: 100,
					writable: true,
					enumerable: true
				});
				Object.defineProperty(this, "_gameMilliSeconds", {
					value: 0,
					writable: true,
					enumerable: false
				});
				Object.defineProperty(this, "_gameTimer", {
					value: new Stopwatch(),
					writable: false,
					enumerable: false
				});
				Object.defineProperty(this, "_suppressDraw", {
					value: false,
					writable: true,
					enumerable: false
				});
				Object.defineProperty(this, "_accumulatedElapsedMilliseconds", {
					value: 0,
					writable: true,
					enumerable: false
				});
				Object.defineProperty(this, "_timerId", {
					value: null,
					writable: true,
					enumerable: false
				});
				Object.defineProperty(this, "_gameTime", {
				    value: {
				        totalGameMilliseconds: 0,
				        elapsedGameMilliseconds: 0,
				        isRunningSlowly: false
				    },
				    writable: false,
				    enumerable: false
				});
			}
			else
			{
				this.isFixedTimeStep = true;
				this.targetElapsedMilliseconds = 100;
				this._gameTime = {
					totalGameMilliseconds: 0,
					elapsedGameMilliseconds: 0,
					isRunningSlowly: false
				};
				this._gameTimer = new Stopwatch();
				this._suppressDraw = false;
				this._accumulatedElapsedMilliseconds = 0;
				this._timerId = null;
			}

			cstr.call(this);
		}
		realGameConstructor.prototype = new Game();

		return realGameConstructor;
	};

	Game.prototype.initialize = function ()
	{
	};

	Game.prototype.base_initialize = function ()
	{
		Game.prototype.initialize.call(this);
	};

	Game.prototype.loadContent = function ()
	{
	};

	Game.prototype.base_loadContent = function ()
	{
		Game.prototype.loadContent.call(this);
	};

	Game.prototype.resetElapsedMilliseconds = function ()
	{
		this._gameTimer.restart();
		this._gameTime.elapsedGameMilliseconds = 0;
		this._accumulatedElapsedMilliseconds = 0;
	};

	Game.prototype._tick = function ()
	{
		this._accumulatedElapsedMilliseconds += this._gameTimer.elapsedMilliseconds();
		this._gameTimer.restart();

		function continueTick()
		{
			if (this._accumulatedElapsedMilliseconds > maxElapsedMilliseconds)
			{
				this._accumulatedElapsedMilliseconds = maxElapsedMilliseconds;
			}

			if (this.isFixedTimeStep)
			{
				this._gameTime.elapsedGameMilliseconds = this.targetElapsedMilliseconds;
				var stepCount = 0;

				this._gameTime.isRunningSlowly = this._accumulatedElapsedMilliseconds > this.targetElapsedMilliseconds;

				while (this._accumulatedElapsedMilliseconds >= this.targetElapsedMilliseconds)
				{
					this._gameTime.totalGameMilliseconds += this.targetElapsedMilliseconds;
					this._accumulatedElapsedMilliseconds -= this.targetElapsedMilliseconds;

					++stepCount;

					this.update(this._gameTime);
				}

				this._gameTime.elapsedGameMilliseconds = stepCount * this.targetElapsedMilliseconds;
			}
			else
			{
				this._gameTime.elapsedGameMilliseconds = this._accumulatedElapsedMilliseconds;
				this._gameTime.totalGameMilliseconds += this._accumulatedElapsedMilliseconds;
				this._accumulatedElapsedMilliseconds = 0;
				this._gameTime.isRunningSlowly = false;

				this.update(this._gameTime);
			}

			if (this._suppressDraw)
			{
				this._suppressDraw = false;
			}
			else
			{
				this.draw(this._gameTime);
			}
		}

		if (this.isFixedTimeStep && (this._accumulatedElapsedMilliseconds < this.targetElapsedMilliseconds))
		{
			window.clearInterval(this._timerId);
			var sleepTime = this.targetElapsedMilliseconds - this._accumulatedElapsedMilliseconds;
			var $this = this;
			window.setTimeout(function ()
			{
				continueTick.call($this)
				$this._timerId = window.setInterval(function ()
				{
					$this._tick();
				}, $this.targetElapsedMilliseconds);
			}, sleepTime);
		}

		continueTick.call(this);
	};

	Game.prototype.run = function (context)
	{	
		if (Object.defineProperty)
		{
			Object.defineProperty(this, "_display", {
				value: context,
				writable: false,
				enumerable: false
			});
			Object.defineProperty(this, "content", {
				value: new ContentManager(context),
				writable: false,
				enumerable: false
			});
			Object.defineProperty(this, "graphics", {
				value: new GraphicsDeviceManager(this, context.canvas),
				writable: false,
				enumerable: false
			});
			Object.defineProperty(this, "spriteBatch", {
				value: new SpriteBatch(this.graphics.graphicsDevice),
				writable: false,
				enumerable: false
			});
		}
		else
		{
			this._display = context;
			this.content = new ContentManager(context);
			this.graphics = new GraphicsDeviceManager(this, context.canvas);
			this.spriteBatch = new SpriteBatch(this.graphics.graphicsDevice);
		}
		this.graphics.graphicsDevice.setRenderTarget(null);
		this.initialize();
		this.loadContent();
		this.resetElapsedMilliseconds();
		var $this = this;
		this._timerId = window.setInterval(function ()
		{
			$this._tick();
		}, this.targetElapsedMilliseconds);
	};

	Game.prototype.suppressDraw = function ()
	{
		this._suppressDraw = true;
	};

	Game.prototype.update = function (gameTime)
	{
	};

	Game.prototype.base_update = function (gameTime)
	{
		Game.prototype.update.call(this, gameTime);
	}

	Game.prototype.draw = function (gameTime)
	{
	};

	Game.prototype.base_draw = function (gameTime)
	{
		Game.prototype.draw.call(this, gameTime);
	};

	//#endregion

})();