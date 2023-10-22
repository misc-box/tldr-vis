<template>
    <UCard class="mt-3 hover:opacity-50 cursor-pointer transition-all duration-300">
        <div class="h-24 flex justify-between items-center">
            <div>
                <h1 class="text-3xl">
                    {{ summary.result.topics ? summary.result.topics["1"].name : "Loading..." }}
                </h1>
                <span class="font-mono text-xl opacity-50 flex items-center gap-2">
                    <UIcon name="i-heroicons-calendar-days" />
                    <pre>{{ new Date(summary.created_at).toLocaleDateString() }}</pre>
                </span>
                <div class="flex gap-2 mt-2 max-w-md overflow-auto no-scrollbar">
                    <!-- <UBadge v-for="tag in summary.result.topics.hashtags" :label="`#${tag.replaceAll(' ', '')}`" variant="soft" /> -->
                </div>
            </div>
            <UIcon name="i-heroicons-chevron-right" class="w-12 h-12 opacity-50" />
        </div>
    </UCard>
</template>

<script setup lang="ts">
const { summary } = defineProps<{ summary: any }>();
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}
</style>
