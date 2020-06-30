import { Component } from 'react';
import * as React from 'karet';
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    DeviceEventEmitter,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { getter } from '../../utils/store';
import { css } from '../../assets/style/css';
import GameDialog from '../../components/GameDialog';
import { N } from '../../utils/router';
import ImageAuto from '../../components/ImageAuto';
import game25 from '../../assets/icon/game/game25.png';
import game31 from '../../assets/icon/game/game31.png';
import EnlargeView from '../../components/EnlargeView';
import game22 from '../../assets/icon/game/game22.png';
import game4 from '../../assets/icon/game/game4.png';
import game8 from '../../assets/icon/game/game8.png';
import game37 from '../../assets/icon/game/game37.png';
import game14 from '../../assets/icon/game/game14.png';
import game16 from '../../assets/icon/game/game16.png';
import { HEADER_HEIGHT } from '../tabView/HomePage';
import LottieView from 'lottie-react-native';
import chest from '../../lottie/chest';
import PropTypes from 'prop-types';
import { transformMoney } from '../../utils/util';
import ShiftView from '../../components/ShiftView';
import game20 from '../../assets/icon/game/game20.png';
import IdiomCard from '../../components/IdiomCard';

const { height, width } = Dimensions.get('window');
export default class PassGamePage extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor (props) {
        super(props);
        this.state = {};
        // this.correct_rate = getter(['user.correct_rate']).correct_rate;
        this.paramsInfo = this.props.route.params.info;
    }

    componentDidMount () {
        console.log(this);
        if (this.paramsInfo) {
            DeviceEventEmitter.emit('showPop', <View
                style={[css.flex, css.pr, css.flex, { transform: [{ translateY: -width * 0.2 }] }]}>
                <LottieView ref={ref => this.lottie = ref} key={'chest'} renderMode={'HARDWARE'}
                    style={{ width: width * 0.8, height: 'auto' }} imageAssetsFolder={'chest'} source={chest}
                    loop={false} autoPlay={true} speed={1} onAnimationFinish={() => {
                        DeviceEventEmitter.emit('hidePop');
                    }}/>
                <View style={[styles.passDataNumber, css.flex, css.auto, css.pa, {
                    top: width * 0.8 - 50,
                    left: width * 0.4 - 50,
                }]}>
                    <ImageAuto source={game22} width={33}/>
                    <Text style={styles.hdnText}>+{transformMoney(this.paramsInfo.add_balance)}</Text>
                </View>
            </View>);
        } else {
            // N.goBack();
            console.log('??');
        }
    }

    _renderIdiomList () {
        try {
            if (this.paramsInfo && this.paramsInfo.content) {
                const view = [];
                this.paramsInfo.content.forEach((item, index) => {
                    view.push(
                        <TouchableOpacity key={`content${index}`} activeOpacity={1}
                            style={[css.flex, styles.idiomItemWrap]} onPress={() => {
                                DeviceEventEmitter.emit('showPop', <GameDialog callback={() => {
                                    // N.navigate('AnswerPage');
                                }} btn={'加入生词本'} content={<IdiomCard/>}/>);
                            }}>
                            <ImageAuto source={game37} style={{ width: 16, marginRight: 5 }}/>
                            <Text style={[css.gf, styles.lineIdiom]} numberOfLines={1}>{item}</Text>
                        </TouchableOpacity>,
                    );
                });
                return view;
            }
        } catch (e) {
            return null;
        }
    }

    render () {
        try {
            return <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#FED465' }]}>
                <ScrollView style={{ flex: 1 }}>
                    {/* 头部显示区域 */}
                    <View style={[css.flex, styles.homeHeaderWrap, css.sp]}>
                        <TouchableOpacity activeOpacity={1} style={[styles.headerDataNumber, css.flex]} onPress={() => {
                            DeviceEventEmitter.emit('showPop', <GameDialog icon={game20} callback={() => {
                                N.navigate('AnswerPage');
                            }} btn={'做任务获取道具'} tips={<Text>道具每 <Text style={{ color: '#FF6C00' }}>30分钟</Text> 系统赠送1个
                                最多同时持有 <Text style={{ color: '#FF6C00' }}>10个</Text> 道具做任务随机产出道具</Text>} />);
                        }}>
                            <ImageAuto source={game25} width={33}/>
                            <View style={styles.hdnTextWrap}>
                                <Text style={styles.hdnText}> <Text style={{ color: '#FF6C00' }}>6</Text>/10</Text>
                            </View>
                            <ImageAuto source={game31} width={22}/>
                        </TouchableOpacity>
                        {/* eslint-disable-next-line no-return-assign */}
                        <EnlargeView ref={ref => this.enlarge = ref}>
                            <TouchableOpacity activeOpacity={1}
                                style={[styles.headerDataNumber, css.flex, css.sp, { width: 180 }]}>
                                <ImageAuto source={game22} width={33}/>
                                <View style={styles.hdnTextWrap}>
                                    <Text style={styles.hdnText}>32132131</Text>
                                </View>
                                <Text style={styles.withdrawBtn} onPress={() => {
                                    N.replace('WithdrawPage');
                                }}>提现</Text>
                            </TouchableOpacity>
                        </EnlargeView>
                    </View>
                    <ShiftView callback={() => {
                        // N.navigate('GamePage');
                    }} ref={ref => this.startGame = ref} autoPlay={false} loop={false} duration={1000} delay={0}
                    startSite={[25, HEADER_HEIGHT - 28]} endSite={[width * 0.5 + 90, width * 1.4]}>
                        <ImageAuto source={game25} width={33}/>
                    </ShiftView>
                    {/* 核心显示区域 */}
                    <View style={[styles.gameResWrap, css.pr]}>
                        <ImageBackground source={game4} style={[css.flex, css.pa, styles.gamePassHeader]}>
                            <Text style={[styles.gamePassText]} numberOfLines={1}>恭喜通过1231关</Text>
                        </ImageBackground>
                        <View style={[styles.gameCanvasWrap]}>
                            <View style={[styles.gameCanvasInner, css.flex, css.fw, css.afs]}>
                                <Text style={[styles.gamePassTips, css.gf]}>您已超越<Text
                                    style={{ fontSize: 20, color: 'red' }}>43.82%</Text>用户</Text>
                                <View style={[css.flex, css.fw, styles.idiomWrap, css.afs, css.js]}>
                                    {this._renderIdiomList()}
                                </View>
                                <View style={[css.flex, css.fw, styles.progressWrap, css.pr]}>
                                    <ImageAuto style={[css.pa, styles.redImage]} source={game16}/>
                                    <ImageAuto style={[css.pa, styles.redImage, { left: 100 }]} source={game16}/>
                                    <View style={[css.flex, styles.progressBox, css.js]}>
                                        <View style={[css.flex, styles.progressInner]}/>
                                    </View>
                                    <View style={{ height: 20, width: '100%' }}/>
                                    <Text style={[styles.gamePassTips, css.gf, { fontSize: 15 }]}>再闯关<Text
                                        style={{ fontSize: 17, color: 'red' }}>10</Text>关领红包</Text>
                                </View>
                                <View style={[css.flex, css.sp, styles.nextBtnWrap]}>
                                    <TouchableOpacity activeOpacity={1} onPress={() => {
                                        N.goBack();
                                    }}>
                                        <ImageAuto source={game14} style={{ width: 55 }}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={1} onPress={() => {
                                        // N.navigate('GamePage');
                                        this.startGame && this.startGame.start();
                                    }}>
                                        <ImageAuto source={game8} style={{ width: 200 }}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}

// PassGamePage.propTypes = {
//     info: PropTypes.object
// };
// PassGamePage.defaultProps = {
//     info: {
//         add_balance: 0.01
//     },
// };
const styles = StyleSheet.create({
    gameCanvasInner: {
        backgroundColor: '#FFF7A9',
        borderRadius: 10,
        height: '100%',
        overflow: 'hidden',
        paddingTop: width * 0.18,
        width: '100%',
    },
    gameCanvasWrap: {
        backgroundColor: '#FFDF7A',
        height: width * 1.2,
        minHeight: 500,
        width: width - 20,
        ...css.auto,
        borderRadius: 10,
        overflow: 'hidden',
        paddingBottom: 10,
    },
    gamePassHeader: {
        height: width * 0.8 * 291 / 831,
        left: width * 0.1,
        paddingBottom: width * 0.12,
        top: width * 0.05,
        width: width * 0.8,
    },
    gamePassText: {
        color: '#fff',
        fontSize: 20,
        ...css.gf,
    },
    gamePassTips: {
        color: '#353535',
        fontSize: 17,
    },
    gameResWrap: {
        paddingTop: width * 0.2,
        width,
    },
    hdnText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '900',
    },
    hdnTextWrap: {
        marginHorizontal: 6,
    },
    headerDataNumber: {
        backgroundColor: 'rgba(255,166,0,0.5)',
        borderRadius: 15,
        height: 30,
        overflow: 'hidden',
        paddingHorizontal: 5,
        width: 120,
    },
    homeBottomWrap: {
        bottom: 0,
        height: width * 1032 / 1125,
        paddingTop: width * 0.27,
        width,
        zIndex: 10,
    },
    homeHeaderWrap: {
        height: HEADER_HEIGHT,
        left: 0,
        overflow: 'hidden',
        paddingHorizontal: 20,
        paddingTop: 35,
        top: 0,
        width,
    },
    idiomItemWrap: {
        borderColor: '#594134',
        borderRadius: 17,
        borderWidth: 1,
        height: 34,
        marginBottom: 10,
        marginLeft: width * 0.02,
        overflow: 'hidden',
        transform: [{ scale: 0.96 }],
        width: '30%',
    },
    idiomWrap: {
        backgroundColor: '#FFE784',
        borderRadius: 10,
        height: 120,
        marginTop: 30,
        paddingHorizontal: 5,
        paddingVertical: 20,
        width: '92%',
    },
    lineIdiom: {
        fontSize: 15,
    },
    nextBtnWrap: {
        height: 100,
        overflow: 'hidden',
        width: '77%',
    },
    passDataNumber: {
        backgroundColor: 'rgba(0,0,0,.5)',
        borderRadius: 15,
        height: 30,
        overflow: 'hidden',
        paddingHorizontal: 5,
        width: 100,
    },
    progressBox: {
        backgroundColor: '#FFE784',
        borderRadius: 8,
        height: 16,
        overflow: 'hidden',
        width: '100%',
    },
    progressInner: {
        backgroundColor: '#FF6C00',
        borderRadius: 8,
        height: 16,
        width: 30,
    },
    progressWrap: {
        // backgroundColor: 'red',
        height: 130,
        marginTop: 20,
        width: '70%',
    },
    redImage: {
        left: 20,
        top: 0,
        width: 30,
    },
    withdrawBtn: {
        backgroundColor: '#FF6C00',
        borderRadius: 12,
        color: '#fff',
        fontSize: 12,
        height: 24,
        lineHeight: 24,
        overflow: 'hidden',
        textAlign: 'center',
        width: 46,
    },
});