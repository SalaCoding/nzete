import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load . env from parent directory (backend root)
dotenv.config({ path: path. resolve(__dirname, '../.env') });

// Import model after dotenv loads
import QA from '../models/Sambole.js';

// Debug: Check if MONGO_URI exists
console.log('🔍 Checking environment.. .');
console.log('   MONGO_URI:', process.env.MONGO_URI ?  '✅ Found' : '❌ Not found');

if (!process.env.MONGO_URI) {
  console.error('');
  console.error('❌ MONGO_URI is missing from .env file');
  console. error('');
  console.error('Add this to your backend/.env file:');
  console.error('MONGO_URI=mongodb://localhost:3001/mosisa');
  console.error('');
  process. exit(1);
}

const qaData = [
  { 
    question: 'Sambole? ', 
    answer: 'Zoma',
    suggestions: ['Zomba', 'Zombo', 'Zoma'],
    category: 'lisano', 
    difficulty: 'easy' 
  },
  { 
    question: 'Ayina?', 
    answer: 'Sanza', 
    suggestions: ['Sanza', 'Moyi', 'Mapata'],
    category: 'lisano', 
    difficulty: 'easy' 
  },
  { 
    question: 'Kende boye na kende boye, tokutana?', 
    answer: 'Mokamba|Kamba',
    suggestions: ['Mokamba', 'Kamba', 'Singa'],
    category: 'lisano', 
    difficulty: 'medium' 
  },
  { 
    question: 'Muasi kitoko kasi makolo milayi? ', 
    answer: 'Mbula',
    suggestions: ['Mbula', 'Mokili', 'Likolo'],
    category: 'lisano', 
    difficulty: 'medium' 
  },
  { 
    question: 'Tata atongi ndaku, nani akotaka moto ya liboso?', 
    answer: 'Fumba|Fourmi',
    suggestions: ['Fumba', 'Muselekete', 'Nioka'],
    category: 'lisano', 
    difficulty: 'medium' 
  },
  { 
    question: 'Tata atongi ndaku, ekuke likolo?', 
    answer: 'Mulangi|Molangi',
    suggestions: ['Mulangi', 'Libulu', 'Lidusu'],
    category: 'lisano', 
    difficulty: 'medium' 
  },
  { 
    question: 'Nazali kotambola na nzela, nazali komona bazali kopepa ngai?', 
    answer: 'Matiti', 
    suggestions: ['Mayi', 'Matiti', 'Misisa'],
    category: 'lisano', 
    difficulty: 'medium' 
  },
  { 
    question: 'Longola kazaka tobunda?', 
    answer: 'Kwanga', 
    suggestions: ['Kwanga', 'Mbuma', 'Poso'],
    category: 'lisano', 
    difficulty: 'medium' 
  },
  { 
    question: 'Kanga makofi tobunda?', 
    answer: 'Misili',
    suggestions: ['Madesu', 'Misili', 'Bitumba'],
    category: 'lisano', 
    difficulty: 'medium'
  },
  { 
    question: 'Biso to moni ya bango, batu mususu bako mona ya biso?', 
    answer: 'liwa',
    suggestions: ['libala', 'koliya', 'liwa'],
    category: 'lisano', 
    difficulty: 'medium'
  },
  {
    question: 'Ba nzete mibale ekomeli, ekweyi yango moko?',
    answer: 'Mabele',
    suggestions: ['Matama', 'Mabindi', 'Mabele'],
    category: 'lisano', 
    difficulty: 'medium'
  },
  {
    question: 'Mundele awuti poto azo koka lisusu kozonga te? ',
    answer: 'Likasa|Makasa',
    suggestions: ['Nganga', 'Dokotela', 'Mokonzi'],
    category: 'lisano', 
    difficulty: 'medium'
  },
  {
    question: 'Mapinga bakeyi bitumba, bazongi ba ekoti ezali te?',
    answer: 'Milangi',
    suggestions: ['allumettes', 'moto', 'Milangi'],
    category: 'lisano', 
    difficulty: 'medium'
  },
  {
    question: 'Batu ya misala balati pembe pembe kasi mokonzi na alati motane?',
    answer: 'Lolemo|Lilemo|Lilemu',
    suggestions: ['Mbebo', 'Lolemo', 'Tata'],
    category: 'lisano', 
    difficulty: 'medium'
  },
  {
    question: 'Muasi kitoko munoko solo?',
    answer: 'wc|toilette',
    suggestions: ['Liboka', 'wc', 'Nzungu'],
    category: 'lisano', 
    difficulty: 'medium'
  },
  {
    question: 'Mapinga bakoti bitumba?',
    answer: 'Basili',
    suggestions: ['Yo', 'Naye', 'Ngai'],
    category: 'lisano', 
    difficulty: 'medium'
  },
  {
    question: 'Nazali kokende kasi nazali kokoma te?',
    answer: 'Mayi',
    suggestions: ['Mupepe', 'Masuba', 'Mayi'],
    category: 'lisano', 
    difficulty: 'medium'
  },
  {
    question: 'Muasi kitoko kasi lisu moko?',
    answer: 'Tonga',
    suggestions: ['Tonga', 'Ndobo', 'Mbeli'],
    category: 'lisano', 
    difficulty: 'medium'
  },
  {
    question: 'Eloko nini ya yo batu basalelaka yango mingi kasi yo moko osalelaka penza te?',
    answer: 'Kombo',
    suggestions: ['Kombo', 'Munoko', 'Liboko'],
    category: 'lisano', 
    difficulty: 'medium'
  },
  {
    question: 'Lindanda ya mama?',
    answer: 'Nzeta ya fufu',
    suggestions: ['Lidame', 'Mbila', 'Nzete ya fufu'],
    category: 'lisano', 
    difficulty: 'medium'
  },
  {
    question: 'Mundele adindi na mayi mutakala, abimi na mayi na bilamba?',
    answer: 'Mikate',
    suggestions: ['Mikate', 'Manioko', 'Masangu'],
    category: 'lisano', 
    difficulty: 'medium'
  },
  {
    question: 'Cercueil moko batu ebele?',
    answer: 'Allumettes',
    suggestions: ['bakoni', 'Kifunda', 'allumettes'],
    category: 'lisano', 
    difficulty: 'medium'
  },
  {
    question: 'Kiti ya mokonzi bafandelaka te?',
    answer: 'Maki',
    suggestions: ['Mbeli', 'Sani', 'Maki'],
    category: 'lisano', 
    difficulty: 'medium'
  },
  {
    question: 'Kilibi?',
    answer: 'Tufi|Nie|Nye|Nieyi|Nyei',
    suggestions: ['Tufi', 'Kokweya', 'Nye'],
    category: 'lisano', 
    difficulty: 'medium'
  },
  {
    question: 'Nazali kotambola azali kolanda nga?',
    answer: 'Elilingi',
    suggestions: ['Molili', 'Elilingi', 'Muana'],
    category: 'lisano', 
    difficulty: 'medium'
  },
  {
    question: 'Tozali kotambola mibale nazali kopola kasi azali kopola te?',
    answer: 'Zemi',
    suggestions: ['Ndaku', 'Zemi', 'Likasa'],
    category: 'lisano', 
    difficulty: 'medium'
  },
  {
    question: 'Na lamuki na tongo na moni ye atelemi na coin?',
    answer: 'Bipoti',
    suggestions: ['Imbwa', 'Ndeke', 'Bipoti'],
    category: 'lisano', 
    difficulty: 'medium'
  },
  {
    question: 'Arbitre ya nse ya mabelé?',
    answer: 'Likelele',
    suggestions: ['Kondoko', 'Nsoso', 'Likelele'],
    category: 'lisano', 
    difficulty: 'medium'
  },
  {
    question: 'Tata atongi ndaku ba chambre ebele?',
    answer: 'Casier|Kitunga',
    suggestions: ['Casier', 'Kitunga', 'Madusu'],
    category: 'lisano', 
    difficulty: 'medium'
  },
  {
    question: 'Tata azali na Tv (etando ike) ye moko atalaka te kaka bana nde bastalaka yango?',
    answer: 'Dikosi|Likosi|Dikoshi',
    suggestions: ['Dikosi', 'Mukongo', 'Libumu'],
    category: 'lisano', 
    difficulty: 'medium'
  }
];

async function seedQA() {
  try {
    console. log('');
    console.log('🔗 Connecting to MongoDB...');
    
    await mongoose.connect(process.env. MONGO_URI);
    console.log('✅ Connected to MongoDB');
    console.log('');

    let created = 0;
    let updated = 0;

    for (const qa of qaData) {
      // Use upsert to create OR update
      const result = await QA.findOneAndUpdate(
        { question: qa.question }, // Find by question
        { $set: qa },              // Update all fields including suggestions
        { 
          upsert: true,            // Create if not exists
          new: true,               // Return updated doc
          runValidators: true      // Run schema validators
        }
      );
      
      if (result. createdAt. getTime() === result.updatedAt.getTime()) {
        console.log(`✅ Created: "${qa.question}"`);
        created++;
      } else {
        console.log(`🔄 Updated: "${qa. question}"`);
        updated++;
      }
    }

    console.log('');
    console.log('================================');
    console.log('✅ Seeding complete! ');
    console.log(`   Created: ${created}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Total: ${created + updated}`);
    console.log('================================');
    
    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('');
    console.error('❌ Seeding error:', error. message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedQA();