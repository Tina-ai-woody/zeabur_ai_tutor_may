import { authClient } from "../../lib/auth-client";

export default defineNuxtRouteMiddleware(async (to) => {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: useRequestHeaders(),
    },
  });

  const userRole = session?.user?.role;

  if (session) {
    console.log("Full User Object:", session.user);
    console.log("User Role:", userRole);
  }

  // Pending user routes
  if (userRole === "user") {
    if (to.path !== "/pending" && to.path !== "/") {
      return navigateTo("/pending");
    }
  }

  // Prevent other roles from accessing pending page
  if (to.path === "/pending" && userRole !== "user") {
    if (userRole === "admin") return navigateTo("/admin/dashboard");
    if (userRole === "teacher") return navigateTo("/teacher/dashboard");
    if (userRole === "student") return navigateTo("/student/dashboard");
    return navigateTo("/");
  }

  // Admin routes
  if (to.path.startsWith("/admin")) {
    console.log(userRole);
    if (userRole !== "admin") {
      return navigateTo("/unauthorized");
    }
  }

  // Teacher routes
  if (to.path.startsWith("/teacher")) {
    if (userRole !== "teacher" && userRole !== "admin") {
      return navigateTo("/unauthorized");
    }
  }

  // Student routes
  if (to.path.startsWith("/student")) {
    if (userRole !== "student" && userRole !== "admin") {
      return navigateTo("/unauthorized");
    }
  }
});
