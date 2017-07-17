<template>
  <section class="test-container">
    <p class="title">{{content.title}}</p>
    <img class="article__img" :src="content.thumbnail" alt="">
    <div v-html="content.__content"></div>
  </section>
</template>

<script>
import {mapState} from 'vuex'

export default {
  computed: {
    ...mapState({
      content: state => state.content.articles.content
    })
  }
}
</script>

<style lang="scss">
  .article__img {
    height: 500px;
    margin: 0 auto;

  }
</style>
