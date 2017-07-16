import 'document-register-element/build/document-register-element';
import 'es6-object-assign/auto';
import 'mdn-polyfills/Array.prototype.from';
import Vue from 'vue';
import vueCustomElement from 'vue-custom-element';
import Accordion from './components/accordion/accordion.vue';
import Collapsible from './components/collapsible/collapsible.vue';
import Modal from './components/modal/modal.vue';
import DatePicker from './components/date-picker/date-picker.vue';
import Tabs from './components/tabs/tabs.vue';

Vue.config.ignoredElements = [
  'UTXD-ACCORDION',
  'UTXD-COLLAPSIBLE',
  'UTXD-MODAL',
  'UTXD-DATE-PICKER',
  'UTXD-TABS'
];

Vue.use(vueCustomElement);
Vue.customElement('utxd-accordion', Accordion);
Vue.customElement('utxd-collapsible', Collapsible);
Vue.customElement('utxd-modal', Modal);
Vue.customElement('utxd-date-picker', DatePicker);
Vue.customElement('utxd-tabs', Tabs);
