import React from 'react';
import { SafeAreaView, Image, Text, StyleSheet, View } from 'react-native';
import { css } from '../../assets/style/css';
import ListGeneral from '../../components/ListGeneral';
import { propLogs } from '../../utils/api';
import { transformTime } from '../../utils/util';

const itemHeight = 130;
const itemMarginTop = 10;
const PROP_SOURCE = {
    1: '连续签到',
    2: '摸鱼夺宝产出',
    3: '系统赠送'
};

function CardPackageRecordsPage () {
    return (
        <SafeAreaView style={[css.safeAreaView, { paddingLeft: 15, paddingRight: 15, flex: 1, backgroundColor: '#F8F8F8' }]}>
            <ListGeneral
                itemHeight={itemHeight}
                itemMarginTop={itemMarginTop}
                getList={ (page, num, callback) => {
                    propLogs(page, num).then(r => {
                        !r.error && callback(r.data);
                    });
                }}
                renderItem={item => {
                    const { prop_log_id, source: s, updated_at, is_used, prop } = item;
                    const { label, source, usage_range, icon: uri } = prop;
                    return (
                        <>
                            <View style={styles.itemView} key={prop_log_id}>
                                <View style={[css.flexRCSB, styles.item, { borderBottomWidth: 1, borderBottomColor: '#EDEDED' }]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={{ uri }} style={styles.image} />
                                        <Text numberOfLines={1} style={{ color: '#353535', maxWidth: 130 }}>{label}</Text>
                                    </View>
                                    <Text numberOfLines={1} style={{ color: is_used ? '#FF3B00' : '#53C23B' }}>{is_used ? '使用道具' : '获得道具'}</Text>
                                </View>
                                <View style={ [styles.item, styles.itemBottom]}>
                                    <View style={css.flexRCSB}>
                                        <Text numberOfLines={1} style={[styles.text, { fontSize: 13 }]}>{is_used ? '道具用途：' : '道具来源：'}{is_used ? usage_range : PROP_SOURCE[s]}</Text>
                                        <Text numberOfLines={1} style={[styles.text, { fontSize: 12 }]}>使用数量：1</Text>
                                    </View>
                                    <Text numberOfLines={1} style={{ fontSize: 10, color: '#999' }}>获得时间：{transformTime(updated_at)}</Text>
                                </View>
                            </View>
                        </>
                    );
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    image: {
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
    itemBottom: {
        height: 70,
        justifyContent: 'space-between',
        paddingBottom: 15,
        paddingTop: 15
    },
    itemView: {
        backgroundColor: '#fff',
        borderRadius: 8,
        height: itemHeight,
        marginTop: itemMarginTop
    },
    text: {
        color: '#353535',
        fontSize: 14
    }
});

export default CardPackageRecordsPage;
