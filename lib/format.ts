export function formatPrice(price: number) {
  return new Intl.NumberFormat("mn-MN").format(price);
}
