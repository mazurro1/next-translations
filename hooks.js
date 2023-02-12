var pageTranslations = null;
var initializeTranslations = function (translations) {
  pageTranslations = translations;
};
var useTranslation = function (namespace) {
  if (!pageTranslations) {
    return {
      t: function (slug) {
        return "".concat(namespace, ": ").concat(slug);
      },
    };
  }
  var translationsNamespace = pageTranslations[namespace];
  var t = function (slug) {
    if (slug === void 0) {
      slug = "";
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
      } else {
        console.log("Fail translation ".concat(namespace, ": ").concat(slug));
        return "".concat(namespace, ": ").concat(slug);
      }
    }
    return pathTranslationd;
  };
  return {
    t: t,
    pageTranslations: pageTranslations,
  };
};
module.exports = {
  initializeTranslations: initializeTranslations,
  pageTranslations: pageTranslations,
  useTranslation: useTranslation,
};
