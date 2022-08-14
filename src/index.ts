import { Conditions, Each, ValidationMap } from './api';
import { equals } from './operators/equals';
import { required } from './operators/required';

export * from './api';
export * from './types';
export * from './utils';
export * from './operators/required';
export * from './operators/equals';
export * from './operators/operator';
export * from './_public-api';


interface InnerModel {
    title: string;
}

interface Model {
    id: string;
    props: number[];
    isFlag: boolean;
    innerObjects: InnerModel[]
}

const map = ValidationMap<Model>(m => ({
    id: v => required(v, () => m.isFlag),
    props: Each(arr => Conditions(
        v => required(v)
    )),
    isFlag: v => equals(v, true),
    innerObjects: Each(arr => ValidationMap(io => ({
        title: v => required(v)
    })))
}));

var m: Partial<Model> = { 
    id: '888',
    props: [8, 12],
    isFlag: true,
    innerObjects: [
        {
            title: 'Some Title'
        }
    ]
};

var res = map(m);
var s = JSON.stringify(res);
