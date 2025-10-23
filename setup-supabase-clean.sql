CREATE TYPE "UserStatus" AS ENUM ('FREE', 'DEMO', 'PREMIUM');
CREATE TYPE "LessonType" AS ENUM ('VIDEO_COURS', 'QCM', 'CORRECTION_VIDEO', 'CORRECTION_DOCUMENT', 'EXO_ECRIT', 'DS', 'CARTOGRAPHIE', 'METHODE');

CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailsNotification" TEXT[],
    "emailVerified" TIMESTAMP(3),
    "hashedPassword" TEXT,
    "name" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'FREE',
    "isSubscribed" BOOLEAN NOT NULL DEFAULT false,
    "stripeCustomerId" TEXT,
    "subscriptionId" TEXT,
    "currentTitle" TEXT NOT NULL DEFAULT 'Apprenti Mathématicien',
    "totalMasteryPoints" INTEGER NOT NULL DEFAULT 0,
    "monthlyMasteryPoints" INTEGER NOT NULL DEFAULT 0,
    "weeklyMasteryPoints" INTEGER NOT NULL DEFAULT 0,
    "lastMonthlyReset" TIMESTAMP(3),
    "lastWeeklyReset" TIMESTAMP(3),
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastConnectionDate" DATE,
    "totalConnectionTime" INTEGER NOT NULL DEFAULT 0,
    "monthlyConnectionTime" INTEGER NOT NULL DEFAULT 0,
    "weeklyConnectionTime" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isDemoContent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "chapters" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "courseId" TEXT NOT NULL,
    "mentalMapUrl" TEXT,
    "mentalMapTitle" TEXT,
    "mentalMapDescription" TEXT,
    "lyceesRepertoireUrl" TEXT,
    "lyceesRepertoireTitle" TEXT,
    "lyceesRepertoireDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "subchapters" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "chapterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "subchapters_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subChapterId" TEXT NOT NULL,
    "type" "LessonType" NOT NULL,
    "contentUrl" TEXT,
    "isCorrectionVideo" BOOLEAN NOT NULL DEFAULT false,
    "isCorrectionDocument" BOOLEAN NOT NULL DEFAULT false,
    "linkedQcmId" TEXT,
    "linkedExerciseId" TEXT,
    "prerequisiteLessonId" TEXT,
    "parentLessonId" TEXT,
    "countForReporting" BOOLEAN NOT NULL DEFAULT true,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "qcm_questions" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "correctAnswer" INTEGER,
    "correctAnswers" INTEGER[],
    "isMultipleChoice" BOOLEAN NOT NULL DEFAULT false,
    "explanation" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "qcm_questions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "performances" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "videoProgressPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quizScorePercent" DOUBLE PRECISION,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "hasViewedCorrection" BOOLEAN NOT NULL DEFAULT false,
    "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "performances_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "badges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "masteryPointsRequired" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_badges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_badges_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "connection_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "connectionDate" DATE NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "connection_logs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_stripeCustomerId_key" ON "users"("stripeCustomerId");
CREATE UNIQUE INDEX "performances_userId_lessonId_key" ON "performances"("userId", "lessonId");
CREATE UNIQUE INDEX "user_badges_userId_badgeId_key" ON "user_badges"("userId", "badgeId");
CREATE UNIQUE INDEX "connection_logs_userId_connectionDate_key" ON "connection_logs"("userId", "connectionDate");
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");
CREATE INDEX "Lesson_parentLessonId_idx" ON "lessons"("parentLessonId");
CREATE INDEX "Lesson_prerequisiteLessonId_idx" ON "lessons"("prerequisiteLessonId");
CREATE INDEX "Lesson_linkedExerciseId_idx" ON "lessons"("linkedExerciseId");

ALTER TABLE "chapters" ADD CONSTRAINT "chapters_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "subchapters" ADD CONSTRAINT "subchapters_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_subChapterId_fkey" FOREIGN KEY ("subChapterId") REFERENCES "subchapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_linkedQcmId_fkey" FOREIGN KEY ("linkedQcmId") REFERENCES "lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_linkedExerciseId_fkey" FOREIGN KEY ("linkedExerciseId") REFERENCES "lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_prerequisiteLessonId_fkey" FOREIGN KEY ("prerequisiteLessonId") REFERENCES "lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_parentLessonId_fkey" FOREIGN KEY ("parentLessonId") REFERENCES "lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "qcm_questions" ADD CONSTRAINT "qcm_questions_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "performances" ADD CONSTRAINT "performances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "performances" ADD CONSTRAINT "performances_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "connection_logs" ADD CONSTRAINT "connection_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

