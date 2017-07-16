<template>
  <div class="collapsible" :class="{ 'collapsible--expanded': expanded }">
    <button class="collapsible__toggle"
      @click.prevent="toggle"
      :aria-expanded="expanded.toString()"
      :aria-controls="id">
      <slot name="toggle"></slot>
      <svg class="icon collapsible__icon" focusable="false">
        <use xlink:href="#chevron-light-left"></use>
      </svg>
    </button>
    <transition name="slide"
      @before-enter="show"
      @after-enter="setHeightAuto"
      @leave="hide">
      <div :id="id"
        class="collapsible__content"
        v-show="expanded"
        :aria-hidden="(!expanded).toString()">
        <slot name="content" class="collapsible__content-inner"></slot>
      </div>
    </transition>
  </div>
</template>

<script type="text/javascript">
let uid = 0;

export default {
  name: 'utxd-collapsible',

  props: {
    'curAccordionItem': ''
  },

  data () {
    return {
      expanded: false,
      id: ''
    };
  },

  watch: {
    curAccordionItem (id) {
      if (id !== this.id) {
        this.expanded = false;
      }
    }
  },

  methods: {
    /**
     * Hides the content element. CSS transitions on height or width will not
     * work to/from 'auto'. Utilizes requestAnimationFrame to first set the
     * content element's height to fixed px size, then to 0px on the next frame.
     * @param {HTMLElement} el The element.
     */
    hide (el) {
      requestAnimationFrame(() => {
        el.style.height = `${el.scrollHeight}px`;

        requestAnimationFrame(() => {
          el.style.height = '0px';
        });
      });
    },

    /**
     * Sets element height to auto. Used after transition to ensure the content
     * element responds to changes in viewport width.
     * @param {HTMLElement} el The element.
     */
    setHeightAuto (el) {
      el.style.height = 'auto';
    },

    /**
     * Shows the content element. Sets display to block first to ensure its
     * scrollHeight value can be calculated.
     * @param {HTMLElement} el The element.
     */
    show (el) {
      el.style.display = 'block';
      el.style.height = `${el.scrollHeight}px`;
      this.$emit('expanded', {
        id: this.id
      });
    },

    /**
     * Toggles the visibility of the collapsible content.
     */
    toggle () {
      this.expanded = !this.expanded;
    }
  },

  created () {
    this.id = `utxd-collapsible-${uid}`;
    uid++;
  }
};
</script>

<style lang='scss'>
@import 'sass/index';
</style>
