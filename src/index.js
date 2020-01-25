import m from 'mithril'

import { initMeiosis } from './appState';
import Root from './components/root'

import './index.css'

// Global assignment of mithil for JSX transpiling
window.m = m;

const mRoot = document.querySelector('.app')
const { states, actions } = initMeiosis()

m.mount(mRoot, { view: () => m(Root, { states, actions }) });
