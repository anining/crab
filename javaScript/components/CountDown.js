import React, { Component } from 'react';
import { Text, TextInput, View } from 'react-native';
import { _if, djangoTime, msecsTransform, setAndroidTime } from '../utils/util';
import { css } from '../assets/style/css';
import PropTypes from 'prop-types';
let millisecond = 9;
export default class CountDown extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor (props) {
        super(props);
        this.timer1 = null;
        this.timer2 = null;
    }

    componentDidMount () {
        const propsTime = +new Date(djangoTime(this.props.time));
        this.setTime(this.secondText && propsTime && propsTime >= +new Date(), () => {
            this.secondText && this.secondText.setNativeProps({
                text: `${msecsTransform(propsTime - (+new Date()))}`
            });
        }, this.props.callback, 1000, this.timer1);
        this.props.millisecond && this.setTime(this.millisecondText && propsTime && propsTime >= +new Date(), () => {
            if (millisecond > 0) { millisecond--; } else { millisecond = 9; }
            this.millisecondText && this.millisecondText.setNativeProps({
                text: `.${millisecond}`
            });
        }, null, 100, this.timer2);
    }

    setTime (ifSentence, ifSentenceDo, callback, time = 1000, timer) {
        timer = setAndroidTime(() => {
            try {
                if (ifSentence) {
                    ifSentenceDo && ifSentenceDo();
                    if (timer && timer.stop && typeof timer.stop === 'function') {
                        timer.stop();
                        timer = null;
                    }
                    this.setTime(...arguments);
                } else {
                    callback && callback();
                    if (timer && timer.stop && typeof timer.stop === 'function') {
                        timer.stop();
                        timer = null;
                    }
                }
            } catch (e) {
                console.log(e);
                timer = null;
            }
        }, time);
    }

    componentWillUnmount () {
        try {
            this.timer1 && this.timer1.stop();
            this.timer1 = null;
            this.timer2 && this.timer2.stop();
            this.timer2 = null;
        } catch (e) {
            console.log(e);
        }
    }

    render () {
        if (this.props.time) {
            try {
                return (
                    <View style={[css.flex, css.pr, { height: 30, paddingHorizontal: 5 }, this.props.viewStyle]}>
                        <View style={[css.pa, css.afs, { flex: 1, height: '100%', width: '100%' }]}/>
                        <TextInput disableFullscreenUI={false} style={[{ padding: 0 }, (this.props.style)]} ref={ref => this.secondText = ref} defaultValue={msecsTransform(+new Date(djangoTime(this.props.time)) - (+new Date()))}/>
                        {_if(this.props.millisecond, res =>
                            <TextInput disableFullscreenUI={false} style={[{ padding: 0 }, (this.props.style)]} ref={ref => this.millisecondText = ref} defaultValue={'.9'}/>)}
                        <Text style={[(this.props.style)]}>{this.props.tips}</Text>
                    </View>
                );
            } catch (e) {
                console.log(e);
                return null;
            }
        } else {
            return null;
        }
    }
}
CountDown.propTypes = {
    style: PropTypes.object,
    viewStyle: PropTypes.object,
    callback: PropTypes.func,
    millisecond: PropTypes.bool
};
CountDown.defaultProps = {
    style: {},
    viewStyle: {},
    callback: () => {},
    millisecond: false
};
