<template>
  <section class="test-container">
    <div v-html="content.about.content"></div>
  </section>
</template>

<script>
import {mapState} from 'vuex'

export default {
  computed: {
    ...mapState({
      content: state => state.content
    })
  }
}
</script>

<style lang="scss">
</style>
