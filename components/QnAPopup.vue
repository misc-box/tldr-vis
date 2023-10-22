<template>
    <UModal v-model="isModalOpen">
        <UCard>
            <template #header>
                <div class="w-full flex justify-between items-center">
                    <span class="flex items-center gap-2 font-semibold text-lg"
                        ><UIcon class="w-8 h-8" name="i-heroicons-globe-alt" />TLDR AI Companion</span
                    >
                    <UButton icon="i-heroicons-x-mark" color="gray" square @click="emit('close')" />
                </div>
            </template>
            <div class="space-y-3 h-1/2">
                <UCard>
                    <div class="flex flex-col justify-center gap-1 mb-2 max-h-sm">
                        <div class="flex gap-2 items-center mb-2">
                            <UIcon name="i-heroicons-question-mark-circle" class="w-5 h-5 text-primary-300" />
                            <span class="font-semibold text-primary-300">Question: </span>
                        </div>
                        <code>{{ question }}</code>
                    </div>
                </UCard>
                <UCard>
                    <div class="flex items-center gap-1 mb-2">
                        <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-green-300" />
                        <span class="font-semibold text-green-300">AI's Answer: </span>
                    </div>
                    <code class="h-64 overflow-auto"
                        >Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem corrupti earum
                        ipsam? Magnam consequuntur omnis nam impedit ullam eius, ipsam nulla beatae! Dolorem
                        ab rem culpa, non ad rerum itaque facilis nostrum recusandae dolor harum magni
                        distinctio perspiciatis vel quia suscipit aliquam corrupti incidunt! Error quam ex
                        repellat qui corporis?</code
                    >
                </UCard>
            </div>
        </UCard>
    </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{ question: string; isOpen: boolean }>();
const { question } = props;

const isModalOpen = toRef(props, "isOpen");

const emit = defineEmits(["close"]);
</script>
