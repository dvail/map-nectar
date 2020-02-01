import m from 'mithril'

import Root from './components/root'

import { states, actions } from './store'
import './index.css'

// Global assignment of mithil for JSX transpiling
window.m = m;
// de-encapsulate state for debugging, etc.
window.ApisStore = { states, actions }

const mRoot = document.querySelector('.app')

m.mount(mRoot, { view: () => m(Root) })
