(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var TextRendererEditor_1 = require("./TextRendererEditor");
SupClient.registerPlugin("componentEditors", "TextRenderer", TextRendererEditor_1.default);

},{"./TextRendererEditor":2}],2:[function(require,module,exports){
var TextRendererEditor = (function () {
    function TextRendererEditor(tbody, config, projectClient, editConfig) {
        var _this = this;
        this.fields = {};
        this.pendingModification = 0;
        this.onChangeFontAsset = function (event) {
            if (event.target.value === "")
                _this.editConfig("setProperty", "fontAssetId", null);
            else {
                var entry = SupClient.findEntryByPath(_this.projectClient.entries.pub, event.target.value);
                if (entry != null && entry.type === "font")
                    _this.editConfig("setProperty", "fontAssetId", entry.id);
            }
        };
        this.tbody = tbody;
        this.editConfig = editConfig;
        this.projectClient = projectClient;
        this.fontAssetId = config.fontAssetId;
        this.color = config.color;
        this.size = config.size;
        var fontRow = SupClient.table.appendRow(tbody, SupClient.i18n.t("componentEditors:TextRenderer.font"));
        var fontFields = SupClient.table.appendAssetField(fontRow.valueCell, "");
        this.fields["fontAssetId"] = fontFields.textField;
        this.fields["fontAssetId"].addEventListener("input", this.onChangeFontAsset);
        this.fontButtonElt = fontFields.buttonElt;
        this.fontButtonElt.addEventListener("click", function (event) {
            window.parent.postMessage({ type: "openEntry", id: _this.fontAssetId }, window.location.origin);
        });
        this.fontButtonElt.disabled = this.fontAssetId == null;
        var textRow = SupClient.table.appendRow(tbody, SupClient.i18n.t("componentEditors:TextRenderer.text"));
        this.fields["text"] = SupClient.table.appendTextAreaField(textRow.valueCell, config.text);
        this.fields["text"].addEventListener("input", function (event) {
            _this.pendingModification += 1;
            _this.editConfig("setProperty", "text", event.target.value, function (err) {
                _this.pendingModification -= 1;
                if (err != null) {
                    new SupClient.dialogs.InfoDialog(err, SupClient.i18n.t("common:actions.close"));
                    return;
                }
            });
        });
        var alignmentRow = SupClient.table.appendRow(tbody, SupClient.i18n.t("componentEditors:TextRenderer.align.title"));
        var alignmentOptions = {
            "left": SupClient.i18n.t("componentEditors:TextRenderer.align.left"),
            "center": SupClient.i18n.t("componentEditors:TextRenderer.align.center"),
            "right": SupClient.i18n.t("componentEditors:TextRenderer.align.right")
        };
        this.fields["alignment"] = SupClient.table.appendSelectBox(alignmentRow.valueCell, alignmentOptions, config.alignment);
        this.fields["alignment"].addEventListener("change", function (event) { _this.editConfig("setProperty", "alignment", event.target.value); });
        var verticalAlignmentRow = SupClient.table.appendRow(tbody, SupClient.i18n.t("componentEditors:TextRenderer.verticalAlign.title"));
        var verticalAlignmentOptions = {
            "top": SupClient.i18n.t("componentEditors:TextRenderer.verticalAlign.top"),
            "center": SupClient.i18n.t("componentEditors:TextRenderer.verticalAlign.center"),
            "bottom": SupClient.i18n.t("componentEditors:TextRenderer.verticalAlign.bottom")
        };
        this.fields["verticalAlignment"] = SupClient.table.appendSelectBox(verticalAlignmentRow.valueCell, verticalAlignmentOptions, config.verticalAlignment);
        this.fields["verticalAlignment"].addEventListener("change", function (event) { _this.editConfig("setProperty", "verticalAlignment", event.target.value); });
        var colorRow = SupClient.table.appendRow(tbody, SupClient.i18n.t("componentEditors:TextRenderer.color"), { checkbox: true });
        this.colorCheckbox = colorRow.checkbox;
        this.colorCheckbox.addEventListener("change", function (event) {
            var color = _this.colorCheckbox.checked ? (_this.fontAsset != null ? _this.fontAsset.pub.color : "ffffff") : null;
            _this.editConfig("setProperty", "color", color);
        });
        var colorInputs = SupClient.table.appendColorField(colorRow.valueCell, "");
        this.fields["color"] = colorInputs.textField;
        this.fields["color"].addEventListener("input", function (event) {
            if (event.target.value.length !== 6)
                return;
            _this.editConfig("setProperty", "color", event.target.value);
        });
        this.colorPicker = colorInputs.pickerField;
        this.colorPicker.addEventListener("change", function (event) {
            _this.editConfig("setProperty", "color", event.target.value.slice(1));
        });
        this.updateColorField();
        var sizeRow = SupClient.table.appendRow(tbody, SupClient.i18n.t("componentEditors:TextRenderer.size"), { checkbox: true });
        this.sizeRow = sizeRow.row;
        this.sizeCheckbox = sizeRow.checkbox;
        this.sizeCheckbox.addEventListener("change", function (event) {
            var size = _this.sizeCheckbox.checked ? (_this.fontAsset != null ? _this.fontAsset.pub.size : 16) : null;
            _this.editConfig("setProperty", "size", size);
        });
        this.fields["size"] = SupClient.table.appendNumberField(sizeRow.valueCell, "", { min: 0 });
        this.fields["size"].addEventListener("input", function (event) {
            if (event.target.value === "")
                return;
            _this.editConfig("setProperty", "size", parseInt(event.target.value, 10));
        });
        this.updateSizeField();
        this.projectClient.subEntries(this);
    }
    TextRendererEditor.prototype.destroy = function () { this.projectClient.unsubEntries(this); };
    TextRendererEditor.prototype.config_setProperty = function (path, value) {
        if (path === "fontAssetId") {
            if (this.fontAssetId != null) {
                this.projectClient.unsubAsset(this.fontAssetId, this);
                this.fontAsset = null;
            }
            this.fontAssetId = value;
            this.fontButtonElt.disabled = this.fontAssetId == null;
            this.updateColorField();
            if (this.fontAssetId != null) {
                this.fields["fontAssetId"].value = this.projectClient.entries.getPathFromId(value);
                this.projectClient.subAsset(this.fontAssetId, "font", this);
            }
            else
                this.fields["fontAssetId"].value = "";
        }
        else if (path === "color") {
            this.color = value;
            this.updateColorField();
        }
        else if (path === "size") {
            this.size = value;
            this.updateSizeField();
        }
        else if (path === "text") {
            if (this.pendingModification === 0)
                this.fields["text"].value = value;
        }
        else
            this.fields[path].value = value;
    };
    TextRendererEditor.prototype.updateColorField = function () {
        var color = this.color != null ? this.color : (this.fontAsset != null ? this.fontAsset.pub.color : "");
        this.fields["color"].value = color;
        this.colorPicker.value = (color !== "") ? "#" + color : "#000000";
        this.colorCheckbox.checked = this.color != null;
        this.fields["color"].disabled = this.color == null;
        this.colorPicker.disabled = this.color == null;
    };
    TextRendererEditor.prototype.updateSizeField = function () {
        if (this.fontAsset != null && this.fontAsset.pub.isBitmap) {
            this.sizeRow.hidden = true;
            return;
        }
        else
            this.sizeRow.hidden = false;
        var size = this.size != null ? this.size : (this.fontAsset != null ? this.fontAsset.pub.size : "");
        this.fields["size"].value = size;
        this.sizeCheckbox.checked = this.size != null;
        this.fields["size"].disabled = this.size == null;
    };
    // Network callbacks
    TextRendererEditor.prototype.onEntriesReceived = function (entries) {
        if (entries.byId[this.fontAssetId] != null) {
            this.fields["fontAssetId"].value = entries.getPathFromId(this.fontAssetId);
            this.projectClient.subAsset(this.fontAssetId, "sprite", this);
        }
    };
    TextRendererEditor.prototype.onEntryAdded = function (entry, parentId, index) { };
    TextRendererEditor.prototype.onEntryMoved = function (id, parentId, index) {
        if (id === this.fontAssetId)
            this.fields["fontAssetId"].value = this.projectClient.entries.getPathFromId(this.fontAssetId);
    };
    TextRendererEditor.prototype.onSetEntryProperty = function (id, key, value) {
        if (id === this.fontAssetId)
            this.fields["fontAssetId"].value = this.projectClient.entries.getPathFromId(this.fontAssetId);
    };
    TextRendererEditor.prototype.onEntryTrashed = function (id) { };
    TextRendererEditor.prototype.onAssetReceived = function (assetId, asset) {
        this.fontAsset = asset;
        this.updateColorField();
        this.updateSizeField();
    };
    TextRendererEditor.prototype.onAssetEdited = function (assetId, command) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (command !== "setProperty")
            return;
        if (command === "setProperty" && args[0] === "color")
            this.updateColorField();
        if (command === "setProperty" && (args[0] === "size" || args[0] === "isBitmap"))
            this.updateSizeField();
    };
    TextRendererEditor.prototype.onAssetTrashed = function (assetId) {
        this.fontAsset = null;
        this.fields["fontAssetId"].value = "";
        this.updateColorField();
        this.updateSizeField();
    };
    return TextRendererEditor;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TextRendererEditor;

},{}]},{},[1]);
