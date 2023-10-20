<template>
    <svg width="37" height="24" viewBox="0 0 37 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M36 21L30.803 15.803M30.803 15.803C32.2096 14.3964 32.9998 12.4887 32.9998 10.4995C32.9998 8.51029 32.2096 6.60256 30.803 5.19599C29.3965 3.78941 27.4887 2.99921 25.4995 2.99921C23.5104 2.99921 21.6026 3.78941 20.196 5.19599C18.7895 6.60256 17.9993 8.51029 17.9993 10.4995C17.9993 12.4887 18.7895 14.3964 20.196 15.803C21.6026 17.2096 23.5104 17.9998 25.4995 17.9998C27.4887 17.9998 29.3965 17.2096 30.803 15.803Z"
            :stroke="stroke"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <g clip-path="url(#clip0_8_26)">
            <path
                d="M26 18H9.5C9.10218 18 8.72064 17.842 8.43934 17.5607C8.15804 17.2794 8 16.8978 8 16.5V4.5C8 4.10218 8.15804 3.72064 8.43934 3.43934C8.72064 3.15804 9.10218 3 9.5 3H26"
                :stroke="stroke"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M21.1875 7.9375H30.8125M21.1875 11H30.8125M21.1875 14.0625H26"
                :stroke="stroke"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </g>
        <path
            d="M8.08804 12.2488L2.51023 17.1315C2.38628 17.2398 2.22857 17.3135 2.05701 17.343C1.88545 17.3726 1.70773 17.3568 1.54632 17.2977C1.3849 17.2385 1.24702 17.1386 1.15008 17.0106C1.05315 16.8826 1.00151 16.7323 1.00169 16.5786L1.02735 4.7771C1.02784 4.62337 1.08013 4.47324 1.17762 4.34567C1.27511 4.2181 1.41343 4.11882 1.5751 4.06036C1.73678 4.0019 1.91456 3.98689 2.08599 4.01721C2.25742 4.04754 2.41481 4.12185 2.53829 4.23075L5.31655 6.68421L8.09481 9.13766M8.10157 6.02656L8.09143 10.6932L8.08128 15.3599"
            :stroke="stroke"
            stroke-width="1.5"
            stroke-linecap="round"
        />
        <defs>
            <clipPath id="clip0_8_26">
                <rect width="24" height="24" fill="white" transform="translate(7)" />
            </clipPath>
        </defs>
    </svg>
</template>

<script setup lang="ts">
const stroke = ref("black");

onMounted(() => {
    if (document.querySelector("html")?.classList.contains("dark")) {
        stroke.value = "white";
    }
});
</script>
