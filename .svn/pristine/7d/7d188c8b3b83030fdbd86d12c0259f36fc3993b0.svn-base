var exec = require('cordova/exec');

var GetAjaxRequest = function() {
};

GetAjaxRequest.get = function(url,callback) {
    exec(callback,null, "GetAjaxRequest", "get", [url]);
};
GetAjaxRequest.clear = function() {
    exec(null,null, "GetAjaxRequest", "clear", []);
};
GetAjaxRequest.setCookie = function(cookie,domain,callback) {
    exec(callback,null, "GetAjaxRequest", "setCookie", [cookie,domain]);
};

GetAjaxRequest.login = function(successCallback, errorCallback) {
    exec(successCallback, errorCallback, "GetAjaxRequest", "login", []);
};


module.exports = GetAjaxRequest;
