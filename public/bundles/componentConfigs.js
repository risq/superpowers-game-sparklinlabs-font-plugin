(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="../../scene/ComponentConfig.d.ts" />
var TextRendererConfig_1 = require("./TextRendererConfig");
SupCore.system.registerPlugin("componentConfigs", "TextRenderer", TextRendererConfig_1.default);

},{"./TextRendererConfig":2}],2:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TextRendererConfig = (function (_super) {
    __extends(TextRendererConfig, _super);
    function TextRendererConfig(pub) {
        // NOTE: Legacy stuff from Superpowers 0.7
        if (pub.color != null && pub.color.length !== 6)
            pub.color = "ffffff";
        // NOTE: Migration from old "align" property
        if (pub.align != null) {
            pub.alignment = pub.align;
            delete pub.align;
        }
        if (pub.verticalAlignment == null)
            pub.verticalAlignment = "center";
        _super.call(this, pub, TextRendererConfig.schema);
    }
    TextRendererConfig.create = function () {
        var emptyConfig = {
            fontAssetId: null,
            text: "Text",
            alignment: "center",
            size: null,
            color: null
        };
        return emptyConfig;
    };
    TextRendererConfig.prototype.restore = function () { if (this.pub.fontAssetId != null)
        this.emit("addDependencies", [this.pub.fontAssetId]); };
    TextRendererConfig.prototype.destroy = function () { if (this.pub.fontAssetId != null)
        this.emit("removeDependencies", [this.pub.fontAssetId]); };
    TextRendererConfig.prototype.setProperty = function (path, value, callback) {
        var _this = this;
        var oldDepId;
        if (path === "fontAssetId")
            oldDepId = this.pub[path];
        _super.prototype.setProperty.call(this, path, value, function (err, actualValue) {
            if (err != null) {
                callback(err);
                return;
            }
            if (path === "fontAssetId") {
                if (oldDepId != null)
                    _this.emit("removeDependencies", [oldDepId]);
                if (actualValue != null)
                    _this.emit("addDependencies", [actualValue]);
            }
            callback(null, actualValue);
        });
    };
    TextRendererConfig.schema = {
        fontAssetId: { type: "string?", min: 0, mutable: true },
        text: { type: "string", min: 0, mutable: true },
        alignment: { type: "enum", items: ["left", "center", "right"], mutable: true },
        verticalAlignment: { type: "enum", items: ["top", "center", "bottom"], mutable: true },
        size: { type: "integer?", min: 0, mutable: true },
        color: { type: "string?", length: 6, mutable: true }
    };
    return TextRendererConfig;
})(SupCore.Data.Base.ComponentConfig);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TextRendererConfig;

},{}]},{},[1]);
