<template>
    <div class="flex flex-col gap-2 sm:flex-row px-6 sm:px-0 w-full mt-8">
        <UInput class="w-full" v-model="videoUrl" placeholder="Video URL" size="xl" />
        <div class="flex gap-2">
            <UButton class="flex justify-center flex-1 sm:w-auto" @click="submit" label="Summarize"
                icon="i-heroicons-sparkles" size="xl" />
        </div>
    </div>
    <div class="w-full flex flex-col sm:flex-row items-center sm:justify-center py-4 gap-2 px-6 sm:px-0">
        <UPopover class="w-full sm:w-auto">
            <UButton class="flex justify-center w-full sm:w-32" icon="i-heroicons-cog-6-tooth" size="xl" color="gray"
                label="Settings" />
            <template #panel>
                <UCard>
                    <div class="w-64">
                        <UFormGroup label="Summary Length">
                            <USelect class="my-2" v-model="selectedLength" :options="summaryLengthOptions" />
                        </UFormGroup>
                    </div>
                </UCard>
            </template>
        </UPopover>
        <UButton icon="i-heroicons-globe-europe-africa" class="w-full sm:w-32 flex justify-center items-center" color="gray"
            size="xl" label="Explore" to="/explore" />
    </div>
</template>

<script setup lang="ts">
const summaryLengthOptions = ["Short", "Medium", "Long"];
const selectedLength = ref(summaryLengthOptions[2]);

const videoUrl = ref("");

const toast = useToast();

const emit = defineEmits(["summarize"]);
const submit = async () => {
    if (!videoUrl.value) {
        toast.add({ title: "Please enter a link!" });
        return;
    }

    if (!videoUrl.value.includes("ethz.ch")) {
        toast.add({ title: "Please enter an ETHz Video!" });
        return;
    }

    emit("summarize", { videoUrl: videoUrl.value, length: selectedLength.value.toLowerCase() })
};
</script>
