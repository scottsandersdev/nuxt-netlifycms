<template>
  <div>
    <svg class="logo">
        <use xlink:href="#utc-logo"></use>
    </svg>
    <section v-for="section in content.home.sections" class="test-container">
      <div v-html="section"></div>
    </section>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import utcLogo from '~assets/lib/utxd-components/src/svg/utc-logo.svg'

export default {
  computed: {
    ...mapState({
      content: state => state.content
    })
  },
  components: {
    utcLogo
  }
}
</script>

<style lang="scss">
</style>
