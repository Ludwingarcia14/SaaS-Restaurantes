import { prisma } from "../../lib/prisma";

export async function createProduct(data: any, restaurantId: string) {
  return prisma.product.create({
    data: {
      name: data.name,
      price: data.price,
      stock: data.stock,
      restaurantId,
    },
  });
}
export async function updateProduct(
  productId: string,
  data: any,
  restaurantId: string
) {
  return prisma.product.updateMany({
    where: {
      id: productId,
      restaurantId,
    },
    data: {
      name: data.name,
      price: data.price,
      stock: data.stock,
    },
  });
}

export async function deleteProduct(
  productId: string,
  restaurantId: string
) {
  return prisma.product.deleteMany({
    where: {
      id: productId,
      restaurantId,
    },
  });
}
export async function getProducts(restaurantId: string) {
  return prisma.product.findMany({
    where: {
      restaurantId,
    },
    
  });
  
}