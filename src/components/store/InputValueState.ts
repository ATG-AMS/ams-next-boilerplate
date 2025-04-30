'use client';

import { atom } from 'recoil';

export interface IInputValuesState {
  name: string;
  email: string;
  age: string;
}

export const inputValueState = atom<IInputValuesState>({
  key: 'inputValueState',
  default: {
    name: '',
    email: '',
    age: '',
  },
});
