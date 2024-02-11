<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: transparent !important;
}

::-webkit-scrollbar-track {
  border-radius: 1rem;
  margin: 0.4rem;
  margin-top: 0.4rem;
  border-left: 1px solid rgba(211, 211, 211, 0);
}

::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background: linear-gradient(30deg, #0e7490, #0e7490);
  box-shadow: inset 0 0 6px #0e7490;
}
</style>
