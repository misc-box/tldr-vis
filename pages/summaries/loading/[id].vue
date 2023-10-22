<!-- 
<script setup lang="ts">
const summaryData = ref({});
const loading = ref(false);

const route = useRoute();

const client = useSupabaseClient();

let start = async () => {
    do {
        let { data, error } = await client.from('global_summaries').select('*').eq("id", route.path).single();
        console.log(data);
        if (error !== null || data === null || data.result === null) throw error;
        loading.value = data.result.loading !== undefined; // always true/false
    } while (!loading.value);
    summaryData.value = data.result;

    return data;
};

function base64ToArrayBuffer(base64: string): Uint8Array {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}

function saveByteArray(reportName: string, byte: string) {
    var blob = new Blob([base64ToArrayBuffer(byte)], { type: "application/pdf" });
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
}

const { JOKES_API_KEY } = useRuntimeConfig().public;

const { data: jokes } = useFetch("https://api.api-ninjas.com/v1/jokes?limit=1", {
    headers: { "X-Api-Key": JOKES_API_KEY },
});
</script> -->

<template>
    <div class="flex flex-col justify-center items-center w-full">
        <div class="mt-44 animate-pulse flex flex-col items-center gap-2">
            <img src="../../../assets/images/book.png" class="w-36 h-32 animate-bounce" />
            <div class="text-3xl">{{ loading_info.data.result.info }}</div>
            <UAlert v-if="jokes" class="mt-4" icon="i-heroicons-face-smile" title="Here's a joke while you wait!"
                variant="subtle" color="primary" :description="jokes[0].joke" />
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();

const client = useSupabaseClient();
var { data: loading_info, refresh } = await useAsyncData('summary_loading', () => client.from('global_summaries').select('*').eq("id", route.path.split('/').at(-1)).single());
const i = setInterval(async () => {
    await refresh();

    if (!loading_info?.value?.data?.result?.info) {
        clearInterval(i);
        navigateTo(`/summaries/processed/${route.path.split('/').at(-1)}`);
    }
}, 100);


function base64ToArrayBuffer(base64: string): Uint8Array {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}

function saveByteArray(reportName: string, byte: string) {
    var blob = new Blob([base64ToArrayBuffer(byte)], { type: "application/pdf" });
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
}

const { JOKES_API_KEY } = useRuntimeConfig().public;

const { data: jokes } = useFetch("https://api.api-ninjas.com/v1/jokes?limit=1", {
    headers: { "X-Api-Key": JOKES_API_KEY },
});
</script>
<!-- 
<script lang="ts">
export default {
    mounted() {
        start();
        alert('t');
    }
}
</script> -->