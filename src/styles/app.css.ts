// src/styles/app.css.ts
import { style } from '@vanilla-extract/css';

export const container = style({
  maxWidth: '800px',
  margin: '0 auto',
  padding: '2rem',
  fontFamily: 'system-ui, sans-serif',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
});

export const title = style({
  fontSize: '2rem',
  textAlign: 'center',
  marginBottom: '2rem',
});

export const questionContainer = style({
  backgroundColor: '#f5f5f5',
  padding: '2rem',
  borderRadius: '8px',
  marginBottom: '1rem',
});

export const input = style({
  width: '100%',
  padding: '0.5rem',
  fontSize: '1.2rem',
  marginBottom: '1rem',
});

export const button = style({
  backgroundColor: '#0066cc',
  color: 'white',
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#0052a3',
  },
});

export const rankingContainer = style({
  marginTop: '2rem',
});

export const rankingItem = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr 1fr',
  gap: '1rem',
  padding: '0.5rem',
  borderBottom: '1px solid #ddd',
});

export const resultSummary = style({
  backgroundColor: '#f8f8f8',
  padding: '1.5rem',
  borderRadius: '8px',
  marginBottom: '1.5rem',
  fontSize: '1.2rem',
  lineHeight: '1.8',
});

export const noteText = style({
  fontSize: '0.9rem',
  color: '#666',
  marginTop: '1rem',
  fontStyle: 'italic',
});