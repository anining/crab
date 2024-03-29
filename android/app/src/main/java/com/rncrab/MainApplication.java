package com.rncrab;

import android.app.Application;
import android.content.Context;

import androidx.annotation.NonNull;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.mob.moblink.Scene;
import com.mob.MobSDK;
import com.mob.secverify.OperationCallback;
import com.mob.secverify.SecVerify;
import com.mob.secverify.exception.VerifyException;
import com.rncrab.jrad.JradPackage;
import com.rncrab.jrad.TTAdManagerHolder;
import com.rncrab.notice.NoticeJsPackage;
import com.mob.moblink.MobLink;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

import com.microsoft.codepush.react.CodePush;
import com.rncrab.sceneListener.SceneListener;
import com.rncrab.transmit.TransmitPackage;
import com.rncrab.verify.SecVerifyPackage;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.initialization.InitializationStatus;
import com.google.android.gms.ads.initialization.OnInitializationCompleteListener;
import com.umeng.analytics.MobclickAgent;
import com.umeng.commonsdk.UMConfigure;

import static com.rncrab.utils.CommonUtils.getChannel;

public class MainApplication extends Application implements ReactApplication {
    private final ReactNativeHost mReactNativeHost =
            new ReactNativeHost(this) {
                @Override
                protected String getJSBundleFile() {
                    return CodePush.getJSBundleFile();
                }

                @Override
                public boolean getUseDeveloperSupport() {
                    return BuildConfig.DEBUG;
                }

                @Override
                protected List<ReactPackage> getPackages() {
                    @SuppressWarnings("UnnecessaryLocalVariable")
                    List<ReactPackage> packages = new PackageList(this).getPackages();
                    // Packages that cannot be autolinked yet can be added manually here, for example:
                    packages.add(new TransmitPackage());
                    packages.add(new NoticeJsPackage());
                    packages.add(new SecVerifyPackage());
                    packages.add(new JradPackage());
                    return packages;
                }

                @NonNull
                @Override
                protected String getJSMainModuleName() {
                    return "index";
                }
            };

    @NonNull
    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        UMConfigure.init(this, "5f0287930cafb22a8b000213", getChannel(this), UMConfigure.DEVICE_TYPE_PHONE, "28225c9cb44605afa411f8088b6c6f4b");
        UMConfigure.setLogEnabled(true);
        //今日头条广告
        TTAdManagerHolder.init(this);
        // 选用AUTO页面采集模式
        MobclickAgent.setPageCollectionMode(MobclickAgent.PageMode.AUTO);
        MobSDK.init(this, "2fa09aadf5f30", "9776e7ee141c0408e353df23ff7ad19a");
        MobSDK.submitPolicyGrantResult(true, null);
        MobLink.setRestoreSceneListener(new SceneListener());
        new SceneListener().notFoundScene(new Scene());
        SoLoader.init(this, /* native exopackage */ false);
        initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
        isCanUseForIntnet();
        MobileAds.initialize(this, new OnInitializationCompleteListener() {
            @Override
            public void onInitializationComplete(InitializationStatus initializationStatus) {
            }
        });
    }

    private void isCanUseForIntnet() {
        if (SecVerify.isVerifySupport()) {
            // 预取号
            topreVerfy();
        }
    }

    /**
     * 预登录
     * 预登录接口用于向运营商进行预取号操作，建议在实际调用登录接口前提前调用预登录接口
     * （比如应用启动时或进入注册或登录页面时），这将极大地加快登录接口执行耗时，提高用户体验。
     */
    private void topreVerfy() {
        SecVerify.preVerify(new OperationCallback() {
            @Override
            public void onComplete(Object o) {
            }

            @Override
            public void onFailure(@NonNull VerifyException e) {
                e.getCause();
            }
        });

    }

    /**
     * Loads Flipper in React Native templates. Call this in the onCreate method with something like
     * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
     *
     * @param context
     * @param reactInstanceManager
     */
    private static void initializeFlipper(
            Context context, ReactInstanceManager reactInstanceManager) {
        if (BuildConfig.DEBUG) {
            try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
                Class<?> aClass = Class.forName("com.rncrab.ReactNativeFlipper");
                aClass
                        .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
                        .invoke(null, context, reactInstanceManager);
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            } catch (NoSuchMethodException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            }
        }
    }
}
