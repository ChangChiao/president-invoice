# 2023 THE F2E Mission 2 - Presidential Voting Map

## 📙 Introduction

This ia a Presidential Voting Map, allowing users to understand polling information across regions through charts.

![image](./src/assets/img/cover.png)

## 👉 Demo

[2020 總統大選開票地圖](https://president-invoice.vercel.app/)

## 🎨 Designer

[wala](https://2023.thef2e.com/users/12061579704049918951)

## 🔧 Environment

- node version: `v18.14.1`
- pnpm version: `v8.2.0`

## ⚡ Usage

### 🔌 Installation

```
pnpm install
```

### 📦 Commands

```
pnpm start
```

### 📁 Folder Structure

```

    .
    ├── ...
    ├── app
    │   ├── pages        # page component
    │   │     ├── shell      # child route
    │   │     ├── features   # container component
    │   │     └── ui         # presentational component
    │   │
    │   ├── style        # scss variable、global style
    │   ├── shell        # layout
    │   ├── shared
    |   └── .. ├── ui        # shared component
    └── ...    └── domain
                      ├── configs  # configs
                      ├── models   # data interface
                      ├── services # api services
                      ├── store    # global store
                      └── utils    # utils function


```

### 🔩 Built with

- nrwl nx
- angular v17
- angular material
- d3.js
- topojson client
- gsap

### 📊 Data resource

- [中選會](https://db.cec.gov.tw/ElecTable/Election?type=President)
- [內政地理資訊圖資雲整合服務平台](https://www.tgos.tw/tgos/NgdaMap)

### 📘 Process Record

[2023 F2E 鐵人賽心得](https://medium.com/coding-hot-pot/2023-f2e-%E9%90%B5%E4%BA%BA%E8%B3%BD%E5%BF%83%E5%BE%97-9f809fd8e418)
