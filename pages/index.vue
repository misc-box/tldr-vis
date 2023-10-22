<template>
    <div class="flex flex-col justify-center items-center w-full">
        <div class="mt-44">
            <div class="flex gap-2 items-center justify-center w-full">
                <h1
                    class="text-4xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-500">
                    TLDR - Lecture Summarizer
                </h1>
            </div>
            <NewSummary @summarize="onSummarize" />
            <UAlert variant="subtle" title="" class="mt-10">
                <template #description>
                    <div class="flex items-center gap-2 justify-between mb-1">
                        <div class="flex items-center gap-2">
                            <UIcon name="i-heroicons-clipboard-document-list" class="w-5 h-5" />
                            <span>Copy a test video link here :)</span>
                        </div>
                        <UButton size="xs" variant="soft" icon="i-heroicons-clipboard-document-list"
                            label="Copy to Clipboard" @click="copyGoodVideoToClipboard()" />
                    </div>
                </template>
            </UAlert>
        </div>
    </div>
</template>

<script setup lang="ts">
const onSummarize = async (e: any) => {
    const { data } = await useFetch("/api/process", {
        method: "POST",
        body: JSON.stringify(e),
    });

    navigateTo(`summaries/loading/${data.value!}`);
};

function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}

function saveByteArray(reportName, byte) {
    var blob = new Blob([base64ToArrayBuffer(byte)], { type: "application/pdf" });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
};



const toast = useToast();

const copyGoodVideoToClipboard = async () => {
    await navigator.clipboard.writeText('https://oc-vp-distribution04.ethz.ch/mh_default_org/oaipmh-mmp/09e71d9e-8399-40ea-be39-605285e0ae65/33fbd877-2001-4767-8a76-9b5bc7a2479c/20170918_1340_HPHG2_YourFutureInBiology_Theler.mp4');
    toast.add({ title: "Copied to clipboard successfully.", icon: "i-heroicons-check-badge" })
}
</script>
