<template>
  <div class="test-container">
    <div v-html=""></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  computed: {
    ...mapState({
      content: state => state.content.home
    })
  }
}
</script>

<style lang="scss">
</style>
