function run_jscall(e, t, n) {
    requirejs([e], function (e) {
        e[t].apply(e, n)
    })
}
window.run_jscall = run_jscall;
for (var i = 0; i < window._jscalls.length; i++) {
    var jscall = window._jscalls[i];
    if (!jscall)continue;
    run_jscall(jscall[0], jscall[1], jscall[2])
}
window.onerror = function (e, t, n) {
    return Math.random() > .1 ? !1 : ($.post("/client_error", {message:e, url:t, line:n, ref:window.location.href}), !1)
}, define("main", function () {
})