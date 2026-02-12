import { encrypt, decrypt } from './src/utils/encryption';
import dotenv from 'dotenv';

dotenv.config();

console.log('--- PII Encryption Utility Verification ---');

const testCases = [
  'Hello World!',
  '123 Main St, Springfield',
  '+1-555-0199',
  'Complex string with symbols: !@#$%^&*()_+',
  '' // Edge case: empty string
];

testCases.forEach((input, index) => {
  console.log(`\nTest Case ${index + 1}: "${input}"`);

  try {
    const encrypted = encrypt(input);
    console.log(`Encrypted: ${encrypted}`);

    if (input && !encrypted.includes(':')) {
      console.error('❌ FAILED: Encrypted format mismatch (should contain colons for IV/Tag)');
    }

    const decrypted = decrypt(encrypted);
    console.log(`Decrypted: "${decrypted}"`);

    if (input === decrypted) {
      console.log('✅ SUCCESS: Decrypted value matches input');
    } else {
      console.error(`❌ FAILED: Decrypted value ("${decrypted}") does not match input`);
    }
  } catch (error) {
    console.error('❌ FAILED: Exception occurred during test:', error);
  }
});

// Test corruption/key failure
console.log('\nTest Case 6: Corruption check');
try {
  const encrypted = encrypt('Secret message');
  const corrupted = encrypted.slice(0, -1) + 'X';
  console.log(`Attempting to decrypt corrupted data: ${corrupted}`);
  decrypt(corrupted);
  console.error('❌ FAILED: Decryption of corrupted data did not throw error');
} catch (error) {
  console.log('✅ SUCCESS: Decryption of corrupted data threw expected error');
}
