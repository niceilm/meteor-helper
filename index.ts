import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs';

export class MeteorPubSub<T> {
  constructor(public name: string) {
  }

  register(func: Function): void {
    const publishName = this.name;
    Meteor.publish(publishName, function (...args) {
      check(args, Match.Any);
      console.log(`publish - ${publishName} ${this.userId} ${JSON.stringify(args)}`);

      return func.apply(this, args);
    });
  }

  registerComposite(config: PublishCompositeConfig<any> | PublishCompositeConfig<any>[] | ((...args: any[]) => PublishCompositeConfig<any> | PublishCompositeConfig<any>[])): void {
    const publishName = this.name;
    //noinspection TypeScriptValidateTypes
    Meteor.publishComposite(publishName, function (...args) {
      check(args, Match.Any);
      console.log(`publish - ${publishName} ${this.userId} ${JSON.stringify(args)}`);
      if (Match.test(config, Function)) {
        const configF = <Function> config;
        return configF.apply(this, args);
      } else {
        return config;
      }
    });
  }

  subscribeObservable(...params: any[]): Observable<T> {
    return MeteorObservable.subscribe<T>(this.name, ...params);
  }
}

export class MeteorMethod<T> {
  private method: ValidatedMethod;

  constructor(public name: string) {
  }

  callObservable(params: any = {}): Observable<T> {
    return MeteorObservable.call<T>(this.name, params);
  }

  register(methodOption: ValidatedMethodOption) {
    if (this.method) {
      return;
    }
    methodOption.name = this.name;
    const run = methodOption.run;
    methodOption.run = function (args) {
      console.log(`method - ${methodOption.name} ${this.userId} ${JSON.stringify(args)}`);
      return run.call(this, ...args);
    };
    this.method = new ValidatedMethod(methodOption);
  }

  call(methodArgs: any, callback?: ValidatedMethodCallback): any {
    if (this.method) {
      return this.method.call(methodArgs, callback);
    }
    return Meteor.call(this.name, methodArgs, callback);
  }

  _execute(context: any, methodArgs?: any): any {
    return this.method._execute(context, methodArgs);
  }
}