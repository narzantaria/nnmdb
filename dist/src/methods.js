"use strict";
/**
 * encryption using "one-time notebook" method
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneTimePadEncrypt = oneTimePadEncrypt;
exports.oneTimePadDecrypt = oneTimePadDecrypt;
exports.parseField = parseField;
exports.processRelation = processRelation;
exports.splitField = splitField;
exports.removeField = removeField;
exports.removeRelations = removeRelations;
exports.replaceInValues = replaceInValues;
exports.filterFields = filterFields;
const store_1 = require("./store");
function oneTimePadEncrypt(plainText, key) {
    let encryptedText = "";
    for (let i = 0; i < plainText.length; i++) {
        const charCode = plainText.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        encryptedText += String.fromCharCode(charCode);
    }
    return encryptedText;
}
function oneTimePadDecrypt(encryptedText, key) {
    let decryptedText = "";
    for (let i = 0; i < encryptedText.length; i++) {
        const charCode = encryptedText.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        decryptedText += String.fromCharCode(charCode);
    }
    return decryptedText;
}
// Detect field type, - single, array, object, relation
function parseField(arg) {
    if (!arg) {
        return;
    }
    try {
        if (arg.slice(0, 1) === "[" && arg.slice(-1) === "]") {
            return {
                data: arg.slice(1, arg.length - 1),
                type: "array",
            };
        }
        else if (arg.slice(0, 1) === "{" && arg.slice(-1) === "}") {
            return {
                data: arg.slice(1, arg.length - 1),
                type: "object",
            };
        }
        else if (processRelation(arg)) {
            //
            return {
                data: arg,
                type: "relation",
            };
        }
        else {
            return {
                data: arg,
                type: "single",
            };
        }
    }
    catch (error) {
        console.log(`parseField error: ${error}`);
        return;
    }
}
function processRelation(arg) {
    const result = {};
    const arr = arg.split(" ");
    if (arr.length <= 1) {
        return;
    }
    const operator = arr[0];
    const rel = arr[1];
    result.model = rel.slice(2, rel.length - 1);
    if (operator.slice(0, 1) === "|") {
        result.level = "host";
        result.operator = operator.slice(1, operator.length);
    }
    else if (operator.slice(-1) === "|") {
        result.level = "recipient";
        result.operator = operator.slice(0, operator.length - 1);
    }
    else {
        result.level = "bi";
        result.operator = operator;
    }
    return result;
}
// Split by first separator
function splitField(str, separator) {
    const index = str.indexOf(separator);
    if (index === -1) {
        return [str];
    }
    const firstPart = str.substring(0, index);
    const secondPart = str.substring(index + separator.length);
    return [firstPart, secondPart];
}
// Remove field from object
function removeField(obj, field) {
    if (Object.prototype.hasOwnProperty.call(obj, field)) {
        const newObj = { ...obj };
        delete newObj[field];
        return newObj;
    }
    return obj;
}
// Remove all relation fields
function removeRelations(modelName, obj) {
    const model = store_1.store.get("models")[modelName];
    const keys = Object.keys(obj);
    for (let x = 0; x < keys.length; x++) {
        const key = keys[x];
        const field = parseField(model[key]);
        if (field?.type === "relation") {
            obj = removeField(obj, key);
        }
    }
    return obj;
}
function replaceInValues(values, source, replace) {
    const keys = Object.keys(values);
    for (let x = 0; x < keys.length; x++) {
        const key = keys[x];
        values[key] = values[key].replaceAll(source, replace);
    }
    return values;
}
function filterFields(data, fields) {
    if (!fields || fields.length === 0) {
        return data;
    }
    else {
        return data.map(item => {
            const newItem = {};
            fields.forEach(field => {
                if (item.hasOwnProperty(field)) {
                    newItem[field] = item[field];
                }
            });
            return newItem;
        });
    }
}
