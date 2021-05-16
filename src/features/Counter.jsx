import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import {
    decrement,
    increment,
    incrementByAmount,
    incrementAsync,
    selectCount,
} from './counterSlice';

export default function Counter () {
    const count = useSelector(selectCount);
    const dispatch = useDispatch();
}