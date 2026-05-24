import { NanogramaModel } from '../models/nanograma';

export const NANO:NanogramaModel = {
  rows: 10,
  cols: 10,
  solution: [
        [false, false, false, false, true, false, true, true, true, false],
        [false, false, false, false, false, true, true, true, false, false],
        [false, false, true, true, true, true, false, false, false, false],
        [false, true, false, false, true, true, false, false, false, false],
        [false, true, false, false, true, true, false, false, false, false],
        [false, true, true, true, true, true, true, false, false, false],
        [false, true, true, true, true, true, true, true, true, false],
        [false, true, true, true, true, true, true, true, true, false],
        [false, false, true, true, true, true, true, true, false, false],
        [false, false, false, true, true, true, true, false, false, false]
    ]
};