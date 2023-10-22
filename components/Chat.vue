<template>
    <div class="space-y-3">
        <UCard>
            <div class="w-full max-h-[500px] gap-6 overflow-auto p-2 snap-y flex flex-col-reverse">
                <div class="w-full flex justify-end items-end">
                    <UCard class="relative max-w-[50%]" :ui="{ base: { padding: 'p-0 sm:p-0' }, header: { padding: 'p-0'} }">
                        <p class="p-3">Hi there buddy! Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis voluptatum maxime corporis mollitia enim labore at illo, quibusdam explicabo qui, voluptate nemo porro ab autem suscipit quia? Modi, consequuntur aliquid.</p>
                        <span class="absolute bottom-1 right-3 text-sm opacity-50">{{ new Date().toLocaleTimeString() }}</span>
                    </UCard>
                </div>
                <div class="w-full flex justify-start items-end">
                    <UCard class="relative max-w-[50%]">
                        <p class="p-3">Hi there buddy! Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis voluptatum maxime corporis mollitia enim labore at illo, quibusdam explicabo qui, voluptate nemo porro ab autem suscipit quia? Modi, consequuntur aliquid. Lorem ipsum dolor sit amet consectetur adipisicing elit. In saepe pariatur fugit dolor! Quos atque, alias, hic similique exercitationem sit quo quod quia iusto deserunt vero repellat maxime, delectus amet? Temporibus, quidem quos labore tempore nobis ipsa perferendis corporis. Optio sunt commodi unde amet. Fugiat laudantium magni nesciunt laborum, perferendis harum incidunt at similique aut, aspernatur molestias commodi quidem, ipsum deleniti optio nam explicabo quas! Voluptate aut fugit consequatur accusamus explicabo provident officia enim dignissimos doloremque, ullam harum veritatis accusantium animi soluta, eligendi aperiam fuga natus quidem facere molestiae unde maxime ex. Accusantium esse minus mollitia repellat, amet quas repudiandae.</p>
                        <span class="absolute bottom-1 right-3 text-sm opacity-50">{{ new Date().toLocaleTimeString() }}</span>
                    </UCard>
                </div>
                <!-- <div class="opacity-50 gap-2 w-full flex flex-col items-center">
                    <h1 class="text-4xl">(ಥ﹏ಥ)</h1>
                    <span>
                        No chat started yet. Write a message!
                    </span>
                </div> -->
            </div>
        </UCard>
        <div class="flex gap-2">
            <UInput class="flex-1" size="xl" placeholder="Write a message..." />
            <UButton square icon="i-heroicons-paper-airplane" size="xl" class="px-10" >
            </UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { _padding } from '#tailwind-config/theme';

</script>