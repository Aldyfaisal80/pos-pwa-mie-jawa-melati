import { UtensilsCrossed, Coffee, Package } from "lucide-react";

interface CategoryStyle {
  color: string;
  Icon: typeof UtensilsCrossed;
}

export const getCategoryStyle = (categoryName: string): CategoryStyle => {
  const cat = categoryName.toLowerCase();
  if (cat.includes("makan"))
    return { color: "bg-orange-50 text-orange-500", Icon: UtensilsCrossed };
  if (cat.includes("minum"))
    return { color: "bg-blue-50 text-blue-500", Icon: Coffee };
  return { color: "bg-purple-50 text-purple-500", Icon: Package };
};
