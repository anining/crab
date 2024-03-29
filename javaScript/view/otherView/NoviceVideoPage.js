import React, { Component } from 'react';
import { StyleSheet, Text, View, DeviceEventEmitter } from 'react-native';
import Video from 'react-native-video';
import loadingJson from '../../lottie/loading';
import LottieView from 'lottie-react-native';
import { css } from '../../assets/style/css';
import { _if } from '../../utils/util';
import { bindData, getGlobal, getPath } from '../../global/global';
import { N } from '../../utils/router';
import { setter } from '../../utils/store';
// NOVICE_VIDEO
export default class NoviceVideoPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            play: false,
            user: bindData('user', this)
        };
        this.noviceVideo = getPath(['configObj', 'app_other_info', 'value', 'noviceVideo'], getGlobal('app'), '');
    }

    async _end () {
        try {
            setter([['new_user_video', true]]);
            DeviceEventEmitter.emit('reloadAnswer');
            N.goBack();
        } catch (e) {
            console.log(e);
        }
    }

    _onload () {
        this.setState({
            play: true
        });
    }

    render () {
        return (
            <View style={{ flex: 1 }}>
                {_if(!this.state.play, res => <View style={[css.flex, css.pr, css.fw]}>
                    <LottieView
                        style={[{ width: 200 }]}
                        source={loadingJson}
                        imageAssetsFolder={'loading'}
                        autoPlay={true}
                        loop={true}
                    />
                    <Text style={styles.loadingText}>视频正在加载中，请耐心等候...</Text>
                </View>)}
                <Video source={{ uri: this.noviceVideo }}
                    ref={(ref) => { this.player = ref; }}
                    controls = {true}
                    disableFocus = {true}
                    posterResizeMode={'center'}
                    resizeMode={'contain'}
                    onLoad={() => {
                        this._onload();
                    }}
                    onEnd={async () => {
                        await this._end();
                    }}
                    style={styles.backgroundVideo} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    backgroundVideo: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    loadingText: {
        color: '#e1852b',
        fontSize: 15,
        textAlign: 'center',
        width: '100%'
    }
});
