var translationsPage = null;
var initializeTranslations = function (translations) {
  translationsPage = translations;
};
var useTranslation = function (namespace) {
  if (!translationsPage) {
    return {
      t: function (slug) {
        return "".concat(namespace, ": ").concat(slug);
      },
    };
  }
  var translationsNamespace = translationsPage[namespace];
  var t = function (slug) {
    if (slug === void 0) {
      slug = "";
    }
    if (!translationsNamespace) {
      console.log("Fail translate ".concat(namespace, ": ").concat(slug));
      return "".concat(namespace, ": ").concat(slug);
    }
    var splitPath = slug.split(".");
    var pathTranslated = null;
    for (var _i = 0, splitPath_1 = splitPath; _i < splitPath_1.length; _i++) {
      var path = splitPath_1[_i];
      var tryTranslate = pathTranslated
        ? pathTranslated[path]
        : translationsNamespace[path];
      if (tryTranslate !== undefined) {
        pathTranslated = tryTranslate;
      } else {
        console.log("Fail translate ".concat(namespace, ": ").concat(slug));
        return "".concat(namespace, ": ").concat(slug);
      }
    }
    return pathTranslated;
  };
  return {
    t: t,
    translationsPage: translationsPage,
  };
};
module.exports = {
  initializeTranslations: initializeTranslations,
  translationsPage: translationsPage,
  useTranslation: useTranslation,
};
