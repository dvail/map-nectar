import m from 'mithril'

import { initMeiosis } from './appState';
import Root from './components/root'

import './index.scss'

const mRoot = document.querySelector('.app')
const { states, actions } = initMeiosis()

m.mount(mRoot, { view: () => m(Root, { states, actions }) });
