// app/api/categories/route.ts

import { NextResponse } from 'next/server';

// Filtered categories (removed: Programming, Web Development, Mobile Development, Data Science, Artificial Intelligence, Cloud Computing, Cybersecurity, Politics, Science, Sports, Education, Photography)
const categories = [
  '💻 Technology',
  '🏖️ Lifestyle',
  '🍳 Food and Cooking',
  '✈️ Travel',
  '🏋️‍♂️ Health and Fitness',
  '🧠 Personal Development',
  '💰 Finance',
  '🏢 Business and Entrepreneurship',
  '📈 Marketing',
  '🎨 Design',
  '❓ Other',
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: categories,
  });
}
