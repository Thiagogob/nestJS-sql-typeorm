// src/database/seeders/seeder.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Post } from 'src/typeorm/entities/Post';
import { Profile } from 'src/typeorm/entities/Profile';
import { User } from 'src/typeorm/entities/User';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  // Clear existing data
  //await dataSource.getRepository(Post).createQueryBuilder().delete().execute();
  //await dataSource.getRepository(Profile).createQueryBuilder().delete().execute();
  //await dataSource.getRepository(User).createQueryBuilder().delete().execute();

  // Generate and save 10 users with username and password
  const users: User[] = [];
  for (let i = 0; i < 10; i++) {
    const user = new User();
    user.username = faker.internet.username(); // Faker method for username
    user.password = 'password123';
    await dataSource.getRepository(User).save(user);
    users.push(user);
  }

  // Generate a profile for each user with firstName, lastName, age, and dateOfBirth
  const profiles: Profile[] = [];
  for (const user of users) {
    const profile = new Profile();
    
    // Generate a birthdate for an adult (age between 18 and 65)
    const birthDate = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
    const today = new Date();
    
    // Calculate age based on the birthdate
    const age = today.getFullYear() - birthDate.getFullYear();
    
    // Assign fields
    profile.firstName = faker.person.firstName();
    profile.lastName = faker.person.lastName();
    profile.age = age;
    profile.dob = birthDate.toISOString().slice(0, 10); // Format to a string like 'YYYY-MM-DD'

    
    await dataSource.getRepository(Profile).save(profile);
    profiles.push(profile);
  }

  // Generate 5 posts for each user with title and description
  const posts: Post[] = [];
  for (const user of users) {
    for (let i = 0; i < 5; i++) {
      const post = new Post();
      post.title = faker.lorem.sentence();
      post.description = faker.lorem.paragraph(); // Faker method for a paragraph/description
      post.user = user;
      await dataSource.getRepository(Post).save(post);
      posts.push(post);
    }
  }

  console.log('Database seeded successfully! 🌱');
  await app.close();
}

bootstrap().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});