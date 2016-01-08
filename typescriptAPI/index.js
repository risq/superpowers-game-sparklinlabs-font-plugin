/// <reference path="../../typescript/typescriptAPI/TypeScriptAPIPlugin.d.ts" />
var fs = require("fs");
SupCore.system.registerPlugin("typescriptAPI", "Sup.Font", {
    code: fs.readFileSync(__dirname + "/Sup.Font.ts.txt", { encoding: "utf8" }),
    defs: fs.readFileSync(__dirname + "/Sup.Font.d.ts.txt", { encoding: "utf8" }),
});
SupCore.system.registerPlugin("typescriptAPI", "TextRenderer", {
    code: fs.readFileSync(__dirname + "/Sup.TextRenderer.ts.txt", { encoding: "utf8" }),
    defs: fs.readFileSync(__dirname + "/Sup.TextRenderer.d.ts.txt", { encoding: "utf8" }),
    exposeActorComponent: { propertyName: "textRenderer", className: "Sup.TextRenderer" }
});
