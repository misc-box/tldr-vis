<template>
    <UButton :loading="loading" @click="generate" block icon="i-heroicons-plus" size="xl">
        <span class="">Generate questions based on the lecture</span>
    </UButton>
    <div v-if="!quiz" class="opacity-50 gap-2 w-full flex flex-col items-center mt-10">
        <h1 class="text-4xl">(ノಠ益ಠ)ノ彡┻━┻</h1>
        <span>
            No questions yet! 
            <UButton variant="link" label="Get quizzed now!" size="sm" />
        </span>
    </div>
    <div v-else>
        <div v-for="(question, index) in quiz">
            <UCard class="my-2">
                <div class="flex gap-2 items-center">
                    <span>Question #{{ Number(index) + 1  }}</span>
                    -   
                    <UBadge size="lg" :label="question.difficulty" variant="soft" :color="getColor(question.difficulty)" />
                </div>
                <span class="block mt-2">{{ question.question }}</span>
            </UCard>
        </div>
    </div>
</template>

<script setup lang="ts">
const getColor = (difficulty: string) => {
    if (difficulty === 'easy') {
        return 'green'
    }
    if (difficulty === 'medium') {
        return 'yellow'
    }
    if (difficulty === 'hard') {
        return 'red'
    }
    return 'gray'
}

const quiz = ref<any>(null)
const loading = ref(false);

const { transcript } = defineProps<{ transcript: string }>();

const generate = async () => {
    loading.value = true;

    const { data } = await useFetch("/api/quiz", {
        method: "POST",
        body: {
            transcript
        }
    })
    
    console.log(data.value)

    // @ts-ignore
    quiz.value = data?.value?.response;
    loading.value = false;
}
</script>
