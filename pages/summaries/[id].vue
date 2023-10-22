<template>

    <div class="flex flex-col justify-center items-center w-full">
            <div class="lg:w-[1000px] my-10">
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
                                    @click="navigateTo('..')"
                                />
                                <span>Your summary has been generated:</span>
                            </div>
                            <div class="flex gap-2">
                                <UButton
                                    icon="i-heroicons-arrow-down"
                                    size="lg"
                                    @click="saveByteArray('summary.pdf', summary?.result.summaryBuf)"
                                >
                                    <span class="font-semibold">Download Now</span>
                                </UButton>
                                <UButton
                                    icon="i-heroicons-newspaper"
                                    color="gray"
                                    size="lg"
                                    @click="saveByteArray('transcript.pdf', summary.result.transcriptBuf)"
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
                    <div v-for="topic in summary.result.topics" class="flex flex-col gap-3">
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
                                    <UButton
                                        color="primary"
                                        variant="soft"
                                        class="w-44"
                                    >
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
const route = useRoute();

const client = useSupabaseClient();

const { data: summary } = await useAsyncData('summary', async () => {
  const { data } = await client.from('global_summaries').select('*').eq("id", route.params.id).single();
  return data;
})

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
</script>