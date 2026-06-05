export type Role = "user" | "tenant" | "admin";
export type KostType = "kost" | "guest_house" | "apartment" | "kontrakan";
export type GenderType = "male" | "female" | "mixed" | "campus";
export type RoomStatus = "available" | "occupied" | "maintenance";
export type BookingStatus = "pending" | "active" | "ended" | "cancelled";
export type PaymentStatus = "pending" | "approved" | "rejected";
export type NotifType = "payment" | "booking" | "review" | "system";

export interface AuthUser {
  id:        string;
  name:      string;
  email:     string;
  role:      Role;
  avatarUrl: string | null;
  phone:     string | null;
}

export interface Facility {
  id:       string;
  name:     string;
  icon:     string;
  category: string;
}

export interface KostProperty {
  id:          string;
  tenantId:    string;
  name:        string;
  slug:        string;
  description: string | null;
  address:     string;
  city:        string;
  district:    string;
  latitude:    number | null;
  longitude:   number | null;
  kostType:    KostType;
  genderType:  GenderType;
  rules:       string | null;
  isActive:    boolean;
  createdAt:   Date;
}

export interface Room {
  id:            string;
  propertyId:    string;
  roomNumber:    string;
  type:          string;
  pricePerMonth: number;
  depositAmount: number;
  size:          string | null;
  floorNumber:   number | null;
  status:        RoomStatus;
  viewCount:     number;
  avgRating:     number;
  createdAt:     Date;
}

export interface RecommendedRoom {
  id:             string;
  propertyId:     string;
  propertySlug:   string;
  name:           string;
  slug:           string;
  roomNumber:     string;
  roomType:       string;
  description:    string | null;
  address:        string;
  city:           string;
  district:       string;
  kostType:       KostType;
  genderType:     GenderType;
  pricePerMonth:  number;
  depositAmount:  number;
  size:           string | null;
  status:         RoomStatus;
  minPrice:       number;
  maxPrice:       number;
  availableCount: number;
  totalCount:     number;
  viewCount:      number;
  avgRating:      number;
  thumbnail:      string | null;
  facilities:     Facility[];
  score:          number;
  createdAt:      Date;
}

export interface PropertyDetail {
  id:          string;
  name:        string;
  slug:        string;
  description: string | null;
  address:     string;
  city:        string;
  district:    string;
  postalCode:  string | null;
  latitude:    string | null;
  longitude:   string | null;
  kostType:    KostType;
  genderType:  GenderType;
  rules:       string | null;
  isActive:    boolean;
  createdAt:   Date;
  rooms:       RoomDetail[];
  images:      PropertyImage[];
  facilities:  FacilityItem[];
}

export interface RoomDetail {
  id:            string;
  roomNumber:    string;
  type:          string;
  pricePerMonth: number;
  depositAmount: number;
  size:          string | null;
  floorNumber:   number | null;
  status:        RoomStatus;
  avgRating:     number;
}

export interface PropertyImage {
  id:        string;
  url:       string;
  altText:   string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface FacilityItem {
  id:   string;
  name: string;
  icon: string;
  category: string;
}

export interface RoomDetailFull {
  id:           string;
  propertyId:   string;
  propertyName: string;
  propertySlug: string;
  address:      string;
  city:         string;
  district:     string;
  kostType:     KostType;
  genderType:   GenderType;
  rules:        string | null;
  roomNumber:   string;
  roomType:     string;
  description:  string | null;
  pricePerMonth: number;
  depositAmount: number;
  size:         string | null;
  floorNumber:  number | null;
  status:       RoomStatus;
  avgRating:    number;
  viewCount:    number;
  images:       PropertyImage[];
  facilities:   FacilityItem[];
}

export interface SearchParams {
  q?:         string;
  type?:      KostType | "";
  gender?:    GenderType | "";
  city?:      string;
  minPrice?:  number;
  maxPrice?:  number;
  facilities?: string[];
  page?:      number;
  perPage?:   number;
  sort?:      "recommended" | "price_asc" | "price_desc" | "newest";
}

export interface PaginatedResult<T> {
  data:       T[];
  total:      number;
  page:       number;
  perPage:    number;
  totalPages: number;
}

export interface Notification {
  id:        string;
  type:      NotifType;
  title:     string;
  body:      string;
  isRead:    boolean;
  relatedId: string | null;
  createdAt: Date;
}

export interface BookingSummary {
  id:            string;
  propertyName:  string;
  roomNumber:    string;
  startDate:     Date;
  endDate:       Date | null;
  totalAmount:   number;
  status:        BookingStatus;
  paymentStatus: PaymentStatus | null;
  createdAt:     Date;
}

export interface SearchPreviewItem {
  id:         string;
  name:       string;
  slug:       string;
  address:    string;
  minPrice:   number;
  kostType:   KostType;
  genderType: GenderType;
  thumbnail:  string | null;
}

export interface DashboardStats {
  totalRooms:     number;
  availableRooms: number;
  occupiedRooms:  number;
  pendingPayments: number;
}

export interface AdminStats {
  totalUsers:     number;
  activeTenants:  number;
  totalRooms:     number;
  pendingTenants: number;
}
