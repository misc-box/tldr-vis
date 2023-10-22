<template>
    <div class="flex flex-col justify-center items-center w-full">
        <div class="lg:w-[1000px] my-6">
            <UButton class="mb-3" icon="i-heroicons-arrow-left" @click="navigateTo('..')" label="Go Home" />
            <UTabs :items="tabs" :default-index="0">
                <template #default="{ item, index, selected }">
                    <div class="flex items-center gap-2 relative truncate">
                        <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />

                        <span class="truncate">{{ item.label }}</span>

                        <span
                            v-if="selected"
                            class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400"
                        />
                    </div>
                </template>
                <template #item="{ item }">
                    <UCard>
                        <div v-if="item.key === 'overview'">
                            <div class="flex gap-2 mx-4 mb-3">
                                <!-- <UButton @click="saveByteArray('summary.pdf', summaryData.value.summaryBuf)" label="Summary" icon="i-heroicons-arrow-down" />
                                <UButton @click="saveByteArray('transcript.pdf', summaryData.value.transcriptBuf)" label="Transcript" icon="i-heroicons-arrow-down" color="gray" /> -->
                                <h1
                                    class="text-2xl font-semibold flex items-center gap-2 justify-between w-full"
                                >
                                    <div class="flex gap-2 items-center">
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
                                            @click="
                                                saveByteArray('transcript.pdf', summary.result.transcriptBuf)
                                            "
                                        >
                                            <span class="font-semibold">Download Transcript</span>
                                        </UButton>
                                    </div>
                                </h1>
                            </div>
                            <div class="flex justify-between pt-4">
                                <h1 class="px-4 text-xl font-semibold">🔑 Key Topics</h1>
                                <!-- <span>Hashtags: {{ summaryData.value.hashtags }}</span> -->
                            </div>
                            <div class="flex flex-col gap-2 overflow-auto max-h-xl p-4">
                                <div v-for="topic in summary.result.topics" class="flex flex-col gap-3">
                                    <UCard v-if="topic.name">
                                        <div class="mt-2">
                                            <span class="truncate font-semibold text-lg">{{
                                                topic.name
                                            }}</span>
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
                                                    <li v-for="subTopic in topic['sub-topics']">
                                                        {{ subTopic }}
                                                    </li>
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
                                                                @click="isQnAOpen[topic.question] = true"
                                                            />
                                                            <QnAPopup
                                                                @close="isQnAOpen[topic.question] = false"
                                                                :isOpen="isQnAOpen[topic.question]"
                                                                :question="topic.question"
                                                            />
                                                        </div>
                                                    </template>
                                                </UAlert>
                                            </template>
                                        </UAccordion>
                                    </UCard>
                                </div>
                            </div>
                        </div>

                        <div v-else-if="item.key === 'chat'">
                            <Chat />
                        </div>

                        <div v-else-if="item.key === 'quiz'">
                            <Quiz />
                        </div>
                    </UCard>
                </template>
            </UTabs>
        </div>
    </div>
</template>

<script setup lang="ts">
const tabs = [
    {
        key: "overview",
        label: "Overview",
        icon: "i-heroicons-squares-plus",
    },
    {
        key: "chat",
        label: "Chat",
        icon: "i-heroicons-chat-bubble-bottom-center-text",
    },
    {
        key: "quiz",
        label: "Quiz",
        icon: "i-heroicons-question-mark-circle",
    },
];

const route = useRoute();

const client = useSupabaseClient();

const isQnAOpen = reactive<any>({});

const { data: summary } = await useAsyncData("summary", async () => {
    const { data } = await client.from("global_summaries").select("*").eq("id", route.params.id).single();

    return data;
});

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
