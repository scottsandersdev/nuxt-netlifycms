<template>
  <div class="test-container">
    <div v-html="content.__content"></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  computed: {
    ...mapState({
      content: state => state.content.home.content
    })
  }
}
</script>

<style lang="scss">
</style>
