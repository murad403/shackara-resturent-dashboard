export interface Image {
  id: string;
  url: string;
  bytes: string;
  height: number;
  width: number;
  mimeType: string;
  metadata: {
    originalName: string;
  };
  type: string;
}

export interface Category {
  id?: number;
  name: string;
}

export interface SubCategory {
  id?: number;
  name: string;
}

export interface ItemExtra {
  id?: string;
  name: string;
  price: string | number;
}

export interface SizeVariant {
  id?: string;
  size: string;
  price: string | number;
}

export interface SideOption {
  id?: string;
  name: string;
  price: string | number;
  isDefault: boolean;
}

export interface Location {
  id: string;
  remarks: string;
  latitude: number;
  longitude: number;
  addressLine1: string;
  addressLine2: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  note: string;
  updatedAt: string;
  userId: number;
}

export interface Restaurant {
  name: string;
  profilePicture: string | null;
  location: Location;
  rating: string;
  ratingCount: number;
  publicEmail: string | null;
  publicPhone: string | null;
}

export interface Food {
  id: number;
  restaurantId: number;
  slug: string;
  name: string;
  description: string;
  price: string;
  oldPrice?: string;
  isAvailable: boolean;
  quantity: number;
  calories?: number;
  prepTime?: number;
  rating?: string;
  ratingCount?: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  categoryId?: number;
  subCategoryId?: number;
  hasVariants?: boolean;
  hasSides?: boolean;
  hasExtras?: boolean;
  images: Image[];
  category?: Category;
  subCategory?: SubCategory;
  itemExtras?: ItemExtra[];
  sizeVariants?: SizeVariant[];
  sideOptions?: SideOption[];
  restaurant?: Restaurant;
}

export interface PaginatedResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  pagination: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
  data: T;
}

export interface GenericResponse<T = null> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}
