const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Super simple credentials
    const email = 'test@test.com';
    const username = 'test';
    const password = 'test';
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('Creating test user...');
    console.log('Email: test@test.com');
    console.log('Username: test');
    console.log('Password: test');
    
    // Delete existing users
    await prisma.user.deleteMany({
      where: {
        OR: [
          { email: 'test@test.com' },
          { email: 'admin@foodies.com' },
          { email: 'admin' },
          { username: 'test' },
          { username: 'Admin' },
          { username: 'admin' }
        ]
      }
    });
    
    // Create new test user
    const user = await prisma.user.create({
      data: {
        email: 'test@test.com',
        username: 'test',
        password: hashedPassword,
        fullName: 'Usuario de Prueba',
        isActive: true,
        emailVerified: true,
        phoneVerified: false,
        preferences: {}
      }
    });
    
    console.log('\n✅ Test user created successfully!');
    console.log('User ID:', user.id);
    console.log('\n📱 CREDENCIALES PARA LA APP:');
    console.log('   Email: test@test.com');
    console.log('   Password: test');
    console.log('\n   (O simplemente: test / test)');
    
    // Test the password
    const isValid = await bcrypt.compare(password, user.password);
    console.log('\n🔐 Password verification:', isValid ? '✅ PASS' : '❌ FAIL');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
