# epos-app
Build a cross-platform (Android IOS) EPOS application through the React native CLI
> Support for Windows is planned for the future

## Environment setup
Please follow the [React native CLI Quickstart](https://reactnative.dev/docs/environment-setup) set up your environment.

* NOTE: 
1. You can set up your environment with react native CLI doctor.
```shell
  yarn react-native doctor  # use the cmdLine in your terminal
  
  # After running this command, with the shortcut F, the doctor will automatically fix the environment settings
```


2. Mack sure your project path is english character.
>Some languages character path may cause not found cannot find module 'react-native/cli'.__Such as your path include chinese characters__

3. Recommend install [gradle](https://gradle.org/install/) as your build tool for android. 

## Install Dependence
```
 yarn
 # or
 npm i
```

## Start
1. Android

```shell
  yarn android
  
  # or
  npm run android
  
  # It may take a while. Gradle requires installing some dependencies from the Internet, at the first time.
```


2. IOS


## Build
1. Android

```shell
  yarn react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle
  # If assets floder does not exist, your need create this folder.
  
  cd android
  
  gradle assembleRelease
  # Or
  .\gradlew assembleRelease # If you don't have Gradle
```

2. IOS
