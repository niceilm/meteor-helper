"use strict";
var meteor_1 = require("meteor/meteor");
var check_1 = require("meteor/check");
var mdg_validated_method_1 = require("meteor/mdg:validated-method");
var meteor_rxjs_1 = require("meteor-rxjs");
var MeteorPubSub = (function () {
    function MeteorPubSub(name) {
        this.name = name;
    }
    MeteorPubSub.prototype.register = function (func) {
        var publishName = this.name;
        meteor_1.Meteor.publish(publishName, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            check_1.check(args, check_1.Match.Any);
            console.log("publish - " + publishName + " " + this.userId + " " + JSON.stringify(args));
            return func.apply(this, args);
        });
    };
    MeteorPubSub.prototype.registerComposite = function (config) {
        var publishName = this.name;
        //noinspection TypeScriptValidateTypes
        meteor_1.Meteor.publishComposite(publishName, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            check_1.check(args, check_1.Match.Any);
            console.log("publish - " + publishName + " " + this.userId + " " + JSON.stringify(args));
            if (check_1.Match.test(config, Function)) {
                var configF = config;
                return configF.apply(this, args);
            }
            else {
                return config;
            }
        });
    };
    MeteorPubSub.prototype.subscribeObservable = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        return meteor_rxjs_1.MeteorObservable.subscribe.apply(meteor_rxjs_1.MeteorObservable, [this.name].concat(params));
    };
    return MeteorPubSub;
}());
exports.MeteorPubSub = MeteorPubSub;
var MeteorMethod = (function () {
    function MeteorMethod(name) {
        this.name = name;
    }
    MeteorMethod.prototype.callObservable = function (params) {
        if (params === void 0) { params = {}; }
        return meteor_rxjs_1.MeteorObservable.call(this.name, params);
    };
    MeteorMethod.prototype.register = function (methodOption) {
        if (this.method) {
            return;
        }
        methodOption.name = this.name;
        var run = methodOption.run;
        methodOption.run = function (args) {
            console.log("method - " + methodOption.name + " " + this.userId + " " + JSON.stringify(args));
            return run.call.apply(run, [this].concat(args));
        };
        this.method = new mdg_validated_method_1.ValidatedMethod(methodOption);
    };
    MeteorMethod.prototype.call = function (methodArgs, callback) {
        if (this.method) {
            return this.method.call(methodArgs, callback);
        }
        return meteor_1.Meteor.call(this.name, methodArgs, callback);
    };
    MeteorMethod.prototype._execute = function (context, methodArgs) {
        return this.method._execute(context, methodArgs);
    };
    return MeteorMethod;
}());
exports.MeteorMethod = MeteorMethod;
//# sourceMappingURL=index.js.map