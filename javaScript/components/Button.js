import React, { Component } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Shadow from './Shadow';
import { css } from '../assets/style/css';
const { height, width } = Dimensions.get('window');
/**
 * <Button type={2} name={'确定'} onPress={fn}/>
 * <Button onPress={(callback) => {
        setTimeout(() => {
            callback && callback();
        }, 2000);
    }}/>
 * **/
// 样式序列 1长圆样式 2.长直样式
function proxyGet (target, key) {
    if (key in target) {
        return target[key];
    } else {
        return {};
    }
}
export default class Button extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
        };
        this.type = this.props.type || 1;
        this.shadow = this.props.shadow;
    }

    renderLoading () {
        return this.state.loading ? (
            <ActivityIndicator
                size="small"
                color="#FFF"
                style={styles.loadingIcon}
            />
        ) : null;
    }

    btnOnPress () {
        try {
            if (!this.state.loading) {
                this.setState({ loading: true });
                this.props.onPress && this.props.onPress(() => {
                    this.setState({ loading: false });
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    render () {
        try {
            const typeStyle = {
                1: {
                    width: this.props.width || width * 0.9,
                    borderRadius: 23,
                },
                2: {
                    width: width
                }
            };
            const typeStyleProxy = new Proxy(typeStyle, {
                get: proxyGet
            });
            return <Shadow style={[styles.buntWrap, typeStyleProxy[this.type]]} color={this.shadow}>
                <LinearGradient colors={['#FF9C00', '#FF3E00']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={[styles.buntWrap, styles.lineStyle, typeStyleProxy[this.type]]}>
                    <TouchableOpacity style={styles.touchBtn} activeOpacity={1} onPress={() => { this.btnOnPress(); }}>
                        {this.renderLoading.call(this)}
                        <Text style={styles.btnText}>
                            {this.props.name || this.props.title || '确定'}
                        </Text>
                    </TouchableOpacity>
                </LinearGradient>
            </Shadow>;
        } catch (e) {
            return null;
        }
    }
}
const styles = StyleSheet.create({
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '900',
        height: 46,
        letterSpacing: 1,
        lineHeight: 46,
        // textAlign: 'center',
        // width: '100%'
    },
    buntWrap: {
        height: 46,
        lineHeight: 46
    },
    lineStyle: {
        overflow: 'hidden',
    },
    loadingIcon: {
        marginHorizontal: 10,
    },
    touchBtn: {
        height: '100%',
        width: '100%',
        ...css.flex,
    }
});