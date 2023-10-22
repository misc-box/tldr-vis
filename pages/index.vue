<template>
    <div class="flex flex-col justify-center items-center w-full">
        <div v-if="!loading && !summaryVisible" class="mt-44">
            <div class="flex gap-2 items-center justify-center w-full">
                <h1
                    class="text-4xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-500"
                >
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
                        <UButton size="xs" variant="soft" icon="i-heroicons-clipboard-document-list" label="Copy to Clipboard" @click="copyGoodVideoToClipboard()" />
                    </div>
                </template>
            </UAlert>
        </div>
        <div
            v-else-if="loading && !summaryVisible"
            class="mt-44 animate-pulse flex flex-col items-center gap-2"
        >
            <img src="../assets/images/book.png" class="w-36 h-32 animate-bounce" />
            <div class="text-3xl">Processing, this might take a while...</div>
            <UAlert
                v-if="jokes"
                class="mt-4"
                icon="i-heroicons-face-smile"
                title="Here's a joke while you wait!"
                variant="subtle"
                color="primary"
                :description="jokes[0].joke"
            />
        </div>

        

        <div v-if="summaryVisible" class="lg:w-[1000px] my-10">
            <UCard>
                <UCard class="mx-4">
                    <div class="flex gap-2">
                        <!-- <UButton @click="saveByteArray('summary.pdf', summaryData.value.summaryBuf)" label="Summary" icon="i-heroicons-arrow-down" />
                        <UButton @click="saveByteArray('transcript.pdf', summaryData.value.transcriptBuf)" label="Transcript" icon="i-heroicons-arrow-down" color="gray" /> -->
                        <h1 class="text-2xl font-semibold flex items-center gap-2 justify-between w-full">
                            <div class="flex gap-2 items-center">
                                <UButton
                                    class="mx-4"
                                    icon="i-heroicons-arrow-left"
                                    @click="
                                        () => {
                                            summaryVisible = false;
                                            loading = false;
                                        }
                                    "
                                />
                                <span>Your summary has been generated:</span>
                            </div>
                            <div class="flex gap-2">
                                <UButton
                                    icon="i-heroicons-arrow-down"
                                    size="lg"
                                    @click="saveByteArray('summary.pdf', summaryData.value.summaryBuf)"
                                >
                                    <span class="font-semibold">Download Now</span>
                                </UButton>
                                <UButton
                                    icon="i-heroicons-newspaper"
                                    color="gray"
                                    size="lg"
                                    @click="saveByteArray('transcript.pdf', summaryData.value.transcriptBuf)"
                                >
                                    <span class="font-semibold">Download Transcript</span>
                                </UButton>
                            </div>
                        </h1>
                    </div>
                </UCard>
                <div class="flex justify-between pt-4">
                    <h1 class="px-4 text-xl font-semibold">🔑 Key Topics</h1>
                    <!-- <span>Hashtags: {{ summaryData.value.hashtags }}</span> -->
                </div>
                <div class="flex flex-col gap-2 overflow-auto max-h-xl p-4">
                    <div v-for="topic in summaryData.value.topics" class="flex flex-col gap-3">
                        <UCard v-if="topic.name">
                            <div class="mt-2">
                                <span class="truncate font-semibold text-lg">{{ topic.name }}</span>
                                <div class="flex gap-2 items-center">
                                    <span class="opacity-50 text-sm">Importance:</span>
                                    <UBadge variant="soft" :label="topic.priority" />
                                </div>
                            </div>
                            <UAccordion
                                class="mt-3"
                                :items="[
                                    {
                                        label: 'Sub Topics',
                                        slot: 'sub-topics',
                                    },
                                ]"
                            >
                                <template #default="{ item, index, open }">
                                    <UButton color="primary" variant="soft" class="w-44">
                                        <span class="truncate">{{ item.label }}</span>

                                        <template #trailing>
                                            <UIcon
                                                name="i-heroicons-chevron-right-20-solid"
                                                class="w-5 h-5 ms-auto transform transition-transform duration-200"
                                                :class="[open && 'rotate-90']"
                                            />
                                        </template>
                                    </UButton>
                                </template>

                                <template #sub-topics>
                                    <ul
                                        class="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400 my-3 overflow-auto"
                                    >
                                        <li v-for="subTopic in topic['sub-topics']">{{ subTopic }}</li>
                                    </ul>
                                    <UAlert
                                        variant="subtle"
                                        color="primary"
                                        icon="i-heroicons-academic-cap"
                                        title="Food For Thought"
                                    >
                                        <template #title="{ title }">
                                            <span class="font-semibold" v-html="title" />
                                        </template>
                                        <template #description>
                                            <div class="space-x-2 flex items-center">
                                                <span
                                                    class="dark:text-primary-100 text-primary-900 text-md"
                                                    >{{ topic.question }}</span
                                                >
                                                <UButton
                                                    :ui="{ padding: '!p-0 !py-0' }"
                                                    variant="link"
                                                    color="sky"
                                                    label="Disover more"
                                                    size="sm"
                                                    icon="i-heroicons-sparkles"
                                                />
                                            </div>
                                        </template>
                                    </UAlert>
                                </template>
                            </UAccordion>
                        </UCard>
                    </div>
                </div>
                <!-- <template #header>
                    <div class="flex gap-2">
                        <UButton label="Summary" icon="i-heroicons-arrow-down" />
                        <UButton label="Transcript" icon="i-heroicons-arrow-down" color="gray" />
                    </div>
                </template>
                <div class="flex gap-1">
                    Hashtags: 
                    <UBadge v-for="tag in summaryData.value.hashtags" :label="tag" variant="soft" />
                </div>
                <div v-for="topic in summaryData.value.topics" class="flex flex-col gap-2 w-72">
                    <UCard v-if="topic.name">
                        <div class="flex justify-between">
                            <span>{{ topic.name }}</span>
                            <div class="flex gap-2 items-center">
                                <span class="text-sm opacity-50">Priority:</span>
                                <UBadge variant="soft" :label="topic.priority" />
                            </div>
                        </div>
                        <ul class="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400 mt-4">
                            <li v-for="subTopic in topic['sub-topics']">{{ subTopic }}</li>
                        </ul>
                    </UCard>
                </div> -->
            </UCard>
            <!-- <pre>{{ summaryData }}</pre> -->
        </div>
    </div>
</template>

<script setup lang="ts">
const summaryData = ref({});
const loading = ref(false);
const summaryVisible = ref(false);

const { JOKES_API_KEY } = useRuntimeConfig().public;

const { data: jokes } = useFetch("https://api.api-ninjas.com/v1/jokes?limit=1", {
    headers: { "X-Api-Key": JOKES_API_KEY },
});

const client = useSupabaseClient();

const onSummarize = async (e) => {
    loading.value = true;
    summaryVisible.value = false;

    const { data, pending } = await useFetch("/api/process", {
        method: "POST",
        body: JSON.stringify(e),
    });
    
    loading.value = false;
    summaryVisible.value = true;
    summaryData.value = data;
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
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
}

const toast = useToast();

const copyGoodVideoToClipboard = async () => {
    const textArea = document.createElement("textarea");
    textArea.value =
        "https://oc-vp-distribution04.ethz.ch/mh_default_org/oaipmh-mmp/09e71d9e-8399-40ea-be39-605285e0ae65/33fbd877-2001-4767-8a76-9b5bc7a2479c/20170918_1340_HPHG2_YourFutureInBiology_Theler.mp4";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand("copy");
    } catch (err) {
        console.error("Unable to copy to clipboard", err);
    }
    document.body.removeChild(textArea);

    toast.add({ title: "Copied to clipboard successfully.", icon: "i-heroicons-check-badge" });
};
</script>
