import React from 'react';

/**
 * withAdvancedDesigner
 *
 * HOC to inject the session-level Interactive Context to any Template Layout.
 * Ensures the layout is standardized and ready for Design Engine interaction.
 */
export const withAdvancedDesigner = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: P) => {
    // This HOC can also be used to inject additional designer-only components
    // like live rulers, guides, or multi-select overlays if needed in the future.
    return (
      <Component {...props} />
    );
  };
};
