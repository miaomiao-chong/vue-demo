<!--  -->
<template>
  <div>
    <input type="text" v-model="query">
  </div>
</template>

<script>
import {debounce,debounce2} from '../assets/js/utils'
export default {
  data() {
    return {
      query: ''
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    // this.$watch('query', debounce((e)=>{
    //   console.log(e);
    // },500))
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
  watch: {
    query() {
      debounce2(()=>{
        console.log(111);
      },500)
    }
  }
}
</script>
<style>

</style>