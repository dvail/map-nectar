import m from 'mithril'

import Root from './components/root'

import './index.css'

// Global assignment of mithil for JSX transpiling
window.m = m;

const mRoot = document.querySelector('.app')

m.mount(mRoot, { view: () => m(Root) })
