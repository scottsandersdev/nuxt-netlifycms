<template>
  <div class="modal" :class='{ "modal--toggled": toggled }'>
    <button class="modal__toggle"
      @click.prevent="toggle"
      v-bind:aria-expanded="toggled.toString()"
      :aria-controls="id">
      <slot name="toggle"></slot>
    </button>
    <transition name="modal__content">
      <div :id="id"
        v-show="toggled"
        ref="content"
        class="modal__content"
        v-bind:aria-hidden="(!toggled).toString()"
        @click.prevent="handleOverlayClick"
        role="dialog">
        <div class="modal__content-inner" :class="getModalClass">
          <button @click.prevent="toggle"
            class="modal__content-close-button">
            <svg class="icon modal__content-close-icon">
              <use xlink:href="#times-light"></use>
            </svg>
            <span class="visually-hidden">
              Close modal
            </span>
          </button>
          <div class="modal__content-header modal__content-section"
            v-if="hasHeaderSlot">
            <slot name="header"></slot>
          </div>
          <div class="modal__content-section" v-if="hasContentSlot">
            <slot name="content"></slot>
          </div>
          <div class="modal__content-section" v-if="hasFooterSlot">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/javascript">
import focusableSelector from 'focusable';
let uid = 0;

export default {
  name: 'utxd-modal',
  props: {
    type: {
      type: String,
      default: 'large'
    }
  },

  data () {
    return {
      focusableElements: [],
      id: '',
      toggled: false
    };
  },

  created () {
    this.id = `modal-content-${uid}`;
    uid++;
  },

  computed: {
    /**
     * Returns a class that sets the type of modal.
     * @return {String} class name of the modal
     */
    getModalClass () {
      switch (this.type) {
        case 'small':
          return 'modal__content-inner--small';
        case 'medium':
          return 'modal__content-inner--medium';
        case 'large':
          return '';
        default:
          return '';
      }
    },

    /**
    * Verifies whether or not the header slot has been passed through to the
    * template.
    * @return {boolean}
     */
    hasHeaderSlot () {
      return !!this.$slots['header'];
    },

    /**
    * Verifies whether or not the content slot has been passed through to the
    * template.
    * @return {boolean}
     */
    hasContentSlot () {
      return !!this.$slots['content'];
    },

    /**
    * Verifies whether or not the footer slot has been passed through to the
    * template.
    * @return {boolean}
     */
    hasFooterSlot () {
      return !!this.$slots['footer'];
    }
  },

  methods: {
    /**
     * Handles keydown events when modal is toggled.
     * @param {Event} e The keydown event.
     */
    handleDocumentKeyDown (e) {
      if (this.toggled) {
        switch(e.key) {
          case 'Esc': // IE case
          case 'Escape':
            this.toggle();
            break;
          case 'Tab': {
            if (this.focusableElements[this.focusableElements.length - 1] ===
                e.target) {
              e.preventDefault();
              this.focusableElements[0].focus();
              return false;
            }
            break;
          }
        }
      }
    },

    /**
     * Closes the modal when the overlay is clicked.
     * @param {Event} e The click event.
     */
    handleOverlayClick (e) {
      if (e.target.classList.contains('modal__content')) {
        this.toggle();
      }
    },

    /**
     * Sets toggle value to show/hide the modal.
     * @param {Object} the click event
     */
    closeOnOverlay (e) {
      const elem = e.target;
      if (elem.classList.contains('modal__content')) {
        this.toggle();
      }
    },

    toggle () {
      this.toggled = !this.toggled;

      if (this.toggled) {
        setTimeout(() => {
          document.addEventListener('keydown', this.handleDocumentKeyDown);
        }, 0);
      }
      else {
        document.removeEventListener('keydown', this.handleDocumentKeyDown);
      }
    },
  },

  mounted () {
    this.focusableElements =
        Array.from(this.$refs.content.querySelectorAll(focusableSelector));
  }
};
</script>

<style lang='scss'>
@import 'sass/index';
</style>
