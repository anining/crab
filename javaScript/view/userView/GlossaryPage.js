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
    ScrollView, InteractionManager,
} from 'react-native';
import { css } from '../../assets/style/css';
import header3 from '../../assets/icon/header/header3.png';
import ImageAuto from '../../components/ImageAuto';
import Header, { MAIN_HEADER_HEIGHT } from '../../components/Header';
import { deleteNoteBook, getNoteBook } from '../../utils/api';
import game65 from '../../assets/icon/game/game65.png';
import GameDialog from '../../components/GameDialog';
import IdiomCard from '../../components/IdiomCard';
import game37 from '../../assets/icon/game/game37.png';
import game70 from '../../assets/icon/game/game70.png';
import toast from '../../utils/toast';
const { height, width } = Dimensions.get('window');
export default class GlossaryPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            glossaryInfo: null
        };
    }

    async componentDidMount () {
        InteractionManager.runAfterInteractions(async () => {
            await this._getNoteBook();
        });
    }

    async _getNoteBook () {
        const ret = await getNoteBook();
        if (ret && !ret.error) {
            this.setState({
                glossaryInfo: ret.data
            });
        }
    }

    async _deleteNoteBook (notebook_id) {
        const ret = await deleteNoteBook(notebook_id);
        if (ret && !ret.error) {
            toast('移除成功');
            await this._getNoteBook();
        }
    }

    _renderIdiomList () {
        try {
            if (this.state.glossaryInfo && this.state.glossaryInfo.length) {
                const view = [];
                this.state.glossaryInfo.forEach((item, index) => {
                    view.push(
                        <TouchableOpacity activeOpacity={1} key={`content${index}`} style={[css.flex, styles.idiomItemWrap]} onPress={() => {
                            DeviceEventEmitter.emit('showPop', <GameDialog callback={async () => {
                                await this._deleteNoteBook(item.notebook_id);
                            }} btn={'移除生词本'} content={<IdiomCard content={item.idiom.idiom} idiom={item.idiom}/>}/>);
                        }}>
                            <ImageAuto source={game37} style={{ width: 16, marginRight: 5 }}/>
                            <Text style={[css.gf, styles.lineIdiom]} numberOfLines={1}>{item.idiom.idiom}</Text>
                        </TouchableOpacity>,
                    );
                });
                return view;
            } else {
                return <View style={[css.flex, css.fw, { flex: 1 }]}>
                    <ImageAuto source={game70} style={{ width: 160, marginBottom: 30 }}/>
                    <Text style={[styles.emptyText]}>你还没有加入过成语~</Text>
                </View>;
            }
        } catch (e) {
            console.log(e);
            return <View style={[css.flex, css.fw, { flex: 1 }]}>
                <ImageAuto source={game70} style={{ width: 160, marginBottom: 30 }}/>
                <Text style={[styles.emptyText]}>你还没有加入过成语~</Text>
            </View>;
        }
    }

    render () {
        return (
            <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#FED465' }]}>
                <Header color={'#fff'} label={'生词本'} style={[{ backgroundColor: '#FED465', borderBottomWidth: 0 }, css.pa]} icon={header3}/>
                <ImageBackground source={game65} style={[styles.glossaryWrap, css.pr]}>
                    <ScrollView style={[css.pa, styles.glossaryInnerBox]}>
                        <View style={[css.flex, css.fw, css.js, css.afs, { flex: 1, height: 'auto', minHeight: 200 }]}>
                            {this._renderIdiomList()}
                        </View>
                    </ScrollView>
                </ImageBackground>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    emptyText: {
        color: '#666',
        fontSize: 16,
        lineHeight: 40,
        textAlign: 'center',
        width: '100%',
        ...css.gf
    },
    glossaryInnerBox: {
        height: width * 1.25,
        left: width * 0.1,
        paddingLeft: 5,
        paddingTop: 20,
        top: width * 0.25,
        width: width * 0.8
    },
    glossaryWrap: {
        height: width * 2001 / 1125,
        width: width
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
    lineIdiom: {
        fontSize: 14,
    },
});
