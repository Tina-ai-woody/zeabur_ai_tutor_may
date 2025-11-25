<script setup lang="ts">
definePageMeta({
  layout: "teacher",
});

const title = ref("");
const content = ref("");
const choices = ref([{ text: "", isCorrect: false }]);
const correctAnswer = ref("");
const explanation = ref("");
const difficulty = ref("medium");
const source = ref("");
const imageFile = ref<File | null>(null);
const isUploading = ref(false);
const imagePreviewUrl = ref<string | null>(null);

const addChoice = () => {
  choices.value.push({ text: "", isCorrect: false });
};

const removeChoice = (index: number) => {
  choices.value.splice(index, 1);
};

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    imageFile.value = target.files[0];

    // Create preview URL
    if (imagePreviewUrl.value && !imagePreviewUrl.value.startsWith("http")) {
      URL.revokeObjectURL(imagePreviewUrl.value);
    }
    imagePreviewUrl.value = URL.createObjectURL(target.files[0]);
  }
};

const hashtags = ref<string[]>([]);
const newHashtag = ref("");

const addHashtag = () => {
  const tag = newHashtag.value.trim();
  if (tag && !hashtags.value.includes(tag)) {
    hashtags.value.push(tag);
    newHashtag.value = "";
  }
};

const removeHashtag = (index: number) => {
  hashtags.value.splice(index, 1);
};

const validateForm = () => {
  if (!title.value.trim()) {
    alert("Please enter a title");
    return false;
  }
  if (!content.value.trim()) {
    alert("Please enter problem content");
    return false;
  }
  if (choices.value.length < 2) {
    alert("Please add at least 2 choices");
    return false;
  }
  if (choices.value.some((c) => !c.text.trim())) {
    alert("Please fill in all choice texts");
    return false;
  }
  if (!correctAnswer.value) {
    alert("Please select a correct answer");
    return false;
  }
  return true;
};

const submitProblem = async () => {
  if (!validateForm()) return;

  try {
    isUploading.value = true;
    let imageUrl = "";

    if (imageFile.value) {
      const formData = new FormData();
      formData.append("file", imageFile.value);

      const { imageUrl: uploadedUrl } = await $fetch<{ imageUrl: string }>(
        "/api/teacher/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      imageUrl = uploadedUrl;
    }

    // Create problem
    await $fetch("/api/teacher/problems", {
      method: "POST",
      body: {
        title: title.value,
        content: content.value,
        choices: choices.value.map((c) => c.text),
        correctAnswer: correctAnswer.value,
        explanation: explanation.value,
        difficulty: difficulty.value,
        source: source.value,
        imageUrl,
        hashtags: hashtags.value,
      },
    });

    alert("Problem created successfully!");
    navigateTo("/teacher/problems");
  } catch (error: any) {
    console.error("Error creating problem:", error);
    alert(`Failed to create problem: ${error.message || "Unknown error"}`);
  } finally {
    isUploading.value = false;
  }
};
</script>

<template>
  <div class="container mx-auto p-4 max-w-7xl">
    <h1 class="text-2xl font-bold mb-6">Create New Problem</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Left Column: Editor -->
      <div>
        <form @submit.prevent="submitProblem" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">Difficulty</label>
              <select v-model="difficulty" class="select select-bordered">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div class="form-control">
              <label class="label">Source</label>
              <input
                v-model="source"
                type="text"
                class="input input-bordered"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label mb-2">Title</label>
              <br />
              <input
                v-model="title"
                type="text"
                class="input input-bordered"
                required
              />
            </div>
            <div class="form-control">
              <label class="label mb-2">Hashtags</label>
              <div class="flex gap-2 mb-2">
                <input
                  v-model="newHashtag"
                  @keydown.enter.prevent="addHashtag"
                  type="text"
                  class="input input-bordered flex-1"
                  placeholder="Type a tag and press Enter"
                />
                <button
                  type="button"
                  @click="addHashtag"
                  class="btn btn-secondary p-2"
                >
                  Add
                </button>
              </div>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="(tag, index) in hashtags"
                  :key="index"
                  class="badge badge-lg badge-primary gap-2"
                >
                  {{ tag }}
                  <button
                    type="button"
                    @click="removeHashtag(index)"
                    class="btn btn-xs btn-circle btn-ghost"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="form-control">
            <label class="label mb-2">Content (Markdown supported)</label>
            <br />
            <textarea
              v-model="content"
              class="textarea textarea-bordered overflow-hidden h-64 w-full font-mono"
              required
            ></textarea>
          </div>

          <div class="form-control">
            <label class="label mb-2">Image (Optional)</label>
            <br />
            <input
              type="file"
              @change="handleImageUpload"
              accept="image/*"
              class="file-input file-input-bordered"
            />
          </div>

          <div class="form-control">
            <label class="label mb-2">Choices</label>
            <div
              v-for="(choice, index) in choices"
              :key="index"
              class="flex gap-2 mb-2"
            >
              <input
                v-model="choice.text"
                type="text"
                class="input input-bordered flex-1"
                placeholder="Choice text"
                required
              />
              <input
                type="radio"
                name="correctAnswer"
                :value="choice.text"
                v-model="correctAnswer"
                class="radio radio-primary mt-3"
                required
              />
              <button
                type="button"
                @click="removeChoice(index)"
                class="btn btn-square btn-error btn-sm mt-1"
              >
                ✕
              </button>
            </div>
            <button
              type="button"
              @click="addChoice"
              class="btn btn-sm btn-ghost"
            >
              + Add Choice
            </button>
          </div>

          <div class="form-control">
            <label class="label mb-2">Explanation</label>
            <br />
            <textarea
              v-model="explanation"
              class="textarea textarea-bordered overflow-hidden h-64 w-full font-mono"
            ></textarea>
          </div>

          <div class="flex gap-4">
            <button
              type="submit"
              class="btn btn-primary flex-1"
              :disabled="isUploading"
            >
              {{ isUploading ? "Uploading..." : "Create Problem" }}
            </button>
            <NuxtLink to="/teacher/problems" class="btn btn-ghost"
              >Cancel</NuxtLink
            >
          </div>
        </form>
      </div>

      <!-- Right Column: Live Preview -->
      <div class="hidden lg:block">
        <div class="sticky top-4">
          <h2 class="text-xl font-bold mb-4 text-base-content/70">
            Live Preview
          </h2>

          <div class="card bg-base-100 shadow-xl border border-base-200">
            <div class="card-body">
              <div class="flex justify-between items-start">
                <h1 class="card-title text-2xl">
                  {{ title || "Problem Title" }}
                </h1>
                <div class="flex gap-2">
                  <div class="badge badge-outline">{{ difficulty }}</div>
                  <div v-if="source" class="badge badge-ghost">
                    {{ source }}
                  </div>
                </div>
              </div>

              <!-- Problem Content -->
              <div class="py-4">
                <MarkdownRenderer
                  :content="content || 'Problem content will appear here...'"
                />
              </div>

              <!-- Image Preview -->
              <div v-if="imagePreviewUrl" class="mb-4">
                <img
                  :src="imagePreviewUrl"
                  alt="Problem Image"
                  class="rounded-lg max-h-96 object-contain"
                />
              </div>

              <div class="divider"></div>

              <!-- Choices Preview -->
              <div class="form-control space-y-3">
                <label
                  v-for="(choice, index) in choices"
                  :key="index"
                  class="label cursor-pointer border rounded-lg p-4 hover:bg-base-200 transition-colors"
                  :class="{
                    'border-success bg-success/10':
                      choice.text && choice.text === correctAnswer,
                  }"
                >
                  <span class="label-text text-base flex-1">
                    <span class="font-bold mr-2"
                      >{{ String.fromCharCode(65 + index) }}.</span
                    >
                    {{ choice.text || "Choice " + (index + 1) }}
                  </span>
                  <input
                    type="radio"
                    name="preview-radio"
                    class="radio radio-primary"
                    :checked="choice.text === correctAnswer"
                    disabled
                  />
                </label>
              </div>

              <!-- Explanation Preview -->
              <div v-if="explanation" class="mt-6">
                <div class="collapse collapse-arrow bg-base-200">
                  <input type="checkbox" checked />
                  <div class="collapse-title text-xl font-medium">
                    Official Solution
                  </div>
                  <div class="collapse-content">
                    <MarkdownRenderer :content="explanation" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
