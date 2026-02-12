import { ProfileService } from './src/services/profile.service';
import { prisma } from './src/lib/prisma';
import dotenv from 'dotenv';

dotenv.config();

const profileService = new ProfileService();

async function verifyProfileService() {
  console.log('--- ProfileService Verification ---');

  // Find a test user (or use a placeholder)
  const users = await prisma.user.findMany({ take: 1 });
  if (users.length === 0) {
    console.error('No users found in database. Please run migrations/seed first.');
    return;
  }
  const testUser = users[0];
  console.log(`Using test user: ${testUser.id} (${testUser.role})`);

  try {
    // 1. Initial State
    console.log('\nTesting getProfile (initial/null):');
    const initialProfile = await profileService.getProfile(testUser.id);
    console.log('Profile:', initialProfile);

    // 2. Partial Update
    console.log('\nTesting upsertProfile (Partial - Step 1):');
    const step1Data = {
      full_name: 'Test User',
      phone: '+1-555-000-111',
      address: '123 Test Lane',
      residence_type: 'Apartment'
    };
    await profileService.upsertProfile(testUser.id, step1Data as any);
    const profileAfterStep1 = await profileService.getProfile(testUser.id);
    console.log('Completion:', profileAfterStep1?.meta);
    if (profileAfterStep1?.phone === step1Data.phone) {
      console.log('✅ PII Decryption working in service response');
    } else {
      console.error('❌ FAILED: Decryption mismatch');
    }

    // 3. Completing the profile
    console.log('\nTesting Full Profile Completion:');
    const fullData = {
      ownership_status: 'OWN',
      outdoor_area: 'Fenced',
      resident_count: 2,
      existing_pets: 'One cat'
    };

    // We also need 2 photos to reach 100% per logic
    await prisma.adopterHomePhoto.createMany({
      data: [
        { adopter_id: testUser.id, photo_url: 'http://example.com/p1.jpg' },
        { adopter_id: testUser.id, photo_url: 'http://example.com/p2.jpg' }
      ]
    });

    await profileService.upsertProfile(testUser.id, fullData as any);

    console.log('\nTesting addHomePhoto:');
    const newPhoto = await profileService.addHomePhoto(testUser.id, 'http://example.com/test-manual.jpg', 'Manual test');
    console.log('Added photo:', newPhoto);

    let finalProfile = await profileService.getProfile(testUser.id);
    console.log('Final Meta:', finalProfile?.meta);
    console.log('Final Status:', finalProfile?.status);

    console.log('\nTesting deleteHomePhoto:');
    await profileService.deleteHomePhoto(testUser.id, newPhoto.id);
    console.log('Photo deleted');

    finalProfile = await profileService.getProfile(testUser.id);
    console.log('Meta after delete:', finalProfile?.meta);

    if (finalProfile?.meta.is_complete && finalProfile?.status === 'COMPLETED') {
      console.log('✅ SUCCESS: Profile marked as COMPLETED correctly');
    } else {
      console.error('❌ FAILED: Completeness logic error');
    }

  } catch (error: any) {
    console.error('❌ Error during verification:');
    if (error.message) console.error(error.message);
    if (error.code) console.error(`Code: ${error.code}`);
    if (error.meta) console.error('Meta:', JSON.stringify(error.meta, null, 2));
  }
}

verifyProfileService();
