import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ConfigScreen from '../screens/ConfigScreen';
import { lawyerApi } from '../services/api';

// Mock the API
jest.mock('../services/api', () => ({
  lawyerApi: {
    getConfig: jest.fn(),
    updateConfig: jest.fn(),
  },
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('ConfigScreen', () => {
  const mockConfig = {
    'Chambers Rank': 2.0,
    'Years PE': 1.5,
    'LinkedIn Presence': 1.0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Alert.alert.mockClear();
  });

  it('displays loading indicator initially', () => {
    lawyerApi.getConfig.mockImplementation(() => new Promise(() => {}));
    
    const { getByTestId } = render(<ConfigScreen />);
    
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('displays config after loading', async () => {
    lawyerApi.getConfig.mockResolvedValue(mockConfig);
    
    const { getByText, getByTestId } = render(<ConfigScreen />);
    
    await waitFor(() => {
      expect(getByTestId('config-screen')).toBeTruthy();
    });
    
    expect(getByText('Chambers Rank')).toBeTruthy();
    expect(getByText('Years PE')).toBeTruthy();
    expect(getByText('LinkedIn Presence')).toBeTruthy();
  });

  it('displays weight sliders for each config item', async () => {
    lawyerApi.getConfig.mockResolvedValue(mockConfig);
    
    const { getByTestId } = render(<ConfigScreen />);
    
    await waitFor(() => {
      expect(getByTestId('weight-slider-chambers-rank')).toBeTruthy();
      expect(getByTestId('weight-slider-years-pe')).toBeTruthy();
      expect(getByTestId('weight-slider-linkedin-presence')).toBeTruthy();
    });
  });

  it('displays save button', async () => {
    lawyerApi.getConfig.mockResolvedValue(mockConfig);
    
    const { getByTestId } = render(<ConfigScreen />);
    
    await waitFor(() => {
      expect(getByTestId('save-button')).toBeTruthy();
    });
  });

  it('calls updateConfig API when save button is pressed', async () => {
    lawyerApi.getConfig.mockResolvedValue(mockConfig);
    lawyerApi.updateConfig.mockResolvedValue({ message: 'Success' });
    
    const { getByTestId } = render(<ConfigScreen />);
    
    await waitFor(() => {
      expect(getByTestId('save-button')).toBeTruthy();
    });
    
    fireEvent.press(getByTestId('save-button'));
    
    await waitFor(() => {
      expect(lawyerApi.updateConfig).toHaveBeenCalledWith(mockConfig);
    });
  });

  it('shows success alert after successful save', async () => {
    lawyerApi.getConfig.mockResolvedValue(mockConfig);
    lawyerApi.updateConfig.mockResolvedValue({ message: 'Success' });
    
    const { getByTestId } = render(<ConfigScreen />);
    
    await waitFor(() => {
      expect(getByTestId('save-button')).toBeTruthy();
    });
    
    fireEvent.press(getByTestId('save-button'));
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Configuration saved successfully!');
    });
  });

  it('shows error alert on save failure', async () => {
    lawyerApi.getConfig.mockResolvedValue(mockConfig);
    const errorMessage = 'Failed to save config';
    lawyerApi.updateConfig.mockRejectedValue({
      response: { data: { error: errorMessage } },
    });
    
    const { getByTestId } = render(<ConfigScreen />);
    
    await waitFor(() => {
      expect(getByTestId('save-button')).toBeTruthy();
    });
    
    fireEvent.press(getByTestId('save-button'));
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', errorMessage);
    });
  });

  it('calls onConfigSaved callback after successful save', async () => {
    lawyerApi.getConfig.mockResolvedValue(mockConfig);
    lawyerApi.updateConfig.mockResolvedValue({ message: 'Success' });
    const onConfigSaved = jest.fn();
    
    const { getByTestId } = render(<ConfigScreen onConfigSaved={onConfigSaved} />);
    
    await waitFor(() => {
      expect(getByTestId('save-button')).toBeTruthy();
    });
    
    fireEvent.press(getByTestId('save-button'));
    
    await waitFor(() => {
      expect(onConfigSaved).toHaveBeenCalled();
    });
  });

  it('displays error message on config load failure', async () => {
    const errorMessage = 'Failed to load config';
    lawyerApi.getConfig.mockRejectedValue({
      response: { data: { error: errorMessage } },
    });
    
    const { getByTestId, getByText } = render(<ConfigScreen />);
    
    await waitFor(() => {
      expect(getByTestId('error-container')).toBeTruthy();
    });
    
    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('displays description text', async () => {
    lawyerApi.getConfig.mockResolvedValue(mockConfig);
    
    const { getByText } = render(<ConfigScreen />);
    
    await waitFor(() => {
      expect(getByText(/Adjust the weights/)).toBeTruthy();
    });
  });
});
