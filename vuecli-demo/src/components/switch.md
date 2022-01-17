modalValue:外部控制索引值

点击item后执行switchItem 会修改modalValue
但是不能直接用this.xxx修改，需要用emit
this.$emit('update:modelValue', index)
