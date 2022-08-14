import { rules, each, ruleMap } from './api';
import { equals } from './validators/equals';
import { required } from './validators/required';

export * from './api';
export * from './types';
export * from './utils';
export * from './validators/required';
export * from './validators/equals';
export * from './validators/custom-validator';
export * from './_public-api';



interface SuperInner {
    active: boolean;
    arr: number[]
}

interface InnerModel {
    title: string;
    id: number;
    sup: SuperInner;
}

interface Model {
    id: string;
    props: number[];
    isFlag: boolean;
    innerObjects: InnerModel[],
    inner: InnerModel
}


var model: Partial<Model> = { 
    id: '888',
    props: [8, 12],
    isFlag: true,
    innerObjects: [
        {
            title: 'Some Title',
            id: 9,
            sup: null
        }
    ],
    inner: {
        title: 'TITLUS',
        id: 12,
        sup: {
            active: true,
            arr: [1, 2, 3]
        }
    }
};


const validator = ruleMap<Model>(m => ({
    id: rules(v => required(v, () => m.isFlag)),
    inner: ruleMap(inn => ({
        title: rules(t => required(t)),
        sup: ruleMap(s => ({
            active: rules(v => required(v)),
            arr: each(a => rules(v => equals(v, v)))
        }))
    })),
    props: each(arr => rules(
        v => required(v)
    )),
    isFlag: v => equals(v, () => true),
    innerObjects: each(arr => ruleMap(io => ({
        title: rules(v => required(v)),
        sup: ruleMap(s => ({
            active: rules(v => required(v))
        }))
    })))
}));
var res = validator(model);

var arrValidator = each<number[]>(arr => rules(v => required(v)));
var objValidator = ruleMap<{ id: any }>(x => ({
    id: rules(v => required(v))
}))
var valValidator = rules<number>(v => required(v), v => equals(v, 3))

const validator2 = ruleMap<Model>({
    id: rules(v => required(v)),
    inner: ruleMap<InnerModel>({
        title: rules(t => required(t)),
        sup: ruleMap({
            active: rules(v => required(v)),
            arr: each(a => rules(v => equals(v, v)))
        })
    }),
    props: each(arr => rules(
        v => required(v)
    )),
    isFlag: v => equals(v, () => true),
    innerObjects: each(arr => ruleMap<InnerModel>({
        title: rules(v => required(v)),
        sup: ruleMap<SuperInner>({
            active: rules(v => required(v))
        })
    }))
});
var res2 = validator2(model);


var s = JSON.stringify({});
