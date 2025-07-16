<script lang="ts">
  export let isSmallScreen: boolean;

  function handleClick() {
    alert('fetch');
  }
</script>

<div class="rounded-l text-base  h-full flex flex-col">
  <div class="p-1 rounded-xl h-full w-full relative">
    <textarea class="textarea resize-none w-full h-full" placeholder="Ask me something"></textarea>
    <div class="absolute bottom-4 right-6">
      <button class="btn btn-ghost btn-lg" on:click={handleClick}>
        sumbit
      </button>
    </div>
  </div>
</div>
