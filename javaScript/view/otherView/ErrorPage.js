import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { css } from '../../assets/style/css';

export default function ErrorPage () {
    return (
        <SafeAreaView style={css.safeAreaView}>
            <Text>ErrorPage</Text>
        </SafeAreaView>
    );
}
