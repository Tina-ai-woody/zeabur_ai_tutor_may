<script setup lang="ts">
import TeacherProblemForm from "~/components/teacher/ProblemForm.vue";
import TeacherProblemPreview from "~/components/teacher/ProblemPreview.vue";

definePageMeta({
  layout: "teacher",
});

interface Choice {
  text: string;
  isCorrect: boolean;
}

interface ProblemData {
  title: string;
  content: string;
  choices: Choice[];
  correctAnswer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  source: string;
  imageFile: File | null;
  imagePreviewUrl: string | null;
  hashtags: string[];
}

const formData = ref<ProblemData>({
  title: "",
  content: "",
  choices: [{ text: "", isCorrect: false }],
  correctAnswer: "",
  explanation: "",
  difficulty: "medium",
  source: "",
  imageFile: null,
  imagePreviewUrl: null,
  hashtags: [],
});

const isUploading = ref(false);

const submitProblem = async () => {
  try {
    isUploading.value = true;
    let imageUrl = "";

    if (formData.value.imageFile) {
      const uploadData = new FormData();
      uploadData.append("file", formData.value.imageFile);

      const { imageUrl: uploadedUrl } = await $fetch<{ imageUrl: string }>(
        "/api/teacher/upload",
        {
          method: "POST",
          body: uploadData,
        }
      );

      imageUrl = uploadedUrl;
    }

    // Create problem
    await $fetch("/api/teacher/problems", {
      method: "POST",
      body: {
        title: formData.value.title,
        content: formData.value.content,
        choices: formData.value.choices.map((c) => c.text),
        correctAnswer: formData.value.correctAnswer,
        explanation: formData.value.explanation,
        difficulty: formData.value.difficulty,
        source: formData.value.source,
        imageUrl,
        hashtags: formData.value.hashtags,
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

const handleCancel = () => {
  navigateTo("/teacher/problems");
};
</script>

<template>
  <div class="container mx-auto p-4 max-w-7xl">
    <h1 class="text-2xl font-bold mb-6">Create New Problem</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Left Column: Editor -->
      <div>
        <TeacherProblemForm
          v-model="formData"
          :is-uploading="isUploading"
          submit-label="Create Problem"
          @submit="submitProblem"
          @cancel="handleCancel"
        />
      </div>

      <!-- Right Column: Live Preview -->
      <div class="hidden lg:block">
        <TeacherProblemPreview :problem="formData" />
      </div>
    </div>
  </div>
</template>
