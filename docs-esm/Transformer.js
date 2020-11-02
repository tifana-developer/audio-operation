var Transformer = (function () {
    function Transformer() {
    }
    Transformer.prototype.blob2ObjectURL = function (blobData) {
        var URL = window.URL || window.webkitURL;
        return URL.createObjectURL(blobData);
    };
    Transformer.prototype.binaryString2dataURL = function (binaryString, type) {
        if (type === void 0) { type = 'application/octet-stream'; }
        return "data:" + type + "," + btoa(binaryString);
    };
    Transformer.prototype.dataURL2binaryString = function (dataURL) {
        var str = dataURL.split(',');
        return {
            binaryString: atob(str[1]),
            type: str[0].replace(/(data:|;base64)/gi, '')
        };
    };
    Transformer.prototype.toBlob = function (data, type) {
        if (type === void 0) { type = 'application/octet-stream'; }
        return new Blob([data], { type: type });
    };
    Transformer.prototype.dataURL2Blob = function (dataURL) {
        var _a = this.dataURL2binaryString(dataURL), binaryString = _a.binaryString, type = _a.type;
        return this.toBlob(binaryString, type);
    };
    Transformer.prototype._readerPromise = function (reader) {
        return new Promise(function (resolve, reject) {
            reader.onloadend = function () { return resolve(reader.result); };
            reader.onerror = function () { return reject(reader.error); };
        });
    };
    Transformer.prototype.blob2ArrayBuffer = function (blobData) {
        var reader = new FileReader();
        reader.readAsArrayBuffer(blobData);
        return this._readerPromise(reader);
    };
    Transformer.prototype.blob2BinaryString = function (blobData) {
        var reader = new FileReader();
        reader.readAsBinaryString(blobData);
        return this._readerPromise(reader);
    };
    Transformer.prototype.blob2DataURL = function (blobData) {
        var reader = new FileReader();
        reader.readAsDataURL(blobData);
        return this._readerPromise(reader);
    };
    Transformer.prototype.blob2Text = function (blobData) {
        var reader = new FileReader();
        reader.readAsText(blobData);
        return this._readerPromise(reader);
    };
    return Transformer;
}());
export { Transformer };
export var transformer = new Transformer();
export default transformer;
//# sourceMappingURL=Transformer.js.map