import 'bootstrap';
import * as Vue from 'vue';
import './scss/app.scss';

const app = Vue.createApp({});

import appComponent from './App.vue';
import Accordion from './components/Common/Accordion/AccordionBase.vue';

app.component('app-component', appComponent);
app.component('Accordion', Accordion);
app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ion-icon');

app.mount('#app');