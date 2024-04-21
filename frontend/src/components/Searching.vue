<template>
    <div class="searching">
        <div class="input-area">
            <input 
                class="input" 
                type="text" 
                placeholder="Tìm sách" 
                @keydown.enter="handleSearch"
                v-model="searchTerm" 
                @input="search">
            <button 
                class="btn" 
                type="submit"
                @click="handleSearch"
            >
            <i class="fa-solid fa-magnifying-glass"></i>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            searchTerm: '',
        };
    },
    methods: {
        handleSearch() {
            this.$emit('search', this.searchTerm);
        },
    },
};
</script>

<style>
.searching{
    width: 100%;
}
.input-area {
    display: flex;
    justify-content: right;
    align-items: center;
    margin-right: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 100%;
}

.input {
    border: 1px solid #009688;
    /* border-radius: 15px; */
    padding: 6px 12px;
    outline: none;
    border-right: none;
    width: 30%;
    border-radius:15px 0px 0px 15px;
}

.btn{
    background-color: #009688;
    border-radius: 0px 15px 15px 0px;
    padding: 6px 10px;
    margin: 0px;
}
</style>