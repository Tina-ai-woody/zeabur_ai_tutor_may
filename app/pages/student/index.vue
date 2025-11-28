<script setup lang="ts">
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

definePageMeta({
  layout: "student",
});

const { data: events } = await useFetch("/api/student/homework-calendar");

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
  initialView: "dayGridMonth",
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  events: events.value || [],
  editable: false,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Student Dashboard</h1>
    <div class="bg-base-100 p-4 rounded-lg shadow">
      <FullCalendar :options="calendarOptions" class="fc-daisy" />
    </div>
  </div>
</template>

<style>
.fc-daisy {
  --fc-border-color: oklch(var(--b3));
  --fc-button-text-color: oklch(var(--pc));
  --fc-button-bg-color: oklch(var(--p));
  --fc-button-border-color: oklch(var(--p));
  --fc-button-hover-bg-color: oklch(var(--s));
  --fc-button-hover-border-color: oklch(var(--s));
  --fc-button-active-bg-color: oklch(var(--s));
  --fc-button-active-border-color: oklch(var(--s));

  --fc-event-bg-color: oklch(var(--a));
  --fc-event-border-color: oklch(var(--a));
  --fc-event-text-color: oklch(var(--ac));

  --fc-today-bg-color: oklch(var(--b2));
  --fc-page-bg-color: oklch(var(--b1));
  --fc-neutral-bg-color: oklch(var(--b2));
  --fc-list-event-hover-bg-color: oklch(var(--b2));
}

/* Round the buttons to match DaisyUI */
.fc-daisy .fc-button {
  border-radius: var(--rounded-btn, 0.5rem);
  text-transform: uppercase;
  font-weight: bold;
}

/* Remove default shadows/outlines if needed */
.fc-daisy .fc-button:focus {
  box-shadow: none;
}
</style>
