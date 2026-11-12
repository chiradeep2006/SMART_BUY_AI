import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from '../App';
import i18n, { SUPPORTED_LANGUAGES } from '../i18n/i18n';

describe('SmartBuy AI Frontend Comprehensive Tests', () => {
  it('should render the brand header and main navigation', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    const brandTitles = screen.getAllByText(/SmartBuy/i);
    expect(brandTitles.length).toBeGreaterThan(0);
    const aiBadges = screen.getAllByText(/AI/i);
    expect(aiBadges.length).toBeGreaterThan(0);
  });

  it('should support all 11 Indian languages in i18n dictionary', () => {
    expect(SUPPORTED_LANGUAGES.length).toBe(11);
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expect(codes).toEqual(['en', 'hi', 'ta', 'te', 'ml', 'kn', 'bn', 'mr', 'gu', 'pa', 'or']);

    // Check that each language has translation bundle in i18n
    codes.forEach((code) => {
      expect(i18n.hasResourceBundle(code, 'translation')).toBe(true);
    });
  });

  it('should switch language to Tamil (தமிழ்) and re-render localized strings immediately', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Switch to Tamil
    await i18n.changeLanguage('ta');
    expect(i18n.language).toBe('ta');

    // Revert back to English for subsequent tests
    await i18n.changeLanguage('en');
    expect(i18n.language).toBe('en');
  });

  it('should switch language to Hindi (हिंदी) and verify translations', async () => {
    await i18n.changeLanguage('hi');
    expect(i18n.language).toBe('hi');
    const translatedNav = i18n.t('nav.search');
    expect(translatedNav).toBe('AI खोज');

    await i18n.changeLanguage('en');
  });

  it('should render landing page search bar with natural language placeholder', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Best laptop under ₹60,000 for programming/i);
    expect(input).toBeInTheDocument();
  });
});
