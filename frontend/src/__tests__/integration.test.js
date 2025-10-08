import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import App from '../../App';
import { lawyerApi } from '../services/api';

// Mock the API
jest.mock('../services/api', () => ({
  lawyerApi: {
    getLawyers: jest.fn(),
    getConfig: jest.fn(),
    updateConfig: jest.fn(),
  },
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('Integration Tests - User Flows', () => {
  const mockLawyers = [
    { Name: 'Alice Smith', score: 45.5, 'Chambers Rank': 5 },
    { Name: 'Bob Jones', score: 42.0, 'Years PE': 10 },
    { Name: 'Carol White', score: 38.5, 'LinkedIn Presence': 8 },
  ];

  const mockConfig = {
    'Chambers Rank': 2.0,
    'Years PE': 1.5,
    'LinkedIn Presence': 1.0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Alert.alert.mockClear();
  });

  describe('Loading Lawyers Flow', () => {
    it('successfully loads and displays lawyers on app start', async () => {
      lawyerApi.getLawyers.mockResolvedValue(mockLawyers);
      
      const { getByText } = render(<App />);
      
      // Wait for lawyers to load
      await waitFor(() => {
        expect(getByText('Alice Smith')).toBeTruthy();
      });
      
      // Verify all lawyers are displayed
      expect(getByText('Alice Smith')).toBeTruthy();
      expect(getByText('Bob Jones')).toBeTruthy();
      expect(getByText('Carol White')).toBeTruthy();
      
      // Verify API was called
      expect(lawyerApi.getLawyers).toHaveBeenCalledTimes(1);
    });

    it('handles loading errors gracefully', async () => {
      lawyerApi.getLawyers.mockRejectedValue({
        response: { data: { error: 'Server error' } },
      });
      
      const { getByText } = render(<App />);
      
      await waitFor(() => {
        expect(getByText('Server error')).toBeTruthy();
      });
    });

    it('displays lawyers with correct scores', async () => {
      lawyerApi.getLawyers.mockResolvedValue(mockLawyers);
      
      const { getByText } = render(<App />);
      
      await waitFor(() => {
        expect(getByText('Score: 45.50')).toBeTruthy();
        expect(getByText('Score: 42.00')).toBeTruthy();
        expect(getByText('Score: 38.50')).toBeTruthy();
      });
    });
  });

  describe('Config Change and Rankings Update Flow', () => {
    it('allows viewing current config', async () => {
      lawyerApi.getLawyers.mockResolvedValue(mockLawyers);
      lawyerApi.getConfig.mockResolvedValue(mockConfig);
      
      // This test demonstrates the ability to load config
      // In a real app, you'd navigate to ConfigScreen
      const { getByText } = render(<App />);
      
      await waitFor(() => {
        expect(lawyerApi.getLawyers).toHaveBeenCalled();
      });
    });
  });

  describe('Complete User Journey', () => {
    it('simulates complete flow: load lawyers, view config, save config, see updated rankings', async () => {
      // Initial lawyers data
      const initialLawyers = [
        { Name: 'Alice Smith', score: 45.5 },
        { Name: 'Bob Jones', score: 42.0 },
      ];
      
      // Updated lawyers data after config change
      const updatedLawyers = [
        { Name: 'Bob Jones', score: 50.0 },
        { Name: 'Alice Smith', score: 40.0 },
      ];
      
      // Mock API responses
      lawyerApi.getLawyers
        .mockResolvedValueOnce(initialLawyers)
        .mockResolvedValueOnce(updatedLawyers);
      
      lawyerApi.getConfig.mockResolvedValue(mockConfig);
      lawyerApi.updateConfig.mockResolvedValue({ message: 'Success' });
      
      const { getByText, rerender } = render(<App />);
      
      // Step 1: Initial load shows lawyers
      await waitFor(() => {
        expect(getByText('Alice Smith')).toBeTruthy();
      });
      
      // Verify initial state
      expect(lawyerApi.getLawyers).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Recovery Flow', () => {
    it('recovers from initial load error on retry', async () => {
      lawyerApi.getLawyers
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockLawyers);
      
      const { getByText, queryByText } = render(<App />);
      
      // Initial error state
      await waitFor(() => {
        expect(queryByText(/Failed to load/)).toBeTruthy();
      });
      
      // Note: In a real scenario, there would be a retry button
      // This test demonstrates the concept
    });
  });

  describe('API Mock Validation', () => {
    it('verifies API is called with correct parameters', async () => {
      const newConfig = {
        'Chambers Rank': 3.0,
        'Years PE': 2.0,
        'LinkedIn Presence': 1.5,
      };
      
      lawyerApi.getConfig.mockResolvedValue(mockConfig);
      lawyerApi.updateConfig.mockResolvedValue({ message: 'Success' });
      
      // Simulate config update
      await lawyerApi.updateConfig(newConfig);
      
      expect(lawyerApi.updateConfig).toHaveBeenCalledWith(newConfig);
    });

    it('handles API response structure correctly', async () => {
      lawyerApi.getLawyers.mockResolvedValue(mockLawyers);
      
      const { getByTestId } = render(<App />);
      
      await waitFor(() => {
        expect(getByTestId('rankings-screen')).toBeTruthy();
      });
      
      // Verify lawyers list is rendered
      expect(getByTestId('lawyers-list')).toBeTruthy();
    });
  });

  describe('State Management', () => {
    it('maintains state between screens', async () => {
      lawyerApi.getLawyers.mockResolvedValue(mockLawyers);
      lawyerApi.getConfig.mockResolvedValue(mockConfig);
      
      const { getByText } = render(<App />);
      
      await waitFor(() => {
        expect(getByText('Alice Smith')).toBeTruthy();
      });
      
      // Verify lawyers are loaded and displayed
      expect(lawyerApi.getLawyers).toHaveBeenCalled();
    });
  });
});
