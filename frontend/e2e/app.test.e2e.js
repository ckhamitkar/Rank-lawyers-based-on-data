// Example Detox E2E Test
// This is a scaffold/example for end-to-end testing

describe('Lawyer Ranker App - E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('Complete User Flow', () => {
    it('should display lawyer rankings on launch', async () => {
      // Wait for the app to load
      await waitFor(element(by.id('rankings-screen')))
        .toBeVisible()
        .withTimeout(5000);

      // Verify title is displayed
      await expect(element(by.text('Lawyer Rankings'))).toBeVisible();

      // Verify lawyer cards are displayed
      await expect(element(by.id('lawyer-card-1'))).toBeVisible();
    });

    it('should allow changing configuration and seeing updated rankings', async () => {
      // Step 1: Note the current top lawyer
      await waitFor(element(by.id('rankings-screen')))
        .toBeVisible()
        .withTimeout(5000);

      const initialTopLawyer = element(by.id('lawyer-card-1'));
      await expect(initialTopLawyer).toBeVisible();

      // Step 2: Navigate to config screen (implementation depends on navigation)
      // This is a placeholder - actual implementation would depend on navigation setup
      // await element(by.id('config-tab')).tap();

      // Step 3: Wait for config screen to load
      // await waitFor(element(by.id('config-screen')))
      //   .toBeVisible()
      //   .withTimeout(3000);

      // Step 4: Adjust a weight slider
      // await element(by.id('weight-slider-chambers-rank-slider')).swipe('right', 'slow');

      // Step 5: Save configuration
      // await element(by.id('save-button')).tap();

      // Step 6: Wait for success message
      // await waitFor(element(by.text('Configuration saved successfully!')))
      //   .toBeVisible()
      //   .withTimeout(3000);

      // Step 7: Navigate back to rankings
      // await element(by.id('rankings-tab')).tap();

      // Step 8: Verify rankings have updated
      // await waitFor(element(by.id('rankings-screen')))
      //   .toBeVisible()
      //   .withTimeout(3000);

      // Note: The top lawyer might be different now
    });

    it('should refresh lawyer list on pull-to-refresh', async () => {
      await waitFor(element(by.id('rankings-screen')))
        .toBeVisible()
        .withTimeout(5000);

      // Perform pull-to-refresh gesture
      await element(by.id('lawyers-list')).swipe('down', 'slow', 0.75);

      // Verify list is still visible (reloaded)
      await expect(element(by.id('lawyers-list'))).toBeVisible();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when backend is unavailable', async () => {
      // This test would require mocking network failures
      // Implementation depends on your mocking strategy

      // If backend is down, should show error
      // await expect(element(by.id('error-container'))).toBeVisible();
    });

    it('should handle empty lawyer list gracefully', async () => {
      // If API returns empty list, should show empty state
      // await expect(element(by.id('empty-state'))).toBeVisible();
      // await expect(element(by.text('No lawyers found'))).toBeVisible();
    });
  });

  describe('Config Screen Validation', () => {
    it('should prevent saving invalid configuration', async () => {
      // Navigate to config screen
      // Try to enter invalid values
      // Verify save button behavior or error messages
    });

    it('should preserve configuration between sessions', async () => {
      // Change config, save
      // Restart app
      // Verify config persists
    });
  });

  describe('Performance Tests', () => {
    it('should launch within acceptable time', async () => {
      const startTime = Date.now();
      await device.launchApp();
      await waitFor(element(by.id('rankings-screen')))
        .toBeVisible()
        .withTimeout(5000);
      const endTime = Date.now();

      const launchTime = endTime - startTime;
      expect(launchTime).toBeLessThan(5000); // Should launch within 5 seconds
    });

    it('should scroll through long lawyer list smoothly', async () => {
      await waitFor(element(by.id('rankings-screen')))
        .toBeVisible()
        .withTimeout(5000);

      // Scroll to bottom
      await element(by.id('lawyers-list')).scroll(500, 'down');

      // Verify list is still responsive
      await expect(element(by.id('lawyers-list'))).toBeVisible();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible labels for all interactive elements', async () => {
      await waitFor(element(by.id('rankings-screen')))
        .toBeVisible()
        .withTimeout(5000);

      // Verify important elements have accessibility labels
      // This would be verified through accessibility inspector
    });
  });
});
