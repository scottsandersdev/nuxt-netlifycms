<template>
  <div class="accordion" :id="id">
    <slot></slot>
  </div>
</template>

<script type="text/javascript">
let uid = 0;

export default {
  name: 'utxd-accordion',

  data () {
    return {
      id: ''
    };
  },

  methods: {
    /**
     * Sets the currently expanded accordion item.
     * @param {Event} e A custom Vue $emit event.
     */
    setCurAccordionItem (e) {
      for (let i = 0; i < this.collapsibles.length; i++) {
        this.collapsibles[i].curAccordionItem = e.detail[0].id;
      }
    },

    /**
     * Finds all nested Collapsible components and binds listeners to their
     * expanded events.
     */
    registerCollapsibles () {
      this.collapsibles = this.$el.getElementsByTagName('utxd-collapsible');

      for (let i = 0; i < this.collapsibles.length; i++) {
        this.collapsibles[i].addEventListener('expanded',
            this.setCurAccordionItem);
      }
    }
  },

  created () {
    this.id = `utxd-accordion-${uid}`;
    uid++;
  },

  mounted () {
    this.registerCollapsibles();
  }
};
</script>
