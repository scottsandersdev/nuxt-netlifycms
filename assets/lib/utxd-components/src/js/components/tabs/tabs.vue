<template>
  <div class="tabs">
    <nav>
      <ul class="tabs__header">
        <li tabindex="0" class="tabs__tab-item" role="button"
          :aria-controls="tab.id"
          :class="{ 'tabs__tab-item--active': tab.selected }"
          @keyup.enter="selectTab(tab.id)"
          @click.prevent="selectTab(tab.id)"
          v-for="tab in tabsList"
          :key="tab.id"
          v-html="tab.header">
        </li>
      </ul>
    </nav>
    <div :id="tab.id"
      class="tabs__tab-content"
      :class="{ 'tabs__tab-content--active': tab.selected }"
      v-for="tab in tabsList"
      :key="tab.id"
      v-html="tab.content">
    </div>
  </div>
</template>

<script type="text/javascript">
let uid = 0;
let tabUid = 0;

export default {
  name: 'utxd-tabs',

  data () {
    return {
      id: '',
      tabsList: [],
      selectedTabId: '',
    };
  },

  watch: {
    selectedTabId (tabId) {
      this.tabsList.forEach(tab => tab.selected = (tab.id === tabId));
    }
  },

  methods: {
    /**
     * Builds an object that represents a tab item, based on the given VNode
     * element.
     * @param {VNode} vnode The vue node element to parse.
     * @return {Object} the tab object with id, header and content data.
     */
    createTabObject (vnode) {
      let headerHtml, contentHtml, htmlWrapper;

      if (!vnode || !vnode.data || !vnode.data.domProps ||
          !vnode.data.domProps.innerHTML) {
        return {};
      }

      htmlWrapper = document.createElement('DIV');
      htmlWrapper.innerHTML = vnode.data.domProps.innerHTML;
      headerHtml = htmlWrapper.querySelector('[slot="header"]');
      contentHtml = htmlWrapper.querySelector('[slot="content"]');

      return {
        id: `utxd-tab-${tabUid++}`,
        header: headerHtml ? headerHtml.outerHTML : '',
        content: contentHtml ? contentHtml.outerHTML : '',
        selected: false
      };
    },

    /**
     * Looks for the <utxd-tab> child tags and parses their html markup.
     * Then updates the tabList array.
     */
    updateTabsList () {
      let tabSlots;

      this.tabsList = [];
      if (this.$slots.default) {
        tabSlots = Array.prototype.slice.call(this.$slots.default);
        this.tabsList = tabSlots
          .filter(slot => slot.tag === 'UTXD-TAB')
          .map(slot => this.createTabObject(slot));
      }
    },

    /**
     * Sets the current selected tab based on the given tab id.
     * @param {String} tabId The id of the tab to select.
     */
    selectTab (tabId) {
      if (this.tabsList.filter(tab => tab.id === tabId).length > 0) {
        this.selectedTabId = tabId;
      }
    }
  },

  created () {
    this.id = `utxd-tabs-${uid++}`;
    this.updateTabsList();
  },

  mounted () {
    if (this.tabsList.length > 0) {
      this.selectTab(this.tabsList[0].id);
    }
  }
};
</script>

<style lang='scss'>
@import 'sass/index';
</style>
