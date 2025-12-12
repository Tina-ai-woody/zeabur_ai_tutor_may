CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_history" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"title" text,
	"messages" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_materials" (
	"id" text PRIMARY KEY NOT NULL,
	"teacher_id" text NOT NULL,
	"name" text NOT NULL,
	"path" text NOT NULL,
	"url" text,
	"type" text,
	"size" integer,
	"subject" text,
	"chapter" text,
	"source" text,
	"hashtags" jsonb DEFAULT '[]'::jsonb,
	"is_folder" boolean DEFAULT false NOT NULL,
	"parent_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classroom_materials" (
	"id" text PRIMARY KEY NOT NULL,
	"classroom_id" text NOT NULL,
	"material_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classroom_students" (
	"id" text PRIMARY KEY NOT NULL,
	"classroom_id" text NOT NULL,
	"student_id" text NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classrooms" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"teacher_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "error_problems" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"problem_id" text NOT NULL,
	"understood" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"problem_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "homework_classrooms" (
	"id" text PRIMARY KEY NOT NULL,
	"homework_id" text NOT NULL,
	"classroom_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "homework_completions" (
	"id" text PRIMARY KEY NOT NULL,
	"homework_id" text NOT NULL,
	"classroom_id" text NOT NULL,
	"user_id" text NOT NULL,
	"completed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "homework_problems" (
	"id" text PRIMARY KEY NOT NULL,
	"homework_id" text NOT NULL,
	"problem_id" text NOT NULL,
	"order" text
);
--> statement-breakpoint
CREATE TABLE "homeworks" (
	"id" text PRIMARY KEY NOT NULL,
	"classroom_id" text,
	"teacher_id" text NOT NULL,
	"subject" text,
	"title" text,
	"deadline" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hw_records" (
	"id" text PRIMARY KEY NOT NULL,
	"homework_id" text NOT NULL,
	"classroom_id" text NOT NULL,
	"user_id" text NOT NULL,
	"problem_id" text NOT NULL,
	"user_answer" text,
	"correctness" boolean NOT NULL,
	"submitted" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parent_students" (
	"id" text PRIMARY KEY NOT NULL,
	"parent_id" text NOT NULL,
	"student_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pending_parent" (
	"id" text PRIMARY KEY NOT NULL,
	"parent_id" text NOT NULL,
	"student_name" text NOT NULL,
	"student_email" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personal_events" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"start" timestamp NOT NULL,
	"end" timestamp,
	"all_day" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" text PRIMARY KEY NOT NULL,
	"classroom_id" text NOT NULL,
	"teacher_id" text NOT NULL,
	"content" text,
	"class_date" text,
	"class_start_time" timestamp,
	"class_end_time" timestamp,
	"class_length" interval,
	"attendees" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts_template" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"classroom_id" text NOT NULL,
	"template" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "problems" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"choices" jsonb NOT NULL,
	"correct_answer" text NOT NULL,
	"explanation" text,
	"difficulty" text,
	"source" text,
	"image_url" text,
	"hashtags" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "problems_status" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"problem_id" text NOT NULL,
	"is_favorite" boolean DEFAULT false NOT NULL,
	"is_wrong" boolean DEFAULT false NOT NULL,
	"understood" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"problem_id" text NOT NULL,
	"user_answer" text NOT NULL,
	"is_correct" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"last_login" timestamp,
	"role" text,
	"banned" boolean,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_history" ADD CONSTRAINT "chat_history_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_materials" ADD CONSTRAINT "class_materials_teacher_id_user_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_materials" ADD CONSTRAINT "class_materials_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."class_materials"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom_materials" ADD CONSTRAINT "classroom_materials_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom_materials" ADD CONSTRAINT "classroom_materials_material_id_class_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."class_materials"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom_students" ADD CONSTRAINT "classroom_students_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom_students" ADD CONSTRAINT "classroom_students_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_teacher_id_user_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "error_problems" ADD CONSTRAINT "error_problems_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "error_problems" ADD CONSTRAINT "error_problems_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homework_classrooms" ADD CONSTRAINT "homework_classrooms_homework_id_homeworks_id_fk" FOREIGN KEY ("homework_id") REFERENCES "public"."homeworks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homework_classrooms" ADD CONSTRAINT "homework_classrooms_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homework_completions" ADD CONSTRAINT "homework_completions_homework_id_homeworks_id_fk" FOREIGN KEY ("homework_id") REFERENCES "public"."homeworks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homework_completions" ADD CONSTRAINT "homework_completions_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homework_completions" ADD CONSTRAINT "homework_completions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homework_problems" ADD CONSTRAINT "homework_problems_homework_id_homeworks_id_fk" FOREIGN KEY ("homework_id") REFERENCES "public"."homeworks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homework_problems" ADD CONSTRAINT "homework_problems_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homeworks" ADD CONSTRAINT "homeworks_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homeworks" ADD CONSTRAINT "homeworks_teacher_id_user_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hw_records" ADD CONSTRAINT "hw_records_homework_id_homeworks_id_fk" FOREIGN KEY ("homework_id") REFERENCES "public"."homeworks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hw_records" ADD CONSTRAINT "hw_records_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hw_records" ADD CONSTRAINT "hw_records_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hw_records" ADD CONSTRAINT "hw_records_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parent_students" ADD CONSTRAINT "parent_students_parent_id_user_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parent_students" ADD CONSTRAINT "parent_students_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pending_parent" ADD CONSTRAINT "pending_parent_parent_id_user_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_events" ADD CONSTRAINT "personal_events_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_teacher_id_user_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts_template" ADD CONSTRAINT "posts_template_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts_template" ADD CONSTRAINT "posts_template_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problems_status" ADD CONSTRAINT "problems_status_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problems_status" ADD CONSTRAINT "problems_status_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_requests" ADD CONSTRAINT "role_requests_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "posts_template_user_classroom_unique" ON "posts_template" USING btree ("user_id","classroom_id");--> statement-breakpoint
CREATE UNIQUE INDEX "problems_status_user_problem_unique" ON "problems_status" USING btree ("user_id","problem_id");