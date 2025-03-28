"use strict";
var e = require("assert"),
	t = require("path");

function n(e) {
	return e && "object" == typeof e && "default" in e ? e : {
		default: e
	}
}
var o = n(e),
	r = n(t);
const s = {
	10001: "uni-captcha-create-fail",
	10002: "uni-captcha-verify-fail",
	10003: "uni-captcha-refresh-fail",
	10101: "uni-captcha-deviceId-required",
	10102: "uni-captcha-text-required",
	10103: "uni-captcha-verify-overdue",
	10104: "uni-captcha-verify-fail",
	50403: "uni-captcha-interior-fail"
};

function a(e) {
	const t = .2 * Math.random() - .1;
	switch (e.type) {
		case "M":
		case "L":
			e.x += t, e.y += t;
			break;
		case "Q":
		case "C":
			e.x += t, e.y += t, e.x1 += t, e.y1 += t
	}
	return e
}

function i(e, t, n, o, r, s, a) {
	let i, l, c, u, p, h;
	if (e <= 0 || e >= 1) throw RangeError("spliteCurveAt requires position > 0 && position < 1");
	return u = [], p = 0, i = {}, l = {}, c = {}, i.x = t, i.y = n, l.x = o, l.y = r, c.x = s, c.y = a, h = e, u[p++] =
		i.x, u[p++] = i.y, u[p++] = i.x += (l.x - i.x) * h, u[p++] = i.y += (l.y - i.y) * h, l.x += (c.x - l.x) * h, l
		.y += (c.y - l.y) * h, u[p++] = i.x + (l.x - i.x) * h, u[p++] = i.y + (l.y - i.y) * h, u[p++] = l.x, u[p++] = l
		.y, u[p++] = c.x, u[p++] = c.y, u
}

function l(e, t) {
	return Math.random() * (t - e) + e
}
var c = function(e, t) {
	const n = e[0];
	o.default(n, "expect a string");
	const r = t.fontSize,
		s = r / t.font.unitsPerEm,
		c = t.font.charToGlyph(n),
		u = c.advanceWidth ? c.advanceWidth * s : 0,
		p = t.x - u / 2,
		h = (t.ascender + t.descender) * s,
		f = t.y + h / 2,
		d = c.getPath(p, f, r);
	d.commands.forEach(a), d.commands = function(e, t) {
		const n = [];
		for (let o = 0; o < e.length - 1; o++) {
			const r = e[o];
			if ("L" === r.type) {
				const s = e[o + 1];
				if ("L" === s.type && Math.random() > t.truncateLineProbability) {
					const e = l(-.1, .1);
					n.push(r), n.push({
						type: "L",
						x: (r.x + s.x) / 2 + e,
						y: (r.y + s.y) / 2 + e
					})
				} else n.push(r)
			} else if ("Q" === r.type && o >= 1) {
				const s = e[o - 1];
				if (("L" === s.type || "M" === s.type) && Math.random() > t.truncateCurveProbability) {
					const e = s.x,
						o = s.y,
						a = l(-.1, .1),
						c = r.x1 + a,
						u = r.y1 + a,
						p = r.x + a,
						h = r.y + a,
						f = i(l(t.truncateCurvePositionMin, t.truncateCurvePositionMax), e, o, c, u, p, h),
						d = {
							type: "Q",
							x1: f[2],
							y1: f[3],
							x: f[4],
							y: f[5]
						},
						g = {
							type: "L",
							x: f[4],
							y: f[5]
						},
						m = {
							type: "Q",
							x1: f[6],
							y1: f[7],
							x: f[8],
							y: f[9]
						},
						y = {
							type: "L",
							x: f[8],
							y: f[9]
						};
					n.push(d), n.push(g), n.push(m), n.push(y)
				}
			} else n.push(r)
		}
		return n
	}(d.commands, t);
	return d.toPathData()
};

function u() {
	this.table = new Uint16Array(16), this.trans = new Uint16Array(288)
}

function p(e, t) {
	this.source = e, this.sourceIndex = 0, this.tag = 0, this.bitcount = 0, this.dest = t, this.destLen = 0, this
		.ltree = new u, this.dtree = new u
}
var h = new u,
	f = new u,
	d = new Uint8Array(30),
	g = new Uint16Array(30),
	m = new Uint8Array(30),
	y = new Uint16Array(30),
	v = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]),
	b = new u,
	x = new Uint8Array(320);

function S(e, t, n, o) {
	var r, s;
	for (r = 0; r < n; ++r) e[r] = 0;
	for (r = 0; r < 30 - n; ++r) e[r + n] = r / n | 0;
	for (s = o, r = 0; r < 30; ++r) t[r] = s, s += 1 << e[r]
}
var U = new Uint16Array(16);

function T(e, t, n, o) {
	var r, s;
	for (r = 0; r < 16; ++r) e.table[r] = 0;
	for (r = 0; r < o; ++r) e.table[t[n + r]]++;
	for (e.table[0] = 0, s = 0, r = 0; r < 16; ++r) U[r] = s, s += e.table[r];
	for (r = 0; r < o; ++r) t[n + r] && (e.trans[U[t[n + r]]++] = r)
}

function w(e) {
	e.bitcount-- || (e.tag = e.source[e.sourceIndex++], e.bitcount = 7);
	var t = 1 & e.tag;
	return e.tag >>>= 1, t
}

function E(e, t, n) {
	if (!t) return n;
	for (; e.bitcount < 24;) e.tag |= e.source[e.sourceIndex++] << e.bitcount, e.bitcount += 8;
	var o = e.tag & 65535 >>> 16 - t;
	return e.tag >>>= t, e.bitcount -= t, o + n
}

function O(e, t) {
	for (; e.bitcount < 24;) e.tag |= e.source[e.sourceIndex++] << e.bitcount, e.bitcount += 8;
	var n = 0,
		o = 0,
		r = 0,
		s = e.tag;
	do {
		o = 2 * o + (1 & s), s >>>= 1, ++r, n += t.table[r], o -= t.table[r]
	} while (o >= 0);
	return e.tag = s, e.bitcount -= r, t.trans[n + o]
}

function L(e, t, n) {
	var o, r, s, a, i, l;
	for (o = E(e, 5, 257), r = E(e, 5, 1), s = E(e, 4, 4), a = 0; a < 19; ++a) x[a] = 0;
	for (a = 0; a < s; ++a) {
		var c = E(e, 3, 0);
		x[v[a]] = c
	}
	for (T(b, x, 0, 19), i = 0; i < o + r;) {
		var u = O(e, b);
		switch (u) {
			case 16:
				var p = x[i - 1];
				for (l = E(e, 2, 3); l; --l) x[i++] = p;
				break;
			case 17:
				for (l = E(e, 3, 3); l; --l) x[i++] = 0;
				break;
			case 18:
				for (l = E(e, 7, 11); l; --l) x[i++] = 0;
				break;
			default:
				x[i++] = u
		}
	}
	T(t, x, 0, o), T(n, x, o, r)
}

function k(e, t, n) {
	for (;;) {
		var o, r, s, a, i = O(e, t);
		if (256 === i) return 0;
		if (i < 256) e.dest[e.destLen++] = i;
		else
			for (o = E(e, d[i -= 257], g[i]), r = O(e, n), a = s = e.destLen - E(e, m[r], y[r]); a < s + o; ++a) e.dest[
				e.destLen++] = e.dest[a]
	}
}

function R(e) {
	for (var t, n; e.bitcount > 8;) e.sourceIndex--, e.bitcount -= 8;
	if ((t = 256 * (t = e.source[e.sourceIndex + 1]) + e.source[e.sourceIndex]) !== (65535 & ~(256 * e.source[e
			.sourceIndex + 3] + e.source[e.sourceIndex + 2]))) return -3;
	for (e.sourceIndex += 4, n = t; n; --n) e.dest[e.destLen++] = e.source[e.sourceIndex++];
	return e.bitcount = 0, 0
}! function(e, t) {
	var n;
	for (n = 0; n < 7; ++n) e.table[n] = 0;
	for (e.table[7] = 24, e.table[8] = 152, e.table[9] = 112, n = 0; n < 24; ++n) e.trans[n] = 256 + n;
	for (n = 0; n < 144; ++n) e.trans[24 + n] = n;
	for (n = 0; n < 8; ++n) e.trans[168 + n] = 280 + n;
	for (n = 0; n < 112; ++n) e.trans[176 + n] = 144 + n;
	for (n = 0; n < 5; ++n) t.table[n] = 0;
	for (t.table[5] = 32, n = 0; n < 32; ++n) t.trans[n] = n
}(h, f), S(d, g, 4, 3), S(m, y, 2, 1), d[28] = 0, g[28] = 258;
var D = function(e, t) {
	var n, o, r = new p(e, t);
	do {
		switch (n = w(r), E(r, 2, 0)) {
			case 0:
				o = R(r);
				break;
			case 1:
				o = k(r, h, f);
				break;
			case 2:
				L(r, r.ltree, r.dtree), o = k(r, r.ltree, r.dtree);
				break;
			default:
				o = -3
		}
		if (0 !== o) throw new Error("Data error")
	} while (!n);
	return r.destLen < r.dest.length ? "function" == typeof r.dest.slice ? r.dest.slice(0, r.destLen) : r.dest
		.subarray(0, r.destLen) : r.dest
};

function C(e, t, n, o, r) {
	return Math.pow(1 - r, 3) * e + 3 * Math.pow(1 - r, 2) * r * t + 3 * (1 - r) * Math.pow(r, 2) * n + Math.pow(r, 3) *
		o
}

function M() {
	this.x1 = Number.NaN, this.y1 = Number.NaN, this.x2 = Number.NaN, this.y2 = Number.NaN
}

function I() {
	this.commands = [], this.fill = "black", this.stroke = null, this.strokeWidth = 1
}

function B(e) {
	throw new Error(e)
}

function N(e, t) {
	e || B(t)
}
M.prototype.isEmpty = function() {
	return isNaN(this.x1) || isNaN(this.y1) || isNaN(this.x2) || isNaN(this.y2)
}, M.prototype.addPoint = function(e, t) {
	"number" == typeof e && ((isNaN(this.x1) || isNaN(this.x2)) && (this.x1 = e, this.x2 = e), e < this.x1 && (this
		.x1 = e), e > this.x2 && (this.x2 = e)), "number" == typeof t && ((isNaN(this.y1) || isNaN(this.y2)) &&
		(this.y1 = t, this.y2 = t), t < this.y1 && (this.y1 = t), t > this.y2 && (this.y2 = t))
}, M.prototype.addX = function(e) {
	this.addPoint(e, null)
}, M.prototype.addY = function(e) {
	this.addPoint(null, e)
}, M.prototype.addBezier = function(e, t, n, o, r, s, a, i) {
	const l = [e, t],
		c = [n, o],
		u = [r, s],
		p = [a, i];
	this.addPoint(e, t), this.addPoint(a, i);
	for (let e = 0; e <= 1; e++) {
		const t = 6 * l[e] - 12 * c[e] + 6 * u[e],
			n = -3 * l[e] + 9 * c[e] - 9 * u[e] + 3 * p[e],
			o = 3 * c[e] - 3 * l[e];
		if (0 === n) {
			if (0 === t) continue;
			const n = -o / t;
			0 < n && n < 1 && (0 === e && this.addX(C(l[e], c[e], u[e], p[e], n)), 1 === e && this.addY(C(l[e], c[
				e], u[e], p[e], n)));
			continue
		}
		const r = Math.pow(t, 2) - 4 * o * n;
		if (r < 0) continue;
		const s = (-t + Math.sqrt(r)) / (2 * n);
		0 < s && s < 1 && (0 === e && this.addX(C(l[e], c[e], u[e], p[e], s)), 1 === e && this.addY(C(l[e], c[e], u[
			e], p[e], s)));
		const a = (-t - Math.sqrt(r)) / (2 * n);
		0 < a && a < 1 && (0 === e && this.addX(C(l[e], c[e], u[e], p[e], a)), 1 === e && this.addY(C(l[e], c[e], u[
			e], p[e], a)))
	}
}, M.prototype.addQuad = function(e, t, n, o, r, s) {
	const a = e + 2 / 3 * (n - e),
		i = t + 2 / 3 * (o - t),
		l = a + 1 / 3 * (r - e),
		c = i + 1 / 3 * (s - t);
	this.addBezier(e, t, a, i, l, c, r, s)
}, I.prototype.moveTo = function(e, t) {
	this.commands.push({
		type: "M",
		x: e,
		y: t
	})
}, I.prototype.lineTo = function(e, t) {
	this.commands.push({
		type: "L",
		x: e,
		y: t
	})
}, I.prototype.curveTo = I.prototype.bezierCurveTo = function(e, t, n, o, r, s) {
	this.commands.push({
		type: "C",
		x1: e,
		y1: t,
		x2: n,
		y2: o,
		x: r,
		y: s
	})
}, I.prototype.quadTo = I.prototype.quadraticCurveTo = function(e, t, n, o) {
	this.commands.push({
		type: "Q",
		x1: e,
		y1: t,
		x: n,
		y: o
	})
}, I.prototype.close = I.prototype.closePath = function() {
	this.commands.push({
		type: "Z"
	})
}, I.prototype.extend = function(e) {
	if (e.commands) e = e.commands;
	else if (e instanceof M) {
		const t = e;
		return this.moveTo(t.x1, t.y1), this.lineTo(t.x2, t.y1), this.lineTo(t.x2, t.y2), this.lineTo(t.x1, t.y2),
			void this.close()
	}
	Array.prototype.push.apply(this.commands, e)
}, I.prototype.getBoundingBox = function() {
	const e = new M;
	let t = 0,
		n = 0,
		o = 0,
		r = 0;
	for (let s = 0; s < this.commands.length; s++) {
		const a = this.commands[s];
		switch (a.type) {
			case "M":
				e.addPoint(a.x, a.y), t = o = a.x, n = r = a.y;
				break;
			case "L":
				e.addPoint(a.x, a.y), o = a.x, r = a.y;
				break;
			case "Q":
				e.addQuad(o, r, a.x1, a.y1, a.x, a.y), o = a.x, r = a.y;
				break;
			case "C":
				e.addBezier(o, r, a.x1, a.y1, a.x2, a.y2, a.x, a.y), o = a.x, r = a.y;
				break;
			case "Z":
				o = t, r = n;
				break;
			default:
				throw new Error("Unexpected path command " + a.type)
		}
	}
	return e.isEmpty() && e.addPoint(0, 0), e
}, I.prototype.draw = function(e) {
	e.beginPath();
	for (let t = 0; t < this.commands.length; t += 1) {
		const n = this.commands[t];
		"M" === n.type ? e.moveTo(n.x, n.y) : "L" === n.type ? e.lineTo(n.x, n.y) : "C" === n.type ? e
			.bezierCurveTo(n.x1, n.y1, n.x2, n.y2, n.x, n.y) : "Q" === n.type ? e.quadraticCurveTo(n.x1, n.y1, n.x,
				n.y) : "Z" === n.type && e.closePath()
	}
	this.fill && (e.fillStyle = this.fill, e.fill()), this.stroke && (e.strokeStyle = this.stroke, e.lineWidth =
		this.strokeWidth, e.stroke())
}, I.prototype.toPathData = function(e) {
	function t(t) {
		return Math.round(t) === t ? "" + Math.round(t) : t.toFixed(e)
	}

	function n() {
		let e = "";
		for (let n = 0; n < arguments.length; n += 1) {
			const o = arguments[n];
			o >= 0 && n > 0 && (e += " "), e += t(o)
		}
		return e
	}
	e = void 0 !== e ? e : 2;
	let o = "";
	for (let e = 0; e < this.commands.length; e += 1) {
		const t = this.commands[e];
		"M" === t.type ? o += "M" + n(t.x, t.y) : "L" === t.type ? o += "L" + n(t.x, t.y) : "C" === t.type ? o +=
			"C" + n(t.x1, t.y1, t.x2, t.y2, t.x, t.y) : "Q" === t.type ? o += "Q" + n(t.x1, t.y1, t.x, t.y) :
			"Z" === t.type && (o += "Z")
	}
	return o
}, I.prototype.toSVG = function(e) {
	let t = '<path d="';
	return t += this.toPathData(e), t += '"', this.fill && "black" !== this.fill && (null === this.fill ? t +=
		' fill="none"' : t += ' fill="' + this.fill + '"'), this.stroke && (t += ' stroke="' + this.stroke +
		'" stroke-width="' + this.strokeWidth + '"'), t += "/>", t
}, I.prototype.toDOMElement = function(e) {
	const t = this.toPathData(e),
		n = document.createElementNS("http://www.w3.org/2000/svg", "path");
	return n.setAttribute("d", t), n
};
var G = {
	fail: B,
	argument: N,
	assert: N
};
const P = {},
	A = {},
	F = {};

function H(e) {
	return function() {
		return e
	}
}
A.BYTE = function(e) {
		return G.argument(e >= 0 && e <= 255, "Byte value should be between 0 and 255."), [e]
	}, F.BYTE = H(1), A.CHAR = function(e) {
		return [e.charCodeAt(0)]
	}, F.CHAR = H(1), A.CHARARRAY = function(e) {
		const t = [];
		for (let n = 0; n < e.length; n += 1) t[n] = e.charCodeAt(n);
		return t
	}, F.CHARARRAY = function(e) {
		return e.length
	}, A.USHORT = function(e) {
		return [e >> 8 & 255, 255 & e]
	}, F.USHORT = H(2), A.SHORT = function(e) {
		return e >= 32768 && (e = -(65536 - e)), [e >> 8 & 255, 255 & e]
	}, F.SHORT = H(2), A.UINT24 = function(e) {
		return [e >> 16 & 255, e >> 8 & 255, 255 & e]
	}, F.UINT24 = H(3), A.ULONG = function(e) {
		return [e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, 255 & e]
	}, F.ULONG = H(4), A.LONG = function(e) {
		return e >= 2147483648 && (e = -(4294967296 - e)), [e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, 255 & e]
	}, F.LONG = H(4), A.FIXED = A.ULONG, F.FIXED = F.ULONG, A.FWORD = A.SHORT, F.FWORD = F.SHORT, A.UFWORD = A.USHORT, F
	.UFWORD = F.USHORT, A.LONGDATETIME = function(e) {
		return [0, 0, 0, 0, e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, 255 & e]
	}, F.LONGDATETIME = H(8), A.TAG = function(e) {
		return G.argument(4 === e.length, "Tag should be exactly 4 ASCII characters."), [e.charCodeAt(0), e.charCodeAt(
			1), e.charCodeAt(2), e.charCodeAt(3)]
	}, F.TAG = H(4), A.Card8 = A.BYTE, F.Card8 = F.BYTE, A.Card16 = A.USHORT, F.Card16 = F.USHORT, A.OffSize = A.BYTE, F
	.OffSize = F.BYTE, A.SID = A.USHORT, F.SID = F.USHORT, A.NUMBER = function(e) {
		return e >= -107 && e <= 107 ? [e + 139] : e >= 108 && e <= 1131 ? [247 + ((e -= 108) >> 8), 255 & e] : e >= -
			1131 && e <= -108 ? [251 + ((e = -e - 108) >> 8), 255 & e] : e >= -32768 && e <= 32767 ? A.NUMBER16(e) : A
			.NUMBER32(e)
	}, F.NUMBER = function(e) {
		return A.NUMBER(e).length
	}, A.NUMBER16 = function(e) {
		return [28, e >> 8 & 255, 255 & e]
	}, F.NUMBER16 = H(3), A.NUMBER32 = function(e) {
		return [29, e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, 255 & e]
	}, F.NUMBER32 = H(5), A.REAL = function(e) {
		let t = e.toString();
		const n = /\.(\d*?)(?:9{5,20}|0{5,20})\d{0,2}(?:e(.+)|$)/.exec(t);
		if (n) {
			const o = parseFloat("1e" + ((n[2] ? +n[2] : 0) + n[1].length));
			t = (Math.round(e * o) / o).toString()
		}
		let o = "";
		for (let e = 0, n = t.length; e < n; e += 1) {
			const n = t[e];
			o += "e" === n ? "-" === t[++e] ? "c" : "b" : "." === n ? "a" : "-" === n ? "e" : n
		}
		o += 1 & o.length ? "f" : "ff";
		const r = [30];
		for (let e = 0, t = o.length; e < t; e += 2) r.push(parseInt(o.substr(e, 2), 16));
		return r
	}, F.REAL = function(e) {
		return A.REAL(e).length
	}, A.NAME = A.CHARARRAY, F.NAME = F.CHARARRAY, A.STRING = A.CHARARRAY, F.STRING = F.CHARARRAY, P.UTF8 = function(e,
		t, n) {
		const o = [],
			r = n;
		for (let n = 0; n < r; n++, t += 1) o[n] = e.getUint8(t);
		return String.fromCharCode.apply(null, o)
	}, P.UTF16 = function(e, t, n) {
		const o = [],
			r = n / 2;
		for (let n = 0; n < r; n++, t += 2) o[n] = e.getUint16(t);
		return String.fromCharCode.apply(null, o)
	}, A.UTF16 = function(e) {
		const t = [];
		for (let n = 0; n < e.length; n += 1) {
			const o = e.charCodeAt(n);
			t[t.length] = o >> 8 & 255, t[t.length] = 255 & o
		}
		return t
	}, F.UTF16 = function(e) {
		return 2 * e.length
	};
const z = {
	"x-mac-croatian": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊©⁄€‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ",
	"x-mac-cyrillic": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю",
	"x-mac-gaelic": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØḂ±≤≥ḃĊċḊḋḞḟĠġṀæøṁṖṗɼƒſṠ«»… ÀÃÕŒœ–—“”‘’ṡẛÿŸṪ€‹›Ŷŷṫ·Ỳỳ⁊ÂÊÁËÈÍÎÏÌÓÔ♣ÒÚÛÙıÝýŴŵẄẅẀẁẂẃ",
	"x-mac-greek": "Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦€ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩάΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ­",
	"x-mac-icelandic": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ",
	"x-mac-inuit": "ᐃᐄᐅᐆᐊᐋᐱᐲᐳᐴᐸᐹᑉᑎᑏᑐᑑᑕᑖᑦᑭᑮᑯᑰᑲᑳᒃᒋᒌᒍᒎᒐᒑ°ᒡᒥᒦ•¶ᒧ®©™ᒨᒪᒫᒻᓂᓃᓄᓅᓇᓈᓐᓯᓰᓱᓲᓴᓵᔅᓕᓖᓗᓘᓚᓛᓪᔨᔩᔪᔫᔭ… ᔮᔾᕕᕖᕗ–—“”‘’ᕘᕙᕚᕝᕆᕇᕈᕉᕋᕌᕐᕿᖀᖁᖂᖃᖄᖅᖏᖐᖑᖒᖓᖔᖕᙱᙲᙳᙴᙵᙶᖖᖠᖡᖢᖣᖤᖥᖦᕼŁł",
	"x-mac-ce": "ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ",
	macintosh: "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ",
	"x-mac-romanian": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂȘ∞±≤≥¥µ∂∑∏π∫ªºΩăș¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›Țț‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ",
	"x-mac-turkish": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙˆ˜¯˘˙˚¸˝˛ˇ"
};
P.MACSTRING = function(e, t, n, o) {
	const r = z[o];
	if (void 0 === r) return;
	let s = "";
	for (let o = 0; o < n; o++) {
		const n = e.getUint8(t + o);
		s += n <= 127 ? String.fromCharCode(n) : r[127 & n]
	}
	return s
};
const W = "function" == typeof WeakMap && new WeakMap;
let _;

function q(e) {
	return e >= -128 && e <= 127
}

function X(e, t, n) {
	let o = 0;
	const r = e.length;
	for (; t < r && o < 64 && 0 === e[t];) ++t, ++o;
	return n.push(128 | o - 1), t
}

function V(e, t, n) {
	let o = 0;
	const r = e.length;
	let s = t;
	for (; s < r && o < 64;) {
		const t = e[s];
		if (!q(t)) break;
		if (0 === t && s + 1 < r && 0 === e[s + 1]) break;
		++s, ++o
	}
	n.push(o - 1);
	for (let o = t; o < s; ++o) n.push(e[o] + 256 & 255);
	return s
}

function j(e, t, n) {
	let o = 0;
	const r = e.length;
	let s = t;
	for (; s < r && o < 64;) {
		const t = e[s];
		if (0 === t) break;
		if (q(t) && s + 1 < r && q(e[s + 1])) break;
		++s, ++o
	}
	n.push(64 | o - 1);
	for (let o = t; o < s; ++o) {
		const t = e[o];
		n.push(t + 65536 >> 8 & 255, t + 256 & 255)
	}
	return s
}
A.MACSTRING = function(e, t) {
	const n = function(e) {
		if (!_) {
			_ = {};
			for (let e in z) _[e] = new String(e)
		}
		const t = _[e];
		if (void 0 === t) return;
		if (W) {
			const e = W.get(t);
			if (void 0 !== e) return e
		}
		const n = z[e];
		if (void 0 === n) return;
		const o = {};
		for (let e = 0; e < n.length; e++) o[n.charCodeAt(e)] = e + 128;
		return W && W.set(t, o), o
	}(t);
	if (void 0 === n) return;
	const o = [];
	for (let t = 0; t < e.length; t++) {
		let r = e.charCodeAt(t);
		if (r >= 128 && (r = n[r], void 0 === r)) return;
		o[t] = r
	}
	return o
}, F.MACSTRING = function(e, t) {
	const n = A.MACSTRING(e, t);
	return void 0 !== n ? n.length : 0
}, A.VARDELTAS = function(e) {
	let t = 0;
	const n = [];
	for (; t < e.length;) {
		const o = e[t];
		t = 0 === o ? X(e, t, n) : o >= -128 && o <= 127 ? V(e, t, n) : j(e, t, n)
	}
	return n
}, A.INDEX = function(e) {
	let t = 1;
	const n = [t],
		o = [];
	for (let r = 0; r < e.length; r += 1) {
		const s = A.OBJECT(e[r]);
		Array.prototype.push.apply(o, s), t += s.length, n.push(t)
	}
	if (0 === o.length) return [0, 0];
	const r = [],
		s = 1 + Math.floor(Math.log(t) / Math.log(2)) / 8 | 0,
		a = [void 0, A.BYTE, A.USHORT, A.UINT24, A.ULONG][s];
	for (let e = 0; e < n.length; e += 1) {
		const t = a(n[e]);
		Array.prototype.push.apply(r, t)
	}
	return Array.prototype.concat(A.Card16(e.length), A.OffSize(s), r, o)
}, F.INDEX = function(e) {
	return A.INDEX(e).length
}, A.DICT = function(e) {
	let t = [];
	const n = Object.keys(e),
		o = n.length;
	for (let r = 0; r < o; r += 1) {
		const o = parseInt(n[r], 0),
			s = e[o];
		t = t.concat(A.OPERAND(s.value, s.type)), t = t.concat(A.OPERATOR(o))
	}
	return t
}, F.DICT = function(e) {
	return A.DICT(e).length
}, A.OPERATOR = function(e) {
	return e < 1200 ? [e] : [12, e - 1200]
}, A.OPERAND = function(e, t) {
	let n = [];
	if (Array.isArray(t))
		for (let o = 0; o < t.length; o += 1) G.argument(e.length === t.length,
			"Not enough arguments given for type" + t), n = n.concat(A.OPERAND(e[o], t[o]));
	else if ("SID" === t) n = n.concat(A.NUMBER(e));
	else if ("offset" === t) n = n.concat(A.NUMBER32(e));
	else if ("number" === t) n = n.concat(A.NUMBER(e));
	else {
		if ("real" !== t) throw new Error("Unknown operand type " + t);
		n = n.concat(A.REAL(e))
	}
	return n
}, A.OP = A.BYTE, F.OP = F.BYTE;
const Y = "function" == typeof WeakMap && new WeakMap;

function Z(e, t, n) {
	for (let e = 0; e < t.length; e += 1) {
		const n = t[e];
		this[n.name] = n.value
	}
	if (this.tableName = e, this.fields = t, n) {
		const e = Object.keys(n);
		for (let t = 0; t < e.length; t += 1) {
			const o = e[t],
				r = n[o];
			void 0 !== this[o] && (this[o] = r)
		}
	}
}

function $(e, t, n) {
	void 0 === n && (n = t.length);
	const o = new Array(t.length + 1);
	o[0] = {
		name: e + "Count",
		type: "USHORT",
		value: n
	};
	for (let n = 0; n < t.length; n++) o[n + 1] = {
		name: e + n,
		type: "USHORT",
		value: t[n]
	};
	return o
}

function Q(e, t, n) {
	const o = t.length,
		r = new Array(o + 1);
	r[0] = {
		name: e + "Count",
		type: "USHORT",
		value: o
	};
	for (let s = 0; s < o; s++) r[s + 1] = {
		name: e + s,
		type: "TABLE",
		value: n(t[s], s)
	};
	return r
}

function K(e, t, n) {
	const o = t.length;
	let r = [];
	r[0] = {
		name: e + "Count",
		type: "USHORT",
		value: o
	};
	for (let e = 0; e < o; e++) r = r.concat(n(t[e], e));
	return r
}

function J(e) {
	1 === e.format ? Z.call(this, "coverageTable", [{
		name: "coverageFormat",
		type: "USHORT",
		value: 1
	}].concat($("glyph", e.glyphs))) : G.assert(!1, "Can't create coverage table format 2 yet.")
}

function ee(e) {
	Z.call(this, "scriptListTable", K("scriptRecord", e, (function(e, t) {
		const n = e.script;
		let o = n.defaultLangSys;
		return G.assert(!!o, "Unable to write GSUB: script " + e.tag +
			" has no default language system."), [{
			name: "scriptTag" + t,
			type: "TAG",
			value: e.tag
		}, {
			name: "script" + t,
			type: "TABLE",
			value: new Z("scriptTable", [{
				name: "defaultLangSys",
				type: "TABLE",
				value: new Z("defaultLangSys", [{
					name: "lookupOrder",
					type: "USHORT",
					value: 0
				}, {
					name: "reqFeatureIndex",
					type: "USHORT",
					value: o.reqFeatureIndex
				}].concat($("featureIndex", o.featureIndexes)))
			}].concat(K("langSys", n.langSysRecords, (function(e, t) {
				const n = e.langSys;
				return [{
					name: "langSysTag" + t,
					type: "TAG",
					value: e.tag
				}, {
					name: "langSys" + t,
					type: "TABLE",
					value: new Z("langSys", [{
						name: "lookupOrder",
						type: "USHORT",
						value: 0
					}, {
						name: "reqFeatureIndex",
						type: "USHORT",
						value: n.reqFeatureIndex
					}].concat($("featureIndex", n
						.featureIndexes)))
				}]
			}))))
		}]
	})))
}

function te(e) {
	Z.call(this, "featureListTable", K("featureRecord", e, (function(e, t) {
		const n = e.feature;
		return [{
			name: "featureTag" + t,
			type: "TAG",
			value: e.tag
		}, {
			name: "feature" + t,
			type: "TABLE",
			value: new Z("featureTable", [{
				name: "featureParams",
				type: "USHORT",
				value: n.featureParams
			}].concat($("lookupListIndex", n.lookupListIndexes)))
		}]
	})))
}

function ne(e, t) {
	Z.call(this, "lookupListTable", Q("lookup", e, (function(e) {
		let n = t[e.lookupType];
		return G.assert(!!n, "Unable to write GSUB lookup type " + e.lookupType + " tables."), new Z(
			"lookupTable", [{
				name: "lookupType",
				type: "USHORT",
				value: e.lookupType
			}, {
				name: "lookupFlag",
				type: "USHORT",
				value: e.lookupFlag
			}].concat(Q("subtable", e.subtables, n)))
	})))
}
A.CHARSTRING = function(e) {
		if (Y) {
			const t = Y.get(e);
			if (void 0 !== t) return t
		}
		let t = [];
		const n = e.length;
		for (let o = 0; o < n; o += 1) {
			const n = e[o];
			t = t.concat(A[n.type](n.value))
		}
		return Y && Y.set(e, t), t
	}, F.CHARSTRING = function(e) {
		return A.CHARSTRING(e).length
	}, A.OBJECT = function(e) {
		const t = A[e.type];
		return G.argument(void 0 !== t, "No encoding function for type " + e.type), t(e.value)
	}, F.OBJECT = function(e) {
		const t = F[e.type];
		return G.argument(void 0 !== t, "No sizeOf function for type " + e.type), t(e.value)
	}, A.TABLE = function(e) {
		let t = [];
		const n = e.fields.length,
			o = [],
			r = [];
		for (let s = 0; s < n; s += 1) {
			const n = e.fields[s],
				a = A[n.type];
			G.argument(void 0 !== a, "No encoding function for field type " + n.type + " (" + n.name + ")");
			let i = e[n.name];
			void 0 === i && (i = n.value);
			const l = a(i);
			"TABLE" === n.type ? (r.push(t.length), t = t.concat([0, 0]), o.push(l)) : t = t.concat(l)
		}
		for (let n = 0; n < o.length; n += 1) {
			const s = r[n],
				a = t.length;
			G.argument(a < 65536, "Table " + e.tableName + " too big."), t[s] = a >> 8, t[s + 1] = 255 & a, t = t
				.concat(o[n])
		}
		return t
	}, F.TABLE = function(e) {
		let t = 0;
		const n = e.fields.length;
		for (let o = 0; o < n; o += 1) {
			const n = e.fields[o],
				r = F[n.type];
			G.argument(void 0 !== r, "No sizeOf function for field type " + n.type + " (" + n.name + ")");
			let s = e[n.name];
			void 0 === s && (s = n.value), t += r(s), "TABLE" === n.type && (t += 2)
		}
		return t
	}, A.RECORD = A.TABLE, F.RECORD = F.TABLE, A.LITERAL = function(e) {
		return e
	}, F.LITERAL = function(e) {
		return e.length
	}, Z.prototype.encode = function() {
		return A.TABLE(this)
	}, Z.prototype.sizeOf = function() {
		return F.TABLE(this)
	}, J.prototype = Object.create(Z.prototype), J.prototype.constructor = J, ee.prototype = Object.create(Z.prototype),
	ee.prototype.constructor = ee, te.prototype = Object.create(Z.prototype), te.prototype.constructor = te, ne
	.prototype = Object.create(Z.prototype), ne.prototype.constructor = ne;
var oe = {
	Table: Z,
	Record: Z,
	Coverage: J,
	ScriptList: ee,
	FeatureList: te,
	LookupList: ne,
	ushortList: $,
	tableList: Q,
	recordList: K
};

function re(e, t) {
	return e.getUint8(t)
}

function se(e, t) {
	return e.getUint16(t, !1)
}

function ae(e, t) {
	return e.getUint32(t, !1)
}

function ie(e, t) {
	return e.getInt16(t, !1) + e.getUint16(t + 2, !1) / 65535
}
const le = {
	byte: 1,
	uShort: 2,
	short: 2,
	uLong: 4,
	fixed: 4,
	longDateTime: 8,
	tag: 4
};

function ce(e, t) {
	this.data = e, this.offset = t, this.relativeOffset = 0
}
ce.prototype.parseByte = function() {
		const e = this.data.getUint8(this.offset + this.relativeOffset);
		return this.relativeOffset += 1, e
	}, ce.prototype.parseChar = function() {
		const e = this.data.getInt8(this.offset + this.relativeOffset);
		return this.relativeOffset += 1, e
	}, ce.prototype.parseCard8 = ce.prototype.parseByte, ce.prototype.parseUShort = function() {
		const e = this.data.getUint16(this.offset + this.relativeOffset);
		return this.relativeOffset += 2, e
	}, ce.prototype.parseCard16 = ce.prototype.parseUShort, ce.prototype.parseSID = ce.prototype.parseUShort, ce
	.prototype.parseOffset16 = ce.prototype.parseUShort, ce.prototype.parseShort = function() {
		const e = this.data.getInt16(this.offset + this.relativeOffset);
		return this.relativeOffset += 2, e
	}, ce.prototype.parseF2Dot14 = function() {
		const e = this.data.getInt16(this.offset + this.relativeOffset) / 16384;
		return this.relativeOffset += 2, e
	}, ce.prototype.parseULong = function() {
		const e = ae(this.data, this.offset + this.relativeOffset);
		return this.relativeOffset += 4, e
	}, ce.prototype.parseFixed = function() {
		const e = ie(this.data, this.offset + this.relativeOffset);
		return this.relativeOffset += 4, e
	}, ce.prototype.parseString = function(e) {
		const t = this.data,
			n = this.offset + this.relativeOffset;
		let o = "";
		this.relativeOffset += e;
		for (let r = 0; r < e; r++) o += String.fromCharCode(t.getUint8(n + r));
		return o
	}, ce.prototype.parseTag = function() {
		return this.parseString(4)
	}, ce.prototype.parseLongDateTime = function() {
		let e = ae(this.data, this.offset + this.relativeOffset + 4);
		return e -= 2082844800, this.relativeOffset += 8, e
	}, ce.prototype.parseVersion = function() {
		const e = se(this.data, this.offset + this.relativeOffset),
			t = se(this.data, this.offset + this.relativeOffset + 2);
		return this.relativeOffset += 4, e + t / 4096 / 10
	}, ce.prototype.skip = function(e, t) {
		void 0 === t && (t = 1), this.relativeOffset += le[e] * t
	}, ce.prototype.parseOffset16List = ce.prototype.parseUShortList = function(e) {
		void 0 === e && (e = this.parseUShort());
		const t = new Array(e),
			n = this.data;
		let o = this.offset + this.relativeOffset;
		for (let r = 0; r < e; r++) t[r] = n.getUint16(o), o += 2;
		return this.relativeOffset += 2 * e, t
	}, ce.prototype.parseShortList = function(e) {
		const t = new Array(e),
			n = this.data;
		let o = this.offset + this.relativeOffset;
		for (let r = 0; r < e; r++) t[r] = n.getInt16(o), o += 2;
		return this.relativeOffset += 2 * e, t
	}, ce.prototype.parseByteList = function(e) {
		const t = new Array(e),
			n = this.data;
		let o = this.offset + this.relativeOffset;
		for (let r = 0; r < e; r++) t[r] = n.getUint8(o++);
		return this.relativeOffset += e, t
	}, ce.prototype.parseList = function(e, t) {
		t || (t = e, e = this.parseUShort());
		const n = new Array(e);
		for (let o = 0; o < e; o++) n[o] = t.call(this);
		return n
	}, ce.prototype.parseRecordList = function(e, t) {
		t || (t = e, e = this.parseUShort());
		const n = new Array(e),
			o = Object.keys(t);
		for (let r = 0; r < e; r++) {
			const e = {};
			for (let n = 0; n < o.length; n++) {
				const r = o[n],
					s = t[r];
				e[r] = s.call(this)
			}
			n[r] = e
		}
		return n
	}, ce.prototype.parseStruct = function(e) {
		if ("function" == typeof e) return e.call(this); {
			const t = Object.keys(e),
				n = {};
			for (let o = 0; o < t.length; o++) {
				const r = t[o],
					s = e[r];
				n[r] = s.call(this)
			}
			return n
		}
	}, ce.prototype.parsePointer = function(e) {
		const t = this.parseOffset16();
		if (t > 0) return new ce(this.data, this.offset + t).parseStruct(e)
	}, ce.prototype.parseListOfLists = function(e) {
		const t = this.parseOffset16List(),
			n = t.length,
			o = this.relativeOffset,
			r = new Array(n);
		for (let o = 0; o < n; o++) {
			const n = t[o];
			if (0 !== n)
				if (this.relativeOffset = n, e) {
					const t = this.parseOffset16List(),
						s = new Array(t.length);
					for (let o = 0; o < t.length; o++) this.relativeOffset = n + t[o], s[o] = e.call(this);
					r[o] = s
				} else r[o] = this.parseUShortList();
			else r[o] = void 0
		}
		return this.relativeOffset = o, r
	}, ce.prototype.parseCoverage = function() {
		const e = this.offset + this.relativeOffset,
			t = this.parseUShort(),
			n = this.parseUShort();
		if (1 === t) return {
			format: 1,
			glyphs: this.parseUShortList(n)
		};
		if (2 === t) {
			const e = new Array(n);
			for (let t = 0; t < n; t++) e[t] = {
				start: this.parseUShort(),
				end: this.parseUShort(),
				index: this.parseUShort()
			};
			return {
				format: 2,
				ranges: e
			}
		}
		throw new Error("0x" + e.toString(16) + ": Coverage format must be 1 or 2.")
	}, ce.prototype.parseClassDef = function() {
		const e = this.offset + this.relativeOffset,
			t = this.parseUShort();
		if (1 === t) return {
			format: 1,
			startGlyph: this.parseUShort(),
			classes: this.parseUShortList()
		};
		if (2 === t) return {
			format: 2,
			ranges: this.parseRecordList({
				start: ce.uShort,
				end: ce.uShort,
				classId: ce.uShort
			})
		};
		throw new Error("0x" + e.toString(16) + ": ClassDef format must be 1 or 2.")
	}, ce.list = function(e, t) {
		return function() {
			return this.parseList(e, t)
		}
	}, ce.recordList = function(e, t) {
		return function() {
			return this.parseRecordList(e, t)
		}
	}, ce.pointer = function(e) {
		return function() {
			return this.parsePointer(e)
		}
	}, ce.tag = ce.prototype.parseTag, ce.byte = ce.prototype.parseByte, ce.uShort = ce.offset16 = ce.prototype
	.parseUShort, ce.uShortList = ce.prototype.parseUShortList, ce.struct = ce.prototype.parseStruct, ce.coverage = ce
	.prototype.parseCoverage, ce.classDef = ce.prototype.parseClassDef;
const ue = {
	reserved: ce.uShort,
	reqFeatureIndex: ce.uShort,
	featureIndexes: ce.uShortList
};
ce.prototype.parseScriptList = function() {
	return this.parsePointer(ce.recordList({
		tag: ce.tag,
		script: ce.pointer({
			defaultLangSys: ce.pointer(ue),
			langSysRecords: ce.recordList({
				tag: ce.tag,
				langSys: ce.pointer(ue)
			})
		})
	}))
}, ce.prototype.parseFeatureList = function() {
	return this.parsePointer(ce.recordList({
		tag: ce.tag,
		feature: ce.pointer({
			featureParams: ce.offset16,
			lookupListIndexes: ce.uShortList
		})
	}))
}, ce.prototype.parseLookupList = function(e) {
	return this.parsePointer(ce.list(ce.pointer((function() {
		const t = this.parseUShort();
		G.argument(1 <= t && t <= 8, "GSUB lookup type " + t + " unknown.");
		const n = this.parseUShort(),
			o = 16 & n;
		return {
			lookupType: t,
			lookupFlag: n,
			subtables: this.parseList(ce.pointer(e[t])),
			markFilteringSet: o ? this.parseUShort() : void 0
		}
	}))))
};
var pe = {
	getByte: re,
	getCard8: re,
	getUShort: se,
	getCard16: se,
	getShort: function(e, t) {
		return e.getInt16(t, !1)
	},
	getULong: ae,
	getFixed: ie,
	getTag: function(e, t) {
		let n = "";
		for (let o = t; o < t + 4; o += 1) n += String.fromCharCode(e.getInt8(o));
		return n
	},
	getOffset: function(e, t, n) {
		let o = 0;
		for (let r = 0; r < n; r += 1) o <<= 8, o += e.getUint8(t + r);
		return o
	},
	getBytes: function(e, t, n) {
		const o = [];
		for (let r = t; r < n; r += 1) o.push(e.getUint8(r));
		return o
	},
	bytesToString: function(e) {
		let t = "";
		for (let n = 0; n < e.length; n += 1) t += String.fromCharCode(e[n]);
		return t
	},
	Parser: ce
};

function he(e, t, n) {
	e.segments.push({
		end: t,
		start: t,
		delta: -(t - n),
		offset: 0
	})
}
var fe = {
	parse: function(e, t) {
		const n = {};
		n.version = pe.getUShort(e, t), G.argument(0 === n.version, "cmap table version should be 0."), n
			.numTables = pe.getUShort(e, t + 2);
		let o = -1;
		for (let r = n.numTables - 1; r >= 0; r -= 1) {
			const n = pe.getUShort(e, t + 4 + 8 * r),
				s = pe.getUShort(e, t + 4 + 8 * r + 2);
			if (3 === n && (0 === s || 1 === s || 10 === s)) {
				o = pe.getULong(e, t + 4 + 8 * r + 4);
				break
			}
		}
		if (-1 === o) throw new Error("No valid cmap sub-tables found.");
		const r = new pe.Parser(e, t + o);
		if (n.format = r.parseUShort(), 12 === n.format) ! function(e, t) {
			let n;
			t.parseUShort(), e.length = t.parseULong(), e.language = t.parseULong(), e.groupCount = n = t
				.parseULong(), e.glyphIndexMap = {};
			for (let o = 0; o < n; o += 1) {
				const n = t.parseULong(),
					o = t.parseULong();
				let r = t.parseULong();
				for (let t = n; t <= o; t += 1) e.glyphIndexMap[t] = r, r++
			}
		}(n, r);
		else {
			if (4 !== n.format) throw new Error(
				"Only format 4 and 12 cmap tables are supported (found format " + n.format + ").");
			! function(e, t, n, o, r) {
				let s;
				e.length = t.parseUShort(), e.language = t.parseUShort(), e.segCount = s = t.parseUShort() >> 1,
					t.skip("uShort", 3), e.glyphIndexMap = {};
				const a = new pe.Parser(n, o + r + 14),
					i = new pe.Parser(n, o + r + 16 + 2 * s),
					l = new pe.Parser(n, o + r + 16 + 4 * s),
					c = new pe.Parser(n, o + r + 16 + 6 * s);
				let u = o + r + 16 + 8 * s;
				for (let t = 0; t < s - 1; t += 1) {
					let t;
					const o = a.parseUShort(),
						r = i.parseUShort(),
						s = l.parseShort(),
						p = c.parseUShort();
					for (let a = r; a <= o; a += 1) 0 !== p ? (u = c.offset + c.relativeOffset - 2, u += p, u +=
							2 * (a - r), t = pe.getUShort(n, u), 0 !== t && (t = t + s & 65535)) : t = a + s &
						65535, e.glyphIndexMap[a] = t
				}
			}(n, r, e, t, o)
		}
		return n
	},
	make: function(e) {
		const t = new oe.Table("cmap", [{
			name: "version",
			type: "USHORT",
			value: 0
		}, {
			name: "numTables",
			type: "USHORT",
			value: 1
		}, {
			name: "platformID",
			type: "USHORT",
			value: 3
		}, {
			name: "encodingID",
			type: "USHORT",
			value: 1
		}, {
			name: "offset",
			type: "ULONG",
			value: 12
		}, {
			name: "format",
			type: "USHORT",
			value: 4
		}, {
			name: "length",
			type: "USHORT",
			value: 0
		}, {
			name: "language",
			type: "USHORT",
			value: 0
		}, {
			name: "segCountX2",
			type: "USHORT",
			value: 0
		}, {
			name: "searchRange",
			type: "USHORT",
			value: 0
		}, {
			name: "entrySelector",
			type: "USHORT",
			value: 0
		}, {
			name: "rangeShift",
			type: "USHORT",
			value: 0
		}]);
		t.segments = [];
		for (let n = 0; n < e.length; n += 1) {
			const o = e.get(n);
			for (let e = 0; e < o.unicodes.length; e += 1) he(t, o.unicodes[e], n);
			t.segments = t.segments.sort((function(e, t) {
				return e.start - t.start
			}))
		}
		let n;
		! function(e) {
			e.segments.push({
				end: 65535,
				start: 65535,
				delta: 1,
				offset: 0
			})
		}(t), n = t.segments.length, t.segCountX2 = 2 * n, t.searchRange = 2 * Math.pow(2, Math.floor(Math.log(
				n) / Math.log(2))), t.entrySelector = Math.log(t.searchRange / 2) / Math.log(2), t.rangeShift =
			t.segCountX2 - t.searchRange;
		let o = [],
			r = [],
			s = [],
			a = [],
			i = [];
		for (let e = 0; e < n; e += 1) {
			const n = t.segments[e];
			o = o.concat({
				name: "end_" + e,
				type: "USHORT",
				value: n.end
			}), r = r.concat({
				name: "start_" + e,
				type: "USHORT",
				value: n.start
			}), s = s.concat({
				name: "idDelta_" + e,
				type: "SHORT",
				value: n.delta
			}), a = a.concat({
				name: "idRangeOffset_" + e,
				type: "USHORT",
				value: n.offset
			}), void 0 !== n.glyphId && (i = i.concat({
				name: "glyph_" + e,
				type: "USHORT",
				value: n.glyphId
			}))
		}
		return t.fields = t.fields.concat(o), t.fields.push({
				name: "reservedPad",
				type: "USHORT",
				value: 0
			}), t.fields = t.fields.concat(r), t.fields = t.fields.concat(s), t.fields = t.fields.concat(a), t
			.fields = t.fields.concat(i), t.length = 14 + 2 * o.length + 2 + 2 * r.length + 2 * s.length + 2 * a
			.length + 2 * i.length, t
	}
};
const de = [".notdef", "space", "exclam", "quotedbl", "numbersign", "dollar", "percent", "ampersand", "quoteright",
		"parenleft", "parenright", "asterisk", "plus", "comma", "hyphen", "period", "slash", "zero", "one", "two",
		"three", "four", "five", "six", "seven", "eight", "nine", "colon", "semicolon", "less", "equal", "greater",
		"question", "at", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
		"T", "U", "V", "W", "X", "Y", "Z", "bracketleft", "backslash", "bracketright", "asciicircum", "underscore",
		"quoteleft", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
		"u", "v", "w", "x", "y", "z", "braceleft", "bar", "braceright", "asciitilde", "exclamdown", "cent", "sterling",
		"fraction", "yen", "florin", "section", "currency", "quotesingle", "quotedblleft", "guillemotleft",
		"guilsinglleft", "guilsinglright", "fi", "fl", "endash", "dagger", "daggerdbl", "periodcentered", "paragraph",
		"bullet", "quotesinglbase", "quotedblbase", "quotedblright", "guillemotright", "ellipsis", "perthousand",
		"questiondown", "grave", "acute", "circumflex", "tilde", "macron", "breve", "dotaccent", "dieresis", "ring",
		"cedilla", "hungarumlaut", "ogonek", "caron", "emdash", "AE", "ordfeminine", "Lslash", "Oslash", "OE",
		"ordmasculine", "ae", "dotlessi", "lslash", "oslash", "oe", "germandbls", "onesuperior", "logicalnot", "mu",
		"trademark", "Eth", "onehalf", "plusminus", "Thorn", "onequarter", "divide", "brokenbar", "degree", "thorn",
		"threequarters", "twosuperior", "registered", "minus", "eth", "multiply", "threesuperior", "copyright",
		"Aacute", "Acircumflex", "Adieresis", "Agrave", "Aring", "Atilde", "Ccedilla", "Eacute", "Ecircumflex",
		"Edieresis", "Egrave", "Iacute", "Icircumflex", "Idieresis", "Igrave", "Ntilde", "Oacute", "Ocircumflex",
		"Odieresis", "Ograve", "Otilde", "Scaron", "Uacute", "Ucircumflex", "Udieresis", "Ugrave", "Yacute",
		"Ydieresis", "Zcaron", "aacute", "acircumflex", "adieresis", "agrave", "aring", "atilde", "ccedilla", "eacute",
		"ecircumflex", "edieresis", "egrave", "iacute", "icircumflex", "idieresis", "igrave", "ntilde", "oacute",
		"ocircumflex", "odieresis", "ograve", "otilde", "scaron", "uacute", "ucircumflex", "udieresis", "ugrave",
		"yacute", "ydieresis", "zcaron", "exclamsmall", "Hungarumlautsmall", "dollaroldstyle", "dollarsuperior",
		"ampersandsmall", "Acutesmall", "parenleftsuperior", "parenrightsuperior", "266 ff", "onedotenleader",
		"zerooldstyle", "oneoldstyle", "twooldstyle", "threeoldstyle", "fouroldstyle", "fiveoldstyle", "sixoldstyle",
		"sevenoldstyle", "eightoldstyle", "nineoldstyle", "commasuperior", "threequartersemdash", "periodsuperior",
		"questionsmall", "asuperior", "bsuperior", "centsuperior", "dsuperior", "esuperior", "isuperior", "lsuperior",
		"msuperior", "nsuperior", "osuperior", "rsuperior", "ssuperior", "tsuperior", "ff", "ffi", "ffl",
		"parenleftinferior", "parenrightinferior", "Circumflexsmall", "hyphensuperior", "Gravesmall", "Asmall",
		"Bsmall", "Csmall", "Dsmall", "Esmall", "Fsmall", "Gsmall", "Hsmall", "Ismall", "Jsmall", "Ksmall", "Lsmall",
		"Msmall", "Nsmall", "Osmall", "Psmall", "Qsmall", "Rsmall", "Ssmall", "Tsmall", "Usmall", "Vsmall", "Wsmall",
		"Xsmall", "Ysmall", "Zsmall", "colonmonetary", "onefitted", "rupiah", "Tildesmall", "exclamdownsmall",
		"centoldstyle", "Lslashsmall", "Scaronsmall", "Zcaronsmall", "Dieresissmall", "Brevesmall", "Caronsmall",
		"Dotaccentsmall", "Macronsmall", "figuredash", "hypheninferior", "Ogoneksmall", "Ringsmall", "Cedillasmall",
		"questiondownsmall", "oneeighth", "threeeighths", "fiveeighths", "seveneighths", "onethird", "twothirds",
		"zerosuperior", "foursuperior", "fivesuperior", "sixsuperior", "sevensuperior", "eightsuperior", "ninesuperior",
		"zeroinferior", "oneinferior", "twoinferior", "threeinferior", "fourinferior", "fiveinferior", "sixinferior",
		"seveninferior", "eightinferior", "nineinferior", "centinferior", "dollarinferior", "periodinferior",
		"commainferior", "Agravesmall", "Aacutesmall", "Acircumflexsmall", "Atildesmall", "Adieresissmall",
		"Aringsmall", "AEsmall", "Ccedillasmall", "Egravesmall", "Eacutesmall", "Ecircumflexsmall", "Edieresissmall",
		"Igravesmall", "Iacutesmall", "Icircumflexsmall", "Idieresissmall", "Ethsmall", "Ntildesmall", "Ogravesmall",
		"Oacutesmall", "Ocircumflexsmall", "Otildesmall", "Odieresissmall", "OEsmall", "Oslashsmall", "Ugravesmall",
		"Uacutesmall", "Ucircumflexsmall", "Udieresissmall", "Yacutesmall", "Thornsmall", "Ydieresissmall", "001.000",
		"001.001", "001.002", "001.003", "Black", "Bold", "Book", "Light", "Medium", "Regular", "Roman", "Semibold"
	],
	ge = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
		"", "", "", "", "", "space", "exclam", "quotedbl", "numbersign", "dollar", "percent", "ampersand", "quoteright",
		"parenleft", "parenright", "asterisk", "plus", "comma", "hyphen", "period", "slash", "zero", "one", "two",
		"three", "four", "five", "six", "seven", "eight", "nine", "colon", "semicolon", "less", "equal", "greater",
		"question", "at", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
		"T", "U", "V", "W", "X", "Y", "Z", "bracketleft", "backslash", "bracketright", "asciicircum", "underscore",
		"quoteleft", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
		"u", "v", "w", "x", "y", "z", "braceleft", "bar", "braceright", "asciitilde", "", "", "", "", "", "", "", "",
		"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
		"exclamdown", "cent", "sterling", "fraction", "yen", "florin", "section", "currency", "quotesingle",
		"quotedblleft", "guillemotleft", "guilsinglleft", "guilsinglright", "fi", "fl", "", "endash", "dagger",
		"daggerdbl", "periodcentered", "", "paragraph", "bullet", "quotesinglbase", "quotedblbase", "quotedblright",
		"guillemotright", "ellipsis", "perthousand", "", "questiondown", "", "grave", "acute", "circumflex", "tilde",
		"macron", "breve", "dotaccent", "dieresis", "", "ring", "cedilla", "", "hungarumlaut", "ogonek", "caron",
		"emdash", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "AE", "", "ordfeminine", "", "", "",
		"", "Lslash", "Oslash", "OE", "ordmasculine", "", "", "", "", "", "ae", "", "", "", "dotlessi", "", "",
		"lslash", "oslash", "oe", "germandbls"
	],
	me = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
		"", "", "", "", "", "space", "exclamsmall", "Hungarumlautsmall", "", "dollaroldstyle", "dollarsuperior",
		"ampersandsmall", "Acutesmall", "parenleftsuperior", "parenrightsuperior", "twodotenleader", "onedotenleader",
		"comma", "hyphen", "period", "fraction", "zerooldstyle", "oneoldstyle", "twooldstyle", "threeoldstyle",
		"fouroldstyle", "fiveoldstyle", "sixoldstyle", "sevenoldstyle", "eightoldstyle", "nineoldstyle", "colon",
		"semicolon", "commasuperior", "threequartersemdash", "periodsuperior", "questionsmall", "", "asuperior",
		"bsuperior", "centsuperior", "dsuperior", "esuperior", "", "", "isuperior", "", "", "lsuperior", "msuperior",
		"nsuperior", "osuperior", "", "", "rsuperior", "ssuperior", "tsuperior", "", "ff", "fi", "fl", "ffi", "ffl",
		"parenleftinferior", "", "parenrightinferior", "Circumflexsmall", "hyphensuperior", "Gravesmall", "Asmall",
		"Bsmall", "Csmall", "Dsmall", "Esmall", "Fsmall", "Gsmall", "Hsmall", "Ismall", "Jsmall", "Ksmall", "Lsmall",
		"Msmall", "Nsmall", "Osmall", "Psmall", "Qsmall", "Rsmall", "Ssmall", "Tsmall", "Usmall", "Vsmall", "Wsmall",
		"Xsmall", "Ysmall", "Zsmall", "colonmonetary", "onefitted", "rupiah", "Tildesmall", "", "", "", "", "", "", "",
		"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
		"exclamdownsmall", "centoldstyle", "Lslashsmall", "", "", "Scaronsmall", "Zcaronsmall", "Dieresissmall",
		"Brevesmall", "Caronsmall", "", "Dotaccentsmall", "", "", "Macronsmall", "", "", "figuredash", "hypheninferior",
		"", "", "Ogoneksmall", "Ringsmall", "Cedillasmall", "", "", "", "onequarter", "onehalf", "threequarters",
		"questiondownsmall", "oneeighth", "threeeighths", "fiveeighths", "seveneighths", "onethird", "twothirds", "",
		"", "zerosuperior", "onesuperior", "twosuperior", "threesuperior", "foursuperior", "fivesuperior",
		"sixsuperior", "sevensuperior", "eightsuperior", "ninesuperior", "zeroinferior", "oneinferior", "twoinferior",
		"threeinferior", "fourinferior", "fiveinferior", "sixinferior", "seveninferior", "eightinferior",
		"nineinferior", "centinferior", "dollarinferior", "periodinferior", "commainferior", "Agravesmall",
		"Aacutesmall", "Acircumflexsmall", "Atildesmall", "Adieresissmall", "Aringsmall", "AEsmall", "Ccedillasmall",
		"Egravesmall", "Eacutesmall", "Ecircumflexsmall", "Edieresissmall", "Igravesmall", "Iacutesmall",
		"Icircumflexsmall", "Idieresissmall", "Ethsmall", "Ntildesmall", "Ogravesmall", "Oacutesmall",
		"Ocircumflexsmall", "Otildesmall", "Odieresissmall", "OEsmall", "Oslashsmall", "Ugravesmall", "Uacutesmall",
		"Ucircumflexsmall", "Udieresissmall", "Yacutesmall", "Thornsmall", "Ydieresissmall"
	],
	ye = [".notdef", ".null", "nonmarkingreturn", "space", "exclam", "quotedbl", "numbersign", "dollar", "percent",
		"ampersand", "quotesingle", "parenleft", "parenright", "asterisk", "plus", "comma", "hyphen", "period", "slash",
		"zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "colon", "semicolon", "less",
		"equal", "greater", "question", "at", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
		"P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "bracketleft", "backslash", "bracketright",
		"asciicircum", "underscore", "grave", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
		"p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "braceleft", "bar", "braceright", "asciitilde",
		"Adieresis", "Aring", "Ccedilla", "Eacute", "Ntilde", "Odieresis", "Udieresis", "aacute", "agrave",
		"acircumflex", "adieresis", "atilde", "aring", "ccedilla", "eacute", "egrave", "ecircumflex", "edieresis",
		"iacute", "igrave", "icircumflex", "idieresis", "ntilde", "oacute", "ograve", "ocircumflex", "odieresis",
		"otilde", "uacute", "ugrave", "ucircumflex", "udieresis", "dagger", "degree", "cent", "sterling", "section",
		"bullet", "paragraph", "germandbls", "registered", "copyright", "trademark", "acute", "dieresis", "notequal",
		"AE", "Oslash", "infinity", "plusminus", "lessequal", "greaterequal", "yen", "mu", "partialdiff", "summation",
		"product", "pi", "integral", "ordfeminine", "ordmasculine", "Omega", "ae", "oslash", "questiondown",
		"exclamdown", "logicalnot", "radical", "florin", "approxequal", "Delta", "guillemotleft", "guillemotright",
		"ellipsis", "nonbreakingspace", "Agrave", "Atilde", "Otilde", "OE", "oe", "endash", "emdash", "quotedblleft",
		"quotedblright", "quoteleft", "quoteright", "divide", "lozenge", "ydieresis", "Ydieresis", "fraction",
		"currency", "guilsinglleft", "guilsinglright", "fi", "fl", "daggerdbl", "periodcentered", "quotesinglbase",
		"quotedblbase", "perthousand", "Acircumflex", "Ecircumflex", "Aacute", "Edieresis", "Egrave", "Iacute",
		"Icircumflex", "Idieresis", "Igrave", "Oacute", "Ocircumflex", "apple", "Ograve", "Uacute", "Ucircumflex",
		"Ugrave", "dotlessi", "circumflex", "tilde", "macron", "breve", "dotaccent", "ring", "cedilla", "hungarumlaut",
		"ogonek", "caron", "Lslash", "lslash", "Scaron", "scaron", "Zcaron", "zcaron", "brokenbar", "Eth", "eth",
		"Yacute", "yacute", "Thorn", "thorn", "minus", "multiply", "onesuperior", "twosuperior", "threesuperior",
		"onehalf", "onequarter", "threequarters", "franc", "Gbreve", "gbreve", "Idotaccent", "Scedilla", "scedilla",
		"Cacute", "cacute", "Ccaron", "ccaron", "dcroat"
	];

function ve(e) {
	this.font = e
}

function be(e) {
	this.cmap = e
}

function xe(e, t) {
	this.encoding = e, this.charset = t
}

function Se(e) {
	switch (e.version) {
		case 1:
			this.names = ye.slice();
			break;
		case 2:
			this.names = new Array(e.numberOfGlyphs);
			for (let t = 0; t < e.numberOfGlyphs; t++) e.glyphNameIndex[t] < ye.length ? this.names[t] = ye[e
				.glyphNameIndex[t]] : this.names[t] = e.names[e.glyphNameIndex[t] - ye.length];
			break;
		case 2.5:
			this.names = new Array(e.numberOfGlyphs);
			for (let t = 0; t < e.numberOfGlyphs; t++) this.names[t] = ye[t + e.glyphNameIndex[t]];
			break;
		case 3:
		default:
			this.names = []
	}
}
ve.prototype.charToGlyphIndex = function(e) {
	const t = e.charCodeAt(0),
		n = this.font.glyphs;
	if (n)
		for (let e = 0; e < n.length; e += 1) {
			const o = n.get(e);
			for (let n = 0; n < o.unicodes.length; n += 1)
				if (o.unicodes[n] === t) return e
		}
	return null
}, be.prototype.charToGlyphIndex = function(e) {
	return this.cmap.glyphIndexMap[e.charCodeAt(0)] || 0
}, xe.prototype.charToGlyphIndex = function(e) {
	const t = e.charCodeAt(0),
		n = this.encoding[t];
	return this.charset.indexOf(n)
}, Se.prototype.nameToGlyphIndex = function(e) {
	return this.names.indexOf(e)
}, Se.prototype.glyphIndexToName = function(e) {
	return this.names[e]
};
var Ue = {
	line: function(e, t, n, o, r) {
		e.beginPath(), e.moveTo(t, n), e.lineTo(o, r), e.stroke()
	}
};

function Te(e, t, n, o, r) {
	let s;
	return (t & o) > 0 ? (s = e.parseByte(), 0 == (t & r) && (s = -s), s = n + s) : s = (t & r) > 0 ? n : n + e
		.parseShort(), s
}

function we(e, t, n) {
	const o = new pe.Parser(t, n);
	let r, s;
	if (e.numberOfContours = o.parseShort(), e._xMin = o.parseShort(), e._yMin = o.parseShort(), e._xMax = o
		.parseShort(), e._yMax = o.parseShort(), e.numberOfContours > 0) {
		const t = e.endPointIndices = [];
		for (let n = 0; n < e.numberOfContours; n += 1) t.push(o.parseUShort());
		e.instructionLength = o.parseUShort(), e.instructions = [];
		for (let t = 0; t < e.instructionLength; t += 1) e.instructions.push(o.parseByte());
		const n = t[t.length - 1] + 1;
		r = [];
		for (let e = 0; e < n; e += 1)
			if (s = o.parseByte(), r.push(s), (8 & s) > 0) {
				const t = o.parseByte();
				for (let n = 0; n < t; n += 1) r.push(s), e += 1
			} if (G.argument(r.length === n, "Bad flags."), t.length > 0) {
			const a = [];
			let i;
			if (n > 0) {
				for (let e = 0; e < n; e += 1) s = r[e], i = {}, i.onCurve = !!(1 & s), i.lastPointOfContour = t
					.indexOf(e) >= 0, a.push(i);
				let e = 0;
				for (let t = 0; t < n; t += 1) s = r[t], i = a[t], i.x = Te(o, s, e, 2, 16), e = i.x;
				let l = 0;
				for (let e = 0; e < n; e += 1) s = r[e], i = a[e], i.y = Te(o, s, l, 4, 32), l = i.y
			}
			e.points = a
		} else e.points = []
	} else if (0 === e.numberOfContours) e.points = [];
	else {
		e.isComposite = !0, e.points = [], e.components = [];
		let t = !0;
		for (; t;) {
			r = o.parseUShort();
			const n = {
				glyphIndex: o.parseUShort(),
				xScale: 1,
				scale01: 0,
				scale10: 0,
				yScale: 1,
				dx: 0,
				dy: 0
			};
			(1 & r) > 0 ? (2 & r) > 0 ? (n.dx = o.parseShort(), n.dy = o.parseShort()) : n.matchedPoints = [o
					.parseUShort(), o.parseUShort()
				] : (2 & r) > 0 ? (n.dx = o.parseChar(), n.dy = o.parseChar()) : n.matchedPoints = [o.parseByte(), o
					.parseByte()
				], (8 & r) > 0 ? n.xScale = n.yScale = o.parseF2Dot14() : (64 & r) > 0 ? (n.xScale = o.parseF2Dot14(), n
					.yScale = o.parseF2Dot14()) : (128 & r) > 0 && (n.xScale = o.parseF2Dot14(), n.scale01 = o
					.parseF2Dot14(), n.scale10 = o.parseF2Dot14(), n.yScale = o.parseF2Dot14()), e.components.push(n),
				t = !!(32 & r)
		}
		if (256 & r) {
			e.instructionLength = o.parseUShort(), e.instructions = [];
			for (let t = 0; t < e.instructionLength; t += 1) e.instructions.push(o.parseByte())
		}
	}
}

function Ee(e, t) {
	const n = [];
	for (let o = 0; o < e.length; o += 1) {
		const r = e[o],
			s = {
				x: t.xScale * r.x + t.scale01 * r.y + t.dx,
				y: t.scale10 * r.x + t.yScale * r.y + t.dy,
				onCurve: r.onCurve,
				lastPointOfContour: r.lastPointOfContour
			};
		n.push(s)
	}
	return n
}

function Oe(e) {
	const t = new I;
	if (!e) return t;
	const n = function(e) {
		const t = [];
		let n = [];
		for (let o = 0; o < e.length; o += 1) {
			const r = e[o];
			n.push(r), r.lastPointOfContour && (t.push(n), n = [])
		}
		return G.argument(0 === n.length, "There are still points left in the current contour."), t
	}(e);
	for (let e = 0; e < n.length; ++e) {
		const o = n[e];
		let r = null,
			s = o[o.length - 1],
			a = o[0];
		if (s.onCurve) t.moveTo(s.x, s.y);
		else if (a.onCurve) t.moveTo(a.x, a.y);
		else {
			const e = {
				x: .5 * (s.x + a.x),
				y: .5 * (s.y + a.y)
			};
			t.moveTo(e.x, e.y)
		}
		for (let e = 0; e < o.length; ++e)
			if (r = s, s = a, a = o[(e + 1) % o.length], s.onCurve) t.lineTo(s.x, s.y);
			else {
				let e = r,
					n = a;
				r.onCurve || (e = {
					x: .5 * (s.x + r.x),
					y: .5 * (s.y + r.y)
				}, t.lineTo(e.x, e.y)), a.onCurve || (n = {
					x: .5 * (s.x + a.x),
					y: .5 * (s.y + a.y)
				}), t.lineTo(e.x, e.y), t.quadraticCurveTo(s.x, s.y, n.x, n.y)
			} t.closePath()
	}
	return t
}

function Le(e, t) {
	if (t.isComposite)
		for (let n = 0; n < t.components.length; n += 1) {
			const o = t.components[n],
				r = e.get(o.glyphIndex);
			if (r.getPath(), r.points) {
				let e;
				if (void 0 === o.matchedPoints) e = Ee(r.points, o);
				else {
					if (o.matchedPoints[0] > t.points.length - 1 || o.matchedPoints[1] > r.points.length - 1)
					throw Error("Matched points out of range in " + t.name);
					const n = t.points[o.matchedPoints[0]];
					let s = r.points[o.matchedPoints[1]];
					const a = {
						xScale: o.xScale,
						scale01: o.scale01,
						scale10: o.scale10,
						yScale: o.yScale,
						dx: 0,
						dy: 0
					};
					s = Ee([s], a)[0], a.dx = n.x - s.x, a.dy = n.y - s.y, e = Ee(r.points, a)
				}
				t.points = t.points.concat(e)
			}
		}
	return Oe(t.points)
}
var ke = {
	getPath: Oe,
	parse: function(e, t, n, o) {
		const r = new Me.GlyphSet(o);
		for (let s = 0; s < n.length - 1; s += 1) {
			const a = n[s];
			a !== n[s + 1] ? r.push(s, Me.ttfGlyphLoader(o, s, we, e, t + a, Le)) : r.push(s, Me.glyphLoader(o,
				s))
		}
		return r
	}
};

function Re(e) {
	this.bindConstructorValues(e)
}

function De(e, t, n) {
	Object.defineProperty(e, t, {
		get: function() {
			return e.path, e[n]
		},
		set: function(t) {
			e[n] = t
		},
		enumerable: !0,
		configurable: !0
	})
}

function Ce(e, t) {
	if (this.font = e, this.glyphs = {}, Array.isArray(t))
		for (let e = 0; e < t.length; e++) this.glyphs[e] = t[e];
	this.length = t && t.length || 0
}
Re.prototype.bindConstructorValues = function(e) {
	this.index = e.index || 0, this.name = e.name || null, this.unicode = e.unicode || void 0, this.unicodes = e
		.unicodes || void 0 !== e.unicode ? [e.unicode] : [], e.xMin && (this.xMin = e.xMin), e.yMin && (this.yMin =
			e.yMin), e.xMax && (this.xMax = e.xMax), e.yMax && (this.yMax = e.yMax), e.advanceWidth && (this
			.advanceWidth = e.advanceWidth), Object.defineProperty(this, "path", function(e, t) {
			let n = t || {
				commands: []
			};
			return {
				configurable: !0,
				get: function() {
					return "function" == typeof n && (n = n()), n
				},
				set: function(e) {
					n = e
				}
			}
		}(0, e.path))
}, Re.prototype.addUnicode = function(e) {
	0 === this.unicodes.length && (this.unicode = e), this.unicodes.push(e)
}, Re.prototype.getBoundingBox = function() {
	return this.path.getBoundingBox()
}, Re.prototype.getPath = function(e, t, n, o, r) {
	let s, a;
	e = void 0 !== e ? e : 0, t = void 0 !== t ? t : 0, n = void 0 !== n ? n : 72, o || (o = {});
	let i = o.xScale,
		l = o.yScale;
	if (o.hinting && r && r.hinting && (a = this.path && r.hinting.exec(this, n)), a) s = ke.getPath(a).commands,
		e = Math.round(e), t = Math.round(t), i = l = 1;
	else {
		s = this.path.commands;
		const e = 1 / this.path.unitsPerEm * n;
		void 0 === i && (i = e), void 0 === l && (l = e)
	}
	const c = new I;
	for (let n = 0; n < s.length; n += 1) {
		const o = s[n];
		"M" === o.type ? c.moveTo(e + o.x * i, t + -o.y * l) : "L" === o.type ? c.lineTo(e + o.x * i, t + -o.y *
			l) : "Q" === o.type ? c.quadraticCurveTo(e + o.x1 * i, t + -o.y1 * l, e + o.x * i, t + -o.y * l) :
			"C" === o.type ? c.curveTo(e + o.x1 * i, t + -o.y1 * l, e + o.x2 * i, t + -o.y2 * l, e + o.x * i, t + -o
				.y * l) : "Z" === o.type && c.closePath()
	}
	return c
}, Re.prototype.getContours = function() {
	if (void 0 === this.points) return [];
	const e = [];
	let t = [];
	for (let n = 0; n < this.points.length; n += 1) {
		const o = this.points[n];
		t.push(o), o.lastPointOfContour && (e.push(t), t = [])
	}
	return G.argument(0 === t.length, "There are still points left in the current contour."), e
}, Re.prototype.getMetrics = function() {
	const e = this.path.commands,
		t = [],
		n = [];
	for (let o = 0; o < e.length; o += 1) {
		const r = e[o];
		"Z" !== r.type && (t.push(r.x), n.push(r.y)), "Q" !== r.type && "C" !== r.type || (t.push(r.x1), n.push(r
			.y1)), "C" === r.type && (t.push(r.x2), n.push(r.y2))
	}
	const o = {
		xMin: Math.min.apply(null, t),
		yMin: Math.min.apply(null, n),
		xMax: Math.max.apply(null, t),
		yMax: Math.max.apply(null, n),
		leftSideBearing: this.leftSideBearing
	};
	return isFinite(o.xMin) || (o.xMin = 0), isFinite(o.xMax) || (o.xMax = this.advanceWidth), isFinite(o.yMin) || (
			o.yMin = 0), isFinite(o.yMax) || (o.yMax = 0), o.rightSideBearing = this.advanceWidth - o
		.leftSideBearing - (o.xMax - o.xMin), o
}, Re.prototype.draw = function(e, t, n, o, r) {
	this.getPath(t, n, o, r).draw(e)
}, Re.prototype.drawPoints = function(e, t, n, o) {
	function r(t, n, o, r) {
		const s = 2 * Math.PI;
		e.beginPath();
		for (let a = 0; a < t.length; a += 1) e.moveTo(n + t[a].x * r, o + t[a].y * r), e.arc(n + t[a].x * r, o + t[
			a].y * r, 2, 0, s, !1);
		e.closePath(), e.fill()
	}
	t = void 0 !== t ? t : 0, n = void 0 !== n ? n : 0, o = void 0 !== o ? o : 24;
	const s = 1 / this.path.unitsPerEm * o,
		a = [],
		i = [],
		l = this.path;
	for (let e = 0; e < l.commands.length; e += 1) {
		const t = l.commands[e];
		void 0 !== t.x && a.push({
			x: t.x,
			y: -t.y
		}), void 0 !== t.x1 && i.push({
			x: t.x1,
			y: -t.y1
		}), void 0 !== t.x2 && i.push({
			x: t.x2,
			y: -t.y2
		})
	}
	e.fillStyle = "blue", r(a, t, n, s), e.fillStyle = "red", r(i, t, n, s)
}, Re.prototype.drawMetrics = function(e, t, n, o) {
	let r;
	t = void 0 !== t ? t : 0, n = void 0 !== n ? n : 0, o = void 0 !== o ? o : 24, r = 1 / this.path.unitsPerEm * o,
		e.lineWidth = 1, e.strokeStyle = "black", Ue.line(e, t, -1e4, t, 1e4), Ue.line(e, -1e4, n, 1e4, n);
	const s = this.xMin || 0;
	let a = this.yMin || 0;
	const i = this.xMax || 0;
	let l = this.yMax || 0;
	const c = this.advanceWidth || 0;
	e.strokeStyle = "blue", Ue.line(e, t + s * r, -1e4, t + s * r, 1e4), Ue.line(e, t + i * r, -1e4, t + i * r,
		1e4), Ue.line(e, -1e4, n + -a * r, 1e4, n + -a * r), Ue.line(e, -1e4, n + -l * r, 1e4, n + -l * r), e
		.strokeStyle = "green", Ue.line(e, t + c * r, -1e4, t + c * r, 1e4)
}, Ce.prototype.get = function(e) {
	return "function" == typeof this.glyphs[e] && (this.glyphs[e] = this.glyphs[e]()), this.glyphs[e]
}, Ce.prototype.push = function(e, t) {
	this.glyphs[e] = t, this.length++
};
var Me = {
	GlyphSet: Ce,
	glyphLoader: function(e, t) {
		return new Re({
			index: t,
			font: e
		})
	},
	ttfGlyphLoader: function(e, t, n, o, r, s) {
		return function() {
			const a = new Re({
				index: t,
				font: e
			});
			return a.path = function() {
				n(a, o, r);
				const t = s(e.glyphs, a);
				return t.unitsPerEm = e.unitsPerEm, t
			}, De(a, "xMin", "_xMin"), De(a, "xMax", "_xMax"), De(a, "yMin", "_yMin"), De(a, "yMax",
				"_yMax"), a
		}
	},
	cffGlyphLoader: function(e, t, n, o) {
		return function() {
			const r = new Re({
				index: t,
				font: e
			});
			return r.path = function() {
				const t = n(e, r, o);
				return t.unitsPerEm = e.unitsPerEm, t
			}, r
		}
	}
};

function Ie(e, t) {
	if (e === t) return !0;
	if (Array.isArray(e) && Array.isArray(t)) {
		if (e.length !== t.length) return !1;
		for (let n = 0; n < e.length; n += 1)
			if (!Ie(e[n], t[n])) return !1;
		return !0
	}
	return !1
}

function Be(e) {
	let t;
	return t = e.length < 1240 ? 107 : e.length < 33900 ? 1131 : 32768, t
}

function Ne(e, t, n) {
	const o = [],
		r = [],
		s = pe.getCard16(e, t);
	let a, i;
	if (0 !== s) {
		const n = pe.getByte(e, t + 2);
		a = t + (s + 1) * n + 2;
		let r = t + 3;
		for (let t = 0; t < s + 1; t += 1) o.push(pe.getOffset(e, r, n)), r += n;
		i = a + o[s]
	} else i = t + 2;
	for (let t = 0; t < o.length - 1; t += 1) {
		let s = pe.getBytes(e, a + o[t], a + o[t + 1]);
		n && (s = n(s)), r.push(s)
	}
	return {
		objects: r,
		startOffset: t,
		endOffset: i
	}
}

function Ge(e, t) {
	let n, o, r, s;
	if (28 === t) return n = e.parseByte(), o = e.parseByte(), n << 8 | o;
	if (29 === t) return n = e.parseByte(), o = e.parseByte(), r = e.parseByte(), s = e.parseByte(), n << 24 | o << 16 |
		r << 8 | s;
	if (30 === t) return function(e) {
		let t = "";
		const n = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "E", "E-", null, "-"];
		for (;;) {
			const o = e.parseByte(),
				r = o >> 4,
				s = 15 & o;
			if (15 === r) break;
			if (t += n[r], 15 === s) break;
			t += n[s]
		}
		return parseFloat(t)
	}(e);
	if (t >= 32 && t <= 246) return t - 139;
	if (t >= 247 && t <= 250) return n = e.parseByte(), 256 * (t - 247) + n + 108;
	if (t >= 251 && t <= 254) return n = e.parseByte(), 256 * -(t - 251) - n - 108;
	throw new Error("Invalid b0 " + t)
}

function Pe(e, t, n) {
	t = void 0 !== t ? t : 0;
	const o = new pe.Parser(e, t),
		r = [];
	let s = [];
	for (n = void 0 !== n ? n : e.length; o.relativeOffset < n;) {
		let e = o.parseByte();
		e <= 21 ? (12 === e && (e = 1200 + o.parseByte()), r.push([e, s]), s = []) : s.push(Ge(o, e))
	}
	return function(e) {
		const t = {};
		for (let n = 0; n < e.length; n += 1) {
			const o = e[n][0],
				r = e[n][1];
			let s;
			if (s = 1 === r.length ? r[0] : r, t.hasOwnProperty(o) && !isNaN(t[o])) throw new Error("Object " + t +
				" already has key " + o);
			t[o] = s
		}
		return t
	}(r)
}

function Ae(e, t) {
	return t = t <= 390 ? de[t] : e[t - 391]
}

function Fe(e, t, n) {
	const o = {};
	let r;
	for (let s = 0; s < t.length; s += 1) {
		const a = t[s];
		if (Array.isArray(a.type)) {
			const t = [];
			t.length = a.type.length;
			for (let o = 0; o < a.type.length; o++) r = void 0 !== e[a.op] ? e[a.op][o] : void 0, void 0 === r && (r =
				void 0 !== a.value && void 0 !== a.value[o] ? a.value[o] : null), "SID" === a.type[o] && (r = Ae(n,
				r)), t[o] = r;
			o[a.name] = t
		} else r = e[a.op], void 0 === r && (r = void 0 !== a.value ? a.value : null), "SID" === a.type && (r = Ae(n,
			r)), o[a.name] = r
	}
	return o
}
const He = [{
		name: "version",
		op: 0,
		type: "SID"
	}, {
		name: "notice",
		op: 1,
		type: "SID"
	}, {
		name: "copyright",
		op: 1200,
		type: "SID"
	}, {
		name: "fullName",
		op: 2,
		type: "SID"
	}, {
		name: "familyName",
		op: 3,
		type: "SID"
	}, {
		name: "weight",
		op: 4,
		type: "SID"
	}, {
		name: "isFixedPitch",
		op: 1201,
		type: "number",
		value: 0
	}, {
		name: "italicAngle",
		op: 1202,
		type: "number",
		value: 0
	}, {
		name: "underlinePosition",
		op: 1203,
		type: "number",
		value: -100
	}, {
		name: "underlineThickness",
		op: 1204,
		type: "number",
		value: 50
	}, {
		name: "paintType",
		op: 1205,
		type: "number",
		value: 0
	}, {
		name: "charstringType",
		op: 1206,
		type: "number",
		value: 2
	}, {
		name: "fontMatrix",
		op: 1207,
		type: ["real", "real", "real", "real", "real", "real"],
		value: [.001, 0, 0, .001, 0, 0]
	}, {
		name: "uniqueId",
		op: 13,
		type: "number"
	}, {
		name: "fontBBox",
		op: 5,
		type: ["number", "number", "number", "number"],
		value: [0, 0, 0, 0]
	}, {
		name: "strokeWidth",
		op: 1208,
		type: "number",
		value: 0
	}, {
		name: "xuid",
		op: 14,
		type: [],
		value: null
	}, {
		name: "charset",
		op: 15,
		type: "offset",
		value: 0
	}, {
		name: "encoding",
		op: 16,
		type: "offset",
		value: 0
	}, {
		name: "charStrings",
		op: 17,
		type: "offset",
		value: 0
	}, {
		name: "private",
		op: 18,
		type: ["number", "offset"],
		value: [0, 0]
	}, {
		name: "ros",
		op: 1230,
		type: ["SID", "SID", "number"]
	}, {
		name: "cidFontVersion",
		op: 1231,
		type: "number",
		value: 0
	}, {
		name: "cidFontRevision",
		op: 1232,
		type: "number",
		value: 0
	}, {
		name: "cidFontType",
		op: 1233,
		type: "number",
		value: 0
	}, {
		name: "cidCount",
		op: 1234,
		type: "number",
		value: 8720
	}, {
		name: "uidBase",
		op: 1235,
		type: "number"
	}, {
		name: "fdArray",
		op: 1236,
		type: "offset"
	}, {
		name: "fdSelect",
		op: 1237,
		type: "offset"
	}, {
		name: "fontName",
		op: 1238,
		type: "SID"
	}],
	ze = [{
		name: "subrs",
		op: 19,
		type: "offset",
		value: 0
	}, {
		name: "defaultWidthX",
		op: 20,
		type: "number",
		value: 0
	}, {
		name: "nominalWidthX",
		op: 21,
		type: "number",
		value: 0
	}];

function We(e, t) {
	return Fe(Pe(e, 0, e.byteLength), He, t)
}

function _e(e, t, n, o) {
	return Fe(Pe(e, t, n), ze, o)
}

function qe(e, t, n, o) {
	const r = [];
	for (let s = 0; s < n.length; s += 1) {
		const a = We(new DataView(new Uint8Array(n[s]).buffer), o);
		a._subrs = [], a._subrsBias = 0;
		const i = a.private[0],
			l = a.private[1];
		if (0 !== i && 0 !== l) {
			const n = _e(e, l + t, i, o);
			if (a._defaultWidthX = n.defaultWidthX, a._nominalWidthX = n.nominalWidthX, 0 !== n.subrs) {
				const o = Ne(e, l + n.subrs + t);
				a._subrs = o.objects, a._subrsBias = Be(a._subrs)
			}
			a._privateDict = n
		}
		r.push(a)
	}
	return r
}

function Xe(e, t, n) {
	let o, r, s, a;
	const i = new I,
		l = [];
	let c, u, p, h, f = 0,
		d = !1,
		g = !1,
		m = 0,
		y = 0;
	if (e.isCIDFont) {
		const n = e.tables.cff.topDict._fdSelect[t.index],
			o = e.tables.cff.topDict._fdArray[n];
		c = o._subrs, u = o._subrsBias, p = o._defaultWidthX, h = o._nominalWidthX
	} else c = e.tables.cff.topDict._subrs, u = e.tables.cff.topDict._subrsBias, p = e.tables.cff.topDict
		._defaultWidthX, h = e.tables.cff.topDict._nominalWidthX;
	let v = p;

	function b(e, t) {
		g && i.closePath(), i.moveTo(e, t), g = !0
	}

	function x() {
		let e;
		e = l.length % 2 != 0, e && !d && (v = l.shift() + h), f += l.length >> 1, l.length = 0, d = !0
	}
	return function n(p) {
		let S, U, T, w, E, O, L, k, R, D, C, M, I = 0;
		for (; I < p.length;) {
			let B = p[I];
			switch (I += 1, B) {
				case 1:
				case 3:
					x();
					break;
				case 4:
					l.length > 1 && !d && (v = l.shift() + h, d = !0), y += l.pop(), b(m, y);
					break;
				case 5:
					for (; l.length > 0;) m += l.shift(), y += l.shift(), i.lineTo(m, y);
					break;
				case 6:
					for (; l.length > 0 && (m += l.shift(), i.lineTo(m, y), 0 !== l.length);) y += l.shift(), i
						.lineTo(m, y);
					break;
				case 7:
					for (; l.length > 0 && (y += l.shift(), i.lineTo(m, y), 0 !== l.length);) m += l.shift(), i
						.lineTo(m, y);
					break;
				case 8:
					for (; l.length > 0;) o = m + l.shift(), r = y + l.shift(), s = o + l.shift(), a = r + l
					.shift(), m = s + l.shift(), y = a + l.shift(), i.curveTo(o, r, s, a, m, y);
					break;
				case 10:
					E = l.pop() + u, O = c[E], O && n(O);
					break;
				case 11:
					return;
				case 12:
					switch (B = p[I], I += 1, B) {
						case 35:
							o = m + l.shift(), r = y + l.shift(), s = o + l.shift(), a = r + l.shift(), L = s + l
								.shift(), k = a + l.shift(), R = L + l.shift(), D = k + l.shift(), C = R + l
							.shift(), M = D + l.shift(), m = C + l.shift(), y = M + l.shift(), l.shift(), i.curveTo(
									o, r, s, a, L, k), i.curveTo(R, D, C, M, m, y);
							break;
						case 34:
							o = m + l.shift(), r = y, s = o + l.shift(), a = r + l.shift(), L = s + l.shift(), k =
								a, R = L + l.shift(), D = a, C = R + l.shift(), M = y, m = C + l.shift(), i.curveTo(
									o, r, s, a, L, k), i.curveTo(R, D, C, M, m, y);
							break;
						case 36:
							o = m + l.shift(), r = y + l.shift(), s = o + l.shift(), a = r + l.shift(), L = s + l
								.shift(), k = a, R = L + l.shift(), D = a, C = R + l.shift(), M = D + l.shift(), m =
								C + l.shift(), i.curveTo(o, r, s, a, L, k), i.curveTo(R, D, C, M, m, y);
							break;
						case 37:
							o = m + l.shift(), r = y + l.shift(), s = o + l.shift(), a = r + l.shift(), L = s + l
								.shift(), k = a + l.shift(), R = L + l.shift(), D = k + l.shift(), C = R + l
							.shift(), M = D + l.shift(), Math.abs(C - m) > Math.abs(M - y) ? m = C + l.shift() : y =
								M + l.shift(), i.curveTo(o, r, s, a, L, k), i.curveTo(R, D, C, M, m, y);
							break;
						default:
							console.log("Glyph " + t.index + ": unknown operator 1200" + B), l.length = 0
					}
					break;
				case 14:
					l.length > 0 && !d && (v = l.shift() + h, d = !0), g && (i.closePath(), g = !1);
					break;
				case 18:
					x();
					break;
				case 19:
				case 20:
					x(), I += f + 7 >> 3;
					break;
				case 21:
					l.length > 2 && !d && (v = l.shift() + h, d = !0), y += l.pop(), m += l.pop(), b(m, y);
					break;
				case 22:
					l.length > 1 && !d && (v = l.shift() + h, d = !0), m += l.pop(), b(m, y);
					break;
				case 23:
					x();
					break;
				case 24:
					for (; l.length > 2;) o = m + l.shift(), r = y + l.shift(), s = o + l.shift(), a = r + l
					.shift(), m = s + l.shift(), y = a + l.shift(), i.curveTo(o, r, s, a, m, y);
					m += l.shift(), y += l.shift(), i.lineTo(m, y);
					break;
				case 25:
					for (; l.length > 6;) m += l.shift(), y += l.shift(), i.lineTo(m, y);
					o = m + l.shift(), r = y + l.shift(), s = o + l.shift(), a = r + l.shift(), m = s + l.shift(),
						y = a + l.shift(), i.curveTo(o, r, s, a, m, y);
					break;
				case 26:
					for (l.length % 2 && (m += l.shift()); l.length > 0;) o = m, r = y + l.shift(), s = o + l
					.shift(), a = r + l.shift(), m = s, y = a + l.shift(), i.curveTo(o, r, s, a, m, y);
					break;
				case 27:
					for (l.length % 2 && (y += l.shift()); l.length > 0;) o = m + l.shift(), r = y, s = o + l
					.shift(), a = r + l.shift(), m = s + l.shift(), y = a, i.curveTo(o, r, s, a, m, y);
					break;
				case 28:
					S = p[I], U = p[I + 1], l.push((S << 24 | U << 16) >> 16), I += 2;
					break;
				case 29:
					E = l.pop() + e.gsubrsBias, O = e.gsubrs[E], O && n(O);
					break;
				case 30:
					for (; l.length > 0 && (o = m, r = y + l.shift(), s = o + l.shift(), a = r + l.shift(), m = s +
							l.shift(), y = a + (1 === l.length ? l.shift() : 0), i.curveTo(o, r, s, a, m, y), 0 !==
							l.length);) o = m + l.shift(), r = y, s = o + l.shift(), a = r + l.shift(), y = a + l
						.shift(), m = s + (1 === l.length ? l.shift() : 0), i.curveTo(o, r, s, a, m, y);
					break;
				case 31:
					for (; l.length > 0 && (o = m + l.shift(), r = y, s = o + l.shift(), a = r + l.shift(), y = a +
							l.shift(), m = s + (1 === l.length ? l.shift() : 0), i.curveTo(o, r, s, a, m, y), 0 !==
							l.length);) o = m, r = y + l.shift(), s = o + l.shift(), a = r + l.shift(), m = s + l
						.shift(), y = a + (1 === l.length ? l.shift() : 0), i.curveTo(o, r, s, a, m, y);
					break;
				default:
					B < 32 ? console.log("Glyph " + t.index + ": unknown operator " + B) : B < 247 ? l.push(B -
						139) : B < 251 ? (S = p[I], I += 1, l.push(256 * (B - 247) + S + 108)) : B < 255 ? (S = p[
							I], I += 1, l.push(256 * -(B - 251) - S - 108)) : (S = p[I], U = p[I + 1], T = p[I + 2],
							w = p[I + 3], I += 4, l.push((S << 24 | U << 16 | T << 8 | w) / 65536))
			}
		}
	}(n), t.advanceWidth = v, i
}

function Ve(e, t) {
	let n, o = de.indexOf(e);
	return o >= 0 && (n = o), o = t.indexOf(e), o >= 0 ? n = o + de.length : (n = de.length + t.length, t.push(e)), n
}

function je(e, t, n) {
	const o = {};
	for (let r = 0; r < e.length; r += 1) {
		const s = e[r];
		let a = t[s.name];
		void 0 === a || Ie(a, s.value) || ("SID" === s.type && (a = Ve(a, n)), o[s.op] = {
			name: s.name,
			type: s.type,
			value: a
		})
	}
	return o
}

function Ye(e, t) {
	const n = new oe.Record("Top DICT", [{
		name: "dict",
		type: "DICT",
		value: {}
	}]);
	return n.dict = je(He, e, t), n
}

function Ze(e) {
	const t = new oe.Record("Top DICT INDEX", [{
		name: "topDicts",
		type: "INDEX",
		value: []
	}]);
	return t.topDicts = [{
		name: "topDict_0",
		type: "TABLE",
		value: e
	}], t
}

function $e(e) {
	const t = [],
		n = e.path;
	t.push({
		name: "width",
		type: "NUMBER",
		value: e.advanceWidth
	});
	let o = 0,
		r = 0;
	for (let e = 0; e < n.commands.length; e += 1) {
		let s, a, i = n.commands[e];
		if ("Q" === i.type) {
			const e = 1 / 3,
				t = 2 / 3;
			i = {
				type: "C",
				x: i.x,
				y: i.y,
				x1: e * o + t * i.x1,
				y1: e * r + t * i.y1,
				x2: e * i.x + t * i.x1,
				y2: e * i.y + t * i.y1
			}
		}
		if ("M" === i.type) s = Math.round(i.x - o), a = Math.round(i.y - r), t.push({
			name: "dx",
			type: "NUMBER",
			value: s
		}), t.push({
			name: "dy",
			type: "NUMBER",
			value: a
		}), t.push({
			name: "rmoveto",
			type: "OP",
			value: 21
		}), o = Math.round(i.x), r = Math.round(i.y);
		else if ("L" === i.type) s = Math.round(i.x - o), a = Math.round(i.y - r), t.push({
			name: "dx",
			type: "NUMBER",
			value: s
		}), t.push({
			name: "dy",
			type: "NUMBER",
			value: a
		}), t.push({
			name: "rlineto",
			type: "OP",
			value: 5
		}), o = Math.round(i.x), r = Math.round(i.y);
		else if ("C" === i.type) {
			const e = Math.round(i.x1 - o),
				n = Math.round(i.y1 - r),
				l = Math.round(i.x2 - i.x1),
				c = Math.round(i.y2 - i.y1);
			s = Math.round(i.x - i.x2), a = Math.round(i.y - i.y2), t.push({
				name: "dx1",
				type: "NUMBER",
				value: e
			}), t.push({
				name: "dy1",
				type: "NUMBER",
				value: n
			}), t.push({
				name: "dx2",
				type: "NUMBER",
				value: l
			}), t.push({
				name: "dy2",
				type: "NUMBER",
				value: c
			}), t.push({
				name: "dx",
				type: "NUMBER",
				value: s
			}), t.push({
				name: "dy",
				type: "NUMBER",
				value: a
			}), t.push({
				name: "rrcurveto",
				type: "OP",
				value: 8
			}), o = Math.round(i.x), r = Math.round(i.y)
		}
	}
	return t.push({
		name: "endchar",
		type: "OP",
		value: 14
	}), t
}
var Qe = {
	parse: function(e, t, n) {
		n.tables.cff = {};
		const o = Ne(e, function(e, t) {
				const n = {};
				return n.formatMajor = pe.getCard8(e, t), n.formatMinor = pe.getCard8(e, t + 1), n.size = pe
					.getCard8(e, t + 2), n.offsetSize = pe.getCard8(e, t + 3), n.startOffset = t, n
					.endOffset = t + 4, n
			}(e, t).endOffset, pe.bytesToString),
			r = Ne(e, o.endOffset),
			s = Ne(e, r.endOffset, pe.bytesToString),
			a = Ne(e, s.endOffset);
		n.gsubrs = a.objects, n.gsubrsBias = Be(n.gsubrs);
		const i = qe(e, t, r.objects, s.objects);
		if (1 !== i.length) throw new Error(
			"CFF table has too many fonts in 'FontSet' - count of fonts NameIndex.length = " + i.length);
		const l = i[0];
		if (n.tables.cff.topDict = l, l._privateDict && (n.defaultWidthX = l._privateDict.defaultWidthX, n
				.nominalWidthX = l._privateDict.nominalWidthX), void 0 !== l.ros[0] && void 0 !== l.ros[1] && (n
				.isCIDFont = !0), n.isCIDFont) {
			let o = l.fdArray,
				r = l.fdSelect;
			if (0 === o || 0 === r) throw new Error(
				"Font is marked as a CID font, but FDArray and/or FDSelect information is missing");
			o += t;
			const a = qe(e, t, Ne(e, o).objects, s.objects);
			l._fdArray = a, r += t, l._fdSelect = function(e, t, n, o) {
				const r = [];
				let s;
				const a = new pe.Parser(e, t),
					i = a.parseCard8();
				if (0 === i)
					for (let e = 0; e < n; e++) {
						if (s = a.parseCard8(), s >= o) throw new Error(
							"CFF table CID Font FDSelect has bad FD index value " + s +
							" (FD count " + o + ")");
						r.push(s)
					} else {
						if (3 !== i) throw new Error(
							"CFF Table CID Font FDSelect table has unsupported format " + i); {
							const e = a.parseCard16();
							let t, i = a.parseCard16();
							if (0 !== i) throw new Error(
								"CFF Table CID Font FDSelect format 3 range has bad initial GID " +
								i);
							for (let l = 0; l < e; l++) {
								if (s = a.parseCard8(), t = a.parseCard16(), s >= o) throw new Error(
									"CFF table CID Font FDSelect has bad FD index value " + s +
									" (FD count " + o + ")");
								if (t > n) throw new Error(
									"CFF Table CID Font FDSelect format 3 range has bad GID " + t);
								for (; i < t; i++) r.push(s);
								i = t
							}
							if (t !== n) throw new Error(
								"CFF Table CID Font FDSelect format 3 range has bad final GID " + t)
						}
					}
				return r
			}(e, r, n.numGlyphs, a.length)
		}
		const c = t + l.private[1],
			u = _e(e, c, l.private[0], s.objects);
		if (n.defaultWidthX = u.defaultWidthX, n.nominalWidthX = u.nominalWidthX, 0 !== u.subrs) {
			const t = Ne(e, c + u.subrs);
			n.subrs = t.objects, n.subrsBias = Be(n.subrs)
		} else n.subrs = [], n.subrsBias = 0;
		const p = Ne(e, t + l.charStrings);
		n.nGlyphs = p.objects.length;
		const h = function(e, t, n, o) {
			let r, s;
			const a = new pe.Parser(e, t);
			n -= 1;
			const i = [".notdef"],
				l = a.parseCard8();
			if (0 === l)
				for (let e = 0; e < n; e += 1) r = a.parseSID(), i.push(Ae(o, r));
			else if (1 === l)
				for (; i.length <= n;) {
					r = a.parseSID(), s = a.parseCard8();
					for (let e = 0; e <= s; e += 1) i.push(Ae(o, r)), r += 1
				} else {
					if (2 !== l) throw new Error("Unknown charset format " + l);
					for (; i.length <= n;) {
						r = a.parseSID(), s = a.parseCard16();
						for (let e = 0; e <= s; e += 1) i.push(Ae(o, r)), r += 1
					}
				}
			return i
		}(e, t + l.charset, n.nGlyphs, s.objects);
		0 === l.encoding ? n.cffEncoding = new xe(ge, h) : 1 === l.encoding ? n.cffEncoding = new xe(me, h) : n
			.cffEncoding = function(e, t, n) {
				let o;
				const r = {},
					s = new pe.Parser(e, t),
					a = s.parseCard8();
				if (0 === a) {
					const e = s.parseCard8();
					for (let t = 0; t < e; t += 1) o = s.parseCard8(), r[o] = t
				} else {
					if (1 !== a) throw new Error("Unknown encoding format " + a); {
						const e = s.parseCard8();
						o = 1;
						for (let t = 0; t < e; t += 1) {
							const e = s.parseCard8(),
								t = s.parseCard8();
							for (let n = e; n <= e + t; n += 1) r[n] = o, o += 1
						}
					}
				}
				return new xe(r, n)
			}(e, t + l.encoding, h), n.encoding = n.encoding || n.cffEncoding, n.glyphs = new Me.GlyphSet(n);
		for (let e = 0; e < n.nGlyphs; e += 1) {
			const t = p.objects[e];
			n.glyphs.push(e, Me.cffGlyphLoader(n, e, Xe, t))
		}
	},
	make: function(e, t) {
		const n = new oe.Table("CFF ", [{
				name: "header",
				type: "RECORD"
			}, {
				name: "nameIndex",
				type: "RECORD"
			}, {
				name: "topDictIndex",
				type: "RECORD"
			}, {
				name: "stringIndex",
				type: "RECORD"
			}, {
				name: "globalSubrIndex",
				type: "RECORD"
			}, {
				name: "charsets",
				type: "RECORD"
			}, {
				name: "charStringsIndex",
				type: "RECORD"
			}, {
				name: "privateDict",
				type: "RECORD"
			}]),
			o = 1 / t.unitsPerEm,
			r = {
				version: t.version,
				fullName: t.fullName,
				familyName: t.familyName,
				weight: t.weightName,
				fontBBox: t.fontBBox || [0, 0, 0, 0],
				fontMatrix: [o, 0, 0, o, 0, 0],
				charset: 999,
				encoding: 0,
				charStrings: 999,
				private: [0, 999]
			},
			s = [];
		let a;
		for (let t = 1; t < e.length; t += 1) a = e.get(t), s.push(a.name);
		const i = [];
		n.header = new oe.Record("Header", [{
			name: "major",
			type: "Card8",
			value: 1
		}, {
			name: "minor",
			type: "Card8",
			value: 0
		}, {
			name: "hdrSize",
			type: "Card8",
			value: 4
		}, {
			name: "major",
			type: "Card8",
			value: 1
		}]), n.nameIndex = function(e) {
			const t = new oe.Record("Name INDEX", [{
				name: "names",
				type: "INDEX",
				value: []
			}]);
			t.names = [];
			for (let n = 0; n < e.length; n += 1) t.names.push({
				name: "name_" + n,
				type: "NAME",
				value: e[n]
			});
			return t
		}([t.postScriptName]);
		let l = Ye(r, i);
		n.topDictIndex = Ze(l), n.globalSubrIndex = new oe.Record("Global Subr INDEX", [{
			name: "subrs",
			type: "INDEX",
			value: []
		}]), n.charsets = function(e, t) {
			const n = new oe.Record("Charsets", [{
				name: "format",
				type: "Card8",
				value: 0
			}]);
			for (let o = 0; o < e.length; o += 1) {
				const r = Ve(e[o], t);
				n.fields.push({
					name: "glyph_" + o,
					type: "SID",
					value: r
				})
			}
			return n
		}(s, i), n.charStringsIndex = function(e) {
			const t = new oe.Record("CharStrings INDEX", [{
				name: "charStrings",
				type: "INDEX",
				value: []
			}]);
			for (let n = 0; n < e.length; n += 1) {
				const o = e.get(n),
					r = $e(o);
				t.charStrings.push({
					name: o.name,
					type: "CHARSTRING",
					value: r
				})
			}
			return t
		}(e), n.privateDict = function(e, t) {
			const n = new oe.Record("Private DICT", [{
				name: "dict",
				type: "DICT",
				value: {}
			}]);
			return n.dict = je(ze, e, t), n
		}({}, i), n.stringIndex = function(e) {
			const t = new oe.Record("String INDEX", [{
				name: "strings",
				type: "INDEX",
				value: []
			}]);
			t.strings = [];
			for (let n = 0; n < e.length; n += 1) t.strings.push({
				name: "string_" + n,
				type: "STRING",
				value: e[n]
			});
			return t
		}(i);
		const c = n.header.sizeOf() + n.nameIndex.sizeOf() + n.topDictIndex.sizeOf() + n.stringIndex.sizeOf() +
			n.globalSubrIndex.sizeOf();
		return r.charset = c, r.encoding = 0, r.charStrings = r.charset + n.charsets.sizeOf(), r.private[1] = r
			.charStrings + n.charStringsIndex.sizeOf(), l = Ye(r, i), n.topDictIndex = Ze(l), n
	}
};
var Ke = {
	parse: function(e, t) {
		const n = {},
			o = new pe.Parser(e, t);
		return n.version = o.parseVersion(), n.fontRevision = Math.round(1e3 * o.parseFixed()) / 1e3, n
			.checkSumAdjustment = o.parseULong(), n.magicNumber = o.parseULong(), G.argument(1594834165 === n
				.magicNumber, "Font header has wrong magic number."), n.flags = o.parseUShort(), n.unitsPerEm =
			o.parseUShort(), n.created = o.parseLongDateTime(), n.modified = o.parseLongDateTime(), n.xMin = o
			.parseShort(), n.yMin = o.parseShort(), n.xMax = o.parseShort(), n.yMax = o.parseShort(), n
			.macStyle = o.parseUShort(), n.lowestRecPPEM = o.parseUShort(), n.fontDirectionHint = o
		.parseShort(), n.indexToLocFormat = o.parseShort(), n.glyphDataFormat = o.parseShort(), n
	},
	make: function(e) {
		const t = Math.round((new Date).getTime() / 1e3) + 2082844800;
		let n = t;
		return e.createdTimestamp && (n = e.createdTimestamp + 2082844800), new oe.Table("head", [{
			name: "version",
			type: "FIXED",
			value: 65536
		}, {
			name: "fontRevision",
			type: "FIXED",
			value: 65536
		}, {
			name: "checkSumAdjustment",
			type: "ULONG",
			value: 0
		}, {
			name: "magicNumber",
			type: "ULONG",
			value: 1594834165
		}, {
			name: "flags",
			type: "USHORT",
			value: 0
		}, {
			name: "unitsPerEm",
			type: "USHORT",
			value: 1e3
		}, {
			name: "created",
			type: "LONGDATETIME",
			value: n
		}, {
			name: "modified",
			type: "LONGDATETIME",
			value: t
		}, {
			name: "xMin",
			type: "SHORT",
			value: 0
		}, {
			name: "yMin",
			type: "SHORT",
			value: 0
		}, {
			name: "xMax",
			type: "SHORT",
			value: 0
		}, {
			name: "yMax",
			type: "SHORT",
			value: 0
		}, {
			name: "macStyle",
			type: "USHORT",
			value: 0
		}, {
			name: "lowestRecPPEM",
			type: "USHORT",
			value: 0
		}, {
			name: "fontDirectionHint",
			type: "SHORT",
			value: 2
		}, {
			name: "indexToLocFormat",
			type: "SHORT",
			value: 0
		}, {
			name: "glyphDataFormat",
			type: "SHORT",
			value: 0
		}], e)
	}
};
var Je = {
	parse: function(e, t) {
		const n = {},
			o = new pe.Parser(e, t);
		return n.version = o.parseVersion(), n.ascender = o.parseShort(), n.descender = o.parseShort(), n
			.lineGap = o.parseShort(), n.advanceWidthMax = o.parseUShort(), n.minLeftSideBearing = o
			.parseShort(), n.minRightSideBearing = o.parseShort(), n.xMaxExtent = o.parseShort(), n
			.caretSlopeRise = o.parseShort(), n.caretSlopeRun = o.parseShort(), n.caretOffset = o.parseShort(),
			o.relativeOffset += 8, n.metricDataFormat = o.parseShort(), n.numberOfHMetrics = o.parseUShort(), n
	},
	make: function(e) {
		return new oe.Table("hhea", [{
			name: "version",
			type: "FIXED",
			value: 65536
		}, {
			name: "ascender",
			type: "FWORD",
			value: 0
		}, {
			name: "descender",
			type: "FWORD",
			value: 0
		}, {
			name: "lineGap",
			type: "FWORD",
			value: 0
		}, {
			name: "advanceWidthMax",
			type: "UFWORD",
			value: 0
		}, {
			name: "minLeftSideBearing",
			type: "FWORD",
			value: 0
		}, {
			name: "minRightSideBearing",
			type: "FWORD",
			value: 0
		}, {
			name: "xMaxExtent",
			type: "FWORD",
			value: 0
		}, {
			name: "caretSlopeRise",
			type: "SHORT",
			value: 1
		}, {
			name: "caretSlopeRun",
			type: "SHORT",
			value: 0
		}, {
			name: "caretOffset",
			type: "SHORT",
			value: 0
		}, {
			name: "reserved1",
			type: "SHORT",
			value: 0
		}, {
			name: "reserved2",
			type: "SHORT",
			value: 0
		}, {
			name: "reserved3",
			type: "SHORT",
			value: 0
		}, {
			name: "reserved4",
			type: "SHORT",
			value: 0
		}, {
			name: "metricDataFormat",
			type: "SHORT",
			value: 0
		}, {
			name: "numberOfHMetrics",
			type: "USHORT",
			value: 0
		}], e)
	}
};
var et = {
	parse: function(e, t, n, o, r) {
		let s, a;
		const i = new pe.Parser(e, t);
		for (let e = 0; e < o; e += 1) {
			e < n && (s = i.parseUShort(), a = i.parseShort());
			const t = r.get(e);
			t.advanceWidth = s, t.leftSideBearing = a
		}
	},
	make: function(e) {
		const t = new oe.Table("hmtx", []);
		for (let n = 0; n < e.length; n += 1) {
			const o = e.get(n),
				r = o.advanceWidth || 0,
				s = o.leftSideBearing || 0;
			t.fields.push({
				name: "advanceWidth_" + n,
				type: "USHORT",
				value: r
			}), t.fields.push({
				name: "leftSideBearing_" + n,
				type: "SHORT",
				value: s
			})
		}
		return t
	}
};
var tt = {
	make: function(e) {
		const t = new oe.Table("ltag", [{
			name: "version",
			type: "ULONG",
			value: 1
		}, {
			name: "flags",
			type: "ULONG",
			value: 0
		}, {
			name: "numTags",
			type: "ULONG",
			value: e.length
		}]);
		let n = "";
		const o = 12 + 4 * e.length;
		for (let r = 0; r < e.length; ++r) {
			let s = n.indexOf(e[r]);
			s < 0 && (s = n.length, n += e[r]), t.fields.push({
				name: "offset " + r,
				type: "USHORT",
				value: o + s
			}), t.fields.push({
				name: "length " + r,
				type: "USHORT",
				value: e[r].length
			})
		}
		return t.fields.push({
			name: "stringPool",
			type: "CHARARRAY",
			value: n
		}), t
	},
	parse: function(e, t) {
		const n = new pe.Parser(e, t),
			o = n.parseULong();
		G.argument(1 === o, "Unsupported ltag table version."), n.skip("uLong", 1);
		const r = n.parseULong(),
			s = [];
		for (let o = 0; o < r; o++) {
			let o = "";
			const r = t + n.parseUShort(),
				a = n.parseUShort();
			for (let t = r; t < r + a; ++t) o += String.fromCharCode(e.getInt8(t));
			s.push(o)
		}
		return s
	}
};
var nt = {
	parse: function(e, t) {
		const n = {},
			o = new pe.Parser(e, t);
		return n.version = o.parseVersion(), n.numGlyphs = o.parseUShort(), 1 === n.version && (n.maxPoints = o
			.parseUShort(), n.maxContours = o.parseUShort(), n.maxCompositePoints = o.parseUShort(), n
			.maxCompositeContours = o.parseUShort(), n.maxZones = o.parseUShort(), n.maxTwilightPoints = o
			.parseUShort(), n.maxStorage = o.parseUShort(), n.maxFunctionDefs = o.parseUShort(), n
			.maxInstructionDefs = o.parseUShort(), n.maxStackElements = o.parseUShort(), n
			.maxSizeOfInstructions = o.parseUShort(), n.maxComponentElements = o.parseUShort(), n
			.maxComponentDepth = o.parseUShort()), n
	},
	make: function(e) {
		return new oe.Table("maxp", [{
			name: "version",
			type: "FIXED",
			value: 20480
		}, {
			name: "numGlyphs",
			type: "USHORT",
			value: e
		}])
	}
};
const ot = ["copyright", "fontFamily", "fontSubfamily", "uniqueID", "fullName", "version", "postScriptName",
		"trademark", "manufacturer", "designer", "description", "manufacturerURL", "designerURL", "license",
		"licenseURL", "reserved", "preferredFamily", "preferredSubfamily", "compatibleFullName", "sampleText",
		"postScriptFindFontName", "wwsFamily", "wwsSubfamily"
	],
	rt = {
		0: "en",
		1: "fr",
		2: "de",
		3: "it",
		4: "nl",
		5: "sv",
		6: "es",
		7: "da",
		8: "pt",
		9: "no",
		10: "he",
		11: "ja",
		12: "ar",
		13: "fi",
		14: "el",
		15: "is",
		16: "mt",
		17: "tr",
		18: "hr",
		19: "zh-Hant",
		20: "ur",
		21: "hi",
		22: "th",
		23: "ko",
		24: "lt",
		25: "pl",
		26: "hu",
		27: "es",
		28: "lv",
		29: "se",
		30: "fo",
		31: "fa",
		32: "ru",
		33: "zh",
		34: "nl-BE",
		35: "ga",
		36: "sq",
		37: "ro",
		38: "cz",
		39: "sk",
		40: "si",
		41: "yi",
		42: "sr",
		43: "mk",
		44: "bg",
		45: "uk",
		46: "be",
		47: "uz",
		48: "kk",
		49: "az-Cyrl",
		50: "az-Arab",
		51: "hy",
		52: "ka",
		53: "mo",
		54: "ky",
		55: "tg",
		56: "tk",
		57: "mn-CN",
		58: "mn",
		59: "ps",
		60: "ks",
		61: "ku",
		62: "sd",
		63: "bo",
		64: "ne",
		65: "sa",
		66: "mr",
		67: "bn",
		68: "as",
		69: "gu",
		70: "pa",
		71: "or",
		72: "ml",
		73: "kn",
		74: "ta",
		75: "te",
		76: "si",
		77: "my",
		78: "km",
		79: "lo",
		80: "vi",
		81: "id",
		82: "tl",
		83: "ms",
		84: "ms-Arab",
		85: "am",
		86: "ti",
		87: "om",
		88: "so",
		89: "sw",
		90: "rw",
		91: "rn",
		92: "ny",
		93: "mg",
		94: "eo",
		128: "cy",
		129: "eu",
		130: "ca",
		131: "la",
		132: "qu",
		133: "gn",
		134: "ay",
		135: "tt",
		136: "ug",
		137: "dz",
		138: "jv",
		139: "su",
		140: "gl",
		141: "af",
		142: "br",
		143: "iu",
		144: "gd",
		145: "gv",
		146: "ga",
		147: "to",
		148: "el-polyton",
		149: "kl",
		150: "az",
		151: "nn"
	},
	st = {
		0: 0,
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
		6: 0,
		7: 0,
		8: 0,
		9: 0,
		10: 5,
		11: 1,
		12: 4,
		13: 0,
		14: 6,
		15: 0,
		16: 0,
		17: 0,
		18: 0,
		19: 2,
		20: 4,
		21: 9,
		22: 21,
		23: 3,
		24: 29,
		25: 29,
		26: 29,
		27: 29,
		28: 29,
		29: 0,
		30: 0,
		31: 4,
		32: 7,
		33: 25,
		34: 0,
		35: 0,
		36: 0,
		37: 0,
		38: 29,
		39: 29,
		40: 0,
		41: 5,
		42: 7,
		43: 7,
		44: 7,
		45: 7,
		46: 7,
		47: 7,
		48: 7,
		49: 7,
		50: 4,
		51: 24,
		52: 23,
		53: 7,
		54: 7,
		55: 7,
		56: 7,
		57: 27,
		58: 7,
		59: 4,
		60: 4,
		61: 4,
		62: 4,
		63: 26,
		64: 9,
		65: 9,
		66: 9,
		67: 13,
		68: 13,
		69: 11,
		70: 10,
		71: 12,
		72: 17,
		73: 16,
		74: 14,
		75: 15,
		76: 18,
		77: 19,
		78: 20,
		79: 22,
		80: 30,
		81: 0,
		82: 0,
		83: 0,
		84: 4,
		85: 28,
		86: 28,
		87: 28,
		88: 0,
		89: 0,
		90: 0,
		91: 0,
		92: 0,
		93: 0,
		94: 0,
		128: 0,
		129: 0,
		130: 0,
		131: 0,
		132: 0,
		133: 0,
		134: 0,
		135: 7,
		136: 4,
		137: 26,
		138: 0,
		139: 0,
		140: 0,
		141: 0,
		142: 0,
		143: 28,
		144: 0,
		145: 0,
		146: 0,
		147: 0,
		148: 6,
		149: 0,
		150: 0,
		151: 0
	},
	at = {
		1078: "af",
		1052: "sq",
		1156: "gsw",
		1118: "am",
		5121: "ar-DZ",
		15361: "ar-BH",
		3073: "ar",
		2049: "ar-IQ",
		11265: "ar-JO",
		13313: "ar-KW",
		12289: "ar-LB",
		4097: "ar-LY",
		6145: "ary",
		8193: "ar-OM",
		16385: "ar-QA",
		1025: "ar-SA",
		10241: "ar-SY",
		7169: "aeb",
		14337: "ar-AE",
		9217: "ar-YE",
		1067: "hy",
		1101: "as",
		2092: "az-Cyrl",
		1068: "az",
		1133: "ba",
		1069: "eu",
		1059: "be",
		2117: "bn",
		1093: "bn-IN",
		8218: "bs-Cyrl",
		5146: "bs",
		1150: "br",
		1026: "bg",
		1027: "ca",
		3076: "zh-HK",
		5124: "zh-MO",
		2052: "zh",
		4100: "zh-SG",
		1028: "zh-TW",
		1155: "co",
		1050: "hr",
		4122: "hr-BA",
		1029: "cs",
		1030: "da",
		1164: "prs",
		1125: "dv",
		2067: "nl-BE",
		1043: "nl",
		3081: "en-AU",
		10249: "en-BZ",
		4105: "en-CA",
		9225: "en-029",
		16393: "en-IN",
		6153: "en-IE",
		8201: "en-JM",
		17417: "en-MY",
		5129: "en-NZ",
		13321: "en-PH",
		18441: "en-SG",
		7177: "en-ZA",
		11273: "en-TT",
		2057: "en-GB",
		1033: "en",
		12297: "en-ZW",
		1061: "et",
		1080: "fo",
		1124: "fil",
		1035: "fi",
		2060: "fr-BE",
		3084: "fr-CA",
		1036: "fr",
		5132: "fr-LU",
		6156: "fr-MC",
		4108: "fr-CH",
		1122: "fy",
		1110: "gl",
		1079: "ka",
		3079: "de-AT",
		1031: "de",
		5127: "de-LI",
		4103: "de-LU",
		2055: "de-CH",
		1032: "el",
		1135: "kl",
		1095: "gu",
		1128: "ha",
		1037: "he",
		1081: "hi",
		1038: "hu",
		1039: "is",
		1136: "ig",
		1057: "id",
		1117: "iu",
		2141: "iu-Latn",
		2108: "ga",
		1076: "xh",
		1077: "zu",
		1040: "it",
		2064: "it-CH",
		1041: "ja",
		1099: "kn",
		1087: "kk",
		1107: "km",
		1158: "quc",
		1159: "rw",
		1089: "sw",
		1111: "kok",
		1042: "ko",
		1088: "ky",
		1108: "lo",
		1062: "lv",
		1063: "lt",
		2094: "dsb",
		1134: "lb",
		1071: "mk",
		2110: "ms-BN",
		1086: "ms",
		1100: "ml",
		1082: "mt",
		1153: "mi",
		1146: "arn",
		1102: "mr",
		1148: "moh",
		1104: "mn",
		2128: "mn-CN",
		1121: "ne",
		1044: "nb",
		2068: "nn",
		1154: "oc",
		1096: "or",
		1123: "ps",
		1045: "pl",
		1046: "pt",
		2070: "pt-PT",
		1094: "pa",
		1131: "qu-BO",
		2155: "qu-EC",
		3179: "qu",
		1048: "ro",
		1047: "rm",
		1049: "ru",
		9275: "smn",
		4155: "smj-NO",
		5179: "smj",
		3131: "se-FI",
		1083: "se",
		2107: "se-SE",
		8251: "sms",
		6203: "sma-NO",
		7227: "sms",
		1103: "sa",
		7194: "sr-Cyrl-BA",
		3098: "sr",
		6170: "sr-Latn-BA",
		2074: "sr-Latn",
		1132: "nso",
		1074: "tn",
		1115: "si",
		1051: "sk",
		1060: "sl",
		11274: "es-AR",
		16394: "es-BO",
		13322: "es-CL",
		9226: "es-CO",
		5130: "es-CR",
		7178: "es-DO",
		12298: "es-EC",
		17418: "es-SV",
		4106: "es-GT",
		18442: "es-HN",
		2058: "es-MX",
		19466: "es-NI",
		6154: "es-PA",
		15370: "es-PY",
		10250: "es-PE",
		20490: "es-PR",
		3082: "es",
		1034: "es",
		21514: "es-US",
		14346: "es-UY",
		8202: "es-VE",
		2077: "sv-FI",
		1053: "sv",
		1114: "syr",
		1064: "tg",
		2143: "tzm",
		1097: "ta",
		1092: "tt",
		1098: "te",
		1054: "th",
		1105: "bo",
		1055: "tr",
		1090: "tk",
		1152: "ug",
		1058: "uk",
		1070: "hsb",
		1056: "ur",
		2115: "uz-Cyrl",
		1091: "uz",
		1066: "vi",
		1106: "cy",
		1160: "wo",
		1157: "sah",
		1144: "ii",
		1130: "yo"
	};

function it(e, t, n) {
	switch (e) {
		case 0:
			if (65535 === t) return "und";
			if (n) return n[t];
			break;
		case 1:
			return rt[t];
		case 3:
			return at[t]
	}
}
const lt = {
		0: "macintosh",
		1: "x-mac-japanese",
		2: "x-mac-chinesetrad",
		3: "x-mac-korean",
		6: "x-mac-greek",
		7: "x-mac-cyrillic",
		9: "x-mac-devanagai",
		10: "x-mac-gurmukhi",
		11: "x-mac-gujarati",
		12: "x-mac-oriya",
		13: "x-mac-bengali",
		14: "x-mac-tamil",
		15: "x-mac-telugu",
		16: "x-mac-kannada",
		17: "x-mac-malayalam",
		18: "x-mac-sinhalese",
		19: "x-mac-burmese",
		20: "x-mac-khmer",
		21: "x-mac-thai",
		22: "x-mac-lao",
		23: "x-mac-georgian",
		24: "x-mac-armenian",
		25: "x-mac-chinesesimp",
		26: "x-mac-tibetan",
		27: "x-mac-mongolian",
		28: "x-mac-ethiopic",
		29: "x-mac-ce",
		30: "x-mac-vietnamese",
		31: "x-mac-extarabic"
	},
	ct = {
		15: "x-mac-icelandic",
		17: "x-mac-turkish",
		18: "x-mac-croatian",
		24: "x-mac-ce",
		25: "x-mac-ce",
		26: "x-mac-ce",
		27: "x-mac-ce",
		28: "x-mac-ce",
		30: "x-mac-icelandic",
		37: "x-mac-romanian",
		38: "x-mac-ce",
		39: "x-mac-ce",
		40: "x-mac-ce",
		143: "x-mac-inuit",
		146: "x-mac-gaelic"
	};

function ut(e, t, n) {
	switch (e) {
		case 0:
			return "utf-16";
		case 1:
			return ct[n] || lt[t];
		case 3:
			if (1 === t || 10 === t) return "utf-16"
	}
}

function pt(e) {
	const t = {};
	for (let n in e) t[e[n]] = parseInt(n);
	return t
}

function ht(e, t, n, o, r, s) {
	return new oe.Record("NameRecord", [{
		name: "platformID",
		type: "USHORT",
		value: e
	}, {
		name: "encodingID",
		type: "USHORT",
		value: t
	}, {
		name: "languageID",
		type: "USHORT",
		value: n
	}, {
		name: "nameID",
		type: "USHORT",
		value: o
	}, {
		name: "length",
		type: "USHORT",
		value: r
	}, {
		name: "offset",
		type: "USHORT",
		value: s
	}])
}

function ft(e, t) {
	let n = function(e, t) {
		const n = e.length,
			o = t.length - n + 1;
		e: for (let r = 0; r < o; r++)
			for (; r < o; r++) {
				for (let o = 0; o < n; o++)
					if (t[r + o] !== e[o]) continue e;
				return r
			}
		return -1
	}(e, t);
	if (n < 0) {
		n = t.length;
		let o = 0;
		const r = e.length;
		for (; o < r; ++o) t.push(e[o])
	}
	return n
}
var dt = {
	parse: function(e, t, n) {
		const o = {},
			r = new pe.Parser(e, t),
			s = r.parseUShort(),
			a = r.parseUShort(),
			i = r.offset + r.parseUShort();
		for (let t = 0; t < a; t++) {
			const t = r.parseUShort(),
				s = r.parseUShort(),
				a = r.parseUShort(),
				l = r.parseUShort(),
				c = ot[l] || l,
				u = r.parseUShort(),
				p = r.parseUShort(),
				h = it(t, a, n),
				f = ut(t, s, a);
			if (void 0 !== f && void 0 !== h) {
				let t;
				if (t = "utf-16" === f ? P.UTF16(e, i + p, u) : P.MACSTRING(e, i + p, u, f), t) {
					let e = o[c];
					void 0 === e && (e = o[c] = {}), e[h] = t
				}
			}
		}
		return 1 === s && r.parseUShort(), o
	},
	make: function(e, t) {
		let n;
		const o = [],
			r = {},
			s = pt(ot);
		for (let t in e) {
			let a = s[t];
			if (void 0 === a && (a = t), n = parseInt(a), isNaN(n)) throw new Error('Name table entry "' + t +
				'" does not exist, see nameTableNames for complete list.');
			r[n] = e[t], o.push(n)
		}
		const a = pt(rt),
			i = pt(at),
			l = [],
			c = [];
		for (let e = 0; e < o.length; e++) {
			n = o[e];
			const s = r[n];
			for (let e in s) {
				const o = s[e];
				let r = 1,
					u = a[e],
					p = st[u];
				const h = ut(r, p, u);
				let f = A.MACSTRING(o, h);
				void 0 === f && (r = 0, u = t.indexOf(e), u < 0 && (u = t.length, t.push(e)), p = 4, f = A
					.UTF16(o));
				const d = ft(f, c);
				l.push(ht(r, p, u, n, f.length, d));
				const g = i[e];
				if (void 0 !== g) {
					const e = A.UTF16(o),
						t = ft(e, c);
					l.push(ht(3, 1, g, n, e.length, t))
				}
			}
		}
		l.sort((function(e, t) {
			return e.platformID - t.platformID || e.encodingID - t.encodingID || e.languageID - t
				.languageID || e.nameID - t.nameID
		}));
		const u = new oe.Table("name", [{
			name: "format",
			type: "USHORT",
			value: 0
		}, {
			name: "count",
			type: "USHORT",
			value: l.length
		}, {
			name: "stringOffset",
			type: "USHORT",
			value: 6 + 12 * l.length
		}]);
		for (let e = 0; e < l.length; e++) u.fields.push({
			name: "record_" + e,
			type: "RECORD",
			value: l[e]
		});
		return u.fields.push({
			name: "strings",
			type: "LITERAL",
			value: c
		}), u
	}
};
const gt = [{
	begin: 0,
	end: 127
}, {
	begin: 128,
	end: 255
}, {
	begin: 256,
	end: 383
}, {
	begin: 384,
	end: 591
}, {
	begin: 592,
	end: 687
}, {
	begin: 688,
	end: 767
}, {
	begin: 768,
	end: 879
}, {
	begin: 880,
	end: 1023
}, {
	begin: 11392,
	end: 11519
}, {
	begin: 1024,
	end: 1279
}, {
	begin: 1328,
	end: 1423
}, {
	begin: 1424,
	end: 1535
}, {
	begin: 42240,
	end: 42559
}, {
	begin: 1536,
	end: 1791
}, {
	begin: 1984,
	end: 2047
}, {
	begin: 2304,
	end: 2431
}, {
	begin: 2432,
	end: 2559
}, {
	begin: 2560,
	end: 2687
}, {
	begin: 2688,
	end: 2815
}, {
	begin: 2816,
	end: 2943
}, {
	begin: 2944,
	end: 3071
}, {
	begin: 3072,
	end: 3199
}, {
	begin: 3200,
	end: 3327
}, {
	begin: 3328,
	end: 3455
}, {
	begin: 3584,
	end: 3711
}, {
	begin: 3712,
	end: 3839
}, {
	begin: 4256,
	end: 4351
}, {
	begin: 6912,
	end: 7039
}, {
	begin: 4352,
	end: 4607
}, {
	begin: 7680,
	end: 7935
}, {
	begin: 7936,
	end: 8191
}, {
	begin: 8192,
	end: 8303
}, {
	begin: 8304,
	end: 8351
}, {
	begin: 8352,
	end: 8399
}, {
	begin: 8400,
	end: 8447
}, {
	begin: 8448,
	end: 8527
}, {
	begin: 8528,
	end: 8591
}, {
	begin: 8592,
	end: 8703
}, {
	begin: 8704,
	end: 8959
}, {
	begin: 8960,
	end: 9215
}, {
	begin: 9216,
	end: 9279
}, {
	begin: 9280,
	end: 9311
}, {
	begin: 9312,
	end: 9471
}, {
	begin: 9472,
	end: 9599
}, {
	begin: 9600,
	end: 9631
}, {
	begin: 9632,
	end: 9727
}, {
	begin: 9728,
	end: 9983
}, {
	begin: 9984,
	end: 10175
}, {
	begin: 12288,
	end: 12351
}, {
	begin: 12352,
	end: 12447
}, {
	begin: 12448,
	end: 12543
}, {
	begin: 12544,
	end: 12591
}, {
	begin: 12592,
	end: 12687
}, {
	begin: 43072,
	end: 43135
}, {
	begin: 12800,
	end: 13055
}, {
	begin: 13056,
	end: 13311
}, {
	begin: 44032,
	end: 55215
}, {
	begin: 55296,
	end: 57343
}, {
	begin: 67840,
	end: 67871
}, {
	begin: 19968,
	end: 40959
}, {
	begin: 57344,
	end: 63743
}, {
	begin: 12736,
	end: 12783
}, {
	begin: 64256,
	end: 64335
}, {
	begin: 64336,
	end: 65023
}, {
	begin: 65056,
	end: 65071
}, {
	begin: 65040,
	end: 65055
}, {
	begin: 65104,
	end: 65135
}, {
	begin: 65136,
	end: 65279
}, {
	begin: 65280,
	end: 65519
}, {
	begin: 65520,
	end: 65535
}, {
	begin: 3840,
	end: 4095
}, {
	begin: 1792,
	end: 1871
}, {
	begin: 1920,
	end: 1983
}, {
	begin: 3456,
	end: 3583
}, {
	begin: 4096,
	end: 4255
}, {
	begin: 4608,
	end: 4991
}, {
	begin: 5024,
	end: 5119
}, {
	begin: 5120,
	end: 5759
}, {
	begin: 5760,
	end: 5791
}, {
	begin: 5792,
	end: 5887
}, {
	begin: 6016,
	end: 6143
}, {
	begin: 6144,
	end: 6319
}, {
	begin: 10240,
	end: 10495
}, {
	begin: 40960,
	end: 42127
}, {
	begin: 5888,
	end: 5919
}, {
	begin: 66304,
	end: 66351
}, {
	begin: 66352,
	end: 66383
}, {
	begin: 66560,
	end: 66639
}, {
	begin: 118784,
	end: 119039
}, {
	begin: 119808,
	end: 120831
}, {
	begin: 1044480,
	end: 1048573
}, {
	begin: 65024,
	end: 65039
}, {
	begin: 917504,
	end: 917631
}, {
	begin: 6400,
	end: 6479
}, {
	begin: 6480,
	end: 6527
}, {
	begin: 6528,
	end: 6623
}, {
	begin: 6656,
	end: 6687
}, {
	begin: 11264,
	end: 11359
}, {
	begin: 11568,
	end: 11647
}, {
	begin: 19904,
	end: 19967
}, {
	begin: 43008,
	end: 43055
}, {
	begin: 65536,
	end: 65663
}, {
	begin: 65856,
	end: 65935
}, {
	begin: 66432,
	end: 66463
}, {
	begin: 66464,
	end: 66527
}, {
	begin: 66640,
	end: 66687
}, {
	begin: 66688,
	end: 66735
}, {
	begin: 67584,
	end: 67647
}, {
	begin: 68096,
	end: 68191
}, {
	begin: 119552,
	end: 119647
}, {
	begin: 73728,
	end: 74751
}, {
	begin: 119648,
	end: 119679
}, {
	begin: 7040,
	end: 7103
}, {
	begin: 7168,
	end: 7247
}, {
	begin: 7248,
	end: 7295
}, {
	begin: 43136,
	end: 43231
}, {
	begin: 43264,
	end: 43311
}, {
	begin: 43312,
	end: 43359
}, {
	begin: 43520,
	end: 43615
}, {
	begin: 65936,
	end: 65999
}, {
	begin: 66e3,
	end: 66047
}, {
	begin: 66208,
	end: 66271
}, {
	begin: 127024,
	end: 127135
}];
var mt = {
	parse: function(e, t) {
		const n = {},
			o = new pe.Parser(e, t);
		n.version = o.parseUShort(), n.xAvgCharWidth = o.parseShort(), n.usWeightClass = o.parseUShort(), n
			.usWidthClass = o.parseUShort(), n.fsType = o.parseUShort(), n.ySubscriptXSize = o.parseShort(), n
			.ySubscriptYSize = o.parseShort(), n.ySubscriptXOffset = o.parseShort(), n.ySubscriptYOffset = o
			.parseShort(), n.ySuperscriptXSize = o.parseShort(), n.ySuperscriptYSize = o.parseShort(), n
			.ySuperscriptXOffset = o.parseShort(), n.ySuperscriptYOffset = o.parseShort(), n.yStrikeoutSize = o
			.parseShort(), n.yStrikeoutPosition = o.parseShort(), n.sFamilyClass = o.parseShort(), n
		.panose = [];
		for (let e = 0; e < 10; e++) n.panose[e] = o.parseByte();
		return n.ulUnicodeRange1 = o.parseULong(), n.ulUnicodeRange2 = o.parseULong(), n.ulUnicodeRange3 = o
			.parseULong(), n.ulUnicodeRange4 = o.parseULong(), n.achVendID = String.fromCharCode(o.parseByte(),
				o.parseByte(), o.parseByte(), o.parseByte()), n.fsSelection = o.parseUShort(), n
			.usFirstCharIndex = o.parseUShort(), n.usLastCharIndex = o.parseUShort(), n.sTypoAscender = o
			.parseShort(), n.sTypoDescender = o.parseShort(), n.sTypoLineGap = o.parseShort(), n.usWinAscent = o
			.parseUShort(), n.usWinDescent = o.parseUShort(), n.version >= 1 && (n.ulCodePageRange1 = o
				.parseULong(), n.ulCodePageRange2 = o.parseULong()), n.version >= 2 && (n.sxHeight = o
				.parseShort(), n.sCapHeight = o.parseShort(), n.usDefaultChar = o.parseUShort(), n.usBreakChar =
				o.parseUShort(), n.usMaxContent = o.parseUShort()), n
	},
	make: function(e) {
		return new oe.Table("OS/2", [{
			name: "version",
			type: "USHORT",
			value: 3
		}, {
			name: "xAvgCharWidth",
			type: "SHORT",
			value: 0
		}, {
			name: "usWeightClass",
			type: "USHORT",
			value: 0
		}, {
			name: "usWidthClass",
			type: "USHORT",
			value: 0
		}, {
			name: "fsType",
			type: "USHORT",
			value: 0
		}, {
			name: "ySubscriptXSize",
			type: "SHORT",
			value: 650
		}, {
			name: "ySubscriptYSize",
			type: "SHORT",
			value: 699
		}, {
			name: "ySubscriptXOffset",
			type: "SHORT",
			value: 0
		}, {
			name: "ySubscriptYOffset",
			type: "SHORT",
			value: 140
		}, {
			name: "ySuperscriptXSize",
			type: "SHORT",
			value: 650
		}, {
			name: "ySuperscriptYSize",
			type: "SHORT",
			value: 699
		}, {
			name: "ySuperscriptXOffset",
			type: "SHORT",
			value: 0
		}, {
			name: "ySuperscriptYOffset",
			type: "SHORT",
			value: 479
		}, {
			name: "yStrikeoutSize",
			type: "SHORT",
			value: 49
		}, {
			name: "yStrikeoutPosition",
			type: "SHORT",
			value: 258
		}, {
			name: "sFamilyClass",
			type: "SHORT",
			value: 0
		}, {
			name: "bFamilyType",
			type: "BYTE",
			value: 0
		}, {
			name: "bSerifStyle",
			type: "BYTE",
			value: 0
		}, {
			name: "bWeight",
			type: "BYTE",
			value: 0
		}, {
			name: "bProportion",
			type: "BYTE",
			value: 0
		}, {
			name: "bContrast",
			type: "BYTE",
			value: 0
		}, {
			name: "bStrokeVariation",
			type: "BYTE",
			value: 0
		}, {
			name: "bArmStyle",
			type: "BYTE",
			value: 0
		}, {
			name: "bLetterform",
			type: "BYTE",
			value: 0
		}, {
			name: "bMidline",
			type: "BYTE",
			value: 0
		}, {
			name: "bXHeight",
			type: "BYTE",
			value: 0
		}, {
			name: "ulUnicodeRange1",
			type: "ULONG",
			value: 0
		}, {
			name: "ulUnicodeRange2",
			type: "ULONG",
			value: 0
		}, {
			name: "ulUnicodeRange3",
			type: "ULONG",
			value: 0
		}, {
			name: "ulUnicodeRange4",
			type: "ULONG",
			value: 0
		}, {
			name: "achVendID",
			type: "CHARARRAY",
			value: "XXXX"
		}, {
			name: "fsSelection",
			type: "USHORT",
			value: 0
		}, {
			name: "usFirstCharIndex",
			type: "USHORT",
			value: 0
		}, {
			name: "usLastCharIndex",
			type: "USHORT",
			value: 0
		}, {
			name: "sTypoAscender",
			type: "SHORT",
			value: 0
		}, {
			name: "sTypoDescender",
			type: "SHORT",
			value: 0
		}, {
			name: "sTypoLineGap",
			type: "SHORT",
			value: 0
		}, {
			name: "usWinAscent",
			type: "USHORT",
			value: 0
		}, {
			name: "usWinDescent",
			type: "USHORT",
			value: 0
		}, {
			name: "ulCodePageRange1",
			type: "ULONG",
			value: 0
		}, {
			name: "ulCodePageRange2",
			type: "ULONG",
			value: 0
		}, {
			name: "sxHeight",
			type: "SHORT",
			value: 0
		}, {
			name: "sCapHeight",
			type: "SHORT",
			value: 0
		}, {
			name: "usDefaultChar",
			type: "USHORT",
			value: 0
		}, {
			name: "usBreakChar",
			type: "USHORT",
			value: 0
		}, {
			name: "usMaxContext",
			type: "USHORT",
			value: 0
		}], e)
	},
	unicodeRanges: gt,
	getUnicodeRange: function(e) {
		for (let t = 0; t < gt.length; t += 1) {
			const n = gt[t];
			if (e >= n.begin && e < n.end) return t
		}
		return -1
	}
};
var yt = {
	parse: function(e, t) {
		const n = {},
			o = new pe.Parser(e, t);
		switch (n.version = o.parseVersion(), n.italicAngle = o.parseFixed(), n.underlinePosition = o
			.parseShort(), n.underlineThickness = o.parseShort(), n.isFixedPitch = o.parseULong(), n
			.minMemType42 = o.parseULong(), n.maxMemType42 = o.parseULong(), n.minMemType1 = o.parseULong(), n
			.maxMemType1 = o.parseULong(), n.version) {
			case 1:
				n.names = ye.slice();
				break;
			case 2:
				n.numberOfGlyphs = o.parseUShort(), n.glyphNameIndex = new Array(n.numberOfGlyphs);
				for (let e = 0; e < n.numberOfGlyphs; e++) n.glyphNameIndex[e] = o.parseUShort();
				n.names = [];
				for (let e = 0; e < n.numberOfGlyphs; e++)
					if (n.glyphNameIndex[e] >= ye.length) {
						const e = o.parseChar();
						n.names.push(o.parseString(e))
					} break;
			case 2.5:
				n.numberOfGlyphs = o.parseUShort(), n.offset = new Array(n.numberOfGlyphs);
				for (let e = 0; e < n.numberOfGlyphs; e++) n.offset[e] = o.parseChar()
		}
		return n
	},
	make: function() {
		return new oe.Table("post", [{
			name: "version",
			type: "FIXED",
			value: 196608
		}, {
			name: "italicAngle",
			type: "FIXED",
			value: 0
		}, {
			name: "underlinePosition",
			type: "FWORD",
			value: 0
		}, {
			name: "underlineThickness",
			type: "FWORD",
			value: 0
		}, {
			name: "isFixedPitch",
			type: "ULONG",
			value: 0
		}, {
			name: "minMemType42",
			type: "ULONG",
			value: 0
		}, {
			name: "maxMemType42",
			type: "ULONG",
			value: 0
		}, {
			name: "minMemType1",
			type: "ULONG",
			value: 0
		}, {
			name: "maxMemType1",
			type: "ULONG",
			value: 0
		}])
	}
};
const vt = new Array(9);
vt[1] = function() {
	const e = this.offset + this.relativeOffset,
		t = this.parseUShort();
	return 1 === t ? {
		substFormat: 1,
		coverage: this.parsePointer(ce.coverage),
		deltaGlyphId: this.parseUShort()
	} : 2 === t ? {
		substFormat: 2,
		coverage: this.parsePointer(ce.coverage),
		substitute: this.parseOffset16List()
	} : void G.assert(!1, "0x" + e.toString(16) + ": lookup type 1 format must be 1 or 2.")
}, vt[2] = function() {
	const e = this.parseUShort();
	return G.argument(1 === e, "GSUB Multiple Substitution Subtable identifier-format must be 1"), {
		substFormat: e,
		coverage: this.parsePointer(ce.coverage),
		sequences: this.parseListOfLists()
	}
}, vt[3] = function() {
	const e = this.parseUShort();
	return G.argument(1 === e, "GSUB Alternate Substitution Subtable identifier-format must be 1"), {
		substFormat: e,
		coverage: this.parsePointer(ce.coverage),
		alternateSets: this.parseListOfLists()
	}
}, vt[4] = function() {
	const e = this.parseUShort();
	return G.argument(1 === e, "GSUB ligature table identifier-format must be 1"), {
		substFormat: e,
		coverage: this.parsePointer(ce.coverage),
		ligatureSets: this.parseListOfLists((function() {
			return {
				ligGlyph: this.parseUShort(),
				components: this.parseUShortList(this.parseUShort() - 1)
			}
		}))
	}
};
const bt = {
	sequenceIndex: ce.uShort,
	lookupListIndex: ce.uShort
};
vt[5] = function() {
	const e = this.offset + this.relativeOffset,
		t = this.parseUShort();
	if (1 === t) return {
		substFormat: t,
		coverage: this.parsePointer(ce.coverage),
		ruleSets: this.parseListOfLists((function() {
			const e = this.parseUShort(),
				t = this.parseUShort();
			return {
				input: this.parseUShortList(e - 1),
				lookupRecords: this.parseRecordList(t, bt)
			}
		}))
	};
	if (2 === t) return {
		substFormat: t,
		coverage: this.parsePointer(ce.coverage),
		classDef: this.parsePointer(ce.classDef),
		classSets: this.parseListOfLists((function() {
			const e = this.parseUShort(),
				t = this.parseUShort();
			return {
				classes: this.parseUShortList(e - 1),
				lookupRecords: this.parseRecordList(t, bt)
			}
		}))
	};
	if (3 === t) {
		const e = this.parseUShort(),
			n = this.parseUShort();
		return {
			substFormat: t,
			coverages: this.parseList(e, ce.pointer(ce.coverage)),
			lookupRecords: this.parseRecordList(n, bt)
		}
	}
	G.assert(!1, "0x" + e.toString(16) + ": lookup type 5 format must be 1, 2 or 3.")
}, vt[6] = function() {
	const e = this.offset + this.relativeOffset,
		t = this.parseUShort();
	return 1 === t ? {
		substFormat: 1,
		coverage: this.parsePointer(ce.coverage),
		chainRuleSets: this.parseListOfLists((function() {
			return {
				backtrack: this.parseUShortList(),
				input: this.parseUShortList(this.parseShort() - 1),
				lookahead: this.parseUShortList(),
				lookupRecords: this.parseRecordList(bt)
			}
		}))
	} : 2 === t ? {
		substFormat: 2,
		coverage: this.parsePointer(ce.coverage),
		backtrackClassDef: this.parsePointer(ce.classDef),
		inputClassDef: this.parsePointer(ce.classDef),
		lookaheadClassDef: this.parsePointer(ce.classDef),
		chainClassSet: this.parseListOfLists((function() {
			return {
				backtrack: this.parseUShortList(),
				input: this.parseUShortList(this.parseShort() - 1),
				lookahead: this.parseUShortList(),
				lookupRecords: this.parseRecordList(bt)
			}
		}))
	} : 3 === t ? {
		substFormat: 3,
		backtrackCoverage: this.parseList(ce.pointer(ce.coverage)),
		inputCoverage: this.parseList(ce.pointer(ce.coverage)),
		lookaheadCoverage: this.parseList(ce.pointer(ce.coverage)),
		lookupRecords: this.parseRecordList(bt)
	} : void G.assert(!1, "0x" + e.toString(16) + ": lookup type 6 format must be 1, 2 or 3.")
}, vt[7] = function() {
	const e = this.parseUShort();
	G.argument(1 === e, "GSUB Extension Substitution subtable identifier-format must be 1");
	const t = this.parseUShort(),
		n = new ce(this.data, this.offset + this.parseULong());
	return {
		substFormat: 1,
		lookupType: t,
		extension: vt[t].call(n)
	}
}, vt[8] = function() {
	const e = this.parseUShort();
	return G.argument(1 === e,
		"GSUB Reverse Chaining Contextual Single Substitution Subtable identifier-format must be 1"), {
		substFormat: e,
		coverage: this.parsePointer(ce.coverage),
		backtrackCoverage: this.parseList(ce.pointer(ce.coverage)),
		lookaheadCoverage: this.parseList(ce.pointer(ce.coverage)),
		substitutes: this.parseUShortList()
	}
};
const xt = new Array(9);
xt[1] = function(e) {
	return 1 === e.substFormat ? new oe.Table("substitutionTable", [{
		name: "substFormat",
		type: "USHORT",
		value: 1
	}, {
		name: "coverage",
		type: "TABLE",
		value: new oe.Coverage(e.coverage)
	}, {
		name: "deltaGlyphID",
		type: "USHORT",
		value: e.deltaGlyphId
	}]) : new oe.Table("substitutionTable", [{
		name: "substFormat",
		type: "USHORT",
		value: 2
	}, {
		name: "coverage",
		type: "TABLE",
		value: new oe.Coverage(e.coverage)
	}].concat(oe.ushortList("substitute", e.substitute)))
}, xt[3] = function(e) {
	return G.assert(1 === e.substFormat, "Lookup type 3 substFormat must be 1."), new oe.Table("substitutionTable",
		[{
			name: "substFormat",
			type: "USHORT",
			value: 1
		}, {
			name: "coverage",
			type: "TABLE",
			value: new oe.Coverage(e.coverage)
		}].concat(oe.tableList("altSet", e.alternateSets, (function(e) {
			return new oe.Table("alternateSetTable", oe.ushortList("alternate", e))
		}))))
}, xt[4] = function(e) {
	return G.assert(1 === e.substFormat, "Lookup type 4 substFormat must be 1."), new oe.Table("substitutionTable",
		[{
			name: "substFormat",
			type: "USHORT",
			value: 1
		}, {
			name: "coverage",
			type: "TABLE",
			value: new oe.Coverage(e.coverage)
		}].concat(oe.tableList("ligSet", e.ligatureSets, (function(e) {
			return new oe.Table("ligatureSetTable", oe.tableList("ligature", e, (function(e) {
				return new oe.Table("ligatureTable", [{
					name: "ligGlyph",
					type: "USHORT",
					value: e.ligGlyph
				}].concat(oe.ushortList("component", e.components, e
					.components.length + 1)))
			})))
		}))))
};
var St = {
	parse: function(e, t) {
		const n = new ce(e, t = t || 0),
			o = n.parseVersion();
		return G.argument(1 === o, "Unsupported GSUB table version."), {
			version: o,
			scripts: n.parseScriptList(),
			features: n.parseFeatureList(),
			lookups: n.parseLookupList(vt)
		}
	},
	make: function(e) {
		return new oe.Table("GSUB", [{
			name: "version",
			type: "ULONG",
			value: 65536
		}, {
			name: "scripts",
			type: "TABLE",
			value: new oe.ScriptList(e.scripts)
		}, {
			name: "features",
			type: "TABLE",
			value: new oe.FeatureList(e.features)
		}, {
			name: "lookups",
			type: "TABLE",
			value: new oe.LookupList(e.lookups, xt)
		}])
	}
};
var Ut = {
	parse: function(e, t) {
		const n = new pe.Parser(e, t),
			o = n.parseULong();
		G.argument(1 === o, "Unsupported META table version."), n.parseULong(), n.parseULong();
		const r = n.parseULong(),
			s = {};
		for (let o = 0; o < r; o++) {
			const o = n.parseTag(),
				r = n.parseULong(),
				a = n.parseULong(),
				i = P.UTF8(e, t + r, a);
			s[o] = i
		}
		return s
	},
	make: function(e) {
		const t = Object.keys(e).length;
		let n = "";
		const o = 16 + 12 * t,
			r = new oe.Table("meta", [{
				name: "version",
				type: "ULONG",
				value: 1
			}, {
				name: "flags",
				type: "ULONG",
				value: 0
			}, {
				name: "offset",
				type: "ULONG",
				value: o
			}, {
				name: "numTags",
				type: "ULONG",
				value: t
			}]);
		for (let t in e) {
			const s = n.length;
			n += e[t], r.fields.push({
				name: "tag " + t,
				type: "TAG",
				value: t
			}), r.fields.push({
				name: "offset " + t,
				type: "ULONG",
				value: o + s
			}), r.fields.push({
				name: "length " + t,
				type: "ULONG",
				value: e[t].length
			})
		}
		return r.fields.push({
			name: "stringPool",
			type: "CHARARRAY",
			value: n
		}), r
	}
};

function Tt(e) {
	return Math.log(e) / Math.log(2) | 0
}

function wt(e) {
	for (; e.length % 4 != 0;) e.push(0);
	let t = 0;
	for (let n = 0; n < e.length; n += 4) t += (e[n] << 24) + (e[n + 1] << 16) + (e[n + 2] << 8) + e[n + 3];
	return t %= Math.pow(2, 32), t
}

function Et(e, t, n, o) {
	return new oe.Record("Table Record", [{
		name: "tag",
		type: "TAG",
		value: void 0 !== e ? e : ""
	}, {
		name: "checkSum",
		type: "ULONG",
		value: void 0 !== t ? t : 0
	}, {
		name: "offset",
		type: "ULONG",
		value: void 0 !== n ? n : 0
	}, {
		name: "length",
		type: "ULONG",
		value: void 0 !== o ? o : 0
	}])
}

function Ot(e) {
	const t = new oe.Table("sfnt", [{
		name: "version",
		type: "TAG",
		value: "OTTO"
	}, {
		name: "numTables",
		type: "USHORT",
		value: 0
	}, {
		name: "searchRange",
		type: "USHORT",
		value: 0
	}, {
		name: "entrySelector",
		type: "USHORT",
		value: 0
	}, {
		name: "rangeShift",
		type: "USHORT",
		value: 0
	}]);
	t.tables = e, t.numTables = e.length;
	const n = Math.pow(2, Tt(t.numTables));
	t.searchRange = 16 * n, t.entrySelector = Tt(n), t.rangeShift = 16 * t.numTables - t.searchRange;
	const o = [],
		r = [];
	let s = t.sizeOf() + Et().sizeOf() * t.numTables;
	for (; s % 4 != 0;) s += 1, r.push({
		name: "padding",
		type: "BYTE",
		value: 0
	});
	for (let t = 0; t < e.length; t += 1) {
		const n = e[t];
		G.argument(4 === n.tableName.length, "Table name" + n.tableName + " is invalid.");
		const a = n.sizeOf(),
			i = Et(n.tableName, wt(n.encode()), s, a);
		for (o.push({
				name: i.tag + " Table Record",
				type: "RECORD",
				value: i
			}), r.push({
				name: n.tableName + " table",
				type: "RECORD",
				value: n
			}), s += a, G.argument(!isNaN(s), "Something went wrong calculating the offset."); s % 4 != 0;) s += 1, r
			.push({
				name: "padding",
				type: "BYTE",
				value: 0
			})
	}
	return o.sort((function(e, t) {
		return e.value.tag > t.value.tag ? 1 : -1
	})), t.fields = t.fields.concat(o), t.fields = t.fields.concat(r), t
}

function Lt(e, t, n) {
	for (let n = 0; n < t.length; n += 1) {
		const o = e.charToGlyphIndex(t[n]);
		if (o > 0) {
			return e.glyphs.get(o).getMetrics()
		}
	}
	return n
}

function kt(e) {
	let t = 0;
	for (let n = 0; n < e.length; n += 1) t += e[n];
	return t / e.length
}
var Rt = {
	make: Ot,
	fontToTable: function(e) {
		const t = [],
			n = [],
			o = [],
			r = [],
			s = [],
			a = [],
			i = [];
		let l, c = 0,
			u = 0,
			p = 0,
			h = 0,
			f = 0;
		for (let d = 0; d < e.glyphs.length; d += 1) {
			const g = e.glyphs.get(d),
				m = 0 | g.unicode;
			if (isNaN(g.advanceWidth)) throw new Error("Glyph " + g.name + " (" + d +
				"): advanceWidth is not a number.");
			(l > m || void 0 === l) && m > 0 && (l = m), c < m && (c = m);
			const y = mt.getUnicodeRange(m);
			if (y < 32) u |= 1 << y;
			else if (y < 64) p |= 1 << y - 32;
			else if (y < 96) h |= 1 << y - 64;
			else {
				if (!(y < 123)) throw new Error("Unicode ranges bits > 123 are reserved for internal usage");
				f |= 1 << y - 96
			}
			if (".notdef" === g.name) continue;
			const v = g.getMetrics();
			t.push(v.xMin), n.push(v.yMin), o.push(v.xMax), r.push(v.yMax), a.push(v.leftSideBearing), i.push(v
				.rightSideBearing), s.push(g.advanceWidth)
		}
		const d = {
			xMin: Math.min.apply(null, t),
			yMin: Math.min.apply(null, n),
			xMax: Math.max.apply(null, o),
			yMax: Math.max.apply(null, r),
			advanceWidthMax: Math.max.apply(null, s),
			advanceWidthAvg: kt(s),
			minLeftSideBearing: Math.min.apply(null, a),
			maxLeftSideBearing: Math.max.apply(null, a),
			minRightSideBearing: Math.min.apply(null, i)
		};
		d.ascender = e.ascender, d.descender = e.descender;
		const g = Ke.make({
				flags: 3,
				unitsPerEm: e.unitsPerEm,
				xMin: d.xMin,
				yMin: d.yMin,
				xMax: d.xMax,
				yMax: d.yMax,
				lowestRecPPEM: 3,
				createdTimestamp: e.createdTimestamp
			}),
			m = Je.make({
				ascender: d.ascender,
				descender: d.descender,
				advanceWidthMax: d.advanceWidthMax,
				minLeftSideBearing: d.minLeftSideBearing,
				minRightSideBearing: d.minRightSideBearing,
				xMaxExtent: d.maxLeftSideBearing + (d.xMax - d.xMin),
				numberOfHMetrics: e.glyphs.length
			}),
			y = nt.make(e.glyphs.length),
			v = mt.make({
				xAvgCharWidth: Math.round(d.advanceWidthAvg),
				usWeightClass: e.tables.os2.usWeightClass,
				usWidthClass: e.tables.os2.usWidthClass,
				usFirstCharIndex: l,
				usLastCharIndex: c,
				ulUnicodeRange1: u,
				ulUnicodeRange2: p,
				ulUnicodeRange3: h,
				ulUnicodeRange4: f,
				fsSelection: e.tables.os2.fsSelection,
				sTypoAscender: d.ascender,
				sTypoDescender: d.descender,
				sTypoLineGap: 0,
				usWinAscent: d.yMax,
				usWinDescent: Math.abs(d.yMin),
				ulCodePageRange1: 1,
				sxHeight: Lt(e, "xyvw", {
					yMax: Math.round(d.ascender / 2)
				}).yMax,
				sCapHeight: Lt(e, "HIKLEFJMNTZBDPRAGOQSUVWXY", d).yMax,
				usDefaultChar: e.hasChar(" ") ? 32 : 0,
				usBreakChar: e.hasChar(" ") ? 32 : 0
			}),
			b = et.make(e.glyphs),
			x = fe.make(e.glyphs),
			S = e.getEnglishName("fontFamily"),
			U = e.getEnglishName("fontSubfamily"),
			T = S + " " + U;
		let w = e.getEnglishName("postScriptName");
		w || (w = S.replace(/\s/g, "") + "-" + U);
		const E = {};
		for (let t in e.names) E[t] = e.names[t];
		E.uniqueID || (E.uniqueID = {
			en: e.getEnglishName("manufacturer") + ":" + T
		}), E.postScriptName || (E.postScriptName = {
			en: w
		}), E.preferredFamily || (E.preferredFamily = e.names.fontFamily), E.preferredSubfamily || (E
			.preferredSubfamily = e.names.fontSubfamily);
		const O = [],
			L = dt.make(E, O),
			k = O.length > 0 ? tt.make(O) : void 0,
			R = yt.make(),
			D = Qe.make(e.glyphs, {
				version: e.getEnglishName("version"),
				fullName: T,
				familyName: S,
				weightName: U,
				postScriptName: w,
				unitsPerEm: e.unitsPerEm,
				fontBBox: [0, d.yMin, d.ascender, d.advanceWidthMax]
			}),
			C = e.metas && Object.keys(e.metas).length > 0 ? Ut.make(e.metas) : void 0,
			M = [g, m, y, v, L, x, R, D, b];
		k && M.push(k), e.tables.gsub && M.push(St.make(e.tables.gsub)), C && M.push(C);
		const I = Ot(M),
			B = wt(I.encode()),
			N = I.fields;
		let G = !1;
		for (let e = 0; e < N.length; e += 1)
			if ("head table" === N[e].name) {
				N[e].value.checkSumAdjustment = 2981146554 - B, G = !0;
				break
			} if (!G) throw new Error("Could not find head table with checkSum to adjust.");
		return I
	},
	computeCheckSum: wt
};

function Dt(e, t) {
	let n = 0,
		o = e.length - 1;
	for (; n <= o;) {
		const r = n + o >>> 1,
			s = e[r].tag;
		if (s === t) return r;
		s < t ? n = r + 1 : o = r - 1
	}
	return -n - 1
}

function Ct(e, t) {
	this.font = e, this.tableName = t
}

function Mt(e) {
	Ct.call(this, e, "gsub")
}

function It(e, t) {
	const n = e.length;
	if (n !== t.length) return !1;
	for (let o = 0; o < n; o++)
		if (e[o] !== t[o]) return !1;
	return !0
}

function Bt(e, t, n) {
	const o = e.subtables;
	for (let e = 0; e < o.length; e++) {
		const n = o[e];
		if (n.substFormat === t) return n
	}
	if (n) return o.push(n), n
}

function Nt(e) {
	const t = new ArrayBuffer(e.length),
		n = new Uint8Array(t);
	for (let t = 0; t < e.length; ++t) n[t] = e[t];
	return t
}

function Gt(e, t) {
	if (!e) throw t
}
let Pt, At, Ft, Ht;

function zt(e) {
	this.font = e, this._fpgmState = this._prepState = void 0, this._errorState = 0
}

function Wt(e) {
	return e
}

function _t(e) {
	return Math.sign(e) * Math.round(Math.abs(e))
}

function qt(e) {
	return Math.sign(e) * Math.round(Math.abs(2 * e)) / 2
}

function Xt(e) {
	return Math.sign(e) * (Math.round(Math.abs(e) + .5) - .5)
}

function Vt(e) {
	return Math.sign(e) * Math.ceil(Math.abs(e))
}

function jt(e) {
	return Math.sign(e) * Math.floor(Math.abs(e))
}
Ct.prototype = {
	searchTag: Dt,
	binSearch: function(e, t) {
		let n = 0,
			o = e.length - 1;
		for (; n <= o;) {
			const r = n + o >>> 1,
				s = e[r];
			if (s === t) return r;
			s < t ? n = r + 1 : o = r - 1
		}
		return -n - 1
	},
	getTable: function(e) {
		let t = this.font.tables[this.tableName];
		return !t && e && (t = this.font.tables[this.tableName] = this.createDefaultTable()), t
	},
	getScriptNames: function() {
		let e = this.getTable();
		return e ? e.scripts.map((function(e) {
			return e.tag
		})) : []
	},
	getDefaultScriptName: function() {
		let e = this.getTable();
		if (!e) return;
		let t = !1;
		for (let n = 0; n < e.scripts.length; n++) {
			const o = e.scripts[n].tag;
			if ("DFLT" === o) return o;
			"latn" === o && (t = !0)
		}
		return t ? "latn" : void 0
	},
	getScriptTable: function(e, t) {
		const n = this.getTable(t);
		if (n) {
			e = e || "DFLT";
			const o = n.scripts,
				r = Dt(n.scripts, e);
			if (r >= 0) return o[r].script;
			if (t) {
				const t = {
					tag: e,
					script: {
						defaultLangSys: {
							reserved: 0,
							reqFeatureIndex: 65535,
							featureIndexes: []
						},
						langSysRecords: []
					}
				};
				return o.splice(-1 - r, 0, t), t.script
			}
		}
	},
	getLangSysTable: function(e, t, n) {
		const o = this.getScriptTable(e, n);
		if (o) {
			if (!t || "dflt" === t || "DFLT" === t) return o.defaultLangSys;
			const e = Dt(o.langSysRecords, t);
			if (e >= 0) return o.langSysRecords[e].langSys;
			if (n) {
				const n = {
					tag: t,
					langSys: {
						reserved: 0,
						reqFeatureIndex: 65535,
						featureIndexes: []
					}
				};
				return o.langSysRecords.splice(-1 - e, 0, n), n.langSys
			}
		}
	},
	getFeatureTable: function(e, t, n, o) {
		const r = this.getLangSysTable(e, t, o);
		if (r) {
			let e;
			const t = r.featureIndexes,
				s = this.font.tables[this.tableName].features;
			for (let o = 0; o < t.length; o++)
				if (e = s[t[o]], e.tag === n) return e.feature;
			if (o) {
				const o = s.length;
				return G.assert(0 === o || n >= s[o - 1].tag, "Features must be added in alphabetical order."),
					e = {
						tag: n,
						feature: {
							params: 0,
							lookupListIndexes: []
						}
					}, s.push(e), t.push(o), e.feature
			}
		}
	},
	getLookupTables: function(e, t, n, o, r) {
		const s = this.getFeatureTable(e, t, n, r),
			a = [];
		if (s) {
			let e;
			const t = s.lookupListIndexes,
				n = this.font.tables[this.tableName].lookups;
			for (let r = 0; r < t.length; r++) e = n[t[r]], e.lookupType === o && a.push(e);
			if (0 === a.length && r) {
				e = {
					lookupType: o,
					lookupFlag: 0,
					subtables: [],
					markFilteringSet: void 0
				};
				const r = n.length;
				return n.push(e), t.push(r), [e]
			}
		}
		return a
	},
	expandCoverage: function(e) {
		if (1 === e.format) return e.glyphs; {
			const t = [],
				n = e.ranges;
			for (let e = 0; e < n.length; e++) {
				const o = n[e],
					r = o.start,
					s = o.end;
				for (let e = r; e <= s; e++) t.push(e)
			}
			return t
		}
	}
}, Mt.prototype = Ct.prototype, Mt.prototype.createDefaultTable = function() {
	return {
		version: 1,
		scripts: [{
			tag: "DFLT",
			script: {
				defaultLangSys: {
					reserved: 0,
					reqFeatureIndex: 65535,
					featureIndexes: []
				},
				langSysRecords: []
			}
		}],
		features: [],
		lookups: []
	}
}, Mt.prototype.getSingle = function(e, t, n) {
	const o = [],
		r = this.getLookupTables(t, n, e, 1);
	for (let e = 0; e < r.length; e++) {
		const t = r[e].subtables;
		for (let e = 0; e < t.length; e++) {
			const n = t[e],
				r = this.expandCoverage(n.coverage);
			let s;
			if (1 === n.substFormat) {
				const e = n.deltaGlyphId;
				for (s = 0; s < r.length; s++) {
					const t = r[s];
					o.push({
						sub: t,
						by: t + e
					})
				}
			} else {
				const e = n.substitute;
				for (s = 0; s < r.length; s++) o.push({
					sub: r[s],
					by: e[s]
				})
			}
		}
	}
	return o
}, Mt.prototype.getAlternates = function(e, t, n) {
	const o = [],
		r = this.getLookupTables(t, n, e, 3);
	for (let e = 0; e < r.length; e++) {
		const t = r[e].subtables;
		for (let e = 0; e < t.length; e++) {
			const n = t[e],
				r = this.expandCoverage(n.coverage),
				s = n.alternateSets;
			for (let e = 0; e < r.length; e++) o.push({
				sub: r[e],
				by: s[e]
			})
		}
	}
	return o
}, Mt.prototype.getLigatures = function(e, t, n) {
	const o = [],
		r = this.getLookupTables(t, n, e, 4);
	for (let e = 0; e < r.length; e++) {
		const t = r[e].subtables;
		for (let e = 0; e < t.length; e++) {
			const n = t[e],
				r = this.expandCoverage(n.coverage),
				s = n.ligatureSets;
			for (let e = 0; e < r.length; e++) {
				const t = r[e],
					n = s[e];
				for (let e = 0; e < n.length; e++) {
					const r = n[e];
					o.push({
						sub: [t].concat(r.components),
						by: r.ligGlyph
					})
				}
			}
		}
	}
	return o
}, Mt.prototype.addSingle = function(e, t, n, o) {
	const r = Bt(this.getLookupTables(n, o, e, 1, !0)[0], 2, {
		substFormat: 2,
		coverage: {
			format: 1,
			glyphs: []
		},
		substitute: []
	});
	G.assert(1 === r.coverage.format, "Ligature: unable to modify coverage table format " + r.coverage.format);
	const s = t.sub;
	let a = this.binSearch(r.coverage.glyphs, s);
	a < 0 && (a = -1 - a, r.coverage.glyphs.splice(a, 0, s), r.substitute.splice(a, 0, 0)), r.substitute[a] = t.by
}, Mt.prototype.addAlternate = function(e, t, n, o) {
	const r = Bt(this.getLookupTables(n, o, e, 3, !0)[0], 1, {
		substFormat: 1,
		coverage: {
			format: 1,
			glyphs: []
		},
		alternateSets: []
	});
	G.assert(1 === r.coverage.format, "Ligature: unable to modify coverage table format " + r.coverage.format);
	const s = t.sub;
	let a = this.binSearch(r.coverage.glyphs, s);
	a < 0 && (a = -1 - a, r.coverage.glyphs.splice(a, 0, s), r.alternateSets.splice(a, 0, 0)), r.alternateSets[a] =
		t.by
}, Mt.prototype.addLigature = function(e, t, n, o) {
	const r = this.getLookupTables(n, o, e, 4, !0)[0];
	let s = r.subtables[0];
	s || (s = {
		substFormat: 1,
		coverage: {
			format: 1,
			glyphs: []
		},
		ligatureSets: []
	}, r.subtables[0] = s), G.assert(1 === s.coverage.format,
		"Ligature: unable to modify coverage table format " + s.coverage.format);
	const a = t.sub[0],
		i = t.sub.slice(1),
		l = {
			ligGlyph: t.by,
			components: i
		};
	let c = this.binSearch(s.coverage.glyphs, a);
	if (c >= 0) {
		const e = s.ligatureSets[c];
		for (let t = 0; t < e.length; t++)
			if (It(e[t].components, i)) return;
		e.push(l)
	} else c = -1 - c, s.coverage.glyphs.splice(c, 0, a), s.ligatureSets.splice(c, 0, [l])
}, Mt.prototype.getFeature = function(e, t, n) {
	if (/ss\d\d/.test(e)) return this.getSingle(e, t, n);
	switch (e) {
		case "aalt":
		case "salt":
			return this.getSingle(e, t, n).concat(this.getAlternates(e, t, n));
		case "dlig":
		case "liga":
		case "rlig":
			return this.getLigatures(e, t, n)
	}
}, Mt.prototype.add = function(e, t, n, o) {
	if (/ss\d\d/.test(e)) return this.addSingle(e, t, n, o);
	switch (e) {
		case "aalt":
		case "salt":
			return "number" == typeof t.by ? this.addSingle(e, t, n, o) : this.addAlternate(e, t, n, o);
		case "dlig":
		case "liga":
		case "rlig":
			return this.addLigature(e, t, n, o)
	}
};
const Yt = function(e) {
		const t = this.srPeriod;
		let n = this.srPhase;
		let o = 1;
		return e < 0 && (e = -e, o = -1), e += this.srThreshold - n, e = Math.trunc(e / t) * t, e += n, o > 0 && e < 0 ?
			n : o < 0 && e > 0 ? -n : e * o
	},
	Zt = {
		x: 1,
		y: 0,
		axis: "x",
		distance: function(e, t, n, o) {
			return (n ? e.xo : e.x) - (o ? t.xo : t.x)
		},
		interpolate: function(e, t, n, o) {
			let r, s, a, i, l, c, u;
			if (!o || o === this) return r = e.xo - t.xo, s = e.xo - n.xo, l = t.x - t.xo, c = n.x - n.xo, a = Math
				.abs(r), i = Math.abs(s), u = a + i, 0 === u ? void(e.x = e.xo + (l + c) / 2) : void(e.x = e
					.xo + (l * i + c * a) / u);
			r = o.distance(e, t, !0, !0), s = o.distance(e, n, !0, !0), l = o.distance(t, t, !1, !0), c = o
				.distance(n, n, !1, !0), a = Math.abs(r), i = Math.abs(s), u = a + i, 0 !== u ? Zt.setRelative(e, e,
					(l * i + c * a) / u, o, !0) : Zt.setRelative(e, e, (l + c) / 2, o, !0)
		},
		normalSlope: Number.NEGATIVE_INFINITY,
		setRelative: function(e, t, n, o, r) {
			if (!o || o === this) return void(e.x = (r ? t.xo : t.x) + n);
			const s = r ? t.xo : t.x,
				a = r ? t.yo : t.y,
				i = s + n * o.x,
				l = a + n * o.y;
			e.x = i + (e.y - l) / o.normalSlope
		},
		slope: 0,
		touch: function(e) {
			e.xTouched = !0
		},
		touched: function(e) {
			return e.xTouched
		},
		untouch: function(e) {
			e.xTouched = !1
		}
	},
	$t = {
		x: 0,
		y: 1,
		axis: "y",
		distance: function(e, t, n, o) {
			return (n ? e.yo : e.y) - (o ? t.yo : t.y)
		},
		interpolate: function(e, t, n, o) {
			let r, s, a, i, l, c, u;
			if (!o || o === this) return r = e.yo - t.yo, s = e.yo - n.yo, l = t.y - t.yo, c = n.y - n.yo, a = Math
				.abs(r), i = Math.abs(s), u = a + i, 0 === u ? void(e.y = e.yo + (l + c) / 2) : void(e.y = e
					.yo + (l * i + c * a) / u);
			r = o.distance(e, t, !0, !0), s = o.distance(e, n, !0, !0), l = o.distance(t, t, !1, !0), c = o
				.distance(n, n, !1, !0), a = Math.abs(r), i = Math.abs(s), u = a + i, 0 !== u ? $t.setRelative(e, e,
					(l * i + c * a) / u, o, !0) : $t.setRelative(e, e, (l + c) / 2, o, !0)
		},
		normalSlope: 0,
		setRelative: function(e, t, n, o, r) {
			if (!o || o === this) return void(e.y = (r ? t.yo : t.y) + n);
			const s = r ? t.xo : t.x,
				a = r ? t.yo : t.y,
				i = s + n * o.x,
				l = a + n * o.y;
			e.y = l + o.normalSlope * (e.x - i)
		},
		slope: Number.POSITIVE_INFINITY,
		touch: function(e) {
			e.yTouched = !0
		},
		touched: function(e) {
			return e.yTouched
		},
		untouch: function(e) {
			e.yTouched = !1
		}
	};

function Qt(e, t) {
	this.x = e, this.y = t, this.axis = void 0, this.slope = t / e, this.normalSlope = -e / t, Object.freeze(this)
}

function Kt(e, t) {
	const n = Math.sqrt(e * e + t * t);
	return t /= n, 1 === (e /= n) && 0 === t ? Zt : 0 === e && 1 === t ? $t : new Qt(e, t)
}

function Jt(e, t, n, o) {
	this.x = this.xo = Math.round(64 * e) / 64, this.y = this.yo = Math.round(64 * t) / 64, this.lastPointOfContour = n,
		this.onCurve = o, this.prevPointOnContour = void 0, this.nextPointOnContour = void 0, this.xTouched = !1, this
		.yTouched = !1, Object.preventExtensions(this)
}
Object.freeze(Zt), Object.freeze($t), Qt.prototype.distance = function(e, t, n, o) {
	return this.x * Zt.distance(e, t, n, o) + this.y * $t.distance(e, t, n, o)
}, Qt.prototype.interpolate = function(e, t, n, o) {
	let r, s, a, i, l, c, u;
	a = o.distance(e, t, !0, !0), i = o.distance(e, n, !0, !0), r = o.distance(t, t, !1, !0), s = o.distance(n, n, !
		1, !0), l = Math.abs(a), c = Math.abs(i), u = l + c, 0 !== u ? this.setRelative(e, e, (r * c + s * l) /
		u, o, !0) : this.setRelative(e, e, (r + s) / 2, o, !0)
}, Qt.prototype.setRelative = function(e, t, n, o, r) {
	o = o || this;
	const s = r ? t.xo : t.x,
		a = r ? t.yo : t.y,
		i = s + n * o.x,
		l = a + n * o.y,
		c = o.normalSlope,
		u = this.slope,
		p = e.x,
		h = e.y;
	e.x = (u * p - c * i + l - h) / (u - c), e.y = u * (e.x - p) + h
}, Qt.prototype.touch = function(e) {
	e.xTouched = !0, e.yTouched = !0
}, Jt.prototype.nextTouched = function(e) {
	let t = this.nextPointOnContour;
	for (; !e.touched(t) && t !== this;) t = t.nextPointOnContour;
	return t
}, Jt.prototype.prevTouched = function(e) {
	let t = this.prevPointOnContour;
	for (; !e.touched(t) && t !== this;) t = t.prevPointOnContour;
	return t
};
const en = Object.freeze(new Jt(0, 0)),
	tn = {
		cvCutIn: 17 / 16,
		deltaBase: 9,
		deltaShift: .125,
		loop: 1,
		minDis: 1,
		autoFlip: !0
	};

function nn(e, t) {
	switch (this.env = e, this.stack = [], this.prog = t, e) {
		case "glyf":
			this.zp0 = this.zp1 = this.zp2 = 1, this.rp0 = this.rp1 = this.rp2 = 0;
		case "prep":
			this.fv = this.pv = this.dpv = Zt, this.round = _t
	}
}

function on(e) {
	const t = e.tZone = new Array(e.gZone.length);
	for (let e = 0; e < t.length; e++) t[e] = new Jt(0, 0)
}

function rn(e, t) {
	const n = e.prog;
	let o, r = e.ip,
		s = 1;
	do {
		if (o = n[++r], 88 === o) s++;
		else if (89 === o) s--;
		else if (64 === o) r += n[r + 1] + 1;
		else if (65 === o) r += 2 * n[r + 1] + 1;
		else if (o >= 176 && o <= 183) r += o - 176 + 1;
		else if (o >= 184 && o <= 191) r += 2 * (o - 184 + 1);
		else if (t && 1 === s && 27 === o) break
	} while (s > 0);
	e.ip = r
}

function sn(e, t) {
	exports.DEBUG && console.log(t.step, "SVTCA[" + e.axis + "]"), t.fv = t.pv = t.dpv = e
}

function an(e, t) {
	exports.DEBUG && console.log(t.step, "SPVTCA[" + e.axis + "]"), t.pv = t.dpv = e
}

function ln(e, t) {
	exports.DEBUG && console.log(t.step, "SFVTCA[" + e.axis + "]"), t.fv = e
}

function cn(e, t) {
	const n = t.stack,
		o = n.pop(),
		r = n.pop(),
		s = t.z2[o],
		a = t.z1[r];
	let i, l;
	exports.DEBUG && console.log("SPVTL[" + e + "]", o, r), e ? (i = s.y - a.y, l = a.x - s.x) : (i = a.x - s.x, l = a
		.y - s.y), t.pv = t.dpv = Kt(i, l)
}

function un(e, t) {
	const n = t.stack,
		o = n.pop(),
		r = n.pop(),
		s = t.z2[o],
		a = t.z1[r];
	let i, l;
	exports.DEBUG && console.log("SFVTL[" + e + "]", o, r), e ? (i = s.y - a.y, l = a.x - s.x) : (i = a.x - s.x, l = a
		.y - s.y), t.fv = Kt(i, l)
}

function pn(e) {
	exports.DEBUG && console.log(e.step, "POP[]"), e.stack.pop()
}

function hn(e, t) {
	const n = t.stack.pop(),
		o = t.z0[n],
		r = t.fv,
		s = t.pv;
	exports.DEBUG && console.log(t.step, "MDAP[" + e + "]", n);
	let a = s.distance(o, en);
	e && (a = t.round(a)), r.setRelative(o, en, a, s), r.touch(o), t.rp0 = t.rp1 = n
}

function fn(e, t) {
	const n = t.z2,
		o = n.length - 2;
	let r, s, a;
	exports.DEBUG && console.log(t.step, "IUP[" + e.axis + "]");
	for (let t = 0; t < o; t++) r = n[t], e.touched(r) || (s = r.prevTouched(e), s !== r && (a = r.nextTouched(e), s ===
		a && e.setRelative(r, r, e.distance(s, s, !1, !0), e, !0), e.interpolate(r, s, a, e)))
}

function dn(e, t) {
	const n = t.stack,
		o = e ? t.rp1 : t.rp2,
		r = (e ? t.z0 : t.z1)[o],
		s = t.fv,
		a = t.pv;
	let i = t.loop;
	const l = t.z2;
	for (; i--;) {
		const o = n.pop(),
			c = l[o],
			u = a.distance(r, r, !1, !0);
		s.setRelative(c, c, u, a), s.touch(c), exports.DEBUG && console.log(t.step, (t.loop > 1 ? "loop " + (t.loop -
			i) + ": " : "") + "SHP[" + (e ? "rp1" : "rp2") + "]", o)
	}
	t.loop = 1
}

function gn(e, t) {
	const n = t.stack,
		o = e ? t.rp1 : t.rp2,
		r = (e ? t.z0 : t.z1)[o],
		s = t.fv,
		a = t.pv,
		i = n.pop(),
		l = t.z2[t.contours[i]];
	let c = l;
	exports.DEBUG && console.log(t.step, "SHC[" + e + "]", i);
	const u = a.distance(r, r, !1, !0);
	do {
		c !== r && s.setRelative(c, c, u, a), c = c.nextPointOnContour
	} while (c !== l)
}

function mn(e, t) {
	const n = t.stack,
		o = e ? t.rp1 : t.rp2,
		r = (e ? t.z0 : t.z1)[o],
		s = t.fv,
		a = t.pv,
		i = n.pop();
	let l, c;
	switch (exports.DEBUG && console.log(t.step, "SHZ[" + e + "]", i), i) {
		case 0:
			l = t.tZone;
			break;
		case 1:
			l = t.gZone;
			break;
		default:
			throw new Error("Invalid zone")
	}
	const u = a.distance(r, r, !1, !0),
		p = l.length - 2;
	for (let e = 0; e < p; e++) c = l[e], c !== r && s.setRelative(c, c, u, a)
}

function yn(e, t) {
	const n = t.stack,
		o = n.pop() / 64,
		r = n.pop(),
		s = t.z1[r],
		a = t.z0[t.rp0],
		i = t.fv,
		l = t.pv;
	i.setRelative(s, a, o, l), i.touch(s), exports.DEBUG && console.log(t.step, "MSIRP[" + e + "]", o, r), t.rp1 = t
		.rp0, t.rp2 = r, e && (t.rp0 = r)
}

function vn(e, t) {
	const n = t.stack,
		o = n.pop(),
		r = n.pop(),
		s = t.z0[r],
		a = t.fv,
		i = t.pv;
	let l = t.cvt[o];
	e && (l = t.round(l)), exports.DEBUG && console.log(t.step, "MIAP[" + e + "]", o, "(", l, ")", r), a.setRelative(s,
		en, l, i), 0 === t.zp0 && (s.xo = s.x, s.yo = s.y), a.touch(s), t.rp0 = t.rp1 = r
}

function bn(e, t) {
	const n = t.stack,
		o = n.pop(),
		r = t.z2[o];
	exports.DEBUG && console.log(t.step, "GC[" + e + "]", o), n.push(64 * t.dpv.distance(r, en, e, !1))
}

function xn(e, t) {
	const n = t.stack,
		o = n.pop(),
		r = n.pop(),
		s = t.z1[o],
		a = t.z0[r],
		i = t.dpv.distance(a, s, e, e);
	exports.DEBUG && console.log(t.step, "MD[" + e + "]", o, r, "->", i), t.stack.push(Math.round(64 * i))
}

function Sn(e, t) {
	const n = t.stack,
		o = n.pop(),
		r = t.fv,
		s = t.pv,
		a = t.ppem,
		i = t.deltaBase + 16 * (e - 1),
		l = t.deltaShift,
		c = t.z0;
	exports.DEBUG && console.log(t.step, "DELTAP[" + e + "]", o, n);
	for (let e = 0; e < o; e++) {
		const e = n.pop(),
			o = n.pop();
		if (i + ((240 & o) >> 4) !== a) continue;
		let u = (15 & o) - 8;
		u >= 0 && u++, exports.DEBUG && console.log(t.step, "DELTAPFIX", e, "by", u * l);
		const p = c[e];
		r.setRelative(p, p, u * l, s)
	}
}

function Un(e, t) {
	const n = t.stack,
		o = n.pop();
	exports.DEBUG && console.log(t.step, "ROUND[]"), n.push(64 * t.round(o / 64))
}

function Tn(e, t) {
	const n = t.stack,
		o = n.pop(),
		r = t.ppem,
		s = t.deltaBase + 16 * (e - 1),
		a = t.deltaShift;
	exports.DEBUG && console.log(t.step, "DELTAC[" + e + "]", o, n);
	for (let e = 0; e < o; e++) {
		const e = n.pop(),
			o = n.pop();
		if (s + ((240 & o) >> 4) !== r) continue;
		let i = (15 & o) - 8;
		i >= 0 && i++;
		const l = i * a;
		exports.DEBUG && console.log(t.step, "DELTACFIX", e, "by", l), t.cvt[e] += l
	}
}

function wn(e, t) {
	const n = t.stack,
		o = n.pop(),
		r = n.pop(),
		s = t.z2[o],
		a = t.z1[r];
	let i, l;
	exports.DEBUG && console.log("SDPVTL[" + e + "]", o, r), e ? (i = s.y - a.y, l = a.x - s.x) : (i = a.x - s.x, l = a
		.y - s.y), t.dpv = Kt(i, l)
}

function En(e, t) {
	const n = t.stack,
		o = t.prog;
	let r = t.ip;
	exports.DEBUG && console.log(t.step, "PUSHB[" + e + "]");
	for (let t = 0; t < e; t++) n.push(o[++r]);
	t.ip = r
}

function On(e, t) {
	let n = t.ip;
	const o = t.prog,
		r = t.stack;
	exports.DEBUG && console.log(t.ip, "PUSHW[" + e + "]");
	for (let t = 0; t < e; t++) {
		let e = o[++n] << 8 | o[++n];
		32768 & e && (e = -(1 + (65535 ^ e))), r.push(e)
	}
	t.ip = n
}

function Ln(e, t, n, o, r, s) {
	const a = s.stack,
		i = e && a.pop(),
		l = a.pop(),
		c = s.rp0,
		u = s.z0[c],
		p = s.z1[l],
		h = s.minDis,
		f = s.fv,
		d = s.dpv;
	let g, m, y, v;
	m = g = d.distance(p, u, !0, !0), y = m >= 0 ? 1 : -1, m = Math.abs(m), e && (v = s.cvt[i], o && Math.abs(m - v) < s
		.cvCutIn && (m = v)), n && m < h && (m = h), o && (m = s.round(m)), f.setRelative(p, u, y * m, d), f.touch(
		p), exports.DEBUG && console.log(s.step, (e ? "MIRP[" : "MDRP[") + (t ? "M" : "m") + (n ? ">" : "_") + (o ?
			"R" : "_") + (0 === r ? "Gr" : 1 === r ? "Bl" : 2 === r ? "Wh" : "") + "]", e ? i + "(" + s.cvt[i] +
		"," + v + ")" : "", l, "(d =", g, "->", y * m, ")"), s.rp1 = s.rp0, s.rp2 = l, t && (s.rp0 = l)
}

function kn(e) {
	(e = e || {}).empty || (Gt(e.familyName, "When creating a new Font object, familyName is required."), Gt(e
				.styleName, "When creating a new Font object, styleName is required."), Gt(e.unitsPerEm,
				"When creating a new Font object, unitsPerEm is required."), Gt(e.ascender,
				"When creating a new Font object, ascender is required."), Gt(e.descender,
				"When creating a new Font object, descender is required."), Gt(e.descender < 0,
				"Descender should be negative (e.g. -512)."), this.names = {
				fontFamily: {
					en: e.familyName || " "
				},
				fontSubfamily: {
					en: e.styleName || " "
				},
				fullName: {
					en: e.fullName || e.familyName + " " + e.styleName
				},
				postScriptName: {
					en: e.postScriptName || e.familyName + e.styleName
				},
				designer: {
					en: e.designer || " "
				},
				designerURL: {
					en: e.designerURL || " "
				},
				manufacturer: {
					en: e.manufacturer || " "
				},
				manufacturerURL: {
					en: e.manufacturerURL || " "
				},
				license: {
					en: e.license || " "
				},
				licenseURL: {
					en: e.licenseURL || " "
				},
				version: {
					en: e.version || "Version 0.1"
				},
				description: {
					en: e.description || " "
				},
				copyright: {
					en: e.copyright || " "
				},
				trademark: {
					en: e.trademark || " "
				}
			}, this.unitsPerEm = e.unitsPerEm || 1e3, this.ascender = e.ascender, this.descender = e.descender, this
			.createdTimestamp = e.createdTimestamp, this.tables = {
				os2: {
					usWeightClass: e.weightClass || this.usWeightClasses.MEDIUM,
					usWidthClass: e.widthClass || this.usWidthClasses.MEDIUM,
					fsSelection: e.fsSelection || this.fsSelectionValues.REGULAR
				}
			}), this.supported = !0, this.glyphs = new Me.GlyphSet(this, e.glyphs || []), this.encoding = new ve(this),
		this.substitution = new Mt(this), this.tables = this.tables || {}, Object.defineProperty(this, "hinting", {
			get: function() {
				return this._hinting ? this._hinting : "truetype" === this.outlinesFormat ? this._hinting =
					new zt(this) : void 0
			}
		})
}

function Rn(e, t) {
	const n = JSON.stringify(e);
	let o = 256;
	for (let e in t) {
		let r = parseInt(e);
		if (r && !(r < 256)) {
			if (JSON.stringify(t[e]) === n) return r;
			o <= r && (o = r + 1)
		}
	}
	return t[o] = e, o
}

function Dn(e, t, n) {
	const o = Rn(t.name, n);
	return [{
		name: "tag_" + e,
		type: "TAG",
		value: t.tag
	}, {
		name: "minValue_" + e,
		type: "FIXED",
		value: t.minValue << 16
	}, {
		name: "defaultValue_" + e,
		type: "FIXED",
		value: t.defaultValue << 16
	}, {
		name: "maxValue_" + e,
		type: "FIXED",
		value: t.maxValue << 16
	}, {
		name: "flags_" + e,
		type: "USHORT",
		value: 0
	}, {
		name: "nameID_" + e,
		type: "USHORT",
		value: o
	}]
}

function Cn(e, t, n) {
	const o = {},
		r = new pe.Parser(e, t);
	return o.tag = r.parseTag(), o.minValue = r.parseFixed(), o.defaultValue = r.parseFixed(), o.maxValue = r
		.parseFixed(), r.skip("uShort", 1), o.name = n[r.parseUShort()] || {}, o
}

function Mn(e, t, n, o) {
	const r = [{
		name: "nameID_" + e,
		type: "USHORT",
		value: Rn(t.name, o)
	}, {
		name: "flags_" + e,
		type: "USHORT",
		value: 0
	}];
	for (let o = 0; o < n.length; ++o) {
		const s = n[o].tag;
		r.push({
			name: "axis_" + e + " " + s,
			type: "FIXED",
			value: t.coordinates[s] << 16
		})
	}
	return r
}

function In(e, t, n, o) {
	const r = {},
		s = new pe.Parser(e, t);
	r.name = o[s.parseUShort()] || {}, s.skip("uShort", 1), r.coordinates = {};
	for (let e = 0; e < n.length; ++e) r.coordinates[n[e].tag] = s.parseFixed();
	return r
}
zt.prototype.exec = function(e, t) {
	if ("number" != typeof t) throw new Error("Point size is not a number!");
	if (this._errorState > 2) return;
	const n = this.font;
	let o = this._prepState;
	if (!o || o.ppem !== t) {
		let e = this._fpgmState;
		if (!e) {
			nn.prototype = tn, e = this._fpgmState = new nn("fpgm", n.tables.fpgm), e.funcs = [], e.font = n,
				exports.DEBUG && (console.log("---EXEC FPGM---"), e.step = -1);
			try {
				At(e)
			} catch (e) {
				return console.log("Hinting error in FPGM:" + e), void(this._errorState = 3)
			}
		}
		nn.prototype = e, o = this._prepState = new nn("prep", n.tables.prep), o.ppem = t;
		const r = n.tables.cvt;
		if (r) {
			const e = o.cvt = new Array(r.length),
				s = t / n.unitsPerEm;
			for (let t = 0; t < r.length; t++) e[t] = r[t] * s
		} else o.cvt = [];
		exports.DEBUG && (console.log("---EXEC PREP---"), o.step = -1);
		try {
			At(o)
		} catch (e) {
			this._errorState < 2 && console.log("Hinting error in PREP:" + e), this._errorState = 2
		}
	}
	if (!(this._errorState > 1)) try {
		return Ft(e, o)
	} catch (e) {
		return this._errorState < 1 && (console.log("Hinting error:" + e), console.log(
			"Note: further hinting errors are silenced")), void(this._errorState = 1)
	}
}, Ft = function(e, t) {
	const n = t.ppem / t.font.unitsPerEm,
		o = n;
	let r, s, a, i = e.components;
	if (nn.prototype = t, i) {
		const l = t.font;
		s = [], r = [];
		for (let e = 0; e < i.length; e++) {
			const t = i[e],
				c = l.glyphs.get(t.glyphIndex);
			a = new nn("glyf", c.instructions), exports.DEBUG && (console.log("---EXEC COMP " + e + "---"), a
				.step = -1), Ht(c, a, n, o);
			const u = Math.round(t.dx * n),
				p = Math.round(t.dy * o),
				h = a.gZone,
				f = a.contours;
			for (let e = 0; e < h.length; e++) {
				const t = h[e];
				t.xTouched = t.yTouched = !1, t.xo = t.x = t.x + u, t.yo = t.y = t.y + p
			}
			const d = s.length;
			s.push.apply(s, h);
			for (let e = 0; e < f.length; e++) r.push(f[e] + d)
		}
		e.instructions && !a.inhibitGridFit && (a = new nn("glyf", e.instructions), a.gZone = a.z0 = a.z1 = a.z2 =
			s, a.contours = r, s.push(new Jt(0, 0), new Jt(Math.round(e.advanceWidth * n), 0)), exports.DEBUG &&
			(console.log("---EXEC COMPOSITE---"), a.step = -1), At(a), s.length -= 2)
	} else a = new nn("glyf", e.instructions), exports.DEBUG && (console.log("---EXEC GLYPH---"), a.step = -1), Ht(
		e, a, n, o), s = a.gZone;
	return s
}, Ht = function(e, t, n, o) {
	const r = e.points || [],
		s = r.length,
		a = t.gZone = t.z0 = t.z1 = t.z2 = [],
		i = t.contours = [];
	let l, c, u;
	for (let e = 0; e < s; e++) l = r[e], a[e] = new Jt(l.x * n, l.y * o, l.lastPointOfContour, l.onCurve);
	for (let e = 0; e < s; e++) l = a[e], c || (c = l, i.push(e)), l.lastPointOfContour ? (l.nextPointOnContour = c,
		c.prevPointOnContour = l, c = void 0) : (u = a[e + 1], l.nextPointOnContour = u, u.prevPointOnContour =
		l);
	if (!t.inhibitGridFit && (a.push(new Jt(0, 0), new Jt(Math.round(e.advanceWidth * n), 0)), At(t), a.length -= 2,
			exports.DEBUG)) {
		console.log("FINISHED GLYPH", t.stack);
		for (let e = 0; e < s; e++) console.log(e, a[e].x, a[e].y)
	}
}, At = function(e) {
	let t = e.prog;
	if (!t) return;
	const n = t.length;
	let o;
	for (e.ip = 0; e.ip < n; e.ip++) {
		if (exports.DEBUG && e.step++, o = Pt[t[e.ip]], !o) throw new Error("unknown instruction: 0x" + Number(t[e
			.ip]).toString(16));
		o(e)
	}
}, Pt = [sn.bind(void 0, $t), sn.bind(void 0, Zt), an.bind(void 0, $t), an.bind(void 0, Zt), ln.bind(void 0, $t), ln
	.bind(void 0, Zt), cn.bind(void 0, 0), cn.bind(void 0, 1), un.bind(void 0, 0), un.bind(void 0, 1),
	function(e) {
		const t = e.stack,
			n = t.pop(),
			o = t.pop();
		exports.DEBUG && console.log(e.step, "SPVFS[]", n, o), e.pv = e.dpv = Kt(o, n)
	},
	function(e) {
		const t = e.stack,
			n = t.pop(),
			o = t.pop();
		exports.DEBUG && console.log(e.step, "SPVFS[]", n, o), e.fv = Kt(o, n)
	},
	function(e) {
		const t = e.stack,
			n = e.pv;
		exports.DEBUG && console.log(e.step, "GPV[]"), t.push(16384 * n.x), t.push(16384 * n.y)
	},
	function(e) {
		const t = e.stack,
			n = e.fv;
		exports.DEBUG && console.log(e.step, "GFV[]"), t.push(16384 * n.x), t.push(16384 * n.y)
	},
	function(e) {
		e.fv = e.pv, exports.DEBUG && console.log(e.step, "SFVTPV[]")
	},
	function(e) {
		const t = e.stack,
			n = t.pop(),
			o = t.pop(),
			r = t.pop(),
			s = t.pop(),
			a = t.pop(),
			i = e.z0,
			l = e.z1,
			c = i[n],
			u = i[o],
			p = l[r],
			h = l[s],
			f = e.z2[a];
		exports.DEBUG && console.log("ISECT[], ", n, o, r, s, a);
		const d = c.x,
			g = c.y,
			m = u.x,
			y = u.y,
			v = p.x,
			b = p.y,
			x = h.x,
			S = h.y,
			U = (d - m) * (b - S) - (g - y) * (v - x),
			T = d * y - g * m,
			w = v * S - b * x;
		f.x = (T * (v - x) - w * (d - m)) / U, f.y = (T * (b - S) - w * (g - y)) / U
	},
	function(e) {
		e.rp0 = e.stack.pop(), exports.DEBUG && console.log(e.step, "SRP0[]", e.rp0)
	},
	function(e) {
		e.rp1 = e.stack.pop(), exports.DEBUG && console.log(e.step, "SRP1[]", e.rp1)
	},
	function(e) {
		e.rp2 = e.stack.pop(), exports.DEBUG && console.log(e.step, "SRP2[]", e.rp2)
	},
	function(e) {
		const t = e.stack.pop();
		switch (exports.DEBUG && console.log(e.step, "SZP0[]", t), e.zp0 = t, t) {
			case 0:
				e.tZone || on(e), e.z0 = e.tZone;
				break;
			case 1:
				e.z0 = e.gZone;
				break;
			default:
				throw new Error("Invalid zone pointer")
		}
	},
	function(e) {
		const t = e.stack.pop();
		switch (exports.DEBUG && console.log(e.step, "SZP1[]", t), e.zp1 = t, t) {
			case 0:
				e.tZone || on(e), e.z1 = e.tZone;
				break;
			case 1:
				e.z1 = e.gZone;
				break;
			default:
				throw new Error("Invalid zone pointer")
		}
	},
	function(e) {
		const t = e.stack.pop();
		switch (exports.DEBUG && console.log(e.step, "SZP2[]", t), e.zp2 = t, t) {
			case 0:
				e.tZone || on(e), e.z2 = e.tZone;
				break;
			case 1:
				e.z2 = e.gZone;
				break;
			default:
				throw new Error("Invalid zone pointer")
		}
	},
	function(e) {
		const t = e.stack.pop();
		switch (exports.DEBUG && console.log(e.step, "SZPS[]", t), e.zp0 = e.zp1 = e.zp2 = t, t) {
			case 0:
				e.tZone || on(e), e.z0 = e.z1 = e.z2 = e.tZone;
				break;
			case 1:
				e.z0 = e.z1 = e.z2 = e.gZone;
				break;
			default:
				throw new Error("Invalid zone pointer")
		}
	},
	function(e) {
		e.loop = e.stack.pop(), exports.DEBUG && console.log(e.step, "SLOOP[]", e.loop)
	},
	function(e) {
		exports.DEBUG && console.log(e.step, "RTG[]"), e.round = _t
	},
	function(e) {
		exports.DEBUG && console.log(e.step, "RTHG[]"), e.round = Xt
	},
	function(e) {
		const t = e.stack.pop();
		exports.DEBUG && console.log(e.step, "SMD[]", t), e.minDis = t / 64
	},
	function(e) {
		exports.DEBUG && console.log(e.step, "ELSE[]"), rn(e, !1)
	},
	function(e) {
		const t = e.stack.pop();
		exports.DEBUG && console.log(e.step, "JMPR[]", t), e.ip += t - 1
	},
	function(e) {
		const t = e.stack.pop();
		exports.DEBUG && console.log(e.step, "SCVTCI[]", t), e.cvCutIn = t / 64
	},
	void 0, void 0,
	function(e) {
		const t = e.stack;
		exports.DEBUG && console.log(e.step, "DUP[]"), t.push(t[t.length - 1])
	},
	pn,
	function(e) {
		exports.DEBUG && console.log(e.step, "CLEAR[]"), e.stack.length = 0
	},
	function(e) {
		const t = e.stack,
			n = t.pop(),
			o = t.pop();
		exports.DEBUG && console.log(e.step, "SWAP[]"), t.push(n), t.push(o)
	},
	function(e) {
		const t = e.stack;
		exports.DEBUG && console.log(e.step, "DEPTH[]"), t.push(t.length)
	},
	function(e) {
		const t = e.stack,
			n = t.pop();
		exports.DEBUG && console.log(e.step, "CINDEX[]", n), t.push(t[t.length - n])
	},
	function(e) {
		const t = e.stack,
			n = t.pop();
		exports.DEBUG && console.log(e.step, "MINDEX[]", n), t.push(t.splice(t.length - n, 1)[0])
	},
	void 0, void 0, void 0,
	function(e) {
		const t = e.stack,
			n = t.pop(),
			o = t.pop();
		exports.DEBUG && console.log(e.step, "LOOPCALL[]", n, o);
		const r = e.ip,
			s = e.prog;
		e.prog = e.funcs[n];
		for (let t = 0; t < o; t++) At(e), exports.DEBUG && console.log(++e.step, t + 1 < o ? "next loopcall" :
			"done loopcall", t);
		e.ip = r, e.prog = s
	},
	function(e) {
		const t = e.stack.pop();
		exports.DEBUG && console.log(e.step, "CALL[]", t);
		const n = e.ip,
			o = e.prog;
		e.prog = e.funcs[t], At(e), e.ip = n, e.prog = o, exports.DEBUG && console.log(++e.step, "returning from",
			t)
	},
	function(e) {
		if ("fpgm" !== e.env) throw new Error("FDEF not allowed here");
		const t = e.stack,
			n = e.prog;
		let o = e.ip;
		const r = t.pop(),
			s = o;
		for (exports.DEBUG && console.log(e.step, "FDEF[]", r); 45 !== n[++o];);
		e.ip = o, e.funcs[r] = n.slice(s + 1, o)
	},
	void 0, hn.bind(void 0, 0), hn.bind(void 0, 1), fn.bind(void 0, $t), fn.bind(void 0, Zt), dn.bind(void 0, 0), dn
	.bind(void 0, 1), gn.bind(void 0, 0), gn.bind(void 0, 1), mn.bind(void 0, 0), mn.bind(void 0, 1),
	function(e) {
		const t = e.stack;
		let n = e.loop;
		const o = e.fv,
			r = t.pop() / 64,
			s = e.z2;
		for (; n--;) {
			const a = t.pop(),
				i = s[a];
			exports.DEBUG && console.log(e.step, (e.loop > 1 ? "loop " + (e.loop - n) + ": " : "") + "SHPIX[]", a,
				r), o.setRelative(i, i, r), o.touch(i)
		}
		e.loop = 1
	},
	function(e) {
		const t = e.stack,
			n = e.rp1,
			o = e.rp2;
		let r = e.loop;
		const s = e.z0[n],
			a = e.z1[o],
			i = e.fv,
			l = e.dpv,
			c = e.z2;
		for (; r--;) {
			const u = t.pop(),
				p = c[u];
			exports.DEBUG && console.log(e.step, (e.loop > 1 ? "loop " + (e.loop - r) + ": " : "") + "IP[]", u, n,
				"<->", o), i.interpolate(p, s, a, l), i.touch(p)
		}
		e.loop = 1
	},
	yn.bind(void 0, 0), yn.bind(void 0, 1),
	function(e) {
		const t = e.stack,
			n = e.rp0,
			o = e.z0[n];
		let r = e.loop;
		const s = e.fv,
			a = e.pv,
			i = e.z1;
		for (; r--;) {
			const n = t.pop(),
				l = i[n];
			exports.DEBUG && console.log(e.step, (e.loop > 1 ? "loop " + (e.loop - r) + ": " : "") + "ALIGNRP[]",
				n), s.setRelative(l, o, 0, a), s.touch(l)
		}
		e.loop = 1
	},
	function(e) {
		exports.DEBUG && console.log(e.step, "RTDG[]"), e.round = qt
	},
	vn.bind(void 0, 0), vn.bind(void 0, 1),
	function(e) {
		const t = e.prog;
		let n = e.ip;
		const o = e.stack,
			r = t[++n];
		exports.DEBUG && console.log(e.step, "NPUSHB[]", r);
		for (let e = 0; e < r; e++) o.push(t[++n]);
		e.ip = n
	},
	function(e) {
		let t = e.ip;
		const n = e.prog,
			o = e.stack,
			r = n[++t];
		exports.DEBUG && console.log(e.step, "NPUSHW[]", r);
		for (let e = 0; e < r; e++) {
			let e = n[++t] << 8 | n[++t];
			32768 & e && (e = -(1 + (65535 ^ e))), o.push(e)
		}
		e.ip = t
	},
	function(e) {
		const t = e.stack;
		let n = e.store;
		n || (n = e.store = []);
		const o = t.pop(),
			r = t.pop();
		exports.DEBUG && console.log(e.step, "WS", o, r), n[r] = o
	},
	function(e) {
		const t = e.stack,
			n = e.store,
			o = t.pop();
		exports.DEBUG && console.log(e.step, "RS", o);
		const r = n && n[o] || 0;
		t.push(r)
	},
	function(e) {
		const t = e.stack,
			n = t.pop(),
			o = t.pop();
		exports.DEBUG && console.log(e.step, "WCVTP", n, o), e.cvt[o] = n / 64
	},
	function(e) {
		const t = e.stack,
			n = t.pop();
		exports.DEBUG && console.log(e.step, "RCVT", n), t.push(64 * e.cvt[n])
	},
	bn.bind(void 0, 0), bn.bind(void 0, 1), void 0, xn.bind(void 0, 0), xn.bind(void 0, 1),
	function(e) {
		exports.DEBUG && console.log(e.step, "MPPEM[]"), e.stack.push(e.ppem)
	},
	void 0,
	function(e) {
		exports.DEBUG && console.log(e.step, "FLIPON[]"), e.autoFlip = !0
	},
	void 0, void 0,
	function(e) {
		const t = e.stack,
			n = t.pop(),
			o = t.pop();
		exports.DEBUG && console.log(e.step, "LT[]", n, o), t.push(o < n ? 1 : 0)
	},
	function(e) {
		const t = e.stack,
			n = t.pop(),
			o = t.pop();
		exports.DEBUG && console.log(e.step, "LTEQ[]", n, o), t.push(o <= n ? 1 : 0)
	},
	function(e) {
		const t = e.stack,
			n = t.pop(),
			o = t.pop();
		exports.DEBUG && console.log(e.step, "GT[]", n, o), t.push(o > n ? 1 : 0)
	},
	function(e) {
		const t = e.stack,
			n = t.pop(),
			o = t.pop();
		exports.DEBUG && console.log(e.step, "GTEQ[]", n, o), t.push(o >= n ? 1 : 0)
	},
	function(e) {
		const t = e.stack,
			n = t.pop(),
			o = t.pop();
		exports.DEBUG && console.log(e.step, "EQ[]", n, o), t.push(n === o ? 1 : 0)
	},
	function(e) {
		const t = e.stack,
			n = t.pop(),
			o = t.pop();
		exports.DEBUG && console.log(e.step, "NEQ[]", n, o), t.push(n !== o ? 1 : 0)
	},
	function(e) {
		const t = e.stack,
			n = t.pop();
		exports.DEBUG && console.log(e.step, "ODD[]", n), t.push(Math.trunc(n) % 2 ? 1 : 0)
	},
	function(e) {
		const t = e.stack,
			n = t.pop();
		exports.DEBUG && console.log(e.step, "EVEN[]", n), t.push(Math.trunc(n) % 2 ? 0 : 1)
	},
	function(e) {
		let t = e.stack.pop();
		exports.DEBUG && console.log(e.step, "IF[]", t), t || (rn(e, !0), exports.DEBUG && console.log(e.step,
			"EIF[]"))
	},
	function(e) {
		exports.DEBUG && console.log(e.step, "EIF[]")
	},
	function(e) {
		const t = e.stack,
			n = t.pop(),
			o = t.pop();
		exports.DEBUG && console.log(e.step, "AND[]", n, o), t.push(n && o ? 1 : 0)
	},
	function(e) {
		const t = e.stack,
			n = t.pop(),
			o = t.pop();
		exports.DEBUG && console.log(e.step, "OR[]", n, o), t.push(n || o ? 1 : 0)
	},
	function(e) {
		const t = e.stack,
			n = t.pop();
		exports.DEBUG && console.log(e.step, "NOT[]", n), t.push(n ? 0 : 1)
	},
	Sn.bind(void 0, 1),
	function(e) {
		const t = e.stack.pop();
		exports.DEBUG && console.log(e.step, "SDB[]", t), e.deltaBase = t
	},
	function(e) {
		const t = e.stack.pop();
		exports.DEBUG && console.log(e.step, "SDS[]", t), e.deltaShift = Math.pow(.5, t)
	},
	function(e) {
		const t = e.stack,
			n = t.pop(),
			o = t.pop();
		exports.DEBUG && console.log(e.step, "ADD[]", n, o), t.push(o + n)
	},
	function(e) {
		const t = e.stack,
			n = t.pop(),
			o = t.pop();
		exports.DEBUG && console.log(e.step, "SUB[]", n, o), t.push(o - n)
	},
	function(e) {
		const t = e.stack,
			n = t.pop(),
			o = t.pop();
		exports.DEBUG && console.log(e.step, "DIV[]", n, o), t.push(64 * o / n)
	},
	function(e) {
		const t = e.stack,
			n = t.pop(),
			o = t.pop();
		exports.DEBUG && console.log(e.step, "MUL[]", n, o), t.push(o * n / 64)
	},
	function(e) {
		const t = e.stack,
			n = t.pop();
		exports.DEBUG && console.log(e.step, "ABS[]", n), t.push(Math.abs(n))
	},
	function(e) {
		const t = e.stack;
		let n = t.pop();
		exports.DEBUG && console.log(e.step, "NEG[]", n), t.push(-n)
	},
	function(e) {
		const t = e.stack,
			n = t.pop();
		exports.DEBUG && console.log(e.step, "FLOOR[]", n), t.push(64 * Math.floor(n / 64))
	},
	function(e) {
		const t = e.stack,
			n = t.pop();
		exports.DEBUG && console.log(e.step, "CEILING[]", n), t.push(64 * Math.ceil(n / 64))
	},
	Un.bind(void 0, 0), Un.bind(void 0, 1), Un.bind(void 0, 2), Un.bind(void 0, 3), void 0, void 0, void 0, void 0,
	function(e) {
		const t = e.stack,
			n = t.pop(),
			o = t.pop();
		exports.DEBUG && console.log(e.step, "WCVTF[]", n, o), e.cvt[o] = n * e.ppem / e.font.unitsPerEm
	},
	Sn.bind(void 0, 2), Sn.bind(void 0, 3), Tn.bind(void 0, 1), Tn.bind(void 0, 2), Tn.bind(void 0, 3),
	function(e) {
		let t, n = e.stack.pop();
		switch (exports.DEBUG && console.log(e.step, "SROUND[]", n), e.round = Yt, 192 & n) {
			case 0:
				t = .5;
				break;
			case 64:
				t = 1;
				break;
			case 128:
				t = 2;
				break;
			default:
				throw new Error("invalid SROUND value")
		}
		switch (e.srPeriod = t, 48 & n) {
			case 0:
				e.srPhase = 0;
				break;
			case 16:
				e.srPhase = .25 * t;
				break;
			case 32:
				e.srPhase = .5 * t;
				break;
			case 48:
				e.srPhase = .75 * t;
				break;
			default:
				throw new Error("invalid SROUND value")
		}
		n &= 15, e.srThreshold = 0 === n ? 0 : (n / 8 - .5) * t
	},
	function(e) {
		let t, n = e.stack.pop();
		switch (exports.DEBUG && console.log(e.step, "S45ROUND[]", n), e.round = Yt, 192 & n) {
			case 0:
				t = Math.sqrt(2) / 2;
				break;
			case 64:
				t = Math.sqrt(2);
				break;
			case 128:
				t = 2 * Math.sqrt(2);
				break;
			default:
				throw new Error("invalid S45ROUND value")
		}
		switch (e.srPeriod = t, 48 & n) {
			case 0:
				e.srPhase = 0;
				break;
			case 16:
				e.srPhase = .25 * t;
				break;
			case 32:
				e.srPhase = .5 * t;
				break;
			case 48:
				e.srPhase = .75 * t;
				break;
			default:
				throw new Error("invalid S45ROUND value")
		}
		n &= 15, e.srThreshold = 0 === n ? 0 : (n / 8 - .5) * t
	},
	void 0, void 0,
	function(e) {
		exports.DEBUG && console.log(e.step, "ROFF[]"), e.round = Wt
	},
	void 0,
	function(e) {
		exports.DEBUG && console.log(e.step, "RUTG[]"), e.round = Vt
	},
	function(e) {
		exports.DEBUG && console.log(e.step, "RDTG[]"), e.round = jt
	},
	pn, pn, void 0, void 0, void 0, void 0, void 0,
	function(e) {
		const t = e.stack.pop();
		exports.DEBUG && console.log(e.step, "SCANCTRL[]", t)
	},
	wn.bind(void 0, 0), wn.bind(void 0, 1),
	function(e) {
		const t = e.stack,
			n = t.pop();
		let o = 0;
		exports.DEBUG && console.log(e.step, "GETINFO[]", n), 1 & n && (o = 35), 32 & n && (o |= 4096), t.push(o)
	},
	void 0,
	function(e) {
		const t = e.stack,
			n = t.pop(),
			o = t.pop(),
			r = t.pop();
		exports.DEBUG && console.log(e.step, "ROLL[]"), t.push(o), t.push(n), t.push(r)
	},
	function(e) {
		const t = e.stack,
			n = t.pop(),
			o = t.pop();
		exports.DEBUG && console.log(e.step, "MAX[]", n, o), t.push(Math.max(o, n))
	},
	function(e) {
		const t = e.stack,
			n = t.pop(),
			o = t.pop();
		exports.DEBUG && console.log(e.step, "MIN[]", n, o), t.push(Math.min(o, n))
	},
	function(e) {
		const t = e.stack.pop();
		exports.DEBUG && console.log(e.step, "SCANTYPE[]", t)
	},
	function(e) {
		const t = e.stack.pop();
		let n = e.stack.pop();
		switch (exports.DEBUG && console.log(e.step, "INSTCTRL[]", t, n), t) {
			case 1:
				return void(e.inhibitGridFit = !!n);
			case 2:
				return void(e.ignoreCvt = !!n);
			default:
				throw new Error("invalid INSTCTRL[] selector")
		}
	},
	void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0,
	void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0,
	void 0, void 0, void 0, void 0, void 0, En.bind(void 0, 1), En.bind(void 0, 2), En.bind(void 0, 3), En.bind(
		void 0, 4), En.bind(void 0, 5), En.bind(void 0, 6), En.bind(void 0, 7), En.bind(void 0, 8), On.bind(void 0,
		1), On.bind(void 0, 2), On.bind(void 0, 3), On.bind(void 0, 4), On.bind(void 0, 5), On.bind(void 0, 6), On
	.bind(void 0, 7), On.bind(void 0, 8), Ln.bind(void 0, 0, 0, 0, 0, 0), Ln.bind(void 0, 0, 0, 0, 0, 1), Ln.bind(
		void 0, 0, 0, 0, 0, 2), Ln.bind(void 0, 0, 0, 0, 0, 3), Ln.bind(void 0, 0, 0, 0, 1, 0), Ln.bind(void 0, 0,
		0, 0, 1, 1), Ln.bind(void 0, 0, 0, 0, 1, 2), Ln.bind(void 0, 0, 0, 0, 1, 3), Ln.bind(void 0, 0, 0, 1, 0, 0),
	Ln.bind(void 0, 0, 0, 1, 0, 1), Ln.bind(void 0, 0, 0, 1, 0, 2), Ln.bind(void 0, 0, 0, 1, 0, 3), Ln.bind(void 0,
		0, 0, 1, 1, 0), Ln.bind(void 0, 0, 0, 1, 1, 1), Ln.bind(void 0, 0, 0, 1, 1, 2), Ln.bind(void 0, 0, 0, 1, 1,
		3), Ln.bind(void 0, 0, 1, 0, 0, 0), Ln.bind(void 0, 0, 1, 0, 0, 1), Ln.bind(void 0, 0, 1, 0, 0, 2), Ln.bind(
		void 0, 0, 1, 0, 0, 3), Ln.bind(void 0, 0, 1, 0, 1, 0), Ln.bind(void 0, 0, 1, 0, 1, 1), Ln.bind(void 0, 0,
		1, 0, 1, 2), Ln.bind(void 0, 0, 1, 0, 1, 3), Ln.bind(void 0, 0, 1, 1, 0, 0), Ln.bind(void 0, 0, 1, 1, 0, 1),
	Ln.bind(void 0, 0, 1, 1, 0, 2), Ln.bind(void 0, 0, 1, 1, 0, 3), Ln.bind(void 0, 0, 1, 1, 1, 0), Ln.bind(void 0,
		0, 1, 1, 1, 1), Ln.bind(void 0, 0, 1, 1, 1, 2), Ln.bind(void 0, 0, 1, 1, 1, 3), Ln.bind(void 0, 1, 0, 0, 0,
		0), Ln.bind(void 0, 1, 0, 0, 0, 1), Ln.bind(void 0, 1, 0, 0, 0, 2), Ln.bind(void 0, 1, 0, 0, 0, 3), Ln.bind(
		void 0, 1, 0, 0, 1, 0), Ln.bind(void 0, 1, 0, 0, 1, 1), Ln.bind(void 0, 1, 0, 0, 1, 2), Ln.bind(void 0, 1,
		0, 0, 1, 3), Ln.bind(void 0, 1, 0, 1, 0, 0), Ln.bind(void 0, 1, 0, 1, 0, 1), Ln.bind(void 0, 1, 0, 1, 0, 2),
	Ln.bind(void 0, 1, 0, 1, 0, 3), Ln.bind(void 0, 1, 0, 1, 1, 0), Ln.bind(void 0, 1, 0, 1, 1, 1), Ln.bind(void 0,
		1, 0, 1, 1, 2), Ln.bind(void 0, 1, 0, 1, 1, 3), Ln.bind(void 0, 1, 1, 0, 0, 0), Ln.bind(void 0, 1, 1, 0, 0,
		1), Ln.bind(void 0, 1, 1, 0, 0, 2), Ln.bind(void 0, 1, 1, 0, 0, 3), Ln.bind(void 0, 1, 1, 0, 1, 0), Ln.bind(
		void 0, 1, 1, 0, 1, 1), Ln.bind(void 0, 1, 1, 0, 1, 2), Ln.bind(void 0, 1, 1, 0, 1, 3), Ln.bind(void 0, 1,
		1, 1, 0, 0), Ln.bind(void 0, 1, 1, 1, 0, 1), Ln.bind(void 0, 1, 1, 1, 0, 2), Ln.bind(void 0, 1, 1, 1, 0, 3),
	Ln.bind(void 0, 1, 1, 1, 1, 0), Ln.bind(void 0, 1, 1, 1, 1, 1), Ln.bind(void 0, 1, 1, 1, 1, 2), Ln.bind(void 0,
		1, 1, 1, 1, 3)
], kn.prototype.hasChar = function(e) {
	return null !== this.encoding.charToGlyphIndex(e)
}, kn.prototype.charToGlyphIndex = function(e) {
	return this.encoding.charToGlyphIndex(e)
}, kn.prototype.charToGlyph = function(e) {
	const t = this.charToGlyphIndex(e);
	let n = this.glyphs.get(t);
	return n || (n = this.glyphs.get(0)), n
}, kn.prototype.stringToGlyphs = function(e, t) {
	t = t || this.defaultRenderOptions;
	const n = [];
	for (let t = 0; t < e.length; t += 1) {
		const o = e[t];
		n.push(this.charToGlyphIndex(o))
	}
	let o = n.length;
	if (t.features) {
		const e = t.script || this.substitution.getDefaultScriptName();
		let r = [];
		t.features.liga && (r = r.concat(this.substitution.getFeature("liga", e, t.language))), t.features.rlig && (
			r = r.concat(this.substitution.getFeature("rlig", e, t.language)));
		for (let e = 0; e < o; e += 1)
			for (let t = 0; t < r.length; t++) {
				const s = r[t],
					a = s.sub,
					i = a.length;
				let l = 0;
				for (; l < i && a[l] === n[e + l];) l++;
				l === i && (n.splice(e, i, s.by), o = o - i + 1)
			}
	}
	const r = new Array(o),
		s = this.glyphs.get(0);
	for (let e = 0; e < o; e += 1) r[e] = this.glyphs.get(n[e]) || s;
	return r
}, kn.prototype.nameToGlyphIndex = function(e) {
	return this.glyphNames.nameToGlyphIndex(e)
}, kn.prototype.nameToGlyph = function(e) {
	const t = this.nameToGlyphIndex(e);
	let n = this.glyphs.get(t);
	return n || (n = this.glyphs.get(0)), n
}, kn.prototype.glyphIndexToName = function(e) {
	return this.glyphNames.glyphIndexToName ? this.glyphNames.glyphIndexToName(e) : ""
}, kn.prototype.getKerningValue = function(e, t) {
	e = e.index || e, t = t.index || t;
	const n = this.getGposKerningValue;
	return n ? n(e, t) : this.kerningPairs[e + "," + t] || 0
}, kn.prototype.defaultRenderOptions = {
	kerning: !0,
	features: {
		liga: !0,
		rlig: !0
	}
}, kn.prototype.forEachGlyph = function(e, t, n, o, r, s) {
	t = void 0 !== t ? t : 0, n = void 0 !== n ? n : 0, o = void 0 !== o ? o : 72, r = r || this
		.defaultRenderOptions;
	const a = 1 / this.unitsPerEm * o,
		i = this.stringToGlyphs(e, r);
	for (let e = 0; e < i.length; e += 1) {
		const l = i[e];
		if (s.call(this, l, t, n, o, r), l.advanceWidth && (t += l.advanceWidth * a), r.kerning && e < i.length -
			1) {
			t += this.getKerningValue(l, i[e + 1]) * a
		}
		r.letterSpacing ? t += r.letterSpacing * o : r.tracking && (t += r.tracking / 1e3 * o)
	}
	return t
}, kn.prototype.getPath = function(e, t, n, o, r) {
	const s = new I;
	return this.forEachGlyph(e, t, n, o, r, (function(e, t, n, o) {
		const a = e.getPath(t, n, o, r, this);
		s.extend(a)
	})), s
}, kn.prototype.getPaths = function(e, t, n, o, r) {
	const s = [];
	return this.forEachGlyph(e, t, n, o, r, (function(e, t, n, o) {
		const a = e.getPath(t, n, o, r, this);
		s.push(a)
	})), s
}, kn.prototype.getAdvanceWidth = function(e, t, n) {
	return this.forEachGlyph(e, 0, 0, t, n, (function() {}))
}, kn.prototype.draw = function(e, t, n, o, r, s) {
	this.getPath(t, n, o, r, s).draw(e)
}, kn.prototype.drawPoints = function(e, t, n, o, r, s) {
	this.forEachGlyph(t, n, o, r, s, (function(t, n, o, r) {
		t.drawPoints(e, n, o, r)
	}))
}, kn.prototype.drawMetrics = function(e, t, n, o, r, s) {
	this.forEachGlyph(t, n, o, r, s, (function(t, n, o, r) {
		t.drawMetrics(e, n, o, r)
	}))
}, kn.prototype.getEnglishName = function(e) {
	const t = this.names[e];
	if (t) return t.en
}, kn.prototype.validate = function() {
	const e = this;

	function t(t) {
		const n = e.getEnglishName(t);
		n && n.trim().length
	}
	t("fontFamily"), t("weightName"), t("manufacturer"), t("copyright"), t("version"), this.unitsPerEm
}, kn.prototype.toTables = function() {
	return Rt.fontToTable(this)
}, kn.prototype.toBuffer = function() {
	return console.warn("Font.toBuffer is deprecated. Use Font.toArrayBuffer instead."), this.toArrayBuffer()
}, kn.prototype.toArrayBuffer = function() {
	const e = this.toTables().encode(),
		t = new ArrayBuffer(e.length),
		n = new Uint8Array(t);
	for (let t = 0; t < e.length; t++) n[t] = e[t];
	return t
}, kn.prototype.download = function(e) {
	const t = this.getEnglishName("fontFamily"),
		n = this.getEnglishName("fontSubfamily");
	e = e || t.replace(/\s/g, "") + "-" + n + ".otf";
	const o = this.toArrayBuffer();
	if ("undefined" != typeof window) window.requestFileSystem = window.requestFileSystem || window
		.webkitRequestFileSystem, window.requestFileSystem(window.TEMPORARY, o.byteLength, (function(t) {
			t.root.getFile(e, {
				create: !0
			}, (function(e) {
				e.createWriter((function(t) {
					const n = new DataView(o),
						r = new Blob([n], {
							type: "font/opentype"
						});
					t.write(r), t.addEventListener("writeend", (function() {
						location.href = e.toURL()
					}), !1)
				}))
			}))
		}), (function(e) {
			throw new Error(e.name + ": " + e.message)
		}));
	else {
		const t = require("fs"),
			n = function(e) {
				const t = new Buffer(e.byteLength),
					n = new Uint8Array(e);
				for (let e = 0; e < t.length; ++e) t[e] = n[e];
				return t
			}(o);
		t.writeFileSync(e, n)
	}
}, kn.prototype.fsSelectionValues = {
	ITALIC: 1,
	UNDERSCORE: 2,
	NEGATIVE: 4,
	OUTLINED: 8,
	STRIKEOUT: 16,
	BOLD: 32,
	REGULAR: 64,
	USER_TYPO_METRICS: 128,
	WWS: 256,
	OBLIQUE: 512
}, kn.prototype.usWidthClasses = {
	ULTRA_CONDENSED: 1,
	EXTRA_CONDENSED: 2,
	CONDENSED: 3,
	SEMI_CONDENSED: 4,
	MEDIUM: 5,
	SEMI_EXPANDED: 6,
	EXPANDED: 7,
	EXTRA_EXPANDED: 8,
	ULTRA_EXPANDED: 9
}, kn.prototype.usWeightClasses = {
	THIN: 100,
	EXTRA_LIGHT: 200,
	LIGHT: 300,
	NORMAL: 400,
	MEDIUM: 500,
	SEMI_BOLD: 600,
	BOLD: 700,
	EXTRA_BOLD: 800,
	BLACK: 900
};
var Bn = {
	make: function(e, t) {
		const n = new oe.Table("fvar", [{
			name: "version",
			type: "ULONG",
			value: 65536
		}, {
			name: "offsetToData",
			type: "USHORT",
			value: 0
		}, {
			name: "countSizePairs",
			type: "USHORT",
			value: 2
		}, {
			name: "axisCount",
			type: "USHORT",
			value: e.axes.length
		}, {
			name: "axisSize",
			type: "USHORT",
			value: 20
		}, {
			name: "instanceCount",
			type: "USHORT",
			value: e.instances.length
		}, {
			name: "instanceSize",
			type: "USHORT",
			value: 4 + 4 * e.axes.length
		}]);
		n.offsetToData = n.sizeOf();
		for (let o = 0; o < e.axes.length; o++) n.fields = n.fields.concat(Dn(o, e.axes[o], t));
		for (let o = 0; o < e.instances.length; o++) n.fields = n.fields.concat(Mn(o, e.instances[o], e.axes,
			t));
		return n
	},
	parse: function(e, t, n) {
		const o = new pe.Parser(e, t),
			r = o.parseULong();
		G.argument(65536 === r, "Unsupported fvar table version.");
		const s = o.parseOffset16();
		o.skip("uShort", 1);
		const a = o.parseUShort(),
			i = o.parseUShort(),
			l = o.parseUShort(),
			c = o.parseUShort(),
			u = [];
		for (let o = 0; o < a; o++) u.push(Cn(e, t + s + o * i, n));
		const p = [],
			h = t + s + a * i;
		for (let t = 0; t < l; t++) p.push(In(e, h + t * c, u, n));
		return {
			axes: u,
			instances: p
		}
	}
};

function Nn(e, t) {
	const n = new pe.Parser(e, t),
		o = n.parseUShort(),
		r = [];
	for (let e = 0; e < o; e++) r[n.parseTag()] = {
		offset: n.parseUShort()
	};
	return r
}

function Gn(e, t) {
	const n = new pe.Parser(e, t),
		o = n.parseUShort();
	if (1 === o) {
		const e = n.parseUShort(),
			t = n.parseUShort(),
			o = n.parseUShortList(t);
		return function(t) {
			return o[t - e] || 0
		}
	}
	if (2 === o) {
		const e = n.parseUShort(),
			t = [],
			o = [],
			r = [];
		for (let s = 0; s < e; s++) t[s] = n.parseUShort(), o[s] = n.parseUShort(), r[s] = n.parseUShort();
		return function(e) {
			let n = 0,
				s = t.length - 1;
			for (; n < s;) {
				const o = n + s + 1 >> 1;
				e < t[o] ? s = o - 1 : n = o
			}
			return t[n] <= e && e <= o[n] && r[n] || 0
		}
	}
}

function Pn(e, t) {
	const n = new pe.Parser(e, t),
		o = n.parseUShort(),
		r = function(e, t) {
			const n = new pe.Parser(e, t),
				o = n.parseUShort();
			let r = n.parseUShort();
			if (1 === o) return n.parseUShortList(r);
			if (2 === o) {
				const e = [];
				for (; r--;) {
					const t = n.parseUShort(),
						o = n.parseUShort();
					let r = n.parseUShort();
					for (let n = t; n <= o; n++) e[r++] = n
				}
				return e
			}
		}(e, t + n.parseUShort()),
		s = n.parseUShort(),
		a = n.parseUShort();
	let i;
	if (4 !== s || 0 !== a) return;
	const l = {};
	if (1 === o) {
		const e = n.parseUShort(),
			t = [],
			o = n.parseOffset16List(e);
		for (let c = 0; c < e; c++) {
			const e = o[c];
			let u = l[e];
			if (!u) {
				u = {}, n.relativeOffset = e;
				let t = n.parseUShort();
				for (; t--;) {
					const e = n.parseUShort();
					s && (i = n.parseShort()), a && n.parseShort(), u[e] = i
				}
			}
			t[r[c]] = u
		}
		return function(e, n) {
			const o = t[e];
			if (o) return o[n]
		}
	}
	if (2 === o) {
		const o = n.parseUShort(),
			l = n.parseUShort(),
			c = n.parseUShort(),
			u = n.parseUShort(),
			p = Gn(e, t + o),
			h = Gn(e, t + l),
			f = [];
		for (let e = 0; e < c; e++) {
			const t = f[e] = [];
			for (let e = 0; e < u; e++) s && (i = n.parseShort()), a && n.parseShort(), t[e] = i
		}
		const d = {};
		for (let e = 0; e < r.length; e++) d[r[e]] = 1;
		return function(e, t) {
			if (!d[e]) return;
			const n = p(e),
				o = h(t),
				r = f[n];
			return r ? r[o] : void 0
		}
	}
}

function An(e, t) {
	const n = new pe.Parser(e, t),
		o = n.parseUShort(),
		r = n.parseUShort(),
		s = 16 & r,
		a = n.parseUShort(),
		i = n.parseOffset16List(a),
		l = {
			lookupType: o,
			lookupFlag: r,
			markFilteringSet: s ? n.parseUShort() : -1
		};
	if (2 === o) {
		const n = [];
		for (let o = 0; o < a; o++) {
			const r = Pn(e, t + i[o]);
			r && n.push(r)
		}
		l.getKerningValue = function(e, t) {
			for (let o = n.length; o--;) {
				const r = n[o](e, t);
				if (void 0 !== r) return r
			}
			return 0
		}
	}
	return l
}
var Fn = {
	parse: function(e, t, n) {
		const o = new pe.Parser(e, t),
			r = o.parseFixed();
		G.argument(1 === r, "Unsupported GPOS table version."), Nn(e, t + o.parseUShort()), Nn(e, t + o
			.parseUShort());
		const s = o.parseUShort();
		o.relativeOffset = s;
		const a = o.parseUShort(),
			i = o.parseOffset16List(a),
			l = t + s;
		for (let t = 0; t < a; t++) {
			const o = An(e, l + i[t]);
			2 !== o.lookupType || n.getGposKerningValue || (n.getGposKerningValue = o.getKerningValue)
		}
	}
};
var Hn = {
	parse: function(e, t) {
		const n = new pe.Parser(e, t),
			o = n.parseUShort();
		if (0 === o) return function(e) {
			const t = {};
			e.skip("uShort");
			const n = e.parseUShort();
			G.argument(0 === n, "Unsupported kern sub-table version."), e.skip("uShort", 2);
			const o = e.parseUShort();
			e.skip("uShort", 3);
			for (let n = 0; n < o; n += 1) {
				const n = e.parseUShort(),
					o = e.parseUShort(),
					r = e.parseShort();
				t[n + "," + o] = r
			}
			return t
		}(n);
		if (1 === o) return function(e) {
			const t = {};
			e.skip("uShort"), e.parseULong() > 1 && console.warn(
				"Only the first kern subtable is supported."), e.skip("uLong");
			const n = 255 & e.parseUShort();
			if (e.skip("uShort"), 0 === n) {
				const n = e.parseUShort();
				e.skip("uShort", 3);
				for (let o = 0; o < n; o += 1) {
					const n = e.parseUShort(),
						o = e.parseUShort(),
						r = e.parseShort();
					t[n + "," + o] = r
				}
			}
			return t
		}(n);
		throw new Error("Unsupported kern table version (" + o + ").")
	}
};
var zn = {
	parse: function(e, t, n, o) {
		const r = new pe.Parser(e, t),
			s = o ? r.parseUShort : r.parseULong,
			a = [];
		for (let e = 0; e < n + 1; e += 1) {
			let e = s.call(r);
			o && (e *= 2), a.push(e)
		}
		return a
	}
};

function Wn(e, t) {
	require("fs").readFile(e, (function(e, n) {
		if (e) return t(e.message);
		t(null, Nt(n))
	}))
}

function _n(e, t) {
	const n = new XMLHttpRequest;
	n.open("get", e, !0), n.responseType = "arraybuffer", n.onload = function() {
		return 200 !== n.status ? t("Font could not be loaded: " + n.statusText) : t(null, n.response)
	}, n.onerror = function() {
		t("Font could not be loaded")
	}, n.send()
}

function qn(e, t) {
	const n = [];
	let o = 12;
	for (let r = 0; r < t; r += 1) {
		const t = pe.getTag(e, o),
			r = pe.getULong(e, o + 4),
			s = pe.getULong(e, o + 8),
			a = pe.getULong(e, o + 12);
		n.push({
			tag: t,
			checksum: r,
			offset: s,
			length: a,
			compression: !1
		}), o += 16
	}
	return n
}

function Xn(e, t) {
	if ("WOFF" === t.compression) {
		const n = new Uint8Array(e.buffer, t.offset + 2, t.compressedLength - 2),
			o = new Uint8Array(t.length);
		if (D(n, o), o.byteLength !== t.length) throw new Error("Decompression error: " + t.tag +
			" decompressed length doesn't match recorded length");
		return {
			data: new DataView(o.buffer, 0),
			offset: 0
		}
	}
	return {
		data: e,
		offset: t.offset
	}
}

function Vn(e) {
	let t, n;
	const o = new kn({
			empty: !0
		}),
		r = new DataView(e, 0);
	let s, a = [];
	const i = pe.getTag(r, 0);
	if (i === String.fromCharCode(0, 1, 0, 0) || "true" === i || "typ1" === i) o.outlinesFormat = "truetype", s = pe
		.getUShort(r, 4), a = qn(r, s);
	else if ("OTTO" === i) o.outlinesFormat = "cff", s = pe.getUShort(r, 4), a = qn(r, s);
	else {
		if ("wOFF" !== i) throw new Error("Unsupported OpenType signature " + i); {
			const e = pe.getTag(r, 4);
			if (e === String.fromCharCode(0, 1, 0, 0)) o.outlinesFormat = "truetype";
			else {
				if ("OTTO" !== e) throw new Error("Unsupported OpenType flavor " + i);
				o.outlinesFormat = "cff"
			}
			s = pe.getUShort(r, 12), a = function(e, t) {
				const n = [];
				let o = 44;
				for (let r = 0; r < t; r += 1) {
					const t = pe.getTag(e, o),
						r = pe.getULong(e, o + 4),
						s = pe.getULong(e, o + 8),
						a = pe.getULong(e, o + 12);
					let i;
					i = s < a && "WOFF", n.push({
						tag: t,
						offset: r,
						compression: i,
						compressedLength: s,
						length: a
					}), o += 20
				}
				return n
			}(r, s)
		}
	}
	let l, c, u, p, h, f, d, g, m, y, v;
	for (let e = 0; e < s; e += 1) {
		const s = a[e];
		let i;
		switch (s.tag) {
			case "cmap":
				i = Xn(r, s), o.tables.cmap = fe.parse(i.data, i.offset), o.encoding = new be(o.tables.cmap);
				break;
			case "cvt ":
				i = Xn(r, s), v = new pe.Parser(i.data, i.offset), o.tables.cvt = v.parseShortList(s.length / 2);
				break;
			case "fvar":
				c = s;
				break;
			case "fpgm":
				i = Xn(r, s), v = new pe.Parser(i.data, i.offset), o.tables.fpgm = v.parseByteList(s.length);
				break;
			case "head":
				i = Xn(r, s), o.tables.head = Ke.parse(i.data, i.offset), o.unitsPerEm = o.tables.head.unitsPerEm, t = o
					.tables.head.indexToLocFormat;
				break;
			case "hhea":
				i = Xn(r, s), o.tables.hhea = Je.parse(i.data, i.offset), o.ascender = o.tables.hhea.ascender, o
					.descender = o.tables.hhea.descender, o.numberOfHMetrics = o.tables.hhea.numberOfHMetrics;
				break;
			case "hmtx":
				f = s;
				break;
			case "ltag":
				i = Xn(r, s), n = tt.parse(i.data, i.offset);
				break;
			case "maxp":
				i = Xn(r, s), o.tables.maxp = nt.parse(i.data, i.offset), o.numGlyphs = o.tables.maxp.numGlyphs;
				break;
			case "name":
				m = s;
				break;
			case "OS/2":
				i = Xn(r, s), o.tables.os2 = mt.parse(i.data, i.offset);
				break;
			case "post":
				i = Xn(r, s), o.tables.post = yt.parse(i.data, i.offset), o.glyphNames = new Se(o.tables.post);
				break;
			case "prep":
				i = Xn(r, s), v = new pe.Parser(i.data, i.offset), o.tables.prep = v.parseByteList(s.length);
				break;
			case "glyf":
				u = s;
				break;
			case "loca":
				g = s;
				break;
			case "CFF ":
				l = s;
				break;
			case "kern":
				d = s;
				break;
			case "GPOS":
				p = s;
				break;
			case "GSUB":
				h = s;
				break;
			case "meta":
				y = s
		}
	}
	const b = Xn(r, m);
	if (o.tables.name = dt.parse(b.data, b.offset, n), o.names = o.tables.name, u && g) {
		const e = 0 === t,
			n = Xn(r, g),
			s = zn.parse(n.data, n.offset, o.numGlyphs, e),
			a = Xn(r, u);
		o.glyphs = ke.parse(a.data, a.offset, s, o)
	} else {
		if (!l) throw new Error("Font doesn't contain TrueType or CFF outlines."); {
			const e = Xn(r, l);
			Qe.parse(e.data, e.offset, o)
		}
	}
	const x = Xn(r, f);
	if (et.parse(x.data, x.offset, o.numberOfHMetrics, o.numGlyphs, o.glyphs), function(e) {
			let t;
			const n = e.tables.cmap.glyphIndexMap,
				o = Object.keys(n);
			for (let r = 0; r < o.length; r += 1) {
				const s = o[r],
					a = n[s];
				t = e.glyphs.get(a), t.addUnicode(parseInt(s))
			}
			for (let n = 0; n < e.glyphs.length; n += 1) t = e.glyphs.get(n), e.cffEncoding ? e.isCIDFont ? t.name =
				"gid" + n : t.name = e.cffEncoding.charset[n] : e.glyphNames.names && (t.name = e.glyphNames
					.glyphIndexToName(n))
		}(o), d) {
		const e = Xn(r, d);
		o.kerningPairs = Hn.parse(e.data, e.offset)
	} else o.kerningPairs = {};
	if (p) {
		const e = Xn(r, p);
		Fn.parse(e.data, e.offset, o)
	}
	if (h) {
		const e = Xn(r, h);
		o.tables.gsub = St.parse(e.data, e.offset)
	}
	if (c) {
		const e = Xn(r, c);
		o.tables.fvar = Bn.parse(e.data, e.offset, o.names)
	}
	if (y) {
		const e = Xn(r, y);
		o.tables.meta = Ut.parse(e.data, e.offset), o.metas = o.tables.meta
	}
	return o
}
var jn = Object.freeze({
	__proto__: null,
	Font: kn,
	Glyph: Re,
	Path: I,
	BoundingBox: M,
	_parse: pe,
	parse: Vn,
	load: function(e, t) {
		("undefined" == typeof window ? Wn : _n)(e, (function(e, n) {
			if (e) return t(e);
			let o;
			try {
				o = Vn(n)
			} catch (e) {
				return t(e, null)
			}
			return t(null, o)
		}))
	},
	loadSync: function(e) {
		return Vn(Nt(require("fs").readFileSync(e)))
	}
});
const Yn = r.default.join(__dirname, "./fonts/font.ttf"),
	Zn = jn.loadSync(Yn),
	$n = {
		width: 150,
		height: 50,
		noise: 4,
		color: !1,
		background: "#FFFAE8",
		size: 4,
		ignoreChars: "",
		fontSize: 40,
		charPreset: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
		font: Zn,
		ascender: Zn.ascender,
		descender: Zn.descender,
		truncateLineProbability: .5,
		truncateCurveProbability: .5,
		truncateCurvePositionMin: .4,
		truncateCurvePositionMax: .6
	};
var Qn = {
	options: $n,
	loadFont: e => {
		const t = jn.loadSync(e);
		$n.font = t, $n.ascender = t.ascender, $n.descender = t.descender
	}
};
const Kn = Qn.options,
	Jn = function(e, t) {
		return Math.round(e + Math.random() * (t - e))
	};
const eo = function(e, t) {
		return {
			text: (e + t).toString(),
			equation: e + "+" + t
		}
	},
	to = function(e, t) {
		return {
			text: (e - t).toString(),
			equation: e + "-" + t
		}
	};

function no(e, t, n) {
	return 6 * (n = (n + 1) % 1) < 1 ? e + (t - e) * n * 6 : 2 * n < 1 ? t : 3 * n < 2 ? e + (t - e) * (2 / 3 - n) * 6 :
		e
}
var oo = {
	int: Jn,
	greyColor: function(e, t) {
		const n = Jn(e = e || 1, t = t || 9).toString(16);
		return `#${n}${n}${n}`
	},
	captchaText: function(e) {
		"number" == typeof e && (e = {
			size: e
		});
		const t = (e = e || {}).size || 4,
			n = e.ignoreChars || "";
		let o = -1,
			r = "",
			s = e.charPreset || Kn.charPreset;
		n && (s = function(e, t) {
			return e.split("").filter(e => -1 === t.indexOf(e))
		}(s, n));
		const a = s.length - 1;
		for (; ++o < t;) r += s[Jn(0, a)];
		return r
	},
	mathExpr: function(e, t, n) {
		const o = Jn(e = e || 1, t = t || 9),
			r = Jn(e, t);
		switch (n) {
			case "+":
				return eo(o, r);
			case "-":
				return to(o, r);
			default:
				return Jn(1, 2) % 2 ? eo(o, r) : to(o, r)
		}
	},
	color: function(e) {
		const t = Jn(0, 24) / 24,
			n = Jn(60, 80) / 100,
			o = e ? function(e) {
				if ("#" !== e[0]) return 1;
				3 === (e = e.slice(1)).length && (e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2]);
				const t = parseInt(e, 16),
					n = t >> 16,
					o = t >> 8 & 255,
					r = 255 & t,
					s = Math.max(n, o, r),
					a = Math.min(n, o, r);
				return (s + a) / 510
			}(e) : 1;
		let r, s;
		o >= .5 ? (r = Math.round(100 * o) - 45, s = Math.round(100 * o) - 25) : (r = Math.round(100 * o) + 25,
			s = Math.round(100 * o) + 45);
		const a = Jn(r, s) / 100,
			i = a < .5 ? a * (a + n) : a + n - a * n,
			l = 2 * a - i,
			c = Math.floor(255 * no(l, i, t + 1 / 3)),
			u = Math.floor(255 * no(l, i, t));
		return "#" + (Math.floor(255 * no(l, i, t - 1 / 3)) | u << 8 | c << 16 | 1 << 24).toString(16).slice(1)
	}
};
const ro = Qn.options,
	so = function(e, t) {
		e = e || oo.captchaText();
		const n = (t = Object.assign({}, ro, t)).width,
			o = t.height,
			r = t.background || t.backgroundColor;
		r && (t.color = !0);
		const s = r ? `<rect width="100%" height="100%" fill="${r}"/>` : "",
			a = [].concat(function(e, t, n) {
				const o = n.color,
					r = [],
					s = n.inverse ? 7 : 1,
					a = n.inverse ? 15 : 9;
				let i = -1;
				for (; ++i < n.noise;) {
					const n = `${oo.int(1,21)} ${oo.int(1,t-1)}`,
						i = `${oo.int(e-21,e-1)} ${oo.int(1,t-1)}`,
						l = `${oo.int(e/2-21,e/2+21)} ${oo.int(1,t-1)}`,
						c = `${oo.int(e/2-21,e/2+21)} ${oo.int(1,t-1)}`,
						u = o ? oo.color() : oo.greyColor(s, a);
					r.push(`<path d="M${n} C${l},${c},${i}" stroke="${u}" fill="none"/>`)
				}
				return r
			}(n, o, t)).concat(function(e, t, n, o, r) {
				const s = e.length,
					a = (t - 2) / (s + 1),
					i = o.inverse ? 10 : 0,
					l = o.inverse ? 14 : 4;
				let u = -1;
				const p = [],
					h = r || o.color ? oo.color(o.background) : oo.greyColor(i, l);
				for (; ++u < s;) {
					const t = a * (u + 1),
						r = n / 2,
						s = c(e[u], Object.assign({
							x: t,
							y: r
						}, o));
					p.push(`<path fill="${h}" d="${s}"/>`)
				}
				return p
			}(e, n, o, t)).sort(() => Math.random() - .5).join("");
		return `${`<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${o}" viewBox="0,0,${n},${o}">`}${s}${a}</svg>`
	};
var ao = so,
	io = oo.captchaText,
	lo = function(e) {
		const t = e.text || oo.captchaText(e);
		return {
			text: t,
			data: so(t, e)
		}
	},
	co = function(e) {
		const t = oo.mathExpr(e.mathMin, e.mathMax, e.mathOperator);
		return {
			text: t.text,
			data: so(t.equation, e)
		}
	},
	uo = ro,
	po = Qn.loadFont;
ao.randomText = io, ao.create = lo, ao.createMathExpr = co, ao.options = uo, ao.loadFont = po;
var ho = ao;
var fo = class {
	constructor(e = {}) {
		let {
			level: t = 2,
			...n
		} = e;
		this.width = 300, this.height = 100;
		const o = [Math.floor(256 * Math.random()), Math.floor(256 * Math.random()), Math.floor(256 * Math
			.random())]; - 1 === [1, 2, 3, 4].indexOf(t) && (t = 2);
		const r = {};
		1 === t ? Object.assign(r, {
			lineWidth: 5,
			textColor: o,
			textLength: 4,
			lineOffset: 0,
			background: [255, 250, 232],
			randomLineNum: 5
		}, n) : 2 === t ? Object.assign(r, {
			lineWidth: 5,
			textColor: o,
			textLength: 4,
			lineOffset: 0,
			background: [255, 250, 232],
			randomLineNum: 10
		}, n) : 3 === t ? Object.assign(r, {
			lineWidth: 5,
			textColor: o,
			textLength: 4,
			lineOffset: 1,
			background: [255, 250, 232],
			randomLineNum: 15
		}, n) : 4 === t && (Object.assign(r, {
			lineWidth: 5,
			textColor: o,
			textLength: 4,
			lineOffset: 1,
			background: [255, 250, 232],
			randomLineNum: 15
		}, n), r.textColor = function() {
			return [Math.floor(256 * Math.random()), Math.floor(256 * Math.random()), Math.floor(256 *
				Math.random())]
		}), this.config = r, this.data = Buffer.alloc(9e4)
	}
	setPixel(e, t, n) {
		const o = 3 * (t * this.width + e);
		this.data[o] = n.b, this.data[o + 1] = n.g, this.data[o + 2] = n.r
	}
	getFileBuffer(e) {
		const t = 54 + this.data.length,
			n = Buffer.alloc(t);
		return n.write("BM", 0), n.writeUInt32LE(t, 2), n.writeUInt32LE(0, 6), n.writeUInt32LE(54, 10), n
			.writeUInt32LE(40, 14), n.writeInt32LE(this.width, 18), n.writeInt32LE(-this.height, 22), n
			.writeUInt16LE(1, 26), n.writeUInt16LE(24, 28), n.writeUInt32LE(0, 30), n.writeUInt32LE(this.data
				.length, 34), this.data.copy(n, 54), n
	}
	setImageBackground(e, t, n) {
		for (let o = 0; o < this.width; o++)
			for (let r = 0; r < this.height; r++) this.setPixel(o, r, {
				r: e,
				g: t,
				b: n
			})
	}
	setImageRandomBackground(e) {
		for (let t = 0; t < this.width; t += e)
			for (let n = 0; n < this.height; n += e) {
				const o = Math.floor(256 * Math.random()),
					r = Math.floor(256 * Math.random()),
					s = Math.floor(256 * Math.random());
				for (let a = 0; a < e; a++)
					for (let i = 0; i < e; i++) t + a < this.width && n + i < this.height && this.setPixel(t +
						a, n + i, {
							r: o,
							g: r,
							b: s
						})
			}
	}
	draw() {
		const e = this.randomString(this.config.textLength);
		this.setImageBackground(...this.config.background);
		for (let t = 0; t < e.length; t++) {
			const n = e[t];
			this.drawText(n, t)
		}
		this.config.randomLineNum && this.drawRandomLinesWithVaryingWidth(this.config.randomLineNum);
		const t = this.getFileBuffer(),
			n = "data:image/bmp;base64," + t.toString("base64");
		return {
			text: e,
			buffer: t,
			base64: n
		}
	}
	randomString(e) {
		e = e || 32;
		var t, n = "0123456789".length,
			o = "";
		for (t = 0; t < e; t++) o += "0123456789".charAt(Math.floor(Math.random() * n));
		return o
	}
	drawText(e, t) {
		const n = this.config.lineWidth,
			o = this.getTextOffset(t);
		"1" === e ? this.drawLine(1, 25, 25, 50 + n, o) : "2" === e ? (this.drawLine(0, 5, 25, 40, o), this
				.drawLine(1, 45 - n, 25, 25 + n, o), this.drawLine(0, 5, 50, 40, o), this.drawLine(1, 5, 50,
					25 + n, o), this.drawLine(0, 5, 75, 40, o)) : "3" === e ? (this.drawLine(0, 5, 25, 40, o),
				this.drawLine(1, 45 - n, 25, 25 + n, o), this.drawLine(0, 5, 50, 40, o), this.drawLine(1, 45 -
					n, 50, 25 + n, o), this.drawLine(0, 5, 75, 40, o)) : "4" === e ? (this.drawLine(1, 5, 25,
					25 + n, o), this.drawLine(1, 45 - n, 25, 25 + n, o), this.drawLine(0, 5, 50, 40, o), this
				.drawLine(1, 45 - n, 50, 25 + n, o)) : "5" === e ? (this.drawLine(0, 5, 25, 40, o), this
				.drawLine(1, 5, 25, 25 + n, o), this.drawLine(0, 5, 50, 40, o), this.drawLine(1, 45 - n, 50,
					25 + n, o), this.drawLine(0, 5, 75, 40, o)) : "6" === e ? (this.drawLine(0, 5, 25, 40, o),
				this.drawLine(1, 5, 25, 25 + n, o), this.drawLine(0, 5, 50, 40, o), this.drawLine(1, 45 - n, 50,
					25 + n, o), this.drawLine(0, 5, 75, 40, o), this.drawLine(1, 5, 50, 25 + n, o)) : "7" ===
			e ? (this.drawLine(0, 5, 25, 40, o), this.drawLine(1, 45 - n, 25, 25 + n, o), this.drawLine(1, 45 -
				n, 50, 25 + n, o)) : "8" === e ? (this.drawLine(0, 5, 25, 40, o), this.drawLine(0, 5, 50, 40,
				o), this.drawLine(0, 5, 75, 40, o), this.drawLine(1, 5, 25, 25 + n, o), this.drawLine(1, 5, 50,
					25 + n, o), this.drawLine(1, 45 - n, 25, 25 + n, o), this.drawLine(1, 45 - n, 50, 25 + n, o)
				) : "9" === e ? (this.drawLine(0, 5, 25, 40, o), this.drawLine(0, 5, 50, 40, o), this.drawLine(
				0, 5, 75, 40, o), this.drawLine(1, 5, 25, 25 + n, o), this.drawLine(1, 45 - n, 25, 25 + n,
				o), this.drawLine(1, 45 - n, 50, 25 + n, o)) : "0" === e && (this.drawLine(0, 5, 25, 40, o),
				this.drawLine(0, 5, 75, 40, o), this.drawLine(1, 5, 25, 25 + n, o), this.drawLine(1, 5, 50, 25 +
					n, o), this.drawLine(1, 45 - n, 25, 25 + n, o), this.drawLine(1, 45 - n, 50, 25 + n, o))
	}
	drawLine(e, t, n, o, r = {
		x: 0,
		y: 0
	}) {
		const s = this.config.lineWidth,
			a = "function" == typeof this.config.textColor ? this.config.textColor() : this.config.textColor;
		if (t += r.x, n += r.y, 0 === e)
			for (let e = 0; e < s; e++)
				for (let r = 0; r < o; r++) {
					const o = this.getRandomOffset();
					this.setPixel(t + r + o, n + e + o, {
						r: a[0],
						g: a[1],
						b: a[2]
					})
				} else if (1 === e)
					for (let e = 0; e < s; e++)
						for (let r = 0; r < o; r++) {
							const o = this.getRandomOffset();
							this.setPixel(t + e + o, n + r + o, {
								r: a[0],
								g: a[1],
								b: a[2]
							})
						}
	}
	getRandomOffset() {
		return 1 === this.config.lineOffset ? Math.floor(3 * Math.random()) - 1 : 2 === this.config.lineOffset ?
			Math.floor(6 * Math.random()) - 3 : this.config.lineOffset >= 3 ? Math.floor(11 * Math.random()) -
			6 : 0
	}
	getTextOffset(e = 0) {
		const t = this.config.textLength,
			n = Math.round((300 - 50 * t) / 2 / t);
		return {
			x: e * (300 / this.config.textLength) + n,
			y: 0
		}
	}
	drawRandomLinesWithVaryingWidth(e) {
		const t = this.width,
			n = this.height;
		for (let o = 0; o < e; o++) {
			const e = Math.floor(Math.random() * t),
				o = Math.floor(Math.random() * n),
				r = Math.floor(Math.random() * t),
				s = Math.floor(Math.random() * n),
				a = Math.floor(256 * Math.random()),
				i = Math.floor(256 * Math.random()),
				l = Math.floor(256 * Math.random()),
				c = Math.floor(2 * Math.random()) + 2;
			this.drawLineWithWidth(e, o, r, s, {
				r: a,
				g: i,
				b: l
			}, c)
		}
	}
	drawLineWithWidth(e, t, n, o, r, s) {
		const a = Math.abs(n - e),
			i = Math.abs(o - t),
			l = e < n ? 1 : -1,
			c = t < o ? 1 : -1;
		let u = a - i;
		for (;;) {
			for (let n = 0; n < s; n++) this.setPixel(e, t + n, r);
			if (e === n && t === o) break;
			const p = 2 * u;
			p > -i && (u -= i, e += l), p < a && (u += a, t += c)
		}
	}
};

function go(e) {
	if (!e) return;
	if (Array.isArray(e)) return e;
	if (!/^[0-9A-Fa-f]{6}$/.test(e)) return;
	const t = (e = e.replace(/^#/, "")).substring(0, 2),
		n = e.substring(2, 4),
		o = e.substring(4, 6);
	return [parseInt(t, 16), parseInt(n, 16), parseInt(o, 16)]
}
const mo = Object.prototype.toString;

function yo(e) {
	return "[object Object]" === mo.call(e)
}

function vo() {
	"development" === process.env.NODE_ENV && console.log(...arguments)
}
const bo = async function() {};

function xo(e) {
	return bo.constructor === e.constructor ? async function() {
		const t = await e.apply(this, arguments);
		return yo(t) && (t.msg && (t.message = t.msg, t.errMsg = t.msg), 0 === t.code ? t.errCode = t.code : t
			.errCode = s[t.code] || t.code), t
	}: function() {
		const t = e.apply(this, arguments);
		return yo(t) && (t.msg && (t.message = t.msg, t.errMsg = t.msg), 0 === t.code ? t.errCode = t.code : t
			.errCode = s[t.code] || t.code), t
	}
}
const So = uniCloud.database(),
	Uo = So.collection("opendb-verify-codes");
class To {
	async setVerifyCode({
		clientIP: e,
		deviceId: t,
		code: n,
		expiresDate: o,
		scene: r
	}) {
		if (!t) return {
			code: 10101,
			msg: "deviceId不可为空"
		};
		if (!n) return {
			code: 10102,
			msg: "验证码不可为空"
		};
		o || (o = 180);
		const s = Date.now(),
			a = {
				device_uuid: t,
				scene: r,
				code: n.toLocaleLowerCase(),
				state: 0,
				ip: e,
				created_date: s,
				expired_date: s + 1e3 * o
			};
		return vo("addRes", await Uo.add(a)), {
			code: 0,
			deviceId: t
		}
	}
	async verifyCode({
		deviceId: e,
		code: t,
		scene: n
	}) {
		if (!e) return {
			code: 10101,
			msg: "deviceId不可为空"
		};
		if (!t) return {
			code: 10102,
			msg: "验证码不可为空"
		};
		const o = Date.now(),
			r = {
				device_uuid: e,
				scene: n,
				code: t.toLocaleLowerCase(),
				state: 0
			},
			s = await Uo.where(r).orderBy("created_date", "desc").limit(1).get();
		if (vo("verifyRecord:", s), s && s.data && s.data.length > 0) {
			const e = s.data[0];
			if (e.expired_date < o) return {
				code: 10103,
				msg: "验证码已失效"
			};
			return vo("upRes", await Uo.doc(e._id).update({
				state: 1
			})), {
				code: 0,
				msg: "验证通过"
			}
		}
		return {
			code: 10104,
			msg: "验证码错误"
		}
	}
}
let wo;
try {
	wo = require("uni-config-center")
} catch (e) {
	throw new Error("Plugin[uni-config-center] was not found")
}
class Eo extends class {
	constructor() {
		this.pluginConfig = {}, this._initConfig(), this._initScene()
	}
	_initConfig() {
		const e = wo({
			pluginId: "uni-captcha"
		});
		if (e && e.hasFile("config.json")) try {
			const t = e.config();
			yo(t) && (this.pluginConfig = t)
		} catch (e) {
			throw new Error(this.t("config-file-invalid") + "\n" + e.messages)
		}
	}
	_initScene() {
		if (yo(this.pluginConfig.scene)) {
			const {
				scene: e,
				...t
			} = this.pluginConfig;
			Object.keys(e).forEach(n => {
				e.scene && delete e.scene, this.pluginConfig.scene[n] = Object.assign({}, t, e[n])
			})
		}
	}
} {
	constructor() {
		super(), this.DEVICEID2opts = {}
	}
	mergeConfig(e) {
		const t = yo(this.pluginConfig.scene) ? this.pluginConfig.scene[e.scene] : e.scene;
		return Object.assign({}, yo(t) ? t : this.pluginConfig, e)
	}
	async create(e = {}) {
		if (!e.scene) throw new Error("scene验证码场景不可为空");
		e = this.mergeConfig(e);
		let {
			scene: t,
			expiresDate: n,
			deviceId: o,
			clientIP: r,
			...s
		} = e;
		if (o = o || __ctx__.DEVICEID, r = r || __ctx__.CLIENTIP, !o) throw new Error("deviceId不可为空");
		const a = new To;
		try {
			const {
				text: i,
				base64: l
			} = function(e = {}) {
				const {
					uniPlatform: t = "",
					mode: n = "svg"
				} = e;
				if ("svg" === n) {
					let n;
					n = e.mathExpr ? ho.createMathExpr(e) : ho.create(e);
					let o = "data:image/svg+xml;utf8," + n.data.replace(/#/g, "%23");
					return (!t || ["mp-toutiao", "h5", "web", "app", "app-plus"].indexOf(t) > -1) && (o = o.replace(
						/"/g, "'").replace(/</g, "%3C").replace(/>/g, "%3E")), {
						text: n.text,
						base64: o
					}
				} {
					const t = new fo(JSON.parse(JSON.stringify({
							...e,
							textLength: e.size ? Number(e.size) : void 0,
							textColor: go(e.color),
							background: go(e.background)
						}))),
						{
							text: n,
							base64: o
						} = t.draw();
					return {
						text: n,
						base64: o
					}
				}
			}(s), c = await a.setVerifyCode({
				clientIP: r,
				deviceId: o,
				code: i,
				expiresDate: n,
				scene: t
			});
			return c.code > 0 ? {
				...c,
				code: 10001
			} : (this.DEVICEID2opts[o] = e, {
				code: 0,
				msg: "验证码获取成功",
				captchaBase64: l
			})
		} catch (e) {
			return {
				code: 10001,
				msg: "验证码生成失败：" + e.message
			}
		}
	}
	async verify({
		deviceId: e,
		captcha: t,
		scene: n
	}) {
		if (!(e = e || __ctx__.DEVICEID)) throw new Error("deviceId不可为空");
		if (!n) throw new Error("scene验证码场景不可为空");
		const o = new To;
		try {
			const r = await o.verifyCode({
				deviceId: e,
				code: t,
				scene: n
			});
			return r.code > 0 ? r : {
				code: 0,
				msg: "验证码通过"
			}
		} catch (e) {
			return {
				code: 10002,
				msg: "验证码校验失败：" + e.message
			}
		}
	}
	async refresh(e = {}) {
		let {
			scene: t,
			expiresDate: n,
			deviceId: o,
			...r
		} = e;
		if (o = o || __ctx__.DEVICEID, !o) throw new Error("deviceId不可为空");
		if (!t) throw new Error("scene验证码场景不可为空");
		const s = await Uo.where(So.command.or([{
			device_uuid: o,
			scene: t
		}, {
			deviceId: o,
			scene: t
		}])).orderBy("created_date", "desc").limit(1).get();
		if (s && s.data && s.data.length > 0) {
			const e = s.data[0];
			await Uo.doc(e._id).update({
				state: 2
			}), Object.keys(r).length > 0 && (this.DEVICEID2opts[o] = Object.assign({}, this.DEVICEID2opts[o],
				r));
			let a = {};
			try {
				a = await this.create(Object.assign({}, this.DEVICEID2opts[o], {
					deviceId: o,
					scene: t,
					expiresDate: n
				}))
			} catch (e) {
				return {
					code: 50403,
					msg: e.message
				}
			}
			return a.code > 0 ? {
				...a,
				code: 50403
			} : {
				code: 0,
				msg: "验证码刷新成功",
				captchaBase64: a.captchaBase64
			}
		}
		return {
			code: 10003,
			msg: `验证码刷新失败：无此设备在 ${t} 场景信息，请重新获取`
		}
	}
}
const Oo = new To;
Object.keys(Oo).forEach(e => {
	Eo.prototype[e] = xo(Oo[e])
});
const Lo = new Eo,
	ko = new Proxy(Lo, {
		get(e, t) {
			if (t in e) return "function" == typeof e[t] ? xo(e[t]).bind(ko) : e[t]
		}
	});
module.exports = ko;