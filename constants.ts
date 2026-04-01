import { Destination, Package, Review } from './types';

// API Configuration
// Dynamic API URL: Matches browser hostname for client (cookies work), fixed IP for server (SSR works)
export const API_BASE_URL = typeof window !== 'undefined'
  ? ''
  : 'http://localhost:5000';



export const CATEGORIES = [
  "Adventure", "Honeymoon", "Family", "Wildlife", "Beach", "Mountain", "International"
];


export const DESTINATIONS: any[] = [];

export const DOMESTIC_LOCATIONS = [
  'India', 'Kerala', 'Goa', 'Himachal', 'Himachal Pradesh', 'Rajasthan',
  'Andaman', 'Andaman & Nicobar', 'Kashmir', 'Ladakh', 'Uttarakhand',
  'Manali', 'Shimla', 'Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer',
  'Munnar', 'Alleppey', 'Waynad', 'Coorg', 'Ooty', 'Mysore',
  'Rishikesh', 'Haridwar', 'Nainital', 'Mussoorie', 'Darjeeling', 'Gangtok',
  'Sikkim', 'Meghalaya', 'North East', 'Golden Triangle', 'Agra', 'Delhi',
  'Varanasi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata',
  'Pune', 'Ahmedabad', 'Gujarat', 'Rann of Kutch', 'Lakshadweep', 'Srinagar',
  'Gulmarg', 'Pahalgam', 'Leh', 'Nubra Valley', 'Pangong Lake', 'Spiti Valley',
  'Kasol', 'Dharamshala', 'Dalhousie', 'Amritsar', 'Punjab', 'Chandigarh',
  'Karnataka', 'Tamil Nadu', 'Maharashtra', 'Madhya Pradesh', 'Odisha',
  'Jhunjhunu', 'Pratapgarh', 'Mandsaur', 'Uttarakhand'
];