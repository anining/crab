import { useState, useEffect } from 'react';
import * as React from 'karet';
import { Dimensions, SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { css } from '../../assets/style/css';
import Slider from '../../components/Slider';
import ComTitle from '../../components/ComTitle';
import ImageAuto from '../../components/ImageAuto';
import answer1 from '../../assets/icon/answer/answer1.png';
import answer2 from '../../assets/icon/answer/answer2.png';
import answer3 from '../../assets/icon/answer/answer3.png';
import answer4 from '../../assets/icon/answer/answer4.png';
import answer5 from '../../assets/icon/answer/answer5.png';
import answer6 from '../../assets/icon/answer/answer6.png';
import answer7 from '../../assets/icon/answer/answer7.png';
import answer8 from '../../assets/icon/answer/answer8.png';
import answer9 from '../../assets/icon/answer/answer9.png';
import answer10 from '../../assets/icon/answer/answer10.png';
import answer11 from '../../assets/icon/answer/answer11.png';
import answer12 from '../../assets/icon/answer/answer12.png';
import answer13 from '../../assets/icon/answer/answer13.png';
import answer14 from '../../assets/icon/answer/answer14.png';
import pop5 from '../../assets/icon/pop/pop5.png';
import Shadow from '../../components/Shadow';
import { _if, _tc, bannerAction, transformMoney } from '../../utils/util';
import Button from '../../components/Button';
import { N } from '../../utils/router';
import { getter, store } from '../../utils/store';
import { getNewUserTask, getTask, newUserTask, sign, signLogs, taskReceiveDetail } from '../../utils/api';
import Choice from '../../components/Choice';
import toast from '../../utils/toast';
import * as U from 'karet.util';
import asyncStorage from '../../utils/asyncStorage';
import pop3 from '../../assets/icon/pop/pop3.png';
import { task } from '../../utils/update';

const { width } = Dimensions.get('window');
// btnStatus: 状态: 1进行中2待领取3已完成4敬请期待5去做任务6去绑定

const { banner, signConfig, activityObj, user, taskPlatform, user_id } = getter(['banner', 'signConfig', 'activityObj', 'user', 'user.user_id', 'taskPlatform']);

export default function AnswerPage () {
    const [signDay, setSignDay] = useState(0);
    const [newUser, setNewUser] = useState([]);

    useEffect(() => {
        init();
    }, []);

    async function init () {
        await _signLogs();
        await _newUserTask();
    }

    async function _signLogs () {
        const ret = await signLogs();
        !ret.error && setSignDay(ret.data.length);
    }

    async function _newUserTask () {
        // asyncStorage.setItem(`NEW_USER_TASK_TYPE1${user_id.get()}`, 'true');
        const local1 = await asyncStorage.getItem(`NEW_USER_TASK_TYPE1${user_id.get()}`);
        const local2 = await asyncStorage.getItem(`NEW_USER_TASK_TYPE2${user_id.get()}`);
        const local3 = await asyncStorage.getItem(`NEW_USER_TASK_TYPE3${user_id.get()}`);
        const ret = await newUserTask();
        if (!ret.error) {
            const NEW_USER_TASK_TYPE = {
                1: {
                    label: '看视频领金币',
                    icon: answer1,
                    path: ''
                },
                2: {
                    label: '绑定账号领金币',
                    icon: answer3,
                    path: ''
                },
                3: {
                    label: '做任务得奖励',
                    icon: answer13,
                    path: ''
                }
            };
            const { data } = ret;
            const localData = data.map(task => {
                const { add_balance, is_finish, new_user_task_id, task_type, level } = task;
                return {
                    balance: add_balance,
                    id: new_user_task_id,
                    label: NEW_USER_TASK_TYPE[task_type].label,
                    minTitle: NEW_USER_TASK_TYPE[task_type].label,
                    icon: NEW_USER_TASK_TYPE[task_type].icon,
                    path: NEW_USER_TASK_TYPE[task_type].path,
                    btnText: is_finish ? '已完成' : `local${task_type}` ? '领取奖励' : '去完成',
                    btnStatus: is_finish ? 3 : `local${task_type}` ? 2 : 5,
                };
            });
            setNewUser(localData);
        }
    }

    return (
        <SafeAreaView style={[{ flex: 1, paddingTop: 20, backgroundColor: '#fff' }]}>
            <ScrollView style={[{ flex: 1 }]}>
                <View style={{ height: 20 }}/>
                <Slider data={banner.get()} height={width * 0.35} autoplay={true} onPress={async item => {
                    await bannerAction(item.category, item.link, item.title);
                }}/>
                <View style={styles.answerWrap}>
                    <ComTitle title={'每日签到'} minTitle={<Text style={css.minTitle}>
                            连续签到得 <Text style={{ color: '#FF6C00' }}>提现免手续费特权卡!</Text>
                    </Text>}/>
                    <RenderDaySign signDay={signDay} setSignDay={setSignDay}/>
                </View>
                <View style={{ height: 15, backgroundColor: '#f8f8f8' }}/>
                <View style={styles.answerWrap}>
                    <ComTitle title={'火爆活动'}/>
                    <RenderActivity />
                </View>
                <View style={{ height: 15, backgroundColor: '#f8f8f8' }}/>
                <View style={styles.answerWrap}>
                    <ComTitle title={'新手福利'}/>
                    <RenderNewList list={newUser} _newUserTask={_newUserTask}/>
                </View>
                <RenderTaskView />
                <View style={{ height: 20, backgroundColor: '#f8f8f8' }}/>
            </ScrollView>
        </SafeAreaView>
    );
}

function RenderTaskView () {
    function searchAccount (accounts, need_bind) {
        let name = '绑定做单账号';
        let btnText = '绑定账号';
        let btnStatus = 6;
        if (need_bind) {
            accounts.forEach(account => {
                const { is_current, nickname } = account;
                if (is_current) {
                    name = `做单账号：${nickname}`;
                    btnText = '去做任务';
                    btnStatus = 5;
                }
            });
        } else {
            name = '';
            btnText = '去做任务';
            btnStatus = 5;
        }

        return { name, btnText, btnStatus };
    }

    function formatTaskPlatform (list = taskPlatform.get()) {
        try {
            return list.map(item => {
                const { accounts = [], need_bind } = item;
                const { name, btnText, btnStatus } = searchAccount(accounts, need_bind);
                return {
                    minTitle: name,
                    btnText,
                    btnStatus,
                    ...item
                };
            });
        } catch (e) {
            return [];
        }
    }

    const authorization = U.view(['authorization'], store).get();

    if (authorization) {
        return (
            <>
                <View style={{ height: 15, backgroundColor: '#f8f8f8' }}/>
                <View style={styles.answerWrap} karet-lift>
                    <ComTitle title={'领金币'}/>
                    <RenderList list={formatTaskPlatform()}/>
                </View>
            </>
        );
    }
    return <></>;
}

function RenderNewList ({ list = [], _newUserTask }) {
    const view = [];

    list.forEach((item, index) => {
        const { minTitle, btnStatus, icon, balance, label, id } = item;
        view.push(
            <View style={[styles.answerItemWrap, css.flex, css.sp, { borderBottomWidth: index + 1 >= list.length ? 0 : 1 }]} key={id}>
                <View style={[css.flex, styles.aiwLeft, css.js]}>
                    <ImageAuto source={icon} width={40}/>
                    <View style={[css.flex, css.fw, styles.aiwText]}>
                        <View style={[css.flex, css.js, { width: '100%' }]}>
                            <Text style={[styles.labelText, { width: 'auto' }]} numberOfLines={1}>{label}</Text>
                            <Text style={styles.labelMoney} numberOfLines={1}> +{balance}</Text>
                            <ImageAuto source={answer14} width={20}/>
                        </View>
                        <Text style={[styles.labelText, styles.labelMinTitle, { color: btnStatus === 5 ? '#999' : '#53C23B' }]} numberOfLines={1}>{minTitle}</Text>
                    </View>
                </View>
                <RenderNewBtn _newUserTask={_newUserTask} item={item}/>
            </View>
        );
    });
    return <>{view}</>;
}

function RenderList ({ list = [] }) {
    const view = [];

    list.forEach((item, index) => {
        const { minTitle, btnStatus, money, label } = item;
        view.push(
            <View style={[styles.answerItemWrap, css.flex, css.sp, { borderBottomWidth: index + 1 >= list.length ? 0 : 1 }]} key={`${index}list`}>
                <View style={[css.flex, styles.aiwLeft, css.js]}>
                    <ImageAuto source={item.icon} width={40}/>
                    <View style={[css.flex, css.fw, styles.aiwText]}>
                        <View style={[css.flex, css.js, { width: '100%' }]}>
                            <Text style={[styles.labelText, { width: 'auto' }]}
                                numberOfLines={1}>{label}</Text>
                            {_if(money, res => <Text style={styles.labelMoney}
                                numberOfLines={1}> +{res}</Text>)}
                            {_if(money, res => <ImageAuto source={answer14} width={20}/>)}
                        </View>
                        <Text style={[styles.labelText, styles.labelMinTitle, { color: btnStatus === 5 ? '#999' : '#53C23B' }]} numberOfLines={1}>{minTitle}</Text>
                    </View>
                </View>
                <RenderBtn item={item}/>
            </View>
        );
    });
    return <>{view}</>;
}

function RenderSignList ({ signDay }) {
    const view = [];
    const signConfigObj = signConfig.get();
    for (const day in signConfigObj) {
        const item = signConfigObj[day];
        view.push(
            <View key={`sign${day}`} style={[css.flex, css.fw, styles.signItemWrap, {
                backgroundColor: day <= signDay ? '#FF9C00' : '#F0F0F0',
            }]}>
                <Text style={[styles.signText, { color: day <= signDay ? '#fff' : '#353535', }]}>{_if(item.add_balance, res => transformMoney(res))}</Text>
                <ImageAuto source={item.prop ? item.prop.icon : day <= signDay ? answer11 : answer9} width={item.prop ? width * 0.055 : width * 0.07}/>
                <Text style={[styles.signText, { color: day <= signDay ? '#fff' : '#353535', lineHeight: 18 }]}>{day}天</Text>
            </View>
        );
    }
    return (
        <View key={'dayList'} style={[styles.signAllTopWrap, css.flex]}>
            {view}
        </View>
    );
}

function RenderDaySign ({ signDay, setSignDay }) {
    const [signBtnText, setSignBtnText] = useState('签到领钱');
    const [hadSign, setHadSign] = useState(false);

    async function _sign () {
        const ret = await sign();
        console.log(ret, '签到');
        if (ret && !ret.error) {
            if (ret.prop) {
                DeviceEventEmitter.emit('showPop', <Choice info={{
                    icon: pop5,
                    tips: <Text>签到成功! 您成功获得<Text style={{ color: '#FF6C00' }}>{ret.prop.label}</Text> </Text>,
                    minTips: '请在"我的-我的背包"查看收益详情',
                    type: 'oneBtn',
                    rt: '我知道了',
                }}/>);
            } else {
                DeviceEventEmitter.emit('showPop', <Choice info={{
                    icon: pop5,
                    tips: <Text>签到成功! 您成功获得<Text style={{ color: '#FF6C00' }}>{transformMoney(ret.data.add_balance)}金币</Text> </Text>,
                    minTips: '请在"我的-我的背包"查看收益详情',
                    type: 'oneBtn',
                    rt: '我知道了',
                }}/>);
            }
            setSignDay(signDay + 1);
            setSignBtnText('已签到');
            setHadSign(true);
        } else {
            if (ret.error === 3) {
                setSignBtnText('已签到');
                setHadSign(true);
            }
        }
    }

    const userInfo = user.get();
    const today_task_num = userInfo.today_task_num || 0;
    const view = [];
    view.push(
        <RenderSignList signDay={signDay} key="RenderDaySign-1"/>
    );
    view.push(
        <View style={[css.flex, css.sp, styles.signAllWrap]} key="RenderDaySign-2">
            <View style={[css.flex, css.fw, styles.signTipsWrap]}>
                <Text style={[styles.signTipsText, styles.maxSTT]}>完成进度: <Text style={{ color: '#FF6C00' }}>{today_task_num}</Text>/10</Text>
                <Text style={[styles.signTipsText]}>提交并通过10单任务即可签到</Text>
            </View>
            <Button key={`${signBtnText}${signDay}`} width={120} name={signBtnText} disable={hadSign} shadow={'#ff0008'} onPress={async (callback) => {
                await _sign();
                callback();
            }}/>
        </View>
    );
    return (
        <>
            {view}
        </>
    );
}

function RenderActivity () {
    const view = [];
    view.push(
        <TouchableOpacity onPress={() => {
            _tc(() => N.navigate('DailyRedPackagePage', {
                activityId: (activityObj.get() || {})[1].activity_id
            }));
        }} key={'DailyRedPackagePage'}>
            <ImageAuto source={answer5} width={width * 0.9 * 0.48}/>
        </TouchableOpacity>,
    );
    view.push(
        <View style={[css.flex, css.fw, styles.activityRight]} key={'appPage'}>
            <TouchableOpacity style={styles.arItemWrap} onPress={() => {
                N.navigate('SharePage');
            }} key={'SharePage'}>
                <ImageAuto source={answer6} width={width * 0.9 * 0.48}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.arItemWrap} onPress={() => {
                _tc(() => N.navigate('OpenMoneyPage', {
                    activityId: (activityObj.get() || {})[2].activity_id
                }));
            }} key={'OpenMoneyPage'}>
                <ImageAuto source={answer8} width={width * 0.9 * 0.48}/>
            </TouchableOpacity>
        </View>,
    );
    return <View style={[css.flex, css.sp, { paddingHorizontal: 10 }]} key={'activity'}>{view}</View>;
}

function RenderNewBtn ({ item, _newUserTask }) {
    const { btnStatus, btnText, path, id, balance } = item;

    function getReward () {
        getNewUserTask(id).then(r => {
            if (!r.error) {
                _newUserTask();
                DeviceEventEmitter.emit('showPop',
                    <Choice info={{
                        icon: pop3,
                        tips: '太棒了～',
                        minTips: `你成功获得${balance}奖励`,
                        type: 1,
                        rt: '我知道了',
                        fontSize: 15
                    }} />);
            }
        });
    }

    switch (btnStatus) {
    case 2:return ( // 领取奖励
        <Text style={styles.todoTaskText} karet-lift onPress={getReward}>{btnText}</Text>
    );
    case 5:return ( // 去完成
        <Text style={styles.todoTaskText} onPress={ () => {
            N.navigate(path);
        }}>{btnText}</Text>
    );
    default:return ( // 已完成
        <Shadow style={styles.todoBtn} color={'#d43912'}>
            <Text style={styles.todoBtnText}>{btnText}</Text>
        </Shadow>
    );
    }
}

function RenderBtn ({ item }) {
    const { btnStatus, btnText, platform_category } = item;

    switch (btnStatus) {
    case 2:
    case 5:return (
        <Text style={styles.todoTaskText} karet-lift onPress={ () => {
            task(platform_category);
        }}>{btnText}</Text>
    );
    case 6:return (
        <Text style={[styles.todoTaskText, { borderColor: '#53C23B', color: '#53C23B' }]} karet-lift onPress={ () => {
            N.navigate('AccountHomePage');
        }}>{btnText}</Text>
    );
    default:return (
        <Shadow style={styles.todoBtn} color={'#d43912'}>
            <Text style={styles.todoBtnText} karet-lift>{btnText}</Text>
        </Shadow>
    );
    }
}

const styles = StyleSheet.create({
    activityRight: {
        height: '100%',
        marginLeft: width * 0.9 * 0.05,
    },
    aiwLeft: {
        height: '100%',
        overflow: 'hidden',
        width: width * 0.9 - 80,
    },
    aiwText: {
        height: '100%',
        overflow: 'hidden',
        paddingLeft: 10,
        width: width * 0.9 - 120,
    },
    answerItemWrap: {
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1,
        height: 65,
        paddingHorizontal: 10,
        width: width * 0.9,
        ...css.auto,
        backgroundColor: '#fff',
    },
    answerWrap: {
        backgroundColor: '#fff',
        height: 'auto',
        // marginTop: 15,
        minHeight: 100,
        paddingHorizontal: 10,
        paddingVertical: 15,
        width: '100%',
    },
    arItemWrap: {
        height: 'auto',
        marginBottom: width * 0.05,
        width: '100%',
    },
    labelMinTitle: {
        color: '#999',
        fontSize: 11,
    },
    labelMoney: {
        color: '#FF6C00',
        fontSize: 14,
        fontWeight: '900',
    },
    labelText: {
        color: '#222',
        fontSize: 14,
        lineHeight: 22,
        textAlign: 'left',
        width: '100%',
    },
    maxSTT: {
        color: '#222',
        fontSize: 13,
        fontWeight: '900',
    },
    signAllTopWrap: {
        marginTop: 15,
    },
    signAllWrap: {
        height: 70,
        marginTop: 10,
        paddingHorizontal: 5,
    },
    signItemWrap: {
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        height: 70,
        marginRight: width * 0.9 * 0.01,
        overflow: 'hidden',
        width: width * 0.9 * 0.132,
    },
    signText: {
        color: '#666',
        fontSize: 10,
        lineHeight: 12,
        textAlign: 'center',
        width: '100%',
    },
    signTipsText: {
        color: '#353535',
        fontSize: 12,
        lineHeight: 22,
        textAlign: 'left',
        width: '100%',
    },
    signTipsWrap: {
        height: '100%',
        width: width * 0.9 - 120,
    },
    todoBtn: {
        borderRadius: 13,
        height: 26,
        width: 70,
    },
    todoBtnText: {
        backgroundColor: '#FF3E00',
        borderRadius: 12,
        color: '#fff',
        fontSize: 12,
        height: 26,
        lineHeight: 26,
        textAlign: 'center',
        width: '100%',
    },
    todoTaskText: {
        borderColor: '#FF3B00',
        borderRadius: 13,
        borderWidth: 1,
        color: '#FF3B00',
        fontSize: 12,
        height: 26,
        lineHeight: 26,
        textAlign: 'center',
        width: 70,
    }
});
