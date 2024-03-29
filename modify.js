const fs = require('fs');
try {
    console.log('开始修改LargeList-v3代码');
    const rootDir = process.cwd();

    const file = `${rootDir}/node_modules/react-native-largelist-v3/LargeList.js`;
    const data = fs.readFileSync(file, 'utf8');
    if (data.indexOf('header.onLayout;/*') !== -1) {
        // eslint-disable-next-line no-throw-literal
        throw '> 已经修复过了';
    }
    const result = data.replace('header.onLayout;', 'header.onLayout;/*').replace('_renderFooter() {', '*/return React.cloneElement(header, {style: StyleSheet.flatten([header.props.style, transform]),onLayout: this._onHeaderLayout,});}_renderFooter() {');
    fs.writeFileSync(file, result, 'utf8');
    console.log('> 修复成功1!');
} catch (error) {
    console.error(error);
}

try {
    console.log('开始修改SpringScrollView代码');
    const rootDir = process.cwd();

    const file = `${rootDir}/node_modules/react-native-spring-scrollview/SpringScrollView.js`;
    const data = fs.readFileSync(file, 'utf8');
    const dataFix = 'react-native/Libraries/Components/TextInput/TextInputState';

    if (data.indexOf(dataFix) !== -1) {
        // eslint-disable-next-line no-throw-literal
        throw '> 已经修复过了';
    }

    const result = data.replace(
        /react-native\/lib\/TextInputState/g,
        dataFix,
    );
    fs.writeFileSync(file, result, 'utf8');
    console.log('> 修复成功5!');
} catch (error) {
    console.error(error);
}

try {
    console.log('开始修改webview代码');
    const rootDir = process.cwd();

    const file = `${rootDir}/node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/RNCWebViewModule.java`;
    const data = fs.readFileSync(file, 'utf8');
    const dataFix = 'if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {';

    if (data.indexOf(dataFix) !== -1) {
        const result = data.replace(
            dataFix,
            'if (false) {',
        );
        fs.writeFileSync(file, result, 'utf8');
        console.log('> 修复成功9!');
    }
} catch (error) {
    console.error(error);
}
