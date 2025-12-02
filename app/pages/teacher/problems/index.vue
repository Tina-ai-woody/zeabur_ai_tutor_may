<script setup lang="ts">
definePageMeta({
  layout: "teacher",
});

const searchParams = ref({
  title: "",
  source: "",
  hashtag: "",
});

const { data: problems, refresh } = await useFetch("/api/problems", {
  query: searchParams,
});

const { data: classrooms } = await useFetch("/api/teacher/classrooms");

const handleSearch = (params: {
  title: string;
  source: string;
  hashtag: string;
}) => {
  searchParams.value = params;
  refresh();
};

const deleteProblem = async (id: string) => {
  if (!confirm("Are you sure you want to delete this problem?")) return;

  try {
    await $fetch(`/api/teacher/problems/${id}`, {
      method: "DELETE",
    });
    refresh();
  } catch (error) {
    console.error("Failed to delete problem:", error);
    alert("Failed to delete problem");
  }
};

// Homework Creation Logic
const isHwDrawerOpen = ref(false);
const hwForm = ref({
  classroomId: "",
  subject: "",
  title: "",
  deadline: "",
});
const selectedProblems = ref<any[]>([]);

const addToHw = (problem: any) => {
  if (!selectedProblems.value.find((p) => p.id === problem.id)) {
    selectedProblems.value.push(problem);
  }
};

const removeFromHw = (problemId: string) => {
  selectedProblems.value = selectedProblems.value.filter(
    (p) => p.id !== problemId
  );
};

const createHomework = async () => {
  if (!hwForm.value.classroomId) {
    alert("Please select a classroom");
    return;
  }
  if (selectedProblems.value.length === 0) {
    alert("Please select at least one problem");
    return;
  }

  try {
    await $fetch("/api/teacher/homeworks", {
      method: "POST",
      body: {
        ...hwForm.value,
        problemIds: selectedProblems.value.map((p) => p.id),
      },
    });
    alert("Homework created successfully!");
    isHwDrawerOpen.value = false;
    hwForm.value = {
      classroomId: "",
      subject: "",
      title: "",
      deadline: "",
    };
    selectedProblems.value = [];
  } catch (error) {
    console.error("Failed to create homework:", error);
    alert("Failed to create homework");
  }
};
</script>

<template>
  <div class="drawer drawer-end">
    <input
      id="hw-drawer"
      type="checkbox"
      class="drawer-toggle"
      v-model="isHwDrawerOpen"
    />
    <div class="drawer-content flex flex-col h-[calc(100vh-64px)]">
      <!-- Main Content Area -->
      <div class="flex-1 overflow-y-auto p-4 md:p-6">
        <div class="container mx-auto max-w-7xl">
          <div
            class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
          >
            <h1 class="text-3xl font-bold">Teacher Dashboard</h1>
            <div class="flex gap-2 w-full md:w-auto">
              <label
                for="hw-drawer"
                class="btn flex-1 md:flex-none"
                :class="
                  isHwDrawerOpen ? 'btn-secondary' : 'btn-outline btn-secondary'
                "
              >
                {{ isHwDrawerOpen ? "Close HW Form" : "Create HW" }}
              </label>
              <NuxtLink
                to="/teacher/problems/create"
                class="btn btn-primary flex-1 md:flex-none"
              >
                Create New Problem
              </NuxtLink>
            </div>
          </div>

          <ProblemSearch @search="handleSearch" />

          <div v-if="problems" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="problem in problems"
              :key="problem.id"
              class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div class="card-body">
                <h2 class="card-title text-lg">{{ problem.title }}</h2>
                <div class="flex gap-2 mt-2 flex-wrap">
                  <div
                    class="badge"
                    :class="{
                      'badge-success': problem.difficulty === 'easy',
                      'badge-warning': problem.difficulty === 'medium',
                      'badge-error': problem.difficulty === 'hard',
                    }"
                  >
                    {{ problem.difficulty }}
                  </div>
                  <div v-if="problem.source" class="badge badge-ghost">
                    {{ problem.source }}
                  </div>
                  <div
                    v-for="tag in problem.hashtags"
                    :key="tag"
                    class="badge badge-secondary badge-outline"
                  >
                    #{{ tag }}
                  </div>
                </div>
                <div class="card-actions justify-end mt-4">
                  <button
                    v-if="isHwDrawerOpen"
                    @click="addToHw(problem)"
                    class="btn btn-info btn-sm"
                    :disabled="
                      selectedProblems.find((p) => p.id === problem.id)
                    "
                  >
                    {{
                      selectedProblems.find((p) => p.id === problem.id)
                        ? "Added"
                        : "Add to HW"
                    }}
                  </button>
                  <NuxtLink
                    :to="`/teacher/problems/${problem.id}/edit`"
                    class="btn btn-warning btn-sm"
                  >
                    Edit
                  </NuxtLink>
                  <button
                    @click="deleteProblem(problem.id)"
                    class="btn btn-error btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-10">
            <span class="loading loading-spinner loading-lg"></span>
          </div>

          <div
            v-if="problems && problems.length === 0"
            class="text-center py-10 text-base-content/70"
          >
            No problems found matching your criteria.
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar for HW Creation -->
    <div class="drawer-side z-50">
      <label
        for="hw-drawer"
        aria-label="close sidebar"
        class="drawer-overlay"
      ></label>
      <div
        class="menu p-4 w-80 md:w-96 min-h-full bg-base-200 text-base-content"
      >
        <div class="sticky top-0 bg-base-200 pt-2 pb-4 z-10">
          <h2 class="text-2xl font-bold mb-4">Create Homework</h2>
        </div>

        <div class="form-control w-full mb-4">
          <label class="label">
            <span class="label-text">Classroom</span>
          </label>
          <select
            v-model="hwForm.classroomId"
            class="select select-bordered w-full"
          >
            <option disabled value="">Select a classroom</option>
            <option
              v-for="classroom in classrooms"
              :key="classroom.id"
              :value="classroom.id"
            >
              {{ classroom.name }}
            </option>
          </select>
        </div>
        <div class="form-control w-full mb-4">
          <label class="label">
            <span class="label-text">Subject</span>
          </label>
          <input
            v-model="hwForm.subject"
            type="text"
            placeholder="e.g. Math"
            class="input input-bordered w-full"
          />
        </div>
        <div class="form-control w-full mb-4">
          <label class="label">
            <span class="label-text">Title</span>
          </label>
          <input
            v-model="hwForm.title"
            type="text"
            placeholder="Homework Title"
            class="input input-bordered w-full"
          />
        </div>
        <div class="form-control w-full mb-4">
          <label class="label">
            <span class="label-text">Deadline</span>
          </label>
          <input
            v-model="hwForm.deadline"
            type="datetime-local"
            class="input input-bordered w-full"
          />
        </div>

        <div class="divider">Selected Problems</div>
        <div class="flex flex-col gap-2 mb-4">
          <div
            v-for="(problem, index) in selectedProblems"
            :key="problem.id"
            class="flex justify-between items-center bg-base-100 p-2 rounded shadow"
          >
            <span class="truncate flex-1 mr-2 text-sm"
              >{{ index + 1 }}. {{ problem.title }}</span
            >
            <button
              @click="removeFromHw(problem.id)"
              class="btn btn-ghost btn-xs text-error"
            >
              ✕
            </button>
          </div>
          <div
            v-if="selectedProblems.length === 0"
            class="text-center text-sm opacity-70 py-4"
          >
            No problems selected. <br />
            <span class="text-xs">Click "Add to HW" on the left.</span>
          </div>
        </div>

        <div class="sticky bottom-0 bg-base-200 pt-4 pb-2 mt-auto">
          <button
            @click="createHomework"
            class="btn btn-primary w-full"
            :disabled="!hwForm.classroomId || selectedProblems.length === 0"
          >
            Create Homework
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
