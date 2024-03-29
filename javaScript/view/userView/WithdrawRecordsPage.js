import React from 'react';
import { SafeAreaView, Dimensions, TouchableOpacity, Image, Text, StyleSheet, View, DeviceEventEmitter } from 'react-native';
import { css } from '../../assets/style/css';
import ListGeneral from '../../components/ListGeneral';
import Header from '../../components/Header';
import { N } from '../../utils/router';
import { withdrawLogs } from '../../utils/api';
import with9 from '../../assets/icon/withdraw/withdraw9.png';
import { _toFixed, transformTime } from '../../utils/util';

const itemHeight = 110;
const itemMarginTop = 10;
const { width } = Dimensions.get('window');
const WITHDRAW_TYPE = {
    wx: '微信账户',
    ali: '支付宝账户'
};

function WithdrawRecordsPage () {
    const headerRight = <Text style={{ color: '#FF6C00', fontSize: 14 }}>状态说明</Text>;

    return (
        <SafeAreaView style={css.safeAreaView}>
            <Header scene={{ descriptor: { options: {} }, route: { name: '兑换记录' } }} navigation={N} onPress={() => {
                DeviceEventEmitter.emit('showPop', <Image source={with9} style={{ height: width * 0.8 * (1158 / 885), width: width * 0.8 }}/>);
            }} headerRight={headerRight}/>
            <View style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
                <ListGeneral
                    itemHeight={itemHeight}
                    itemMarginTop={itemMarginTop}
                    getList={ (page, num, callback) => {
                        withdrawLogs(page, num).then(r => {
                            console.log(r);
                            r && !r.error && callback(r.data);
                        });
                    }}
                    renderItem={item => {
                        const { withdraw_log_id, status, created_at, withdraw_type, money } = item;
                        return (
                            <>
                                <View style={styles.itemView} key={withdraw_log_id}>
                                    <View style={[css.flexRCSB, styles.item, { borderBottomWidth: 1, borderBottomColor: '#EDEDED' }]}>
                                        <Text numberOfLines={1} style={{ fontSize: 12, color: '#999', maxWidth: 200 }}>申请时间：{transformTime(created_at)}</Text>
                                        {/* <Text style={{ fontSize: 14, fontWeight: '600' }}>({balance}元)</Text> */}
                                        <Text numberOfLines={1} style={{ fontSize: 18, color: '#FF6C00', fontWeight: '600' }}>{_toFixed(money, 0)}元</Text>
                                    </View>
                                    <RenderView status={status} withdraw_type={withdraw_type}/>
                                </View>
                            </>
                        );
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

function RenderView ({ status, withdraw_type }) {
    switch (status) {
    case 2:
        return (
            <View style={[css.flexRCSB, styles.item, { height: 50 }]}>
                <Text numberOfLines={1} style={ { color: '#0045FF', fontSize: 13, maxWidth: 180 }}>兑换中</Text>
                <Text numberOfLines={1} style={{ color: '#999', fontSize: 12 }}>24小时内审核到账</Text>
            </View>
        );
    case 3:
        return (
            <View style={[css.flexRCSB, styles.item, { height: 50 }]}>
                <Text numberOfLines={1} style={ { color: '#53C23B', fontSize: 13, maxWidth: 180 }}>兑换成功</Text>
                <Text numberOfLines={1} style={{ color: '#999', fontSize: 12 }}>{WITHDRAW_TYPE[withdraw_type]}</Text>
            </View>
        );
    default:
        return (
            <View style={[css.flexRCSB, styles.item, { height: 50 }]}>
                <Text numberOfLines={1} style={ { color: '#999', fontSize: 11 }}>兑换失败(兑换账户异常)，金币已退回</Text>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    N.navigate('HelpCenterPage');
                }}>
                    <Text numberOfLines={1} style={{ color: '#FA0000', fontSize: 13, padding: 5 }}>我有疑问</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        borderRadius: 15,
        height: 30,
        marginRight: 5,
        width: 30
    },
    item: {
        height: 60,
        paddingLeft: 15,
        paddingRight: 15,
        width: '100%'
    },
    itemView: {
        backgroundColor: '#FFF',
        height: itemHeight,
        marginTop: itemMarginTop,
    },
    text: {
        color: '#353535',
        fontSize: 14
    }
});

export default WithdrawRecordsPage;
