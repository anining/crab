import * as U from 'karet.util';
import asyncStorage from './asyncStorage';
import { DEFAULT_USER } from './data';
import { setGlobal } from '../global/global';

const localStore = {
    user: DEFAULT_USER,
    app: null,
    authorization: null,
    channel: 'default',
    banner: null,
    gradeSetting: null,
    gradeRange: null,
    nextRedLevel: null,
    highPerformance: false, // 高性能模式默认关闭
    authorizationList: null, // 授权登录列表，不用重复调用一键登录产生费用
};
const store = U.atom(localStore);

function setter (items = [], storage = false) {
    items.forEach(item => {
        try {
            U.set(U.view([item[0]], store), item[1]);
            setGlobal(item[0], item[1]);
            storage && asyncStorage.setItem(item[0], JSON.stringify(item[1]));
        } catch (e) {
        }
    });
}

function getter (items = []) {
    const object = {};
    items.forEach(item => {
        const local = [...item.split('.')];
        const pop = [...local].pop();
        object[pop] = U.view(local, store);
    });
    return object;
}

function clear () {
    asyncStorage.clear();
    setter([
        ['user', DEFAULT_USER],
        ['authorization', null],
    ]);
}

export { store, setter, getter, clear };
