"use strict";
const meteor_1 = require("meteor/meteor");
const check_1 = require("meteor/check");
const mdg_validated_method_1 = require("meteor/mdg:validated-method");
const meteor_rxjs_1 = require("meteor-rxjs");
class MeteorPubSub {
    constructor(name) {
        this.name = name;
    }
    register(func) {
        const publishName = this.name;
        meteor_1.Meteor.publish(publishName, function (...args) {
            check_1.check(args, check_1.Match.Any);
            console.log(`publish - ${publishName} ${this.userId} ${JSON.stringify(args)}`);
            return func.apply(this, args);
        });
    }
    registerComposite(config) {
        const publishName = this.name;
        //noinspection TypeScriptValidateTypes
        meteor_1.Meteor.publishComposite(publishName, function (...args) {
            check_1.check(args, check_1.Match.Any);
            console.log(`publish - ${publishName} ${this.userId} ${JSON.stringify(args)}`);
            if (check_1.Match.test(config, Function)) {
                const configF = config;
                return configF.apply(this, args);
            }
            else {
                return config;
            }
        });
    }
    subscribeObservable(...params) {
        return meteor_rxjs_1.MeteorObservable.subscribe(this.name, ...params);
    }
}
exports.MeteorPubSub = MeteorPubSub;
class MeteorMethod {
    constructor(name) {
        this.name = name;
    }
    callObservable(params = {}) {
        return meteor_rxjs_1.MeteorObservable.call(this.name, params);
    }
    register(methodOption) {
        if (this.method) {
            return;
        }
        methodOption.name = this.name;
        const run = methodOption.run;
        methodOption.run = function (args) {
            console.log(`method - ${methodOption.name} ${this.userId} ${JSON.stringify(args)}`);
            return run.call(this, ...args);
        };
        this.method = new mdg_validated_method_1.ValidatedMethod(methodOption);
    }
    call(methodArgs, callback) {
        if (this.method) {
            return this.method.call(methodArgs, callback);
        }
        return meteor_1.Meteor.call(this.name, methodArgs, callback);
    }
    _execute(context, methodArgs) {
        return this.method._execute(context, methodArgs);
    }
}
exports.MeteorMethod = MeteorMethod;
//# sourceMappingURL=index.js.map