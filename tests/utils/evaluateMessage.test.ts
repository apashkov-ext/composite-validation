import 'mocha';
import { expect } from 'chai';
import { Utils } from '../../src/utils';

describe('evaluateMessage with no args', () => {

    it('should return not modified input string', () => {        
        const input = 'Value must equal to {$0}';
        const args = [3];
        expect(Utils.evaluateMessage(input, [])).eq(input);
        expect(Utils.evaluateMessage(input, null)).eq(input);
        expect(Utils.evaluateMessage(input, undefined)).eq(input);
    });

});

describe('evaluateMessage with args', () => {

    it('should return template string', () => {        
        const input = 'Value must equal to {$0}';
        const args = [3];
        const template = 'Value must equal to 3';
        const output = Utils.evaluateMessage(input, args);
        expect(output).eq(template);
    });

    // it('should return template string', () => {        
    //     const input = 'Value must equal to {$0}, not to {$1}';
    //     const args = [3, 8];
    //     const template = 'Value must equal to 3, not to 8';
    //     const output = Utils.evaluateMessage(input, args);
    //     expect(output).eq(template);
    // });

});