const { prisma } = require('../prisma/prisma-client');

async function main() {
  const defaultUrl = process.env.CLOUDINARY_DEFAULT_AVATAR_URL;
  if (!defaultUrl) {
    console.error('CLOUDINARY_DEFAULT_AVATAR_URL is not set');
    process.exit(1);
  }

  const users = await prisma.user.findMany({
    where: { avatarUrl: { contains: 'uploads/' } },
  });

  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: defaultUrl },
    });
    console.log(`Updated user ${user.id}`);
  }

  console.log(`Updated ${users.length} users`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

