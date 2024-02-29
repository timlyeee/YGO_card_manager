# Installation

本项目基于Expo app构建，所以安装步骤和Expo app相同。

## Windows

1. 安装Node环境，至少v16，以保证所有包都可以被正确安装。

2. 安装Yarn。可以使用npm进行安装

```sh
# 安装yarn
npm install -g yarn
# 安装环境所需包 
yarn install
```

3. 安装Android环境。可见[Set up Android Studio's tools](https://docs.expo.dev/workflow/android-studio-emulator/)一文。

4. 将Android SDK的安装路径作为环境变量输出到系统变量中，如将以下代码写入`/.zprofile` 或 `~/.zshrc` 或 `~/.bash_profile`  或 `~/.bashrc`

```sh
export ANDROID_HOME=$HOME/Library/Android/sdk && export PATH=$PATH:$ANDROID_HOME/emulator && export PATH=$PATH:$ANDROID_HOME/platform-tools
```
5. 安装OpenJDK，对于Expo app版本为49的本项目，需安装jdk11。可以通过chocolatay安装或手动安装。
```sh
choco install -y microsoft-openjdk11
```
6. 运行`npx expo run:android`或`yarn android`来运行android项目


## 文档

本程序基于Expo执行，并且由于没有想要做的很大，纯粹为了小程序而生，所以并不会出现很复杂的UI和数据分离的MVC模型，而是把逻辑和UI绑定。除了一些必要的数据处理系统，必须存在与database中心，其余时间，都是UI模块各自运行。




## Q&A

1. 打开模拟器时报错：The emulator process for AVD Pixel_4_API_30 has terminated.

出现这个情况时，需要确认当前打开模拟器的log文件，通常路径在
```sh
Users\AppData\Local\Google\AndroidStudio2021.2\log\idea.log
```
通过阅读内部的信息即可了解。
