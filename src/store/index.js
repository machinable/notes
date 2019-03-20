import { createStore } from 'redux';
import reducer from './notes/reducer';

const store = createStore(reducer);

export default store;