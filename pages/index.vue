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
</script>
