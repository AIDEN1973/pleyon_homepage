<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1 pt-[var(--header-height)]">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
