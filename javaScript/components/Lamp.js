import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View, Easing, Dimensions, Image, } from 'react-native';
import { css } from '../assets/style/css';
import PropTypes from 'prop-types';
const { height, width } = Dimensions.get('window');
const LAMP_HEIGHT = 28; // 单个高度
const LAMP_BORDER_RADIUS = 14;
const LAMP_TIME = 600;
const DELAY_TIME = 1000;
const LAMP_ICON_WIDTH = 35;

export default class Lamp extends Component {
    constructor (props) {
        super(props);
        this.state = {
            translateValue: new Animated.Value(0), // 定位初始值为0
            LampList: [{}, {}, {}],
            stop: false // 是否暂停
        };
        this.width = this.props.width;
        this.backgroundColor = this.props.backgroundColor;
        this.color = this.props.color;
        this.color1 = this.props.color1;
    }

    async componentDidMount () {
        // this.AnimationStart.call(this, 0, this.state.LampList.length);
        this.start();
    }

    AnimationStart (index, count) {
        index++;
        Animated.timing(this.state.translateValue, {
            toValue: -LAMP_HEIGHT * index,
            duration: LAMP_TIME,
            easing: Easing.linear(),
            delay: DELAY_TIME, // 文字停留时间
            useNativeDriver: true,
        }).start(() => {
            if (index >= count) {
                index = 0;
                this.state.translateValue.setValue(0);
            }
            if (!this.state.stop) {
                this.AnimationStart.call(this, index, this.state.LampList.length);
            }
        });
    }

    start () {
        if (this.state.stop) {
            this.setState({
                stop: false
            }, () => {
                this.AnimationStart.call(this, index, this.state.LampList.length);
            });
        } else {
            this.AnimationStart.call(this, index, this.state.LampList.length);
        }
    }

    stop () {
        this.setState({
            stop: true
        });
    }

    render () {
        return (
            <View style={[css.flex, styles.lamp, {
                width: this.width,
                backgroundColor: this.backgroundColor
            }]}>
                {/* <View style={[css.flex, css.js, { width: LAMP_ICON_WIDTH, height: LAMP_HEIGHT }]} > */}
                {/*    /!* <Image source={home2} style={styles.icon} /> *!/ */}
                {/* </View> */}
                <View style={styles.animatedWrap}>
                    <Animated.View style={{ ...styles.lampContent, transform: [{ translateY: this.state.translateValue, }] }}>
                        {(() => {
                            if (this.state.LampList && this.state.LampList.length) {
                                const lampView = [];
                                this.state.LampList.forEach((item, index) => {
                                    lampView.push(
                                        <Text style={[styles.lampItem, {
                                            color: this.color
                                        }]} key={index} numberOfLines={1} > 恭喜 <Text style={{ color: this.color1 }}> xxx </Text>成功领取现金 <Text style={{ color: this.color1 }}> xxx 元 </Text></Text>,
                                    );
                                });
                                return lampView;
                            } else {
                                return (
                                    <Text style={styles.lampItem}>
                                        暂时没有数据
                                    </Text>
                                );
                            }
                        }).call(this)}
                    </Animated.View>
                </View>
            </View>
        );
    }
}

Lamp.propTypes = {
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
    color1: PropTypes.string,
};
Lamp.defaultProps = {
    width: '70%',
    backgroundColor: '#F02E21',
    color: '#fff',
    color1: '#ffebc1'
};

const styles = StyleSheet.create({
    animatedWrap: {
        borderRadius: LAMP_BORDER_RADIUS,
        flex: 1,
        height: LAMP_HEIGHT,
        overflow: 'hidden',
    },
    icon: {
        height: 20,
        width: 20,
    },
    lamp: {
        alignItems: 'flex-start',
        backgroundColor: '#F02E21',
        height: LAMP_HEIGHT,
        justifyContent: 'flex-start',
        marginVertical: 10,
        overflow: 'hidden',
        width: '70%',
        ...css.auto,
        borderRadius: LAMP_BORDER_RADIUS,
    },
    lampContent: {
        flex: 1,
        paddingLeft: 25,
        paddingRight: 20,
    },
    lampItem: {
        color: '#fff',
        height: LAMP_HEIGHT,
        lineHeight: LAMP_HEIGHT,
        textAlign: 'center',
    },
});
