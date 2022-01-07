// 题目介绍
// 给一个整数数组，求数组中重复的数字

// 示例
// 输入：[1, 2, 4, 4, 3, 3, 1, 5, 3]

// 输出：[1, 3, 4]

let arr=[1, 2, 4, 4, 3, 3, 1, 5, 3]

let result= arr.reduce(function(pre,cur){
    pre.indexOf(cur)==-1&&pre.push(cur)
    return pre
},[])
console.log(result);      //[ 10, 11, 12, 13, 14, 15 ]