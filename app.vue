<template>
    <UContainer class="max-w-2xl">
        <NuxtPage />
    </UContainer>
</template>

<style>
* {
    font-family: 'Red Hat Display', sans-serif;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>