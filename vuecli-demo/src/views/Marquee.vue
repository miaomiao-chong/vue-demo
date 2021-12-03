<!--  -->
<template>
  <div class="root">
      <marquee :word=word2 :endWidth="50" :startWidth="20" :interval="100" :step="5" style="margin:0 auto"></marquee>
  </div>
</template>

<script>
import Marquee from '../components/marqueeCpn.vue';

export default {
  components:{
    Marquee
  },
  data() {
    return {
      word1:'short',
      word2:'longlonglong我是一段很长的文字很长的文字很长的文字',
      word3:'稍微长一点的文字文字文字文字文字'
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style>
.root{
  margin: 0 auto;
  width: 200px;
  height: 60px;
  margin: 50px;
}
</style>