import {
    activity,
    app,
    banner,
    getSecondIncome,
    getTask,
    gradeSetting,
    taskReceiveDetail,
    signConfig,
    taskPlatform,
    user,
    getNextRedLevel,
    account, withdrawLogsLatest, activityDetail,
} from './api';
import { _tc, _toFixed, rangeLevel, toGoldCoin, transformMoney } from './util';
import { getter, setter } from './store';
import { getGlobal, getPath } from '../global/global';
import asyncStorage from './asyncStorage';

import toast from './toast';
import { N } from './router';
import android from '../components/Android';
let nextUpdateUserTime = null; // 下一次更新用户的时间
let nextUpdateSecondIncomeTime = null; // 下一次获取每秒奖励的时间
const updateUserRate = 5;
const updateSecondIncomeRate = 30;// 每秒奖励间隔
export const updateUser = (callback) => {
    return new Promise((resolve, reject) => {
        if (!nextUpdateUserTime || (nextUpdateUserTime <= +new Date())) {
            nextUpdateUserTime = +new Date() + 1000 * updateUserRate; // updateUserRate秒之内不允许更新user
            user().then(res => _tc(() => {
                resolve();
                if (!res.error && res.data) {
                    const userInfo = formatUserInfo(res.data);
                    setter([['user', userInfo]], true);
                    callback && callback();
                    // 每一次用户更新都去看是否为新用户，记录到已登录的记录列表里面
                    addAuthorizationList(userInfo);
                }
            }));
        } else {
            resolve();
            callback && callback();
        }
    });
};

function addAuthorizationList (userInfo) {
    try {
        const authorization = getGlobal('authorization');
        const authorizationList = getGlobal('authorizationList');
        console.log(authorization, userInfo.phone, userInfo.avatar, userInfo.nickname, '====判断是否加入新列表用户');
        if (!authorizationList || !(userInfo.phone in authorizationList)) {
            const newObjAuthorizationList = Object.entries({
                [userInfo.phone]: {
                    phone: userInfo.phone,
                    avatar: userInfo.avatar,
                    nickname: userInfo.nickname,
                    authorization: authorization,
                },
                ...authorizationList,
            });
            (newObjAuthorizationList.length > 3) && (newObjAuthorizationList.length = 3);
            setter([['authorizationList', Object.fromEntries(newObjAuthorizationList)]], true);
        } else {
            console.log('已存在该账号', 'addAuthorizationList', authorization, userInfo.phone, userInfo.avatar, userInfo.nickname, '====判断是否加入新列表用户');
        }
    } catch (e) {
        console.log(e, 'addAuthorizationList');
    }
}
export function updateSecondIncome () {
    return new Promise((resolve, reject) => {
        if (!nextUpdateSecondIncomeTime || (nextUpdateSecondIncomeTime <= +new Date())) {
            nextUpdateSecondIncomeTime = +new Date() + 1000 * updateSecondIncomeRate; // updateSecondIncomeRate秒之内不允许获取每秒奖励
            getSecondIncome().then(res => {
                resolve();
                const coin = getPath(['data', 'balance'], res);
                const addCoin = getPath(['data', 'add_balance'], res);
                if (coin && addCoin) {
                    asyncStorage.setItem(`${getPath(['phone'], getGlobal('user'))}coin`, {
                        coin: toGoldCoin(coin),
                        time: +new Date(),
                        mastUpdate: true
                    });
                }
            });
        } else {
            resolve();
        }
    });
}
export const updateAccount = (callback) => {
    return new Promise((resolve, reject) => {
        account().then(r => {
            resolve();
            !r.error && setter([['accounts', r.data]], true);
            callback && callback();
        });
    });
};
function formatUserInfo (data) {
    try {
        const { gradeSetting, gradeRange } = getter(['gradeSetting', 'gradeRange']);
        const gradeSettingObj = gradeSetting.get() || {};
        const { balance, today_income, total_income } = data;
        data.today_income = transformMoney(today_income);
        data.total_income = transformMoney(total_income);
        data.goldCoin = toGoldCoin(data.balance); // 0.01 * 1000
        data.balance = transformMoney(balance);
        const propNums = data.prop_nums || [];
        const propNumsObj = {};
        propNums.forEach(item => {
            propNumsObj[item.prop__prop_type] = item.count;
        });
        data.trCorrectRate = _toFixed(data.correct_rate * 100) + '%';
        data.propNumsObj = propNumsObj;
        data.myGradeLevel = rangeLevel(getPath(['user_level', 'level_num'], data, 1), gradeRange.get());
        data.myGrade = gradeSettingObj[data.myGradeLevel];
        return data;
    } catch (e) {
        return data;
    }
}
export const updateApp = () => {
    return new Promise((resolve, reject) => {
        app().then(res => _tc(() => {
            resolve();
            if (!res.error && res.data) {
                console.log(res, 'app');
                setter([['app', formatAppInfo(res.data)]], true);
            }
        }));
    });
};
function formatAppInfo (appInfo) {
    try {
        if (appInfo.config) {
            const configObj = {};
            for (const i in appInfo.config) {
                const item = appInfo.config[i];
                configObj[item.key] = item;
            }
            appInfo.configObj = configObj;
        }
        return appInfo;
    } catch (e) {
        return appInfo;
    }
}

export const updateBanner = () => {
    return new Promise((resolve, reject) => {
        banner().then(res => _tc(() => {
            resolve();
            if (!res.error && res.data) {
                console.log(res, 'banner');
                setter([['banner', res.data]], true);
            }
        }));
    });
};
export const updateActivity = () => {
    return new Promise((resolve, reject) => {
        activity().then(res => _tc(() => {
            resolve();
            if (!res.error && res.data) {
                console.log(res, 'activity');
                setter([['activity', res.data]]);
                setter([['activityObj', formatActivity(res.data)]], true);
            }
        }));
    });
};
function formatActivity (list) {
    try {
        const obj = {};
        list.forEach((item) => {
            obj[item.category] = item;
        });
        return obj;
    } catch (e) {
        return {};
    }
}
export const getSignConfig = () => {
    return new Promise((resolve, reject) => {
        signConfig().then(res => _tc(() => {
            resolve();
            if (!res.error && res.data) {
                console.log(res, 'signConfig');
                setter([['signConfig', formatSignConfig(res.data)]], true);
            }
        }));
    });
};
function formatSignConfig (config) {
    try {
        const obj = {};
        config.forEach((item) => {
            obj[item.day] = item;
        });
        return obj;
    } catch (e) {
        return {};
    }
}
export const getTaskPlatform = () => {
    return new Promise((resolve, reject) => {
        taskPlatform().then(res => _tc(() => {
            console.log(res, 'taskPlatform');
            resolve();
            if (!res.error && res.data) {
                setter([['taskPlatform', (res.data)]], true);
            }
        }));
    });
};
function taskDetail (receive_task_id) {
    taskReceiveDetail(receive_task_id).then(r => {
        if (r.error) {
            toast(r.msg || '当前摸鱼夺宝人数过多,稍后再试');
        } else {
            const { data: detail } = r;
            N.navigate('TaskDetailPage', { detail, account: undefined });
        }
    });
}
export function task (category, receive_task_id) {
    if (category) {
        getTask(category).then(r => {
            if (r.error) {
                toast(r.msg || '当前摸鱼夺宝人数过多,稍后再试');
                error === 9 && N.navigate('AccountHomePage');
            } else {
                taskDetail(r.data.receive_task_id);
            }
        });
    } else {
        taskDetail(receive_task_id);
    }
}
export const getGradeSetting = () => {
    return new Promise((resolve, reject) => {
        gradeSetting().then(res => _tc(() => {
            console.log(res, 'getGradeSetting');
            resolve();
            if (!res.error && res.data) {
                setter([['gradeSetting', (formatGrade(res.data))]], true);
                setter([['gradeRange', (formatGradeRange(res.data))]], true);
            }
        }));
    });
};
function formatGrade (array) {
    try {
        const gradeObj = {};
        let baseIncome = null;
        array.forEach(item => {
            if (!baseIncome) {
                baseIncome = item.second_income;
            }
            const incomeRate = item.second_income / baseIncome;
            if (incomeRate) {
                item.incomeRate = _toFixed((incomeRate) * 100, 0) + '%';
            } else {
                item.incomeRate = '100%';
            }
            gradeObj[item.grade] = item;
        });
        return gradeObj;
    } catch (e) {
        return {};
    }
}
function formatGradeRange (array) {
    try {
        return array.map(item => item.level);
    } catch (e) {
        return [];
    }
}

export function updateNextRedLevel () {
    return new Promise((resolve, reject) => {
        getNextRedLevel().then(res => {
            resolve();
            if (res && !res.error && res.data) {
                setter([['nextRedLevel', getPath(['data', 'next_red_level'], res)]], true);
            }
        });
    });
}

export function getWithdrawLatest () {
    return new Promise((resolve, reject) => {
        withdrawLogsLatest().then(res => {
            resolve();
            if (res && !res.error && res.data) {
                setter([['withdrawLogsLatest', getPath(['data'], res)]], true);
            }
        });
    });
}

export function getActivityDetail () {
    const { activityObj } = getter(['activityObj']);
    const activityId = (activityObj.get() || {})[2].activity_id;
    activityDetail(activityId).then(r => {
        if (r && !r.error) {
            const { data } = r;
            if (data.log.money) {
                N.navigate('DailyMoneyPage', { activityId, pageInfo: data });
            } else {
                _tc(() => N.navigate('OpenMoneyPage', { activityId }));
            }
        }
    });
}

export function getChannel () {
    try {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            const ret = await android.promiseGetChannel();
            if (ret && ret.channel) {
                setter([['channel', ret.channel]], true);
            }
            resolve();
        });
    } catch (e) {
        console.log(e);
    }
}
