import React, { useState } from 'react';
import { SafeAreaView, Text, Image, View, StyleSheet, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { css } from '../../assets/style/css';
import feed1 from '../../assets/icon/feed/feed1.png';
import feed2 from '../../assets/icon/feed/feed2.png';
import Upload from '../../components/Upload';
import Header from '../../components/Header';
import { N } from '../../utils/router';
import { feedback } from '../../utils/api';
import toast from '../../utils/toast';
import Button from '../../components/Button';

const { width } = Dimensions.get('window');

function FeedBackPage () {
    const [images, setImages] = useState([]);
    const [text, setText] = useState('');
    const [phone, setPhone] = useState('');
    const [selectId, setSelectId] = useState(1);
    const view = <Image source={feed2} style={{ height: 50, width: 50 }}/>;
    const headerRight = <Text style={{ color: '#FF6C00' }}>反馈记录</Text>;

    function apiFeedback (callback) {
        if (!text || !phone || !images.length) {
            toast('请填写完整的问题描述!');
            callback();
            return;
        }
        feedback(selectId, text, images.map(image => image.uri), phone).then(r => {
            callback();
            if (!r.error) {
                toast('成功提交问题');
                N.goBack();
            }
        });
    }

    return (
        <SafeAreaView style={[css.safeAreaView, css.pr, { backgroundColor: '#F8F8F8' }]}>
            <Header scene={{ descriptor: { options: {} }, route: { name: '意见反馈' } }} navigation={N} onPress={() => N.navigate('FeedBackRecordsPage')} headerRight={headerRight}/>
            <View style={styles.container}>
                <View style={styles.selectView}>
                    <TouchableOpacity activeOpacity={1} onPress={() => setSelectId(1)} style={[styles.select, { backgroundColor: selectId === 1 ? '#FFF7F4' : '#fff' }]}>
                        <Text style={styles.selectTopBtn}>功能建议</Text>
                        <RenderSelectView select={selectId === 1}/>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => setSelectId(2)} style={[styles.select, { backgroundColor: selectId !== 1 ? '#FFF7F4' : '#fff' }]}>
                        <Text style={styles.selectTopBtn}>发现bug</Text>
                        <RenderSelectView select={selectId !== 1}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.centerView}>
                    <View style={styles.centerInputView}>
                        <Text style={{ color: '#353535', fontSize: 14 }}>问题描述：</Text>
                        <TextInput
                            maxLength={50}
                            multiline={true}
                            numberOfLines={2}
                            placeholder={'请详细描述您遇的建议或者遇到的问题'}
                            placeholderTextColor={'#C0C0C0'}
                            onChangeText={text => setText(text)}/>
                    </View>
                    <View style={styles.imageView}>
                        <Upload children={view} images={images} setImages={setImages} length={3}/>
                        <RenderImage images={images}/>
                    </View>
                    <Text style={{ color: '#999', fontSize: 11, lineHeight: 20 }}>添加图片</Text>
                    <Text style={{ color: '#999', fontSize: 11, lineHeight: 20 }}>最多支持3张图片</Text>
                </View>
            </View>
            <View style={styles.bottomView}>
                <Text>联系方式：</Text>
                <TextInput
                    maxLength={20}
                    placeholder={'QQ或者微信号'}
                    placeholderTextColor={'#999'}
                    onChangeText={phone => setPhone(phone)}/>
            </View>
            <View style={[styles.btn, css.pa, { bottom: 0 }]}>
                <Button name="提交反馈" onPress={callback => {
                    apiFeedback(callback);
                }}/>
            </View>
        </SafeAreaView>
    );
}

function RenderSelectView ({ select }) {
    if (select) {
        return (
            <View style={styles.selectBtnTrue} >
                <Image source={feed1} style={{ height: 7, width: 9 }}/>
            </View>
        );
    }
    return <View style={styles.selectBtn} />;
}

function RenderImage ({ images }) {
    const imageView = [];
    images.forEach(image => {
        imageView.push(
            <Image key={image.data + Date.now()} style={styles.image} source={{ uri: `data:${image.mime};base64,${image.data}` }} />
        );
    });
    return <>{imageView}</>;
}

const styles = StyleSheet.create({
    bottomView: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        flexDirection: 'row',
        height: 50,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 15,
        paddingLeft: 15,
        paddingRight: 15
    },
    btn: {
        alignItems: 'center',
        width
    },
    centerInputView: {
        backgroundColor: '#EDEDED',
        borderRadius: 4,
        height: 100,
        marginTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 15,
        width: '100%'
    },
    centerView: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        paddingBottom: 15,
        paddingLeft: '5%',
        paddingRight: '5%',
        width: '100%'
    },
    container: {
        borderRadius: 8,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15
    },
    image: {
        height: 50,
        marginLeft: 20,
        width: 50
    },
    imageView: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 50,
        marginBottom: 15,
        marginTop: 15,
        width: '100%'
    },
    select: {
        alignItems: 'center',
        borderRadius: 22,
        flexDirection: 'row',
        height: 45,
        justifyContent: 'center',
        width: 125
    },
    selectBtn: {
        borderColor: '#999',
        borderRadius: 10,
        borderWidth: 1,
        height: 20,
        marginLeft: 7,
        width: 20
    },
    selectBtnTrue: {
        alignItems: 'center',
        backgroundColor: '#FF3B00',
        borderRadius: 10,
        height: 20,
        justifyContent: 'center',
        marginLeft: 7,
        width: 20
    },
    selectTopBtn: {
        color: '#353535',
        fontSize: 15,
        fontWeight: '500'
    },
    selectView: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        flexDirection: 'row',
        height: 75,
        justifyContent: 'space-around',
        width: '100%'
    },
    sfeAreaView: {
        backgroundColor: '#F8F8F8',
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        width,
    }
});

export default FeedBackPage;
