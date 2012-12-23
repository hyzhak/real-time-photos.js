//     Underscore.js 1.4.2
//     http://underscorejs.org
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore may be freely distributed under the MIT license.

//     (c) 2010-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @providesModule renderer-renderClassSet
 */

/**
 sprintf() for JavaScript 0.7-beta1
 http://www.diveintojavascript.com/projects/javascript-sprintf

 Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.
 * Neither the name of sprintf() for JavaScript nor the
 names of its contributors may be used to endorse or promote products
 derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL Alexandru Marasteanu BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


 Changelog:
 2010.09.06 - 0.7-beta1
 - features: vsprintf, support for named placeholders
 - enhancements: format cache, reduced global namespace pollution

 2010.05.22 - 0.6:
 - reverted to 0.4 and fixed the bug regarding the sign of the number 0
 Note:
 Thanks to Raphael Pigulla <raph (at] n3rd [dot) org> (http://www.n3rd.org/)
 who warned me about a bug in 0.5, I discovered that the last update was
 a regress. I appologize for that.

 2010.05.09 - 0.5:
 - bug fix: 0 is now preceeded with a + sign
 - bug fix: the sign was not at the right position on padded results (Kamal Abdali)
 - switched from GPL to BSD license

 2007.10.21 - 0.4:
 - unit test and patch (David Baird)

 2007.09.17 - 0.3:
 - bug fix: no longer throws exception on empty paramenters (Hans Pufal)

 2007.09.11 - 0.2:
 - feature: added argument swapping

 2007.04.03 - 0.1:
 - initial release
 **/

define("keyMirror", ["require", "exports", "module"], function (e, t, n) {
    var r = function (e) {
        var t = {}, n;
        if (!e)return e;
        for (n in e) {
            if (!e.hasOwnProperty(n))continue;
            t[n] = n
        }
        return t
    };
    n.exports = r
}), define("throwIf", ["require", "exports", "module"], function (e, t, n) {
    var r = function (e, t) {
        if (e)throw new Error(t)
    };
    n.exports = r
}), define("ReactErrors", ["require", "exports", "module", "keyMirror", "throwIf"], function (e, t, n) {
    var r = e("keyMirror"), i = e("throwIf"), s = r({CLASS_SPEC:null, CONTROL_WITHOUT_BACKING_DOM:null, NO_RENDER_NODE:null, USING_CHILD_TWICE:null, DUAL_TRANSACTION:null, MISSING_TRANSACTION:null, INVALID_STATE:null, ON_DOM_READY_MISMATCH:null, INVALID_COMPONENT:null, RUNAWAY_TREE:null, ESCAPE_TYPE:null});
    s.throwIf = i, n.exports = s
}), define("objMapKeyVal", ["require", "exports", "module"], function (e, t, n) {
    var r = function (e, t, n) {
        var r, i = 0, s = {};
        if (!e)return e;
        for (r in e) {
            if (!e.hasOwnProperty(r))continue;
            s[r] = t.call(n, r, e[r], i++)
        }
        return s
    };
    n.exports = r
}), define("ReactBrowserUtils", ["require", "exports", "module", "ReactErrors", "objMapKeyVal"], function (e, t, n) {
    function s(e) {
        return{"&":"&amp;", ">":"&gt;", "<":"&lt;", '"':"&quot;", "'":"&#x27;", "/":"&#x2f;"}[e]
    }

    var r = e("ReactErrors"), i = e("objMapKeyVal"), o = document.createElement("div"), u = {getSupportedStyleMap:function () {
        var e = {}, t;
        for (t in o.style)e[t] = u.escapeTextForBrowser(t);
        return e
    }, getContentAccessorKey:function () {
        return o.innerText !== undefined ? "innerText" : "textContent"
    }, escapeTextForBrowser:function (e) {
        return r.throwIf((!e || !e.indexOf) && isNaN(e), r.ESCAPE_TYPE), ("" + e).replace(/[&><"'\/]/g, s)
    }, supportsEvent:function (e, t) {
        var n = document.createElement("div"), r = "on" + e, i = r in n, s = !!o.addEventListener;
        return i || (n.setAttribute || (n = document.createElement("div")), n.setAttribute && n.removeAttribute && (n.setAttribute(r, ""), i = typeof n[r] == "function", typeof n[r] != "undefined" && (n[r] = undefined), n.removeAttribute(r))), n = null, (t && s || !t) && i
    }};
    n.exports = u
}), define("BrowserScroll", ["require", "exports", "module"], function (e, t, n) {
    var r = {getPageScrollLeft:function () {
        return window.pageXOffset || document.scrollLeft || document.body.scrollLeft || 0
    }, getPageScrollTop:function () {
        return window.pageYOffset || document.scrollTop || document.body.scrollTop || 0
    }};
    n.exports = r
}), define("ReactEnv", ["require", "exports", "module", "ReactBrowserUtils", "BrowserScroll"], function (e, t, n) {
    var r = e("ReactBrowserUtils"), i = e("BrowserScroll"), s = {currentPageScrollLeft:0, currentPageScrollTop:0, browserInfo:null, refreshAuthoritativeScrollValues:function () {
        s.currentPageScrollLeft = i.getPageScrollLeft(), s.currentPageScrollTop = i.getPageScrollTop()
    }, ensureBrowserDetected:function () {
        s.browserInfo = r.browserDetection()
    }};
    n.exports = s
}), define("ReactEventConstants", ["require", "exports", "module"], function (e, t, n) {
    var r = {onScroll:1, onTouchTap:2, onTouchEnd:3, onTouchMove:4, onTouchStart:5, onTouchDrag:6, onTouchDragDone:7, onClick:8, onDragDone:9, onDrag:10, onMouseWheel:11, onKeyUp:12, onKeyDown:13, onKeyPress:14, onFocus:15, onBlur:16, onMouseIn:17, onMouseOut:18, onMouseDown:19, onMouseUp:20, onChange:21}, i = {mouseMove:{}, mouseIn:{}, mouseDown:{abstractEquivalent:r.onMouseDown}, mouseUp:{abstractEquivalent:r.onMouseUp}, mouseOut:{}, click:{abstractEquivalent:r.onClick}, mouseWheel:{abstractEquivalent:r.onMouseWheel}, touchStart:{abstractEquivalent:r.onTouchStart}, touchEnd:{abstractEquivalent:r.onTouchEnd}, touchMove:{abstractEquivalent:r.onTouchMove}, touchCancel:{}, keyUp:{abstractEquivalent:r.onKeyUp}, keyPress:{abstractEquivalent:r.onKeyPress}, keyDown:{abstractEquivalent:r.onKeyDown}, focus:{abstractEquivalent:r.onFocus}, blur:{abstractEquivalent:r.onBlur}, scroll:{abstractEquivalent:r.onScroll}, change:{abstractEquivalent:r.onChange}}, s = {registrationTypes:r, topLevelEvents:i};
    n.exports = s
}), define("TouchEventUtils", ["require", "exports", "module"], function (e, t, n) {
    var r = {extractSingleTouch:function (e) {
        var t = e.touches, n = e.changedTouches, r = t && t.length > 0, i = n && n.length > 0;
        return!r && i ? n[0] : r ? t[0] : e
    }};
    n.exports = r
}), define("ReactAbstractEvent", ["require", "exports", "module", "ReactEnv", "ReactEventConstants", "TouchEventUtils"], function (e, t, n) {
    function u(e, t, n, r, i) {
        this.registrationType = e, this.originatingTopLevelEventType = t, this.target = n, this.nativeEvent = r, this.data = i || {}
    }

    var r = e("ReactEnv"), i = e("ReactEventConstants"), s = e("TouchEventUtils"), o = i.topLevelEvents;
    u.prototype.preventDefault = function () {
        u.preventDefaultOnNativeEvent(this.nativeEvent)
    }, u.preventDefaultOnNativeEvent = function (e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = !1
    }, u.normalizeScrollData = function (e, t) {
        return{scrollTop:t.scrollTop, scrollLeft:t.scrollLeft, clientWidth:t.clientWidth, clientHeight:t.clientHeight, scrollHeight:t.scrollHeight, scrollWidth:t.scrollWidth}
    }, u.normalizeMouseWheelData = function (e, t) {
        var n = 0, r = 0, i = 0;
        return e.wheelDelta && (n = e.wheelDelta / 120), e.detail && (n = -e.detail / 3), i = n, e.axis !== undefined && e.axis === e.HORIZONTAL_AXIS && (i = 0, r = -n), e.wheelDeltaY !== undefined && (i = e.wheelDeltaY / 120), e.wheelDeltaX !== undefined && (r = -e.wheelDeltaX / 120), {delta:n, deltaX:r, deltaY:i}
    }, u.isNativeClickEventRightClick = function (e) {
        return e.which ? e.which === 3 : e.button ? e.button === 2 : !1
    }, u.normalizeMouseData = function (e, t) {
        return{globalX:u.eventPageX(e), globalY:u.eventPageY(e), rightMouseButton:u.isNativeClickEventRightClick(e)}
    }, u.normalizeDragEventData = function (e, t, n, r, i) {
        return{globalX:t, globalY:n, startX:r, startY:i}
    }, u.fromTopLevel = function (e, t, n) {
        var r;
        switch (e) {
            case o.mouseWheel:
                r = u.normalizeMouseWheelData(t, n);
                break;
            case o.scroll:
                r = u.normalizeScrollData(t, n);
                break;
            case o.click:
            case o.change:
            case o.mouseDown:
            case o.mouseUp:
            case o.touchMove:
            case o.touchStart:
            case o.touchEnd:
                r = u.normalizeMouseData(t, n);
                break;
            default:
                r = {}
        }
        return new u(e.abstractEquivalent, e, n, t, r)
    }, u.eventPageY = function (e) {
        var t = s.extractSingleTouch(e);
        return t ? t.pageY : typeof e.pageY != "undefined" ? e.pageY : e.clientY + r.currentPageScrollTop
    }, u.eventPageX = function (e) {
        var t = s.extractSingleTouch(e);
        return t ? t.pageX : typeof e.pageX != "undefined" ? e.pageX : e.clientX + r.currentPageScrollLeft
    }, n.exports = u
}), define("ReactInstanceHandles", ["require", "exports", "module"], function (e, t, n) {
    var r = ".", i = {findComponentRoot:function (e, t) {
        var n = e.firstChild;
        while (n) {
            if (t == n.id)return n;
            if (t.indexOf(n.id) === 0)return i.findComponentRoot(n, t);
            n = n.nextSibling
        }
    }, getReactRootID:function (e) {
        return".reactRoot[" + e + "]"
    }, getReactRootIDFromNodeID:function (e) {
        var t = /\.reactRoot\[[0-9]+\]/.exec(e);
        return t && t[0]
    }, parentID:function (e) {
        if (!e || !e.length)return"";
        var t = e.lastIndexOf(".");
        return e.substr(0, t)
    }, walkIDHierarchy:function (e, t) {
        var n = e;
        while (n)t(n), n = i.parentID(n)
    }, separator:r};
    n.exports = i
}), define("ReactEvent", ["require", "exports", "module", "ReactAbstractEvent", "ReactBrowserUtils", "ReactEnv", "ReactErrors", "ReactEventConstants", "ReactInstanceHandles"], function (e, t, n) {
    function M(e, t) {
        O[e + "@" + t.registrationType] = t
    }

    function _(e, t) {
        var n = e + "@" + t;
        O[n] && delete O[n]
    }

    function D(e) {
        return function (t) {
            e(t || window.event)
        }
    }

    function P(e, t, n) {
        e.addEventListener ? e.addEventListener(t, D(n), !1) : e.attachEvent && e.attachEvent("on" + t, D(n))
    }

    function H(e, t, n) {
        e.addEventListener(t, D(n), !0)
    }

    function B(e) {
        var t = e.target || e.srcElement || window;
        return t.nodeType === 3 ? t.parentNode : t
    }

    function j(e) {
        return function (t) {
            var n = B(t);
            A && Y(e, t, n)
        }
    }

    function F(e, t) {
        return e + "@" + t
    }

    function I(e, t, n) {
        P(n, t, j(e))
    }

    function q(e, t, n) {
        H(n, t, j(e))
    }

    function R(e) {
        return!!e.abstractEquivalent
    }

    function U(e) {
        var t;
        for (t = 0; t < e.length; t++) {
            var n = e[t].abstractEvent, r = e[t].registration;
            r.listener.call(r.context, n, n.nativeEvent)
        }
    }

    function z(e, t, n, i) {
        var s = F(e, f.onDrag), o = F(e, f.onTouchDrag), u = F(e, f.onDragDone), a = F(e, f.onTouchDragDone), c = t === l.mouseDown ? s : t === l.touchStart ? o : !1, h = t === l.mouseDown ? u : t === l.touchStart ? a : !1;
        if (t === l.mouseDown || t === l.touchStart) {
            var p = r.eventPageX(n), d = r.eventPageY(n);
            g = !0, E = p, S = d;
            if (O[c]) {
                var v = r.normalizeMouseData(n, i);
                if (!v.rightMouseButton) {
                    m[c] = O[c], y++;
                    var C = O[h];
                    C && (b[h] = C, w++), x = p, T = d, N = 0
                }
            }
        }
    }

    function W(e, t, n, i) {
        var s = R(t) && F(e, t.abstractEquivalent), o = [];
        if (t === l.touchEnd) {
            var u = r.eventPageX(n), a = r.eventPageY(n), c = Math.abs(u - E) + Math.abs(a - S), h = O[F(e, f.onTouchTap)];
            c < d && h && o.push({registration:h, abstractEvent:new r(f.onTouchTap, t, i, n, {})})
        }
        return s && O[s] && o.push({abstractEvent:r.fromTopLevel(t, n, i), registration:O[s]}), o
    }

    function X(e) {
        if (!e.getAttributeNode)return!1;
        var t = e.getAttributeNode("id");
        return!!t && t.value.charAt(0) === "."
    }

    function V(e, t, n) {
        var i, s = n, u = n, a = [];
        if (e === l.mouseIn) {
            u = t.relatedTarget || t.fromElement;
            if (u)return
        } else s = t.relatedTarget || t.toElement;
        while (s && !X(s))s = s.parentNode;
        while (u && !X(u))u = u.parentNode;
        if (!u && !s)return;
        var c = "", h = "", p = {value:""};
        u && (c = (u.getAttributeNode("id") || p).value), s && (h = (s.getAttributeNode("id") || p).value);
        var d = "", m = 0;
        while (h.charAt(m) !== "" && c.charAt(m) !== "" && h.charAt(m) === c.charAt(m))m++;
        h.charAt(m - 1) === "." ? d = h.substr(0, m - 1) : d = h.substr(0, h.substr(0, m).lastIndexOf("."));
        var g, y = c, b;
        if (u) {
            b = 0;
            while (y !== d)g = O[F(y, f.onMouseOut)], g && a.push({registration:g, abstractEvent:new r(f.onMouseOut, e, n, t, {})}), y = y.substr(0, y.lastIndexOf(".")), b++, o.throwIf(b > v, o.RUNAWAY_TREE)
        }
        y = h.substr(0, d.length);
        if (s) {
            b = 0;
            while (y !== h)y = h.indexOf(".", y.length + 1) === -1 ? h : h.substr(0, h.indexOf(".", y.length + 1)), g = O[F(y, f.onMouseIn)], g && a.push({registration:g, abstractEvent:new r(f.onMouseIn, e, t, {})}), o.throwIf(b++ > v, o.RUNAWAY_TREE)
        }
        U(a)
    }

    function $(e, t, n) {
        if (!g)return;
        var i = r.eventPageX(t), s = r.eventPageY(t);
        if (y) {
            var o = Math.abs(i - x) + Math.abs(s - T), u = Date.now(), a = u - N;
            if (o < h || a < p)return;
            var c;
            for (c in m) {
                if (!m.hasOwnProperty(c))continue;
                var d = r.normalizeDragEventData(t, i, s, E, S), v = m[c], b = e === l.touchMove ? f.onTouchDrag : f.onDrag, w = new r(b, e, n, t, d);
                v.listener.call(v.context, w, t)
            }
            x = i, T = s, N = u
        }
    }

    function J(e, t, n) {
        var i = r.eventPageX(t), s = r.eventPageY(t), o, u, a = Math.abs(i - E) + Math.abs(s - S), f = [];
        if (w && a > h)for (u in b) {
            if (!b.hasOwnProperty(u))continue;
            o = b[u], f.push({registration:o[u], abstractEvent:new r(o.registrationType, e, n, t, {})})
        }
        return m = {}, g = !1, y = 0, w = 0, b = {}, E = 0, S = 0, f
    }

    function K() {
        P(window, "scroll", function (e) {
            B(e) == window && s.refreshAuthoritativeScrollValues()
        })
    }

    function Q() {
        P(window, "resize", function (e) {
            B(e) == window && s.refreshAuthoritativeScrollValues()
        })
    }

    function G(e, t) {
        K(), Q(), t ? (I(l.touchStart, "touchstart", e), I(l.touchEnd, "touchend", e), I(l.touchMove, "touchmove", e), I(l.touchCancel, "touchcancel", e)) : (I(l.mouseMove, "mousemove", e), I(l.mouseIn, "mouseover", e), I(l.mouseDown, "mousedown", e), I(l.mouseUp, "mouseup", e), I(l.mouseOut, "mouseout", e), I(l.click, "click", e), I(l.mouseWheel, "mousewheel", e)), I(l.keyUp, "keyup", e), I(l.keyPress, "keypress", e), I(l.keyDown, "keydown", e), I(l.change, "change", e), I(l.mouseWheel, "DOMMouseScroll", e), I(l.scroll, "scroll", e), i.supportsEvent("focusin") ? (I(l.focus, "focusin", e), I(l.blur, "focusout", e)) : i.supportsEvent("focus", !0) && (q(l.focus, "focus", e), q(l.blur, "blur", e))
    }

    function Y(e, t, n) {
        var r = n.id;
        if (e === l.mouseMove) {
            $(e, t, n);
            return
        }
        e === l.touchMove && $(e, t, n);
        while (n.parentNode && n.parentNode !== n && (r === null || r.length === 0))n = n.parentNode, r = n.id;
        if (e === l.mouseIn || e === l.mouseOut) {
            V(e, t, n);
            return
        }
        var i = [];
        a.walkIDHierarchy(r, function (r) {
            i = i.concat(W(r, e, t, n)), z(r, e, t, n)
        });
        if (e === l.mouseUp || e === l.touchEnd || e === l.touchCancel)i = i.concat(J(e, t, n));
        U(i)
    }

    var r = e("ReactAbstractEvent"), i = e("ReactBrowserUtils"), s = e("ReactEnv"), o = e("ReactErrors"), u = e("ReactEventConstants"), a = e("ReactInstanceHandles"), f = u.registrationTypes, l = u.topLevelEvents, c = Object.keys(f), h = 1, p = 5, d = 15, v = 200, m = {}, g = !1, y = 0, b = {}, w = 0, E = null, S = null, x = null, T = null, N = 0, C = null, k = !1, L = {}, A = !0, O = {}, Z = {setEnabled:function (e) {
        A = e
    }, isEnabled:function () {
        return A
    }, ensureListening:function (e, t) {
        L[e.id] || (G(e, t), L[e.id] = !0)
    }, registerListener:function (e, t, n) {
        f[t] && M(e, {registrationType:f[t], listener:n})
    }, getRegistration:function (e, t) {
        return O[e + "@" + f[t]]
    }, clearAllRegistrations:function (e) {
        var t;
        for (t = 0; t < c.length; t++) {
            var n = c[t], r = f[n];
            _(e, r)
        }
    }, disableSelectionGlobally:function () {
        if (k)return;
        C = document.onselectstart, k = !0, document.onselectstart = function (e) {
            r.preventDefaultOnNativeEvent(e || window.event)
        }
    }, enableSelectionGlobally:function () {
        k && (document.onselectstart = C, C = null, k = !1)
    }};
    n.exports = Z
}), define("ReactInputSelection", ["require", "exports", "module"], function (e, t, n) {
    var r = {hasSelectionCapabilities:function (e) {
        return e && (e.nodeName === "INPUT" && e.type === "text" || e.nodeName === "TEXTAREA")
    }, getSelectionInformation:function () {
        var e = document.activeElement;
        return{focusedElem:e, selectionRange:r.hasSelectionCapabilities(e) ? r.getSelection(e) : null}
    }, restoreSelection:function (e) {
        var t = document.activeElement, n = e.focusedElem, i = e.selectionRange;
        t !== n && document.getElementById(n.id) && (r.hasSelectionCapabilities(n) && r.setSelection(n, i), n.focus())
    }, getSelection:function (e) {
        if (!document.selection)return{start:e.selectionStart, end:e.selectionEnd};
        var t = document.selection.createRange();
        if (t.parentElement() !== e)return{start:0, end:0};
        var n = e.value.length;
        if (e.nodeName === "INPUT")return{start:-t.moveStart("character", -n), end:-t.moveEnd("character", -n)};
        var r = t.duplicate();
        r.moveToElementText(e), r.setEndPoint("StartToEnd", t);
        var i = n - r.text.length;
        return r.setEndPoint("StartToStart", t), {start:n - r.text.length, end:i}
    }, setSelection:function (e, t) {
        var n = t.start, r = t.end;
        typeof r == "undefined" && (r = n);
        if (document.selection) {
            if (e.tagName === "TEXTAREA") {
                var i = (e.value.slice(0, n).match(/\r/g) || []).length, s = (e.value.slice(n, r).match(/\r/g) || []).length;
                n -= i, r -= i + s
            }
            var o = e.createTextRange();
            o.collapse(!0), o.moveStart("character", n), o.moveEnd("character", r - n), o.select()
        } else e.selectionStart = n, e.selectionEnd = Math.min(r, e.value.length), e.focus()
    }};
    n.exports = r
}), define("ReactOnDOMReady", ["require", "exports", "module", "ReactErrors"], function (e, t, n) {
    var r = e("ReactErrors"), i = null, s = {enqueue:function (e, t) {
        r.throwIf(!i, r.ON_DOM_READY_MISMATCH), i.push({instance:e, callback:t})
    }, beginEnqueueing:function () {
        r.throwIf(i, r.ON_DOM_READY_MISMATCH), i = []
    }, notifyAll:function () {
        var e = i, t = e.length;
        r.throwIf(!e, r.ON_DOM_READY_MISMATCH), i = null;
        for (var n = 0; n < t; n += 1) {
            var s = e[n].instance, o = e[n].callback;
            o.call(s, s.getDOMNode())
        }
        e.length = 0
    }};
    n.exports = s
}), define("ReactDOMTransaction", ["require", "exports", "module", "ReactErrors", "ReactEvent", "ReactInputSelection", "ReactOnDOMReady"], function (e, t, n) {
    var r = e("ReactErrors"), i = e("ReactEvent"), s = e("ReactInputSelection"), o = e("ReactOnDOMReady"), u = null, a = {totalOnDomReadyTime:0, perform:function (e, t) {
        a.initialize();
        try {
            e.call(t)
        } catch (n) {
            throw n
        } finally {
            a.close()
        }
    }, initialize:function () {
        r.throwIf(u, r.DUAL_TRANSACTION), i.setEnabled(!1), o.beginEnqueueing(), u = {selectionInformation:s.getSelectionInformation()}
    }, close:function () {
        r.throwIf(!u, r.MISSING_TRANSACTION), s.restoreSelection(u.selectionInformation), i.setEnabled(!0), u = null;
        var e = Date.now();
        o.notifyAll(), a.totalOnDomReadyTime += Date.now() - e
    }};
    n.exports = a
}), define("ReactMount", ["require", "exports", "module", "ReactErrors", "ReactEvent", "ReactInstanceHandles"], function (e, t, n) {
    var r = e("ReactErrors"), i = e("ReactEvent"), s = e("ReactInstanceHandles"), o = 0, u = {instanceByReactRootId:{}, containersByReactRootId:{}, totalInstantiationTime:0, totalInjectionTime:0, useTouchEvents:!1, scrollMonitor:function (e, t) {
        return t()
    }, prepareForRendering:function (e) {
        i.ensureListening(e, u.useTouchEvents)
    }, renderComponent:function (e, t) {
        return r.throwIf(!t, r.NO_RENDER_NODE), u.prepareForRendering(document.documentElement), u.renderMarkupIntoNode(e, t), e
    }, constructAndRenderComponent:function (e, t, n) {
        u.renderComponent(e(t), n)
    }, renderMarkupIntoNode:function (e, t) {
        var n = this.registerContainer(t);
        u.instanceByReactRootId[n] = e, e.genMarkupIntoContainer(n, t)
    }, registerContainer:function (e) {
        var t = s.getReactRootID(o);
        return u.containersByReactRootId[t] = e, o++, t
    }, destroyAndReleaseReactRootNode:function (e) {
        var t = u.getInstanceHeldByContainer(e), n = e.firstChild && e.firstChild.id;
        t.destroy(), delete u.instanceByReactRootId[n], delete u.containersByReactRootId[n], e.innerHTML = ""
    }, getInstanceHeldByContainer:function (e) {
        var t = u.instanceByReactRootId[e.firstChild && e.firstChild.id];
        return t
    }, findReactContainerForId:function (e) {
        return u.containersByReactRootId[s.getReactRootIDFromNodeID(e)]
    }, renderOrUpdateComponent:function (e, t) {
        var n = u.getInstanceHeldByContainer(t);
        if (n) {
            var r = n.updateAllProps.bind(n, e.props);
            return u.scrollMonitor(t, r), n
        }
        return u.renderComponent(e, t)
    }};
    n.exports = u
}), define("mergeHelpers", ["require", "exports", "module", "keyMirror", "throwIf"], function (e, t, n) {
    var r = e("keyMirror"), i = e("throwIf"), s = 36, o = r({MERGE_ARRAY_FAIL:null, MERGE_CORE_FAILURE:null, MERGE_TYPE_USAGE_FAILURE:null, MERGE_DEEP_MAX_LEVELS:null, MERGE_DEEP_NO_ARR_STRATEGY:null}), u = function (e) {
        return typeof e != "object" || e === null
    }, a = {MAX_MERGE_DEPTH:s, isTerminal:u, normalizeMergeArg:function (e) {
        return e === undefined || e === null ? {} : e
    }, checkMergeArrayArgs:function (e, t) {
        i(!Array.isArray(e) || !Array.isArray(t), o.MERGE_CORE_FAILURE)
    }, checkMergeObjectArgs:function (e, t) {
        var n = u(e) || u(t) || Array.isArray(e) || Array.isArray(t);
        i(n, o.MERGE_CORE_FAILURE)
    }, checkMergeLevel:function (e) {
        i(e >= s, o.MERGE_DEEP_MAX_LEVELS)
    }, checkArrayStrategy:function (e) {
        i(e !== undefined && !(e in a.ArrayStrategies), o.MERGE_DEEP_NO_ARR_STRATEGY)
    }, ArrayStrategies:r({Clobber:!0, IndexByIndex:!0}), ERRORS:o};
    n.exports = a
}), define("merge", ["require", "exports", "module", "mergeHelpers"], function (e, t, n) {
    var r = e("mergeHelpers"), i = r.checkMergeObjectArgs, s = r.normalizeMergeArg, o = function (e, t) {
        var n = s(e), r = s(t);
        i(n, r);
        var o = {};
        for (var u in n)n.hasOwnProperty(u) && (o[u] = n[u]);
        for (var a in r)r.hasOwnProperty(a) && (o[a] = r[a]);
        return o
    };
    n.exports = o
}), define("ReactComponent", ["require", "exports", "module", "ReactDOMTransaction", "ReactErrors", "ReactInstanceHandles", "ReactMount", "merge"], function (e, t, n) {
    var r = e("ReactDOMTransaction"), i = e("ReactErrors"), s = e("ReactInstanceHandles"), o = e("ReactMount"), u = e("merge"), a = {currentlyConstructingOwner:null, isValidComponent:function (e) {
        return e && typeof e.genMarkupIntoContainer == "function" && typeof e.updateAllProps == "function"
    }, validateReactComponentInstance:function (e) {
        i.throwIf(!a.isValidComponent(e), i.INVALID_COMPONENT)
    }, ReactComponentMixin:{getDOMNode:function () {
        var e = this.rootDomNode;
        if (!e) {
            e = document.getElementById(this._rootDomId);
            if (!e) {
                var t = o.findReactContainerForId(this._rootDomId);
                e = s.findComponentRoot(t, this._rootDomId)
            }
        }
        return this.rootDomNode = e
    }, captureOwnerAtConstruction:function () {
        var e = this.props;
        e.ref && (e.owner = a.currentlyConstructingOwner)
    }, attachOwnersRefsOnRender:function () {
        var e = this.props;
        e.ref && e.owner.attachRef(e.ref, this)
    }, detachOwnersRefs:function () {
        var e = this.props;
        e.ref && e.owner.refs[e.ref] === this && e.owner.detachRef(e.ref)
    }, destroyComponent:function () {
        this.detachOwnersRefs(), this.isDestroyed = !0
    }, detachFromDom:function () {
        var e = this.getDOMNode();
        e.parentNode.removeChild(e)
    }, destroyAndDetachFromDom:function () {
        this.destroy(), this.detachFromDom()
    }, initializeComponent:function (e) {
        this._rootDomId = e, this.attachOwnersRefsOnRender()
    }, handleGenMarkup:function () {
    }, handleUpdateAllProps:function () {
    }, updateProps:function (e) {
        this.updateAllProps(u(this.props, e))
    }, updateAllProps:function (e) {
        if (e.isStatic)return;
        r.perform(this.handleUpdateAllProps.bind(this, e))
    }, genMarkupIntoContainer:function (e, t) {
        r.perform(this.genMarkupIntoContainerImpl.bind(this, e, t))
    }, genMarkupIntoContainerImpl:function (e, t) {
        var n = Date.now(), r = this.handleGenMarkup(e);
        o.totalInstantiationTime += Date.now() - n;
        var i = Date.now(), s = t.nextSibling, u = t.parentNode;
        u ? (u.removeChild(t), t.innerHTML = r, s ? u.insertBefore(t, s) : u.appendChild(t)) : t.innerHTML = r, o.totalInjectionTime += Date.now() - i
    }, handleUpdateAllPropsComponent:function (e) {
        var t = this.props, n = this.rootDomId;
        i.throwIf(n, i.CONTROL_WITHOUT_BACKING_DOM);
        if (e.owner === t.owner && e.ref === t.ref)return;
        this.detachOwnersRefs(), e.ref && e.owner.attachRef(e.ref, this)
    }}};
    n.exports = a
}), define("ReactDOMAttributes", ["require", "exports", "module", "ReactBrowserUtils", "ReactEnv", "ReactEvent", "objMapKeyVal"], function (e, t, n) {
    var r = e("ReactBrowserUtils"), i = e("ReactEnv"), s = e("ReactEvent"), o = e("objMapKeyVal"), u = function (e) {
        return e
    }, a = r.getContentAccessorKey(), f = r.getSupportedStyleMap(), l = function (e) {
        return e.replace(/[A-Z]/g, function (e) {
            return"-" + e.toLowerCase()
        })
    }, c = function (e, t, n) {
        return o(n, function (n, r) {
            return e + r(n) + t
        })
    }, h = o(f, function () {
        return l
    }), p = {className:function () {
        return"class"
    }, margin:l, marginRight:l, marginLeft:l, tabIndex:u, marginTop:l, marginBottom:l, padding:l, paddingRight:l, paddingLeft:l, paddingTop:l, paddingBottom:l, dir:u, width:u, height:u, alt:u, src:u, value:u, checked:u, href:u, placeholder:u, title:u, selected:u, target:u, scrollTop:u, scrollLeft:u, name:u, type:u, htmlFor:u, rel:u, ajaxify:u, allowfullscreen:u, allowscriptaccess:u, wmode:u, contentEditable:u, x1:u, x2:u, y1:u, y2:u, transform:u, opacity:u, "stroke-width":u, "stroke-linecap":u, stroke:u}, d = {CONTENT_ACCESSOR_KEY:a, customAttrRegexp:/^(data|aria)-[a-z_][a-z\d_.\-]*$/, styleFeatureNames:c(";", ":", h), allTagAttrPieces:c(" ", "='", p), cssNumber:{textDecoration:!0, zoom:!0, fillOpacity:!0, fontWeight:!0, opacity:!0, orphans:!0, zIndex:!0, outline:!0}, controlSimply:{className:!0, scrollTop:!0, scrollLeft:!0, title:!0, rows:!0, cols:!0, size:!0}, controlDirectlyNonIdempotent:{value:!0, src:!0, checked:!0, selected:!0, rel:!0}, controlUsingSetAttr:{ajaxify:!0, margin:!0, marginRight:!0, marginLeft:!0, marginTop:!0, marginBottom:!0, padding:!0, paddingRight:!0, paddingLeft:!0, paddingTop:!0, paddingBottom:!0, width:!0, height:!0, href:!0, placeholder:!0, target:!0}};
    n.exports = d
}), define("ReactDOMUtils", ["require", "exports", "module", "ReactBrowserUtils", "ReactDOMAttributes"], function (e, t, n) {
    function a(e, t, n) {
        return n ? n.nextSibling ? e.insertBefore(t, n.nextSibling) : e.appendChild(t) : e.insertBefore(t, e.firstChild)
    }

    function f(e, t, n) {
        var r, i, s = t.length;
        for (i = 0; i < s; i++)r = a(e, t[0], r || n);
        return r
    }

    function l(e, t, n) {
        if (!t)return 0;
        var r = document.createElement(e ? e.tagName : "div");
        r.innerHTML = t;
        var i = r.childNodes, s = i.length, o = n ? e.childNodes[n - 1] : null;
        return f(e, i, o), s
    }

    function c(e, t, n) {
        var r = e.childNodes;
        return t.parentNode && t.parentNode.removeChild(t), n >= r.length ? e.appendChild(t) : e.insertBefore(t, r[n]), t
    }

    function h(e, t) {
        return isNaN(t) ? t !== 0 && !t ? "" : t : s[e] ? t : o(t) + "px"
    }

    function p(e) {
        var t = "", n;
        for (n in e) {
            if (!e.hasOwnProperty(n))continue;
            var r = e[n];
            r !== undefined && (t += u[n] + h(n, r))
        }
        return t
    }

    var r = e("ReactBrowserUtils"), i = e("ReactDOMAttributes"), s = i.cssNumber, o = r.escapeTextForBrowser, u = i.styleFeatureNames, d = {insertNodeAfterNode:a, insertNodeAt:c, insertMarkupAt:l, serializeInlineStyle:p};
    n.exports = d
}), define("ReactOwner", ["require", "exports", "module"], function (e, t, n) {
    var r = {attachRef:function (e, t) {
        var n = this.refs || (this.refs = {});
        n[e] = t
    }, detachRef:function (e) {
        delete this.refs[e]
    }};
    n.exports = r
}), define("keyOf", ["require", "exports", "module"], function (e, t, n) {
    var r = function (e) {
        var t;
        for (t in e) {
            if (!e.hasOwnProperty(t))continue;
            return t
        }
        return null
    };
    n.exports = r
}), define("mergeDeepInto", ["require", "exports", "module", "keyMirror", "mergeHelpers", "throwIf"], function (e, t, n) {
    var r = e("keyMirror"), i = e("mergeHelpers"), s = e("throwIf"), o = i.ArrayStrategies, u = i.checkArrayStrategy, a = i.checkMergeArrayArgs, f = i.checkMergeLevel, l = i.checkMergeObjectArgs, c = i.isTerminal, h = i.normalizeMergeArg, p = r({RUN_TIME_ARRAY_MERGE_FAIL:null}), d = function (e, t, n, r) {
        l(e, t), f(r);
        var i = t ? Object.keys(t) : [];
        for (var s = 0; s < i.length; s++) {
            var o = i[s];
            m(e, t, o, n, r)
        }
    }, v = function (e, t, n, r) {
        a(e, t), f(r);
        var i = Math.max(e.length, t.length);
        for (var s = 0; s < i; s++)m(e, t, s, n, r)
    }, m = function (e, t, n, r, u) {
        var a = t[n], f = t.hasOwnProperty(n), l = f && c(a), h = f && Array.isArray(a), p = f && !h && !h, m = e[n], g = e.hasOwnProperty(n), y = g && c(m), b = g && Array.isArray(m), w = g && !b && !b;
        y ? l ? e[n] = a : h ? (e[n] = [], v(e[n], a, r, u + 1)) : p ? (e[n] = {}, d(e[n], a, r, u + 1)) : f || (e[n] = m) : b ? l ? e[n] = a : h ? (s(!o[r], i.ERRORS.RUN_TIME_ARRAY_MERGE_FAIL), r === o.Clobber && (m.length = 0), v(m, a, r, u + 1)) : p ? (e[n] = {}, d(e[n], a, r, u + 1)) : !f : w ? l ? e[n] = a : h ? (e[n] = [], v(e[n], a, r, u + 1)) : p ? d(m, a, r, u + 1) : !f : g || (l ? e[n] = a : h ? (e[n] = [], v(e[n], a, r, u + 1)) : p ? (e[n] = {}, d(e[n], a, r, u + 1)) : !f)
    }, g = function (e, t, n) {
        var r = h(t);
        u(n), d(e, r, n, 0)
    };
    n.exports = g
}), define("mergeInto", ["require", "exports", "module", "mergeHelpers"], function (e, t, n) {
    var r = e("mergeHelpers"), i = r.checkMergeObjectArgs, s = r.normalizeMergeArg, o = function (e, t) {
        var n = s(t), r;
        i(e, n);
        for (r in n) {
            if (!n.hasOwnProperty(r))continue;
            e[r] = n[r]
        }
    };
    n.exports = o
}), define("mixInto", ["require", "exports", "module"], function (e, t, n) {
    var r = function (e, t) {
        var n;
        for (n in t) {
            if (!t.hasOwnProperty(n))continue;
            e.prototype[n] = t[n]
        }
    };
    n.exports = r
}), define("ReactCompositeComponent", ["require", "exports", "module", "ReactComponent", "ReactDOMTransaction", "ReactDOMUtils", "ReactErrors", "ReactOnDOMReady", "ReactOwner", "keyOf", "mergeDeepInto", "mergeHelpers", "mergeInto", "mixInto"], function (e, t, n) {
    var r = e("ReactComponent"), i = e("ReactDOMTransaction"), s = e("ReactDOMUtils"), o = e("ReactErrors"), u = e("ReactOnDOMReady"), a = e("ReactOwner"), f = e("keyOf"), l = e("mergeDeepInto"), c = e("mergeHelpers"), h = e("mergeInto"), p = e("mixInto"), d = s.insertMarkupAt, v = c.isTerminal, m = Array.prototype.slice, g = {render:function () {
    }, handleUpdateAllProps:function (e) {
        this.handleUpdateAllPropsComponent(e);
        if (this.propTrigger) {
            var t = this.propTrigger(e);
            t && h(this.state, t)
        }
        if (this.needsRedraw && !this.needsRedraw(e))return;
        this.props = e, this.handleReconcile()
    }, initializeCompositeComponent:function (e) {
        this.getInitialState && (this.state = this.getInitialState(), __DEV__ && o.throwIf(!validState(this.state), o.INVALID_STATE)), this.onDomReady && u.enqueue(this, this.onDomReady)
    }, handleGenMarkup:function (e) {
        this.initializeComponent(e), this.initializeCompositeComponent(e), r.currentlyConstructingOwner = this;
        var t = this.getAllRenderResults(), n = this.handleGenMarkupResults(t);
        return r.currentlyConstructingOwner = null, r.validateReactComponentInstance(n), this.renderedChild = n, n.handleGenMarkup(e)
    }, getAllRenderResults:function () {
        return this.render()
    }, handleGenMarkupResults:function (e) {
        return e
    }, destroy:function () {
        this.destroyComponent(), this.destructor && this.destructor(), this.renderedChild.destroy(), this.renderedChild = null, this.refs && (this.refs = null)
    }, justUpdateState:function (e) {
        i.perform(function () {
            h(this.state, e)
        }, this)
    }, justUpdateStateDeep:function (e) {
        i.perform(function () {
            l(this.state, e)
        }, this)
    }, updateState:function (e) {
        return i.perform(function () {
            h(this.state, e), this.handleReconcile()
        }, this), !0
    }, updateStateDeep:function (e) {
        return i.perform(function () {
            l(this.state, e), this.handleReconcile()
        }, this), !0
    }, createStateUpdater:function (e) {
        var t = this;
        return e ? function () {
            t.updateState(e)
        } : e
    }, stateUpdater:function (e) {
        var t = this;
        return e ? typeof e == "function" ? function () {
            t.updateState(e.apply(t, arguments))
        } : function () {
            t.updateState(e)
        } : e
    }, stateValueForwarder:function (e) {
        var t = this;
        return function (n) {
            var r = f(e), i = {};
            r && (i[r] = n, t.updateState(i))
        }
    }, stateUpdaterCurry:function (e) {
        var t = this, n = m.call(arguments, 1);
        return function () {
            t.updateState(e.apply(t, n.concat(m.call(arguments))))
        }
    }, reconcile:function () {
        i.perform(this.handleReconcile, this)
    }, handleReconcile:function () {
        r.currentlyConstructingOwner = this;
        var e = this.getAllRenderResults();
        r.currentlyConstructingOwner = null;
        var t = this.reconcileResults(e);
        r.validateReactComponentInstance(t);
        if (!t.props.isStatic) {
            var n = this.renderedChild;
            if (n.constructor === t.constructor)n.handleUpdateAllProps(t.props); else {
                var i = t.handleGenMarkup(this._rootDomId), s = n.getDOMNode(), o = s.parentNode;
                n.destroyAndDetachFromDom(), d(o, i, 0), this.renderedChild = t
            }
        }
    }, reconcileResults:function (e) {
        return e
    }}, y = {createComponentConstructor:function (e) {
        var t = e.mixins, n = function (e) {
            this.props = e || {}, this.captureOwnerAtConstruction()
        };
        p(n, r.ReactComponentMixin), p(n, g), p(n, a);
        if (t) {
            var i;
            for (i = 0; i < t.length; i++)p(n, t[i])
        }
        return p(n, e), o.throwIf(!n.prototype.render, o.CLASS_SPEC), n
    }, createComponent:function (e) {
        var t = y.createComponentConstructor(e), n = function (e) {
            return new t(e)
        };
        return n.componentConstructor = t, n.originalSpec = e, n
    }, ReactCompositeComponentMixin:g};
    n.exports = y
}), define("React", ["require", "exports", "module", "ReactCompositeComponent", "ReactMount"], function (e, t, n) {
    var r = e("ReactCompositeComponent"), i = e("ReactMount"), s = {initializeTouchEvents:function (e) {
        i.useTouchEvents = e
    }, createComponent:r.createComponent, constructAndRenderComponent:i.constructAndRenderComponent, renderComponent:i.renderComponent, renderOrUpdateComponent:i.renderOrUpdateComponent, destroyAndReleaseReactRootNode:i.destroyAndReleaseReactRootNode};
    n.exports = s
}), define("underscore", ["require", "exports", "module"], function (e, t, n) {
    (function () {
        var e = this, r = e._, i = {}, s = Array.prototype, o = Object.prototype, u = Function.prototype, a = s.push, f = s.slice, l = s.concat, c = s.unshift, h = o.toString, p = o.hasOwnProperty, d = s.forEach, v = s.map, m = s.reduce, g = s.reduceRight, y = s.filter, b = s.every, w = s.some, E = s.indexOf, S = s.lastIndexOf, x = Array.isArray, T = Object.keys, N = u.bind, C = function (e) {
            if (e instanceof C)return e;
            if (!(this instanceof C))return new C(e);
            this._wrapped = e
        };
        typeof t != "undefined" ? (typeof n != "undefined" && n.exports && (t = n.exports = C), t._ = C) : e._ = C, C.VERSION = "1.4.2";
        var k = C.each = C.forEach = function (e, t, n) {
            if (e == null)return;
            if (d && e.forEach === d)e.forEach(t, n); else if (e.length === +e.length) {
                for (var r = 0, s = e.length; r < s; r++)if (t.call(n, e[r], r, e) === i)return
            } else for (var o in e)if (C.has(e, o) && t.call(n, e[o], o, e) === i)return
        };
        C.map = C.collect = function (e, t, n) {
            var r = [];
            return e == null ? r : v && e.map === v ? e.map(t, n) : (k(e, function (e, i, s) {
                r[r.length] = t.call(n, e, i, s)
            }), r)
        }, C.reduce = C.foldl = C.inject = function (e, t, n, r) {
            var i = arguments.length > 2;
            e == null && (e = []);
            if (m && e.reduce === m)return r && (t = C.bind(t, r)), i ? e.reduce(t, n) : e.reduce(t);
            k(e, function (e, s, o) {
                i ? n = t.call(r, n, e, s, o) : (n = e, i = !0)
            });
            if (!i)throw new TypeError("Reduce of empty array with no initial value");
            return n
        }, C.reduceRight = C.foldr = function (e, t, n, r) {
            var i = arguments.length > 2;
            e == null && (e = []);
            if (g && e.reduceRight === g)return r && (t = C.bind(t, r)), arguments.length > 2 ? e.reduceRight(t, n) : e.reduceRight(t);
            var s = e.length;
            if (s !== +s) {
                var o = C.keys(e);
                s = o.length
            }
            k(e, function (u, a, f) {
                a = o ? o[--s] : --s, i ? n = t.call(r, n, e[a], a, f) : (n = e[a], i = !0)
            });
            if (!i)throw new TypeError("Reduce of empty array with no initial value");
            return n
        }, C.find = C.detect = function (e, t, n) {
            var r;
            return L(e, function (e, i, s) {
                if (t.call(n, e, i, s))return r = e, !0
            }), r
        }, C.filter = C.select = function (e, t, n) {
            var r = [];
            return e == null ? r : y && e.filter === y ? e.filter(t, n) : (k(e, function (e, i, s) {
                t.call(n, e, i, s) && (r[r.length] = e)
            }), r)
        }, C.reject = function (e, t, n) {
            var r = [];
            return e == null ? r : (k(e, function (e, i, s) {
                t.call(n, e, i, s) || (r[r.length] = e)
            }), r)
        }, C.every = C.all = function (e, t, n) {
            t || (t = C.identity);
            var r = !0;
            return e == null ? r : b && e.every === b ? e.every(t, n) : (k(e, function (e, s, o) {
                if (!(r = r && t.call(n, e, s, o)))return i
            }), !!r)
        };
        var L = C.some = C.any = function (e, t, n) {
            t || (t = C.identity);
            var r = !1;
            return e == null ? r : w && e.some === w ? e.some(t, n) : (k(e, function (e, s, o) {
                if (r || (r = t.call(n, e, s, o)))return i
            }), !!r)
        };
        C.contains = C.include = function (e, t) {
            var n = !1;
            return e == null ? n : E && e.indexOf === E ? e.indexOf(t) != -1 : (n = L(e, function (e) {
                return e === t
            }), n)
        }, C.invoke = function (e, t) {
            var n = f.call(arguments, 2);
            return C.map(e, function (e) {
                return(C.isFunction(t) ? t : e[t]).apply(e, n)
            })
        }, C.pluck = function (e, t) {
            return C.map(e, function (e) {
                return e[t]
            })
        }, C.where = function (e, t) {
            return C.isEmpty(t) ? [] : C.filter(e, function (e) {
                for (var n in t)if (t[n] !== e[n])return!1;
                return!0
            })
        }, C.max = function (e, t, n) {
            if (!t && C.isArray(e) && e[0] === +e[0] && e.length < 65535)return Math.max.apply(Math, e);
            if (!t && C.isEmpty(e))return-Infinity;
            var r = {computed:-Infinity};
            return k(e, function (e, i, s) {
                var o = t ? t.call(n, e, i, s) : e;
                o >= r.computed && (r = {value:e, computed:o})
            }), r.value
        }, C.min = function (e, t, n) {
            if (!t && C.isArray(e) && e[0] === +e[0] && e.length < 65535)return Math.min.apply(Math, e);
            if (!t && C.isEmpty(e))return Infinity;
            var r = {computed:Infinity};
            return k(e, function (e, i, s) {
                var o = t ? t.call(n, e, i, s) : e;
                o < r.computed && (r = {value:e, computed:o})
            }), r.value
        }, C.shuffle = function (e) {
            var t, n = 0, r = [];
            return k(e, function (e) {
                t = C.random(n++), r[n - 1] = r[t], r[t] = e
            }), r
        };
        var A = function (e) {
            return C.isFunction(e) ? e : function (t) {
                return t[e]
            }
        };
        C.sortBy = function (e, t, n) {
            var r = A(t);
            return C.pluck(C.map(e,function (e, t, i) {
                return{value:e, index:t, criteria:r.call(n, e, t, i)}
            }).sort(function (e, t) {
                var n = e.criteria, r = t.criteria;
                if (n !== r) {
                    if (n > r || n === void 0)return 1;
                    if (n < r || r === void 0)return-1
                }
                return e.index < t.index ? -1 : 1
            }), "value")
        };
        var O = function (e, t, n, r) {
            var i = {}, s = A(t);
            return k(e, function (t, o) {
                var u = s.call(n, t, o, e);
                r(i, u, t)
            }), i
        };
        C.groupBy = function (e, t, n) {
            return O(e, t, n, function (e, t, n) {
                (C.has(e, t) ? e[t] : e[t] = []).push(n)
            })
        }, C.countBy = function (e, t, n) {
            return O(e, t, n, function (e, t, n) {
                C.has(e, t) || (e[t] = 0), e[t]++
            })
        }, C.sortedIndex = function (e, t, n, r) {
            n = n == null ? C.identity : A(n);
            var i = n.call(r, t), s = 0, o = e.length;
            while (s < o) {
                var u = s + o >>> 1;
                n.call(r, e[u]) < i ? s = u + 1 : o = u
            }
            return s
        }, C.toArray = function (e) {
            return e ? e.length === +e.length ? f.call(e) : C.values(e) : []
        }, C.size = function (e) {
            return e.length === +e.length ? e.length : C.keys(e).length
        }, C.first = C.head = C.take = function (e, t, n) {
            return t != null && !n ? f.call(e, 0, t) : e[0]
        }, C.initial = function (e, t, n) {
            return f.call(e, 0, e.length - (t == null || n ? 1 : t))
        }, C.last = function (e, t, n) {
            return t != null && !n ? f.call(e, Math.max(e.length - t, 0)) : e[e.length - 1]
        }, C.rest = C.tail = C.drop = function (e, t, n) {
            return f.call(e, t == null || n ? 1 : t)
        }, C.compact = function (e) {
            return C.filter(e, function (e) {
                return!!e
            })
        };
        var M = function (e, t, n) {
            return k(e, function (e) {
                C.isArray(e) ? t ? a.apply(n, e) : M(e, t, n) : n.push(e)
            }), n
        };
        C.flatten = function (e, t) {
            return M(e, t, [])
        }, C.without = function (e) {
            return C.difference(e, f.call(arguments, 1))
        }, C.uniq = C.unique = function (e, t, n, r) {
            var i = n ? C.map(e, n, r) : e, s = [], o = [];
            return k(i, function (n, r) {
                if (t ? !r || o[o.length - 1] !== n : !C.contains(o, n))o.push(n), s.push(e[r])
            }), s
        }, C.union = function () {
            return C.uniq(l.apply(s, arguments))
        }, C.intersection = function (e) {
            var t = f.call(arguments, 1);
            return C.filter(C.uniq(e), function (e) {
                return C.every(t, function (t) {
                    return C.indexOf(t, e) >= 0
                })
            })
        }, C.difference = function (e) {
            var t = l.apply(s, f.call(arguments, 1));
            return C.filter(e, function (e) {
                return!C.contains(t, e)
            })
        }, C.zip = function () {
            var e = f.call(arguments), t = C.max(C.pluck(e, "length")), n = new Array(t);
            for (var r = 0; r < t; r++)n[r] = C.pluck(e, "" + r);
            return n
        }, C.object = function (e, t) {
            var n = {};
            for (var r = 0, i = e.length; r < i; r++)t ? n[e[r]] = t[r] : n[e[r][0]] = e[r][1];
            return n
        }, C.indexOf = function (e, t, n) {
            if (e == null)return-1;
            var r = 0, i = e.length;
            if (n) {
                if (typeof n != "number")return r = C.sortedIndex(e, t), e[r] === t ? r : -1;
                r = n < 0 ? Math.max(0, i + n) : n
            }
            if (E && e.indexOf === E)return e.indexOf(t, n);
            for (; r < i; r++)if (e[r] === t)return r;
            return-1
        }, C.lastIndexOf = function (e, t, n) {
            if (e == null)return-1;
            var r = n != null;
            if (S && e.lastIndexOf === S)return r ? e.lastIndexOf(t, n) : e.lastIndexOf(t);
            var i = r ? n : e.length;
            while (i--)if (e[i] === t)return i;
            return-1
        }, C.range = function (e, t, n) {
            arguments.length <= 1 && (t = e || 0, e = 0), n = arguments[2] || 1;
            var r = Math.max(Math.ceil((t - e) / n), 0), i = 0, s = new Array(r);
            while (i < r)s[i++] = e, e += n;
            return s
        };
        var _ = function () {
        };
        C.bind = function (t, n) {
            var r, i;
            if (t.bind === N && N)return N.apply(t, f.call(arguments, 1));
            if (!C.isFunction(t))throw new TypeError;
            return i = f.call(arguments, 2), r = function () {
                if (this instanceof r) {
                    _.prototype = t.prototype;
                    var e = new _, s = t.apply(e, i.concat(f.call(arguments)));
                    return Object(s) === s ? s : e
                }
                return t.apply(n, i.concat(f.call(arguments)))
            }
        }, C.bindAll = function (e) {
            var t = f.call(arguments, 1);
            return t.length == 0 && (t = C.functions(e)), k(t, function (t) {
                e[t] = C.bind(e[t], e)
            }), e
        }, C.memoize = function (e, t) {
            var n = {};
            return t || (t = C.identity), function () {
                var r = t.apply(this, arguments);
                return C.has(n, r) ? n[r] : n[r] = e.apply(this, arguments)
            }
        }, C.delay = function (e, t) {
            var n = f.call(arguments, 2);
            return setTimeout(function () {
                return e.apply(null, n)
            }, t)
        }, C.defer = function (e) {
            return C.delay.apply(C, [e, 1].concat(f.call(arguments, 1)))
        }, C.throttle = function (e, t) {
            var n, r, i, s, o, u, a = C.debounce(function () {
                o = s = !1
            }, t);
            return function () {
                n = this, r = arguments;
                var f = function () {
                    i = null, o && (u = e.apply(n, r)), a()
                };
                return i || (i = setTimeout(f, t)), s ? o = !0 : (s = !0, u = e.apply(n, r)), a(), u
            }
        }, C.debounce = function (e, t, n) {
            var r, i;
            return function () {
                var s = this, o = arguments, u = function () {
                    r = null, n || (i = e.apply(s, o))
                }, a = n && !r;
                return clearTimeout(r), r = setTimeout(u, t), a && (i = e.apply(s, o)), i
            }
        }, C.once = function (e) {
            var t = !1, n;
            return function () {
                return t ? n : (t = !0, n = e.apply(this, arguments), e = null, n)
            }
        }, C.wrap = function (e, t) {
            return function () {
                var n = [e];
                return a.apply(n, arguments), t.apply(this, n)
            }
        }, C.compose = function () {
            var e = arguments;
            return function () {
                var t = arguments;
                for (var n = e.length - 1; n >= 0; n--)t = [e[n].apply(this, t)];
                return t[0]
            }
        }, C.after = function (e, t) {
            return e <= 0 ? t() : function () {
                if (--e < 1)return t.apply(this, arguments)
            }
        }, C.keys = T || function (e) {
            if (e !== Object(e))throw new TypeError("Invalid object");
            var t = [];
            for (var n in e)C.has(e, n) && (t[t.length] = n);
            return t
        }, C.values = function (e) {
            var t = [];
            for (var n in e)C.has(e, n) && t.push(e[n]);
            return t
        }, C.pairs = function (e) {
            var t = [];
            for (var n in e)C.has(e, n) && t.push([n, e[n]]);
            return t
        }, C.invert = function (e) {
            var t = {};
            for (var n in e)C.has(e, n) && (t[e[n]] = n);
            return t
        }, C.functions = C.methods = function (e) {
            var t = [];
            for (var n in e)C.isFunction(e[n]) && t.push(n);
            return t.sort()
        }, C.extend = function (e) {
            return k(f.call(arguments, 1), function (t) {
                for (var n in t)e[n] = t[n]
            }), e
        }, C.pick = function (e) {
            var t = {}, n = l.apply(s, f.call(arguments, 1));
            return k(n, function (n) {
                n in e && (t[n] = e[n])
            }), t
        }, C.omit = function (e) {
            var t = {}, n = l.apply(s, f.call(arguments, 1));
            for (var r in e)C.contains(n, r) || (t[r] = e[r]);
            return t
        }, C.defaults = function (e) {
            return k(f.call(arguments, 1), function (t) {
                for (var n in t)e[n] == null && (e[n] = t[n])
            }), e
        }, C.clone = function (e) {
            return C.isObject(e) ? C.isArray(e) ? e.slice() : C.extend({}, e) : e
        }, C.tap = function (e, t) {
            return t(e), e
        };
        var D = function (e, t, n, r) {
            if (e === t)return e !== 0 || 1 / e == 1 / t;
            if (e == null || t == null)return e === t;
            e instanceof C && (e = e._wrapped), t instanceof C && (t = t._wrapped);
            var i = h.call(e);
            if (i != h.call(t))return!1;
            switch (i) {
                case"[object String]":
                    return e == String(t);
                case"[object Number]":
                    return e != +e ? t != +t : e == 0 ? 1 / e == 1 / t : e == +t;
                case"[object Date]":
                case"[object Boolean]":
                    return+e == +t;
                case"[object RegExp]":
                    return e.source == t.source && e.global == t.global && e.multiline == t.multiline && e.ignoreCase == t.ignoreCase
            }
            if (typeof e != "object" || typeof t != "object")return!1;
            var s = n.length;
            while (s--)if (n[s] == e)return r[s] == t;
            n.push(e), r.push(t);
            var o = 0, u = !0;
            if (i == "[object Array]") {
                o = e.length, u = o == t.length;
                if (u)while (o--)if (!(u = D(e[o], t[o], n, r)))break
            } else {
                var a = e.constructor, f = t.constructor;
                if (a !== f && !(C.isFunction(a) && a instanceof a && C.isFunction(f) && f instanceof f))return!1;
                for (var l in e)if (C.has(e, l)) {
                    o++;
                    if (!(u = C.has(t, l) && D(e[l], t[l], n, r)))break
                }
                if (u) {
                    for (l in t)if (C.has(t, l) && !(o--))break;
                    u = !o
                }
            }
            return n.pop(), r.pop(), u
        };
        C.isEqual = function (e, t) {
            return D(e, t, [], [])
        }, C.isEmpty = function (e) {
            if (e == null)return!0;
            if (C.isArray(e) || C.isString(e))return e.length === 0;
            for (var t in e)if (C.has(e, t))return!1;
            return!0
        }, C.isElement = function (e) {
            return!!e && e.nodeType === 1
        }, C.isArray = x || function (e) {
            return h.call(e) == "[object Array]"
        }, C.isObject = function (e) {
            return e === Object(e)
        }, k(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function (e) {
            C["is" + e] = function (t) {
                return h.call(t) == "[object " + e + "]"
            }
        }), C.isArguments(arguments) || (C.isArguments = function (e) {
            return!!e && !!C.has(e, "callee")
        }), typeof /./ != "function" && (C.isFunction = function (e) {
            return typeof e == "function"
        }), C.isFinite = function (e) {
            return C.isNumber(e) && isFinite(e)
        }, C.isNaN = function (e) {
            return C.isNumber(e) && e != +e
        }, C.isBoolean = function (e) {
            return e === !0 || e === !1 || h.call(e) == "[object Boolean]"
        }, C.isNull = function (e) {
            return e === null
        }, C.isUndefined = function (e) {
            return e === void 0
        }, C.has = function (e, t) {
            return p.call(e, t)
        }, C.noConflict = function () {
            return e._ = r, this
        }, C.identity = function (e) {
            return e
        }, C.times = function (e, t, n) {
            for (var r = 0; r < e; r++)t.call(n, r)
        }, C.random = function (e, t) {
            return t == null && (t = e, e = 0), e + (0 | Math.random() * (t - e + 1))
        };
        var P = {escape:{"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#x27;", "/":"&#x2F;"}};
        P.unescape = C.invert(P.escape);
        var H = {escape:new RegExp("[" + C.keys(P.escape).join("") + "]", "g"), unescape:new RegExp("(" + C.keys(P.unescape).join("|") + ")", "g")};
        C.each(["escape", "unescape"], function (e) {
            C[e] = function (t) {
                return t == null ? "" : ("" + t).replace(H[e], function (t) {
                    return P[e][t]
                })
            }
        }), C.result = function (e, t) {
            if (e == null)return null;
            var n = e[t];
            return C.isFunction(n) ? n.call(e) : n
        }, C.mixin = function (e) {
            k(C.functions(e), function (t) {
                var n = C[t] = e[t];
                C.prototype[t] = function () {
                    var e = [this._wrapped];
                    return a.apply(e, arguments), q.call(this, n.apply(C, e))
                }
            })
        };
        var B = 0;
        C.uniqueId = function (e) {
            var t = B++;
            return e ? e + t : t
        }, C.templateSettings = {evaluate:/<%([\s\S]+?)%>/g, interpolate:/<%=([\s\S]+?)%>/g, escape:/<%-([\s\S]+?)%>/g};
        var j = /(.)^/, F = {"'":"'", "\\":"\\", "\r":"r", "\n":"n", "	":"t", "\u2028":"u2028", "\u2029":"u2029"}, I = /\\|'|\r|\n|\t|\u2028|\u2029/g;
        C.template = function (e, t, n) {
            n = C.defaults({}, n, C.templateSettings);
            var r = new RegExp([(n.escape || j).source, (n.interpolate || j).source, (n.evaluate || j).source].join("|") + "|$", "g"), i = 0, s = "__p+='";
            e.replace(r, function (t, n, r, o, u) {
                s += e.slice(i, u).replace(I, function (e) {
                    return"\\" + F[e]
                }), s += n ? "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'" : r ? "'+\n((__t=(" + r + "))==null?'':__t)+\n'" : o ? "';\n" + o + "\n__p+='" : "", i = u + t.length
            }), s += "';\n", n.variable || (s = "with(obj||{}){\n" + s + "}\n"), s = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + s + "return __p;\n";
            try {
                var o = new Function(n.variable || "obj", "_", s)
            } catch (u) {
                throw u.source = s, u
            }
            if (t)return o(t, C);
            var a = function (e) {
                return o.call(this, e, C)
            };
            return a.source = "function(" + (n.variable || "obj") + "){\n" + s + "}", a
        }, C.chain = function (e) {
            return C(e).chain()
        };
        var q = function (e) {
            return this._chain ? C(e).chain() : e
        };
        C.mixin(C), k(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (e) {
            var t = s[e];
            C.prototype[e] = function () {
                var n = this._wrapped;
                return t.apply(n, arguments), (e == "shift" || e == "splice") && n.length === 0 && delete n[0], q.call(this, n)
            }
        }), k(["concat", "join", "slice"], function (e) {
            var t = s[e];
            C.prototype[e] = function () {
                return q.call(this, t.apply(this._wrapped, arguments))
            }
        }), C.extend(C.prototype, {chain:function () {
            return this._chain = !0, this
        }, value:function () {
            return this._wrapped
        }})
    }).call(this)
}), define("backbone", ["require", "exports", "module", "underscore"], function (e, t, n) {
    (function () {
        var n = this, r = Function("return this")(), i = n.Backbone, s = Array.prototype, o = s.push, u = s.slice, a = s.splice, f;
        typeof t != "undefined" ? f = t : f = n.Backbone = {}, f.VERSION = "0.9.2";
        var l = r._;
        !l && typeof e != "undefined" && (l = e("underscore")), f.$ = r.jQuery || r.Zepto || r.ender, f.noConflict = function () {
            return n.Backbone = i, this
        }, f.emulateHTTP = !1, f.emulateJSON = !1;
        var c = /\s+/, h = f.Events = {on:function (e, t, n) {
            var r, i, s;
            if (!t)return this;
            e = e.split(c), r = this._callbacks || (this._callbacks = {});
            while (i = e.shift())s = r[i] || (r[i] = []), s.push(t, n);
            return this
        }, off:function (e, t, n) {
            var r, i, s, o;
            if (!(i = this._callbacks))return this;
            if (!(e || t || n))return delete this._callbacks, this;
            e = e ? e.split(c) : l.keys(i);
            while (r = e.shift()) {
                if (!(s = i[r]) || !t && !n) {
                    delete i[r];
                    continue
                }
                for (o = s.length - 2; o >= 0; o -= 2)t && s[o] !== t || n && s[o + 1] !== n || s.splice(o, 2)
            }
            return this
        }, trigger:function (e) {
            var t, n, r, i, s, o, u, a;
            if (!(n = this._callbacks))return this;
            a = [], e = e.split(c);
            for (i = 1, s = arguments.length; i < s; i++)a[i - 1] = arguments[i];
            while (t = e.shift()) {
                if (u = n.all)u = u.slice();
                if (r = n[t])r = r.slice();
                if (r)for (i = 0, s = r.length; i < s; i += 2)r[i].apply(r[i + 1] || this, a);
                if (u) {
                    o = [t].concat(a);
                    for (i = 0, s = u.length; i < s; i += 2)u[i].apply(u[i + 1] || this, o)
                }
            }
            return this
        }};
        h.bind = h.on, h.unbind = h.off;
        var p = f.Model = function (e, t) {
            var n, r = e || {};
            t && t.collection && (this.collection = t.collection), t && t.parse && (r = this.parse(r));
            if (n = l.result(this, "defaults"))r = l.extend({}, n, r);
            this.attributes = {}, this._escapedAttributes = {}, this.cid = l.uniqueId("c"), this.changed = {}, this._changes = {}, this._pending = {}, this.set(r, {silent:!0}), this.changed = {}, this._changes = {}, this._pending = {}, this._previousAttributes = l.clone(this.attributes), this.initialize.apply(this, arguments)
        };
        l.extend(p.prototype, h, {changed:null, _changes:null, _pending:null, _changing:null, idAttribute:"id", initialize:function () {
        }, toJSON:function (e) {
            return l.clone(this.attributes)
        }, sync:function () {
            return f.sync.apply(this, arguments)
        }, get:function (e) {
            return this.attributes[e]
        }, escape:function (e) {
            var t;
            if (t = this._escapedAttributes[e])return t;
            var n = this.get(e);
            return this._escapedAttributes[e] = l.escape(n == null ? "" : "" + n)
        }, has:function (e) {
            return this.get(e) != null
        }, set:function (e, t, n) {
            var r, i;
            if (e == null)return this;
            l.isObject(e) ? (i = e, n = t) : (i = {})[e] = t;
            var s = n && n.silent, o = n && n.unset;
            i instanceof p && (i = i.attributes);
            if (o)for (r in i)i[r] = void 0;
            if (!this._validate(i, n))return!1;
            this.idAttribute in i && (this.id = i[this.idAttribute]);
            var u = this._changing, a = this.attributes, f = this._escapedAttributes, c = this._previousAttributes || {};
            for (r in i) {
                t = i[r];
                if (!l.isEqual(a[r], t) || o && l.has(a, r))delete f[r], this._changes[r] = !0;
                o ? delete a[r] : a[r] = t, !l.isEqual(c[r], t) || l.has(a, r) !== l.has(c, r) ? (this.changed[r] = t, s || (this._pending[r] = !0)) : (delete this.changed[r], delete this._pending[r], u || delete this._changes[r]), u && l.isEqual(a[r], u[r]) && delete this._changes[r]
            }
            return s || this.change(n), this
        }, unset:function (e, t) {
            return t = l.extend({}, t, {unset:!0}), this.set(e, null, t)
        }, clear:function (e) {
            return e = l.extend({}, e, {unset:!0}), this.set(l.clone(this.attributes), e)
        }, fetch:function (e) {
            e = e ? l.clone(e) : {};
            var t = this, n = e.success;
            return e.success = function (r, i, s) {
                if (!t.set(t.parse(r, s), e))return!1;
                n && n(t, r, e)
            }, this.sync("read", this, e)
        }, save:function (e, t, n) {
            var r, i, s;
            e == null || l.isObject(e) ? (r = e, n = t) : e != null && ((r = {})[e] = t), n = n ? l.clone(n) : {};
            if (n.wait) {
                if (!this._validate(r, n))return!1;
                i = l.clone(this.attributes)
            }
            var o = l.extend({}, n, {silent:!0});
            if (r && !this.set(r, n.wait ? o : n))return!1;
            if (!r && !this._validate(null, n))return!1;
            var u = this, a = n.success;
            n.success = function (e, t, i) {
                s = !0;
                var o = u.parse(e, i);
                n.wait && (o = l.extend(r || {}, o));
                if (!u.set(o, n))return!1;
                a && a(u, e, n)
            };
            var f = this.sync(this.isNew() ? "create" : "update", this, n);
            return!s && n.wait && (this.clear(o), this.set(i, o)), f
        }, destroy:function (e) {
            e = e ? l.clone(e) : {};
            var t = this, n = e.success, r = function () {
                t.trigger("destroy", t, t.collection, e)
            };
            e.success = function (i) {
                (e.wait || t.isNew()) && r(), n && n(t, i, e)
            };
            if (this.isNew())return e.success(), !1;
            var i = this.sync("delete", this, e);
            return e.wait || r(), i
        }, url:function () {
            var e = l.result(this, "urlRoot") || l.result(this.collection, "url") || _();
            return this.isNew() ? e : e + (e.charAt(e.length - 1) === "/" ? "" : "/") + encodeURIComponent(this.id)
        }, parse:function (e, t) {
            return e
        }, clone:function () {
            return new this.constructor(this.attributes)
        }, isNew:function () {
            return this.id == null
        }, change:function (e) {
            var t = this._changing, n = this._changing = {};
            for (var r in this._changes)this._pending[r] = !0;
            var i = this._changes;
            this._changes = {};
            var s = [];
            for (var r in i)n[r] = this.get(r), s.push(r);
            for (var o = 0, u = s.length; o < u; o++)this.trigger("change:" + s[o], this, n[s[o]], e);
            if (t)return this;
            while (!l.isEmpty(this._pending)) {
                this._pending = {}, this.trigger("change", this, e);
                for (var r in this.changed) {
                    if (this._pending[r] || this._changes[r])continue;
                    delete this.changed[r]
                }
                this._previousAttributes = l.clone(this.attributes)
            }
            return this._changing = null, this
        }, hasChanged:function (e) {
            return e == null ? !l.isEmpty(this.changed) : l.has(this.changed, e)
        }, changedAttributes:function (e) {
            if (!e)return this.hasChanged() ? l.clone(this.changed) : !1;
            var t, n = !1, r = this._previousAttributes;
            for (var i in e) {
                if (l.isEqual(r[i], t = e[i]))continue;
                (n || (n = {}))[i] = t
            }
            return n
        }, previous:function (e) {
            return e == null || !this._previousAttributes ? null : this._previousAttributes[e]
        }, previousAttributes:function () {
            return l.clone(this._previousAttributes)
        }, isValid:function (e) {
            return!this.validate || !this.validate(this.attributes, e)
        }, _validate:function (e, t) {
            if (t && t.silent || !this.validate)return!0;
            e = l.extend({}, this.attributes, e);
            var n = this.validate(e, t);
            return n ? (t && t.error && t.error(this, n, t), this.trigger("error", this, n, t), !1) : !0
        }});
        var d = f.Collection = function (e, t) {
            t || (t = {}), t.model && (this.model = t.model), t.comparator !== void 0 && (this.comparator = t.comparator), this._reset(), this.initialize.apply(this, arguments), e && (t.parse && (e = this.parse(e)), this.reset(e, {silent:!0, parse:t.parse}))
        };
        l.extend(d.prototype, h, {model:p, initialize:function () {
        }, toJSON:function (e) {
            return this.map(function (t) {
                return t.toJSON(e)
            })
        }, sync:function () {
            return f.sync.apply(this, arguments)
        }, add:function (e, t) {
            var n, r, i, s, u, f = t && t.at;
            e = l.isArray(e) ? e.slice() : [e];
            for (n = 0, i = e.length; n < i; n++) {
                if (e[n] = this._prepareModel(e[n], t))continue;
                throw new Error("Can't add an invalid model to a collection")
            }
            for (n = e.length - 1; n >= 0; n--) {
                s = e[n], u = s.id != null && this._byId[s.id];
                if (u || this._byCid[s.cid]) {
                    t && t.merge && u && u.set(s, t), e.splice(n, 1);
                    continue
                }
                s.on("all", this._onModelEvent, this), this._byCid[s.cid] = s, s.id != null && (this._byId[s.id] = s)
            }
            this.length += e.length, r = [f != null ? f : this.models.length, 0], o.apply(r, e), a.apply(this.models, r), this.comparator && f == null && this.sort({silent:!0});
            if (t && t.silent)return this;
            while (s = e.shift())s.trigger("add", s, this, t);
            return this
        }, remove:function (e, t) {
            var n, r, i, s;
            t || (t = {}), e = l.isArray(e) ? e.slice() : [e];
            for (n = 0, r = e.length; n < r; n++) {
                s = this.getByCid(e[n]) || this.get(e[n]);
                if (!s)continue;
                delete this._byId[s.id], delete this._byCid[s.cid], i = this.indexOf(s), this.models.splice(i, 1), this.length--, t.silent || (t.index = i, s.trigger("remove", s, this, t)), this._removeReference(s)
            }
            return this
        }, push:function (e, t) {
            return e = this._prepareModel(e, t), this.add(e, t), e
        }, pop:function (e) {
            var t = this.at(this.length - 1);
            return this.remove(t, e), t
        }, unshift:function (e, t) {
            return e = this._prepareModel(e, t), this.add(e, l.extend({at:0}, t)), e
        }, shift:function (e) {
            var t = this.at(0);
            return this.remove(t, e), t
        }, slice:function (e, t) {
            return this.models.slice(e, t)
        }, get:function (e) {
            return e == null ? void 0 : this._byId[e.id != null ? e.id : e]
        }, getByCid:function (e) {
            return e && this._byCid[e.cid || e]
        }, at:function (e) {
            return this.models[e]
        }, where:function (e) {
            return l.isEmpty(e) ? [] : this.filter(function (t) {
                for (var n in e)if (e[n] !== t.get(n))return!1;
                return!0
            })
        }, sort:function (e) {
            if (!this.comparator)throw new Error("Cannot sort a set without a comparator");
            return l.isString(this.comparator) || this.comparator.length === 1 ? this.models = this.sortBy(this.comparator, this) : this.models.sort(l.bind(this.comparator, this)), (!e || !e.silent) && this.trigger("reset", this, e), this
        }, pluck:function (e) {
            return l.invoke(this.models, "get", e)
        }, reset:function (e, t) {
            for (var n = 0, r = this.models.length; n < r; n++)this._removeReference(this.models[n]);
            return this._reset(), e && this.add(e, l.extend({silent:!0}, t)), (!t || !t.silent) && this.trigger("reset", this, t), this
        }, fetch:function (e) {
            e = e ? l.clone(e) : {}, e.parse === void 0 && (e.parse = !0);
            var t = this, n = e.success;
            return e.success = function (r, i, s) {
                t[e.add ? "add" : "reset"](t.parse(r, s), e), n && n(t, r, e)
            }, this.sync("read", this, e)
        }, create:function (e, t) {
            var n = this;
            t = t ? l.clone(t) : {}, e = this._prepareModel(e, t);
            if (!e)return!1;
            t.wait || n.add(e, t);
            var r = t.success;
            return t.success = function (e, t, i) {
                i.wait && n.add(e, i), r && r(e, t, i)
            }, e.save(null, t), e
        }, parse:function (e, t) {
            return e
        }, clone:function () {
            return new this.constructor(this.models)
        }, chain:function () {
            return l(this.models).chain()
        }, _reset:function (e) {
            this.length = 0, this.models = [], this._byId = {}, this._byCid = {}
        }, _prepareModel:function (e, t) {
            if (e instanceof p)return e.collection || (e.collection = this), e;
            t || (t = {}), t.collection = this;
            var n = new this.model(e, t);
            return n._validate(n.attributes, t) ? n : !1
        }, _removeReference:function (e) {
            this === e.collection && delete e.collection, e.off("all", this._onModelEvent, this)
        }, _onModelEvent:function (e, t, n, r) {
            if ((e === "add" || e === "remove") && n !== this)return;
            e === "destroy" && this.remove(t, r), t && e === "change:" + t.idAttribute && (delete this._byId[t.previous(t.idAttribute)], t.id != null && (this._byId[t.id] = t)), this.trigger.apply(this, arguments)
        }});
        var v = ["forEach", "each", "map", "collect", "reduce", "foldl", "inject", "reduceRight", "foldr", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "sortedIndex", "toArray", "size", "first", "head", "take", "initial", "rest", "tail", "last", "without", "indexOf", "shuffle", "lastIndexOf", "isEmpty"];
        l.each(v, function (e) {
            d.prototype[e] = function () {
                var t = u.call(arguments);
                return t.unshift(this.models), l[e].apply(l, t)
            }
        });
        var m = ["groupBy", "countBy", "sortBy"];
        l.each(m, function (e) {
            d.prototype[e] = function (t, n) {
                var r = l.isFunction(t) ? t : function (e) {
                    return e.get(t)
                };
                return l[e](this.models, r, n)
            }
        });
        var g = f.Router = function (e) {
            e || (e = {}), e.routes && (this.routes = e.routes), this._bindRoutes(), this.initialize.apply(this, arguments)
        }, y = /\((.*?)\)/g, b = /:\w+/g, w = /\*\w+/g, E = /[-{}[\]+?.,\\^$|#\s]/g;
        l.extend(g.prototype, h, {initialize:function () {
        }, route:function (e, t, n) {
            return l.isRegExp(e) || (e = this._routeToRegExp(e)), n || (n = this[t]), f.history.route(e, l.bind(function (r) {
                var i = this._extractParameters(e, r);
                n && n.apply(this, i), this.trigger.apply(this, ["route:" + t].concat(i)), f.history.trigger("route", this, t, i)
            }, this)), this
        }, navigate:function (e, t) {
            return f.history.navigate(e, t), this
        }, _bindRoutes:function () {
            if (!this.routes)return;
            var e, t = l.keys(this.routes);
            while ((e = t.pop()) != null)this.route(e, this.routes[e])
        }, _routeToRegExp:function (e) {
            return e = e.replace(E, "\\$&").replace(y, "(?:$1)?").replace(b, "([^/]+)").replace(w, "(.*?)"), new RegExp("^" + e + "$")
        }, _extractParameters:function (e, t) {
            return e.exec(t).slice(1)
        }});
        var S = f.History = function () {
            this.handlers = [], l.bindAll(this, "checkUrl"), typeof window != "undefined" && (this.location = window.location, this.history = window.history)
        }, x = /^[#\/]/, T = /^\/+|\/+$/g, N = /msie [\w.]+/, C = /\/$/;
        S.started = !1, l.extend(S.prototype, h, {interval:50, getHash:function (e) {
            var t = (e || this).location.href.match(/#(.*)$/);
            return t ? t[1] : ""
        }, getFragment:function (e, t) {
            if (e == null)if (this._hasPushState || !this._wantsHashChange || t) {
                e = this.location.pathname;
                var n = this.root.replace(C, "");
                e.indexOf(n) || (e = e.substr(n.length))
            } else e = this.getHash();
            return decodeURIComponent(e.replace(x, ""))
        }, start:function (e) {
            if (S.started)throw new Error("Backbone.history has already been started");
            S.started = !0, this.options = l.extend({}, {root:"/"}, this.options, e), this.root = this.options.root, this._wantsHashChange = this.options.hashChange !== !1, this._wantsPushState = !!this.options.pushState, this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
            var t = this.getFragment(), n = document.documentMode, r = N.exec(navigator.userAgent.toLowerCase()) && (!n || n <= 7);
            this.root = ("/" + this.root + "/").replace(T, "/"), r && this._wantsHashChange && (this.iframe = f.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow, this.navigate(t)), this._hasPushState ? f.$(window).bind("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange"in window && !r ? f.$(window).bind("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)), this.fragment = t;
            var i = this.location, s = i.pathname.replace(/[^\/]$/, "$&/") === this.root;
            if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !s)return this.fragment = this.getFragment(null, !0), this.location.replace(this.root + this.location.search + "#" + this.fragment), !0;
            this._wantsPushState && this._hasPushState && s && i.hash && (this.fragment = this.getHash().replace(x, ""), this.history.replaceState({}, document.title, this.root + this.fragment + i.search));
            if (!this.options.silent)return this.loadUrl()
        }, stop:function () {
            f.$(window).unbind("popstate", this.checkUrl).unbind("hashchange", this.checkUrl), clearInterval(this._checkUrlInterval), S.started = !1
        }, route:function (e, t) {
            this.handlers.unshift({route:e, callback:t})
        }, checkUrl:function (e) {
            var t = this.getFragment();
            t === this.fragment && this.iframe && (t = this.getFragment(this.getHash(this.iframe)));
            if (t === this.fragment)return!1;
            this.iframe && this.navigate(t), this.loadUrl() || this.loadUrl(this.getHash())
        }, loadUrl:function (e) {
            var t = this.fragment = this.getFragment(e), n = l.any(this.handlers, function (e) {
                if (e.route.test(t))return e.callback(t), !0
            });
            return n
        }, navigate:function (e, t) {
            if (!S.started)return!1;
            if (!t || t === !0)t = {trigger:t};
            e = this.getFragment(e || "");
            if (this.fragment === e)return;
            this.fragment = e;
            var n = this.root + e;
            if (this._hasPushState)this.history[t.replace ? "replaceState" : "pushState"]({}, document.title, n); else {
                if (!this._wantsHashChange)return this.location.assign(n);
                this._updateHash(this.location, e, t.replace), this.iframe && e !== this.getFragment(this.getHash(this.iframe)) && (t.replace || this.iframe.document.open().close(), this._updateHash(this.iframe.location, e, t.replace))
            }
            t.trigger && this.loadUrl(e)
        }, _updateHash:function (e, t, n) {
            if (n) {
                var r = e.href.replace(/(javascript:|#).*$/, "");
                e.replace(r + "#" + t)
            } else e.hash = "#" + t
        }}), f.history = new S;
        var k = f.View = function (e) {
            this.cid = l.uniqueId("view"), this._configure(e || {}), this._ensureElement(), this.initialize.apply(this, arguments), this.delegateEvents()
        }, L = /^(\S+)\s*(.*)$/, A = ["model", "collection", "el", "id", "attributes", "className", "tagName"];
        l.extend(k.prototype, h, {tagName:"div", $:function (e) {
            return this.$el.find(e)
        }, initialize:function () {
        }, render:function () {
            return this
        }, dispose:function () {
            return this.undelegateEvents(), this.model && this.model.off && this.model.off(null, null, this), this.collection && this.collection.off && this.collection.off(null, null, this), this
        }, remove:function () {
            return this.dispose(), this.$el.remove(), this
        }, make:function (e, t, n) {
            var r = document.createElement(e);
            return t && f.$(r).attr(t), n != null && f.$(r).html(n), r
        }, setElement:function (e, t) {
            return this.$el && this.undelegateEvents(), this.$el = e instanceof f.$ ? e : f.$(e), this.el = this.$el[0], t !== !1 && this.delegateEvents(), this
        }, delegateEvents:function (e) {
            if (!e && !(e = l.result(this, "events")))return;
            this.undelegateEvents();
            for (var t in e) {
                var n = e[t];
                l.isFunction(n) || (n = this[e[t]]);
                if (!n)throw new Error('Method "' + e[t] + '" does not exist');
                var r = t.match(L), i = r[1], s = r[2];
                n = l.bind(n, this), i += ".delegateEvents" + this.cid, s === "" ? this.$el.bind(i, n) : this.$el.delegate(s, i, n)
            }
        }, undelegateEvents:function () {
            this.$el.unbind(".delegateEvents" + this.cid)
        }, _configure:function (e) {
            this.options && (e = l.extend({}, this.options, e)), l.extend(this, l.pick(e, A)), this.options = e
        }, _ensureElement:function () {
            if (!this.el) {
                var e = l.extend({}, l.result(this, "attributes"));
                this.id && (e.id = l.result(this, "id")), this.className && (e["class"] = l.result(this, "className")), this.setElement(this.make(l.result(this, "tagName"), e), !1)
            } else this.setElement(l.result(this, "el"), !1)
        }});
        var O = {create:"POST", update:"PUT", "delete":"DELETE", read:"GET"};
        f.sync = function (e, t, n) {
            var r = O[e];
            n || (n = {});
            var i = {type:r, dataType:"json"};
            n.url || (i.url = l.result(t, "url") || _()), !n.data && t && (e === "create" || e === "update") && (i.contentType = "application/json", i.data = JSON.stringify(t)), f.emulateJSON && (i.contentType = "application/x-www-form-urlencoded", i.data = i.data ? {model:i.data} : {});
            if (f.emulateHTTP && (r === "PUT" || r === "DELETE")) {
                i.type = "POST", f.emulateJSON && (i.data._method = r);
                var s = n.beforeSend;
                n.beforeSend = function (e) {
                    e.setRequestHeader("X-HTTP-Method-Override", r);
                    if (s)return s.apply(this, arguments)
                }
            }
            i.type !== "GET" && !f.emulateJSON && (i.processData = !1);
            var o = n.success;
            n.success = function (e, r, i) {
                o && o(e, r, i), t.trigger("sync", t, e, n)
            };
            var u = n.error;
            return n.error = function (e, r, i) {
                u && u(t, e, n), t.trigger("error", t, e, n)
            }, f.ajax(l.extend(i, n))
        }, f.ajax = function () {
            return f.$.ajax.apply(f.$, arguments)
        };
        var M = function (e, t) {
            var n = this, r;
            e && l.has(e, "constructor") ? r = e.constructor : r = function () {
                n.apply(this, arguments)
            }, l.extend(r, n, t);
            var i = function () {
                this.constructor = r
            };
            return i.prototype = n.prototype, r.prototype = new i, e && l.extend(r.prototype, e), r.__super__ = n.prototype, r
        };
        p.extend = d.extend = g.extend = k.extend = S.extend = M;
        var _ = function () {
            throw new Error('A "url" property or function must be specified')
        }
    }).call(this)
}), define("user", ["require", "exports", "module", "backbone"], function (e, t, n) {
    var r = e("backbone"), i = n.exports = r.Model.extend({isLoggedInUser:function () {
        var e = s.get("id");
        return o && e && parseInt(e) === parseInt(this.get("id"))
    }}), s = new i, o = !1;
    i.setLoggedInUser = function (e) {
        s.set(e), o = !0
    }, i.getLoggedInUser = function () {
        return o && s.get("id") && s
    }
}), define("fallbackSerializePosInfo", ["require", "exports", "module"], function (e, t, n) {
    var r = function (e) {
        if (!e)return"";
        var t = ";", n = e.w, r = e.h, i = e.l, s = e.t, o = e.b, u = e.r, a = e.z;
        if (n === 0 || n)t += "width:" + (n.charAt ? n + ";" : n + "px;");
        if (r === 0 || r)t += "height:" + (r.charAt ? r + ";" : r + "px;");
        if (i === 0 || i)t += "left:" + (i.charAt ? i + ";" : i + "px;");
        if (s === 0 || s)t += "top:" + (s.charAt ? s + ";" : s + "px;");
        if (o === 0 || o)t += "bottom:" + (o.charAt ? o + ";" : o + "px;");
        if (u === 0 || u)t += "right:" + (u.charAt ? u + ";" : u + "px;");
        if (a === 0 || a)t += "z-index:" + a + ";";
        return t += "position:absolute", t
    };
    n.exports = r
}), define("renderer-renderClassSet", ["require", "exports", "module"], function (e, t, n) {
    function r(e, t) {
        var n = "", i;
        if (Array.isArray(e))for (var s = 0; s < e.length; s++)n += r(e[s], t), t = t || !!n; else for (i in e)e[i] && (t && (n += " "), n += i, t = !0);
        return n
    }

    n.exports = r
}), define("ReactDOMGeneration", ["require", "exports", "module", "ReactBrowserUtils", "ReactDOMAttributes", "ReactDOMUtils", "ReactEvent", "ReactEventConstants", "fallbackSerializePosInfo", "keyOf", "renderer-renderClassSet"], function (e, t, n) {
    var r = e("ReactBrowserUtils"), i = e("ReactDOMAttributes"), s = e("ReactDOMUtils"), o = e("ReactEvent"), u = e("ReactEventConstants"), a = e("fallbackSerializePosInfo"), f = e("keyOf"), l = u.registrationTypes, c = i.allTagAttrPieces, h = i.customAttrRegexp, p = r.escapeTextForBrowser, d = a, v = o.registerListener, m = e("renderer-renderClassSet"), g = s.serializeInlineStyle, y = f({classSet:null}), b = f({className:null}), w = f({style:null}), E = f({posInfo:null}), S = {handleGenMarkupDOMGeneration:function () {
        var e, t = this.props, n = "", r = "", i = null, s = null;
        for (e in t) {
            if (!t.hasOwnProperty(e))continue;
            var o = t[e];
            if (o === null || typeof o == "undefined")continue;
            e === y ? i = m(o) : e === b ? s = p(o) : c[e] ? n += c[e] + p(o) + "'" : e === w ? r += p(g(o)) : e === E ? r += p(d(o)) : l[e] ? v(this._rootDomId, e, o) : h.test(e) && (n += " " + e + "='" + p(o) + "'")
        }
        if (i || s) {
            var u = i ? s ? i + " " + s : i : s;
            n += ' class="' + u + '"'
        }
        return r && (n += ' style="' + r + '"'), n += ' id="' + this._rootDomId + '">', t.content ? n += p(t.content) : t.dangerouslySetInnerHtml && (n += t.dangerouslySetInnerHtml.__html), n
    }}, x = {ReactNativeComponentGenerationMixin:S, setAcceleratedPositioner:function (e) {
        d = e
    }};
    n.exports = x
}), define("ReactDOMMutation", ["require", "exports", "module", "ReactDOMAttributes", "ReactDOMUtils", "ReactEvent", "ReactEventConstants", "fallbackSerializePosInfo", "keyOf", "renderer-renderClassSet"], function (e, t, n) {
    var r = e("ReactDOMAttributes"), i = e("ReactDOMUtils"), s = e("ReactEvent"), o = e("ReactEventConstants"), u = e("fallbackSerializePosInfo"), a = e("keyOf"), f = o.registrationTypes, l = r.controlDirectlyNonIdempotent, c = r.controlSimply, h = r.controlUsingSetAttr, p = r.customAttrRegexp, d = s.registerListener, v = e("renderer-renderClassSet"), m = i.serializeInlineStyle, g = u, y = a({className:null}), b = a({classSet:null}), w = r.CONTENT_ACCESSOR_KEY, E = a({content:null}), S = a({dangerouslySetInnerHtml:null}), x = a({posInfo:null}), T = a({style:null}), N = function (e) {
        g = e
    }, C = {handleUpdateAllPropsDOMMutation:function (e) {
        var t = this.props, n = !1, r = null, i = null, s = "", o = "", u = "", a;
        for (a in e) {
            if (!e.hasOwnProperty(a))continue;
            var N = e[a];
            if (a === b)r = e.classSet, JSON.stringify(t.classSet) !== JSON.stringify(e.classSet) && (n = !0); else if (a === y)i = e.className, t.className !== e.className && (n = !0); else if (a === T)JSON.stringify(N) !== JSON.stringify(t.style) && (o = m(N)); else if (a === x) {
                var C = N, k = t.posInfo || {};
                C && (C.l !== k.l || C.t !== k.t || C.w !== k.w || C.h !== k.h || C.r !== k.r || C.b !== k.b) && (u = g(N))
            } else if (N !== t[a])if (h[a])this.getDOMNode().setAttribute(a, N); else if (a === E)this.getDOMNode()[w] = N; else if (c[a])this.getDOMNode()[a] = N; else if (l[a]) {
                var L = this.getDOMNode();
                L[a] !== N && (L[a] = N)
            } else if (f[a])d(this._rootDomId, a, N); else if (a === S) {
                var A = t[a], O = N, M = A && A.__html, _ = O && O.__html;
                M !== _ && (this.getDOMNode().innerHTML = (_ || "").replace(/^ /g, "&nbsp;"))
            } else p.test(a) && this.getDOMNode().setAttribute(a, N)
        }
        if (n) {
            var D = r ? v(r) : null;
            this.getDOMNode().className = D ? i ? D + " " + i : D : i
        }
        o && !u && (u = g(e.posInfo)), u && !o && (o = m(e.style));
        if (o || u)s += o, s += u, this.getDOMNode().style.cssText = s
    }}, k = {setAcceleratedPositioner:N, ReactNativeComponentMutationMixin:C};
    n.exports = k
}), define("ReactMultiChild", ["require", "exports", "module", "ReactComponent", "ReactDOMUtils"], function (e, t, n) {
    function o(e, t) {
        return e && t && e.constructor === t.constructor
    }

    function u(e, t) {
        return e && !t || e && t && e.constructor !== t.constructor
    }

    var r = e("ReactComponent"), i = e("ReactDOMUtils"), s = i.insertNodeAt, a = {destroyMultiChild:function () {
        var e = this.renderedChildren, t;
        for (t in e) {
            if (!e.hasOwnProperty(t))continue;
            e[t] && e[t].destroy()
        }
        this.renderedChildren = null
    }, handleGenMarkupMultiChild:function (e) {
        var t, n = "", r = 0;
        for (t in e) {
            var i = e[t];
            i && (i.domIndex = r, n += e[t].handleGenMarkup(this._rootDomId + "." + t), r++)
        }
        return this.renderedChildren = e, n
    }, insertMarkupAt:function (e, t) {
        return e ? i.insertMarkupAt(this.getDOMNode(), e, t) : 0
    }, enqueueMove:function (e, t, n) {
        if (t === n)return e;
        e || (e = {});
        var r = this.getDOMNode();
        return e[n] = r.childNodes[t], e
    }, handleUpdateAllPropsMultiChild:function (e) {
        if (!e && !this.renderedChildren)return;
        e && !this.renderedChildren ? this.renderedChildren = {} : !e && this.renderedChildren && (e = {});
        var t, n = this._rootDomId + ".", r = "", i = 0, a = 0, f = 0, l;
        for (t in e) {
            if (!e.hasOwnProperty(t))continue;
            var c = this.renderedChildren[t], h = e[t];
            if (o(c, h)) {
                f += this.insertMarkupAt(r, a), r = "";
                var p = h.props.isStatic;
                p || c.handleUpdateAllProps(h.props);
                var d = c.domIndex + f;
                l = this.enqueueMove(l, d, i), c.domIndex = i, i++, a = i
            } else c && (this.removeChildByName(t, c), f--), h && (this.renderedChildren[t] = h, r += h.handleGenMarkup(n + t), h.domIndex = i, i++)
        }
        f += this.insertMarkupAt(r, a);
        for (t in this.renderedChildren) {
            if (!this.renderedChildren.hasOwnProperty(t))continue;
            var v = this.renderedChildren[t];
            u(v, e[t]) && this.removeChildByName(t, v)
        }
        if (l) {
            var m, g = this.getDOMNode();
            for (m in l) {
                if (!l.hasOwnProperty(m))continue;
                s(g, l[m], m)
            }
        }
    }, removeChildByName:function (e, t) {
        r.isValidComponent(t) && t.destroyAndDetachFromDom(), delete this.renderedChildren[e]
    }}, f = {ReactMultiChildMixin:a};
    n.exports = f
}), define("ReactTextComponent", ["require", "exports", "module", "ReactBrowserUtils", "ReactDOMAttributes", "ReactComponent", "mixInto"], function (e, t, n) {
    var r = e("ReactBrowserUtils"), i = e("ReactDOMAttributes"), s = e("ReactComponent"), o = r.escapeTextForBrowser, u = e("mixInto"), a = i.CONTENT_ACCESSOR_KEY, f = function (e) {
        this.props = e
    };
    u(f, s.ReactComponentMixin), f.prototype.handleUpdateAllProps = function (e) {
        e !== this.props && (this.getDOMNode()[a] = e, this.props = e)
    }, f.prototype.destroy = function () {
    }, f.prototype.handleGenMarkup = function (e) {
        return this._rootDomId = e, '<span id="' + e + '">' + o(this.props) + "</span>"
    }, n.exports = f
}), define("flattenChildren", ["require", "exports", "module", "ReactTextComponent"], function (e, t, n) {
    function s(e) {
        if (e === null || e === undefined)return e;
        var t = {};
        return i(t, e, ""), t
    }

    var r = e("ReactTextComponent"), i = function (e, t, n) {
        var s, o;
        if (Array.isArray(t))for (s = 0; s < t.length; s++)i(e, t[s], n + "[" + s + "]"); else if (!t && t !== 0)e[n] = null; else if (t.genMarkupIntoContainer)e[n] = t; else {
            var u = typeof t;
            if (u === "string" || u === "number")e[n] = new r(t); else if (u === "object")for (o in t)t.hasOwnProperty(o) && i(e, t[o], n + "{" + o + "}")
        }
    };
    n.exports = s
}), define("ReactDOM", ["require", "exports", "module", "ReactComponent", "ReactDOMGeneration", "ReactDOMMutation", "ReactErrors", "ReactEvent", "ReactMultiChild", "flattenChildren", "mixInto", "objMapKeyVal", "throwIf"], function (e, t, n) {
    function v(e, t) {
        var n = "<" + e + " ", i = t ? "" : "</" + e + ">", s = function (e) {
            this.props = e, this.captureOwnerAtConstruction()
        }, p = {handleUpdateAllProps:function (e) {
            o.throwIf(!this._rootDomId, o.CONTROL_WITHOUT_BACKING_DOM), this.handleUpdateAllPropsComponent(e), this.handleUpdateAllPropsDOMMutation(e), this.handleUpdateAllPropsMultiChild(c(e.children)), this.props = e
        }, handleGenMarkup:function (e) {
            this.initializeComponent(e);
            var t = n + this.handleGenMarkupDOMGeneration() + this.handleGenMarkupMultiChild(c(this.props.children)) + i;
            return t
        }, destroy:function () {
            this.destroyComponent(), this.destroyMultiChild(), u.clearAllRegistrations(this._rootDomId)
        }};
        h(s, r.ReactComponentMixin), h(s, p), h(s, f), h(s, l), h(s, a.ReactMultiChildMixin), s.prototype.tagName = e.toUpperCase();
        var d = function (e) {
            return new s(e)
        };
        return d
    }

    var r = e("ReactComponent"), i = e("ReactDOMGeneration"), s = e("ReactDOMMutation"), o = e("ReactErrors"), u = e("ReactEvent"), a = e("ReactMultiChild"), f = i.ReactNativeComponentGenerationMixin, l = s.ReactNativeComponentMutationMixin, c = e("flattenChildren"), h = e("mixInto"), p = e("objMapKeyVal"), d = e("throwIf"), m = p({a:!1, abbr:!1, address:!1, audio:!1, b:!1, br:!0, button:!1, code:!1, col:!0, colgroup:!1, dd:!1, div:!1, section:!1, dl:!1, dt:!1, em:!1, embed:!0, fieldset:!1, form:!1, g:!1, h1:!1, h2:!1, h3:!1, h4:!1, h5:!1, h6:!1, hr:!0, i:!1, iframe:!1, img:!0, input:!1, label:!1, legend:!1, li:!1, line:!1, object:!1, ol:!1, optgroup:!1, option:!1, p:!1, param:!0, pre:!1, select:!1, small:!1, span:!1, strong:!1, svg:!1, table:!1, tbody:!1, td:!1, textarea:!1, tfoot:!1, th:!1, thead:!1, time:!1, title:!1, tr:!1, ul:!1, video:!1, wbr:!1}, v);
    n.exports = m
}), define("ReactBackbone", ["require", "exports", "module", "React", "ReactDOMTransaction", "backbone"], function (e, t, n) {
    function o(e, t) {
        var n = 0;
        t || (t = {});
        for (var r in e.props) {
            if (!e.props.hasOwnProperty(r))continue;
            var o = e.props[r];
            if (!o instanceof s.Model)continue;
            o.on("change", function () {
                i.perform(function () {
                    e.handleReconcile()
                })
            }), t["_backboneModel" + n] = o, n++
        }
        return t
    }

    function u(e) {
        for (var t in e.props) {
            if (!e.props.hasOwnProperty(t))continue;
            var n = e.props[t];
            if (!n instanceof s.Model)continue;
            n.off(null, null, e)
        }
    }

    var r = e("React"), i = e("ReactDOMTransaction"), s = e("backbone");
    t.createComponent = function (e) {
        return e.getInitialState ? (e._backboneGetInitialState = e.getInitialState, e.getInitialState = function () {
            return o(this, this._backboneGetInitialState())
        }) : e.getInitialState = function () {
            return o(this)
        }, e.destroy ? (e._backboneDestroy = e.destroy, e.destroy = function () {
            this._backboneDestroy(), u(this)
        }) : e.destroy = function () {
            u(this)
        }, r.createComponent(e)
    }
}), define("sprintf-0.7", ["require", "exports", "module"], function (e, t, n) {
    var r = function () {
        function e(e) {
            return Object.prototype.toString.call(e).slice(8, -1).toLowerCase()
        }

        function t(e, t) {
            for (var n = []; t > 0; n[--t] = e);
            return n.join("")
        }

        var n = function () {
            return n.cache.hasOwnProperty(arguments[0]) || (n.cache[arguments[0]] = n.parse(arguments[0])), n.format.call(null, n.cache[arguments[0]], arguments)
        };
        return n.format = function (n, i) {
            var s = 1, o = n.length, u = "", a, f = [], l, c, h, p, d, v;
            for (l = 0; l < o; l++) {
                u = e(n[l]);
                if (u === "string")f.push(n[l]); else if (u === "array") {
                    h = n[l];
                    if (h[2]) {
                        a = i[s];
                        for (c = 0; c < h[2].length; c++) {
                            if (!a.hasOwnProperty(h[2][c]))throw r('[sprintf] property "%s" does not exist', h[2][c]);
                            a = a[h[2][c]]
                        }
                    } else h[1] ? a = i[h[1]] : a = i[s++];
                    if (/[^s]/.test(h[8]) && e(a) != "number")throw r("[sprintf] expecting number but found %s", e(a));
                    switch (h[8]) {
                        case"b":
                            a = a.toString(2);
                            break;
                        case"c":
                            a = String.fromCharCode(a);
                            break;
                        case"d":
                            a = parseInt(a, 10);
                            break;
                        case"e":
                            a = h[7] ? a.toExponential(h[7]) : a.toExponential();
                            break;
                        case"f":
                            a = h[7] ? parseFloat(a).toFixed(h[7]) : parseFloat(a);
                            break;
                        case"o":
                            a = a.toString(8);
                            break;
                        case"s":
                            a = (a = String(a)) && h[7] ? a.substring(0, h[7]) : a;
                            break;
                        case"u":
                            a = Math.abs(a);
                            break;
                        case"x":
                            a = a.toString(16);
                            break;
                        case"X":
                            a = a.toString(16).toUpperCase()
                    }
                    a = /[def]/.test(h[8]) && h[3] && a >= 0 ? "+" + a : a, d = h[4] ? h[4] == "0" ? "0" : h[4].charAt(1) : " ", v = h[6] - String(a).length, p = h[6] ? t(d, v) : "", f.push(h[5] ? a + p : p + a)
                }
            }
            return f.join("")
        }, n.cache = {}, n.parse = function (e) {
            var t = e, n = [], r = [], i = 0;
            while (t) {
                if ((n = /^[^\x25]+/.exec(t)) !== null)r.push(n[0]); else if ((n = /^\x25{2}/.exec(t)) !== null)r.push("%"); else {
                    if ((n = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(t)) === null)throw"[sprintf] huh?";
                    if (n[2]) {
                        i |= 1;
                        var s = [], o = n[2], u = [];
                        if ((u = /^([a-z_][a-z_\d]*)/i.exec(o)) === null)throw"[sprintf] huh?";
                        s.push(u[1]);
                        while ((o = o.substring(u[0].length)) !== "")if ((u = /^\.([a-z_][a-z_\d]*)/i.exec(o)) !== null)s.push(u[1]); else {
                            if ((u = /^\[(\d+)\]/.exec(o)) === null)throw"[sprintf] huh?";
                            s.push(u[1])
                        }
                        n[2] = s
                    } else i |= 2;
                    if (i === 3)throw"[sprintf] mixing positional and named placeholders is not (yet) supported";
                    r.push(n)
                }
                t = t.substring(n[0].length)
            }
            return r
        }, n
    }(), i = function (e, t) {
        return t.unshift(e), r.apply(null, t)
    };
    t.sprintf = r, t.vsprintf = i
}), define("i18n", ["require", "exports", "module", "sprintf-0.7"], function (e, t, n) {
    var r = e("sprintf-0.7").sprintf;
    t.i18n = function (e, t) {
        var n = window._strings[e];
        return n || (n = e, console.log("WARNING: untranslated string", e)), t && (n = r(n, t)), n
    }
}), define("tx", ["require", "exports", "module", "ReactDOM", "i18n", "React"], function (e, t, n) {
    var r = e("ReactDOM"), i = e("i18n").i18n, s = e("React"), o = /\%\((.+?)\)s/, u = s.createComponent({render:function () {
        var e = "", t = {}, n = this.props.children;
        n.length === 1 && n[0]instanceof Array && (n = n[0]), $(n).each(function (n, r) {
            r.props && r.props.name ? (e += "%(" + r.props.name + ")s", t[r.props.name] = r.props.children) : e += r
        });
        var s = i(e), u = [];
        return $(s.split(o)).each(function (e, n) {
            e % 2 === 1 ? u.push(t[n]) : u.push(n)
        }), r.span({children:u})
    }});
    t.tx = u;
    var a = s.createComponent({render:function () {
        return r.span({})
    }});
    t.txp = a, t.multiNameList = s.createComponent({render:function () {
        var e = this.props.names, t = this.props.numToShow, n = [], s = {};
        e.indexOf(this.props.viewerName) > -1 && (e.splice(e.indexOf(this.props.viewerName), 1), e.splice(0, 0, this.props.viewerName));
        for (var o = 0; o < Math.min(t, e.length); o++) {
            var f = e[o], l = "name" + o;
            o > 0 && (o === e.length - 1 ? n.push(" and ") : n.push(", ")), f === this.props.viewerName && (e.length === 1 && (l = "you"), f = i("You")), n.push(a({name:l, children:[r.a({href:"/" + f, target:"_blank", className:"txNameLink", children:f})]}))
        }
        var c = (this.props.fullCount || e.length) - t;
        return c === 1 ? n.push(" and one other person") : c > 0 && (n.push(" and "), n.push(a({name:"others", children:[r.span({className:"txRemainingCount", children:c})]})), n.push(" others")), e.length > 1 ? n.push(" like this.") : n.push(" likes this."), u({children:[n]})
    }})
}), define("class_component", ["require", "exports", "module", "React", "underscore"], function (e, t, n) {
    var r = e("React"), i = e("underscore");
    t.createComponent = function (e) {
        return e._render = e.render, e.render = function () {
            var e = this._render();
            return this.props.classSet && (e.props.classSet ? i.extend(e.props.classSet, this.props.classSet) : e.props.classSet = this.props.classSet), e
        }, r.createComponent(e)
    }
}), define("linkify", ["require", "exports", "module", "ReactDOM", "React", "class_component"], function (e, t, n) {
    function l(e, t) {
        var n = [], r = e.split(u), i = t.text;
        for (var s = 0; s + 1 < r.length; s += 2) {
            var o = r[s + 1], a = t[o.charAt(0)];
            n.push(i && i(r[s]) || r[s], a && a(o.slice(1)) || o)
        }
        return n.push(i && i(r[s]) || r[s]), n
    }

    var r = e("ReactDOM"), i = e("React"), s = e("class_component"), o = /@([a-z0-9\_]+)/gi, u = /((?:@|#)[a-z0-9\_]+)/gi, a = {text:function (e) {
        return document.createTextNode(e)
    }, "@":function (e) {
        return createAnchor("/" + e, "@" + e)
    }, "#":function (e) {
    }}, f = {text:function (e) {
        return e
    }, "@":function (e) {
        return r.a({href:"/" + e, children:"@" + e})
    }, "#":function (e) {
    }};
    t.linkifyAsMarkup = function (e) {
        return l(e, a)
    }, t.LinkifiedText = s.createComponent({render:function () {
        var e = this.props.children[0];
        return r.span({classSet:this.props.classSet, children:l(e, f)})
    }})
}), function (e) {
    e.fn.autogrow = function (t) {
        return t = t || {}, this.filter("textarea").each(function () {
            function a() {
                a.pending = !1, u.text(n.value);
                var e = Math.max(u.height() + 14, i);
                e != o && (r.css("height", o = e), t.onHeightChange && t.onHeightChange.call(n, e))
            }

            var n = this, r = e(n), i = 30, s = r.css("lineHeight"), o = r.height(), u = e("<div></div>").css({position:"absolute", top:-1e4, left:-1e4, width:r.width(), fontSize:r.css("fontSize"), fontFamily:r.css("fontFamily"), lineHeight:r.css("lineHeight"), resize:"none"}).appendTo(document.body);
            r.change(a).keydown(function () {
                a.pending || (a.pending = !0, setTimeout(a, 10))
            }), a.call(n)
        }), this
    }
}(jQuery), define("autogrow", function () {
}), define("media_common", ["require", "exports", "module", "i18n", "linkify", "user", "autogrow"], function (e, t, n) {
    function c() {
        var e = $.trim($("#comment_text").val());
        if (e === "" || e === a)return;
        p(h(e)), $("#comment_text").val(""), $("#comment_text").blur(), $("#comment_text").css("height", 31)
    }

    function h(e) {
        f++;
        var n = e.length < 31 ? " time-br" : "", s = $(document.createElement("li"));
        s.addClass("comment" + n), s.append('<span class="like-avatar img-inset" style="background-image:url(' + u + ');">' + '<img src="' + u + '" alt="' + o + '" />' + "<b></b>" + "</span>" + "<p>" + '<strong class="username">' + o + "</strong> " + '<span class="comment-text"></span> ' + '<span class="comment-meta"><time>' + r("Now") + "</time></span>" + '<span class="comment-info">' + "</span>" + "</p>"), s.find(".comment-text").append(i.linkifyAsMarkup(e));
        var a = $("#comment_list");
        return a.append(s), t.setUpCommentList(), g(), s
    }

    function p(e) {
        $.ajax({type:"POST", dataType:"json", url:"/web/comments/" + l + "/add/", context:e, data:{comment_text:e.find(".comment-text").text(), csrfmiddlewaretoken:window.csrf_token}, success:function (e) {
            $(this).attr("data-id", e.id);
            var t = '<a class="delete-comment" href="#"></a>';
            $(this).find(".comment-info").append(t)
        }, error:function (e) {
            $(this).addClass("failed");
            var t = e.responseText;
            t === "" && (t = r("Couldn't post comment"));
            var n = '<span class="failure-message">' + t + " " + "<br/>" + '<a class="retry-post-comment" href="javascript:;" onclick="retryComment($(this).parents(\'.comment\'));">' + r("Retry") + "</a> &bull; " + '<a class="cancel-post-comment" href="javascript:;" onclick="cancelComment($(this).parents(\'.comment\'));">' + r("Cancel") + "</a>" + "</span>";
            $(this).find(".comment-info").append(n), g()
        }})
    }

    function d(e) {
        var t = e.find(".comment-text").text();
        e.remove(), f--, p(h(t))
    }

    function v(e) {
        e.fadeOut(function () {
            e.remove(), f--
        })
    }

    function m() {
        var e = $(".media-likes").outerHeight(), t = $(".caption").outerHeight();
        $("#comment_list").css("max-height", $(".media-info").height() - e - t - 45 + "px");
        var n = $(".media-comments").outerHeight(), r = e + n > 580;
        $(".media-info").toggleClass("mount-addcomment", r), $(".comment-count").text(T(f)), $(".media-info").toggleClass("no-comments", f < 1)
    }

    function g() {
        var e = $("#comment_list");
        e.size() > 0 && e.scrollTop(e[0].scrollHeight - e.height())
    }

    function y(e, t) {
        var n = document, r = n.createElement("a");
        return r.setAttribute("href", e), r.appendChild(n.createTextNode(t)), r
    }

    function b(e) {
        var t = e.toString(), n = [];
        if (t.length <= 3)return t;
        for (var r = t.length; r >= 1; r -= 3)n.push(t.substring(r - 3, r));
        return n.reverse().join(",")
    }

    function S(e, t) {
        var n = e, r = "";
        if (e >= t) {
            var i = Math.floor(Math.log(e) / E);
            n = e / Math.pow(1e3, i), r = w[i]
        }
        return{base:n, prefix:r}
    }

    function x(e, t) {
        var n = Math.pow(10, t), r = Math.round(e * n) / n, i = r.toString(10).split("."), s = b(i[0]);
        if (i.length > 1) {
            var o = i[1].slice(0, t);
            o && (s += "." + o)
        }
        return s
    }

    function T(e, t, n) {
        if (!e)return"0";
        var r = S(e, t || 1e4), i = 0, s = x(r.base, i);
        n = Math.min(n || 4, 10);
        while (++i < 10) {
            var o = x(r.base, i);
            if (o.length > n)break;
            s = o
        }
        return s + r.prefix
    }

    var r = e("i18n").i18n, i = e("linkify"), s = e("user");
    e("autogrow");
    var o, u, a, f, l;
    t.get_param = function (e) {
        return decodeURI((RegExp(e + "=" + "(.+?)(&|$)").exec(location.search) || [, null])[1])
    }, t.scrollCommentsToBottom = g, t.setUpCommentList = m, t.comment = c, t.formatNumber = b;
    var w = ["", "k", "m", "b", "t", "q"], E = Math.log(1e3);
    t.abbrCount = T, t.clearSelection = function () {
        document.selection ? document.selection.empty() : window.getSelection && window.getSelection().removeAllRanges()
    }, t.init = function (e, t, n, r, i) {
        o = e, u = t, a = n, f = r, l = i
    }
}), $("head").append("<style>\n@-webkit-keyframes 'spin8' {\n  0% {\n    -webkit-transform: rotate(180deg);\n    -moz-transform: rotate(180deg);\n    -o-transform: rotate(180deg);\n    transform: rotate(180deg); }\n\n  12.499% {\n    -webkit-transform: rotate(180deg);\n    -moz-transform: rotate(180deg);\n    -o-transform: rotate(180deg);\n    transform: rotate(180deg); }\n\n  12.5% {\n    -webkit-transform: rotate(225deg);\n    -moz-transform: rotate(225deg);\n    -o-transform: rotate(225deg);\n    transform: rotate(225deg); }\n\n  24.999% {\n    -webkit-transform: rotate(225deg);\n    -moz-transform: rotate(225deg);\n    -o-transform: rotate(225deg);\n    transform: rotate(225deg); }\n\n  25% {\n    -webkit-transform: rotate(270deg);\n    -moz-transform: rotate(270deg);\n    -o-transform: rotate(270deg);\n    transform: rotate(270deg); }\n\n  37.499% {\n    -webkit-transform: rotate(270deg);\n    -moz-transform: rotate(270deg);\n    -o-transform: rotate(270deg);\n    transform: rotate(270deg); }\n\n  37.5% {\n    -webkit-transform: rotate(315deg);\n    -moz-transform: rotate(315deg);\n    -o-transform: rotate(315deg);\n    transform: rotate(315deg); }\n\n  49.999% {\n    -webkit-transform: rotate(315deg);\n    -moz-transform: rotate(315deg);\n    -o-transform: rotate(315deg);\n    transform: rotate(315deg); }\n\n  50% {\n    -webkit-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg); }\n\n  62.499% {\n    -webkit-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg); }\n\n  62.5% {\n    -webkit-transform: rotate(405deg);\n    -moz-transform: rotate(405deg);\n    -o-transform: rotate(405deg);\n    transform: rotate(405deg); }\n\n  74.999% {\n    -webkit-transform: rotate(405deg);\n    -moz-transform: rotate(405deg);\n    -o-transform: rotate(405deg);\n    transform: rotate(405deg); }\n\n  75% {\n    -webkit-transform: rotate(450deg);\n    -moz-transform: rotate(450deg);\n    -o-transform: rotate(450deg);\n    transform: rotate(450deg); }\n\n  87.499% {\n    -webkit-transform: rotate(450deg);\n    -moz-transform: rotate(450deg);\n    -o-transform: rotate(450deg);\n    transform: rotate(450deg); }\n\n  87.5% {\n    -webkit-transform: rotate(495deg);\n    -moz-transform: rotate(495deg);\n    -o-transform: rotate(495deg);\n    transform: rotate(495deg); }\n\n  99.999% {\n    -webkit-transform: rotate(495deg);\n    -moz-transform: rotate(495deg);\n    -o-transform: rotate(495deg);\n    transform: rotate(495deg); }\n\n  100% {\n    -webkit-transform: rotate(100deg);\n    -moz-transform: rotate(100deg);\n    -o-transform: rotate(100deg);\n    transform: rotate(100deg); } }\n\n@-moz-keyframes spin8 {\n  0% {\n    -webkit-transform: rotate(180deg);\n    -moz-transform: rotate(180deg);\n    -o-transform: rotate(180deg);\n    transform: rotate(180deg); }\n\n  12.499% {\n    -webkit-transform: rotate(180deg);\n    -moz-transform: rotate(180deg);\n    -o-transform: rotate(180deg);\n    transform: rotate(180deg); }\n\n  12.5% {\n    -webkit-transform: rotate(225deg);\n    -moz-transform: rotate(225deg);\n    -o-transform: rotate(225deg);\n    transform: rotate(225deg); }\n\n  24.999% {\n    -webkit-transform: rotate(225deg);\n    -moz-transform: rotate(225deg);\n    -o-transform: rotate(225deg);\n    transform: rotate(225deg); }\n\n  25% {\n    -webkit-transform: rotate(270deg);\n    -moz-transform: rotate(270deg);\n    -o-transform: rotate(270deg);\n    transform: rotate(270deg); }\n\n  37.499% {\n    -webkit-transform: rotate(270deg);\n    -moz-transform: rotate(270deg);\n    -o-transform: rotate(270deg);\n    transform: rotate(270deg); }\n\n  37.5% {\n    -webkit-transform: rotate(315deg);\n    -moz-transform: rotate(315deg);\n    -o-transform: rotate(315deg);\n    transform: rotate(315deg); }\n\n  49.999% {\n    -webkit-transform: rotate(315deg);\n    -moz-transform: rotate(315deg);\n    -o-transform: rotate(315deg);\n    transform: rotate(315deg); }\n\n  50% {\n    -webkit-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg); }\n\n  62.499% {\n    -webkit-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg); }\n\n  62.5% {\n    -webkit-transform: rotate(405deg);\n    -moz-transform: rotate(405deg);\n    -o-transform: rotate(405deg);\n    transform: rotate(405deg); }\n\n  74.999% {\n    -webkit-transform: rotate(405deg);\n    -moz-transform: rotate(405deg);\n    -o-transform: rotate(405deg);\n    transform: rotate(405deg); }\n\n  75% {\n    -webkit-transform: rotate(450deg);\n    -moz-transform: rotate(450deg);\n    -o-transform: rotate(450deg);\n    transform: rotate(450deg); }\n\n  87.499% {\n    -webkit-transform: rotate(450deg);\n    -moz-transform: rotate(450deg);\n    -o-transform: rotate(450deg);\n    transform: rotate(450deg); }\n\n  87.5% {\n    -webkit-transform: rotate(495deg);\n    -moz-transform: rotate(495deg);\n    -o-transform: rotate(495deg);\n    transform: rotate(495deg); }\n\n  99.999% {\n    -webkit-transform: rotate(495deg);\n    -moz-transform: rotate(495deg);\n    -o-transform: rotate(495deg);\n    transform: rotate(495deg); }\n\n  100% {\n    -webkit-transform: rotate(100deg);\n    -moz-transform: rotate(100deg);\n    -o-transform: rotate(100deg);\n    transform: rotate(100deg); } }\n\n@-o-keyframes spin8 {\n  0% {\n    -webkit-transform: rotate(180deg);\n    -moz-transform: rotate(180deg);\n    -o-transform: rotate(180deg);\n    transform: rotate(180deg); }\n\n  12.499% {\n    -webkit-transform: rotate(180deg);\n    -moz-transform: rotate(180deg);\n    -o-transform: rotate(180deg);\n    transform: rotate(180deg); }\n\n  12.5% {\n    -webkit-transform: rotate(225deg);\n    -moz-transform: rotate(225deg);\n    -o-transform: rotate(225deg);\n    transform: rotate(225deg); }\n\n  24.999% {\n    -webkit-transform: rotate(225deg);\n    -moz-transform: rotate(225deg);\n    -o-transform: rotate(225deg);\n    transform: rotate(225deg); }\n\n  25% {\n    -webkit-transform: rotate(270deg);\n    -moz-transform: rotate(270deg);\n    -o-transform: rotate(270deg);\n    transform: rotate(270deg); }\n\n  37.499% {\n    -webkit-transform: rotate(270deg);\n    -moz-transform: rotate(270deg);\n    -o-transform: rotate(270deg);\n    transform: rotate(270deg); }\n\n  37.5% {\n    -webkit-transform: rotate(315deg);\n    -moz-transform: rotate(315deg);\n    -o-transform: rotate(315deg);\n    transform: rotate(315deg); }\n\n  49.999% {\n    -webkit-transform: rotate(315deg);\n    -moz-transform: rotate(315deg);\n    -o-transform: rotate(315deg);\n    transform: rotate(315deg); }\n\n  50% {\n    -webkit-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg); }\n\n  62.499% {\n    -webkit-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg); }\n\n  62.5% {\n    -webkit-transform: rotate(405deg);\n    -moz-transform: rotate(405deg);\n    -o-transform: rotate(405deg);\n    transform: rotate(405deg); }\n\n  74.999% {\n    -webkit-transform: rotate(405deg);\n    -moz-transform: rotate(405deg);\n    -o-transform: rotate(405deg);\n    transform: rotate(405deg); }\n\n  75% {\n    -webkit-transform: rotate(450deg);\n    -moz-transform: rotate(450deg);\n    -o-transform: rotate(450deg);\n    transform: rotate(450deg); }\n\n  87.499% {\n    -webkit-transform: rotate(450deg);\n    -moz-transform: rotate(450deg);\n    -o-transform: rotate(450deg);\n    transform: rotate(450deg); }\n\n  87.5% {\n    -webkit-transform: rotate(495deg);\n    -moz-transform: rotate(495deg);\n    -o-transform: rotate(495deg);\n    transform: rotate(495deg); }\n\n  99.999% {\n    -webkit-transform: rotate(495deg);\n    -moz-transform: rotate(495deg);\n    -o-transform: rotate(495deg);\n    transform: rotate(495deg); }\n\n  100% {\n    -webkit-transform: rotate(100deg);\n    -moz-transform: rotate(100deg);\n    -o-transform: rotate(100deg);\n    transform: rotate(100deg); } }\n\n@keyframes 'spin8' {\n  0% {\n    -webkit-transform: rotate(180deg);\n    -moz-transform: rotate(180deg);\n    -o-transform: rotate(180deg);\n    transform: rotate(180deg); }\n\n  12.499% {\n    -webkit-transform: rotate(180deg);\n    -moz-transform: rotate(180deg);\n    -o-transform: rotate(180deg);\n    transform: rotate(180deg); }\n\n  12.5% {\n    -webkit-transform: rotate(225deg);\n    -moz-transform: rotate(225deg);\n    -o-transform: rotate(225deg);\n    transform: rotate(225deg); }\n\n  24.999% {\n    -webkit-transform: rotate(225deg);\n    -moz-transform: rotate(225deg);\n    -o-transform: rotate(225deg);\n    transform: rotate(225deg); }\n\n  25% {\n    -webkit-transform: rotate(270deg);\n    -moz-transform: rotate(270deg);\n    -o-transform: rotate(270deg);\n    transform: rotate(270deg); }\n\n  37.499% {\n    -webkit-transform: rotate(270deg);\n    -moz-transform: rotate(270deg);\n    -o-transform: rotate(270deg);\n    transform: rotate(270deg); }\n\n  37.5% {\n    -webkit-transform: rotate(315deg);\n    -moz-transform: rotate(315deg);\n    -o-transform: rotate(315deg);\n    transform: rotate(315deg); }\n\n  49.999% {\n    -webkit-transform: rotate(315deg);\n    -moz-transform: rotate(315deg);\n    -o-transform: rotate(315deg);\n    transform: rotate(315deg); }\n\n  50% {\n    -webkit-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg); }\n\n  62.499% {\n    -webkit-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg); }\n\n  62.5% {\n    -webkit-transform: rotate(405deg);\n    -moz-transform: rotate(405deg);\n    -o-transform: rotate(405deg);\n    transform: rotate(405deg); }\n\n  74.999% {\n    -webkit-transform: rotate(405deg);\n    -moz-transform: rotate(405deg);\n    -o-transform: rotate(405deg);\n    transform: rotate(405deg); }\n\n  75% {\n    -webkit-transform: rotate(450deg);\n    -moz-transform: rotate(450deg);\n    -o-transform: rotate(450deg);\n    transform: rotate(450deg); }\n\n  87.499% {\n    -webkit-transform: rotate(450deg);\n    -moz-transform: rotate(450deg);\n    -o-transform: rotate(450deg);\n    transform: rotate(450deg); }\n\n  87.5% {\n    -webkit-transform: rotate(495deg);\n    -moz-transform: rotate(495deg);\n    -o-transform: rotate(495deg);\n    transform: rotate(495deg); }\n\n  99.999% {\n    -webkit-transform: rotate(495deg);\n    -moz-transform: rotate(495deg);\n    -o-transform: rotate(495deg);\n    transform: rotate(495deg); }\n\n  100% {\n    -webkit-transform: rotate(100deg);\n    -moz-transform: rotate(100deg);\n    -o-transform: rotate(100deg);\n    transform: rotate(100deg); } }\n\n.spinnerDiv {\n  -webkit-animation: spin8 0.8s linear infinite;\n  -moz-animation: spin8 0.8s linear infinite;\n  -o-animation: spin8 0.8s linear infinite;\n  animation: spin8 0.8s linear infinite; }\n\n.spinner {\n  height: 18px;\n  left: 50%;\n  margin-left: -9px;\n  margin-top: -9px;\n  position: absolute;\n  top: 50%;\n  width: 18px; }\n\n</style>"), define("spinner_css", function () {
}), define("spinner", ["require", "exports", "module", "ReactDOM", "React", "spinner_css"], function (e, t, n) {
    var r = e("ReactDOM"), i = e("React");
    e("spinner_css"), t.Spinner = i.createComponent({render:function () {
        return r.div({className:"spinner spinnerDiv", children:r.svg({className:"spinner", children:r.g({transform:"translate(9,9)", children:r.g({"stroke-width":"2", "stroke-linecap":"round", stroke:"#666", children:[r.line({x1:"0", y1:"4", x2:"0", y2:"7", transform:"rotate(0, 0, 0)", opacity:"0"}), r.line({x1:"0", y1:"4", x2:"0", y2:"7", transform:"rotate(45, 0, 0)", opacity:"0.12244897959183675"}), r.line({x1:"0", y1:"4", x2:"0", y2:"7", transform:"rotate(90, 0, 0)", opacity:"0.2448979591836735"}), r.line({x1:"0", y1:"4", x2:"0", y2:"7", transform:"rotate(135, 0, 0)", opacity:"0.3673469387755102"}), r.line({x1:"0", y1:"4", x2:"0", y2:"7", transform:"rotate(180, 0, 0)", opacity:"0.489795918367347"}), r.line({x1:"0", y1:"4", x2:"0", y2:"7", transform:"rotate(225, 0, 0)", opacity:"0.6122448979591838"}), r.line({x1:"0", y1:"4", x2:"0", y2:"7", transform:"rotate(270, 0, 0)", opacity:"0.7346938775510204"}), r.line({x1:"0", y1:"4", x2:"0", y2:"7", transform:"rotate(315, 0, 0)", opacity:"0.8571428571428571"})]})})})})
    }})
}), define("fancy_image", ["require", "exports", "module", "ReactDOM", "React"], function (e, t, n) {
    var r = e("ReactDOM"), i = e("React");
    t.FancyImage = i.createComponent({render:function () {
        var e = this.props.imgStyle ? "img-" + this.props.imgStyle : "", t = r.span({className:"img " + e + " " + this.props.extraClasses, style:{backgroundImage:"url(" + this.props.imgURL + ");"}, children:[r.img({src:this.props.imgURL, onerror:"imageFallback(this);"}), r.b({})]});
        return this.props.linkToUrl ? r.a({href:this.props.linkToUrl, children:t}) : t
    }})
}), define("userprofile_components", ["require", "exports", "module", "ReactDOM", "React", "backbone", "ReactBackbone", "underscore", "i18n", "tx", "media_common", "spinner", "fancy_image"], function (e, t, n) {
    var r = e("ReactDOM"), i = e("React"), s = e("backbone"), o = e("ReactBackbone"), u = e("underscore"), a = e("i18n").i18n, f = e("tx"), l = f.tx, c = f.txp, h = e("media_common").formatNumber, p = e("spinner").Spinner, d = e("fancy_image").FancyImage, v = o.createComponent({getInitialState:function () {
        return{followLoading:!1}
    }, doFollow:function (e) {
        this.performFriendshipRequest("follow")
    }, doUnfollow:function (e) {
        this.performFriendshipRequest("unfollow")
    }, doLogin:function (e) {
        window.location.href = "/accounts/login/?next=" + window.location.href
    }, performFriendshipRequest:function (e) {
        var e = e == "follow" ? "follow" : "unfollow";
        this.updateState({followLoading:!0}), $.ajax({type:"POST", url:"/web/friendships/" + this.props.profileUser.get("id") + "/" + e + "/?ref=profile", complete:u.bind(function () {
            this.updateState({followLoading:!1})
        }, this), success:function (t) {
            var n = this.props.relationship.get("is_private"), r = this.props.relationship.get("following"), i = this.props.relationship.get("outgoing_request");
            e == "unfollow" ? (r = !1, i = !1) : n ? (r = !1, i = !0) : (r = !0, i = !1), this.props.relationship.set({following:r, outgoing_request:i});
            var s = r ? 1 : -1, o = this.props.profileUser.get("counts"), u = {followed_by:o.followed_by + s, media:o.media, follows:o.follows};
            this.props.profileUser.set("counts", u)
        }.bind(this)})
    }, render:function () {
        var e;
        this.props.relationship.get("anonymous") ? e = r.span({onClick:this.doLogin.bind(this), className:"button user-following following-false", children:l({children:["Follow"]})}) : this.props.relationship.get("following") ? e = r.span({onClick:this.doUnfollow.bind(this), className:"button user-following following-true", children:l({children:["Following"]})}) : this.props.relationship.get("outgoing_request") ? e = r.span({className:"button user-following requested", onClick:this.doUnfollow.bind(this), children:l({children:["Requested"]})}) : e = r.span({onClick:this.doFollow.bind(this), className:"button user-following following-false", children:l({children:["Follow"]})});
        var t = {display:this.state.followLoading ? "block" : "none"};
        return r.span({children:[r.span({className:"follow-indicator", style:t, children:p({})}), r.span({className:"avatar-action", children:e})]})
    }}), m = i.createComponent({doEditProfile:function () {
        document.location = "/accounts/edit/"
    }, render:function () {
        var e = this.props.profileUser.toJSON(), t;
        return this.props.profileUser.isLoggedInUser() ? t = r.span({className:"avatar-action", children:r.a({className:"button edit-profile-button", href:"javascript:;", onClick:this.doEditProfile.bind(this), children:l({children:["Edit Profile"]})})}) : t = v({relationship:this.props.relationship, profileUser:this.props.profileUser}), r.span({className:"avatar-container", children:[r.span({className:"img img-inset user-avatar", children:d({imgURL:e.profile_picture, imgStyle:"inset", extraClasses:"user-avatar"})}), t]})
    }}), g = i.createComponent({render:function () {
        var e = this.props.profileUser.toJSON();
        return r.p({className:"user-bio", children:[r.strong({children:[e.full_name, " "]}), " ", e.bio, " ", r.a({rel:"nofollow me", href:e.website, target:"_blank", children:e.website})]})
    }}), y = o.createComponent({render:function () {
        var e = this.props.profileUser.toJSON();
        return r.ul({className:"user-stats", children:[r.li({children:l({children:[c({name:"count", children:[r.span({className:"number-stat", children:h(e.counts.media)})]}), " ", "photos"]})}), r.li({children:l({children:[c({name:"count", children:[r.span({className:"number-stat", children:h(e.counts.followed_by)})]}), " ", "followers"]})}), r.li({children:l({children:[c({name:"count", children:[r.span({className:"number-stat", children:h(e.counts.follows)})]}), " ", "following"]})})]})
    }});
    t.ProfileUserView = i.createComponent({getInitialState:function () {
        return{dropdownOpen:!1}
    }, doOpenDropdown:function () {
        this.updateState({dropdownOpen:!this.state.dropdownOpen})
    }, render:function () {
        $("title").html(a("%(user)s on Instagram", {user:this.props.profileUser.escape("username")}));
        var e = {"profile-options":!0, "has-dropdown":!0, "dropdown-open":this.state.dropdownOpen}, t = {"link-active":this.state.dropdownOpen}, n = this.props.user, i = !n || n && this.props.profileUser.get("id") !== n.get("id"), s, o = null;
        return i ? (s = r.a({href:"javascript:;", onClick:this.doOpenDropdown.bind(this), children:[this.props.profileUser.get("username"), r.b({})]}), o = r.div({className:"dropdown", children:[r.i({}), r.ul({children:r.li({className:"negative", children:r.a({href:"https://www.facebook.com/help/contact/?id=160831917393262", children:"Report User"})})})]})) : s = this.props.profileUser.get("username"), r.div({children:[r.div({classSet:e, children:[r.h1({children:s}), o]}), m({profileUser:this.props.profileUser, relationship:this.props.relationship}), g({profileUser:this.props.profileUser}), y({profileUser:this.props.profileUser})]})
    }}), t.PrivateProfileHeader = i.createComponent({render:function () {
        return r.div({className:"photo-grid-status status-private", children:r.p({children:[r.strong({children:l({children:["This user is private"]})}), r.span({className:"photo-grid-status-message", children:l({children:["You need to be following", " ", c({name:"username", children:[this.props.profileUser.get("username")]}), " ", "to like or comment"]})})]})})
    }})
}), $("head").append("<style>\n.imgLoading .imgImg {\n  opacity: 0; }\n\n.imgLoaded .imgImg {\n  opacity: 1; }\n\n.imgLoaded.imgWithTransition .imgImg {\n  -webkit-transition: opacity 2s;\n  -moz-transition: opacity 2s;\n  -o-transition: opacity 2s;\n  transition: opacity 2s; }\n\n.imgImg {\n  background-size: 100% 100%; }\n\n.imgIndicator {\n  bottom: 0;\n  display: none;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: 1; }\n\n.imgLoadingIndicator .imgIndicator {\n  display: block; }\n\n.imgContainer {\n  display: block;\n  position: relative; }\n\n</style>"), define("image_css", function () {
}), define("image", ["require", "exports", "module", "ReactDOM", "spinner", "class_component", "image_css"], function (e, t, n) {
    var r = e("ReactDOM"), i = e("spinner").Spinner, s = e("class_component");
    e("image_css");
    var o = 1e3, u = 500;
    t.Image = s.createComponent({getInitialState:function () {
        return this.image = new window.Image, this.image.src = this.props.src, this.image.onload = function () {
            this.updateState({loaded:!0})
        }.bind(this), setTimeout(function () {
            this.updateState({loadingIndicator:!0})
        }.bind(this), o), setTimeout(function () {
            this.updateState({useTransition:!0})
        }.bind(this), u), {loaded:!1, loadingIndicator:!1, useTransition:!1}
    }, render:function () {
        var e = {};
        this.props.src && (e.backgroundImage = "url(" + this.props.src + ")");
        var t = {}, n = {imgContainer:!0, imgLoaded:this.state.loaded, imgLoading:!this.state.loaded, imgLoadingIndicator:!this.state.loaded && this.state.loadingIndicator, imgWithTransition:this.state.useTransition};
        return t.width = e.width = this.props.width, t.height = e.height = this.props.height, r.div({classSet:n, children:[r.div({classSet:{imgImg:!0, image:!0}, style:e}), r.div({className:"imgIndicator", style:t, children:i({})})]})
    }})
}), define("dates", ["require", "exports", "module", "i18n", "sprintf-0.7"], function (e, t, n) {
    var r = e("i18n").i18n, i = e("sprintf-0.7").sprintf, s = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], o = function (e) {
        var t = new Date(e * 1e3);
        return{month_name:r(s[t.getMonth()]), month:t.getMonth(), day:t.getDate(), year:t.getFullYear()}
    };
    t.parseDate = o;
    var u = function (e, t) {
        var n = Math.round(new Date / 1e3 - e);
        if (n < 1)return r("Now");
        if (n / 60 < 1)return t ? i(r("%(seconds)ss"), {seconds:n}) : n == 1 ? r("1 second ago") : i(r("%(seconds)s seconds ago"), {seconds:n});
        if (n / 3600 < 1) {
            var s = Math.round(n / 60);
            return t ? i(r("%(minutes)sm"), {minutes:s}) : s == 1 ? r("1 minute ago") : i(r("%(minutes)s minutes ago"), {minutes:s})
        }
        if (n / 86400 < 1) {
            var o = Math.round(n / 3600);
            return t ? i(r("%(hours)sh"), {hours:o}) : o == 1 ? r("1 hour ago") : i(r("%(hours)s hours ago"), {hours:o})
        }
        if (n / 604800 < 1) {
            var u = Math.round(n / 86400);
            return t ? i(r("%(days)sd"), {days:u}) : u == 1 ? r("1 day ago") : i(r("%(days)s days ago"), {days:u})
        }
        if (n / 2592e3 < 1) {
            var a = Math.round(n / 604800);
            return t ? i(r("%(weeks)sw"), {weeks:a}) : a == 1 ? r("1 week ago") : i(r("%(weeks)s weeks ago"), {weeks:a})
        }
        var a = Math.round(n / 604800), f = Math.round(n / 2592e3);
        return t ? i(r("%(weeks)sw"), {weeks:a}) : f == 1 ? r("1 month ago") : i(r("%(months)s months ago"), {months:f})
    };
    t.ago = function (e) {
        return u(e, !1)
    }, t.agoShortened = function (e) {
        return u(e, !0)
    }
}), define("media_item", ["require", "exports", "module", "backbone", "user", "dates"], function (e, t, n) {
    var r = e("backbone"), i = e("user"), s = e("dates"), o = n.exports = r.Model.extend({initialize:function (e) {
        e.created_time && this.parseDate(parseInt(e.created_time))
    }, url:function () {
        return"/media/" + this.get("id") + "/info/"
    }, getImageUrl:function () {
        return this.get("images").standard_resolution.url
    }, parseDate:function (e) {
        var t = s.parseDate(e);
        this.set("timestamp", e), this.set("created_at", t)
    }})
}), define("push_state", ["require", "exports", "module"], function (e, t, n) {
    if (!window.history || !window.history.replaceState) {
        var r = function () {
        };
        t.push = r, t.replace = r, t.back = r, t.supported = !1
    } else {
        var i = window.history, s = {}, o = 0, u = window.location.href, a = 0;
        window.onpopstate = function (e) {
            e.state && e.state.cb && s[e.state.cb] ? (s[e.state.cb].call(null), delete s[e.state.cb], a -= 1) : u != window.location.href && (window.location.href = window.location.href)
        };
        function f(e) {
            var t = i.state || {}, n = "cb" + o++;
            return s[n] = e, t.cb = n, t
        }

        t.supported = !0, t.push = function (e, t) {
            l(window.location.href, t), i.pushState({}, "", e), a += 1
        };
        function l(e, t) {
            i.replaceState(f(t), "", e)
        }

        t.replace = l, t.back = function () {
            a > 0 && i.go(-1)
        }
    }
}), $("head").append("<style>\n.mediaPhoto .imgLoaded.imgWithTransition .imgImg {\n  -webkit-transition: opacity 2s;\n  -moz-transition: opacity 2s;\n  -o-transition: opacity 2s;\n  transition: opacity 2s;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%; }\n\n</style>"), define("media_photo_css", function () {
}), define("media_photo", ["require", "exports", "module", "ReactDOM", "React", "image", "media_photo_css"], function (e, t, n) {
    var r = e("ReactDOM"), i = e("React"), s = e("image").Image;
    e("media_photo_css"), t.MediaPhoto = i.createComponent({getInitialState:function () {
        return{pop:!1}
    }, dblClickThreshold:500, handleOnClick:function (e) {
        var t = +(new Date), n = this._lastClickTime;
        this._lastClickTime = t, this.props.onClick && this.props.onClick.call(this, e), this.props.onDblClick && n && t - n < this.dblClickThreshold && this.props.onDblClick.call(this, e)
    }, doLikeAnimation:function () {
        var e = this;
        e.updateState({pop:!1}), setTimeout(function () {
            e.updateState({pop:!0})
        }, 10)
    }, render:function () {
        return r.div({className:"mediaPhoto", onClick:this.handleOnClick.bind(this), children:[r.span({classSet:{"i-like-big":!0, "i-like-big-pop":!!this.state.pop}}), s({src:this.props.src, classSet:this.props.classSet})]})
    }})
}), define("modal_media_item", ["require", "exports", "module", "ReactDOM", "backbone", "React", "ReactDOMTransaction", "ReactBrowserUtils", "tx", "media_item", "i18n", "media_common", "push_state", "user", "fancy_image", "dates", "media_photo", "linkify"], function (e, t, n) {
    function T() {
        return S
    }

    function C() {
        $(renderTarget).removeClass("hidden"), $("body").css("overflow", "hidden"), $(".comment-text").val(E), N = !0
    }

    function k() {
        $(renderTarget).addClass("hidden"), $("body").css("overflow", "auto"), N = !1
    }

    function L() {
        v.supported && v.back(), k()
    }

    function A(e) {
        var t = T(), n = x.getModelById(e);
        C(), t.setMediaItem(null), t.setMediaItem(n)
    }

    function O(e) {
        return e && e.get("can_view_comments") && m.getLoggedInUser()
    }

    function _(e) {
        T().iLike(e)
    }

    function D(e) {
        return e && e.get("user_has_liked")
    }

    function P(e) {
        var t = "/accounts/login/", n = window.location, r = "?next=" + encodeURIComponent(n.pathname);
        n.href = t + r
    }

    function j(e) {
        return d.abbrCount(e ? e.get("likes").count : 0)
    }

    function F(e) {
        return d.abbrCount(e ? e.get("comments").count : 0)
    }

    function q(e, t) {
        if (!e || !t)return;
        return $.ajax({type:"POST", dataType:"json", url:"/web/comments/" + e.get("id") + "/add/", data:{comment_text:t.text, csrfmiddlewaretoken:window.csrf_token}, success:function (e) {
            for (var n in e)t[n] = e[n];
            t.error = null, T().reconcile(), U()
        }, error:function (e) {
            t.error = e.responseText || p("Couldn't post comment"), T().reconcile(), U()
        }}), t
    }

    function U() {
        var e = $(".media-likes").outerHeight() || 0, t = $(".caption").outerHeight() || 0, n = $(".media-addcomment").outerHeight() || 0, r = $(".cta-addcomment").outerHeight() || 0, i = $(".comment-list");
        i.css("height", $(".media-info").height() - e - t - n - r + 7 + "px").scrollTop(i[0].scrollHeight - i.height())
    }

    var r = e("ReactDOM"), i = e("backbone"), s = e("React"), o = e("ReactDOMTransaction"), u = e("ReactBrowserUtils"), a = u.escapeTextForBrowser, f = e("tx"), l = f.tx, c = f.txp, h = e("media_item"), p = e("i18n").i18n, d = e("media_common"), v = e("push_state"), m = e("user"), g = e("fancy_image"), y = e("dates"), b = e("media_photo").MediaPhoto, w = e("linkify").LinkifiedText, E = p("Add a comment"), S, x;
    t.init = function (e, t) {
        x = e, renderTarget = document.getElementById(t), s.renderComponent(S = M({}), renderTarget)
    };
    var N;
    t.show = A, $(document).keydown(function (e) {
        switch (e.which) {
            case 27:
                L();
                break;
            case 37:
                N && T().showPreviousPhoto();
                break;
            case 39:
                N && T().showNextPhoto()
        }
    }).click(function (e) {
        N && e.target === $(".modal-media", renderTarget).get(0) && L()
    });
    var M = s.createComponent({getInitialState:function () {
        return{top:this.getTopOffset(), model:null, neighbors:{prev:null, next:null}}
    }, getTopOffset:function () {
        return Math.max(10, ($(window).height() - 612 >> 1) - 20)
    }, photoCodeExp:/\/p\/([^\/]+)\/?$/, setMediaItem:function (e) {
        if (e) {
            var t = e.get("link"), n = this.photoCodeExp.exec(t), r = n && n[1];
            r && v[this.state.model ? "replace" : "push"]("/p/" + r + "/", k);
            var i = x.getNeighbors(e), s = this.preload(i.prev), o = this.preload(i.next)
        }
        this.updateState({top:this.getTopOffset(), model:e, neighbors:{prev:s, next:o}})
    }, preload:function (e) {
        return e && ((new window.Image).src = e.getImageUrl()), e
    }, hasPreviousPhoto:function () {
        return!!this.state.neighbors.prev
    }, hasNextPhoto:function () {
        return!!this.state.neighbors.next || !!x.get("more_available")
    }, showPreviousPhoto:function () {
        var e = this.state.neighbors.prev;
        e && this.setMediaItem(e)
    }, showNextPhoto:function () {
        var e = this.state.neighbors.next;
        e ? this.setMediaItem(e) : x.get("more_available") && x.fetchNextPage(function (e) {
            var t = this.state.model;
            if (e && t) {
                var n = x.getNeighbors(t);
                this.state.neighbors = n, n.next && this.showNextPhoto()
            }
        }, this)
    }, iLike:function (e) {
        var t = this.state.model;
        if (!t)return;
        var n = D(t);
        if (n && !e)return;
        if (!m.getLoggedInUser()) {
            P("like");
            return
        }
        if (!O(t))return;
        t.get("likes").count += n ? -1 : 1, t.set("user_has_liked", !n), this.reconcile(), $(".i-like").toggleClass("i-like-pop", !n);
        var r = n ? "unlike" : "like";
        $.ajax({type:"POST", url:"/web/likes/" + t.get("id") + "/" + r + "/", success:function (e) {
        }, error:function (e) {
        }});
        var i = r === "like";
        return $(".i-like-big").toggleClass("i-like-big-pop", i), r === "like"
    }, _renderCaption:function () {
        var e = this.state.model, t = e && e.get("caption"), n = e && e.get("location");
        return r.div({className:"modal-meta", children:[r.p({className:"media-caption", children:[t && t.text.length > 0 && r.span({className:"caption-text", children:t.text}), n && n.name && r.span({className:"caption-location", children:[r.span({children:"at"}), r.strong({children:n.name})]})]}), r.ul({className:"modal-controls", children:[this.hasPreviousPhoto() && r.li({className:"nav-left", children:r.a({href:"javascript:;", onClick:this.showPreviousPhoto.bind(this)})}), this.hasNextPhoto() && r.li({className:"nav-right", children:r.a({href:"javascript:;", onClick:this.showNextPhoto.bind(this)})})]})]})
    }, render:function () {
        function n() {
            var t = D(e);
            _(), d.clearSelection(), t || i.doLikeAnimation()
        }

        var e = this.state.model, t = e && e.getImageUrl(), i = t && b({src:t, classSet:{"media-photo":!0}, onDblClick:n});
        return r.div({className:"modal-media media-open", children:r.div({className:"media-inner", style:{marginTop:this.state.top + "px"}, children:[i, H({model:e}), this._renderCaption()]})})
    }}), H = s.createComponent({allowDrawerToClose:!1, toggleMediaState:function (e) {
        this.allowDrawerToClose && ($(".modal-media").toggleClass("media-open"), $(".media-open").length === 0 && $(".media-opened").removeClass("media-opened")), typeof e != "undefined" && $(e).focus()
    }, mediaBarComment:function () {
        O(this.props.model) ? $(".media-open").length == 1 ? $(".comment-text").focus() : this.toggleMediaState(".comment-text") : m.getLoggedInUser() ? highlightPrivacyNote() : login_with_intent("comment")
    }, _renderLikeControl:function () {
        return r.li({className:"like-control", children:[r.strong({children:[r.span({className:"count-badge like-count", children:j(this.props.model)}), r.b({children:"Likes"})]}), r.a({classSet:{"like-button":!0, "liked-button":D(this.props.model)}, href:"javascript:;", onClick:_.bind(this, !0), children:[r.span({children:"Like"}), r.b({}), r.i({})]})]})
    }, _renderCommentControl:function () {
        return r.li({className:"comment-control", children:[r.strong({children:[r.span({className:"count-badge comment-count", children:F(this.props.model)}), r.b({children:"Comments"})]}), r.a({id:"comment_button", className:"comment-button", href:"javascript:;", onClick:this.mediaBarComment.bind(this), children:[r.span({children:"Comment"}), r.b({}), r.i({})]})]})
    }, _renderMediaBar:function () {
        return r.div({className:"media-bar", children:[r.ul({children:[this._renderLikeControl(), this._renderCommentControl()]}), r.span({className:"i-like"}), r.span({className:"bar-glyph"})]})
    }, render:function () {
        var e = this.props.model, t = e && e.get("can_view_comments"), n = e && e.get("can_delete_comments"), i = F(e);
        return r.div({classSet:{"media-info":!0, "few-comments":i < 4, "no-comments":i < 1, "no-likes":j(e) < 1, "mount-addcomment":!0, "can-delete-comments":n}, children:[t && [B({model:e}), R({model:e})], this._renderMediaBar()]})
    }}), B = s.createComponent({_renderSelfLike:function () {
        var e = m.getLoggedInUser(), t = g.FancyImage;
        return r.li({classSet:{like:!0, "new-like":!0, inactive:!D(this.props.model)}, children:e && [t({imgURL:e.get("profile_picture"), linkToUrl:"/" + e.get("username") + "/", imgStyle:"inset", extraClasses:"like-avatar"}), r.strong({className:"tooltip", children:e.get("username")})]})
    }, _renderOtherLikes:function (e) {
        e = +(e || 7);
        var t = this.props.model, n = m.getLoggedInUser(), i = n && n.get("username"), s = t && t.get("likes").data || [], o = s.filter(function (e) {
            return e.username !== i
        }).slice(0, e), u = g.FancyImage;
        return o.map(function (t, n) {
            return r.li({classSet:{like:!0, "first-two":n === 1, "last-two":n >= e - 2}, children:[u({imgURL:t.profile_picture, linkToUrl:"/" + t.username + "/", imgStyle:"inset", extraClasses:"like-avatar"}), r.strong({className:"tooltip", children:t.username})]})
        })
    }, render:function () {
        return r.section({className:"media-likes", children:[r.h2({children:[r.span({className:"like-count", children:j(this.props.model)}), r.b({children:"Likes"})]}), r.p({className:"likes-notice", children:r.span({children:p("No likes yet.")})}), r.div({classSet:{"like-list":!0, "like-slide":D(this.props.model)}, children:r.ul({children:[m.getLoggedInUser() && this._renderSelfLike(), this._renderOtherLikes()]})}), r.i({className:"media-likes-fade"})]})
    }}), I = s.createComponent({removeComment:function (e) {
        var t = this.props.mediaItem, n = this.props.comment, r = $(e.target).parents(".comment").first();
        r.animate({opacity:0, marginBottom:-r.outerHeight() + "px"}, 300, function () {
            n.deleted = !0, t.get("comments").count -= 1, T().reconcile()
        })
    }, deleteComment:function (e) {
        var t = this.props.mediaItem, n = t.get("id"), r = this.props.comment;
        this.removeComment(e);
        if (!r.id)return;
        $.ajax({type:"POST", url:"/web/comments/" + n + "/delete/" + r.id + "/", success:function () {
        }, error:function () {
        }})
    }, postComment:function () {
        return q(this.props.mediaItem, this.props.comment)
    }, render:function () {
        var e = r[this.props.tag || "li"], t = g.FancyImage, n = this.props.comment, i = n.from, s = n.text, o = n.created_time, u = {comment:!0, failed:!!n.error, hidden:!!n.deleted};
        return(this.props.extraClasses || "").split(/\s+/g).forEach(function (e) {
            e && (u[e] = !0)
        }), e({classSet:u, "data-id":n.id, children:[i.profile_picture && t({imgURL:i.profile_picture, linkToUrl:"/" + i.username + "/", imgStyle:"inset", extraClasses:"comment-avatar"}), r.p({children:[r.strong({className:"username", children:r.a({href:"/" + i.username + "/", children:i.username})}), w({classSet:{"comment-text":!0}, children:[s]}), r.span({className:"comment-meta", children:r.time({datetime:o, children:y.agoShortened(o)})}), r.span({className:"comment-info", children:[this.props.canDelete && r.a({className:"delete-comment", onClick:this.deleteComment.bind(this), href:"javascript:;"}), n.error && r.span({className:"failure-message", children:[n.error, r.br({}), r.a({href:"javascript:;", onClick:this.postComment.bind(this), children:p("Retry")}), " ", "•", " ", r.a({href:"javascript:;", onClick:this.removeComment.bind(this), children:p("Cancel")})]})]})]})]})
    }}), R = s.createComponent({_mediaComment:function (e, t, n) {
        var r = this.props.model;
        return I({comment:e, mediaItem:r, canDelete:r.get("can_delete_comments"), extraClasses:t || "", tag:n || "li"})
    }, onKeyDown:function (e) {
        e = $.event.fix(e.nativeEvent);
        switch (e.which) {
            case 13:
                if (!e.shiftKey) {
                    var t = $(e.target), n = t.val();
                    this.postComment(this.addComment(n)) && t.val("").focus(), e.preventDefault()
                }
                ;
            default:
                e.stopPropagation()
        }
    }, addComment:function (e) {
        var t = this.props.model;
        if (O(t)) {
            var n = m.getLoggedInUser(), r = {text:e, created_time:new Date / 1e3, from:{username:n.get("username"), profile_picture:n.get("profile_picture"), full_name:n.get("full_name")}, content_type:"comment", type:0};
            return t.get("comments").count += 1, t.get("comments").data.push(r), T().reconcile(), U(), r
        }
    }, postComment:function (e) {
        return q(this.props.model, e)
    }, focusInput:function (e) {
        var t = $(e.target);
        t.val() === E && t.removeClass("placeholder").val("")
    }, blurInput:function (e) {
        var t = $(e.target);
        t.val() === "" && t.addClass("placeholder").val(E)
    }, onDomReady:function (e) {
        $("textarea.comment-text", e).autogrow({onHeightChange:U})
    }, _renderCommentForm:function () {
        var e = m.getLoggedInUser(), t = g.FancyImage;
        return r.form({className:"media-addcomment", id:"media_addcomment", children:[r.label({children:"Comment"}), e && t({imgURL:e.get("profile_picture"), imgStyle:"inset", extraClasses:"like-avatar"}), r.textarea({className:"comment-text", name:"comment_text", onKeyDown:this.onKeyDown.bind(this), onFocus:this.focusInput.bind(this), onBlur:this.blurInput.bind(this), value:E})]})
    }, _renderLoginToComment:function () {
        return r.div({className:"cta-addcomment", children:r.p({children:[p("To add a comment, please "), r.a({href:"javascript:;", onClick:P.bind(this, "comment"), children:p("sign in")}), "."]})})
    }, _renderMediaComments:function () {
        var e = this.props.model, t = e && e.get("caption"), n = e && e.get("comments").data || [];
        return setTimeout(U, 10), r.section({className:"media-comments", children:[r.h2({children:[r.span({className:"comment-count", children:F(e)}), r.b({children:"Comments"})]}), t && t.text.length > 0 && this._mediaComment(t, "caption", "div"), r.ul({className:"comment-list", children:n.map(function (e) {
            return this._mediaComment(e, !1, "li")
        }, this)}), m.getLoggedInUser() ? this._renderCommentForm() : this._renderLoginToComment()]})
    }, render:function () {
        return r.div({children:this._renderMediaComments()})
    }})
}), define("plink", ["require", "exports", "module", "ReactDOM", "React", "modal_media_item"], function (e, t, n) {
    var r = e("ReactDOM"), i = e("React"), s = e("modal_media_item");
    t.PLink = i.createComponent({doPopup:function (e) {
        s.show(this.props.media.get("id")), e.preventDefault()
    }, render:function () {
        return r.a({href:this.props.media.get("link"), onClick:this.props.onClick || this.doPopup.bind(this), target:"_blank", className:this.props.klass, children:this.props.children})
    }})
}), define("feed", ["require", "exports", "module", "backbone", "underscore", "media_item"], function (e, t, n) {
    function o() {
        throw new Error("not implemented")
    }

    var r = e("backbone"), i = e("underscore"), s = e("media_item"), u = r.Collection.prototype.add, a = t.FeedItems = r.Collection.extend({model:s, initialize:function () {
        this._idToItem = {}
    }, getModel:o, getModelId:function (e) {
        return e.get("id")
    }, getItem:function (e) {
        return this._idToItem[this.getModelId(e)]
    }, getItemId:o, getMaxId:function () {
        return this.getItemId(this.getItem(this.last()))
    }, mirrorTo:function (e) {
        var t = {silent:!0};
        e.reset(this.map(this.getItem, this), t), this.on("add", function (n) {
            e.add([this.getItem(n)], t)
        }, this)
    }, add:function (e, t) {
        return u.call(this, i.map(e, function (e) {
            var t = this.getModel(e);
            return this._idToItem[this.getModelId(t)] = e, t
        }, this), t)
    }, remove:o, comparator:function (e) {
        return this.itemComparator(this.getItem(e))
    }, itemComparator:o, getNeighbors:function (e) {
        var t = this, n = t.getModelId(e), r, i, s;
        return t.find(function (e) {
            if (t.getModelId(e) === n)i = e; else {
                if (i)return s = e, !0;
                r = e
            }
        }), {prev:r, next:s}
    }}), f = t.SimpleFeedItems = a.extend({getModel:function (e) {
        return new this.model(e)
    }, getItemId:function (e) {
        return e.id
    }, comparator:function (e) {
        return-e.get("timestamp")
    }}), l = t.Feed = r.Model.extend({itemsClass:f, initialize:function () {
        this._items = new this.itemsClass
    }, url:o, parse:function (e) {
        return this.addItems(e.items), {more_available:e.more_available}
    }, isEmpty:function () {
        return this._items.length === 0
    }, addItems:function (e) {
        return this._items.add(e)
    }, mirrorTo:function (e) {
        e instanceof l ? this._items.mirrorTo(e._items) : e instanceof a && this._items.mirrorTo(e)
    }, each:function (e, t) {
        return this._items.each(e, t)
    }, map:function (e, t) {
        return this._items.map(e, t)
    }, getModelById:function (e) {
        return this._items.get(e)
    }, getNeighbors:function (e) {
        return this._items.getNeighbors(e)
    }, fetchNextPage:function (e, t) {
        function r() {
            n.set("fetching", !1), e && e.call(t, !1)
        }

        var n = this;
        if (!this.get("more_available"))return r();
        n.set("fetching", !0), n.fetch({data:{max_id:n._items.getMaxId()}, success:function () {
            n.set("fetching", !1), e && e.call(t, !0)
        }, error:r})
    }})
}), define("compmedia", ["require", "exports", "module", "ReactDOM", "React", "image", "tx", "plink", "modal_media_item", "feed"], function (e, t, n) {
    var r = e("ReactDOM"), i = e("React"), s = e("image").Image, o = e("tx"), u = o.tx, a = o.txp, f = e("plink").PLink, l = e("modal_media_item"), c = e("feed"), h = i.createComponent({doPopup:function (e) {
        l.show(this.props.flipside && this.props.flipped ? this.props.flipside.get("id") : this.props.media.get("id")), e.preventDefault()
    }, render:function () {
        var e = null, t = this.doPopup.bind(this);
        this.props.flipside && (e = f({klass:"compFlipside", onClick:t, media:this.props.flipside, children:[s({src:this.props.flipside.get("images").standard_resolution.url, alt:"", width:"100%", height:"100%"}), r.b({className:"compPhotoShadow"})]}));
        var n = "compPhoto compPhoto" + (this.props.index + 1);
        return this.props.flipped && this.props.flipside && (n += " compFlipped"), r.div({className:n, children:[f({klass:"compFrontside", onClick:t, media:this.props.media, children:[s({src:this.props.media.get("images").standard_resolution.url, alt:"", width:"100%", height:"100%"}), r.b({className:"compPhotoShadow"})]}), e]})
    }}), p = 7;
    t.Header = i.createComponent({getInitialState:function () {
        var e = [];
        for (var t = 0; t < p; t++)e.push(!1);
        return this.flipTimeout(), {flipped:e}
    }, flipCompPhoto:function () {
        var e = Math.ceil(Math.random() * p), t = this.state.flipped;
        t[e] = !t[e], this.updateState({flipped:t}), this.flipTimeout()
    }, flipTimeout:function () {
        var e = 2e3 + Math.ceil(Math.random() * 4) * 500;
        setTimeout(this.flipCompPhoto.bind(this), e)
    }, render:function () {
        var e = [], t = 0;
        for (t = 0; t < p; t++) {
            var n = this.props.compMedia.at(t);
            if (!n)break;
            var i = null, s = null, o = this.props.compMedia.at(t + p);
            e.push(h({index:t, flipside:o, media:n, flipped:this.state.flipped[t]}))
        }
        var u = "compWrapper";
        return t < 7 && (u += " compNoComp", e = null), r.div({className:u, children:r.div({className:"compInnerWrapper", children:r.div({className:"compContainer", children:e})})})
    }}), t.FeedItems = c.SimpleFeedItems.extend({comparator:function (e) {
        return-(e.get("likes").count + e.get("comments").count)
    }})
}), define("photo_grid_view", ["require", "exports", "module", "ReactDOM", "React", "ReactBackbone", "underscore", "spinner", "tx", "i18n", "plink", "image", "media_common"], function (e, t, n) {
    var r = e("ReactDOM"), i = e("React"), s = e("ReactBackbone"), o = e("underscore"), u = e("spinner").Spinner, a = e("tx"), f = a.tx, l = a.txp, c = e("i18n").i18n, h = e("plink").PLink, p = e("image").Image, d = e("media_common").abbrCount, v = i.createComponent({render:function () {
        return r.p({className:"photo-grid-status status-no-photos", children:r.span({className:"no-photos-message", children:f({children:["No photos to show."]})})})
    }}), m = i.createComponent({render:function () {
        var e = this.props.media.toJSON(), t = null;
        return e.show_date_header && (t = r.h3({children:[e.created_at.month_name, " ", e.created_at.year]})), r.li({className:"photo", children:r.div({className:"photo-wrapper", children:[t, h({media:this.props.media, klass:"bg"}), r.time({className:"photo-date", children:f({children:[l({name:"day", children:[e.created_at.day]}), " ", l({name:"month_name", children:[e.created_at.month_name]}), " ", l({name:"year", children:[e.created_at.year]})]})}), h({media:this.props.media, children:[p({src:e.images.low_resolution.url}), r.div({className:"photoShadow"})]}), r.ul({className:"photo-stats", children:[r.li({className:"stat-likes", children:r.b({children:d(e.likes.count, 1e3)})}), r.li({className:"stat-comments", children:r.b({children:d(e.comments.count, 1e3)})})]})]})})
    }});
    t.PhotoGridView = s.createComponent({onDomReady:function (e) {
        this.setupScrollToLoadMore()
    }, doLoadMore:function () {
        this.props.feed.fetchNextPage()
    }, setupScrollToLoadMore:function () {
        this.loadedFromScroll = 0, this.loadFromScroll = !0, $(window).scroll(o.bind(function () {
            var e = $(document).height() - $(window).scrollTop() - $(window).height();
            e < 200 && !this.props.feed.get("fetching") && this.props.feed.get("more_available") && (this.loadedFromScroll < 2 && this.loadFromScroll ? (this.doLoadMore(), this.loadedFromScroll++) : this.loadFromScroll = !1)
        }, this))
    }, render:function () {
        if (this.props.feed.isEmpty())return v({});
        var e = null, t = r.span({className:"loading-indicator", style:{display:this.props.feed.get("fetching") ? "inline-block" : "none"}, children:u({})});
        if (this.props.feed.get("more_available")) {
            var n;
            this.props.feed.get("fetching") ? n = f({children:["Loading more..."]}) : n = f({children:["Load more..."]}), e = r.a({className:"more-photos-enabled", href:"javascript:;", onClick:this.doLoadMore.bind(this), children:[t, r.span({className:"more-label", children:n})]})
        } else e = r.a({className:"more-photos-disabled", href:"javascript:;", children:[t, r.span({className:"more-label", children:f({children:["All items loaded"]})})]});
        var i, s = this.props.feed.map(function (e) {
            var t = e.get("created_at"), n = c("%(year)s %(month)s", t);
            return this.props.feed.hideDateHeaders || (e.set("show_date_header", i != n), i = n), m({media:e})
        }, this);
        return r.div({children:[r.div({className:"photo-grid", children:r.ul({className:"photo-feed", children:s})}), r.span({className:"more-photos", children:e})]})
    }})
}), define("scrolling", ["require", "exports", "module"], function (e, t, n) {
    var r = 100, i = 150, s = 300;
    t.init = function (e, t) {
        var n = 0, o = 0, u = null, a = !1;
        t.addClass(e);
        var f = function () {
            (new Date).getTime() - n > s ? (t.addClass(e), a = !1, u = null) : u = setTimeout(f, r)
        };
        $(window).scroll(function () {
            n = (new Date).getTime(), u || (o = n, u = setTimeout(f, r)), !a && n - o > i && (a = !0, t.removeClass(e))
        })
    }
}), define("userprofile", ["require", "exports", "module", "React", "backbone", "user", "userprofile_components", "compmedia", "photo_grid_view", "feed", "scrolling", "modal_media_item"], function (e, t, n) {
    var r = e("React"), i = e("backbone"), s = e("user"), o = e("userprofile_components"), u = e("compmedia"), a = u.Header, f = o.PrivateProfileHeader, l = o.ProfileUserView, c = e("photo_grid_view").PhotoGridView, h = e("feed");
    e("scrolling").init("noScroll", $(".root"));
    var p = i.Model.extend({canView:function () {
        return v.isLoggedInUser() || this.get("following") || !this.get("is_private")
    }}), d = h.Feed.extend({url:function () {
        return"/" + this.get("user").escape("username") + "/media"
    }}), v = new s, m = new p, g, y = new u.FeedItems;
    t.init = function (t, n, i, o, u) {
        v.set(t), s.setLoggedInUser(n), m.set(i), g = new d({user:v, more_available:u}), g.addItems(o), g.mirrorTo(y), $(function () {
            r.renderComponent(m.canView() ? a({compMedia:y}) : f({profileUser:v}), document.getElementById("feed-header")), r.renderComponent(l({relationship:m, profileUser:v, user:s.getLoggedInUser()}), document.getElementById("profile_user")), r.renderComponent(c({feed:g}), document.getElementById("feed-photos")), e("modal_media_item").init(g, "profile-media-modal")
        })
    }
})