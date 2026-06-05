import Home          from "lucide-solid/icons/home";
import Heart         from "lucide-solid/icons/heart";
import ClipboardList from "lucide-solid/icons/clipboard-list";
import User          from "lucide-solid/icons/user";
import Building2     from "lucide-solid/icons/building-2";
import DollarSign    from "lucide-solid/icons/dollar-sign";
import BarChart2     from "lucide-solid/icons/bar-chart-2";
import Settings      from "lucide-solid/icons/settings";
import Users         from "lucide-solid/icons/users";
import Shield        from "lucide-solid/icons/shield";
import FileText      from "lucide-solid/icons/file-text";
import LogOut        from "lucide-solid/icons/log-out";
import Search        from "lucide-solid/icons/search";
import Menu          from "lucide-solid/icons/menu";
import IconX         from "lucide-solid/icons/x";
import Bell          from "lucide-solid/icons/bell";
import Eye           from "lucide-solid/icons/eye";
import EyeOff        from "lucide-solid/icons/eye-off";
import ChevronUp     from "lucide-solid/icons/chevron-up";
import ChevronDown   from "lucide-solid/icons/chevron-down";
import ChevronLeft   from "lucide-solid/icons/chevron-left";
import ChevronRight  from "lucide-solid/icons/chevron-right";
import Star          from "lucide-solid/icons/star";
import MapPin        from "lucide-solid/icons/map-pin";
import Upload        from "lucide-solid/icons/upload";
import Check         from "lucide-solid/icons/check";
import AlertCircle   from "lucide-solid/icons/alert-circle";
import Copy          from "lucide-solid/icons/copy";
import Instagram     from "lucide-solid/icons/instagram";
import Mail          from "lucide-solid/icons/mail";
import Loader        from "lucide-solid/icons/loader";
import Plus          from "lucide-solid/icons/plus";
import ArrowRight    from "lucide-solid/icons/arrow-right";
import CheckCircle   from "lucide-solid/icons/check-circle";
import Calendar      from "lucide-solid/icons/calendar";
import CreditCard    from "lucide-solid/icons/credit-card";
import Clock         from "lucide-solid/icons/clock";
import Wifi          from "lucide-solid/icons/wifi";
import Zap           from "lucide-solid/icons/zap";
import Flame         from "lucide-solid/icons/flame";
import Bath          from "lucide-solid/icons/bath";
import Wind          from "lucide-solid/icons/wind";
import Car           from "lucide-solid/icons/car";
import Bike          from "lucide-solid/icons/bike";
import Camera        from "lucide-solid/icons/camera";
import Fingerprint   from "lucide-solid/icons/fingerprint";
import Monitor       from "lucide-solid/icons/monitor";
import Tv            from "lucide-solid/icons/tv";
import UtensilsCrossed from "lucide-solid/icons/utensils-crossed";
import WashingMachine  from "lucide-solid/icons/washing-machine";
import Archive       from "lucide-solid/icons/archive";
import BedDouble     from "lucide-solid/icons/bed-double";
import Droplets      from "lucide-solid/icons/droplets";
import House         from "lucide-solid/icons/house";
import TriangleAlert from "lucide-solid/icons/triangle-alert";

const X = IconX;

export const ICON_MAP = {
  Home, Heart, ClipboardList, User, Building2, DollarSign,
  BarChart2, Settings, Users, Shield, FileText, LogOut,
  Search, Menu, X, Bell, Eye, EyeOff, ChevronUp,
  ChevronDown, ChevronLeft, ChevronRight, Star, MapPin,
  Upload, Check, AlertCircle, Copy, Instagram, Mail,
  Loader, Plus, ArrowRight, CheckCircle, Calendar,
  CreditCard, Clock, Wifi, Zap, Flame, Bath, Wind,
  Car, Bike, Camera, Fingerprint, Monitor, Tv,
  UtensilsCrossed, WashingMachine, Archive, BedDouble,
  Droplets, House, TriangleAlert,
} as const;

export type IconName = keyof typeof ICON_MAP;

export {
  Home, Heart, ClipboardList, User, Building2, DollarSign,
  BarChart2, Settings, Users, Shield, FileText, LogOut,
  Search, Menu, X, Bell, Eye, EyeOff, ChevronUp,
  ChevronDown, ChevronLeft, ChevronRight, Star, MapPin,
  Upload, Check, AlertCircle, Copy, Instagram, Mail,
  Loader, Plus, ArrowRight, CheckCircle, Calendar,
  CreditCard, Clock, Wifi, Zap, Flame, Bath, Wind,
  Car, Bike, Camera, Fingerprint, Monitor, Tv,
  UtensilsCrossed, WashingMachine, Archive, BedDouble,
  Droplets, House, TriangleAlert,
};
