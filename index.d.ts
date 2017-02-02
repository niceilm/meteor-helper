import { Observable } from 'rxjs';
export declare class MeteorPubSub<T> {
    name: string;
    constructor(name: string);
    register(func: Function): void;
    registerComposite(config: PublishCompositeConfig<any> | PublishCompositeConfig<any>[] | ((...args: any[]) => PublishCompositeConfig<any> | PublishCompositeConfig<any>[])): void;
    subscribeObservable(...params: any[]): Observable<T>;
}
export declare class MeteorMethod<T> {
    name: string;
    private method;
    constructor(name: string);
    callObservable(params?: any): Observable<T>;
    register(methodOption: ValidatedMethodOption): void;
    call(methodArgs: any, callback?: ValidatedMethodCallback): any;
    _execute(context: any, methodArgs?: any): any;
}
