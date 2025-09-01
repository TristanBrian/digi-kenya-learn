-- Insert demo school data for Smart School Portal
INSERT INTO public.schools (
  id,
  name,
  location,
  phone,
  email,
  address,
  website,
  emergency_phone,
  founded_year,
  paybill_number
) VALUES (
  '123e4567-e89b-12d3-a456-426614174000',
  'Greenfield Primary School',
  'Karen, Nairobi',
  '+254712345678',
  'info@greenfieldprimary.ac.ke',
  'Greenfield Road, Karen, Nairobi, Kenya',
  'www.greenfieldprimary.ac.ke',
  '+254787654321',
  2008,
  '522533'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  location = EXCLUDED.location,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  emergency_phone = EXCLUDED.emergency_phone,
  founded_year = EXCLUDED.founded_year,
  paybill_number = EXCLUDED.paybill_number;

-- Insert demo news/events
INSERT INTO public.news_events (
  id,
  school_id,
  title,
  content,
  excerpt,
  type,
  published,
  event_date,
  event_location
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  '123e4567-e89b-12d3-a456-426614174000',
  'Term 1 2025 Opening Day',
  'We are excited to welcome all students back for Term 1 2025. Classes begin on Monday, January 15th at 7:30 AM. Please ensure your child arrives with all required materials and uniforms.',
  'Term 1 2025 begins Monday, January 15th. Welcome back to all students!',
  'announcement',
  true,
  '2025-01-15 07:30:00+03',
  'Main Campus'
),
(
  '22222222-2222-2222-2222-222222222222',
  '123e4567-e89b-12d3-a456-426614174000',
  'Grade 6 Science Fair 2025',
  'Our annual Grade 6 Science Fair will showcase innovative projects from our students. Parents and community members are invited to attend and see the amazing work our students have been doing in STEM subjects.',
  'Join us for the Grade 6 Science Fair featuring innovative student projects.',
  'event',
  true,
  '2025-03-20 14:00:00+03',
  'School Hall'
),
(
  '33333333-3333-3333-3333-333333333333',
  '123e4567-e89b-12d3-a456-426614174000',
  'Prize Giving Day 2024',
  'We celebrated our students'' achievements at the annual Prize Giving Day. Over 150 students received awards for academic excellence, character development, and co-curricular activities.',
  'Over 150 students received awards for excellence at Prize Giving Day 2024.',
  'event',
  true,
  '2024-12-15 10:00:00+03',
  'School Grounds'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  excerpt = EXCLUDED.excerpt,
  type = EXCLUDED.type,
  published = EXCLUDED.published,
  event_date = EXCLUDED.event_date,
  event_location = EXCLUDED.event_location;

-- Insert demo gallery images
INSERT INTO public.gallery_images (
  id,
  school_id,
  title,
  caption,
  category,
  image_url,
  featured
) VALUES
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '123e4567-e89b-12d3-a456-426614174000',
  'Grade 3 Reading Circle',
  'Students enjoying interactive reading session in our library - March 2025',
  'classrooms',
  '/api/placeholder/400/300',
  true
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '123e4567-e89b-12d3-a456-426614174000',
  'Sports Day Athletics',
  'Annual sports day with track and field events - December 2024',
  'sports',
  '/api/placeholder/400/300',
  true
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '123e4567-e89b-12d3-a456-426614174000',
  'ICT Lab Session',
  'Computer literacy class in our modern ICT laboratory - February 2025',
  'classrooms',
  '/api/placeholder/400/300',
  false
),
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  '123e4567-e89b-12d3-a456-426614174000',
  'Science Fair Projects',
  'Grade 6 students presenting innovative science projects - November 2024',
  'events',
  '/api/placeholder/400/300',
  false
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  caption = EXCLUDED.caption,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  featured = EXCLUDED.featured;