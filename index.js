var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = {next: verb(0), throw: verb(1), return: verb(2)}),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return {value: op[1], done: false};
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return {value: op[0] ? op[1] : void 0, done: true};
    }
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
var _this = this;
// import fse from "fs-extra";
// import path from "path";
// //@ts-ignore
// import translationsConfigUser from "../../translations.config.ts";
var fse = require("fs-extra");
var path = require("path");
var translationsConfigUser = require("../../translations.config.js");
var translationsConfig = {
  defaultLocale:
    (translationsConfigUser === null || translationsConfigUser === void 0
      ? void 0
      : translationsConfigUser.defaultLocale) || "en",
  locales: (translationsConfigUser === null || translationsConfigUser === void 0
    ? void 0
    : translationsConfigUser.locales) || ["en"],
  outputFolderTranslations:
    (translationsConfigUser === null || translationsConfigUser === void 0
      ? void 0
      : translationsConfigUser.outputFolderTranslations) || "/public/locales",
  languageWithoutMultirouting:
    (translationsConfigUser === null || translationsConfigUser === void 0
      ? void 0
      : translationsConfigUser.languageWithoutMultirouting) || undefined,
  constNamespaces: (translationsConfigUser === null ||
  translationsConfigUser === void 0
    ? void 0
    : translationsConfigUser.constNamespaces) || ["common"],
};
var allTranslationsLanguages = translationsConfig.locales;
var getTranslationsFromFiles = function (locale, ns) {
  if (locale === void 0) {
    locale = translationsConfig.defaultLocale;
  }
  if (ns === void 0) {
    ns = [];
  }
  return __awaiter(_this, void 0, void 0, function () {
    var translations,
      _i,
      ns_1,
      namespace,
      folderPath,
      exists,
      translationsJson,
      err_1;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          translations = {};
          _b.label = 1;
        case 1:
          _b.trys.push([1, 8, , 9]);
          (_i = 0), (ns_1 = ns);
          _b.label = 2;
        case 2:
          if (!(_i < ns_1.length)) return [3 /*break*/, 7];
          namespace = ns_1[_i];
          folderPath = "../.."
            .concat(translationsConfig.outputFolderTranslations, "/")
            .concat(locale, "/")
            .concat(namespace, ".json");
          return [
            4 /*yield*/,
            fse.pathExists(path.resolve(__dirname, folderPath)),
          ];
        case 3:
          exists = _b.sent();
          if (!exists) return [3 /*break*/, 5];
          return [
            4 /*yield*/,
            fse.readJson(path.resolve(__dirname, folderPath)),
          ];
        case 4:
          translationsJson = _b.sent();
          if (translationsJson) {
            translations = __assign(
              __assign({}, translations),
              ((_a = {}), (_a[namespace] = translationsJson), _a)
            );
          }
          return [3 /*break*/, 6];
        case 5:
          console.error("Path not found!!!");
          _b.label = 6;
        case 6:
          _i++;
          return [3 /*break*/, 2];
        case 7:
          return [2 /*return*/, {translations: translations}];
        case 8:
          err_1 = _b.sent();
          console.error(err_1);
          return [3 /*break*/, 9];
        case 9:
          return [2 /*return*/];
      }
    });
  });
};
function getTranslationsProps(ctx, ns) {
  var _a;
  if (ns === void 0) {
    ns = [];
  }
  return __awaiter(this, void 0, void 0, function () {
    var locale, defaultNamespacesToUseInAllPages, props, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          locale = translationsConfig.defaultLocale;
          if (
            (_a = ctx === null || ctx === void 0 ? void 0 : ctx.params) ===
              null || _a === void 0
              ? void 0
              : _a.locale
          ) {
            locale = ctx.params.locale;
          }
          defaultNamespacesToUseInAllPages = translationsConfig.constNamespaces;
          _b = [{}];
          return [
            4 /*yield*/,
            getTranslationsFromFiles(
              locale,
              __spreadArray(
                __spreadArray([], ns, true),
                defaultNamespacesToUseInAllPages,
                true
              )
            ),
          ];
        case 1:
          props = __assign.apply(void 0, _b.concat([_c.sent()]));
          return [2 /*return*/, props];
      }
    });
  });
}
var getPaths = function () {
  return allTranslationsLanguages
    .filter(function (item) {
      return item !== translationsConfig.languageWithoutMultirouting;
    })
    .map(function (lng) {
      return {
        params: {
          locale: lng,
        },
      };
    });
};
var getStaticPaths = function () {
  return {
    fallback: false,
    paths: getPaths(),
  };
};
module.exports = {
  allTranslationsLanguages: allTranslationsLanguages,
  getTranslationsProps: getTranslationsProps,
  getPaths: getPaths,
  getStaticPaths: getStaticPaths,
};
// export {
//   allTranslationsLanguages,
//   getTranslationsProps,
//   getPaths,
//   getStaticPaths,
// };
