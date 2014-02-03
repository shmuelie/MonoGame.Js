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

	//#region Vector2

	var Vector2_zeroVector = new Vector2(0);
	var Vector2_unitVector = new Vector2(1);
	var Vector2_unitXVector = new Vector2(1, 0);
	var Vector2_unitYVector = new Vector2(0, 1);

	Framework.Vector2 = function (x, y)
	{
		if (y === undefined)
		{
			y = x;
		}

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
	var Vector2 = Framework.Vector2;

	if (Object.defineProperty)
	{
		Object.defineProperty(Vector2.prototype, "zero", {
			get: function ()
			{
				return Vector2_zeroVector;
			},
			enumerable: true,
			writable: false
		});

		Object.defineProperty(Vector2.prototype, "unitVector", {
			get: function ()
			{
				return Vector2_unitVector;
			},
			enumerable: true,
			writable: false
		});

		Object.defineProperty(Vector2.prototype, "unitXVector", {
			get: function ()
			{
				return Vector2_unitXVector;
			},
			enumerable: true,
			writable: false
		});

		Object.defineProperty(Vector2.prototype, "unitYVector", {
			get: function ()
			{
				return Vector2_unitYVector;
			},
			enumerable: true,
			writable: false
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
		return new Vector2(this.X, this.Y);
	};

	Vector2.prototype.equals = function (obj)
	{
		return (obj instanceof Vector2) ? ((obj.X === this.X) && (obj.Y === this.Y)) : false;
	};

	Vector2.prototype.add = function (other)
	{
		return new Vector2(this.X + other.X, this.Y + other.Y);
	};

	Vector2.prototype.multiply = function (other)
	{
		if (typeof other === "number")
		{
			return new Vector2(this.X * other, this.Y * other);
		}
		return new Vector2(this.X * other.X, this.Y * other.Y);
	};

	Vector2.prototype.devide = function (other)
	{
		if (typeof other === "number")
		{
			return new Vector2(this.X / other, this.Y / other);
		}
		return new Vector2(this.X / other.X, this.Y / other.Y);
	};

	Vector2.distance = function (value1, value2)
	{
		var v1 = value1.X - value2.X, v2 = value1.Y - value2.Y;
		return Math.sqrt((v1 * v1) + (v2 * v2));
	};

	Vector2.distanceSquared = function (value1, value2)
	{
		var v1 = value1.X - value2.X, v2 = value1.Y - value2.Y;
		return (v1 * v1) + (v2 * v2);
	};

	Vector2.reflect = function (vector, normal)
	{
		var result = new Vector2(0, 0);
		var val = 2.0 * ((vector.X * normal.X) + (vector.Y * normal.Y));
		result.X = vector.X - (normal.X * val);
		result.Y = vector.Y - (normal.Y * val);
		return result;
	};

	Vector2.prototype.length = function ()
	{
		return Math.sqrt((this.X * this.X) + (this.Y * this.Y));
	};

	Vector2.prototype.lengthSquared = function ()
	{
		return (this.X * this.X) + (this.Y * this.Y);
	};

	Vector2.max = function (value1, value2)
	{
		return new Vector2(value1.X > value2.X ? value1.X : value2.X, value1.Y > value2.Y ? value1.Y : value2.Y);
	};

	Vector2.min = function (value1, value2)
	{
		return new Vector2(value1.X < value2.X ? value1.X : value2.X, value1.Y < value2.Y ? value1.Y : value2.Y);
	};

	Vector2.prototype.normalize = function ()
	{
		var val = 1.0 / Math.sqrt((this.X * this.X) + (this.Y * this.Y));
		this.X *= val;
		this.Y *= val;
	};

	Vector2.barycentric = function (value1, value2, value3, amount1, amount2)
	{
		return new Vector2(MathHelper.barycentric(value1.X, value2.X, value3.X, amount1, amount2), MathHelper.barycentric(value1.Y, value2.Y, value3.Y, amount1, amount2));
	};

	Vector2.catmullRom = function (value1, value2, value3, value4, amount)
	{
		return new Vector2(MathHelper.catmullRom(value1.X, value2.X, value3.X, value4.X, amount), MathHelper.catmullRom(value1.Y, value2.Y, value3.Y, value4.Y, amount));
	};

	Vector2.clamp = function (value1, min, max)
	{
		return new Vector2(MathHelper.clamp(value1.X, min.X, max.X), MathHelper.clamp(value1.Y, min.Y, max.Y));
	};

	Vector2.lerp = function (value1, value2, amount)
	{
		return new Vector2(MathHelper.lerp(value1.X, value2.X, amount), MathHelper.lerp(value1.Y, value2.Y, amount));
	};

	Vector2.smoothStep = function (value1, value2, amount)
	{
		return new Vector2(MathHelper.smoothStep(value1.X, value2.X, amount), MathHelper.smoothStep(value1.Y, value2.Y, amount));
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
		return new Vector2((position.X * matrix.M11) + (position.Y * matrix.M21) + matrix.M41, (position.X * matrix.M12) + (position.Y * matrix.M22) + matrix.M42);
	}

	function Vector2_transform6 (sourceArray, sourceIndex, matrix, destinationArray, destinationIndex, length)
	{
		for (var x = 0; x < length; x++) {
			var position = sourceArray[sourceIndex + x];
			var destination = destinationArray[destinationIndex + x];
			destination.X = (position.X * matrix.M11) + (position.Y * matrix.M21) + matrix.M41;
			destination.Y = (position.X * matrix.M12) + (position.Y * matrix.M22) + matrix.M42;
			destinationArray[destinationIndex + x] = destination;
		}
	}

	Vector2.transformNormal = function (normal, matrix)
	{
		return new Vector2((normal.X * matrix.M11) + (normal.Y * matrix.M21), (normal.X * matrix.M12) + (normal.Y * matrix.M22));
	};

	//#endregion

	//#region Matrix

	var Matrix_identity = new Matrix(1, 0, 0, 0,
									 0, 1, 0, 0,
									 0, 0, 1, 0,
									 0, 0, 0, 1);

	Framework.Matrix = function (m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44)
	{
		if (Object.defineProperties)
		{
			Object.defineProperty(Matrix, "M11", {
				value: m11,
				writable: true,
				enumerable: true,
			});
			Object.defineProperty(Matrix, "M12", {
				value: m12,
				writable: true,
				enumerable: true,
			});
			Object.defineProperty(Matrix, "M13", {
				value: m13,
				writable: true,
				enumerable: true,
			});
			Object.defineProperty(Matrix, "M14", {
				value: m14,
				writable: true,
				enumerable: true,
			});

			Object.defineProperty(Matrix, "M21", {
				value: m21,
				writable: true,
				enumerable: true,
			});
			Object.defineProperty(Matrix, "M22", {
				value: m22,
				writable: true,
				enumerable: true,
			});
			Object.defineProperty(Matrix, "M23", {
				value: m23,
				writable: true,
				enumerable: true,
			});
			Object.defineProperty(Matrix, "M24", {
				value: m24,
				writable: true,
				enumerable: true,
			});

			Object.defineProperty(Matrix, "M31", {
				value: m31,
				writable: true,
				enumerable: true,
			});
			Object.defineProperty(Matrix, "M32", {
				value: m32,
				writable: true,
				enumerable: true,
			});
			Object.defineProperty(Matrix, "M33", {
				value: m33,
				writable: true,
				enumerable: true,
			});
			Object.defineProperty(Matrix, "M34", {
				value: m34,
				writable: true,
				enumerable: true,
			});

			Object.defineProperty(Matrix, "M41", {
				value: m41,
				writable: true,
				enumerable: true,
			});
			Object.defineProperty(Matrix, "M42", {
				value: m42,
				writable: true,
				enumerable: true,
			});
			Object.defineProperty(Matrix, "M43", {
				value: m43,
				writable: true,
				enumerable: true,
			});
			Object.defineProperty(Matrix, "M44", {
				value: m44,
				writable: true,
				enumerable: true,
			});
		}
		else
		{
			this.M11 = m11;
			this.M12 = m12;
			this.M13 = m13;
			this.M14 = m14;

			this.M21 = m21;
			this.M22 = m22;
			this.M23 = m23;
			this.M24 = m24;

			this.M31 = m31;
			this.M32 = m32;
			this.M33 = m33;
			this.M34 = m34;

			this.M41 = m41;
			this.M42 = m42;
			this.M43 = m43;
			this.M44 = m44;
		}
	}
	var Matrix = Framework.Matrix;

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
		matrix1.M11 + matrix2.M11,
		matrix1.M12 + matrix2.M12,
		matrix1.M13 + matrix2.M13,
		matrix1.M14 + matrix2.M14,
		matrix1.M21 + matrix2.M21,
		matrix1.M22 + matrix2.M22,
		matrix1.M23 + matrix2.M23,
		matrix1.M24 + matrix2.M24,
		matrix1.M31 + matrix2.M31,
		matrix1.M32 + matrix2.M32,
		matrix1.M33 + matrix2.M33,
		matrix1.M34 + matrix2.M34,
		matrix1.M41 + matrix2.M41,
		matrix1.M42 + matrix2.M42,
		matrix1.M43 + matrix2.M43,
		matrix1.M44 + matrix2.M44)
		return newMatrix;
	};

	Matrix.createOrthographic = function (width, height, zNearPlane, zFarPlane)
	{
		var matrix = new Matrix(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		matrix.M11 = 2 / width;
		matrix.M12 = matrix.M13 = matrix.M14 = 0;
		matrix.M22 = 2 / height;
		matrix.M21 = matrix.M23 = matrix.M24 = 0;
		matrix.M33 = 1 / (zNearPlane - zFarPlane);
		matrix.M31 = matrix.M32 = matrix.M34 = 0;
		matrix.M41 = matrix.M42 = 0;
		matrix.M43 = zNearPlane / (zNearPlane - zFarPlane);
		matrix.M44 = 1;
		return matrix;
	};

	Matrix.createOrthographicOffCenter = function (left, right, bottom, top, zNearPlane, zFarPlane)
	{
		var matrix = new Matrix(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		matrix.M11 = (2.0 / (right - left));
		matrix.M12 = 0.0;
		matrix.M13 = 0.0;
		matrix.M14 = 0.0;
		matrix.M21 = 0.0;
		matrix.M22 = (2.0 / (top - bottom));
		matrix.M23 = 0.0;
		matrix.M24 = 0.0;
		matrix.M31 = 0.0;
		matrix.M32 = 0.0;
		matrix.M33 = (1.0 / (zNearPlane - zFarPlane));
		matrix.M34 = 0.0;
		matrix.M41 = ((left + right) / (left - right));
		matrix.M42 = ((top + bottom) / (bottom - top));
		matrix.M43 = (zNearPlane / (zNearPlane - zFarPlane));
		matrix.M44 = 1.0;
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
		matrix.M11 = (2 * nearPlaneDistance) / width;
		matrix.M12 = matrix.M13 = matrix.M14 = 0;
		matrix.M22 = (2 * nearPlaneDistance) / height;
		matrix.M21 = matrix.M23 = matrix.M24 = 0;
		matrix.M33 = farPlaneDistance / (nearPlaneDistance - farPlaneDistance);
		matrix.M31 = matrix.M32 = 0;
		matrix.M34 = -1;
		matrix.M41 = matrix.M42 = matrix.M44 = 0;
		matrix.M43 = (nearPlaneDistance * farPlaneDistance) / (nearPlaneDistance - farPlaneDistance);
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
		matrix.M11 = num9;
		matrix.M12 = matrix.M13 = matrix.M14 = 0;
		matrix.M22 = num;
		matrix.M21 = matrix.M23 = matrix.M24 = 0;
		matrix.M31 = matrix.M32 = 0;
		matrix.M33 = farPlaneDistance / (nearPlaneDistance - farPlaneDistance);
		matrix.M34 = -1;
		matrix.M41 = matrix.M42 = matrix.M44 = 0;
		matrix.M43 = (nearPlaneDistance * farPlaneDistance) / (nearPlaneDistance - farPlaneDistance);
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
		matrix.M11 = (2 * nearPlaneDistance) / (right - left);
		matrix.M12 = matrix.M13 = matrix.M14 = 0;
		matrix.M22 = (2 * nearPlaneDistance) / (top - bottom);
		matrix.M21 = matrix.M23 = matrix.M24 = 0;
		matrix.M31 = (left + right) / (right - left);
		matrix.M32 = (top + bottom) / (top - bottom);
		matrix.M33 = farPlaneDistance / (nearPlaneDistance - farPlaneDistance);
		matrix.M34 = -1;
		matrix.M43 = (nearPlaneDistance * farPlaneDistance) / (nearPlaneDistance - farPlaneDistance);
		matrix.M41 = matrix.M42 = matrix.M44 = 0;
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
		var num22 = this.M11;
		var num21 = this.M12;
		var num20 = this.M13;
		var num19 = this.M14;
		var num12 = this.M21;
		var num11 = this.M22;
		var num10 = this.M23;
		var num9 = this.M24;
		var num8 = this.M31;
		var num7 = this.M32;
		var num6 = this.M33;
		var num5 = this.M34;
		var num4 = this.M41;
		var num3 = this.M42;
		var num2 = this.M43;
		var num = this.M44;
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
			matrix1.M11 / other.M11,
			matrix1.M12 / other.M12,
			matrix1.M13 / other.M13,
			matrix1.M14 / other.M14,
			matrix1.M21 / other.M21,
			matrix1.M22 / other.M22,
			matrix1.M23 / other.M23,
			matrix1.M24 / other.M24,
			matrix1.M31 / other.M31,
			matrix1.M32 / other.M32,
			matrix1.M33 / other.M33,
			matrix1.M34 / other.M34,
			matrix1.M41 / other.M41,
			matrix1.M42 / other.M42,
			matrix1.M43 / other.M43,
			matrix1.M44 / other.M44);
			return matrix2;
		}
		var num = 1 / other;
		var matrix3 = new Matrix(
		matrix1.M11 * num,
		matrix1.M12 * num,
		matrix1.M13 * num,
		matrix1.M14 * num,
		matrix1.M21 * num,
		matrix1.M22 * num,
		matrix1.M23 * num,
		matrix1.M24 * num,
		matrix1.M31 * num,
		matrix1.M32 * num,
		matrix1.M33 * num,
		matrix1.M34 * num,
		matrix1.M41 * num,
		matrix1.M42 * num,
		matrix1.M43 * num,
		matrix1.M44 * num);
		return matrix3;
	};

	Matrix.prototype.equals = function (other)
	{
		return (other instanceof Matrix) ? ((((((this.M11 == other.M11) && (this.M22 == other.M22)) && ((this.M33 == other.M33) && (this.M44 == other.M44))) && (((this.M12 == other.M12) && (this.M13 == other.M13)) && ((this.M14 == other.M14) && (this.M21 == other.M21)))) && ((((this.M23 == other.M23) && (this.M24 == other.M24)) && ((this.M31 == other.M31) && (this.M32 == other.M32))) && (((this.M34 == other.M34) && (this.M41 == other.M41)) && (this.M42 == other.M42)))) && (this.M43 == other.M43)) : false;
	};

	Matrix.invert = function (matrix)
	{
		var result = new Matrix(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		var num1 = matrix.M11;
		var num2 = matrix.M12;
		var num3 = matrix.M13;
		var num4 = matrix.M14;
		var num5 = matrix.M21;
		var num6 = matrix.M22;
		var num7 = matrix.M23;
		var num8 = matrix.M24;
		var num9 = matrix.M31;
		var num10 = matrix.M32;
		var num11 = matrix.M33;
		var num12 = matrix.M34;
		var num13 = matrix.M41;
		var num14 = matrix.M42;
		var num15 = matrix.M43;
		var num16 = matrix.M44;
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

		result.M11 = num23 * num27;
		result.M21 = num24 * num27;
		result.M31 = num25 * num27;
		result.M41 = num26 * num27;
		result.M12 = -(num2 * num17 - num3 * num18 + num4 * num19) * num27;
		result.M22 = (num1 * num17 - num3 * num20 + num4 * num21) * num27;
		result.M32 = -(num1 * num18 - num2 * num20 + num4 * num22) * num27;
		result.M42 = (num1 * num19 - num2 * num21 + num3 * num22) * num27;
		var num28 = (num7 * num16 - num8 * num15);
		var num29 = (num6 * num16 - num8 * num14);
		var num30 = (num6 * num15 - num7 * num14);
		var num31 = (num5 * num16 - num8 * num13);
		var num32 = (num5 * num15 - num7 * num13);
		var num33 = (num5 * num14 - num6 * num13);
		result.M13 = (num2 * num28 - num3 * num29 + num4 * num30) * num27;
		result.M23 = -(num1 * num28 - num3 * num31 + num4 * num32) * num27;
		result.M33 = (num1 * num29 - num2 * num31 + num4 * num33) * num27;
		result.M43 = -(num1 * num30 - num2 * num32 + num3 * num33) * num27;
		var num34 = (num7 * num12 - num8 * num11);
		var num35 = (num6 * num12 - num8 * num10);
		var num36 = (num6 * num11 - num7 * num10);
		var num37 = (num5 * num12 - num8 * num9);
		var num38 = (num5 * num11 - num7 * num9);
		var num39 = (num5 * num10 - num6 * num9);
		result.M14 = -(num2 * num34 - num3 * num35 + num4 * num36) * num27;
		result.M24 = (num1 * num34 - num3 * num37 + num4 * num38) * num27;
		result.M34 = -(num1 * num35 - num2 * num37 + num4 * num39) * num27;
		result.M44 = (num1 * num36 - num2 * num38 + num3 * num39) * num27;
	};

	Matrix.lerp = function (matrix1, matrix2, amount)
	{
		var result = new Matrix(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		result.M11 = matrix1.M11 + ((matrix2.M11 - matrix1.M11) * amount);
		result.M12 = matrix1.M12 + ((matrix2.M12 - matrix1.M12) * amount);
		result.M13 = matrix1.M13 + ((matrix2.M13 - matrix1.M13) * amount);
		result.M14 = matrix1.M14 + ((matrix2.M14 - matrix1.M14) * amount);
		result.M21 = matrix1.M21 + ((matrix2.M21 - matrix1.M21) * amount);
		result.M22 = matrix1.M22 + ((matrix2.M22 - matrix1.M22) * amount);
		result.M23 = matrix1.M23 + ((matrix2.M23 - matrix1.M23) * amount);
		result.M24 = matrix1.M24 + ((matrix2.M24 - matrix1.M24) * amount);
		result.M31 = matrix1.M31 + ((matrix2.M31 - matrix1.M31) * amount);
		result.M32 = matrix1.M32 + ((matrix2.M32 - matrix1.M32) * amount);
		result.M33 = matrix1.M33 + ((matrix2.M33 - matrix1.M33) * amount);
		result.M34 = matrix1.M34 + ((matrix2.M34 - matrix1.M34) * amount);
		result.M41 = matrix1.M41 + ((matrix2.M41 - matrix1.M41) * amount);
		result.M42 = matrix1.M42 + ((matrix2.M42 - matrix1.M42) * amount);
		result.M43 = matrix1.M43 + ((matrix2.M43 - matrix1.M43) * amount);
		result.M44 = matrix1.M44 + ((matrix2.M44 - matrix1.M44) * amount);
		return result;
	};

	Matrix.multiply = function (matrix1, other)
	{
		var result = new Matrix(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		if (other instanceof Matrix)
		{
			var m11 = (((matrix1.M11 * other.M11) + (matrix1.M12 * other.M21)) + (matrix1.M13 * other.M31)) + (matrix1.M14 * other.M41);
			var m12 = (((matrix1.M11 * other.M12) + (matrix1.M12 * other.M22)) + (matrix1.M13 * other.M32)) + (matrix1.M14 * other.M42);
			var m13 = (((matrix1.M11 * other.M13) + (matrix1.M12 * other.M23)) + (matrix1.M13 * other.M33)) + (matrix1.M14 * other.M43);
			var m14 = (((matrix1.M11 * other.M14) + (matrix1.M12 * other.M24)) + (matrix1.M13 * other.M34)) + (matrix1.M14 * other.M44);
			var m21 = (((matrix1.M21 * other.M11) + (matrix1.M22 * other.M21)) + (matrix1.M23 * other.M31)) + (matrix1.M24 * other.M41);
			var m22 = (((matrix1.M21 * other.M12) + (matrix1.M22 * other.M22)) + (matrix1.M23 * other.M32)) + (matrix1.M24 * other.M42);
			var m23 = (((matrix1.M21 * other.M13) + (matrix1.M22 * other.M23)) + (matrix1.M23 * other.M33)) + (matrix1.M24 * other.M43);
			var m24 = (((matrix1.M21 * other.M14) + (matrix1.M22 * other.M24)) + (matrix1.M23 * other.M34)) + (matrix1.M24 * other.M44);
			var m31 = (((matrix1.M31 * other.M11) + (matrix1.M32 * other.M21)) + (matrix1.M33 * other.M31)) + (matrix1.M34 * other.M41);
			var m32 = (((matrix1.M31 * other.M12) + (matrix1.M32 * other.M22)) + (matrix1.M33 * other.M32)) + (matrix1.M34 * other.M42);
			var m33 = (((matrix1.M31 * other.M13) + (matrix1.M32 * other.M23)) + (matrix1.M33 * other.M33)) + (matrix1.M34 * other.M43);
			var m34 = (((matrix1.M31 * other.M14) + (matrix1.M32 * other.M24)) + (matrix1.M33 * other.M34)) + (matrix1.M34 * other.M44);
			var m41 = (((matrix1.M41 * other.M11) + (matrix1.M42 * other.M21)) + (matrix1.M43 * other.M31)) + (matrix1.M44 * other.M41);
			var m42 = (((matrix1.M41 * other.M12) + (matrix1.M42 * other.M22)) + (matrix1.M43 * other.M32)) + (matrix1.M44 * other.M42);
			var m43 = (((matrix1.M41 * other.M13) + (matrix1.M42 * other.M23)) + (matrix1.M43 * other.M33)) + (matrix1.M44 * other.M43);
			var m44 = (((matrix1.M41 * other.M14) + (matrix1.M42 * other.M24)) + (matrix1.M43 * other.M34)) + (matrix1.M44 * other.M44);
			result.M11 = m11;
			result.M12 = m12;
			result.M13 = m13;
			result.M14 = m14;
			result.M21 = m21;
			result.M22 = m22;
			result.M23 = m23;
			result.M24 = m24;
			result.M31 = m31;
			result.M32 = m32;
			result.M33 = m33;
			result.M34 = m34;
			result.M41 = m41;
			result.M42 = m42;
			result.M43 = m43;
			result.M44 = m44;
		}
		else
		{
			result.M11 = matrix1.M11 * other;
			result.M12 = matrix1.M12 * other;
			result.M13 = matrix1.M13 * other;
			result.M14 = matrix1.M14 * other;
			result.M21 = matrix1.M21 * other;
			result.M22 = matrix1.M22 * other;
			result.M23 = matrix1.M23 * other;
			result.M24 = matrix1.M24 * other;
			result.M31 = matrix1.M31 * other;
			result.M32 = matrix1.M32 * other;
			result.M33 = matrix1.M33 * other;
			result.M34 = matrix1.M34 * other;
			result.M41 = matrix1.M41 * other;
			result.M42 = matrix1.M42 * other;
			result.M43 = matrix1.M43 * other;
			result.M44 = matrix1.M44 * other;
		}
		return result;
	};

	Matrix.negate = function (matrix)
	{
		var result = new Matrix(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		result.M11 = -matrix.M11;
		result.M12 = -matrix.M12;
		result.M13 = -matrix.M13;
		result.M14 = -matrix.M14;
		result.M21 = -matrix.M21;
		result.M22 = -matrix.M22;
		result.M23 = -matrix.M23;
		result.M24 = -matrix.M24;
		result.M31 = -matrix.M31;
		result.M32 = -matrix.M32;
		result.M33 = -matrix.M33;
		result.M34 = -matrix.M34;
		result.M41 = -matrix.M41;
		result.M42 = -matrix.M42;
		result.M43 = -matrix.M43;
		result.M44 = -matrix.M44;
	};

	Matrix.prototype.toString = function ()
	{
		return "{M11:" + this.M11 + " M12:" + this.M12 + " M13:" + this.M13 + " M14:" + this.M14 + "}"
			 + "{M21:" + this.M21 + " M22:" + this.M22 + " M23:" + this.M23 + " M24:" + this.M24 + "}"
			 + "{M31:" + this.M31 + " M32:" + this.M32 + " M33:" + this.M33 + " M34:" + this.M34 + "}"
			 + "{M41:" + this.M41 + " M42:" + this.M42 + " M43:" + this.M43 + " M44:" + this.M44 + "}";
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
			return now.getMilliseconds() - this._startTime.getMilliseconds();
		}
		return 0;
	};

	Stopwatch.prototype.start = function ()
	{
		if (this._startTime.getUTCMilliseconds() === MIN_DATE.getMilliseconds())
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
		img.onload = function ()
		{
			var texture2D = {};
			if (Object.defineProperty)
			{
				Object.defineProperty(texture2D, "Width", {
					get: function ()
					{
						return img.width;
					},
					enumerable: true
				});
				Object.defineProperty(texture2D, "Height", {
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
				texture2D.With = img.width;
				texture2D.Height = img.height;
				texture2D._img = img;
			}
			callback(texture2D);
		}
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
		        value: null,
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
		    this._currentDraw = null;
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

})();