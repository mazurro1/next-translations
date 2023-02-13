var pageTranslations = null;
var initializeTranslations = function (translations) {
    pageTranslations = translations;
};
var checkTypesAndReturn = function (type, value) {
    if (type === "string") {
        if (typeof value === "string") {
            return value;
        }
        else {
            return undefined;
        }
    }
    else if (type === "number") {
        if (typeof value === "number") {
            return value;
        }
        else {
            return undefined;
        }
    }
    else if (type === "array") {
        if (Array.isArray(value)) {
            return value;
        }
        else {
            return undefined;
        }
    }
    else if (type === "object") {
        if (typeof value === "object" && !Array.isArray(value) && value !== null) {
            return value;
        }
        else {
            return undefined;
        }
    }
};
var useTranslation = function (namespace) {
    if (!pageTranslations) {
        return {
            t: function (slug) {
                return "".concat(namespace, ": ").concat(slug);
            }
        };
    }
    var translationsNamespace = pageTranslations[namespace];
    var t = function (props) {
        if (props === void 0) { props = ""; }
        var slug = "";
        var type = undefined;
        if (typeof props === "string") {
            slug = props;
        }
        else {
            slug = props.slug;
            if (props.type) {
                if (typeof props.type === "string") {
                    type = props.type;
                }
            }
        }
        if (!translationsNamespace) {
            console.log("Fail translation ".concat(namespace, ": ").concat(slug));
            return "".concat(namespace, ": ").concat(slug);
        }
        var splitPath = slug.split(".");
        var pathTranslationd = null;
        for (var _i = 0, splitPath_1 = splitPath; _i < splitPath_1.length; _i++) {
            var path = splitPath_1[_i];
            var tryTranslation = pathTranslationd
                ? pathTranslationd[path]
                : translationsNamespace[path];
            if (tryTranslation !== undefined) {
                pathTranslationd = tryTranslation;
            }
            else {
                console.log("Fail translation ".concat(namespace, ": ").concat(slug));
                return "".concat(namespace, ": ").concat(slug);
            }
        }
        if (pathTranslationd === "".concat(namespace, ": ").concat(slug)) {
            return pathTranslationd;
        }
        if (type) {
            var validValue = checkTypesAndReturn(type, pathTranslationd);
            if (validValue !== undefined) {
                return validValue;
            }
            else {
                console.log("Fail type ".concat(namespace, ": ").concat(slug));
                return "".concat(namespace, ": ").concat(slug);
            }
        }
        else {
            return pathTranslationd;
        }
    };
    return {
        t: t,
        pageTranslations: pageTranslations
    };
};
// export {initializeTranslations, pageTranslations, useTranslation};
module.exports = { initializeTranslations: initializeTranslations, pageTranslations: pageTranslations, useTranslation: useTranslation };
