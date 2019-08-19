
<template>
  <div id="app">
    <photoChoose :mediaType='2' @chooseEnd='chooseEnd'></photoChoose>
  </div>
</template>

<script>
    import photoChoose from '../src/packages/photoChoose/index'
    export default{
        components: {
            photoChoose
        },
        methods: {
            chooseEnd(obj) {
                console.log(obj)
            }
        }
    }
</script>