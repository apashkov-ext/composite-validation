# composite-validation
Composite validation API for JS data models. Based on [this](https://github.com/uNmAnNeR/travajs "travajs") project idea.
This library 

[![Build Status](https://travis-ci.com/apashkov-ext/composite-validation.svg?branch=master)](https://travis-ci.com/apashkov-ext/composite-validation)
[![Coverage Status](https://coveralls.io/repos/github/apashkov-ext/composite-validation/badge.svg?branch=master)](https://coveralls.io/github/apashkov-ext/composite-validation?branch=master)
[![npm version](https://img.shields.io/npm/v/composite-validation)](https://www.npmjs.com/package/composite-validation)
[![install size](https://packagephobia.now.sh/badge?p=composite-validation)](https://packagephobia.now.sh/result?p=composite-validation)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Install
`npm install composite-validation`
## Use

For some data model...

```javascript
const dataModel = {
    name: 'Leonardo',
    age: 45
};
```
...describe validation map that folows the structure of the original object.
```javascript
import { ValidationMap, Conditions, required, equals } from 'composite-validation';

const map = ValidationMap({
    name: Conditions(v => required(v)),
    age: Conditions([
        v => required(v),
        v => equals(v, 21)
    ])
});
```
Call function.
```javascript
const result = map(dataModel);
```

Function applies validation map to data model, check all validity conditions and returns object with validity states for each field.
```json
{
    "name": {
        "value": "Leonardo",
        "isRequired": true
    },
    "age": {
        "error": "Value should be defined",
        "isRequired": true
    }
}
```
