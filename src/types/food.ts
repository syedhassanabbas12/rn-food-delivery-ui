export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisineType: string;
  rating: number;
  deliveryTime: string;
  minimumOrder: string;
  image: string;
  categories: string[];
  menuItems: MenuItem[];
}
