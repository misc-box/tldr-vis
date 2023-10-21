<template>
    <UCard class="hover:opacity-50 cursor-pointer transition-all duration-300">
        <div class="h-24 flex justify-between items-center">
            <div>
                <h1 class="text-3xl">DiscMath</h1>
                <span class="font-mono text-xl opacity-50 flex items-center gap-2">
                    <UIcon name="i-heroicons-calendar-days" />
                    {{ new Date().toLocaleDateString() }}
                </span>
                <div class="flex gap-2 mt-2">
                    <UBadge label="#LinearAlgebra" variant="soft" />
                    <UBadge label="#AI" variant="soft" />
                </div>
            </div>
            <UIcon name="i-heroicons-chevron-right" class="w-12 h-12 opacity-50" /> 
        </div>
    </UCard>
</template>