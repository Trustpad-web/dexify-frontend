export const formatNumber = (value: number, decimals: number = 2) => {
  if (!value) {
    return 0;
  }
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: decimals }).format(
    value
  );
};

export const formatCurrency = (value: number) => {
  if (!value) {
    return 0;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
};

export const calcChanges = (currentValue: number, beforeValue: number) => {
  if (currentValue === 0 && beforeValue === 0) {
    return 0;
  } else if (beforeValue === 0) {
    return 100;
  } else {
    return ((currentValue - beforeValue) * 100) / beforeValue;
  }
};
