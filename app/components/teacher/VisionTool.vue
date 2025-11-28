<script setup lang="ts">
const emit = defineEmits<{
  (e: "text-extracted", text: string): void;
}>();

const isOpen = ref(false);
const isProcessing = ref(false);
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    imageFile.value = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const extractText = async () => {
  if (!imagePreview.value) return;

  try {
    isProcessing.value = true;
    const { text } = await $fetch<{ text: string }>("/api/teacher/vision", {
      method: "POST",
      body: {
        image: imagePreview.value,
      },
    });

    if (text) {
      emit("text-extracted", text);
      // Optional: close tool or clear after success
      // isOpen.value = false;
    } else {
      alert("No text found in the image.");
    }
  } catch (error: any) {
    console.error("Extraction error:", error);
    alert("Failed to extract text. Please try again.");
  } finally {
    isProcessing.value = false;
  }
};

const clearImage = () => {
  imageFile.value = null;
  imagePreview.value = null;
};
</script>

<template>
  <div class="border rounded-lg p-4 bg-base-100 shadow-sm mb-4">
    <button
      type="button"
      @click="isOpen = !isOpen"
      class="flex items-center justify-between w-full font-medium text-left"
    >
      <span class="flex items-center gap-2">
        <span class="icon">📷</span>
        Image to Text Tool
      </span>
      <span class="text-sm opacity-70">{{ isOpen ? "Hide" : "Show" }}</span>
    </button>

    <div v-if="isOpen" class="mt-4 space-y-4">
      <div v-if="!imagePreview" class="form-control">
        <input
          type="file"
          accept="image/*"
          @change="handleFileChange"
          class="file-input file-input-bordered w-full"
        />
        <label class="label">
          <span class="label-text-alt text-gray-500"
            >Upload an image to extract text from it</span
          >
        </label>
      </div>

      <div v-else class="space-y-4">
        <div class="relative rounded-lg overflow-hidden border bg-base-200">
          <img
            :src="imagePreview"
            alt="Preview"
            class="max-h-64 mx-auto object-contain"
          />
          <button
            @click="clearImage"
            class="absolute top-2 right-2 btn btn-circle btn-xs btn-error"
            title="Remove image"
          >
            ✕
          </button>
        </div>

        <button
          type="button"
          @click="extractText"
          class="btn btn-primary w-full"
          :disabled="isProcessing"
        >
          <span
            v-if="isProcessing"
            class="loading loading-spinner loading-sm"
          ></span>
          {{ isProcessing ? "Extracting Text..." : "Extract Text to Content" }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.icon {
  font-size: 1.2em;
}
</style>
