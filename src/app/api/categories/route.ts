// app/api/categories/route.ts

import { NextResponse } from 'next/server';

// Fake DB (You can move this to lib/db.ts if needed)
const categories = [
  '💻 Technology',
  '👨‍💻 Programming',
  '🌐 Web Development',
  '📱 Mobile Development',
  '📊 Data Science',
  '🤖 Artificial Intelligence',
  '☁️ Cloud Computing',
  '🛡️ Cybersecurity',
  '🏖️ Lifestyle',
  '🍳 Food and Cooking',
  '✈️ Travel',
  '🏋️‍♂️ Health and Fitness',
  '🧠 Personal Development',
  '💰 Finance and Development',
  '🏢 Business and Entrepreneurship',
  '📈 Marketing',
  '🎨 Design',
  '🎮 Gaming',
  '📷 Photography',
  '🎬 Entertainment',
  '🎓 Education',
  '🔬 Science',
  '🏛️ Politics',
  '⚽ Sports',
  '❓ Other',
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: categories,
  });
}
