<script setup lang="ts">
const filters = reactive({
  keyword: "",
  subject: "",
  chapter: "",
  source: "",
  hashtag: "",
});

const emit = defineEmits<{
  search: [
    params: {
      title: string;
      subject: string;
      chapter: string;
      source: string;
      hashtag: string;
    }
  ];
}>();

const handleSearch = () => {
  emit("search", {
    title: filters.keyword,
    subject: filters.subject,
    chapter: filters.chapter,
    source: filters.source,
    hashtag: filters.hashtag,
  });
};

const clearFilters = () => {
  filters.keyword = "";
  filters.subject = "";
  filters.chapter = "";
  filters.source = "";
  filters.hashtag = "";
  handleSearch();
};
</script>

<template>
  <div class="card bg-base-100 shadow-xl mb-6">
    <div class="card-body">
      <h2 class="card-title text-2xl mb-6">Search Materials</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <!-- Keyword Search -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Name</span>
          </label>
          <div class="relative">
            <input
              v-model="filters.keyword"
              type="text"
              placeholder="Search by name..."
              class="input input-bordered w-full pl-10"
              @keyup.enter="handleSearch"
            />
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Icon
                name="heroicons:magnifying-glass"
                class="w-5 h-5 text-gray-400"
              />
            </div>
          </div>
        </div>

        <!-- Subject Filter -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Subject</span>
          </label>
          <input
            v-model="filters.subject"
            type="text"
            placeholder="e.g. Math"
            class="input input-bordered w-full"
            @keyup.enter="handleSearch"
          />
        </div>

        <!-- Chapter Filter -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Chapter</span>
          </label>
          <input
            v-model="filters.chapter"
            type="text"
            placeholder="e.g. Unit 1"
            class="input input-bordered w-full"
            @keyup.enter="handleSearch"
          />
        </div>

        <!-- Source Filter -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Source</span>
          </label>
          <input
            v-model="filters.source"
            type="text"
            placeholder="e.g. Pearson"
            class="input input-bordered w-full"
            @keyup.enter="handleSearch"
          />
        </div>

        <!-- Hashtag Filter -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Hashtag</span>
          </label>
          <div class="relative">
            <input
              v-model="filters.hashtag"
              type="text"
              placeholder="Tag..."
              class="input input-bordered w-full pl-10"
              @keyup.enter="handleSearch"
            />
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Icon name="heroicons:tag" class="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div class="card-actions justify-end mt-6 gap-3">
        <button class="btn btn-ghost" @click="clearFilters">
          <Icon name="heroicons:x-mark" class="w-5 h-5 mr-2" />
          Clear
        </button>
        <button class="btn btn-primary" @click="handleSearch">
          <Icon name="heroicons:funnel" class="w-5 h-5 mr-2" />
          Search
        </button>
      </div>
    </div>
  </div>
</template>
