import { PureComponent } from 'react';
import * as React from 'karet';
import {
    SafeAreaView,
    Text,
    Image,
    View,
    Dimensions,
    ScrollView,
    StyleSheet,
    ImageBackground,
    DeviceEventEmitter,
    TouchableOpacity,
    InteractionManager,
} from 'react-native';
import { css } from '../../assets/style/css';
import share2 from '../../assets/icon/share/share2.png';
import share3 from '../../assets/icon/share/share3.png';
import share4 from '../../assets/icon/share/share4.png';
import share5 from '../../assets/icon/share/share5.png';
import share6 from '../../assets/icon/share/share6.png';
import share7 from '../../assets/icon/share/share7.png';
import share8 from '../../assets/icon/share/share8.png';
import share9 from '../../assets/icon/share/share9.png';
import share10 from '../../assets/icon/share/share10.png';
import share11 from '../../assets/icon/share/share11.png';
import share12 from '../../assets/icon/share/share12.png';
import share17 from '../../assets/icon/share/share17.png';
import share18 from '../../assets/icon/share/share18.png';
import Shadow from '../../components/Shadow';
import ImageAuto from '../../components/ImageAuto';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { N } from '../../utils/router';
import { getter } from '../../utils/store';
import toast from '../../utils/toast';
import { awardDetail, getChildAward, getPromoteAward } from '../../utils/api';
import { _copyStr, _gv, _if, transformMoney } from '../../utils/util';
import answer16 from '../../assets/icon/answer/answer16.png';
import answer15 from '../../assets/icon/answer/answer15.png';
import header3 from '../../assets/icon/header/header3.png';
import Header from '../../components/Header';
import { getGlobal, getPath } from '../../global/global';
import { updateUser } from '../../utils/update';

const { width } = Dimensions.get('window');
const SHARE_ITEM_WIDTH = width * 0.9;
const SHARE_ITEM_RADIUS = 10;
const WALFARE_ONE_height = 190;
const WALFARE_TWO_height = 620;
const WALFARE_TRI_height = 300;
const cashBack = [{
    title: '直接渔友首次兑换到账',
    label: '师傅得1元',
}, {
    title: '直接渔友第二次兑换到账',
    label: '师傅得2元',
}, {
    title: '直接渔友第三次兑换到账',
    label: '师傅得3元',
}];
const { invite_code, authorization } = getter(['user.invite_code', 'authorization']);

function RewardPop ({ view, source }) {
    return (
        <ImageBackground source={source} style={{ width: width * 0.75, height: width * 0.75 * (1245 / 885), position: 'relative' }}>
            {view}
        </ImageBackground>
    );
}

export default class SharePage extends PureComponent {
    constructor (props) {
        super(props);
        this.state = {
            detailInfo: null,
            awardLength: 0,
            valid_children: 0,
            rebate: [0, 0], // 回馈比例
        };
        this.getReward = this.getReward.bind(this);
        this.getBigReward = this.getBigReward.bind(this);
        this.renderPop = this.renderPop.bind(this);
        this.topPusherWx = getPath(['configObj', 'app_other_info', 'value', 'topPusherWx'], getGlobal('app'), '');
    }

    async _awardDetail () {
        const ret = await awardDetail();
        console.log(ret);
        if (ret && !ret.error) {
            const { promote_level = [], valid_children = 0, children_withdraw_award_logs = [] } = ret.data;
            const { rebate } = this.state;
            promote_level.forEach(level => {
                const { need_children_num, first_rebate, second_rebate } = level;
                if (Number(valid_children) >= Number(need_children_num)) {
                    rebate[0] = first_rebate;
                    rebate[1] = second_rebate;
                }
            });
            this.setState({ detailInfo: ret.data, rebate, valid_children, awardLength: children_withdraw_award_logs.length });
        }
    }

    renderPop (money = 0, number = 0, next_money = 0) {
        const view = (
            <>
                <Text style={[styles.rewardPopText, { top: '10%' }]}>恭喜您，打开红包获得</Text>
                <Text style={[styles.rewardPopText, { top: '20%', color: '#EB432E' }]}>{money}元</Text>
                <Text style={[styles.rewardPopText, { top: '30%' }]}>您这也太强了吧！现在再邀请 <Text style={{ color: '#E83A29' }}>{number}</Text> 直接渔友</Text>
                <Text style={[styles.rewardPopText, { top: '40%' }]}>最多还能再开 <Text style={{ color: '#E83A29' }}>{next_money}</Text> 元</Text>
                <TouchableOpacity style={styles.rewardPopBtn} onPress={() => {
                    DeviceEventEmitter.emit('hidePop');
                }}>
                    <Text style={{ color: '#8F5806', fontSize: 18, fontWeight: '500' }}>我知道了</Text>
                </TouchableOpacity>
            </>
        );
        DeviceEventEmitter.emit('showPop', { dom: <RewardPop view={view} source={answer15}/>, close: () => { console.log('关闭'); } });
    }

    async getBigReward (info, item, index) {
        const { detailInfo } = this.state;
        const { promote_level } = detailInfo;
        const { need_children_num, level, get_type, label } = info;
        const number = ((promote_level[index + 1] && promote_level[index + 1].need_children_num) || 0) - need_children_num;
        const next_money = (promote_level[index + 1] && promote_level[index + 1].min_money) || 0;
        let view;
        if (get_type === 2) {
            view = (
                <>
                    <Text style={[styles.rewardPopText, { top: '10%' }]}>您真的太厉害了！</Text>
                    <Text style={[styles.rewardPopText, { top: '20%', color: '#EB432E' }]}>添加微信领取奖励</Text>
                    <Text style={[styles.rewardPopText, { top: '30%' }]}>您还可以选择成为我们的合伙人</Text>
                    <Text style={[styles.rewardPopText, { top: '40%' }]}>还有更多的福利机会等着您哟~</Text>
                    <TouchableOpacity style={styles.rewardPopBtn} onPress={() => {
                        DeviceEventEmitter.emit('hidePop');
                        _copyStr(this.topPusherWx);
                    }}>
                        <Text style={{ color: '#8F5806', fontSize: 18, fontWeight: '500' }}>复制微信号</Text>
                    </TouchableOpacity>
                </>
            );
            DeviceEventEmitter.emit('showPop', {
                dom: <RewardPop view={view} source={answer15}/>,
            });
        } else {
            getPromoteAward(level).then(r => {
                if (!r.error) {
                    updateUser();
                    const { add_balance } = r.data;
                    view = (
                        <>
                            <Text style={[styles.rewardPopText, { top: '10%', color: '#FFE6A1', fontSize: 23 }]}>恭喜您</Text>
                            <Text style={[styles.rewardPopText, { top: '20%', color: '#FFE6A1', fontSize: 23 }]}>晋升{label}</Text>
                            <Text style={[styles.rewardPopText, { top: '35%', color: '#FFE6A1', fontSize: 12 }]}>我们给您准备了一个大红包</Text>
                        </>
                    );
                    DeviceEventEmitter.emit('showPop', {
                        dom: <RewardPop view={view} source={answer16}/>,
                        close: () => {
                            this.renderPop(add_balance, number, next_money);
                        }
                    });
                }
            });
        }
    }

    async getReward () {
        const { awardLength } = this.state;
        if (!awardLength) {
            toast('暂时没有奖励可以领取');
            return;
        }
        const ret = await getChildAward();
        if (ret && !ret.error) {
            updateUser();
            this.setState({ awardLength: 0 });
            const { add_balance = 0, children_num = 0 } = ret.data;
            DeviceEventEmitter.emit('showPop', {
                dom:
                  <View style={styles.popContainer}>
                      <Image source={share9} style={styles.popImage}/>
                      <Text style={[{ fontSize: 15, color: '#353535', fontWeight: '500', transform: [{ translateY: -40 }] }]}>您真的太棒了！</Text>
                      <Text style={[{ fontSize: 13, color: '#353535', fontWeight: '500', transform: [{ translateY: -30 }] }]}>您又有 <Text style={[{ color: '#FF3B00' }]}>{children_num} 位</Text> 直接渔友一共为你回馈了</Text>
                      <Text style={[{ fontSize: 36, color: '#FF6C00', fontWeight: '800', transform: [{ translateY: -20 }] }]}>{add_balance}<Text style={[{ fontSize: 18 }]}>元</Text></Text>
                      <TouchableOpacity onPress={() => {
                          DeviceEventEmitter.emit('hidePop');
                          N.navigate('PupilInfoPage');
                      }}>
                          <Text style={[{ fontSize: 10, color: '#999', borderBottomColor: '#999', borderBottomWidth: 1 }]}>{'查看此次回馈收益的渔友>>'}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                          DeviceEventEmitter.emit('hidePop');
                      }} style={styles.popBtn}>
                          <Text style={[{ fontSize: 15, color: '#fff' }]}>我知道了</Text>
                      </TouchableOpacity>
                      <Text style={[{ fontSize: 10, color: '#999' }]}>已存入“我的钱包”</Text>
                  </View>,
                close: () => {}
            });
        }
    }

    async componentDidMount () {
        InteractionManager.runAfterInteractions(async () => {
            if (authorization.get()) {
                await this._awardDetail();
            } else {
                N.replace('VerificationStackNavigator');
            }
        });
    }

    _renderWelfare () {
        const view = [];
        const shareLevel = [{
            icon: share4,
            text: '领取奖励',
            color: '#FF5C22'
        }, {
            icon: share5,
            text: '领取奖励',
            color: '#FF5C22'
        }, {
            icon: share6,
            text: '领取奖励',
            color: '#FF5C22'
        }];
        const validNumber = parseInt(_gv(this.state.detailInfo, 'valid_children', 0));
        shareLevel.forEach((item, index) => {
            const info = _gv(this.state.detailInfo, `promote_level.${index}`, {
                max_money: 888,
                min_money: 888,
                first_rebate: 0.02,
                second_rebate: 0.01,
                need_children_num: 200,
                label: '终极推手',
                des: '-',
                get_type: 1,
            });
            if (info) {
                view.push(
                    <View style={[styles.welfareProgressWrap, css.flex, css.fw, css.afs]} key={`shareLevel${index}`}>
                        <View style={[css.flex, css.js, styles.wpiTitleWrap]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <ImageAuto source={item.icon} style={{ width: 32, marginRight: 10 }}/>
                                <Text style={[styles.welfareTitleText]}>{info.label}</Text>
                            </View>
                            {(() => {
                                const { valid_children, detailInfo } = this.state;
                                const { need_children_num } = info;
                                return (
                                    <TouchableOpacity onPress={() => {
                                        // this.getBigReward(info, item, index);
                                        if (Number(need_children_num) <= Number(valid_children)) {
                                            this.getBigReward(info, item, index);
                                        } else {
                                            toast('你还不满足领取条件');
                                        }
                                    }}>
                                        <Text style={{ color: item.color }}>{item.text}</Text>
                                    </TouchableOpacity>
                                );
                            })()}
                        </View>
                        {<Text numberOfLines={2} style={styles.welfareLabelText}>送<Text style={{ color: '#FF8353' }}>{transformMoney(info.min_money, 0)}{info.max_money > info.min_money ? `-${transformMoney(info.max_money, 0)}` : ''}金币</Text>礼包，获得{info.first_rebate * 100 + '%'}直接渔友{info.second_rebate * 100 + '%'}间接渔友兑换回馈奖励。</Text>}
                        {SharePage._renderProgress(validNumber / parseInt(info.need_children_num))}
                        <Text numberOfLines={1} style={styles.welfareTargetText}>已兑换的渔友 {validNumber}/{info.need_children_num}</Text>
                    </View>
                );
            }
        });
        return view;
    }

    static _renderProgress (widthP) {
        try {
            return <View style={[css.flex, css.js, styles.progressWrap, css.auto]}>
                <LinearGradient colors={['#FF9C00', '#FF3E00']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}
                    style={[styles.progressInner, {
                        width: widthP * 100 + 5 + '%'
                    }]}/>
            </View>;
        } catch (e) {
            return null;
        }
    }

    static _renderShareTitle (left, right) {
        return (
            <View style={[styles.wShareTitle, css.flexRCSB]}>
                <View style={[css.flex, css.js, css.pr, { paddingLeft: 10 }]}>
                    <ImageAuto source={share8} style={{
                        width: 20,
                        ...css.pa,
                        zIndex: -1
                    }}/>
                    <Text style={[css.pa, { left: 10, zIndex: 10 }]}>{left || <Text>自定义标题</Text>}</Text>
                </View>
                {right}
            </View>
        );
    }

    _renderCashBack () {
        try {
            const view = [];
            cashBack.forEach((item, index) => {
                view.push(
                    // useNativeDriver={true} iterationDelay={4000} delay={(index + 1) * 2000}
                    <View key={item.title} iterationCount={5} animation="bounce" style={[css.pr, styles.cashBackItem]}>
                        <ImageAuto source={share7} style={{
                            width: width * 0.9 * 0.25,
                            ...css.pa,
                        }}/>
                        <Text style={[css.pa, styles.cashTitle]}>渔友第{_if(this.state.detailInfo, res => res.children_withdraw_award_config[index].times, () => 0)}次兑换</Text>
                        <Text style={[css.pa, styles.cashLabel]}>你得{_if(this.state.detailInfo, res => res.children_withdraw_award_config[index].money, () => 0)}w金币</Text>
                    </View>
                );
            });
            return <View
                style={[css.flex, css.sp, { marginTop: 20, width: '100%', paddingHorizontal: 10 }]}>{view}</View>;
        } catch (e) {
            return null;
        }
    }

    render () {
        const { rebate, awardLength } = this.state;
        return (
            <SafeAreaView style={css.safeAreaView}>
                <ScrollView style={styles.scrollWrap}>
                    <Header color={'#fff'} label={'我的渔友'} style={[{ backgroundColor: 'rgba(0,0,0,0)', borderBottomWidth: 0 }, css.pa]} icon={header3}/>
                    <View style={[styles.shareBgWrap, css.pr]}>
                        <ImageAuto source={share17} style={[css.pa, styles.shareBg]}/>
                        <View style={[css.flex, styles.codeWrap, css.auto, css.sp]}>
                            <Text style={styles.inviteCode}>我的邀请码：<Text style={styles.codeNumber}
                                karet-lift>{invite_code}</Text> </Text>
                            <Text style={styles.copyBtn} onPress={() => {
                                _copyStr(invite_code.get());
                            }}>复制</Text>
                        </View>
                        <View style={[styles.inviteWrap, css.auto]}>
                            <Animatable.View useNativeDriver={true} iterationDelay={3000} iterationCount="infinite"
                                animation="tada" style={[css.auto]}>
                                <TouchableOpacity onPress={() => {
                                    DeviceEventEmitter.emit('showPop', {
                                        dom: <Share/>,
                                        close: () => {}
                                    });
                                }}>
                                    <ImageAuto source={share18} width={width * 0.65}/>
                                </TouchableOpacity>
                            </Animatable.View>
                            <TouchableOpacity style={[css.flex, css.sp, styles.tipsWrap]}
                                onPress={() => {
                                    N.navigate('PupilInfoPage');
                                }}>
                                <Text numberOfLines={1} style={styles.shareInfoTips}>
                                    当前兑换回馈：渔友兑换返{Number.parseInt(rebate[0] * 100)}%，渔小友兑换返{Number.parseInt(rebate[1] * 100)}%
                                </Text>
                                <Text style={styles.tipsBtn}>渔友信息</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.welfareWrap, css.auto, css.flex, css.fw]}>
                            <View style={[styles.welfareItemWrap, css.pr, css.flex]}>
                                <ImageBackground source={share2} style={[styles.shareTitle, css.flex, css.pa]}>
                                    <Text style={styles.shareTitleText}>福利一</Text>
                                </ImageBackground>
                                <Shadow style={styles.welfareInner} color={'#333'} opacity={0.1}>
                                    <View style={[styles.welfareInner, css.flex, css.fw, css.sp, {
                                        backgroundColor: '#fff',
                                        paddingTop: 30,
                                        paddingHorizontal: 10,
                                    }]}>
                                        {SharePage._renderShareTitle(<Text style={styles.wTitleText}>渔友兑换送<Text style={{ color: '#FF5C22' }}>6w金币</Text></Text>, <TouchableOpacity onPress={this.getReward}><Text style={{ fontSize: 11, color: 'rgba(255,92,34,1)', paddingRight: 15 }}>领取奖励（{awardLength}）</Text></TouchableOpacity>)}
                                        {this._renderCashBack()}
                                    </View>
                                </Shadow>
                            </View>
                            <View style={[styles.welfareItemWrap, css.pr, css.flex]}>
                                <ImageBackground source={share2} style={[styles.shareTitle, css.flex, css.pa]}>
                                    <Text style={styles.shareTitleText}>福利二</Text>
                                </ImageBackground>
                                <Shadow style={[styles.welfareInner, { height: WALFARE_TWO_height }]} color={'#333'} opacity={0.1}>
                                    <View style={[styles.welfareInner, {
                                        backgroundColor: '#fff',
                                        paddingTop: 30,
                                        paddingHorizontal: 10,
                                        height: WALFARE_TWO_height,
                                    }]}>
                                        {SharePage._renderShareTitle(
                                            <Text style={styles.wTitleText} numberOfLines={1}>交渔友抢<Text
                                                style={{ color: '#FF5C22' }}>1888w金币</Text>加<Text
                                                style={{ color: '#FF5C22' }}>15%回馈奖励</Text></Text>,
                                        )}
                                        {this._renderWelfare()}
                                    </View>
                                </Shadow>
                            </View>
                            <View style={[styles.welfareItemWrap, css.pr, css.flex]}>
                                <ImageBackground source={share2} style={[styles.shareTitle, css.flex, css.pa]}>
                                    <Text style={styles.shareTitleText}>说明</Text>
                                </ImageBackground>
                                <Shadow style={[styles.welfareInner, { height: WALFARE_TRI_height }]} color={'#333'} opacity={0.1}>
                                    <View style={[styles.welfareInner, { backgroundColor: '#fff', paddingTop: 40, paddingHorizontal: 10, height: WALFARE_TRI_height }]}>
                                        <Text numberOfLines={2} style={styles.shareTipsText}><Text style={styles.shareNumberText}>1.</Text>您直接邀请的用户是您的渔友,您渔友邀请的用户是您的渔小友。</Text>
                                        <Text numberOfLines={2} style={styles.shareTipsText}><Text style={styles.shareNumberText}>2.</Text>渔友兑换奖励需要您手动领取，可在“我的 - 兑换 - 收益记录”查看收益详情。</Text>
                                        <Text numberOfLines={2} style={styles.shareTipsText}><Text style={styles.shareNumberText}>3.</Text>回馈奖励通过后自动到账，可在“我的 - 兑换 - 收益记录”查看收益详情。</Text>
                                        <Text numberOfLines={2} style={styles.shareTipsText}><Text style={styles.shareNumberText}>4.</Text>交渔友严禁使用任何违规作弊手段,一经发现直接封号处理。</Text>
                                        <Text numberOfLines={2} style={styles.shareTipsText}><Text style={styles.shareNumberText}>5.</Text>活动长期有效,活动解释权归官方所有.</Text>
                                    </View>
                                </Shadow>
                            </View>
                            <View style={{ height: 20 }}/>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

function Share () {
    return (
        <View style={styles.shareContainer}>
            <TouchableOpacity onPress={() => {
                N.navigate('ShareUrlPage');
                DeviceEventEmitter.emit('hidePop');
            }} style={styles.shareView}>
                <Image source={share11} style={styles.shareImg}/>
                <Text style={styles.shareText}>链接交友</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                N.navigate('ShareQRCodePage');
                DeviceEventEmitter.emit('hidePop');
            }} style={styles.shareView}>
                <Image source={share10} style={styles.shareImg}/>
                <Text style={styles.shareText}>二维码交友</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                _copyStr(invite_code.get());
                DeviceEventEmitter.emit('hidePop');
            }} style={styles.shareView}>
                <Image source={share12} style={styles.shareImg}/>
                <Text style={styles.shareText}>邀请码交友</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    cashBackItem: {
        height: width * 0.9 * 0.25 * 294 / 273,
        overflow: 'hidden',
        width: width * 0.9 * 0.25,
    },
    cashLabel: {
        bottom: 0,
        color: '#fff',
        fontSize: 11,
        lineHeight: 45,
        textAlign: 'center',
        width: '100%',
    },
    cashTitle: {
        color: '#FF4A0A',
        fontSize: 11,
        left: '15%',
        lineHeight: 15,
        textAlign: 'center',
        top: '20%',
        width: '70%',
    },
    codeNumber: {
        color: '#FF4400',
        fontSize: 16,
    },
    codeWrap: {
        // backgroundColor: '#321',
        height: width * 0.15,
        paddingHorizontal: 15,
        paddingTop: 10,
        width: width * 0.75
    },
    copyBtn: {
        borderColor: '#FF3B00',
        borderRadius: 15,
        borderWidth: 1,
        color: '#FF3B00',
        fontSize: 13,
        height: 30,
        lineHeight: 30,
        overflow: 'hidden',
        textAlign: 'center',
        width: 60,
    },
    inviteCode: {
        color: '#353535',
        fontSize: 13,
    },
    inviteWrap: {
        height: width * 0.33,
        marginBottom: 25,
        paddingHorizontal: 15,
        paddingTop: 18,
        width: width * 0.9,
    },
    popBtn: {
        alignItems: 'center',
        backgroundColor: '#FF3E00',
        borderRadius: 22,
        height: 44,
        justifyContent: 'center',
        marginBottom: 10,
        marginTop: 20,
        width: '70%'
    },
    popContainer: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        justifyContent: 'space-between',
        paddingBottom: 10,
        width: width * 0.8
    },
    popImage: {
        height: 85,
        transform: [{ translateY: -50 }],
        width: 113
    },
    progressInner: {
        borderRadius: 6,
        height: '100%',
        overflow: 'hidden',
        width: '60%',
    },
    progressWrap: {
        backgroundColor: '#FFE4B8',
        borderRadius: 6,
        height: 12,
        marginVertical: 8,
        overflow: 'hidden',
        width: '94%',
    },
    rewardPopBtn: {
        alignItems: 'center',
        backgroundColor: '#FFF66C',
        borderRadius: 30,
        bottom: '9%',
        height: 50,
        justifyContent: 'center',
        left: '15%',
        position: 'absolute',
        width: '70%'
    },
    rewardPopText: {
        color: '#834D00',
        fontSize: 16,
        marginTop: '5%',
        position: 'absolute',
        textAlign: 'center',
        top: '50%',
        width: '100%'
    },
    scrollWrap: {
        backgroundColor: '#FF9331',
    },
    shareBg: {
        width,
        zIndex: -1,
    },
    shareBgWrap: {
        height: 'auto',
        paddingTop: width * 0.6,
        width,
    },
    shareBtn: {
        borderRadius: 25,
        height: 50,
        width: width * 0.65,
    },
    shareBtnText: {
        color: '#E51E00',
        fontSize: 18,
        fontWeight: '600',
        height: '100%',
        lineHeight: 50,
        textAlign: 'center',
        width: '100%',
    },
    shareBtnTextWrap: {
        ...css.flex,
        borderRadius: 25,
        height: '100%',
        overflow: 'hidden',
        width: '100%',
    },
    shareContainer: {
        backgroundColor: '#fff',
        bottom: 0,
        flexDirection: 'row',
        height: 80,
        position: 'absolute',
        width: '100%'
    },
    shareImg: {
        height: 35,
        width: 35
    },
    shareInfoImage: {
        height: width * 0.93 * 951 / 1065,
        width: width * 0.93,
        // eslint-disable-next-line react-native/sort-styles
        marginTop: 20,
    },
    shareInfoTips: {
        color: '#fff',
        fontSize: 10,
        ...css.sy
    },
    shareNumberText: {
        color: '#FF9431'
    },
    shareText: {
        color: '#666',
        fontSize: 12
    },
    shareTipsText: {
        color: '#666',
        fontSize: 13,
        lineHeight: 26,
        paddingHorizontal: '2%',
        width: '100%'
    },
    shareTitle: {
        height: width * 0.45 * 93 / 522,
        top: 0,
        width: width * 0.45,
        zIndex: 10,
    },
    shareTitleText: {
        color: '#803000',
        fontSize: 15,
        fontWeight: '900',
    },
    shareView: {
        alignItems: 'center',
        height: 80,
        justifyContent: 'center',
        width: '33.333%'
    },
    tipsBtn: {
        borderBottomColor: '#FFFED567',
        borderBottomWidth: 1,
        color: '#FED567',
        fontSize: 13,
        fontWeight: '900',
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    tipsWrap: {
        // marginTop: width * 0.01,
        overflow: 'hidden',
    },
    wShareTitle: {
        height: 40,
        paddingLeft: 10,
        width: '100%',
    },
    wTitleText: {
        color: '#222',
        fontSize: 15,
    },
    welfareInner: {
        borderRadius: SHARE_ITEM_RADIUS,
        height: WALFARE_ONE_height,
        width: SHARE_ITEM_WIDTH,
    },
    welfareItemWrap: {
        height: 'auto',
        marginTop: 20,
        paddingTop: 5,
        width: 'auto',
    },
    welfareLabelText: {
        color: '#734209',
        fontSize: 14,
        lineHeight: 24,
        textAlign: 'left',
        width: '100%',
    },
    welfareProgressWrap: {
        backgroundColor: '#FFF8E7',
        borderRadius: 6,
        height: 160,
        marginTop: 15,
        overflow: 'hidden',
        padding: 10,
        width: '96%',
        ...css.auto,
    },
    welfareTargetText: {
        color: '#734209',
        fontSize: 12,
        lineHeight: 24,
        textAlign: 'right',
        width: '100%',
        ...css.sy
    },
    welfareTitleText: {
        color: '#222',
        fontSize: 16,
        fontWeight: '900',
    },
    welfareWrap: {
        height: 'auto',
        paddingHorizontal: 15,
        width: SHARE_ITEM_WIDTH,
    },
    wpiTitleWrap: {
        height: 40,
        justifyContent: 'space-between',
        width: '100%'
    },
});
