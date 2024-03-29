import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ImageBackground, Dimensions, TouchableOpacity, ScrollView, Image, TextInput, DeviceEventEmitter } from 'react-native';
import { css } from '../../assets/style/css';
import Header from '../../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import { N } from '../../utils/router';
import pupil1 from '../../assets/icon/pupil/pupil1.png';
import pupil2 from '../../assets/icon/pupil/pupil2.png';
import pupil3 from '../../assets/icon/pupil/pupil3.png';
import pupil4 from '../../assets/icon/pupil/pupil4.png';
import pupil5 from '../../assets/icon/pupil/pupil5.png';
import pupil7 from '../../assets/icon/pupil/pupil7.png';
import pupil8 from '../../assets/icon/pupil/pupil8.png';
import pupil10 from '../../assets/icon/pupil/pupil10.png';
import pupil12 from '../../assets/icon/pupil/pupil12.png';
import ImageAuto from '../../components/ImageAuto';
import { bindParent, childDetail, childList, taskReceive } from '../../utils/api';
import { _copyStr, _toFixed, transformMoney, transformTime } from '../../utils/util';
import Choice from '../../components/Choice';
import { getter } from '../../utils/store';
import toast from '../../utils/toast';
import Button from '../../components/Button';
import { task, updateUser } from '../../utils/update';
import task10 from '../../assets/icon/task/task10.png';
import ListGeneral from '../../components/ListGeneral';
import { getPath } from '../../global/global';
import activity17 from '../../assets/icon/activity/activity17.png';

const { width } = Dimensions.get('window');
const itemHeight = 135;
const itemMarginTop = 10;
const { is_valid } = getter(['user.is_valid']);

function PupilInfoPage () {
    const [children, setChildren] = useState([]);
    const [parent, setParent] = useState({});
    const [today, setToday] = useState({});
    const [setting, setSetting] = useState({});
    const [yesterday, setYesterday] = useState({});
    const [total, setTotal] = useState({});
    let reloadEmitter;
    useEffect(() => {
        _childDetail();
        reloadEmitter = DeviceEventEmitter.addListener('reloadChildDetail', async () => {
            _childDetail();
        });
        return () => {
            reloadEmitter && reloadEmitter.remove();
        };
    }, []);

    function _childDetail () {
        childDetail().then(r => {
            if (r && !r.error) {
                const { children_list, parent, today, children_settings, yesterday, total } = r.data;
                setChildren(children_list);
                parent && setParent(parent);
                setToday(today);
                setSetting(children_settings);
                setYesterday(yesterday);
                setTotal(total);
            }
        });
    }

    return (
        <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#f8f8f8' }]}>
            <Header label={'渔友信息'} onPress={() => { N.navigate('PupilSetPage', { setting }); }} headerRight={<Text style={{ color: '#FF5C22' }}>交友设置</Text>}/>
            <ListGeneral
                itemHeight={itemHeight}
                itemMarginTop={itemMarginTop}
                renderHeader={() => {
                    return <View>
                        <View style={[styles.infoHeaderWrap, css.pr]}>
                            <LinearGradient colors={['#FF9C00', '#FF3E00']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={[styles.infoHeaderBg]} />
                            <ParentView parent={parent} _childDetail={_childDetail}/>
                        </View>
                        <RenderData today={today} yesterday={yesterday} total={total}/>
                        <View style={[styles.pupListWrap, css.flex, css.sp]}>
                            <RenderShareTitle title="渔友列表" icon={pupil4} width={200}/>
                            {/* <Text style={styles.pupListTips}>总贡献排序</Text> */}
                        </View>
                        <RenderChild children={children}/>
                    </View>;
                }}
                getList={ async (page, num, callback) => {
                    const ret = await childList(page, num);
                    if (ret && !ret.error) {
                        console.log(ret, '??==');
                        callback(getPath(['data', 'children_list'], ret));
                    } else {
                        // eslint-disable-next-line standard/no-callback-literal
                        callback([]);
                    }
                }}
                renderItem={item => {
                    return <View>
                        <RenderChild children={item}/>
                    </View>;
                }}
            />
        </SafeAreaView>
    );
}

function RenderChild ({ children }) {
    try {
        const view = [];
        const { today_contribution, total_contribution, children_num, avatar, total_pass_num, invite_time, nickname, user_id } = children;
        view.push(
            <View style={styles.itemContainer} key={user_id}>
                <View style={[styles.containerT]}>
                    <View style={{ alignItems: 'center', flexDirection: 'row', height: 55 }}>
                        <Image source={{ uri: avatar }} style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }}/>
                        <Text style={{ color: 'rgba(53,53,53,1)', fontWeight: '600', fontSize: 15 }}>{nickname}</Text>
                    </View>
                    <Text style={{ color: 'rgba(153,153,153,1)', fontSize: 11 }}>成为渔友时间：{transformTime(invite_time)}</Text>
                </View>
                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', height: 40 }}>
                    <Text style={{ color: 'rgba(85,85,85,1)' }}>今日贡献：<Text style={{ color: 'rgba(51,51,51,1)' }}>{transformMoney(today_contribution, 2)}</Text></Text>
                    <Text style={{ color: 'rgba(85,85,85,1)' }}>累计贡献金币：<Text style={{ color: 'rgba(51,51,51,1)' }}>{transformMoney(total_contribution, 2)}</Text></Text>
                </View>
                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', height: 40 }}>
                    <Text style={{ color: 'rgba(85,85,85,1)' }}>他的渔友总数：<Text style={{ color: 'rgba(51,51,51,1)' }}>{children_num}</Text></Text>
                    <Text style={{ color: 'rgba(85,85,85,1)' }}>摸鱼夺宝总数：<Text style={{ color: 'rgba(51,51,51,1)' }}>{total_pass_num}</Text></Text>
                </View>
            </View>
        );
        return view;
    } catch (e) {
        return <View/>;
    }
}

function RenderData ({ today, yesterday, total }) {
    try {
        const array = [
            {
                label: '今日渔友数据',
                icon: pupil1,
                ...today
            },
            {
                label: '昨日渔友数据',
                icon: pupil2,
                ...yesterday
            }
        ];
        const view = [];
        array.forEach(item => {
            const { children_income, children_num, disciple_income, disciple_num, label, icon } = item;
            view.push(
                <View style={[css.flex, css.fw, styles.pupilItemWrap]}>
                    <RenderShareTitle title={label} icon={icon}/>
                    <RenderForm children_income={children_income} children_num={children_num} disciple_income={disciple_income} disciple_num={disciple_num}/>
                </View>
            );
        });
        const { sum_children_num, sum_disciple_num, sum_children_income, sum_disciple_income } = total;
        view.push(
            <View style={[css.flex, css.fw, styles.pupilItemWrap]}>
                <RenderShareTitle title={'累计渔友数据'} icon={pupil3}/>
                <RenderForm children_income={sum_children_income} children_num={sum_children_num} disciple_income={sum_disciple_income} disciple_num={sum_disciple_num}/>
            </View>
        );
        return <>{view}</>;
    } catch (e) {
        return <Text/>;
    }
}

function RenderShareTitle ({ title, icon, width }) {
    return (
        <View style={[css.flex, css.js, { width: width || '100%' }]}>
            <ImageAuto source={icon} style={{ width: 20, marginRight: 10 }}/>
            <Text style={styles.pupTitleText}>{title || '-'}</Text>
        </View>
    );
}

function RenderForm ({ children_income = 0, children_num = 0, disciple_income = 0, disciple_num = 0 }) {
    return (
        <View style={styles.formWrap}>
            <View style={[styles.formHeaderWrap, css.flex]}>
                <Text style={styles.fhwText}>渔友人数</Text>
                <Text style={styles.fhwText}>渔小友人数</Text>
                <Text style={styles.fhwText}>渔友贡献</Text>
                <Text style={styles.fhwText}>渔小友贡献</Text>
            </View>
            <View style={[styles.formLineWrap, css.flex]}>
                <Text style={styles.fhwLineText}>{children_num || 0}</Text>
                <Text style={styles.fhwLineText}>{disciple_num || 0}</Text>
                <Text style={styles.fhwLineText}>{_toFixed(children_income, 2)}</Text>
                <Text style={[styles.fhwLineText, { borderRightWidth: 0 }]}>{_toFixed(disciple_income, 2)}</Text>
            </View>
        </View>
    );
}

function ParentView ({ parent, _childDetail }) {
    const [inviteCode, setInviteCode] = useState('');

    function bind (callback) {
        if (!inviteCode) {
            callback();
            return;
        }
        DeviceEventEmitter.emit('showPop', {
            dom:
                <Choice info={{
                    icon: pupil12,
                    tips: `确定绑定${inviteCode}为您的师父吗？`,
                    minTips: '绑定成功之后不可更改',
                    lt: '取消',
                    rc: () => {
                        bindParent(inviteCode).then(r => {
                            callback();
                            if (!r.error) {
                                toast('绑定师父成功');
                                setInviteCode('');
                                _childDetail();
                            }
                        });
                    },
                    lc: () => {
                        callback();
                    },
                    rt: '确定'
                }} />,
            close: () => {
                callback();
            },
        });
    }

    if (parent.invite_code) {
        const { invite_code, avatar, nickname, qq_group, wx } = parent;
        return (
            <ImageBackground source={pupil8} style={[styles.infoHeader, css.pa]}>
                <RenderShareTitle title="我的师父" icon={pupil5}/>
                <View style={[styles.teacherWrap, css.flex, css.sp]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={{ uri: avatar }} style={{ width: 40, height: 40, borderRadius: 20 }}/>
                        <Text style={{ color: 'rgba(53,53,53,1)', fontSize: 16, fontWeight: '500', marginLeft: 5 }}>{nickname}</Text>
                    </View>
                    <Text style={{ color: '#999', fontSize: 12 }}>他的邀请码：{invite_code} </Text>
                </View>
                <View style={[css.flex, styles.pupBtnWrap, css.auto, css.sp]}>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        if (wx) {
                            _copyStr(wx);
                        } else {
                            toast('你的师傅还没有设置微信');
                        }
                    }}>
                        <ImageAuto source={pupil7} width={width * 0.35}/>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        if (qq_group) {
                            _copyStr(qq_group);
                        } else {
                            toast('你的师傅还没有设置QQ群');
                        }
                    }}>
                        <ImageAuto source={pupil10} width={width * 0.35}/>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    } else if (is_valid.get()) {
        return (
            <ImageBackground source={pupil8} style={[styles.infoHeader, css.pa, { justifyContent: 'space-around' }]}>
                <RenderShareTitle title="我的师父" icon={pupil5}/>
                <View style={[css.flexRCSB, styles.bindView, { justifyContent: 'center' }]}>
                    <Text style={{ fontWeight: '500', color: '#353535' }}>您没有绑定师父！您已兑换过一次，不可绑定师父！</Text>
                </View>
            </ImageBackground>
        );
    }
    return (
        <ImageBackground source={pupil8} style={[styles.infoHeader, css.pa, { justifyContent: 'space-around' }]}>
            <RenderShareTitle title="我的师父" icon={pupil5}/>
            <View style={[css.flexRCSB, styles.bindView]}>
                <TextInput style={styles.bindInput} maxLength={30} placeholder={'请填写师父邀请码'} placeholderTextColor={'#999'} onChangeText={e => setInviteCode(e)}/>
                <View style={styles.bindBtn}>
                    <Button name={'绑定师父'} width={120} onPress={ callback => {
                        bind(callback);
                    }}/>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bindBtn: {
        alignItems: 'center',
        height: 40,
        justifyContent: 'center',
        width: '35%'
    },
    bindInput: {
        backgroundColor: '#fff',
        borderRadius: 6,
        height: 40,
        width: '60%'
    },
    bindView: {
        alignItems: 'center',
        borderTopColor: '#fff',
        borderTopWidth: 1,
        paddingBottom: 30,
        paddingTop: 30,
        width: '100%'
    },
    containerT: {
        alignItems: 'center',
        borderBottomColor: '#FFF2F2F2',
        borderBottomWidth: 1,
        flexDirection: 'row',
        height: 55,
        justifyContent: 'space-between'
    },
    fhwLineText: {
        borderRightColor: '#FFE3CF',
        borderRightWidth: 1,
        color: '#666',
        flex: 1,
        fontSize: 13,
        height: 45,
        lineHeight: 45,
        textAlign: 'center',
    },
    fhwText: {
        color: '#353535',
        flex: 1,
        fontSize: 13,
        textAlign: 'center'
    },
    formHeaderWrap: {
        backgroundColor: '#FFE3CF',
        height: 45,
        width: '100%',
    },
    formLineWrap: {
        height: 45,
        width: '100%',
    },
    formWrap: {
        borderColor: '#FFE3CF',
        borderRadius: 6,
        borderWidth: 1,
        marginTop: 20,
        overflow: 'hidden',
        width: 0.92 * width,
        ...css.auto,
    },
    infoHeader: {
        borderRadius: 10,
        height: width * 0.96 * 570 / 1107,
        left: '2%',
        overflow: 'hidden',
        padding: 20,
        top: 10,
        width: width * 0.96
    },
    infoHeaderBg: {
        ...css.pa,
        height: 150,
        width: '100%',
        zIndex: -1
    },
    infoHeaderWrap: {
        backgroundColor: '#f8f8f8',
        height: 210,
        marginBottom: 15
    },
    itemContainer: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        height: itemHeight,
        marginLeft: 15,
        marginRight: 15,
        marginTop: itemMarginTop,
        paddingLeft: 15,
        paddingRight: 15
    },
    pupBtnWrap: {
        height: 'auto',
        paddingHorizontal: 20,
        width: '100%'
    },
    pupListTips: {
        color: '#999',
        fontSize: 11,
    },
    pupListWrap: {
        backgroundColor: '#fff',
        borderRadius: 6,
        height: 50,
        overflow: 'hidden',
        width: width * 0.94,
        ...css.auto,
        marginBottom: 10,
        paddingHorizontal: 15
    },
    pupTitleText: {
        color: '#000',
        fontSize: 16,
    },
    pupilItemWrap: {
        backgroundColor: '#fff',
        marginBottom: 15,
        paddingHorizontal: 15,
        paddingVertical: 15
    },
    teacherWrap: {
        height: width * 0.17,
        paddingHorizontal: 20,
        width: '100%'
    }
});

export default PupilInfoPage;
