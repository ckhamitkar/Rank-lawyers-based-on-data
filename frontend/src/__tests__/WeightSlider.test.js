import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WeightSlider from '../components/WeightSlider';

describe('WeightSlider', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders correctly with label and value', () => {
    const { getByText } = render(
      <WeightSlider 
        label="Test Metric" 
        value={2.5} 
        onChange={mockOnChange}
        testID="test-slider"
      />
    );
    
    expect(getByText('Test Metric')).toBeTruthy();
    expect(getByText('2.5')).toBeTruthy();
  });

  it('displays value with one decimal place', () => {
    const { getByText } = render(
      <WeightSlider 
        label="Test Metric" 
        value={3.14159} 
        onChange={mockOnChange}
        testID="test-slider"
      />
    );
    
    expect(getByText('3.1')).toBeTruthy();
  });

  it('has correct testID', () => {
    const { getByTestId } = render(
      <WeightSlider 
        label="Test Metric" 
        value={2.5} 
        onChange={mockOnChange}
        testID="test-slider"
      />
    );
    
    expect(getByTestId('test-slider')).toBeTruthy();
  });

  it('renders with zero value', () => {
    const { getByText } = render(
      <WeightSlider 
        label="Test Metric" 
        value={0} 
        onChange={mockOnChange}
        testID="test-slider"
      />
    );
    
    expect(getByText('0.0')).toBeTruthy();
  });

  it('renders with maximum value', () => {
    const { getByText } = render(
      <WeightSlider 
        label="Test Metric" 
        value={5.0} 
        onChange={mockOnChange}
        testID="test-slider"
      />
    );
    
    expect(getByText('5.0')).toBeTruthy();
  });

  it('calls onChange when increase button is pressed', () => {
    const { getByTestId } = render(
      <WeightSlider 
        label="Test Metric" 
        value={2.5} 
        onChange={mockOnChange}
        testID="test-slider"
      />
    );
    
    fireEvent.press(getByTestId('test-slider-increase'));
    expect(mockOnChange).toHaveBeenCalledWith(3.0);
  });

  it('calls onChange when decrease button is pressed', () => {
    const { getByTestId } = render(
      <WeightSlider 
        label="Test Metric" 
        value={2.5} 
        onChange={mockOnChange}
        testID="test-slider"
      />
    );
    
    fireEvent.press(getByTestId('test-slider-decrease'));
    expect(mockOnChange).toHaveBeenCalledWith(2.0);
  });

  it('does not decrease below 0', () => {
    const { getByTestId } = render(
      <WeightSlider 
        label="Test Metric" 
        value={0} 
        onChange={mockOnChange}
        testID="test-slider"
      />
    );
    
    fireEvent.press(getByTestId('test-slider-decrease'));
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('does not increase above 5', () => {
    const { getByTestId } = render(
      <WeightSlider 
        label="Test Metric" 
        value={5.0} 
        onChange={mockOnChange}
        testID="test-slider"
      />
    );
    
    fireEvent.press(getByTestId('test-slider-increase'));
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('has increase and decrease buttons', () => {
    const { getByTestId } = render(
      <WeightSlider 
        label="Test Metric" 
        value={2.5} 
        onChange={mockOnChange}
        testID="test-slider"
      />
    );
    
    expect(getByTestId('test-slider-increase')).toBeTruthy();
    expect(getByTestId('test-slider-decrease')).toBeTruthy();
  });
});
