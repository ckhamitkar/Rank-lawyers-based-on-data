import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';
import RankingsScreen from '../screens/RankingsScreen';
import { lawyerApi } from '../services/api';

// Mock the API
jest.mock('../services/api', () => ({
  lawyerApi: {
    getLawyers: jest.fn(),
  },
}));

describe('RankingsScreen', () => {
  const mockLawyers = [
    { Name: 'Alice Smith', score: 45.5, 'Chambers Rank': 5 },
    { Name: 'Bob Jones', score: 42.0, 'Years PE': 10 },
    { Name: 'Carol White', score: 38.5, 'LinkedIn Presence': 8 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading indicator initially', () => {
    lawyerApi.getLawyers.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    const { getByTestId } = render(<RankingsScreen />);
    
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('displays lawyers after loading', async () => {
    lawyerApi.getLawyers.mockResolvedValue(mockLawyers);
    
    const { getByText, getByTestId } = render(<RankingsScreen />);
    
    await waitFor(() => {
      expect(getByTestId('rankings-screen')).toBeTruthy();
    });
    
    expect(getByText('Alice Smith')).toBeTruthy();
    expect(getByText('Bob Jones')).toBeTruthy();
    expect(getByText('Carol White')).toBeTruthy();
  });

  it('displays lawyers in correct rank order', async () => {
    lawyerApi.getLawyers.mockResolvedValue(mockLawyers);
    
    const { getByTestId } = render(<RankingsScreen />);
    
    await waitFor(() => {
      expect(getByTestId('lawyer-card-1')).toBeTruthy();
    });
    
    expect(getByTestId('lawyer-card-1')).toBeTruthy();
    expect(getByTestId('lawyer-card-2')).toBeTruthy();
    expect(getByTestId('lawyer-card-3')).toBeTruthy();
  });

  it('displays error message on API failure', async () => {
    const errorMessage = 'Failed to load lawyers';
    lawyerApi.getLawyers.mockRejectedValue({
      response: { data: { error: errorMessage } },
    });
    
    const { getByTestId, getByText } = render(<RankingsScreen />);
    
    await waitFor(() => {
      expect(getByTestId('error-container')).toBeTruthy();
    });
    
    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('displays empty state when no lawyers returned', async () => {
    lawyerApi.getLawyers.mockResolvedValue([]);
    
    const { getByTestId, getByText } = render(<RankingsScreen />);
    
    await waitFor(() => {
      expect(getByTestId('empty-state')).toBeTruthy();
    });
    
    expect(getByText('No lawyers found')).toBeTruthy();
  });

  it('calls API on mount', async () => {
    lawyerApi.getLawyers.mockResolvedValue(mockLawyers);
    
    render(<RankingsScreen />);
    
    await waitFor(() => {
      expect(lawyerApi.getLawyers).toHaveBeenCalledTimes(1);
    });
  });

  it('handles network errors gracefully', async () => {
    lawyerApi.getLawyers.mockRejectedValue(new Error('Network error'));
    
    const { getByTestId } = render(<RankingsScreen />);
    
    await waitFor(() => {
      expect(getByTestId('error-container')).toBeTruthy();
    });
  });
});
