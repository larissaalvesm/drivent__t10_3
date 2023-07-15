import { prisma } from '@/config';
import { Hotel } from '@prisma/client';

async function getHotels(): Promise<Hotel[]> {
    return prisma.hotel.findMany();
}

const hotelsRepository = { getHotels };

export default hotelsRepository;