var translatesPage = null;
var initializeTranslates = function (translates) {
    translatesPage = translates;
};
var useTranslation = function (namespace) {
    if (!translatesPage) {
        return {
            t: function (slug) {
                return "".concat(namespace, ": ").concat(slug);
            }
        };
    }
    var translatesNamespace = translatesPage[namespace];
    var t = function (slug) {
        if (slug === void 0) { slug = ""; }
        if (!translatesNamespace) {
            console.log("Fail translate ".concat(namespace, ": ").concat(slug));
            return "".concat(namespace, ": ").concat(slug);
        }
        var splitPath = slug.split(".");
        var pathTranslated = null;
        for (var _i = 0, splitPath_1 = splitPath; _i < splitPath_1.length; _i++) {
            var path = splitPath_1[_i];
            var tryTranslate = pathTranslated
                ? pathTranslated[path]
                : translatesNamespace[path];
            if (tryTranslate !== undefined) {
                pathTranslated = tryTranslate;
            }
            else {
                console.log("Fail translate ".concat(namespace, ": ").concat(slug));
                return "".concat(namespace, ": ").concat(slug);
            }
        }
        return pathTranslated;
    };
    return {
        t: t,
        translatesPage: translatesPage
    };
};
module.exports = { initializeTranslates: initializeTranslates, translatesPage: translatesPage, useTranslation: useTranslation };
