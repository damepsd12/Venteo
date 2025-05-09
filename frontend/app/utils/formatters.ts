
// // utils/formatters.ts

// export const formatPrice = (
//   price: number | string | null | undefined,
//   currency: string = 'FCFA',
//   locale: string = 'fr-FR'
// ): string => {
//   // Vérification de la validité du prix
//   if (price == null) {
//     console.error(`Invalid price value: ${price}`);
//     return `N/A ${currency}`;
//   }

//   let numericPrice: number;

//   if (typeof price === 'string') {
//     numericPrice = parseFloat(price);
//   } else {
//     numericPrice = price;
//   }

//   if (isNaN(numericPrice)) {
//     console.error(`Invalid price value: ${price}`);
//     return `N/A ${currency}`;
//   }

//   try {
//     const formatter = new Intl.NumberFormat(locale, {
//       style: 'currency',
//       currency: currency,
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 2,
//     });
//     return formatter.format(numericPrice);
//   } catch (error) {
//     console.error(`Error formatting price ${price} with locale ${locale}:`, error);
//     return `${numericPrice} ${currency}`;
//   }
// };
export function formatPrice(price: number, currency: string = 'XOF', locale: string = 'fr-FR') {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(price);
  } catch (err) {
    console.error(`Error formatting price ${price} with locale ${locale}:`, err);
    return `${price} ${currency}`;
  }
}
