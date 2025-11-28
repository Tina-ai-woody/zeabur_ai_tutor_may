<script setup lang="ts">
definePageMeta({
  layout: "default",
});
</script>

<template>
  <div class="bg-base-200 min-h-screen">
    <!-- Mission Section -->
    <div class="hero bg-base-100 py-20">
      <div class="hero-content text-center">
        <div class="max-w-2xl">
          <h1 class="text-5xl font-bold mb-8">Our Mission</h1>
          <p class="text-xl mb-6">
            At AI Tutor, we believe in empowering students with instant,
            personalized feedback. Our goal is to make learning more efficient
            and engaging by providing immediate homework reviews and actionable
            insights.
          </p>
          <p class="text-xl">
            We also strive to give teachers and parents a clear window into
            student progress, enabling timely support and better educational
            outcomes.
          </p>
        </div>
      </div>
    </div>

    <!-- Team Section -->
    <div class="container mx-auto px-4 py-20">
      <h2 class="text-4xl font-bold text-center mb-16">Meet the Team</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Team Member 1 -->
        <div class="card bg-base-100 shadow-xl">
          <figure class="px-10 pt-10">
            <div class="avatar placeholder">
              <div class="bg-neutral text-neutral-content rounded-full w-24">
                <span class="text-3xl">CW</span>
              </div>
            </div>
          </figure>
          <div class="card-body items-center text-center">
            <h2 class="card-title">Chun-Wei, Hsu</h2>
            <p class="text-sm uppercase tracking-wide">Founder & CEO</p>
            <p class="mt-4">
              Passionate about education technology and AI-driven learning
              solutions.
            </p>
          </div>
        </div>

        <!-- Team Member 2 -->
        <div class="card bg-base-100 shadow-xl">
          <figure class="px-10 pt-10">
            <div class="avatar placeholder">
              <div class="bg-neutral text-neutral-content rounded-full w-24">
                <span class="text-3xl">TC</span>
              </div>
            </div>
          </figure>
          <div class="card-body items-center text-center">
            <h2 class="card-title">Tina Chong</h2>
            <p class="text-sm uppercase tracking-wide">Lead Developer</p>
            <p class="mt-4">
              Expert in full-stack development and building scalable web
              applications.
            </p>
          </div>
        </div>

        <!-- Team Member 3 -->
        <div class="card bg-base-100 shadow-xl">
          <figure class="px-10 pt-10">
            <div class="avatar placeholder">
              <div class="bg-neutral text-neutral-content rounded-full w-24">
                <span class="text-3xl">FY</span>
              </div>
            </div>
          </figure>
          <div class="card-body items-center text-center">
            <h2 class="card-title">Fang-Yu, Hsu</h2>
            <p class="text-sm uppercase tracking-wide">Product Designer</p>
            <p class="mt-4">
              Dedicated to creating intuitive and beautiful user experiences for
              students.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
