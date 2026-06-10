import React from 'react';

export type ThemeColor = 'green' | 'gold' | 'red' | 'blue' | 'black' | 'white' | 'purple' | 'lightBlue';

export interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  themeColor: ThemeColor;
  gradientClass: string;
  textColor?: string; 
  bgColor: string; 
  category: string;
  description?: string;
  bgImage?: string;
}

export interface CurrencyRates {
  USD: number;
  BRL: number;
  ZAR: number;
  lastUpdated: number;
}

export type CurrencyCode = 'USD' | 'BRL' | 'ZAR';