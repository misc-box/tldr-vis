<template>
    <div class="mt-6">
        <div class="flex gap-2 flex-col sm:flex-row sm: justify-between my-6">
            <Navbar />
        </div>
        <div>
            <!-- <pre>{{ summaries }}</pre> -->
            <SummaryCard v-for="summary in summaries" @click="navigateTo(`/summaries/processed/${(summary as any).id}`)"  :summary="summary" />
        </div>
    </div> 
</template>

<script setup lang="ts">
const client = useSupabaseClient();

const { data: summaries } = await useAsyncData('summaries', async () => {
  const { data } = await client.from('global_summaries').select('*');
  return data;
})

</script>