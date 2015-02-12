(function ()
{
	"use strict";

	var Framework;
	if (window.define !== undefined)
	{
		Framework = {};
		
		if (window.define !== undefined)
		{
			window.define("Microsoft/XNA/Framework", Framework);
		}
	}
	else
	{
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
		Framework = window.Microsoft.Xna.Framework;
	}
	
	if (Framework.Graphics === undefined)
	{
		Framework.Graphics = {};
	}
	var Graphics = Framework.Graphics;
	if (Framework.Input === undefined)
	{
		Framework.Input = {};
	}
	var Input = Framework.Input;
	if (Framework.Media === undefined)
	{
		Framework.Media = {};
	}
	var Media = Framework.Media;

	var MIN_DATE = new Date(-8640000000000000);

	//#region MathHelper

	Framework.MathHelper = {};
	var MathHelper = Framework.MathHelper;

	MathHelper.E = Math.E;
	MathHelper.Log10E = 0.4342945;
	MathHelper.Log2E = 1.442695;
	MathHelper.Pi = Math.PI;
	MathHelper.PiOver2 = Math.PI / 2;
	MathHelper.PiOver4 = Math.PI / 4;
	MathHelper.TwoPi = Math.PI * 2;

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
		return Math.max(min, Math.min(max, value));
	};

	MathHelper.distance = function (value1, value2)
	{
		return Math.abs(value1 - value2);
	};

	MathHelper.hermite = function (value1, tangent1, value2, tangent2, amount)
	{
		var v1 = value1, v2 = value2, t1 = tangent1, t2 = tangent2, s = amount;
		var sCubed = s * s * s;
		var sSquared = s * s;

		if (amount === 0)
		{
			return value1;
		}
		else if (amount === 1)
		{
			return value2;
		}
		return (2 * v1 - 2 * v2 + t2 + t1) * sCubed + (3 * v2 - 3 * v1 - 2 * t1 - t2) * sSquared + t1 * s + v1;
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
		return MathHelper.hermite(value1, 0, value2, 0, MathHelper.clamp(amount, 0, 1));
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
		this.x = x;
		this.y = y;
	};
	var Point = Framework.Point;

	Point.zero = new Point(0, 0);

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
	};

	//#endregion

	//#region Rectangle

	Framework.Rectangle = function (x, y, width, height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	};
	var Rectangle = Framework.Rectangle;

	Rectangle.empty = new Rectangle(0, 0, 0, 0);

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
		return ((((this.width === 0) && (this.height === 0)) && (this.x === 0)) && (this.y === 0));
	};

	Rectangle.prototype.toString = function ()
	{
		return "{x:" + this.x + " y:" + this.y + " width:" + this.width + " height:" + this.height + "}";
	};

	Rectangle.prototype.intersects = function (value)
	{
		return value.left() < this.right() && this.left() < value.right() && value.top() < this.bottom() && this.top() < value.bottom();
	};

	Rectangle.union = function (value1, value2)
	{
		var x = Math.min(value1.x, value2.x);
		var y = Math.min(value1.y, value2.y);
		return new Rectangle(x, y, Math.max(value1.right(), value2.right()) - x, Math.max(value1.bottom(), value2.bottom()) - y);
	};

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
		return this.y + this.height;
	};

	//#endregion

	//#region Vector2

	Framework.Vector2 = function (x, y)
	{
		if (y === undefined)
		{
			y = x;
		}

		this.x = x;
		this.y = y;
	};
	var Vector2 = Framework.Vector2;

	Vector2.zero = new Vector2(0);
	Vector2.unitVector = new Vector2(1);
	Vector2.unitXVector = new Vector2(1, 0);
	Vector2.unitYVector = new Vector2(0, 1);

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
		switch (arguments.length)
		{
			case 2:
				return new Vector2((position.x * matrix.m11) + (position.y * matrix.m21) + matrix.m41, (position.x * matrix.m12) + (position.y * matrix.m22) + matrix.m42);
			case 3:
				return Vector2_transform6(arguments[0], 0, arguments[1], arguments[2], 0, arguments[0].length);
			case 6:
				return Vector2_transform6(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
		}
	};

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
	};
	var Matrix = Framework.Matrix;

	Matrix.identity = new Matrix(1, 0, 0, 0,
									 0, 1, 0, 0,
									 0, 0, 1, 0,
									 0, 0, 0, 1);

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
		matrix1.m44 + matrix2.m44);
		return newMatrix;
	};

	Matrix.createOrthographic = function (width, height, zNearPlane, zFarPlane)
	{
		return new Matrix(2 / width, 0, 0, 0, 0, 2 / height, 0, 0, 0, 0, 1 / (zNearPlane - zFarPlane), 0, 0, 0, zNearPlane / (zNearPlane - zFarPlane), 1);
	};

	Matrix.createOrthographicOffCenter = function (left, right, bottom, top, zNearPlane, zFarPlane)
	{
		return new Matrix((2.0 / (right - left)), 0, 0, 0, 0, (2.0 / (top - bottom)), 0, 0, 0, 0, (1.0 / (zNearPlane - zFarPlane)), 0, ((left + right) / (left - right)), ((top + bottom) / (bottom - top)), (zNearPlane / (zNearPlane - zFarPlane)), 1);
	};

	Matrix.createPerspective = function (width, height, nearPlaneDistance, farPlaneDistance)
	{
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

		return new Matrix((2 * nearPlaneDistance) / width, 0, 0, 0, 0, (2 * nearPlaneDistance) / height, 0, 0, 0, 0, farPlaneDistance / (nearPlaneDistance - farPlaneDistance), -1, 0, 0, (nearPlaneDistance * farPlaneDistance) / (nearPlaneDistance - farPlaneDistance), 0);
	};

	Matrix.createPerspectiveFieldOfView = function (fieldOfView, aspectRatio, nearPlaneDistance, farPlaneDistance)
	{
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
		return new Matrix(num9, 0, 0, 0, 0, num, 0, 0, 0, 0, farPlaneDistance / (nearPlaneDistance - farPlaneDistance), -1, 0, 0, (nearPlaneDistance * farPlaneDistance) / (nearPlaneDistance - farPlaneDistance), 0);
	};

	Matrix.createPerspectiveOffCenter = function (left, right, bottom, top, nearPlaneDistance, farPlaneDistance)
	{
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
		return new Matrix((2 * nearPlaneDistance) / (right - left), 0, 0, 0, 0, (2 * nearPlaneDistance) / (top - bottom), 0, 0, (left + right) / (right - left), (top + bottom) / (top - bottom), farPlaneDistance / (nearPlaneDistance - farPlaneDistance), -1, 0, 0, (nearPlaneDistance * farPlaneDistance) / (nearPlaneDistance - farPlaneDistance), 0);
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
			return new Matrix(matrix1.m11 / other.m11, matrix1.m12 / other.m12, matrix1.m13 / other.m13, matrix1.m14 / other.m14, matrix1.m21 / other.m21, matrix1.m22 / other.m22, matrix1.m23 / other.m23, matrix1.m24 / other.m24, matrix1.m31 / other.m31, matrix1.m32 / other.m32, matrix1.m33 / other.m33, matrix1.m34 / other.m34, matrix1.m41 / other.m41, matrix1.m42 / other.m42, matrix1.m43 / other.m43, matrix1.m44 / other.m44);
		}
		var num = 1 / other;
		return new Matrix(matrix1.m11 * num, matrix1.m12 * num, matrix1.m13 * num, matrix1.m14 * num, matrix1.m21 * num, matrix1.m22 * num, matrix1.m23 * num, matrix1.m24 * num, matrix1.m31 * num, matrix1.m32 * num, matrix1.m33 * num, matrix1.m34 * num, matrix1.m41 * num, matrix1.m42 * num, matrix1.m43 * num, matrix1.m44 * num);
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
		return new Matrix(matrix1.m11 + ((matrix2.m11 - matrix1.m11) * amount), matrix1.m12 + ((matrix2.m12 - matrix1.m12) * amount), matrix1.m13 + ((matrix2.m13 - matrix1.m13) * amount), matrix1.m14 + ((matrix2.m14 - matrix1.m14) * amount), matrix1.m21 + ((matrix2.m21 - matrix1.m21) * amount), matrix1.m22 + ((matrix2.m22 - matrix1.m22) * amount), matrix1.m23 + ((matrix2.m23 - matrix1.m23) * amount), matrix1.m24 + ((matrix2.m24 - matrix1.m24) * amount), matrix1.m31 + ((matrix2.m31 - matrix1.m31) * amount), matrix1.m32 + ((matrix2.m32 - matrix1.m32) * amount), matrix1.m33 + ((matrix2.m33 - matrix1.m33) * amount), matrix1.m34 + ((matrix2.m34 - matrix1.m34) * amount), matrix1.m41 + ((matrix2.m41 - matrix1.m41) * amount), matrix1.m42 + ((matrix2.m42 - matrix1.m42) * amount), matrix1.m43 + ((matrix2.m43 - matrix1.m43) * amount), matrix1.m44 + ((matrix2.m44 - matrix1.m44) * amount));
	};

	Matrix.multiply = function (matrix1, other)
	{
		var result = new Matrix(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		if (other instanceof Matrix)
		{
			return new Matrix((((matrix1.m11 * other.m11) + (matrix1.m12 * other.m21)) + (matrix1.m13 * other.m31)) + (matrix1.m14 * other.m41), (((matrix1.m11 * other.m12) + (matrix1.m12 * other.m22)) + (matrix1.m13 * other.m32)) + (matrix1.m14 * other.m42), (((matrix1.m11 * other.m13) + (matrix1.m12 * other.m23)) + (matrix1.m13 * other.m33)) + (matrix1.m14 * other.m43), (((matrix1.m11 * other.m14) + (matrix1.m12 * other.m24)) + (matrix1.m13 * other.m34)) + (matrix1.m14 * other.m44), (((matrix1.m21 * other.m11) + (matrix1.m22 * other.m21)) + (matrix1.m23 * other.m31)) + (matrix1.m24 * other.m41), (((matrix1.m21 * other.m12) + (matrix1.m22 * other.m22)) + (matrix1.m23 * other.m32)) + (matrix1.m24 * other.m42), (((matrix1.m21 * other.m13) + (matrix1.m22 * other.m23)) + (matrix1.m23 * other.m33)) + (matrix1.m24 * other.m43), (((matrix1.m21 * other.m14) + (matrix1.m22 * other.m24)) + (matrix1.m23 * other.m34)) + (matrix1.m24 * other.m44), (((matrix1.m31 * other.m11) + (matrix1.m32 * other.m21)) + (matrix1.m33 * other.m31)) + (matrix1.m34 * other.m41), (((matrix1.m31 * other.m12) + (matrix1.m32 * other.m22)) + (matrix1.m33 * other.m32)) + (matrix1.m34 * other.m42), (((matrix1.m31 * other.m13) + (matrix1.m32 * other.m23)) + (matrix1.m33 * other.m33)) + (matrix1.m34 * other.m43), (((matrix1.m31 * other.m14) + (matrix1.m32 * other.m24)) + (matrix1.m33 * other.m34)) + (matrix1.m34 * other.m44), (((matrix1.m41 * other.m11) + (matrix1.m42 * other.m21)) + (matrix1.m43 * other.m31)) + (matrix1.m44 * other.m41), (((matrix1.m41 * other.m12) + (matrix1.m42 * other.m22)) + (matrix1.m43 * other.m32)) + (matrix1.m44 * other.m42),(((matrix1.m41 * other.m13) + (matrix1.m42 * other.m23)) + (matrix1.m43 * other.m33)) + (matrix1.m44 * other.m43), (((matrix1.m41 * other.m14) + (matrix1.m42 * other.m24)) + (matrix1.m43 * other.m34)) + (matrix1.m44 * other.m44));
		}
		return new Matrix(matrix1.m11 * other, matrix1.m12 * other, matrix1.m13 * other, matrix1.m14 * other, matrix1.m21 * other, matrix1.m22 * other, matrix1.m23 * other, matrix1.m24 * other, matrix1.m31 * other, matrix1.m32 * other, matrix1.m33 * other, matrix1.m34 * other, matrix1.m41 * other, matrix1.m42 * other, matrix1.m43 * other, matrix1.m44 * other);
	};

	Matrix.negate = function (matrix)
	{
		return new Matrix(-matrix.m11, -matrix.m12, -matrix.m13, -matrix.m14, -matrix.m21, -matrix.m22, -matrix.m23, -matrix.m24, -matrix.m31, -matrix.m32, -matrix.m33, -matrix.m34, -matrix.m41, -matrix.m42, -matrix.m43, -matrix.m44);
	};

	Matrix.prototype.toString = function ()
	{
		return "{m11:" + this.m11 + " m12:" + this.m12 + " m13:" + this.m13 + " m14:" + this.m14 + "}" + "{m21:" + this.m21 + " m22:" + this.m22 + " m23:" + this.m23 + " m24:" + this.m24 + "}" + "{m31:" + this.m31 + " m32:" + this.m32 + " m33:" + this.m33 + " m34:" + this.m34 + "}" + "{m41:" + this.m41 + " m42:" + this.m42 + " m43:" + this.m43 + " m44:" + this.m44 + "}";
	};

	//#endregion

	//#region Stopwatch

	Framework.Stopwatch = function ()
	{
		this.isRunning = false;
		this._startTime = MIN_DATE;
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
	};

	//#endregion

	//#region Graphics.RenderTarget2D

	Graphics.RenderTarget2D = function ()
	{
		var canvas = document.createElement("canvas");
		this._context = canvas.getContext("2d");
	};

	//#endregion 

	//#region ContentManager

	Framework.ContentManager = function (context, game)
	{
	    this._context = context;
	    this._resources = {};
	    this._game = game;
	};
	var ContentManager = Framework.ContentManager;

	ContentManager.prototype.loadTexture = function (url)
	{
		if (this._resources[url] === undefined)
		{
			var img = new Image();
			img.src = url;
			var texture2D = {
			    width: img.width,
			    height: img.height,
			    _img: img,
                _loaded: false
			};
			var $this = this;
			img.onload = function ()
			{
			    texture2D.height = img.height;
			    texture2D.width = img.width;
				texture2D._loaded = true;

				for (var tUrl in $this._resources)
				{
					if (!$this._resources[tUrl]._loaded)
					{
						return;
					}
				}

				$this._game._continueRun();
			};
			this._resources[url] = texture2D;
		}
		return this._resources[url];
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

		var spriteFont = {
            _font: style
        };
		var $this = this;
		spriteFont.measureString = function (text)
		{
			return new Vector2($this._context.measureString(text).width, parseInt(size, 10));
		};
		return spriteFont;
	};

	function loadAudio(urls, $this, resource)
	{
		var audioElement = document.createElement("audio");
		audioElement.autoplay = false;
		audioElement.controls = false;
		audioElement.loop = false;

		for (var i = 0; i < urls.length; i++)
		{
			var url = urls[i];
			var sourceElement = document.createElement("source");
			sourceElement.src = url;
			if (url.substr(url.length - 3, 3) === "mp3")
			{
				sourceElement.type = "audio/mpeg";
			}
			else if ((url.substr(url.length - 3, 3) === "m4a") || (url.substr(url.length - 3, 3) === "mp4"))
			{
				sourceElement.type = "audio/mp4";
			}
			else if (url.substr(url.length - 3, 3) === "webm")
			{
				sourceElement.type = "audio/webm";
			}
			audioElement.appendChild(sourceElement);
		}

		audioElement.load();

		audioElement.oncanplay = function ()
		{
			resource._loaded = true;

			for (var tUrl in $this._resources)
			{
				if (!$this._resources[tUrl]._loaded)
				{
					return;
				}
			}

			$this._game._continueRun();
		};

		return audioElement;
	}

	ContentManager.prototype.loadSoundEffect = function (urls)
	{
		if (typeof urls === "string")
		{
			urls = [urls];
		}

		if (this._resources[urls] === undefined)
		{
			var soundEffect = {
				getDurationMilliseconds: function ()
				{
					var seconds = this._audio.duration;
					if (seconds !== seconds)
					{
						seconds = 0;
					}
					if (!isFinite(seconds))
					{
						return seconds;
					}
					return seconds * 1000;
				},
				play: function ()
				{
					this._audio.play();
				}
			};

			var audioElement = loadAudio(urls, this, soundEffect);

			soundEffect._audio = audioElement;
			soundEffect._loaded = false;
			this._resources[urls] = soundEffect;
		}
		return this._resources[urls];
	};

	ContentManager.prototype.loadSong = function (urls)
	{
		if (typeof urls === "string")
		{
			urls = [urls];
		}

		if (this._resources[urls] === undefined)
		{
			var song = {
				getDurationMilliseconds: function ()
				{
					var seconds = this._audio.duration;
					if (seconds !== seconds)
					{
						seconds = 0;
					}
					if (!isFinite(seconds))
					{
						return seconds;
					}
					return seconds * 1000;
				}
			};

			var audioElement = loadAudio(urls, this, song);

			song._audio = audioElement;
			song._loaded = false;
			this._resources[urls] = song;
		}
		return this._resources[urls];
	};

	ContentManager.prototype.loadVideo = function (urls)
	{
		if (typeof urls === "string")
		{
			urls = [urls];
		}

		if (this._resources[urls] === undefined)
		{
			var videoElement = document.createElement("video");
			videoElement.autoplay = false;
			videoElement.controls = false;
			videoElement.loop = false;

			for (var i = 0; i < urls.length; i++)
			{
				var url = urls[i];
				var sourceElement = document.createElement("source");
				sourceElement.src = url;
				if ((url.substr(url.length - 3, 3) === "m4v") || (url.substr(url.length - 3, 3) === "mp4"))
				{
					sourceElement.type = "video/mp4";
				}
				else if (url.substr(url.length - 3, 3) === "webm")
				{
					sourceElement.type = "vide/webm";
				}
				videoElement.appendChild(sourceElement);
			}

			videoElement.load();

			var video = {
				getDurationMilliseconds: function ()
				{
					var seconds = this._video.duration;
					if (seconds !== seconds)
					{
						seconds = 0;
					}
					if (!isFinite(seconds))
					{
						return seconds;
					}
					return seconds * 1000;
				},
				_video: videoElement,
				_loaded: false,
				width: 0,
                height: 0
			};

			var $this = this;
			videoElement.oncanplay = function ()
			{
				video._loaded = true;

				video.height = video._video.height;
				video.width = video._video.width;

				for (var tUrl in $this._resources)
				{
					if (!$this._resources[tUrl]._loaded)
					{
						return;
					}
				}

				$this._game._continueRun();
			};
			this._resources[urls] = video;
		}
		return this._resources[urls];
	};

	//#endregion

	//#region Graphics.GraphicsDevice

	Graphics.GraphicsDevice = function (manager, canvas)
	{
		var clientBounds = canvas.getBoundingClientRect();
		this._manager = manager;
		this._currentDraw = manager._game._display;
		this.viewport = {
		    x: clientBounds.left,
		    y: clientBounds.top,
		    width: clientBounds.right - clientBounds.left,
            height: clientBounds.bottom - clientBounds.top
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
	    this._game = game;
	    this.graphicsDevice = new GraphicsDevice(this, canvas);
	};
	var GraphicsDeviceManager = Framework.GraphicsDeviceManager;

	//#endregion

	//#region SpriteBatch

	Graphics.SpriteBatch = function (graphicsDevice)
	{
	    this._graphicsDevice = graphicsDevice;
	    this._drawing = false;
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

		sourceRectangle = sourceRectangle || new Rectangle(0, 0, texture.width, texture.height);

		scale = scale || new Vector2(1);
		if (!(scale instanceof Vector2))
		{
			scale = new Vector2(scale);
		}

		if (destinationRectangle instanceof Vector2)
		{
			destinationRectangle = new Rectangle(destinationRectangle.x, destinationRectangle.y, sourceRectangle.width * scale.x, sourceRectangle.height * scale.y);
		}
		else if (!(destinationRectangle instanceof Rectangle))
		{
			destinationRectangle = new Rectangle(0, 0, texture.width * scale.x, texture.height * scale.y);
		}

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
			this.isFixedTimeStep = true;
			this.targetElapsedMilliseconds = 100;
			this._gameTime = {
			    totalGameMilliseconds: 0,
			    elapsedGameMilliseconds: 0,
			    isRunningSlowly: false
			};
			this._gameTimer = null;
			this._suppressDraw = false;
			this._accumulatedElapsedMilliseconds = 0;
			this._timerId = null;
			this._isExited = false;
			this._previousMilliseconds = 0;
			this._updateFrameLag = 0;

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

	Game.prototype.contentLoaded = function ()
	{
	};

	Game.prototype.base_contentLoaded = function ()
	{
		Game.prototype.contentLoaded.call(this);
	};

	Game.prototype.resetElapsedMilliseconds = function ()
	{
		this._gameTimer.restart();
		this._gameTime.elapsedGameMilliseconds = 0;
		this._accumulatedElapsedMilliseconds = 0;
		this._previousMilliseconds = 0;
	};

	Game.prototype._tick = function ()
	{
		if (this._isExited)
		{
			return;
		}

		var currentMilliseconds = this._gameTimer.elapsedMilliseconds();
		this._accumulatedElapsedMilliseconds += currentMilliseconds - this._previousMilliseconds;
		this._previousMilliseconds = currentMilliseconds;

		if (this.isFixedTimeStep && (this._accumulatedElapsedMilliseconds < this.targetElapsedMilliseconds))
		{
			window.clearInterval(this._timerId);
			var sleepTime = this.targetElapsedMilliseconds - this._accumulatedElapsedMilliseconds;
			var $this = this;
			window.setTimeout(function ()
			{
			    $this._tick.call($this);
				$this._timerId = window.setInterval(function ()
				{
					$this._tick();
				}, $this.targetElapsedMilliseconds);
			}, sleepTime);
			return;
		}

	    // Do not allow any update to take longer than our maximum.
		if (this._accumulatedElapsedMilliseconds > maxElapsedMilliseconds)
		{
		    this._accumulatedElapsedMilliseconds = maxElapsedMilliseconds;
		}

		if (this.isFixedTimeStep)
		{
		    this._gameTime.elapsedGameMilliseconds = this.targetElapsedMilliseconds;
		    var stepCount = 0;

		    // Perform as many full fixed length time steps as we can.
		    while (this._accumulatedElapsedMilliseconds >= this.targetElapsedMilliseconds)
		    {
		        this._gameTime.totalGameMilliseconds += this.targetElapsedMilliseconds;
		        this._accumulatedElapsedMilliseconds -= this.targetElapsedMilliseconds;

		        ++stepCount;

		        this.update(this._gameTime);
		        if (this._isExited)
		        {
		            return;
		        }
		    }

		    //Every update after the first accumulates lag
		    this._updateFrameLag += Math.max(0, stepCount - 1);

		    //If we think we are running slowly, wait until the lag clears before resetting it
		    if (this._gameTime.isRunningSlowly)
		    {
		        if (this._updateFrameLag === 0)
		        {
		            this._gameTime.isRunningSlowly = false;
		        }
		    }
		    else if (this._updateFrameLag >= 5)
		    {
		        //If we lag more than 5 frames, start thinking we are running slowly
		        this._gameTime.isRunningSlowly = true;
		    }

		    //Every time we just do one update and one draw, then we are not running slowly, so decrease the lag
		    if ((stepCount === 1) && (this._updateFrameLag > 0))
		    {
		        this._updateFrameLag--;
		    }

		    // Draw needs to know the total elapsed time
		    // that occurred for the fixed length updates.
		    this._gameTime.elapsedGameMilliseconds = this.targetElapsedMilliseconds * stepCount;
		}
		else
		{
		    // Perform a single variable length update.
		    this._gameTime.elapsedGameMilliseconds = this._accumulatedElapsedMilliseconds;
		    this._gameTime.totalGameMilliseconds += this._accumulatedElapsedMilliseconds;
		    this._accumulatedElapsedMilliseconds = 0;
		    this._gameTime.isRunningSlowly = false;

		    this.update(this._gameTime);
		    if (this._isExited)
		    {
		        return;
		    }
		}

	    // Draw unless the update suppressed it.
		if (this._suppressDraw)
		{
		    this._suppressDraw = false;
		}
		else
		{
		    this.draw(this._gameTime);
		}
	};

	Game.prototype.run = function (context)
	{
		if (this._display === undefined)
		{
		    this._display = context;
		    this.content = new ContentManager(context, this);
		    this.graphics = new GraphicsDeviceManager(this, context.canvas);
		    this.spriteBatch = new SpriteBatch(this.graphics.graphicsDevice);
		}
		this._gameTimer = Stopwatch.StartNew();
		this.graphics.graphicsDevice.setRenderTarget(null);
		this.initialize();
		this.loadContent();
		for (var tUrl in this.content._resources)
		{
		    if (!this.content._resources[tUrl]._loaded)
		    {
		        return;
		    }
		}
		this._continueRun();
	};

	Game.prototype._continueRun = function ()
	{
		this.contentLoaded();
		this.resetElapsedMilliseconds();
		this._isExited = false;
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

	Game.prototype.unloadConent = function ()
	{
	};

	Game.prototype.base_unloadContent = function ()
	{
		Game.prototype.unloadConent.call(this);
	};

	Game.prototype.exit = function ()
	{
		window.clearInterval(this._timerId);
		this.graphics.graphicsDevice.clear();
		this.unloadConent();
		this._isExited = true;
	};

	Game.prototype.base_exit = function ()
	{
		Game.prototype.exit.call(this);
	};

	//#endregion

	//#region Input.Mouse

	var mouseState = {
		x: 0,
		y: 0,
		leftButton: false,
		middleButton: false,
		rightButton: false,
		scrollWheelValue: 0,
		xButton1: false,
		xButton2: false
	};
	Input.Mouse = {
		getState: function ()
		{
			var currentState = {};
			for (var p in mouseState)
			{
				if (mouseState.hasOwnProperty(p))
				{
					currentState[p] = mouseState[p];
				}
			}
			return currentState;
		}
	};

	document.addEventListener("mousemove", function (e)
	{
		e = e || event;
		mouseState.x = e.clientX;
		mouseState.y = e.clientY;
	});

	function mousewheelHandler(e)
	{
		e = e || event;
		mouseState.scrollWheelValue = e.wheelDelta || e.wheelDeltaY || 0;
	}

	function DOMMouseScrollHandler (e)
	{
		e = e || event;
		mouseState.scrollWheelValue = e.detail * -40;
	}

	function wheelHandler(e)
	{
		e = e || event;
		mouseState.scrollWheelValue = e.deltaY * -120;
		document.removeEventListener("mousewheel", mousewheelHandler);
		document.removeEventListener("DOMMouseScroll", DOMMouseScrollHandler);
	}

	document.addEventListener("mousewheel", mousewheelHandler);
	document.addEventListener("DOMMouseScroll", DOMMouseScrollHandler);
	document.addEventListener("wheel", wheelHandler);

	document.addEventListener("mousedown", function (e)
	{
		e = e || event;
		switch (e.button)
		{
			case 0:
				mouseState.leftButton = true;
				break;
			case 1:
				mouseState.middleButton = true;
				break;
			case 2:
				mouseState.rightButton = true;
				break;
		}
	});

	document.addEventListener("mouseup", function (e)
	{
		e = e || event;
		switch (e.button)
		{
			case 0:
				mouseState.leftButton = false;
				break;
			case 1:
				mouseState.middleButton = false;
				break;
			case 2:
				mouseState.rightButton = false;
				break;
		}
	});

	//#endregion

	//#region Input.Keyboard

	//NOTE: currently does not support HTML5 based event, uses old style keyCode based.

	var keyboardState = {
		downKeys: [],
		addKey: function (key)
		{
			var low = 0;
			var high = this.downKeys.length - 1;
			var i;
			while (low <= high)
			{
				i = Math.floor((low + high) / 2);
				if (this.downKeys[i] < key)
				{
					low = i + 1;
				}
				else if (this.downKeys[i] > key)
				{
					high = i - 1;
				}
				else
				{
					return;
				}
			}
			this.downKeys.splice(low, 0, key);
		},
		removeKey: function (key)
		{
			var low = 0;
			var high = this.downKeys.length - 1;
			var i;
			while (low <= high)
			{
				i = Math.floor((low + high) / 2);
				if (this.downKeys[i] < key)
				{
					low = i + 1;
				}
				else if (this.downKeys[i] > key)
				{
					high = i - 1;
				}
				else
				{
					this.downKeys.splice(i, 1);
					return;
				}
			}
		}
	};

	Input.Keyboard = {
		getState: function()
		{
			var currentState = {
				downKeys: keyboardState.downKeys.slice(0, keyboardState.downKeys.length),
				isKeyDown: function (key)
				{
					var low = 0;
					var high = this.downKeys.length - 1;
					var i;
					while (low <= high)
					{
						i = Math.floor((low + high) / 2);
						if (this.downKeys[i] < key)
						{
							low = i + 1;
						}
						else if (this.downKeys[i] > key)
						{
							high = i - 1;
						}
						else
						{
							return true;
						}
					}
					return false;
				},
				isKeyUp: function(key)
				{
					return !this.isKeyDown(key);
				}
			};
			return currentState;
		}
	};

	document.addEventListener("keydown", function (e)
	{
		e = e || event;
		if ((e.keyCode === 16) || e.shiftKey)
		{
			keyboardState.addKey(16);
		}
		else if ((e.keyCode === 17) || e.ctrlKey)
		{
			keyboardState.addKey(17);
		}
		else if ((e.keyCode === 18) || e.altKey)
		{
			keyboardState.addKey(18);
		}
		
		if ((e.keyCode !== 16) && (e.keyCode !== 17) && (e.keyCode !== 18))
		{
			keyboardState.addKey(e.keyCode);
		}
	});

	document.addEventListener("keyup", function (e)
	{
		e = e || event;
		if ((e.keyCode === 16) || e.shiftKey)
		{
			keyboardState.removeKey(16);
		}
		else if ((e.keyCode === 17) || e.ctrlKey)
		{
			keyboardState.removeKey(17);
		}
		else if ((e.keyCode === 18) || e.altKey)
		{
			keyboardState.removeKey(18);
		}

		if ((e.keyCode !== 16) && (e.keyCode !== 17) && (e.keyCode !== 18))
		{
			keyboardState.removeKey(e.keyCode);
		}
	});

	Input.Keys = {
		// Keys with words or arrows
		Backspace: 8,
		Tab: 9,
		Enter: 13,
		Shift: 16,
		Ctrl: 17,
		Alt: 18,
		Pause: 19,
		CapsLock: 20,
		Esc: 27,
		Spacebar: 32,
		PageUp: 33,
		PageDown: 34,
		End: 35,
		Home: 36,
		Left: 37,
		Up: 38,
		Right: 39,
		Down: 40,
		Insert: 45,
		Delete: 46,
		// Top row numbers
		Zero: 48,
		One: 49,
		Two: 50,
		Three: 51,
		Four: 52,
		Five: 53,
		Six: 54,
		Seven: 55,
		Eight: 56,
		Nine: 57,
		// Letters
		A: 65,
		B: 66,
		C: 67,
		D: 68,
		E: 69,
		F: 70,
		G: 71,
		H: 72,
		I: 73,
		J: 74,
		K: 75,
		L: 76,
		M: 77,
		N: 78,
		O: 79,
		P: 80,
		Q: 81,
		R: 82,
		S: 83,
		T: 84,
		U: 85,
		V: 86,
		W: 87,
		X: 88,
		Y: 89,
		Z: 90,
		// Keypad
		NumPadZero: 96,
		NumPadOne: 97,
		NumPadTwo: 98,
		NumPadThree: 99,
		NumPadFour: 100,
		NumPadFive: 101,
		NumPadSix: 102,
		NumPadSeven: 103,
		NumPadEight: 104,
		NumPadNine: 105,
		Multiply: 106,
		Add: 107,
		Subtract: 109,
		Decimal: 110,
		Divide: 111,
		// Function keys
		F1: 112,
		F2: 113,
		F3: 114,
		F4: 115,
		F5: 116,
		F6: 117,
		F7: 118,
		F8: 119,
		F9: 120,
		F10: 121,
		F11: 122,
		F12: 123,
		F13: 124,
		F14: 125,
		F15: 126,
		F16: 127,
		F17: 128,
		F18: 129,
		F19: 130,
		F20: 131,
		F21: 132,
		F22: 133,
		F23: 134,
		F24: 135,
		// Punctuation that don't require the shift key
		OpenSquareBracket: 219,
		CloseSquareBracket: 221,
		Backslash: 220,
		Forwardslash: 191,
		Comma: 188,
		Period: 190,
		GraveAccent: 192,
		SingleQuote: 222
	};

	//#endregion

	//#region Media.MediaState

	Media.MediaState = {
		Paused: 1,
		Playing: 2,
		Stopped: 3
	};
	var MediaState = Media.MediaState;

	//#endregion

	//#region Media.MediaPlayer

	Media.MediaPlayer = {
		play: function (song)
		{
			this._song = song;
			this._song._audio.play();
			this.state = MediaState.Playing;
		},
		isMuted: function (value)
		{
			if (this._song === null)
			{
				return false;
			}
			if (value === undefined)
			{
				return this._song._audio.muted;
			}
			this._song._audio.muted = value;
		},
		isRepeating: function (value)
		{
			if (this._song === null)
			{
				return false;
			}
			if (value === undefined)
			{
				return this._song._audio.loop;
			}
			this._song._audio.loop = value;
		},
		volume: function (value)
		{
			if (this._song === null)
			{
				return false;
			}
			if (value === undefined)
			{
				return this._song._audio.volume;
			}
			this._song._audio.volume = value;
		},
		resume: function ()
		{
			if (this._song === null)
			{
				return;
			}
			this._song._audio.play();
			this.state = MediaState.Playing;
		},
		pause: function ()
		{
			if (this._song === null)
			{
				return;
			}
			this._song._audio.pause();
			this.state = MediaState.Paused;
		},
		stop: function ()
		{
			if (this._song === null)
			{
				return;
			}
			this._song._audio.pause();
			this._song._audio.currentTime = 0;
			this._song._audio.pause();
			this.state = MediaState.Stopped;
		}
	};
	var MediaPlayer = Media.MediaPlayer;

	MediaPlayer._song = null;
	MediaPlayer.state = MediaState.Stopped;

	//#endregion
})();
