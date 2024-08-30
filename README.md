# How to use

## Preparing au3te-ts-common

```bash
git clone https://github.com/dentsusoken/au3te-ts-common
cd au3te-ts-common
npm run install
npm run build
npm link
cd ..
```

## Preparing au3te-ts-base

```bash
git clone https://github.com/dentsusoken/au3te-ts-base
cd au3te-ts-base
npm run install
npm link au3te-ts-common
npm run build
npm link
cd ..
```

## Using au3te-ts-base from another project

```bash
mkdir test
cd test
npm init es6 -y
npm link au3te-ts-base
```
