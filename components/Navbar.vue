<template>
    <header class="flex justify-between items-center py-3">
        <div class="flex gap-2 items-center">
            <Logo class="w-12 h-12" />
            <h1 class="text-xl font-semibold">TLDR</h1>
        </div>
        <nav class="flex gap-2">
            <UButton
                label="New Summary"
                icon="i-heroicons-plus"
                variant="link"
                to="/"
                class="hover:dark:text-primary-100 dark:text-primary-100 text-primary-900 hover:text-primary-900"
                active-class="dark:bg-primary-800 bg-primary-100"
            />
            <UButton 
                label="Explore" 
                icon="i-heroicons-globe-europe-africa" 
                variant="link" 
                to="/explore"  
                class="hover:dark:text-primary-100 dark:text-primary-100 text-primary-900 hover:text-primary-900"
                active-class="dark:bg-primary-800 bg-primary-100"
            />
        </nav>
    </header>
</template>
