import { UtensilsCrossed, Coffee, Package } from "lucide-react";

export const getCategoryIcon = (categoryName: string) => {
  const cat = categoryName.toLowerCase();
  if (cat.includes("makan"))
    return <UtensilsCrossed className="h-4 w-4 text-orange-500" />;
  if (cat.includes("minum"))
    return <Coffee className="h-4 w-4 text-blue-500" />;
  return <Package className="h-4 w-4 text-gray-500" />;
};
