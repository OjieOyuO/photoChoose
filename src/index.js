// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import photoChoose from './packages/photoChoose/index'

const components = [
    photoChoose
]

const install = (Vue, opts = {}) => {
    if (install.installed) return;
    components.map(component => {
        Vue.component(component.name, component)
    })
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
};

export default {
    version: '0.0.1',
    install,
    photoChoose
}
