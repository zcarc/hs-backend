import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

async function main() {
  // await prismaClient.user.create({
  //   data: {
  //     email: 'test@example.com',
  //     name: '테스트1',
  //     password: 'hashed_password',
  //   },
  // });

  const postsData = Array.from({ length: 10 }).map(() => ({
    title: faker.lorem.sentence(), // 제목처럼 보이는 랜덤 문장
    content: faker.lorem.paragraphs(2), // 두 개의 문단으로 된 본문
    published: faker.datatype.boolean(), // true/false 랜덤
  }));

  await prismaClient.post.createMany({
    data: postsData,
  });
}

main()
  .catch((e) => {
    console.error(`seed error: ${e}`);
    process.exit(1);
  })
  .finally(() => {
    prismaClient.$disconnect().catch((e) => {
      console.error(`disconnect error: ${e}`);
    });
  });
