import { ValidationMap } from './api';
import { required } from './operators/required';

export * from './api';
export * from './types';
export * from './utils';
export * from './operators/required';
export * from './operators/equals';
export * from './operators/operator';
export * from './_public-api';


interface Model {
    id: string
}

const map = ValidationMap<Model>(() => ({
    id: v => required(v)
}));

var m = { id: '888' };

var res = map(m);

var r = true;