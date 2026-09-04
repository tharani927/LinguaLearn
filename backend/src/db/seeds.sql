-- ====================================================================
-- LINGUALEARN SEED DATA
-- Default accounts, curriculum, questions, assessments, achievements,
-- sample analytics, and mistake vault items.
-- ====================================================================

-- 1. Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'admin', 'System Administrator with full management & analytics access'),
(2, 'learner', 'Standard Student learner with course access and personal vault')
ON CONFLICT (id) DO NOTHING;

-- 2. Users
-- Default Admin: admin@lingualearn.com / AdminPass123!
-- Default Learner: learner@lingualearn.com / LearnerPass123!
INSERT INTO users (id, email, password_hash, full_name, role_id, is_active) VALUES
(1, 'admin@lingualearn.com', '$2b$10$E3kiIyroyCBZbAjT1EqkJ.e9dD9BcGpNPFaevT9va9su3lGdHpKHS', 'Prof. Victoria Vance (Admin)', 1, true),
(2, 'learner@lingualearn.com', '$2b$10$E3kiIyroyCBZbAjT1EqkJ.6E7ufMtFEb89BFU3ue5S/K369ruJIBO', 'Alex Rivera', 2, true),
(3, 'carlos@example.com', '$2b$10$E3kiIyroyCBZbAjT1EqkJ.6E7ufMtFEb89BFU3ue5S/K369ruJIBO', 'Carlos Mendoza', 2, true),
(4, 'sophie@example.com', '$2b$10$E3kiIyroyCBZbAjT1EqkJ.6E7ufMtFEb89BFU3ue5S/K369ruJIBO', 'Sophie Laurent', 2, true),
(5, 'kenji@example.com', '$2b$10$E3kiIyroyCBZbAjT1EqkJ.6E7ufMtFEb89BFU3ue5S/K369ruJIBO', 'Kenji Sato', 2, true),
(6, 'elena@example.com', '$2b$10$E3kiIyroyCBZbAjT1EqkJ.6E7ufMtFEb89BFU3ue5S/K369ruJIBO', 'Elena Rostova', 2, true)
ON CONFLICT (id) DO NOTHING;

-- Reset sequences
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- 3. User Profiles
INSERT INTO user_profiles (user_id, target_language, proficiency_level, daily_goal_minutes, learning_preferences, theme, appearance, bio) VALUES
(1, 'Spanish', 'Advanced', 30, '{"sound_effects": true, "email_reminders": false}'::jsonb, 'midnight', 'dark', 'Lead curriculum director and system administrator.'),
(2, 'Spanish', 'Beginner', 15, '{"sound_effects": true, "email_reminders": true}'::jsonb, 'ocean', 'light', 'Passionate language enthusiast starting my Spanish journey!'),
(3, 'French', 'Intermediate', 20, '{"sound_effects": false, "email_reminders": true}'::jsonb, 'nature', 'light', 'Preparing for a work assignment in Montreal.'),
(4, 'German', 'Beginner', 15, '{"sound_effects": true, "email_reminders": false}'::jsonb, 'bloom', 'dark', 'Lover of literature and European philosophy.'),
(5, 'Spanish', 'Beginner', 10, '{"sound_effects": true, "email_reminders": false}'::jsonb, 'sunrise', 'light', 'Language enthusiast mastering conversational Spanish.'),
(6, 'Japanese', 'Intermediate', 30, '{"sound_effects": true, "email_reminders": true}'::jsonb, 'midnight', 'dark', 'Studying for JLPT N3.')
ON CONFLICT (user_id) DO NOTHING;

-- 4. Supported Languages
INSERT INTO languages (id, code, name, flag_emoji, is_active) VALUES
(1, 'es', 'Spanish', '🇪🇸', true),
(2, 'fr', 'French', '🇫🇷', true),
(3, 'de', 'German', '🇩🇪', true),
(4, 'ja', 'Japanese', '🇯🇵', true)
ON CONFLICT (id) DO NOTHING;
SELECT setval('languages_id_seq', (SELECT MAX(id) FROM languages));

-- 5. Courses
INSERT INTO courses (id, language_id, title, description, level, thumbnail_url, estimated_hours, created_by, is_published) VALUES
(1, 1, 'Spanish Foundations: Absolute Beginner', 'Master fundamental greetings, essential vocabulary, sentence structures, and everyday conversations in Latin American and Castilian Spanish.', 'Beginner', 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=600&q=80', 6.0, 1, true),
(2, 1, 'Spanish Intermediate: Conversational Mastery', 'Conquer past tenses (Pretérito vs Imperfecto), subjunctive mood fundamentals, and fluent social communication.', 'Intermediate', 'https://images.unsplash.com/photo-1509840841025-9088ba78a826?auto=format&fit=crop&w=600&q=80', 8.5, 1, true),
(3, 2, 'French Essentials: Travel & Culture', 'Learn polite conversational French, Paris travel essentials, food ordering, and basic present tense conjugations.', 'Beginner', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', 5.5, 1, true),
(4, 3, 'German Foundations: Syntax & Precision', 'Grasp the core cases (Nominative and Accusative), compound nouns, and everyday German communication.', 'Beginner', 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=600&q=80', 7.0, 1, true),
(5, 4, 'Japanese Step 1: Hiragana & Greetings', 'Discover Hiragana syllabary, Japanese etiquette, self-introductions, and basic polite sentence particles.', 'Beginner', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80', 6.5, 1, true)
ON CONFLICT (id) DO NOTHING;
SELECT setval('courses_id_seq', (SELECT MAX(id) FROM courses));

-- 6. Lessons for Spanish Foundations (Course 1)
INSERT INTO lessons (id, course_id, title, description, order_index, lesson_type, content, grammar_notes, estimated_minutes) VALUES
(1, 1, 'Greetings, Farewells & Politeness', 'Learn standard Spanish greetings, parting words, and how to introduce yourself respectfully in varied social settings.', 1, 'vocabulary', 
'# Lesson 1: Greetings & Introductions

Welcome to your first Spanish lesson! In Spanish-speaking cultures, acknowledging people warmly is a core social virtue.

### Common Greetings:
- **¡Hola!** — Universal, friendly "Hello!".
- **Buenos días** — "Good morning" (used until afternoon).
- **Buenas tardes** — "Good afternoon" (used from midday until nightfall).
- **Buenas noches** — "Good evening / Good night".

### How are you?
- **¿Cómo estás?** — Informal ("How are you?")
- **¿Cómo está usted?** — Formal ("How are you, sir/madam?")
- **Muy bien, gracias. ¿Y tú?** — Very well, thank you. And you?

### Farewells:
- **Adiós** — Goodbye.
- **Hasta luego** — See you later.
- **Hasta mañana** — See you tomorrow.', 
'Spanish uses inverted punctuation marks (¿ and ¡) at the start of questions and exclamations to prepare the reader for the tone.', 12),

(2, 1, 'The Essential Verbs: Ser vs. Estar', 'Understand the fundamental difference between the two Spanish verbs meaning "to be".', 2, 'grammar',
'# Lesson 2: Ser vs. Estar

One of the most fascinating aspects of Spanish is that English has one verb "to be", but Spanish has two distinct verbs: **Ser** and **Estar**.

### When to use SER (Identity, Origin, Inherent Nature):
Use the acronym **DOCTOR**:
- **D**escription: *Él es alto.* (He is tall.)
- **O**ccupation: *Ella es profesora.* (She is a teacher.)
- **C**haracteristic: *El café es delicioso.* (Coffee is delicious.)
- **T**ime: *Son las tres de la tarde.* (It is 3:00 PM.)
- **O**rigin: *Yo soy de México.* (I am from Mexico.)
- **R**elationship: *Ellos son amigos.* (They are friends.)

### When to use ESTAR (States, Locations, Temporary Conditions):
Use the acronym **PLACE**:
- **P**osition: *El libro está sobre la mesa.* (The book is on the table.)
- **L**ocation: *Madrid está en España.* (Madrid is in Spain.)
- **A**ction: *Estamos aprendiendo español.* (We are learning Spanish.)
- **C**ondition: *Estoy cansado hoy.* (I am tired today.)
- **E**motion: *Ella está muy feliz.* (She is very happy.)',
'Remember: "For how you feel and where you are, always use the verb ESTAR!"', 18),

(3, 1, 'Numbers, Ordering & Dining', 'Learn numbers 1 to 20, how to order food and beverages in a cafe or restaurant, and ask for the bill.', 3, 'mixed',
'# Lesson 3: Dining Out & Numbers

Whether visiting a tapas bar in Seville or a café in Buenos Aires, ordering food is one of the most rewarding language experiences!

### Useful Phrases for Dining:
- **Una mesa para dos, por favor.** — A table for two, please.
- **¿Qué recomienda?** — What do you recommend?
- **Quisiera pedir...** — I would like to order...
- **La cuenta, por favor.** — The check/bill, please.

### Numbers 1-10:
1. Uno
2. Dos
3. Tres
4. Cuatro
5. Cinco
6. Seis
7. Siete
8. Ocho
9. Nueve
10. Diez',
'In Spanish polite ordering, use "Quisiera" (I would like) or "Para mí..." (For me...) rather than direct imperatives.', 15),

(4, 2, 'Past Tense: Pretérito vs. Imperfecto', 'Master the distinction between completed past actions and ongoing/habitual past states.', 1, 'grammar',
'# Lesson 1: Pretérito vs. Imperfecto

Spanish divides the past into two rich perspectives:
- **Pretérito**: Pinpoints completed events with a definite beginning or end (*Ayer comí una manzana* - Yesterday I ate an apple).
- **Imperfecto**: Paints the background setting, habitual routines, age, time, and emotional conditions in the past (*Cuando era niño, jugaba en el parque* - When I was a child, I used to play in the park).',
'Keywords like "ayer" (yesterday) trigger preterite, while "siempre" (always) or "todos los días" (every day) trigger imperfect.', 20)
ON CONFLICT (id) DO NOTHING;
SELECT setval('lessons_id_seq', (SELECT MAX(id) FROM lessons));

-- 7. Vocabulary Items
INSERT INTO vocabulary (id, lesson_id, word, translation, pronunciation, part_of_speech, example_sentence, example_translation) VALUES
(1, 1, '¡Hola!', 'Hello!', 'OH-lah', 'Interjection', '¡Hola! ¿Cómo estás?', 'Hello! How are you?'),
(2, 1, 'Buenos días', 'Good morning', 'BWEH-nos DEE-ahs', 'Phrase', 'Buenos días a todos.', 'Good morning everyone.'),
(3, 1, 'Gracias', 'Thank you', 'GRAH-syahs', 'Interjection', 'Muchas gracias por su ayuda.', 'Thank you very much for your help.'),
(4, 1, 'Por favor', 'Please', 'por fah-VOR', 'Phrase', 'Un café, por favor.', 'A coffee, please.'),
(5, 1, 'Adiós', 'Goodbye', 'ah-DYOHS', 'Interjection', 'Adiós, hasta mañana.', 'Goodbye, see you tomorrow.'),
(6, 2, 'Ser', 'To be (inherent)', 'sehr', 'Verb', 'Yo soy estudiante.', 'I am a student.'),
(7, 2, 'Estar', 'To be (condition/location)', 'ehs-TAHR', 'Verb', 'Ella está en la biblioteca.', 'She is in the library.'),
(8, 2, 'Feliz', 'Happy', 'feh-LEES', 'Adjective', 'Estamos muy felices de verte.', 'We are very happy to see you.'),
(9, 2, 'Cansado', 'Tired', 'kahn-SAH-doh', 'Adjective', 'Hoy estoy un poco cansado.', 'Today I am a little tired.'),
(10, 3, 'La cuenta', 'The bill / check', 'lah KWEHN-tah', 'Noun', '¿Nos trae la cuenta, por favor?', 'Can you bring us the bill, please?'),
(11, 3, 'El agua', 'Water', 'ehl AH-gwah', 'Noun', 'Quiero un vaso de agua fresca.', 'I want a glass of fresh water.'),
(12, 3, 'Delicioso', 'Delicious', 'deh-lee-SYOH-soh', 'Adjective', 'Este plato tradicional es delicioso.', 'This traditional dish is delicious.')
ON CONFLICT (id) DO NOTHING;
SELECT setval('vocabulary_id_seq', (SELECT MAX(id) FROM vocabulary));

-- 8. Question Bank
INSERT INTO questions (id, course_id, lesson_id, question_type, skill_category, prompt, options, correct_answer, explanation, difficulty_level) VALUES
(1, 1, 1, 'multiple_choice', 'vocabulary', 'How do you say "Good morning" in Spanish?', 
'["Buenas tardes", "Buenos días", "Buenas noches", "Hasta luego"]'::jsonb, 
'Buenos días', '"Buenos días" is the standard greeting used in the morning until midday.', 'easy'),

(2, 1, 1, 'true_false', 'comprehension', 'In Spanish, "Adiós" is used to greet someone when you arrive.', 
'["True", "False"]'::jsonb, 
'False', '"Adiós" means goodbye and is exclusively used upon departure.', 'easy'),

(3, 1, 1, 'fill_blank', 'sentence_formation', 'Complete the polite phrase: "Muchas _____, amigo."', 
null, 
'gracias', '"Muchas gracias" means "Thank you very much".', 'easy'),

(4, 1, 2, 'multiple_choice', 'grammar', 'Which verb form correctly completes: "Madrid _____ en España."', 
'["es", "está", "somos", "son"]'::jsonb, 
'está', 'Geographic locations always take the verb ESTAR (Madrid está en España).', 'medium'),

(5, 1, 2, 'multiple_choice', 'grammar', 'Which sentence expresses an inherent profession or identity?', 
'["Juan está cansado", "Juan es médico", "Juan está en casa", "Juan está triste"]'::jsonb, 
'Juan es médico', 'Professions express core identity and take the verb SER (es médico).', 'medium'),

(6, 1, 2, 'true_false', 'grammar', 'Emotions such as happiness or tiredness use the verb SER.', 
'["True", "False"]'::jsonb, 
'False', 'Temporary emotions and physical states use ESTAR (e.g., Estoy feliz, Estoy cansado).', 'easy'),

(7, 1, 3, 'multiple_choice', 'vocabulary', 'When you are finished dining, how do you ask for the bill?', 
'["El menú, por favor", "La cuenta, por favor", "El agua, por favor", "La mesa, por favor"]'::jsonb, 
'La cuenta, por favor', '"La cuenta, por favor" translates directly to "The bill/check, please".', 'easy'),

(8, 1, 3, 'fill_blank', 'sentence_formation', 'What is the Spanish word for the number "Five"?', 
null, 
'cinco', 'The number 5 in Spanish is spelled "cinco".', 'easy'),

(9, 1, 2, 'multiple_choice', 'reading', 'Read the passage: "Elena es estudiante. Hoy está enferma y no puede ir a clase." Why is Elena not in class?', 
'["She is busy studying", "She is sick today", "She moved to another city", "She graduated"]'::jsonb, 
'She is sick today', 'The passage says "Hoy está enferma" which means "Today she is sick".', 'medium'),

(10, 1, 2, 'multiple_choice', 'grammar', 'Choose the correct conjugation: "Nosotros _____ muy contentos de aprender español."', 
'["somos", "estamos", "es", "están"]'::jsonb, 
'estamos', 'For "nosotros" expressing an emotional state, use "estamos".', 'medium')
ON CONFLICT (id) DO NOTHING;
SELECT setval('questions_id_seq', (SELECT MAX(id) FROM questions));

-- 9. Assessments
INSERT INTO assessments (id, course_id, lesson_id, title, description, passing_score, time_limit_minutes, is_active) VALUES
(1, 1, 1, 'Spanish Beginner Assessment: Greetings & Politeness', 'Validate your knowledge of core Spanish greetings, polite phrases, and basic conversation starters.', 70, 10, true),
(2, 1, 2, 'Grammar Mastery Assessment: Ser vs. Estar', 'Challenge yourself on the critical distinction between Ser and Estar across diverse scenarios.', 75, 15, true),
(3, 1, 3, 'Everyday Spanish Assessment: Dining & Numbers', 'Test your practical skills in restaurant scenarios, numerical fluency, and customer interactions.', 70, 12, true)
ON CONFLICT (id) DO NOTHING;
SELECT setval('assessments_id_seq', (SELECT MAX(id) FROM assessments));

-- 10. Map Questions to Assessments
INSERT INTO assessment_questions (assessment_id, question_id, points, order_index) VALUES
(1, 1, 30, 1),
(1, 2, 30, 2),
(1, 3, 40, 3),
(2, 4, 20, 1),
(2, 5, 20, 2),
(2, 6, 20, 3),
(2, 9, 20, 4),
(2, 10, 20, 5),
(3, 7, 50, 1),
(3, 8, 50, 2)
ON CONFLICT (assessment_id, question_id) DO NOTHING;

-- 11. Achievements
INSERT INTO achievements (id, code, title, description, icon, points_reward, criteria_type, criteria_value) VALUES
(1, 'FIRST_STEP', 'First Step', 'Complete your very first language lesson on LinguaLearn.', 'compass', 50, 'first_lesson', 1),
(2, 'SEVEN_DAY_STREAK', '7-Day Streak', 'Keep your continuous daily learning streak alive for 7 days.', 'flame', 150, 'streak_days', 7),
(3, 'PERFECT_SCORE', 'Perfect Score', 'Score 100% on any lesson assessment.', 'star', 100, 'perfect_score', 1),
(4, 'BOOKWORM', 'Bookworm', 'Complete 5 reading or vocabulary focused lessons.', 'book-open', 100, 'vocab_count', 5),
(5, 'QUICK_LEARNER', 'Quick Learner', 'Complete an assessment in under 5 minutes with a passing score.', 'zap', 75, 'speed_pass', 1),
(6, 'COMEBACK', 'Comeback', 'Practice and master 3 mistake items from your Mistake Vault.', 'refresh-cw', 120, 'vault_mastery', 3)
ON CONFLICT (id) DO NOTHING;
SELECT setval('achievements_id_seq', (SELECT MAX(id) FROM achievements));

-- 12. Enrollments
INSERT INTO course_enrollments (user_id, course_id, enrolled_at, status) VALUES
(2, 1, CURRENT_TIMESTAMP - INTERVAL '5 days', 'in_progress'),
(3, 3, CURRENT_TIMESTAMP - INTERVAL '8 days', 'in_progress'),
(4, 4, CURRENT_TIMESTAMP - INTERVAL '12 days', 'in_progress'),
(5, 1, CURRENT_TIMESTAMP - INTERVAL '20 days', 'in_progress'),
(6, 5, CURRENT_TIMESTAMP - INTERVAL '3 days', 'in_progress')
ON CONFLICT (user_id, course_id) DO NOTHING;

-- 13. Learning Streaks
INSERT INTO learning_streaks (user_id, current_streak, longest_streak, last_activity_date) VALUES
(2, 4, 6, CURRENT_DATE),
(3, 7, 12, CURRENT_DATE),
(4, 1, 3, CURRENT_DATE - INTERVAL '2 days'),
(5, 0, 2, CURRENT_DATE - INTERVAL '14 days'),
(6, 5, 5, CURRENT_DATE)
ON CONFLICT (user_id) DO NOTHING;

-- 14. Daily Missions for Learner (User 2)
INSERT INTO daily_missions (user_id, mission_date, lesson_completed, vocab_practiced, assessment_completed, is_rewarded) VALUES
(2, CURRENT_DATE, true, true, false, false)
ON CONFLICT (user_id, mission_date) DO NOTHING;

-- 15. Skill Profiles for Learner (User 2)
INSERT INTO skill_profiles (user_id, skill_category, proficiency_score, assessments_taken) VALUES
(2, 'grammar', 62.50, 2),
(2, 'vocabulary', 85.00, 3),
(2, 'reading', 78.00, 2),
(2, 'sentence_formation', 70.00, 2),
(2, 'comprehension', 90.00, 2)
ON CONFLICT (user_id, skill_category) DO NOTHING;

-- 16. Mistake Vault for Learner (User 2)
INSERT INTO mistake_vault (user_id, question_id, mistake_count, last_wrong_answer, mastered, last_practiced_at) VALUES
(2, 4, 2, 'es', false, CURRENT_TIMESTAMP - INTERVAL '1 day')
ON CONFLICT (user_id, question_id) DO NOTHING;

-- 17. Unlocked Achievements for Learner (User 2)
INSERT INTO user_achievements (user_id, achievement_id, unlocked_at) VALUES
(2, 1, CURRENT_TIMESTAMP - INTERVAL '4 days')
ON CONFLICT (user_id, achievement_id) DO NOTHING;

-- 18. Points Ledger for Learner (User 2)
INSERT INTO points_ledger (user_id, points, reason, reference_id) VALUES
(2, 50, 'Unlocked Achievement: First Step', 'ach_1'),
(2, 20, 'Completed Lesson: Greetings, Farewells & Politeness', 'les_1'),
(2, 30, 'Completed Practice Drill', 'prac_1')
ON CONFLICT DO NOTHING;

-- 19. Initial AI Recommendations for Learner (User 2)
INSERT INTO recommendations (user_id, title, recommendation_type, target_id, reason, is_completed) VALUES
(2, 'Master "Ser vs. Estar" Distinctions', 'practice_mistakes', 4, 'You missed the location rule in Madrid está en España. A quick 3-question drill will solidify this rule.', false),
(2, 'Explore Lesson 3: Dining & Numbers', 'lesson', 3, 'You have demonstrated strong vocabulary fundamentals. Ready for practical dining scenarios!', false)
ON CONFLICT DO NOTHING;
