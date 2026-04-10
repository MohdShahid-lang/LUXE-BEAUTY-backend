const toId = (value) => (value == null ? value : value.toString());

const serializeCategory = (categoryDoc) => {
  if (!categoryDoc) return null;

  return {
    id: toId(categoryDoc._id),
    name: categoryDoc.name,
    createdAt: categoryDoc.createdAt,
    updatedAt: categoryDoc.updatedAt
  };
};

const serializeProduct = (productDoc) => {
  if (!productDoc) return null;

  const category =
    productDoc.categoryId && typeof productDoc.categoryId === 'object' && productDoc.categoryId.name
      ? serializeCategory(productDoc.categoryId)
      : null;

  return {
    id: toId(productDoc._id),
    name: productDoc.name,
    description: productDoc.description,
    price: productDoc.price,
    stock: productDoc.stock ?? 0,
    viewCount: productDoc.viewCount ?? 0,
    imageUrl: productDoc.imageUrl,
    categoryId: category ? category.id : toId(productDoc.categoryId),
    category,
    createdAt: productDoc.createdAt,
    updatedAt: productDoc.updatedAt
  };
};

const serializeOrder = (orderDoc) => ({
  id: toId(orderDoc._id),
  userId: toId(orderDoc.userId),
  totalAmount: orderDoc.totalAmount,
  status: orderDoc.status,
  items: (orderDoc.items || []).map((item) => {
    const populatedProduct =
      item.productId && typeof item.productId === 'object' && item.productId.name
        ? serializeProduct(item.productId)
        : null;

    return {
      id: toId(item._id),
      productId: populatedProduct ? populatedProduct.id : toId(item.productId),
      product: populatedProduct,
      quantity: item.quantity,
      price: item.price
    };
  }),
  createdAt: orderDoc.createdAt,
  updatedAt: orderDoc.updatedAt
});

const serializeUser = (userDoc) => ({
  id: toId(userDoc._id),
  name: userDoc.name,
  email: userDoc.email,
  role: userDoc.role,
  createdAt: userDoc.createdAt,
  updatedAt: userDoc.updatedAt
});

module.exports = {
  toId,
  serializeCategory,
  serializeProduct,
  serializeOrder,
  serializeUser
};
