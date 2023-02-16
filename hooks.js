//@ts-ignore
// import translationsConfigUser from "../../translations.config.ts";
var translationsConfigUser = require("../../translations.config.js");
var translationsConfig = {
  componentNameToReplaced:
    (translationsConfigUser === null || translationsConfigUser === void 0
      ? void 0
      : translationsConfigUser.componentNameToReplaced) || "TComponent",
};
var pageTranslations = null;
var initializeTranslations = function (translations) {
  pageTranslations = translations;
};
var checkTypesAndReturn = function (type, value) {
  if (type === "string") {
    if (typeof value === "string") {
      return value;
    } else {
      return undefined;
    }
  } else if (type === "number") {
    if (typeof value === "number") {
      return value;
    } else {
      return undefined;
    }
  } else if (type === "array") {
    if (Array.isArray(value)) {
      return value;
    } else {
      return undefined;
    }
  } else if (type === "object") {
    if (typeof value === "object" && !Array.isArray(value) && value !== null) {
      return value;
    } else {
      return undefined;
    }
  } else {
    return value;
  }
};
var generateTranslationWithType = function (
  slug,
  translationsNamespace,
  namespace,
  type
) {
  if (!translationsNamespace) {
    console.log("next-translations - fail load namespace: ".concat(namespace));
    return undefined;
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
      console.log(
        "next-translations - Fail translation "
          .concat(namespace, ": ")
          .concat(slug)
      );
      return undefined;
    }
  }
  if (pathTranslationd === "".concat(namespace, ": ").concat(slug)) {
    return pathTranslationd;
  }
  if (type) {
    var validValue = checkTypesAndReturn(type, pathTranslationd);
    if (validValue !== undefined) {
      return validValue;
    } else {
      console.log(
        "next-translations - Fail type in translation "
          .concat(namespace, ": ")
          .concat(slug)
      );
      return undefined;
    }
  } else {
    return pathTranslationd;
  }
};
var useTranslation = function (namespace) {
  if (!pageTranslations) {
    return {
      t: function (slug) {
        console.log(
          "next-translations - Fail translation "
            .concat(namespace, ": ")
            .concat(slug)
        );
        return undefined;
      },
      tString: function (slug) {
        console.log(
          "next-translations - Fail translation "
            .concat(namespace, ": ")
            .concat(slug)
        );
        return undefined;
      },
      tNumber: function (slug) {
        console.log(
          "next-translations - Fail translation "
            .concat(namespace, ": ")
            .concat(slug)
        );
        return undefined;
      },
      tArray: function (slug) {
        console.log(
          "next-translations - Fail translation "
            .concat(namespace, ": ")
            .concat(slug)
        );
        return undefined;
      },
      tObject: function (slug) {
        console.log(
          "next-translations - Fail translation "
            .concat(namespace, ": ")
            .concat(slug)
        );
        return undefined;
      },
      tComponent: function (slug, callback) {
        console.log(
          "next-translations - Fail translation "
            .concat(namespace, ": ")
            .concat(slug)
        );
        return callback({
          textBefore: undefined,
          textComponent: undefined,
          textAfter: undefined,
        });
      },
    };
  }
  var translationsNamespace = pageTranslations[namespace];
  var t = function (slug) {
    if (slug === void 0) {
      slug = "";
    }
    return generateTranslationWithType(
      slug,
      translationsNamespace,
      namespace,
      "any"
    );
  };
  var tString = function (slug) {
    if (slug === void 0) {
      slug = "";
    }
    return generateTranslationWithType(
      slug,
      translationsNamespace,
      namespace,
      "string"
    );
  };
  var tNumber = function (slug) {
    if (slug === void 0) {
      slug = "";
    }
    return generateTranslationWithType(
      slug,
      translationsNamespace,
      namespace,
      "number"
    );
  };
  var tArray = function (slug) {
    if (slug === void 0) {
      slug = "";
    }
    return generateTranslationWithType(
      slug,
      translationsNamespace,
      namespace,
      "array"
    );
  };
  var tObject = function (slug) {
    if (slug === void 0) {
      slug = "";
    }
    return generateTranslationWithType(
      slug,
      translationsNamespace,
      namespace,
      "object"
    );
  };
  var tComponent = function (slug, callback) {
    if (slug === void 0) {
      slug = "";
    }
    var generatedText = generateTranslationWithType(
      slug,
      translationsNamespace,
      namespace,
      "string"
    );
    if (!generatedText) {
      return undefined;
    }
    var componentStartIndex = -1;
    var componentEndIndex = -1;
    var componentOnlyIndex = -1;
    var text = "";
    var textBefore = "";
    var textAfter = "";
    var textComponent = undefined;
    var generatedTextArray = generatedText.split(" ");
    generatedTextArray.forEach(function (itemText, indexText) {
      var isStartComponent =
        itemText === "<" + translationsConfig.componentNameToReplaced + ">";
      if (isStartComponent) {
        componentStartIndex = indexText;
        return;
      }
      var isEndComponent =
        itemText === "</" + translationsConfig.componentNameToReplaced + ">";
      if (isEndComponent) {
        componentEndIndex = indexText;
        return;
      }
      var isOnlyComponent =
        itemText === "<" + translationsConfig.componentNameToReplaced + "/>";
      if (isOnlyComponent) {
        componentOnlyIndex = indexText;
        return;
      }
    });
    generatedTextArray.forEach(function (itemText, indexText) {
      if (
        componentOnlyIndex === -1 &&
        componentStartIndex >= 0 &&
        componentEndIndex >= 0
      ) {
        if (indexText < componentStartIndex) {
          textBefore = ""
            .concat(textBefore ? textBefore + " " : "")
            .concat(itemText);
        } else if (
          indexText > componentStartIndex &&
          indexText < componentEndIndex
        ) {
          textComponent = ""
            .concat(textComponent ? textComponent + " " : "")
            .concat(itemText);
        } else if (indexText > componentEndIndex) {
          textAfter = ""
            .concat(textAfter ? textAfter + " " : "")
            .concat(itemText);
        }
      } else if (componentOnlyIndex >= 0) {
        if (indexText < componentOnlyIndex) {
          textBefore = ""
            .concat(textBefore ? textBefore + " " : "")
            .concat(itemText);
        } else if (indexText > componentOnlyIndex) {
          textAfter = ""
            .concat(textAfter ? textAfter + " " : "")
            .concat(itemText);
        }
      } else {
        text = "".concat(text ? text + " " : "").concat(itemText);
      }
    });
    return callback({
      textBefore: textBefore,
      textComponent: textComponent,
      textAfter: textAfter,
    });
  };
  return {
    t: t,
    tString: tString,
    tNumber: tNumber,
    tArray: tArray,
    tObject: tObject,
    tComponent: tComponent,
    pageTranslations: pageTranslations,
  };
};
// export {initializeTranslations, pageTranslations, useTranslation};
module.exports = {
  initializeTranslations: initializeTranslations,
  pageTranslations: pageTranslations,
  useTranslation: useTranslation,
};
