import React from 'react';
import { render } from '@testing-library/react-native';
import LawyerCard from '../components/LawyerCard';

describe('LawyerCard', () => {
  const mockLawyer = {
    Name: 'John Doe',
    score: 45.5,
    'Chambers Rank': 5,
    'Years PE': 10,
    'LinkedIn Presence': 8,
  };

  it('renders correctly', () => {
    const { getByText } = render(<LawyerCard lawyer={mockLawyer} rank={1} />);
    
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Score: 45.50')).toBeTruthy();
    expect(getByText('#1')).toBeTruthy();
  });

  it('displays the correct rank', () => {
    const { getByText } = render(<LawyerCard lawyer={mockLawyer} rank={5} />);
    
    expect(getByText('#5')).toBeTruthy();
  });

  it('displays lawyer metrics', () => {
    const { getByText } = render(<LawyerCard lawyer={mockLawyer} rank={1} />);
    
    expect(getByText(/Chambers Rank:/)).toBeTruthy();
    expect(getByText(/Years PE:/)).toBeTruthy();
    expect(getByText(/LinkedIn Presence:/)).toBeTruthy();
  });

  it('handles missing score gracefully', () => {
    const lawyerWithoutScore = { Name: 'Jane Smith' };
    const { getByText } = render(<LawyerCard lawyer={lawyerWithoutScore} rank={1} />);
    
    expect(getByText('Jane Smith')).toBeTruthy();
    expect(getByText('Score: NaN')).toBeTruthy();
  });

  it('has correct testID', () => {
    const { getByTestId } = render(<LawyerCard lawyer={mockLawyer} rank={3} />);
    
    expect(getByTestId('lawyer-card-3')).toBeTruthy();
  });
});
