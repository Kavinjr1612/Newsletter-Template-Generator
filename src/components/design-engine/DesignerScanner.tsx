import React from 'react';
import { ContentBlockSlot } from './ContentBlockSlot';

interface DesignerScannerProps {
  pageNumber: number;
  children: React.ReactNode;
}

/**
 * DesignerScanner
 *
 * Recursively walks React children looking for 'data-section-key'.
 * When found, it wraps that element with a <ContentBlockSlot />.
 */
export const DesignerScanner = ({ pageNumber, children }: DesignerScannerProps): JSX.Element => {
  const scan = (node: React.ReactNode): React.ReactNode => {
    return React.Children.map(node, (child) => {
      if (!React.isValidElement(child)) return child;

      const props = child.props as any;
      const sectionKey = props['data-section-key'];

      if (sectionKey) {
        // Extract design-specific props from data attributes
        const useNativeLayout = props['data-use-native-layout'] === 'true' || props['data-use-native-layout'] === true;
        const defaultZ = props['data-default-z'] ? parseInt(props['data-default-z'], 10) : undefined;
        
        // Remove the data attributes from the cloned element to keep the DOM clean
        const cleanProps = { ...props };
        delete cleanProps['data-section-key'];
        delete cleanProps['data-use-native-layout'];
        delete cleanProps['data-default-z'];

        return (
          <ContentBlockSlot
            key={`${sectionKey}-${pageNumber}`}
            pageNumber={pageNumber}
            sectionKey={sectionKey}
            useNativeLayout={useNativeLayout}
            defaultZ={defaultZ}
          >
            {React.cloneElement(child as React.ReactElement<any>, cleanProps)}
          </ContentBlockSlot>
        );
      }

      // If this child has its own children, scan them too (unless it's a function child like a Render Prop)
      if (props.children && typeof props.children !== 'function') {
        try {
          return React.cloneElement(child as React.ReactElement<any>, {
            children: scan(props.children),
          });
        } catch (e) {
          // If cloning fails (e.g. for some third party components), return original
          return child;
        }
      }

      return child;
    });
  };

  return <>{scan(children)}</>;
};
