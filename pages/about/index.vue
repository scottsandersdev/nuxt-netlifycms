<template>
  <section class="test-container">
  <div v-html="content.__content"></div>
  </section>
</template>

<script>
import {mapState} from 'vuex'

export default {
  computed: {
    ...mapState({
      content: state => state.content.about.content
    })
  }
}
</script>

<style lang="scss">
</style>
