import { prisma } from "../../lib/prisma";
import { comparePassword, hashPassword } from "../../utils/hash";
import { generateToken } from "../../utils/jwt";

export async function register(data: {
  email: string;
  password: string;
  restaurantName: string;
}) {
  const { email, password, restaurantName } = data;

  return await prisma.$transaction(async (tx) => {
    const existingUser = await tx.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email ya existe");
    }

    const passwordHash = await hashPassword(password);

    const user = await tx.user.create({
      data: {
        email,
        passwordHash,
      },
    });

    const restaurant = await tx.restaurant.create({
      data: {
        name: restaurantName,
        ownerId: user.id,
      },
    });

    await tx.restaurantUser.create({
      data: {
        userId: user.id,
        restaurantId: restaurant.id,
        role: "ADMIN",
      },
    });

    const token = generateToken({
      userId: user.id,
      restaurantId: restaurant.id,
      role: "ADMIN",
    });

    return {
      userId: user.id,
      restaurantId: restaurant.id,
      token,
    };
  });
}

export async function login(data: {
  email: string;
  password: string;
}) {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      restaurants: true,
    },
  });

  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  const isValid = await comparePassword(password, user.passwordHash);

  if (!isValid) {
    throw new Error("Credenciales inválidas");
  }

  const relation = user.restaurants[0];

  if (!relation) {
    throw new Error("Usuario sin restaurante");
  }

  const token = generateToken({
    userId: user.id,
    restaurantId: relation.restaurantId,
    role: relation.role,
  });

  return { token };
}
export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      restaurants: {
        include: {
          restaurant: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  return {
    userId: user.id,
    restaurants: user.restaurants.map((r) => ({
      id: r.restaurant.id,
      name: r.restaurant.name,
      role: r.role,
    })),
  };
}