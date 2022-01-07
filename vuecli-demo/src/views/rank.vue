<!--  -->
<template>
  <div>
    <rank-list :rankList='list'></rank-list>
  </div>
</template>

<script>
import rankList from '../components/rankList.vue'
export default {
  name: 'rank',
  components:{
   "rank-list":rankList
  },
  data() {
    return {
      list:[
        "我是第1",
        "我是第2",
        "我是第3",
        "我是第4",
        "我是第5",
        "我是第6",
        "我是第7",
        "我是第8",
        "我是第9",
        "我是第10",
        "我是第11"
      ]
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style>

</style>