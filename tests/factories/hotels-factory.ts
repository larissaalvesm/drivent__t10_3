import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {

  return await prisma.hotel.create({
    data: {
      name: faker.company.companyName(),
      image: faker.image.imageUrl(),
      Rooms: {
        createMany: {
          data: {
            name: faker.random.word(),
            capacity: Number(faker.datatype.number({min:2, max:6}))
          }
        },
      },
    },
  });
}