# YGO_Card_Manager 

## 依赖环境

* [Android SDK](https://developer.android.com/)
* Java Development Kit (JDK) 11
* NodeJS v20+
* VSCode + Expo Utils（VS插件）

## 安装步骤

本项目基于Expo app构建，本质是基于ReactNative的再扩展，所以安装步骤和Expo app相同。快速验证的话，按照下面的配置方式也可。

1. 安装Node，version 20，以保证所有包都可以被正确安装。

2. 安装[Yarn](https://yarnpkg.com/)，我们的大部分操作将基于Yarn完成。可以使用npm进行安装

    ```sh
    # 安装yarn
    npm install -g yarn
    # 通过Yarn安装环境所需包 
    yarn install
    ```

3. 安装Android环境。可见[Set up Android Studio's tools](https://docs.expo.dev/workflow/android-studio-emulator/)一文。
    * 安装Android studio
    * 安装Android SDK
    * 通过Android Studio安装模拟器，这样比较方便调试

4. 将Android SDK的安装路径作为环境变量输出到系统变量中，如将以下代码写入`/.zprofile` 或 `~/.zshrc` 或 `~/.bash_profile`  或 `~/.bashrc`。对于Windows，也可手动录入环境变量。

    ```sh
    export ANDROID_HOME=$HOME/Library/Android/sdk && export PATH=$PATH:$ANDROID_HOME/emulator && export PATH=$PATH:$ANDROID_HOME/platform-tools
    ```
5. 安装OpenJDK，对于Expo app版本为49的本项目，需安装jdk11。可以通过[chocolatay](https://docs.chocolatey.org/en-us/choco/setup)安装或手动安装。并设置JAVA_HOME的环境
    ```sh
    # On windows
    choco install -y microsoft-openjdk11
    [System.Environment]::SetEnvironmentVariable('JAVA_HOME','path/to/javahome')
    # On Macos
    brew install java11
    export JAVA_HOME=path/to/javahome
    ```
6. 运行`yarn android`来快速运行项目在android中，如果上述步骤都正确，在这一步，你应该可以打开刚刚下载好的模拟器，并成功运行本项目。


## 基于Expo App的运行

ExpoApp本质是一个现成的Java Script运行环境，它允许你直接在上面执行js脚本。当JS脚本发生变动时，也会实时的反馈到ExpoApp中。在不涉及到原生层的逻辑变更，以及自定义的Java/c++代码时，使用ExpoApp的运行环境绰绰有余。

运行方式有两种，都是在终端执行。需要[ExpoCli](https://docs.expo.dev/more/expo-cli/)的使用基础
```sh
expo start:android
```
同时，基于ExpoApp的运行模式，在修改代码之后，Expo一般会自动重新渲染界面，但是如果发生报错，还是需要执行Reload，具体操作就是在命令行中直接输入r，或者强制退出后再次运行。

## 基于原生模式执行

基于原生模式打包的逻辑，是不依赖ExpoApp进行运行，这样就可以避免反复建立服务器的情况。

```sh
expo run:android
```
## 打包

当需要完全打包成一个独立的App时，需要完整的打包的流程。这里会有两个打包模式可以选择，一个是基于Expo云端的打包，另一个是本地打包。两者都需要eas账号。此外，如果能在ExpoApp中完美运行，那么基于云端的打包一定是成功的。但是本地打包不一定，因为需要兼容各个安卓版本。

## 文档

本程序基于Expo执行，并且由于没有想要做的很大，纯粹为了小程序而生，所以并不会出现很复杂的UI和数据分离的MVC模型，而是把逻辑和UI绑定。除了一些必要的数据处理系统，必须存在与database中心，其余时间，都是UI模块各自运行。

### 数据库更新

目前的数据库更新按照手动更新的方式进行，需要在每次卡包出来之后，分别根据官网数据更新cid表，根据ygopro的数据更新卡片原始数据。理论上两个数据可以合在一起更新。相当于和ygopro的数据库分离开来。按照游戏王现在的更新频率，这个工作量不会很大。

### 卡包数据

直接从官网爬。


## Q&A


1. 打开模拟器时报错：The emulator process for AVD Pixel_4_API_30 has terminated.

   * 出现这个情况时，需要确认当前打开模拟器的log文件，通常路径在
       ```sh
       Users\AppData\Local\Google\AndroidStudio2021.2\log\idea.log
       ```
   * 通过阅读内部的信息即可了解。

2. 为什么不做网页版

   * 因为想要零成本，如果做成网页版，可以缓存在本地数据中是最后，但是更多时候容易丢失。也可以接入dav，但是对于没有使用习惯的人而言就比较麻烦。。