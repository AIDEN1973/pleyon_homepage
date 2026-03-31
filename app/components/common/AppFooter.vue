<template>
  <footer class="bg-white text-foreground/70 py-16 pb-8 border-t border-border">
    <div class="max-w-content mx-auto px-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p class="text-sm font-medium text-foreground/50 mb-1">러츠</p>
          <p class="text-xs text-foreground/30 leading-relaxed">대표 : 박소영 | 사업자등록번호 : 241-22-00734</p>
          <p class="text-xs text-foreground/30 leading-relaxed">주소 : 부산광역시 금정구 금사로57번길 2 2층</p>
          <p class="text-xs text-foreground/30 leading-relaxed">고객센터 : 010-2648-4417</p>
        </div>
        <p class="text-xs text-foreground/30">&copy; {{ currentYear }} 플레이온. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
